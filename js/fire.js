/* =========================================================
   AGOSAN - Brasas del hero y efecto "extintor"
   - Brasas que suben desde abajo del hero (canvas).
   - Clic o toque en el hero: sale una nube de polvo químico que las apaga.
   - Botón con data-extinguish o bajar la página: se apaga todo el fuego.
   - Pasados unos segundos el fuego vuelve poco a poco.
   Para desactivar el efecto: borra <script src="js/fire.js"> del HTML.
   ========================================================= */

(function () {
  "use strict";

  var canvas = document.getElementById("embers");
  var hero = document.getElementById("inicio");
  if (!canvas || !hero || !canvas.getContext) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var ctx = canvas.getContext("2d");

  /* ---------- Ajustes (se pueden tocar sin miedo) ---------- */
  var MAX_EMBERS = window.matchMedia("(max-width: 767px)").matches ? 55 : 110; // menos brasas en móvil
  var SPAWN_PER_FRAME = 1.2;       // brasas nuevas por cuadro con fuego a tope
  var RELIGHT_AFTER_MS = 4500;     // tiempo hasta que el fuego vuelve
  var COOL_SPEED = 0.06;           // qué tan rápido se enfría una brasa dentro del polvo

  var width = 0;
  var height = 0;
  var embers = [];
  var puffs = [];
  var fireLevel = 1;               // 1 = fuego completo, 0 = apagado
  var relightTimer = null;
  var rampTimer = null;            // pasos de la subida gradual del fuego
  var running = false;
  var heroVisible = true;

  /* ---------- Tamaño del canvas (nítido en pantallas retina) ---------- */
  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = hero.clientWidth;
    height = hero.clientHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* ---------- Color según el calor: amarillo, naranja, rojo, humo ---------- */
  function emberColor(heat, alpha) {
    var r, g, b;
    if (heat > 0.66) {        // amarillo a naranja
      var t = (heat - 0.66) / 0.34;
      r = 255; g = Math.round(110 + 100 * t); b = Math.round(30 + 90 * t);
    } else if (heat > 0.33) { // naranja a rojo
      var u = (heat - 0.33) / 0.33;
      r = Math.round(200 + 55 * u); g = Math.round(35 + 75 * u); b = 25;
    } else {                  // rojo a gris humo
      var v = heat / 0.33;
      r = Math.round(120 + 80 * v); g = Math.round(112 - 77 * v); b = Math.round(104 - 79 * v);
    }
    return "rgba(" + r + "," + g + "," + b + "," + alpha.toFixed(3) + ")";
  }

  function spawnEmber() {
    embers.push({
      x: Math.random() * width,
      y: height + 10,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(0.6 + Math.random() * 1.6),
      size: 1 + Math.random() * 2.6,
      heat: 0.75 + Math.random() * 0.25,
      life: 0,
      maxLife: 160 + Math.random() * 220,
      wobble: Math.random() * Math.PI * 2
    });
  }

  /* ---------- Nube de polvo químico ---------- */
  function addPuff(x, y, maxRadius) {
    puffs.push({ x: x, y: y, r: 4, maxR: maxRadius, alpha: 0.55 });
    start();
  }

  // Descarga completa: una línea de nubes de izquierda a derecha, como una manguera
  function extinguishAll() {
    if (fireLevel === 0) return; // ya está apagado
    clearTimeout(rampTimer);     // corta una reignición que estuviera en marcha
    fireLevel = 0;
    hero.classList.add("is-out");
    var steps = 7;
    for (var i = 0; i < steps; i++) {
      (function (i) {
        setTimeout(function () {
          addPuff((width / (steps - 1)) * i, height * (0.55 + Math.random() * 0.3), width / 3.2);
        }, i * 70);
      })(i);
    }
    scheduleRelight();
    start();
  }

  function scheduleRelight() {
    clearTimeout(relightTimer);
    relightTimer = setTimeout(function () {
      hero.classList.remove("is-out");
      relight();
    }, RELIGHT_AFTER_MS);
  }

  // El fuego vuelve de forma gradual
  function relight() {
    if (fireLevel >= 1) return;
    fireLevel = Math.min(1, fireLevel + 0.02);
    start(); // por si el bucle se había detenido
    if (fireLevel < 1) rampTimer = setTimeout(relight, 60);
  }

  /* ---------- Bucle de animación ---------- */
  function step() {
    if (!running) return;
    ctx.clearRect(0, 0, width, height);

    // Brillo de calor en la parte baja
    if (fireLevel > 0.05) {
      var glow = ctx.createRadialGradient(width * 0.3, height, 0, width * 0.3, height, height * 0.75);
      glow.addColorStop(0, "rgba(215,38,30," + (0.22 * fireLevel).toFixed(3) + ")");
      glow.addColorStop(1, "rgba(215,38,30,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);
    }

    // Nuevas brasas según el nivel de fuego
    var toSpawn = SPAWN_PER_FRAME * fireLevel;
    while (toSpawn > 0 && embers.length < MAX_EMBERS) {
      if (toSpawn >= 1 || Math.random() < toSpawn) spawnEmber();
      toSpawn -= 1;
    }

    // Nubes de polvo: crecen y se desvanecen
    ctx.globalCompositeOperation = "source-over";
    for (var p = puffs.length - 1; p >= 0; p--) {
      var puff = puffs[p];
      puff.r += (puff.maxR - puff.r) * 0.08;
      puff.alpha *= 0.965;
      ctx.fillStyle = "rgba(236,232,224," + (puff.alpha * 0.35).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(puff.x, puff.y, puff.r, 0, Math.PI * 2);
      ctx.fill();
      if (puff.alpha < 0.02) puffs.splice(p, 1);
    }

    // Brasas
    for (var i = embers.length - 1; i >= 0; i--) {
      var e = embers[i];
      e.life++;
      e.wobble += 0.05;
      e.x += e.vx + Math.sin(e.wobble) * 0.3;
      e.y += e.vy;

      // Dentro de una nube de polvo, la brasa se enfría y frena
      for (var k = 0; k < puffs.length; k++) {
        var dx = e.x - puffs[k].x;
        var dy = e.y - puffs[k].y;
        if (dx * dx + dy * dy < puffs[k].r * puffs[k].r) {
          e.heat -= COOL_SPEED;
          e.vy *= 0.96;
          break;
        }
      }
      if (e.heat < 0.33) e.size += 0.05; // el humo se expande

      var fade = 1 - e.life / e.maxLife;
      if (fade <= 0 || e.y < -20 || e.heat <= 0) { embers.splice(i, 1); continue; }

      var alpha = Math.max(0, fade) * (e.heat < 0.33 ? 0.35 : 0.9);
      ctx.globalCompositeOperation = e.heat < 0.33 ? "source-over" : "lighter";
      ctx.fillStyle = emberColor(Math.max(e.heat, 0), alpha);
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";

    // Se detiene si no queda nada que dibujar y el fuego está apagado
    if (!embers.length && !puffs.length && fireLevel === 0) { running = false; return; }
    requestAnimationFrame(step);
  }

  function start() {
    if (running || !heroVisible || document.hidden) return;
    running = true;
    requestAnimationFrame(step);
  }

  function stop() { running = false; }

  /* ---------- Eventos ---------- */

  // Clic o toque en el hero (fuera de enlaces y botones): nube de polvo en ese punto
  hero.addEventListener("pointerdown", function (event) {
    if (event.target.closest("a, button")) return;
    var box = hero.getBoundingClientRect();
    addPuff(event.clientX - box.left, event.clientY - box.top, Math.min(width, 900) / 4);
    hero.classList.add("is-out");
    scheduleRelight();
    start();
  });

  // Botón "Ver Servicios": descarga completa
  document.querySelectorAll("[data-extinguish]").forEach(function (button) {
    button.addEventListener("click", extinguishAll);
  });

  // Pausa cuando el hero no se ve; al bajar la página se apaga el fuego
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      var entry = entries[0];
      heroVisible = entry.isIntersecting;
      // Solo se apaga si el usuario bajó (el hero se va por arriba), no por tener una pantalla baja
      var scrolledDown = entry.boundingClientRect.top < -120;
      if (entry.isIntersecting && scrolledDown && fireLevel > 0.5) extinguishAll();
      if (heroVisible) start(); else stop();
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] }).observe(hero);
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop(); else start();
  });

  // ResizeObserver mide el hero sin forzar un recálculo de diseño al cargar
  if ("ResizeObserver" in window) {
    new ResizeObserver(resize).observe(hero);
  } else {
    window.addEventListener("resize", resize);
    resize();
  }
  start();
})();
