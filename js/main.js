/* =========================================================
   AGOSAN - Interacciones de la página
   Cada bloque es independiente: si un elemento no existe, se salta.
   1. Arranque                         6. Pestañas de procedimientos
   2. Menú móvil                       7. Orden de trabajo (recarga)
   3. Cabecera y enlace activo         8. Regla de prueba hidrostática
   4. Aparición al hacer scroll        9. Ventanas de detalle (dialog)
      (+ llamas que se apagan)
   5. Manómetros (cifras)
   ========================================================= */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Arranque ---------- */
  document.documentElement.classList.add("js");

  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* Ayuda: ejecuta "callback" una sola vez cuando el elemento entra en pantalla */
  function onceVisible(elements, callback, options) {
    if (!("IntersectionObserver" in window)) {
      elements.forEach(callback);
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          callback(entry.target);
        }
      });
    }, options || { threshold: 0.15 });
    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- 2. Menú móvil ---------- */
  var menu = document.getElementById("menu");
  var menuButton = document.querySelector(".menu-toggle");

  function setMenu(open) {
    if (!menu || !menuButton) return;
    menu.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.querySelector(".visually-hidden").textContent = open ? "Cerrar menú" : "Abrir menú";
  }

  if (menu && menuButton) {
    menuButton.addEventListener("click", function () {
      setMenu(menuButton.getAttribute("aria-expanded") !== "true");
    });
    // Cerrar al elegir un enlace
    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });
    // Cerrar con Escape y devolver el foco al botón
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menu.classList.contains("is-open")) {
        setMenu(false);
        menuButton.focus();
      }
    });
  }

  /* ---------- 3. Cabecera con sombra al bajar + enlace activo ---------- */
  var header = document.querySelector(".site-header");
  var hero = document.getElementById("inicio");

  if (header && hero && "IntersectionObserver" in window) {
    // Marcador invisible en lo alto del hero: cuando sale de pantalla, la página ya bajó
    var sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:8px;";
    hero.prepend(sentinel);
    new IntersectionObserver(function (entries) {
      header.classList.toggle("is-scrolled", !entries[0].isIntersecting);
    }).observe(sentinel);
  }

  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".site-nav a"));
  if (navLinks.length && "IntersectionObserver" in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          var active = link.getAttribute("href") === "#" + entry.target.id;
          if (active) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    navLinks.forEach(function (link) {
      var section = document.querySelector(link.getAttribute("href"));
      if (section) sectionObserver.observe(section);
    });
  }

  /* ---------- 4. Aparición al hacer scroll ---------- */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));

  // Retraso escalonado entre hermanos (80 ms cada uno) para que no entren todos a la vez
  revealItems.forEach(function (el) {
    var siblings = Array.prototype.filter.call(el.parentElement.children, function (child) {
      return child.hasAttribute("data-reveal");
    });
    var index = siblings.indexOf(el);
    if (index > 0) el.style.setProperty("--delay", Math.min(index, 5) * 80 + "ms");
  });

  onceVisible(revealItems, function (el) {
    el.classList.add("is-visible");

    if (el.classList.contains("tag")) {
      // Al terminar de colgarse, se quita la transición para que el balanceo del hover funcione
      var delay = reduceMotion ? 0 : 1100 + parseInt(el.style.getPropertyValue("--delay") || 0, 10);
      setTimeout(function () {
        el.classList.add("is-settled");
        var flame = el.querySelector(".flame-out");
        if (flame) flame.classList.add("is-out");
      }, delay);
    }
  });

  /* ---------- 5. Manómetros: la aguja sube y el número cuenta ---------- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    if (reduceMotion) { el.textContent = target.toFixed(decimals); return; }

    var duration = 1400;
    var start = null;
    function frame(time) {
      if (start === null) start = time;
      var progress = Math.min((time - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // desacelera al final
      el.textContent = (target * eased).toFixed(decimals);
      if (progress < 1) requestAnimationFrame(frame);
    }
    el.textContent = (0).toFixed(decimals);
    requestAnimationFrame(frame);
  }

  var gauges = Array.prototype.slice.call(document.querySelectorAll(".gauge"));
  onceVisible(gauges, function (gauge) {
    var needle = gauge.querySelector(".gauge__needle");
    var number = gauge.querySelector("[data-count]");
    if (needle) {
      var fraction = parseFloat(needle.getAttribute("data-fraction")) || 0;
      needle.style.transform = "rotate(" + (-135 + 270 * fraction) + "deg)";
    }
    if (number) countUp(number);
  }, { threshold: 0.5 });

  /* ---------- 6. Pestañas (accesibles con teclado: flechas, Inicio, Fin) ---------- */
  document.querySelectorAll("[data-tabs]").forEach(function (tabsRoot) {
    var tabs = Array.prototype.slice.call(tabsRoot.querySelectorAll('[role="tab"]'));

    function selectTab(tab, moveFocus) {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.setAttribute("aria-selected", String(selected));
        t.tabIndex = selected ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !selected;
      });
      if (moveFocus) tab.focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { selectTab(tab, false); });
      tab.addEventListener("keydown", function (event) {
        var next = null;
        if (event.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        if (event.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (event.key === "Home") next = tabs[0];
        if (event.key === "End") next = tabs[tabs.length - 1];
        if (next) {
          event.preventDefault();
          selectTab(next, true);
        }
      });
    });
  });

  /* ---------- 7. Orden de trabajo de recarga: cada paso se marca al verse ---------- */
  var workorder = document.querySelector("[data-workorder]");
  if (workorder) {
    var steps = Array.prototype.slice.call(workorder.children);
    var doneCounter = document.querySelector("[data-done]");
    var queue = [];
    var ticking = false;

    function updateCounter() {
      if (doneCounter) doneCounter.textContent = String(workorder.querySelectorAll(".is-done").length);
    }

    // Marca los pasos de uno en uno para que se note el avance
    function tickNext() {
      var step = queue.shift();
      if (!step) { ticking = false; return; }
      step.classList.add("is-done");
      updateCounter();
      setTimeout(tickNext, reduceMotion ? 0 : 160);
    }

    onceVisible(steps, function (step) {
      queue.push(step);
      if (!ticking) { ticking = true; tickNext(); }
    }, { threshold: 1 });
  }

  /* ---------- 8. Regla de intervalos: las barras crecen al verse ---------- */
  onceVisible(Array.prototype.slice.call(document.querySelectorAll(".ruler")), function (ruler) {
    ruler.classList.add("is-visible");
  }, { threshold: 0.3 });

  /* ---------- 9. Ventanas de detalle de servicios ---------- */
  document.querySelectorAll("[data-dialog]").forEach(function (button) {
    var dialog = document.getElementById(button.getAttribute("data-dialog"));
    if (!dialog || typeof dialog.showModal !== "function") return;
    button.addEventListener("click", function () { dialog.showModal(); });
  });

  document.querySelectorAll("dialog").forEach(function (dialog) {
    // Botones y enlaces con data-close cierran la ventana
    dialog.addEventListener("click", function (event) {
      if (event.target.closest("[data-close]")) {
        dialog.close();
        return;
      }
      // Clic fuera del contenido (en el fondo oscuro) también cierra
      if (event.target === dialog) {
        var box = dialog.getBoundingClientRect();
        var inside = event.clientX >= box.left && event.clientX <= box.right &&
                     event.clientY >= box.top && event.clientY <= box.bottom;
        if (!inside) dialog.close();
      }
    });
  });
})();
