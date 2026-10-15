(function () {
  var KEY = "rg-photo-guide-done";
  var done = {};
  try { done = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { done = {}; }
  var boxes = document.querySelectorAll("[data-done]");
  var total = boxes.length;

  function render() {
    var count = 0;
    boxes.forEach(function (b) {
      var n = b.getAttribute("data-done");
      b.checked = !!done[n];
      var card = document.getElementById("p" + n);
      if (card) card.classList.toggle("is-done", b.checked);
      if (b.checked) count++;
    });
    var c = document.querySelector("[data-count]");
    var bar = document.querySelector("[data-bar]");
    if (c) c.textContent = String(count);
    if (bar) bar.style.width = (total ? (count / total) * 100 : 0) + "%";
  }
  boxes.forEach(function (b) {
    b.addEventListener("change", function () {
      done[b.getAttribute("data-done")] = b.checked;
      try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (e) {}
      render();
    });
  });
  render();

  // Filter: all photographs, or only the essential ones.
  var buttons = document.querySelectorAll("[data-filter]");
  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var f = btn.getAttribute("data-filter");
      buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      document.querySelectorAll(".card").forEach(function (card) {
        card.hidden = f !== "all" && card.getAttribute("data-priority") !== f;
      });
    });
  });

  // Copy a file name.
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      var ok = function () { btn.textContent = "Copied"; setTimeout(function () { btn.textContent = "Copy"; }, 1400); };
      var fallback = function () {
        var code = btn.parentNode.querySelector("code");
        var r = document.createRange(); r.selectNodeContents(code);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        btn.textContent = "Selected";
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fallback);
      else fallback();
    });
  });
})();
