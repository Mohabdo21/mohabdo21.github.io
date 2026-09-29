/* Mohannad Abdulaziz Babeker - portfolio
   Three behaviours: theme choice, mobile section menu, rail current-section. */

(function () {
  "use strict";

  var root = document.documentElement;

  /* --- Theme -------------------------------------------------------------- */

  function stored() {
    try {
      return localStorage.getItem("theme");
    } catch (e) {
      return null;
    }
  }

  function remember(theme) {
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      /* Private mode: the choice just will not survive a reload. */
    }
  }

  // The inline head script has already set data-theme; read it back.
  function syncLabels() {
    var isDark = root.dataset.theme !== "light";
    var buttons = document.querySelectorAll("[data-theme-toggle]");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].textContent = isDark ? "Switch to light" : "Switch to dark";
      buttons[i].setAttribute("aria-pressed", String(isDark));
    }
  }

  var toggles = document.querySelectorAll("[data-theme-toggle]");
  for (var i = 0; i < toggles.length; i++) {
    toggles[i].addEventListener("click", function () {
      var next = root.dataset.theme === "light" ? "dark" : "light";
      root.dataset.theme = next;
      remember(next);
      syncLabels();
    });
  }
  syncLabels();

  // Keep following the OS until the visitor makes an explicit choice.
  matchMedia("(prefers-color-scheme: light)").addEventListener(
    "change",
    function (event) {
      if (stored()) return;
      root.dataset.theme = event.matches ? "light" : "dark";
      syncLabels();
    },
  );

  /* --- Mobile section menu ------------------------------------------------ */

  var navToggle = document.getElementById("nav-toggle");
  var navPanel = document.getElementById("nav-panel");

  if (navToggle && navPanel) {
    function setMenu(open) {
      navPanel.dataset.open = String(open);
      navToggle.setAttribute("aria-expanded", String(open));
    }

    navToggle.addEventListener("click", function () {
      setMenu(navPanel.dataset.open !== "true");
    });

    // Following an anchor inside the menu should close it, or the target
    // scrolls behind the panel that is still covering the viewport.
    navPanel.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && navPanel.dataset.open === "true") {
        setMenu(false);
        navToggle.focus();
      }
    });
  }

  /* --- Current section in the rail ---------------------------------------- */

  var links = Array.prototype.slice.call(
    document.querySelectorAll(".rail__link"),
  );
  var targets = links
    .map(function (link) {
      var section = document.querySelector(link.getAttribute("href"));
      return section ? { link: link, section: section } : null;
    })
    .filter(Boolean);

  if (targets.length) {
    var current = null;
    var queued = false;

    function mark() {
      queued = false;

      // 40% down the viewport: a section counts as current once the reader is
      // properly inside it, not the moment it first clips the top edge.
      var line = window.scrollY + window.innerHeight * 0.4;
      var atBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;
      var next = null;

      for (var i = 0; i < targets.length; i++) {
        if (
          targets[i].section.getBoundingClientRect().top + window.scrollY <=
          line
        ) {
          next = targets[i];
        }
      }

      if (atBottom) next = targets[targets.length - 1];
      if (next === current) return;

      if (current) current.link.removeAttribute("aria-current");
      if (next) next.link.setAttribute("aria-current", "true");
      current = next;
    }

    function onScroll() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(mark);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    mark();
  }
})();
