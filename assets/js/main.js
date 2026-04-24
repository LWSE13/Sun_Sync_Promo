(function () {
  var header = document.getElementById("site-header");
  var lastY = window.scrollY;
  function syncHeader() {
    var y = window.scrollY;
    var atTop = y <= 16;
    var down = y > lastY + 4;
    var up = y < lastY - 4;
    if (atTop || up) header.classList.remove("is-tucked");
    else if (down && y > 96) header.classList.add("is-tucked");
    lastY = y;
  }
  window.addEventListener("scroll", syncHeader, { passive: true });
  syncHeader();
}());

(function () {
  var els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach(function (el) { el.classList.add("revealed"); });
    return;
  }
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  els.forEach(function (el) { obs.observe(el); });
}());
