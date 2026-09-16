/* Top Save Wholesale — scan-to-price lookup */
(function () {
  'use strict';

  var DATA_URL = 'assets/data/products.json';
  var byCode = null; // normalized barcode/item-code -> product record

  var els = {
    startBtn: document.getElementById('scanStartBtn'),
    stopBtn: document.getElementById('scanStopBtn'),
    reader: document.getElementById('reader'),
    status: document.getElementById('scanStatus'),
    result: document.getElementById('scanResult'),
    manualForm: document.getElementById('manualForm'),
    manualInput: document.getElementById('manualInput')
  };

  var html5Qr = null;
  var scanning = false;

  function normalize(code) {
    return String(code || '').trim().toUpperCase();
  }

  function loadData() {
    if (byCode) return Promise.resolve(byCode);
    return fetch(DATA_URL)
      .then(function (r) {
        if (!r.ok) throw new Error('failed to load product data');
        return r.json();
      })
      .then(function (list) {
        byCode = new Map();
        list.forEach(function (item) {
          if (item.barcode) byCode.set(normalize(item.barcode), item);
          byCode.set(normalize(item.itemCode), item);
        });
        return byCode;
      });
  }

  function money(v) {
    return v == null ? 'Not set' : 'RM ' + v.toFixed(2);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function renderResult(item, rawCode) {
    if (!item) {
      els.result.innerHTML =
        '<div class="scan-card scan-card-empty">' +
        '<p>No match found for <strong>' + escapeHtml(rawCode) + '</strong>.</p>' +
        '<p>Try scanning again, or ask a staff member for help.</p>' +
        '</div>';
      return;
    }

    var imgHtml = item.image
      ? '<img src="' + item.image + '" alt="' + escapeHtml(item.description) + '">'
      : '<div class="scan-card-noimg">No photo</div>';

    els.result.innerHTML =
      '<div class="scan-card">' +
      imgHtml +
      '<div class="scan-card-body">' +
      '<p class="scan-card-code">' + escapeHtml(item.itemCode) + '</p>' +
      '<h3>' + escapeHtml(item.description) + '</h3>' +
      '<div class="scan-card-prices">' +
      '<div><span>Price 1</span><strong>' + money(item.price1) + '</strong></div>' +
      '<div><span>Price 2</span><strong>' + money(item.price2) + '</strong></div>' +
      '</div>' +
      '</div>' +
      '</div>';

    els.result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function lookup(rawCode) {
    var code = normalize(rawCode);
    setStatus('Looking up ' + rawCode + '...');
    loadData()
      .then(function (map) {
        renderResult(map.get(code) || null, rawCode);
        setStatus('');
      })
      .catch(function () {
        setStatus('Could not load product data. Check your connection and try again.');
      });
  }

  function setStatus(msg) {
    if (els.status) els.status.textContent = msg;
  }

  function stopScanning() {
    if (html5Qr && scanning) {
      html5Qr.stop().then(function () {
        html5Qr.clear();
      }).catch(function () {});
    }
    scanning = false;
    if (els.reader) els.reader.hidden = true;
    if (els.startBtn) els.startBtn.hidden = false;
    if (els.stopBtn) els.stopBtn.hidden = true;
  }

  function startScanning() {
    if (typeof Html5Qrcode === 'undefined') {
      setStatus('Camera scanner failed to load. Use manual entry below.');
      return;
    }

    els.reader.hidden = false;
    els.startBtn.hidden = true;
    els.stopBtn.hidden = false;
    setStatus('Starting camera...');

    html5Qr = new Html5Qrcode('reader', { verbose: false });
    // A low-res default camera stream is often too soft to resolve the fine
    // bars of a dense 1D barcode (EAN/UPC) — ask for a sharper feed.
    var config = {
      fps: 10,
      qrbox: { width: 280, height: 160 },
      videoConstraints: {
        facingMode: 'environment',
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      }
    };

    html5Qr.start(
      { facingMode: 'environment' },
      config,
      function onScanSuccess(decodedText) {
        // Stop right away so a held-up product isn't re-scanned every frame.
        stopScanning();
        lookup(decodedText);
      },
      function onScanFailure() {
        /* fires continuously while no code is in frame — expected, ignore */
      }
    ).then(function () {
      scanning = true;
      setStatus('Point your camera at a barcode or QR code.');
    }).catch(function () {
      setStatus('Could not access the camera. Check camera permission, or use manual entry below.');
      stopScanning();
    });
  }

  if (els.startBtn) els.startBtn.addEventListener('click', startScanning);
  if (els.stopBtn) els.stopBtn.addEventListener('click', stopScanning);

  if (els.manualForm) {
    els.manualForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var code = els.manualInput.value.trim();
      if (!code) return;
      lookup(code);
    });
  }

  // Warm the cache in the background so the very first scan resolves instantly.
  loadData().catch(function () {});
})();
