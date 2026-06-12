// ── LOGIN OVERLAY ──
function doLogin() {
  const btn = document.getElementById("loginBtn");
  btn.classList.add("loading");

  setTimeout(() => {
    const overlay = document.getElementById("loginOverlay");
    overlay.classList.add("hide");

    // Eliminar del DOM después de la animación para que no bloquee nada
    setTimeout(() => {
      overlay.style.display = "none";
    }, 450);
  }, 900);
}

// Permitir Enter para hacer login
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("keydown", (e) => {
    const overlay = document.getElementById("loginOverlay");
    if (e.key === "Enter" && overlay && !overlay.classList.contains("hide")) {
      doLogin();
    }
  });
});

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

function validarPago() {
  const btn = document.getElementById("ob-validarPago-btn");
  const progressWrap = document.getElementById("ob-progressPago-wrap");
  const progressBar = document.getElementById("ob-progressPago-bar");
  const validacionOk = document.getElementById("ob-validacionPago-ok");
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

/** Selección de mes en paso 2: selecciona uno o más meses */
function seleccionarMes(btn) {
  btn.classList.toggle("ob-mes-selected");

  const haySeleccionados =
    document.querySelectorAll(".ob-mes-item.ob-mes-selected").length > 0;

  const continuar = document.getElementById("ob-paso2-continuar");
  if (continuar) continuar.disabled = !haySeleccionados;
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
//  MODAL DESCARGA MASIVA DE FACTURAS
// ══════════════════════════════════════════════

const _FCT = {
  ANOS: [2026],
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
  MESES_COMPLETO: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  INGRESOS_ORIG: "$ 285,400",
  EGRESOS_ORIG: "$ 248,200",
  // Set de claves "anio-mes" ya descargados. Persiste en memoria durante la sesión.
  descargados: new Set(),
  // Celda actualmente seleccionada
  celdaActual: null,
  // Indica si hay un proceso activo (bloquea cierre por overlay)
  procesando: false,
};

/** Devuelve la clave única para una celda: "2026-4" */
function _fctKey(anio, mes) {
  return anio + "-" + mes;
}

/** Construye la rejilla la primera vez (idempotente) */
function _fctBuildGrid() {
  var tbody = document.getElementById("fct-tbody");
  if (!tbody || tbody.dataset.built) return;
  tbody.dataset.built = "1";

  var ahora = new Date();
  var anioActual = ahora.getFullYear();
  var mesActual = ahora.getMonth(); // 0-based

  _FCT.ANOS.forEach(function (anio) {
    var tr = document.createElement("tr");

    var tdAnio = document.createElement("td");
    tdAnio.textContent = anio;
    tr.appendChild(tdAnio);

    _FCT.MESES.forEach(function (mes, idx) {
      var td = document.createElement("td");
      var btn = document.createElement("button");
      btn.className = "fct-mes-cell";
      btn.textContent = mes;
      btn.dataset.anio = anio;
      btn.dataset.mes = idx;

      if (anio > anioActual || (anio === anioActual && idx > mesActual)) {
        btn.disabled = true;
      } else {
        btn.addEventListener("click", function () {
          _fctSeleccionarCelda(btn);
        });
      }
      td.appendChild(btn);
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}

/**
 * Gestiona la selección única de una celda.
 * - Deselecciona la celda previa.
 * - Marca la nueva como seleccionada.
 * - Detecta si el mes ya fue descargado y activa el flujo correspondiente.
 */
function _fctSeleccionarCelda(btn) {
  // Deseleccionar la celda anterior
  if (_FCT.celdaActual && _FCT.celdaActual !== btn) {
    _FCT.celdaActual.classList.remove("fct-selected");
  }

  // Toggle: si clic en la misma celda ya seleccionada, deseleccionar
  if (_FCT.celdaActual === btn && btn.classList.contains("fct-selected")) {
    btn.classList.remove("fct-selected");
    _FCT.celdaActual = null;
    _fctOcultarAcciones();
    return;
  }

  btn.classList.add("fct-selected");
  _FCT.celdaActual = btn;

  var anio = parseInt(btn.dataset.anio);
  var mes = parseInt(btn.dataset.mes);
  var mesNombre = _FCT.MESES_COMPLETO[mes] + " " + anio;

  // Actualizar etiqueta dinámica
  document.getElementById("fct-seleccion-texto").textContent = mesNombre;
  document.getElementById("fct-seleccion-label").classList.remove("ob-hidden");

  // Ocultar éxito previo si estaba visible
  document.getElementById("fct-exito").classList.add("ob-hidden");

  var key = _fctKey(anio, mes);
  if (_FCT.descargados.has(key)) {
    // Mes ya descargado → mostrar alerta de verificación
    document
      .getElementById("fct-alerta-verificar")
      .classList.remove("ob-hidden");
    document.getElementById("fct-actualizar-btn").classList.add("ob-hidden");
  } else {
    // Mes nuevo → mostrar botón de descarga masiva
    document.getElementById("fct-alerta-verificar").classList.add("ob-hidden");
    document.getElementById("fct-actualizar-btn").classList.remove("ob-hidden");
  }
}

/** Oculta todos los controles de acción (sin celda seleccionada) */
function _fctOcultarAcciones() {
  document.getElementById("fct-seleccion-label").classList.add("ob-hidden");
  document.getElementById("fct-actualizar-btn").classList.add("ob-hidden");
  document.getElementById("fct-alerta-verificar").classList.add("ob-hidden");
  document.getElementById("fct-exito").classList.add("ob-hidden");
}

/** Abre el modal y resetea la UI a estado inicial */
function abrirModalFacturas() {
  _fctBuildGrid();

  // Refrescar clases "descargado" en la rejilla según el Set en memoria
  document.querySelectorAll(".fct-mes-cell").forEach(function (btn) {
    var key = _fctKey(parseInt(btn.dataset.anio), parseInt(btn.dataset.mes));
    btn.classList.toggle("fct-mes-descargado", _FCT.descargados.has(key));
  });

  // Restaurar estado visual
  if (_FCT.celdaActual) {
    _FCT.celdaActual.classList.remove("fct-selected");
    _FCT.celdaActual = null;
  }
  _fctOcultarAcciones();
  document.getElementById("fct-loading").classList.add("ob-hidden");

  document.getElementById("fct-overlay").classList.remove("ob-hidden");
  document.getElementById("fct-modal").classList.remove("ob-hidden");
}

/**
 * Cierra el modal.
 * Bloqueado mientras haya un proceso activo (_FCT.procesando === true).
 */
function cerrarModalFacturas() {
  if (_FCT.procesando) return;
  document.getElementById("fct-overlay").classList.add("ob-hidden");
  document.getElementById("fct-modal").classList.add("ob-hidden");
}

/** Simula la descarga masiva de un mes */
function actualizarFacturas() {
  if (!_FCT.celdaActual) return;

  var anio = parseInt(_FCT.celdaActual.dataset.anio);
  var mes = parseInt(_FCT.celdaActual.dataset.mes);
  var mesNombre = _FCT.MESES_COMPLETO[mes] + " " + anio;

  var btn = document.getElementById("fct-actualizar-btn");
  var loading = document.getElementById("fct-loading");
  var loadTxt = document.getElementById("fct-loading-txt");
  var exito = document.getElementById("fct-exito");
  var exitoTxt = document.getElementById("fct-exito-txt");

  _FCT.procesando = true;
  btn.classList.add("ob-hidden");
  document.getElementById("fct-alerta-verificar").classList.add("ob-hidden");
  loading.classList.remove("ob-hidden");
  loadTxt.textContent = "Conectando con el SAT…";

  var mensajes = [
    "Conectando con el SAT…",
    "Descargando CFDIs de " + mesNombre + "…",
    "Procesando ingresos…",
    "Procesando egresos…",
    "Calculando totales…",
    "Finalizando…",
  ];
  var idx = 0;
  var intervalo = setInterval(function () {
    idx++;
    if (idx < mensajes.length) loadTxt.textContent = mensajes[idx];
  }, 900);

  setTimeout(function () {
    clearInterval(intervalo);
    loading.classList.add("ob-hidden");
    _FCT.procesando = false;

    // Marcar mes como descargado
    var key = _fctKey(anio, mes);
    _FCT.descargados.add(key);
    if (_FCT.celdaActual) {
      _FCT.celdaActual.classList.add("fct-mes-descargado");
    }

    // Restaurar valores del dashboard
    var elIngr = document.getElementById("inicio-ingresos");
    var elEgr = document.getElementById("inicio-egresos");
    if (elIngr) elIngr.textContent = _FCT.INGRESOS_ORIG;
    if (elEgr) elEgr.textContent = _FCT.EGRESOS_ORIG;

    // Mostrar mensaje de éxito — el modal permanece abierto
    exitoTxt.textContent =
      "¡Descarga de " +
      mesNombre +
      " completada con éxito! Puedes cerrar esta ventana, continuar con la sincronización de facturas de otro mes o realizar una verificación de la vigencia de tus facturas.";
    exito.classList.remove("ob-hidden");
  }, 5400);
}

/** Inicia el proceso de verificación de facturas de un mes ya descargado */
function fctIniciarVerificacion() {
  if (!_FCT.celdaActual) return;

  var anio = parseInt(_FCT.celdaActual.dataset.anio);
  var mes = parseInt(_FCT.celdaActual.dataset.mes);
  var mesNombre = _FCT.MESES_COMPLETO[mes] + " " + anio;

  var loading = document.getElementById("fct-loading");
  var loadTxt = document.getElementById("fct-loading-txt");
  var exito = document.getElementById("fct-exito");
  var exitoTxt = document.getElementById("fct-exito-txt");

  _FCT.procesando = true;
  document.getElementById("fct-alerta-verificar").classList.add("ob-hidden");
  document.getElementById("fct-actualizar-btn").classList.add("ob-hidden");
  loading.classList.remove("ob-hidden");
  loadTxt.textContent = "Iniciando verificación…";

  var mensajes = [
    "Iniciando verificación…",
    "Consultando SAT…",
    "Detectando cancelaciones…",
  ];
  var idx = 0;
  var intervalo = setInterval(function () {
    idx++;
    if (idx < mensajes.length) loadTxt.textContent = mensajes[idx];
  }, 900);

  setTimeout(function () {
    clearInterval(intervalo);
    loading.classList.add("ob-hidden");
    _FCT.procesando = false;

    // Mostrar resultado de verificación — el modal permanece abierto
    exitoTxt.textContent =
      "Verificación de " +
      mesNombre +
      " completada. Todos los CFDIs están sincronizados correctamente.";
    exito.classList.remove("ob-hidden");
  }, 5400);
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

// ── DETALLE DE INGRESO ──────────────────────────────────────────────────────

/**
 * Muestra el detalle de una factura al hacer clic en una fila de la tabla de
 * ingresos. Extrae los data-* de la fila clicada y los mapea al panel de
 * detalle. Para conectar datos reales en el futuro, sólo hay que enriquecer
 * los data-* del <tr> o llamar a una API usando `row.dataset.folio`.
 *
 * @param {HTMLTableRowElement} row - La fila <tr> clicada
 */
function verDetalleIngreso(row) {
  var d = row.dataset;

  // ── Folio y estado ──
  var folio = d.folio || "—";
  var status = d.status || "Vigente";
  var metodo = d.metodo || "—";
  var receptor = d.receptor || "—";
  var fecha = d.fecha || "—";
  var totalRaw = d.total || "0.00";

  // Folio
  document.getElementById("det-folio").textContent = folio;

  // Estado badge
  var badge = document.getElementById("det-estado-badge");
  var badgeTexto = document.getElementById("det-estado-texto");
  badgeTexto.textContent = status;
  badge.classList.toggle("cancelado", status === "Cancelado");

  // Receptor
  document.getElementById("det-receptor").textContent = receptor;

  // Método de pago
  document.getElementById("det-metodo").textContent = metodo;
  document.getElementById("det-metodo-desc").textContent =
    metodo === "PPD"
      ? "Pago en Parcialidades o Diferido"
      : metodo === "PUE"
        ? "Pago en Una Sola Exhibición"
        : "—";

  // Fecha
  document.getElementById("det-fecha").textContent = fecha;

  // UUID (simulado — reemplazar con dato real cuando esté disponible)
  document.getElementById("det-uuid").textContent =
    "d5b6e" +
    folio.replace("GASC-", "") +
    "-3f2a-4c8b-" +
    folio.replace("GASC-", "") +
    "1a-0000ffcc" +
    folio.replace("GASC-", "");

  // ── Conceptos (datos de ejemplo; mapear a datos reales en el futuro) ──
  var totalNum = parseFloat(totalRaw.replace(/,/g, ""));
  var iva = +((totalNum / 1.16) * 0.16).toFixed(2);
  var subtotal = +(totalNum - iva).toFixed(2);
  var precioUnit = +subtotal.toFixed(2);

  var tbody = document.getElementById("det-conceptos-tbody");
  tbody.innerHTML =
    "<tr>" +
    "<td>Servicio profesional — " +
    folio +
    "</td>" +
    '<td style="text-align:right">1</td>' +
    '<td style="text-align:right mono">$ ' +
    precioUnit.toLocaleString("es-MX", { minimumFractionDigits: 2 }) +
    "</td>" +
    '<td style="text-align:right mono">$ ' +
    precioUnit.toLocaleString("es-MX", { minimumFractionDigits: 2 }) +
    "</td>" +
    "</tr>";

  // Totales
  document.getElementById("det-subtotal").textContent =
    "$ " + subtotal.toLocaleString("es-MX", { minimumFractionDigits: 2 });
  document.getElementById("det-iva").textContent =
    "$ " + iva.toLocaleString("es-MX", { minimumFractionDigits: 2 });
  document.getElementById("det-total").textContent =
    "$ " + totalNum.toLocaleString("es-MX", { minimumFractionDigits: 2 });

  // ── Alternar paneles ──
  document.getElementById("ingresos-tabla").classList.add("ob-hidden");
  document.getElementById("ingresos-detalle").classList.remove("ob-hidden");

  // Scroll al inicio del main
  var main =
    document.querySelector("main") || document.querySelector(".main-content");
  if (main) main.scrollTop = 0;
}

/**
 * Regresa a la tabla de ingresos desde el panel de detalle.
 * No recarga ni pierde el estado de la vista (filtros, scroll, etc.).
 */
function regresarAIngresos() {
  document.getElementById("ingresos-detalle").classList.add("ob-hidden");
  document.getElementById("ingresos-tabla").classList.remove("ob-hidden");
}

// ── DETALLE DE EGRESO ───────────────────────────────────────────────────────

/**
 * Muestra el detalle de un CFDI de egreso al hacer clic en una fila.
 * Para conectar datos reales, enriquecer los data-* del <tr> o hacer
 * un fetch usando `row.dataset.folio` como llave.
 *
 * @param {HTMLTableRowElement} row - La fila <tr> clicada
 */
function verDetalleEgreso(row) {
  var d = row.dataset;

  var folio = d.folio || "—";
  var status = d.status || "Vigente";
  var metodo = d.metodo || "—";
  var emisor = d.emisor || "—";
  var totalRaw = d.total || "0.00";
  var deducible = d.deducible || "—";

  // Folio
  document.getElementById("det-eg-folio").textContent = folio;

  // Estado badge
  var badge = document.getElementById("det-eg-estado-badge");
  document.getElementById("det-eg-estado-texto").textContent = status;
  badge.classList.toggle("cancelado", status === "Cancelado");

  // Emisor (logo inicial + nombre + RFC simulado)
  var inicial = emisor.trim().charAt(0).toUpperCase();
  document.getElementById("det-eg-emisor-inicial").textContent = inicial;
  document.getElementById("det-eg-emisor-nombre").textContent =
    emisor.toUpperCase();
  document.getElementById("det-eg-emisor-rfc").textContent =
    "RFC: " + inicial + "XX010101000";

  // Método de pago
  document.getElementById("det-eg-metodo").textContent = metodo;
  document.getElementById("det-eg-metodo-desc").textContent =
    metodo === "PPD"
      ? "Pago en Parcialidades o Diferido"
      : metodo === "PUE"
        ? "Pago en Una Sola Exhibición"
        : "—";

  // Deducible
  var deducibleEl = document.getElementById("det-eg-deducible");
  deducibleEl.textContent = deducible;
  deducibleEl.style.color =
    deducible === "Sí"
      ? "var(--green)"
      : deducible === "Parcial"
        ? "#b7770d"
        : deducible === "No"
          ? "#c0392b"
          : "inherit";

  // UUID simulado
  document.getElementById("det-eg-uuid").textContent =
    "a3f9c" +
    folio.replace("GSCE-", "") +
    "-8d1b-4e7a-" +
    folio.replace("GSCE-", "") +
    "b2-0011ddaa" +
    folio.replace("GSCE-", "");

  // Conceptos + totales
  var totalNum = parseFloat(totalRaw.replace(/,/g, ""));
  var iva = +((totalNum / 1.16) * 0.16).toFixed(2);
  var subtotal = +(totalNum - iva).toFixed(2);

  document.getElementById("det-eg-conceptos-tbody").innerHTML =
    "<tr>" +
    "<td>Producto / servicio — " +
    folio +
    "</td>" +
    '<td style="text-align:right">1</td>' +
    '<td style="text-align:right">$ ' +
    subtotal.toLocaleString("es-MX", { minimumFractionDigits: 2 }) +
    "</td>" +
    '<td style="text-align:right">$ ' +
    subtotal.toLocaleString("es-MX", { minimumFractionDigits: 2 }) +
    "</td>" +
    "</tr>";

  document.getElementById("det-eg-subtotal").textContent =
    "$ " + subtotal.toLocaleString("es-MX", { minimumFractionDigits: 2 });
  document.getElementById("det-eg-iva").textContent =
    "$ " + iva.toLocaleString("es-MX", { minimumFractionDigits: 2 });
  document.getElementById("det-eg-total").textContent =
    "$ " + totalNum.toLocaleString("es-MX", { minimumFractionDigits: 2 });

  // Alternar paneles
  document.getElementById("gastos-tabla").classList.add("ob-hidden");
  document.getElementById("gastos-detalle").classList.remove("ob-hidden");

  var main =
    document.querySelector("main") || document.querySelector(".main-content");
  if (main) main.scrollTop = 0;
}

/**
 * Regresa a la tabla de gastos desde el panel de detalle.
 */
function regresarAGastos() {
  document.getElementById("gastos-detalle").classList.add("ob-hidden");
  document.getElementById("gastos-tabla").classList.remove("ob-hidden");
}

// ══════════════════════════════════════════════
//  SITUACIÓN TRIBUTARIA — propuesta de diseño
//  (sin conexión a datos reales, solo simulación)
// ══════════════════════════════════════════════

var ST_ARC_LEN = 157;

/** Escenarios de simulación */
var ST_ESCENARIOS = {
  buena: {
    puntaje: 950,
    items: [
      { ok: true, texto: "Declaraciones al corriente" },
      { ok: true, texto: "No hay facturas con errores" },
      { ok: true, texto: "Facturas al día" },
      { ok: true, texto: "Información fiscal completa" },
      { ok: false, texto: "1 notificación pendiente de leer", nivel: "warn" },
    ],
  },
  media: {
    puntaje: 680,
    items: [
      { ok: true, texto: "Declaraciones al corriente" },
      { ok: false, texto: "3 facturas con posibles errores", nivel: "warn" },
      {
        ok: false,
        texto: "Sincronización de facturas desactualizada",
        nivel: "warn",
      },
      { ok: true, texto: "Sin facturas canceladas pendientes" },
      { ok: false, texto: "5 notificaciones sin leer", nivel: "warn" },
    ],
  },
  mala: {
    puntaje: 340,
    items: [
      { ok: false, texto: "2 meses de declaraciones pendientes", nivel: "mal" },
      { ok: false, texto: "8 facturas con RFC incorrecto", nivel: "mal" },
      { ok: false, texto: "Sin descargas SAT en 60 días", nivel: "mal" },
      { ok: false, texto: "Información fiscal incompleta", nivel: "warn" },
      { ok: false, texto: "12 notificaciones sin leer", nivel: "warn" },
    ],
  },
};

function stClaseEstado(puntaje) {
  if (puntaje >= 900) return { clase: "st-excelente", etiqueta: "Excelente" };
  if (puntaje >= 800) return { clase: "st-muybien", etiqueta: "Muy bien" };
  if (puntaje >= 650) return { clase: "st-bien", etiqueta: "Bien" };
  if (puntaje >= 500) return { clase: "st-atencion", etiqueta: "Atención" };
  return { clase: "st-riesgo", etiqueta: "Riesgo" };
}

function stSimular(escenario) {
  var datos = ST_ESCENARIOS[escenario];
  if (!datos) return;

  var puntaje = datos.puntaje;
  var info = stClaseEstado(puntaje);

  // Arco gauge
  var arc = document.getElementById("st-arc");
  if (arc) {
    var fill = (puntaje / 1000) * ST_ARC_LEN;
    arc.setAttribute("stroke-dasharray", fill + " " + ST_ARC_LEN);
  }

  // Número y etiqueta
  var elPuntaje = document.getElementById("st-puntaje");
  var elLabel = document.getElementById("st-estado-label");
  if (elPuntaje) elPuntaje.textContent = puntaje;
  if (elLabel) elLabel.textContent = info.etiqueta;

  // Clase de color en el cuerpo
  var cuerpo = document.getElementById("st-cuerpo");
  if (cuerpo) cuerpo.className = "st-cuerpo " + info.clase;

  // Checklist
  var lista = document.getElementById("st-checklist");
  if (lista) {
    lista.innerHTML = datos.items
      .map(function (item) {
        var cls = item.ok ? "st-ok" : item.nivel || "warn";
        var ico = item.ok ? "✓" : "!";
        return (
          '<li class="' +
          cls +
          '"><span class="st-ico">' +
          ico +
          "</span><span>" +
          item.texto +
          "</span></li>"
        );
      })
      .join("");
  }
}

// Mostrar escenario "buena" al cargar como estado inicial de la propuesta
document.addEventListener("DOMContentLoaded", function () {
  stSimular("buena");
});
