"""
Rebuilds assets/data/products.json and assets/products/<code>.jpg from a POS
"Item Listing" export (.xlsx) that has Item Code / Image / Description /
Price1 / Price2 / Barcode columns and one embedded photo per item row.

Run whenever the shop exports a fresh item listing:

    py tools/build_products.py "Item Listing-image-barcode.xlsx"

openpyxl's high-level `worksheet._images` list mislabels which embedded photo
belongs to which image object on this file (every entry reports the same
`.path`), so this script reads the drawing XML itself: each photo is anchored
to the same 0-based row as its item's data row, and the anchor's r:embed id
resolves to a media file via drawing1.xml.rels.
"""

import json
import re
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

import openpyxl
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PRODUCTS_DIR = ROOT / "assets" / "products"
DATA_PATH = ROOT / "assets" / "data" / "products.json"

MAX_DIMENSION = 360
JPEG_QUALITY = 75

ITEM_CODE_RE = re.compile(r"^[A-Z]{2,4}\d{5,7}$")

NS = {
    "xdr": "http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}


def load_row_to_media(zf: zipfile.ZipFile) -> dict[int, bytes]:
    """Map each item row (0-based) to the raw bytes of its embedded photo."""
    drawing_xml = zf.read("xl/drawings/drawing1.xml")
    rels_xml = zf.read("xl/drawings/_rels/drawing1.xml.rels")

    rels_root = ET.fromstring(rels_xml)
    rid_to_target = {
        rel.get("Id"): rel.get("Target")
        for rel in rels_root
    }

    row_to_bytes: dict[int, bytes] = {}
    root = ET.fromstring(drawing_xml)
    for anchor in root.findall("xdr:oneCellAnchor", NS):
        pic = anchor.find("xdr:pic", NS)
        if pic is None:
            continue
        row = int(anchor.find("xdr:from/xdr:row", NS).text)
        blip = pic.find(".//a:blip", {**NS, "a": "http://schemas.openxmlformats.org/drawingml/2006/main"})
        rid = blip.get(f"{{{NS['r']}}}embed")
        target = rid_to_target[rid]
        media_path = "xl/" + target.replace("../", "")
        row_to_bytes[row] = zf.read(media_path)

    return row_to_bytes


def extract_row_fields(row_values: tuple) -> dict | None:
    """Pull item_code/description/price1/price2/barcode out of one data row."""
    if not row_values or not row_values[0]:
        return None
    item_code = str(row_values[0]).strip()
    if not ITEM_CODE_RE.match(item_code):
        return None

    remaining = [(i, v) for i, v in enumerate(row_values) if i > 0 and v not in (None, "")]

    description = None
    prices: list[float] = []
    barcode = None
    for i, v in remaining:
        if description is None and isinstance(v, str):
            description = v.strip()
            continue
        if len(prices) < 2 and isinstance(v, (int, float)):
            prices.append(float(v))
            continue
        # anything left over (string or number) after description+2 prices
        barcode = str(v).strip()

    if description is None:
        return None

    return {
        "itemCode": item_code,
        "description": description,
        "price1": prices[0] if len(prices) > 0 else None,
        "price2": prices[1] if len(prices) > 1 else None,
        "barcode": barcode,
    }


def save_photo(item_code: str, raw_bytes: bytes) -> str | None:
    try:
        img = Image.open(__import__("io").BytesIO(raw_bytes))
        img = img.convert("RGB")
    except Exception as exc:
        print(f"  ! could not decode image for {item_code}: {exc}")
        return None

    img.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.LANCZOS)
    out_path = PRODUCTS_DIR / f"{item_code}.jpg"
    img.save(out_path, "JPEG", quality=JPEG_QUALITY, optimize=True)
    return f"assets/products/{item_code}.jpg"


def main(xlsx_path: str) -> None:
    PRODUCTS_DIR.mkdir(parents=True, exist_ok=True)
    DATA_PATH.parent.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(xlsx_path) as zf:
        row_to_media = load_row_to_media(zf)

    wb = openpyxl.load_workbook(xlsx_path, read_only=True, data_only=True)
    ws = wb.active

    products = []
    missing_image = 0
    with_barcode = 0

    for row in ws.iter_rows(min_row=1, values_only=False):
        values = tuple(c.value for c in row)
        fields = extract_row_fields(values)
        if fields is None:
            continue

        row_index_0based = row[0].row - 1
        raw_bytes = row_to_media.get(row_index_0based)
        image_path = save_photo(fields["itemCode"], raw_bytes) if raw_bytes else None
        if image_path is None:
            missing_image += 1
        if fields["barcode"]:
            with_barcode += 1

        products.append({**fields, "image": image_path})

    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, separators=(",", ":"))

    print(f"Items:            {len(products)}")
    print(f"With barcode:     {with_barcode}")
    print(f"Missing photo:    {missing_image}")
    print(f"Wrote:            {DATA_PATH.relative_to(ROOT)}")
    print(f"Photos folder:    {PRODUCTS_DIR.relative_to(ROOT)}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("usage: py tools/build_products.py <Item Listing xlsx>")
        sys.exit(1)
    main(sys.argv[1])
