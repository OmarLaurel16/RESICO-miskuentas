// ── ESTADO DE CANCELACIÓN ──
function switchEstado(estado) {
  document.querySelectorAll(".cancel-panel").forEach(function (p) {
    p.classList.add("hidden");
  });
  document
    .querySelectorAll("#view-buzon .cfdi-tipos-btns .btn-secondary")
    .forEach(function (b) {
      b.classList.remove("active-estado");
    });
  var panel = document.getElementById("panel-estado-" + estado);
  if (panel) panel.classList.remove("hidden");
  var btn = document.getElementById("estado-btn-" + estado);
  if (btn) btn.classList.add("active-estado");
}

function switchTipoFactura(tipo) {
  // Ocultar todos los paneles
  document.querySelectorAll(".cfdi-panel").forEach(function (p) {
    p.classList.add("hidden");
  });

  // Quitar estado activo de todos los botones de tipo
  document
    .querySelectorAll(".cfdi-tipos-btns .btn-primary")
    .forEach(function (b) {
      b.classList.remove("active-tipo");
    });

  // Mostrar panel seleccionado
  var panel = document.getElementById("panel-" + tipo);
  if (panel) panel.classList.remove("hidden");

  // Marcar botón activo
  var btn = document.getElementById("tipo-btn-" + tipo);
  if (btn) btn.classList.add("active-tipo");
}

// ── ESTADO ──
let currentView = "perfil";

// ── NAVEGACIÓN SPA ──
function navigate(viewId, module, sub) {
  // Ocultar vista actual
  if (viewId !== "first-msg") {
    document
      .querySelectorAll(".view")
      .forEach((v) => v.classList.remove("active"));
  }

  // Mostrar nueva vista
  const target = document.getElementById("view-" + viewId);

  if (target) {
    target.classList.add("active");
    currentView = viewId;
  }

  // limpiar estados
  document
    .querySelectorAll(".nav-module-btn")
    .forEach((b) => b.classList.remove("active"));

  document
    .querySelectorAll(".nav-sub a")
    .forEach((a) => a.classList.remove("current"));

  // activar subitem + modulo padre (modulos con submenu)
  document.querySelectorAll(".nav-sub a").forEach((a) => {
    const fn = a.getAttribute("onclick") || "";

    if (fn.includes("'" + viewId + "'")) {
      // subitem actual
      a.classList.add("current");

      // modulo padre
      const section = a.closest(".nav-section");
      const parentBtn = section?.querySelector(".nav-module-btn");

      if (parentBtn) {
        parentBtn.classList.add("active");
      }
    }
  });

  // fallback: modulos sin submenu (Inicio, Buzon SAT)
  document.querySelectorAll(".nav-module-btn").forEach((b) => {
    const fn = b.getAttribute("onclick") || "";
    if (fn.includes("'" + viewId + "'")) {
      b.classList.add("active");
    }
  });
}

function closeAllSubmenus() {
  document
    .querySelectorAll(".nav-sub.open")
    .forEach((s) => s.classList.remove("open"));

  document
    .querySelectorAll(".nav-module-btn.open")
    .forEach((b) => b.classList.remove("open"));
}

// ── TOGGLE MÓDULO (submenu) ──
function toggleModule(btn) {
  const sub = btn.nextElementSibling;
  if (!sub || !sub.classList.contains("nav-sub")) return;

  const isOpen = sub.classList.contains("open");

  // cerrar todos primero
  closeAllSubmenus();

  // abrir si no estaba abierto
  if (!isOpen) {
    sub.classList.add("open");
    btn.classList.add("open");
  }
}

// ── TABS ──
function switchTab(btn, panelId) {
  const card = btn.closest(".card");
  card
    .querySelectorAll(".tab-btn")
    .forEach((b) => b.classList.remove("active"));
  card
    .querySelectorAll(".tab-panel")
    .forEach((p) => p.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById(panelId).classList.add("active");
}

// ── REPORTE ──
function generarReporte() {
  const tipo = document.getElementById("tipo-reporte").value;
  const anio = document.getElementById("anio-reporte").value;
  const mes = document.getElementById("mes-reporte").value;
  if (!tipo || !anio) {
    alert("Selecciona el tipo de reporte y el año.");
    return;
  }

  document.getElementById("reporte-empty").style.display = "none";
  const res = document.getElementById("reporte-resultado");
  res.style.display = "block";

  // Stats mock
  const stats = document.getElementById("reporte-stats");
  stats.innerHTML = `
        <div class="stat-card"><div class="stat-label">Total periodo</div><div class="stat-value positive">$ 245,400</div><div class="stat-sub">${mes || "Todo el año"} ${anio}</div></div>
        <div class="stat-card"><div class="stat-label">Operaciones</div><div class="stat-value">67</div><div class="stat-sub">CFDIs considerados</div></div>
        <div class="stat-card"><div class="stat-label">Promedio mensual</div><div class="stat-value">$ 49,080</div><div class="stat-sub">Por mes</div></div>
        <div class="stat-card"><div class="stat-label">Variación</div><div class="stat-value positive">+12%</div><div class="stat-sub">vs periodo anterior</div></div>
      `;

  // Tabla mock
  const titulo = document.getElementById("reporte-tabla-titulo");
  titulo.textContent = tipo + " — " + (mes ? mes + " " : "") + anio;
  const tabla = document.getElementById("reporte-tabla");
  tabla.innerHTML = `
        <thead><tr><th>Mes</th><th>Monto</th><th>IVA</th><th>ISR</th><th>Neto</th></tr></thead>
        <tbody>
          <tr><td>Enero</td><td class="mono">$ 42,000</td><td class="mono">$ 6,720</td><td class="mono">$ 4,200</td><td class="mono positive" style="font-weight:600;">$ 31,080</td></tr>
          <tr><td>Febrero</td><td class="mono">$ 38,500</td><td class="mono">$ 6,160</td><td class="mono">$ 3,850</td><td class="mono positive" style="font-weight:600;">$ 28,490</td></tr>
          <tr><td>Marzo</td><td class="mono">$ 55,200</td><td class="mono">$ 8,832</td><td class="mono">$ 5,520</td><td class="mono positive" style="font-weight:600;">$ 40,848</td></tr>
          <tr><td>Abril</td><td class="mono">$ 61,500</td><td class="mono">$ 9,840</td><td class="mono">$ 6,150</td><td class="mono positive" style="font-weight:600;">$ 45,510</td></tr>
          <tr><td>Mayo</td><td class="mono">$ 48,200</td><td class="mono">$ 7,712</td><td class="mono">$ 4,820</td><td class="mono positive" style="font-weight:600;">$ 35,668</td></tr>
        </tbody>
      `;
}

// ── CALCULAR DECLARACIÓN ──
function calcularDeclaracion() {
  const res = document.getElementById("calculo-resultado");
  res.style.display = "block";
  res.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ── HELPER: fila de concepto ──
function conceptoRow() {
  return `<tr>
        <td><input class="form-input" placeholder="Descripción" style="width:100%;min-width:160px;"/></td>
        <td><input class="form-input mono" value="1" style="width:60px;text-align:right;"/></td>
        <td><input class="form-input mono" value="$ 0.00" style="width:110px;text-align:right;"/></td>
        <td><select class="form-input report-select" style="min-width:70px;"><option>16%</option><option>8%</option><option>0%</option><option>Exento</option></select></td>
        <td class="mono" style="font-weight:600;">$ 0.00</td>
        <td><button class="btn-secondary" style="padding:4px 8px;color:#c0392b;border-color:#f0cece;" onclick="this.closest('tr').remove()">✕</button></td>
      </tr>`;
}

// ── INIT: marcar Reportes activo ──
document.addEventListener("DOMContentLoaded", () => {
  navigate("perfil", "Perfil");
  navigate("first-msg");
  taxSetEstado("pendiente", 1);

  // cerrar submenu al hacer click fuera del sidebar
  document.addEventListener("click", (e) => {
    const sidebar = document.querySelector(".sidebar");
    if (!sidebar) return;

    if (!sidebar.contains(e.target)) {
      closeAllSubmenus();
    }
  });

  // cerrar submenu al navegar desde un link
  document.querySelectorAll(".nav-sub a").forEach((link) => {
    link.addEventListener("click", () => {
      closeAllSubmenus();
    });
  });

  // cerrar con ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllSubmenus();
    }
  });
});

// ══════════════════════════════════════════════
//  ONBOARDING — flujo e.firma (3 pasos)
//  Solo opera sobre #ob-step-1/2/3 y sus hijos
// ══════════════════════════════════════════════

// Estado interno del onboarding
const _ob = {
  cerActivo: false,
  keyActivo: false,
};

/** Muestra la subsección de subida de archivos */
function mostrarUploader() {
  const uploader = document.getElementById("ob-uploader");
  const btn = document.getElementById("btn-upload-files");
  if (!uploader) return;
  uploader.classList.remove("ob-hidden");
  btn.classList.add("ob-hidden");
}

/** Animación de validación → muestra resultado exitoso */
function validarEfirma() {
  const btn = document.getElementById("ob-validar-btn");
  const progressWrap = document.getElementById("ob-progress-wrap");
  const progressBar = document.getElementById("ob-progress-bar");
  const validacionOk = document.getElementById("ob-validacion-ok");
  if (!btn) return;

  // Bloquear botón y mostrar barra de progreso
  btn.disabled = true;
  btn.classList.add("ob-validando");
  btn.textContent = "Validando…";
  progressWrap.classList.remove("ob-hidden");

  // Animar barra a 100%
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      progressBar.style.width = "100%";
    });
  });

  // Tras 1.5s: ocultar barra, mostrar éxito
  setTimeout(() => {
    progressWrap.classList.add("ob-hidden");
    btn.classList.add("ob-hidden");
    validacionOk.classList.remove("ob-hidden");
  }, 1500);
}

/** Avanza al paso indicado (2, 'pago' o 3) */
function irAPaso(paso) {
  document.querySelectorAll(".onboarding-step").forEach(function (el) {
    el.classList.add("ob-hidden");
  });
  const target = document.getElementById("ob-step-" + paso);
  if (!target) return;
  target.classList.remove("ob-hidden");
  // Re-trigger animación de entrada
  target.style.animation = "none";
  requestAnimationFrame(function () {
    target.style.animation = "";
  });

  // Si es el paso de procesamiento, arrancar simulación
  if (paso === "proc") {
    _obIniciarProc();
  }
  if (paso === "pago") {
    const PRECIO_MES = 150; // MXN por mes
    const seleccionados = Array.from(
      document.querySelectorAll(".ob-mes-item.ob-mes-selected"),
    );
    const total = seleccionados.length * PRECIO_MES;

    // Cantidad
    const elCantidad = document.getElementById("ob-pago-cantidad");
    if (elCantidad)
      elCantidad.textContent =
        seleccionados.length + (seleccionados.length === 1 ? " mes" : " meses");

    // Lista de meses
    const elLista = document.getElementById("ob-pago-lista-meses");
    if (elLista) {
      elLista.innerHTML = seleccionados
        .map(function (btn) {
          const nombre = btn.querySelector("span")
            ? btn.querySelector("span").textContent
            : btn.textContent.trim();
          return (
            '<div class="ob-pago-lista-item">' +
            '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>' +
            "<span>" +
            nombre +
            "</span>" +
            "</div>"
          );
        })
        .join("");
    }

    // Total
    const elTotal = document.getElementById("ob-pago-total");
    if (elTotal)
      elTotal.textContent =
        "$ " +
        total.toLocaleString("es-MX", { minimumFractionDigits: 2 }) +
        " MXN";
  }
}

/** Selección de mes en paso 2: selecciona el mes tocado y todos los posteriores */
function seleccionarMes(btn) {
  const todos = Array.from(document.querySelectorAll(".ob-mes-item"));
  const idx = todos.indexOf(btn);

  todos.forEach(function (el, i) {
    if (i >= idx) {
      el.classList.add("ob-mes-selected");
    } else {
      el.classList.remove("ob-mes-selected");
    }
  });

  const continuar = document.getElementById("ob-paso2-continuar");
  if (continuar) continuar.disabled = false;
}

/** Cierra el panel y resetea el flujo para la próxima apertura */
function cerrarOnboarding(completado) {
  const view = document.getElementById("view-first-msg");
  if (view) view.classList.remove("active");

  setTimeout(() => {
    // Volver al paso 1
    document.querySelectorAll(".onboarding-step").forEach((el) => {
      el.classList.add("ob-hidden");
    });
    const step1 = document.getElementById("ob-step-1");
    if (step1) step1.classList.remove("ob-hidden");

    // Ocultar uploader y mostrar botón original
    const uploader = document.getElementById("ob-uploader");
    if (uploader) uploader.classList.add("ob-hidden");
    const btnUpload = document.getElementById("btn-upload-files");
    if (btnUpload) btnUpload.classList.remove("ob-hidden");

    // Resetear archivos
    ["cer", "key"].forEach((tipo) => {
      const b = document.getElementById("btn-" + tipo);
      const l = document.getElementById("lbl-" + tipo);
      const c = document.getElementById("check-" + tipo);
      if (b) b.classList.remove("ob-file-active");
      if (l) l.textContent = "Seleccionar archivo ." + tipo;
      if (c) c.classList.remove("visible");
      _ob[tipo + "Activo"] = false;
    });

    // Resetear validación
    const validarBtn = document.getElementById("ob-validar-btn");
    if (validarBtn) {
      validarBtn.disabled = false;
      validarBtn.classList.remove("ob-validando", "ob-hidden");
      validarBtn.textContent = "Validar y continuar";
    }
    const progressWrap = document.getElementById("ob-progress-wrap");
    if (progressWrap) {
      progressWrap.classList.add("ob-hidden");
      document.getElementById("ob-progress-bar").style.width = "0%";
    }
    const validacionOk = document.getElementById("ob-validacion-ok");
    if (validacionOk) validacionOk.classList.add("ob-hidden");

    // Resetear meses
    document.querySelectorAll(".ob-mes-item").forEach((el) => {
      el.classList.remove("ob-mes-selected");
    });
    const continuar2 = document.getElementById("ob-paso2-continuar");
    if (continuar2) continuar2.disabled = true;

    // Solo actualizar indicadores si el flujo se completó
    if (completado) {
      const elIngr = document.getElementById("inicio-ingresos");
      const elEgr = document.getElementById("inicio-egresos");
      if (elIngr) elIngr.textContent = "$ 285,400";
      if (elEgr) elEgr.textContent = "$ 248,200";
      taxSetEstado("al-dia");
    }
  }, 250);
}

// ══════════════════════════════════════════════
//  MODAL ACTUALIZAR FACTURAS
// ══════════════════════════════════════════════

const _FCT = {
  ANOS: [2024, 2025, 2026],
  MESES: [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ],
  // valores originales que se restauran al terminar
  INGRESOS_ORIG: "$ 285,400",
  EGRESOS_ORIG: "$ 248,200",
};

/** Construye la rejilla la primera vez */
function _fctBuildGrid() {
  const tbody = document.getElementById("fct-tbody");
  if (!tbody || tbody.dataset.built) return;
  tbody.dataset.built = "1";

  const ahora = new Date();
  const anioActual = ahora.getFullYear();
  const mesActual = ahora.getMonth(); // 0-based

  _FCT.ANOS.forEach(function (anio) {
    const tr = document.createElement("tr");

    // Columna de año
    const tdAnio = document.createElement("td");
    tdAnio.textContent = anio;
    tr.appendChild(tdAnio);

    // Columnas de meses
    _FCT.MESES.forEach(function (mes, idx) {
      const td = document.createElement("td");
      const btn = document.createElement("button");
      btn.className = "fct-mes-cell";
      btn.textContent = mes;
      btn.dataset.anio = anio;
      btn.dataset.mes = idx;

      // Deshabilitar meses futuros
      if (anio > anioActual || (anio === anioActual && idx > mesActual)) {
        btn.disabled = true;
      } else {
        btn.addEventListener("click", function () {
          btn.classList.toggle("fct-selected");
        });
      }
      td.appendChild(btn);
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}

/** Abre el modal */
function abrirModalFacturas() {
  _fctBuildGrid();
  document.getElementById("fct-overlay").classList.remove("ob-hidden");
  document.getElementById("fct-modal").classList.remove("ob-hidden");
  // Asegurar que la carga esté oculta y botón habilitado
  document.getElementById("fct-loading").classList.add("ob-hidden");
  var btn = document.getElementById("fct-actualizar-btn");
  btn.disabled = false;
  btn.style.display = "";
}

/** Cierra el modal (solo si no está procesando) */
function cerrarModalFacturas() {
  var btn = document.getElementById("fct-actualizar-btn");
  if (btn && btn.disabled) return; // bloquear cierre mientras procesa
  document.getElementById("fct-overlay").classList.add("ob-hidden");
  document.getElementById("fct-modal").classList.add("ob-hidden");
}

/** Simula la actualización de facturas */
function actualizarFacturas() {
  var btn = document.getElementById("fct-actualizar-btn");
  var loading = document.getElementById("fct-loading");
  var loadingTxt = document.getElementById("fct-loading-txt");

  // Iniciar estado de carga
  btn.disabled = true;
  btn.style.display = "none";
  loading.classList.remove("ob-hidden");
  loadingTxt.textContent = "Sincronizando facturas…";

  // Mensajes de progreso simulados
  var mensajes = [
    "Conectando con el SAT…",
    "Descargando CFDIs…",
    "Procesando ingresos…",
    "Procesando egresos…",
    "Calculando totales…",
    "Finalizando…",
  ];
  var idx = 0;
  var intervalo = setInterval(function () {
    idx++;
    if (idx < mensajes.length) {
      loadingTxt.textContent = mensajes[idx];
    }
  }, 1000);

  // Al terminar los 6 segundos
  setTimeout(function () {
    clearInterval(intervalo);

    // Restaurar valores en Inicio
    var elIngr = document.getElementById("inicio-ingresos");
    var elEgr = document.getElementById("inicio-egresos");
    if (elIngr) elIngr.textContent = _FCT.INGRESOS_ORIG;
    if (elEgr) elEgr.textContent = _FCT.EGRESOS_ORIG;

    // Cerrar modal
    document.getElementById("fct-overlay").classList.add("ob-hidden");
    document.getElementById("fct-modal").classList.add("ob-hidden");
    loading.classList.add("ob-hidden");
    btn.disabled = false;
    btn.style.display = "";

    // Deseleccionar celdas para la próxima vez
    document
      .querySelectorAll(".fct-mes-cell.fct-selected")
      .forEach(function (c) {
        c.classList.remove("fct-selected");
      });

    // Mensaje de éxito reutilizando el estilo ob-validacion-ok como toast
    _fctToast("Facturas actualizadas correctamente");
  }, 6000);
}

/** Muestra un toast de éxito temporal */
function _fctToast(msg) {
  var toast = document.createElement("div");
  toast.style.cssText = [
    "position:fixed",
    "bottom:28px",
    "left:50%",
    "transform:translateX(-50%)",
    "background:var(--primary)",
    "color:#fff",
    "padding:10px 22px",
    "border-radius:8px",
    "font-size:14px",
    "z-index:99999",
    "box-shadow:0 4px 18px rgba(0,0,0,.18)",
    "display:flex",
    "align-items:center",
    "gap:10px",
    "animation:ob-fadeIn .25s ease both",
  ].join(";");
  toast.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" style="width:18px;height:18px;flex-shrink:0"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>' +
    msg;
  document.body.appendChild(toast);
  setTimeout(function () {
    toast.remove();
  }, 3500);
}

// ══════════════════════════════════════════════
//  PASO PROCESAMIENTO DE FACTURAS
// ══════════════════════════════════════════════

function _obIniciarProc() {
  // Recoger meses seleccionados en orden
  var meses = Array.from(
    document.querySelectorAll(".ob-mes-item.ob-mes-selected"),
  ).map(function (btn) {
    var sp = btn.querySelector("span");
    return sp ? sp.textContent.trim() : btn.textContent.trim();
  });
  if (!meses.length) {
    irAPaso(3);
    return;
  }

  var MSGS = [
    "Sincronizando facturas de {mes}…",
    "Validando vigencia de CFDI…",
    "Identificando ingresos y gastos…",
    "Determinando impuestos…",
    "Generando resumen fiscal…",
  ];
  var MS_POR_MES = 3000;
  var MS_POR_MSG = MS_POR_MES / MSGS.length;

  // Construir lista visual
  var lista = document.getElementById("ob-proc-lista");
  var svgPending =
    '<svg class="ob-proc-item-ico pending" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>';
  var svgSpin =
    '<svg class="ob-proc-item-ico spin"    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a9 9 0 1 0 9 9" stroke-linecap="round"/></svg>';
  var svgCheck =
    '<svg class="ob-proc-item-ico check"   viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>';

  lista.innerHTML = meses
    .map(function (m, i) {
      return (
        '<div class="ob-proc-item" id="ob-proc-item-' +
        i +
        '">' +
        svgPending +
        "<span>" +
        m +
        "</span></div>"
      );
    })
    .join("");

  // Resetear barra y contador
  var bar = document.getElementById("ob-proc-bar");
  var counter = document.getElementById("ob-proc-counter");
  var mesEl = document.getElementById("ob-proc-mes");
  var msgEl = document.getElementById("ob-proc-msg");
  bar.style.transition = "none";
  bar.style.width = "0%";

  var idx = 0;
  var msgIdx = 0;
  var msgTimer = null;

  function procesarSiguiente() {
    if (idx >= meses.length) {
      // Todo terminado → ir a "Todo listo"
      clearInterval(msgTimer);
      setTimeout(function () {
        irAPaso(3);
      }, 400);
      return;
    }

    var mes = meses[idx];
    counter.textContent = "Procesando mes " + (idx + 1) + " de " + meses.length;
    mesEl.textContent = mes;

    // Marcar ítem activo
    var itemEl = document.getElementById("ob-proc-item-" + idx);
    if (itemEl) {
      itemEl.classList.add("active");
      itemEl.querySelector(".ob-proc-item-ico").outerHTML = svgSpin;
      // re-select after innerHTML replacement
      itemEl.innerHTML = svgSpin + "<span>" + mes + "</span>";
      itemEl.querySelector(".ob-proc-item-ico").className =
        "ob-proc-item-ico spin";
    }

    // Barra de progreso
    requestAnimationFrame(function () {
      bar.style.transition = "width " + (MS_POR_MES * 0.9) / 1000 + "s ease";
      bar.style.width = ((idx + 1) / meses.length) * 100 + "%";
    });

    // Rotar mensajes
    msgIdx = 0;
    msgEl.textContent = MSGS[0].replace("{mes}", mes);
    clearInterval(msgTimer);
    msgTimer = setInterval(function () {
      msgIdx++;
      if (msgIdx < MSGS.length) {
        msgEl.style.opacity = "0";
        setTimeout(function () {
          msgEl.textContent = MSGS[msgIdx].replace("{mes}", mes);
          msgEl.style.opacity = "1";
        }, 150);
      }
    }, MS_POR_MSG);

    // Al terminar este mes
    setTimeout(function () {
      clearInterval(msgTimer);
      // Marcar como completado
      var el = document.getElementById("ob-proc-item-" + idx);
      if (el) {
        el.classList.remove("active");
        el.classList.add("done");
        el.innerHTML = svgCheck + "<span>" + mes + "</span>";
        el.querySelector(".ob-proc-item-ico").className =
          "ob-proc-item-ico check";
      }
      idx++;
      procesarSiguiente();
    }, MS_POR_MES);
  }

  procesarSiguiente();
}

// ══════════════════════════════════════════════
//  TARJETA ESTADO DE IMPUESTOS
// ══════════════════════════════════════════════
function taxSetEstado(estado, mesesPendientes) {
  var elPending = document.getElementById("tax-state-pending");
  var elOk = document.getElementById("tax-state-ok");
  if (!elPending || !elOk) return;

  if (estado === "pendiente") {
    var n = mesesPendientes || 1;
    var txt =
      n === 1
        ? "Se detectó 1 mes pendiente por presentar"
        : "Se detectaron " + n + " meses pendientes por presentar";
    var sub = document.getElementById("tax-pending-meses");
    if (sub) sub.textContent = txt;
    elPending.style.display = "";
    elOk.style.display = "none";
  } else {
    elOk.style.display = "";
    elPending.style.display = "none";
  }
}
