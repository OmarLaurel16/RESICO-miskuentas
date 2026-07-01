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
    .querySelectorAll("#view-buzon .cfdi-tipos-btns .btn-primary")
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

  // ── Sidebar desktop (lateral): mantener el submenú del módulo activo
  // abierto mientras se navega dentro de él, y cerrarlo al cambiar de módulo ──
  if (window.matchMedia("(min-width: 1160px)").matches) {
    const activeBtn = document.querySelector(".nav-module-btn.active");
    const activeSub = activeBtn?.nextElementSibling;

    if (activeSub && activeSub.classList.contains("nav-sub")) {
      if (!activeSub.classList.contains("open")) {
        closeAllSubmenus();
        activeSub.classList.add("open");
        activeBtn.classList.add("open");
      }
    } else {
      closeAllSubmenus();
    }
  }
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

// ── Selección única de mes en filtro de declaraciones ──
function seleccionarMesFiltro(btn) {
  document
    .querySelectorAll(".months-filter-btns.active")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
}

// ── CALCULAR DECLARACIÓN ──
function calcularDeclaracion() {
  const res = document.getElementById("calculo-resultado");
  res.style.display = "block";
  res.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ── Mostrar/ocultar el detalle completo del cálculo (resumen vs. desglose) ──
function toggleDetalleCalculo() {
  const detalle = document.getElementById("calculo-detalle");
  const txt = document.getElementById("toggle-detalle-calculo-txt");
  const oculto = detalle.classList.toggle("ob-hidden");
  txt.textContent = oculto ? "Ver detalle" : "Ocultar detalle";

  const resumen = document.querySelector(".resumen-impuestos-grid"); // ← NUEVA
  if (resumen) resumen.style.display = oculto ? "" : "none"; // ← NUEVA
}

// ── Impuestos: alternar entre la vista normal y el historial de declaraciones ──
function mostrarHistorialDeclaraciones() {
  document.getElementById("impuestos-vista-normal").style.display = "none";
  document.getElementById("impuestos-vista-historial").style.display = "block";
  document.getElementById("btn-ver-historial-declaraciones").style.display =
    "none";
}

function regresarAImpuestos() {
  document.getElementById("impuestos-vista-historial").style.display = "none";
  document.getElementById("impuestos-vista-normal").style.display = "block";
  document.getElementById("btn-ver-historial-declaraciones").style.display = "";
}
// ── Preview de la presentación ──
function presentacionPrevista() {
  const res = document.getElementById("presentation-preview");
  res.style.display = "block";
  res.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
// ── Validación de la presentación ──

function presentacionValidacion() {
  const btn = document.getElementById("validate-btn");

  btn.disabled = true;
  btn.innerHTML = `
    <span class="fct-spinner"></span>
    <span style="margin-left:8px;">Validando...</span>
  `;

  setTimeout(() => {
    document.getElementById("presentation-validation").style.display = "block";
    btn.style.display = "none";
  }, 1000);
}

// ── Presentación final: pantalla de carga amigable + confirmación ──
function iniciarPresentacionFinal() {
  const btn = document.getElementById("btn-presentar-declaracion");
  if (btn.disabled) return;

  const loading = document.getElementById("presentacion-final-loading");
  const loadTxt = document.getElementById("presentacion-final-loading-txt");
  const exito = document.getElementById("presentacion-final-exito");

  document.getElementById("presentation-validation").style.display = "none";
  loading.classList.remove("ob-hidden");
  loadTxt.textContent = "Conectando con el SAT…";
  loading.scrollIntoView({ behavior: "smooth", block: "nearest" });

  var mensajes = [
    "Conectando con el SAT…",
    "Enviando declaración…",
    "Generando acuse de recibo…",
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
    exito.classList.remove("ob-hidden");
    exito.scrollIntoView({ behavior: "smooth", block: "nearest" });
    taxSetEstado("ok");
  }, 3800);
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

  // cerrar submenu al navegar desde un link (solo móvil/tablet;
  // en escritorio lo gestiona navigate() para mantenerlo abierto dentro del mismo módulo)
  document.querySelectorAll(".nav-sub a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 1160px)").matches) {
        closeAllSubmenus();
      }
    });
  });

  // cerrar con ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllSubmenus();
      closeAlertasModal();
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
  metodo: "efirma",
};

/** Cambia el método de acceso al SAT entre e.firma y CIEC */
function seleccionarMetodoAcceso(metodo) {
  _ob.metodo = metodo;

  document
    .getElementById("ob-metodo-btn-efirma")
    .classList.toggle("active", metodo === "efirma");
  document
    .getElementById("ob-metodo-btn-ciec")
    .classList.toggle("active", metodo === "ciec");

  document
    .getElementById("ob-campos-efirma")
    .classList.toggle("ob-hidden", metodo !== "efirma");
  document
    .getElementById("ob-campos-ciec")
    .classList.toggle("ob-hidden", metodo !== "ciec");

  const label = document.getElementById("btn-upload-files-label");
  if (label)
    label.textContent = metodo === "efirma" ? "Subir e.firma" : "Ingresar CIEC";
}

/** Muestra la subsección de subida de archivos */
function mostrarUploader() {
  const uploader = document.getElementById("ob-uploader");
  const btn = document.getElementById("btn-upload-files");
  if (!uploader) return;
  uploader.classList.remove("ob-hidden");
  btn.classList.add("ob-hidden");
}

/** Animación de validación → muestra resultado exitoso (e.firma o CIEC) */
function validarAccesoSAT() {
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

    // Resetear método de acceso (CIEC/e.firma) y campos CIEC
    const ciecRfc = document.getElementById("ob-ciec-rfc");
    const ciecPass = document.getElementById("ob-ciec-password");
    if (ciecRfc) ciecRfc.value = "";
    if (ciecPass) ciecPass.value = "";
    if (document.getElementById("ob-metodo-btn-efirma")) {
      seleccionarMetodoAcceso("efirma");
    }

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
    elPending.style.display = "flex";
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
      { ok: false, texto: "8 facturas con errores", nivel: "mal" },
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

// Compartir nativo para IOS
function compartirNativo() {
  if (navigator.share) {
    navigator
      .share({
        title: document.title,
        text: "¡Mira este contenido tan interesante!",
        url: window.location.href,
      })
      .then(() => console.log("Contenido compartido con éxito"))
      .catch((error) =>
        console.log("El usuario canceló o hubo un error:", error),
      );
  } else {
    window.open(
      "https://wa.me" +
        encodeURIComponent("¡Mira esto! " + window.location.href),
      "_blank",
    );
  }
}

// Alerts accordion

document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("accordion-toggle");
  const contentCard = document.getElementById("accordion-content");

  toggleButton.addEventListener("click", () => {
    contentCard.classList.toggle("is-open");
    toggleButton.classList.toggle("active");
  });
});

function openAlertasModal() {
  const overlay = document.getElementById("alertas-modal-overlay");
  const modal = document.getElementById("alertas-modal");
  const body = document.getElementById("alertas-modal-body");

  // Clonar las alertas del accordion original (sin duplicar en el DOM)
  const fuente = document.getElementById("accordion-content");
  if (fuente && body) {
    body.innerHTML = "";
    fuente.querySelectorAll(".alert-item").forEach(function (item) {
      body.appendChild(item.cloneNode(true));
    });
  }

  overlay.classList.remove("ob-hidden");
  modal.classList.remove("ob-hidden");
  // Forzar reflow para que la animación CSS arranque
  modal.getBoundingClientRect();
  modal.classList.add("alertas-modal--open");
  overlay.classList.add("alertas-overlay--open");
  document.body.style.overflow = "hidden";
}

function closeAlertasModal() {
  const overlay = document.getElementById("alertas-modal-overlay");
  const modal = document.getElementById("alertas-modal");

  modal.classList.remove("alertas-modal--open");
  overlay.classList.remove("alertas-overlay--open");

  setTimeout(function () {
    modal.classList.add("ob-hidden");
    overlay.classList.add("ob-hidden");
    document.body.style.overflow = "";
  }, 260);
}

function openChatBot() {
  document.getElementById("view-chat-with-bot").classList.remove("ob-hidden");
}

function closeChatBot() {
  const bot = document.querySelector(".chatwith-bot-container");
  const view = document.getElementById("view-chat-with-bot");
  bot.classList.add("closing");
  setTimeout(() => {
    view.classList.add("ob-hidden");
    bot.classList.remove("closing");
  }, 250);
}

// ══════════════════════════════════════════════
//  CAROUSEL DE CONSEJOS FISCALES
// ══════════════════════════════════════════════

var _carousel = {
  idx: 0,
  consejos: [
    {
      titulo: "Gasolina y forma de pago",
      texto:
        "Procura que la forma de pago sea distinta a efectivo para que sea deducible.",
      icon: '<path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0v-6.998a2 2 0 0 0-.59-1.42L18 5"/><path d="M14 21V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16"/><path d="M2 21h13"/><path d="M3 9h11"/>',
    },
    {
      titulo: "Gastos en efectivo mayores a $2,000",
      texto:
        "Todo gasto mayor a $2,000 pagado en efectivo es considerado no deducible por la autoridad fiscal.",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-dollar-sign-icon lucide-circle-dollar-sign"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>',
    },
    {
      titulo: "Emite tus complementos de pago a tiempo",
      texto:
        "Cuando cobres en parcialidades, emite el complemento de pago dentro de los primeros 5 días del mes siguiente. Evitarás diferencias con el SAT.",
      icon: '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>',
    },
    {
      titulo: "Revisa tu buzón tributario",
      texto:
        "El SAT notifica auditorías y requerimientos solo por buzón. Revisarlo frecuentemente puede evitarte multas por omisión.",
      icon: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    },
    {
      titulo: "Facturas canceladas",
      texto:
        "Si un cliente cancela una factura que ya declaraste, deberás reflejar ese ajuste en tu siguiente declaración para no pagar de más.",
      icon: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M9 15l2 2 4-4"/>',
    },
    {
      titulo: "Límite RESICO",
      texto:
        "Si tus ingresos acumulados superan $3.5 millones en el año, saldrás automáticamente del régimen RESICO. Mantén control de tus ingresos.",
      icon: '<line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/>',
    },
  ],
};

function _carouselRender() {
  var c = _carousel.consejos[_carousel.idx];

  document.getElementById("carousel-titulo").textContent = c.titulo;
  document.getElementById("carousel-texto").textContent = c.texto;
  document.getElementById("carousel-icon").innerHTML = c.icon;

  // Dots
  var dotsEl = document.getElementById("carousel-dots");
  dotsEl.querySelectorAll(".carousel-dot").forEach(function (d, i) {
    d.style.background = i === _carousel.idx ? "var(--primary)" : "";
  });
}

// Auto-avance cada 6 segundos
var _carouselTimer = setInterval(function () {
  carouselNav(1);
}, 6000);

// Reinicia el timer cuando el usuario navega manualmente
document
  .querySelector(".carousel-chevron-left-btn")
  .addEventListener("click", function () {
    clearInterval(_carouselTimer);
    _carouselTimer = setInterval(function () {
      carouselNav(1);
    }, 6000);
  });
document
  .querySelector(".carousel-chevron-right-btn")
  .addEventListener("click", function () {
    clearInterval(_carouselTimer);
    _carouselTimer = setInterval(function () {
      carouselNav(1);
    }, 6000);
  });

function carouselNav(dir) {
  var total = _carousel.consejos.length;
  _carousel.idx = (_carousel.idx + dir + total) % total;
  _carouselRender();
}

document.addEventListener("DOMContentLoaded", function () {
  // Construir dots dinámicamente según cantidad de consejos
  var dotsEl = document.getElementById("carousel-dots");
  if (!dotsEl) return;
  _carousel.consejos.forEach(function (_, i) {
    var btn = document.createElement("button");
    btn.className = "carousel-dot";
    btn.setAttribute("aria-label", "Consejo " + (i + 1));
    btn.addEventListener("click", function () {
      _carousel.idx = i;
      _carouselRender();
    });
    dotsEl.appendChild(btn);
  });
  _carouselRender();
});

// ══════════════════════════════════════════════
//  PAGINACIÓN DE TABLAS (Ingresos / Gastos)
// ══════════════════════════════════════════════

/**
 * Pagina un conjunto de filas ya presentes en el DOM (no las genera,
 * solo controla su visibilidad con la clase ob-hidden) y dibuja los
 * botones de paginación dentro del contenedor indicado.
 *
 * @param {string} rowSelector       Selector CSS de las filas (ej. ".ingreso-row")
 * @param {string} paginationId      ID del contenedor donde se dibujan los botones
 * @param {number} porPagina         Filas a mostrar por página
 */
function paginarTabla(rowSelector, paginationId, porPagina) {
  var filas = document.querySelectorAll(rowSelector);
  var contenedor = document.getElementById(paginationId);
  if (!filas.length || !contenedor) return;

  var totalPaginas = Math.ceil(filas.length / porPagina);
  var paginaActual = 1;

  function mostrarPagina(pagina) {
    paginaActual = pagina;
    var inicio = (pagina - 1) * porPagina;
    var fin = inicio + porPagina;

    filas.forEach(function (fila, i) {
      fila.classList.toggle("ob-hidden", i < inicio || i >= fin);
    });

    dibujarBotones();
  }

  function botonPagina(num) {
    var btn = document.createElement("button");
    btn.className = "page-btn" + (num === paginaActual ? " active" : "");
    btn.textContent = num;
    btn.addEventListener("click", function () {
      mostrarPagina(num);
    });
    return btn;
  }

  function elipsis() {
    var span = document.createElement("span");
    span.className = "page-ellipsis";
    span.textContent = "…";
    return span;
  }

  function dibujarBotones() {
    contenedor.innerHTML = "";
    if (totalPaginas <= 1) return;

    // Botón anterior
    var prev = document.createElement("button");
    prev.className = "page-btn";
    prev.textContent = "‹";
    prev.disabled = paginaActual === 1;
    prev.addEventListener("click", function () {
      if (paginaActual > 1) mostrarPagina(paginaActual - 1);
    });
    contenedor.appendChild(prev);

    // Números de página con elipsis si son muchas
    var rango = [];
    rango.push(1);
    for (var p = paginaActual - 1; p <= paginaActual + 1; p++) {
      if (p > 1 && p < totalPaginas) rango.push(p);
    }
    if (totalPaginas > 1) rango.push(totalPaginas);
    rango = rango
      .filter(function (v, i, arr) {
        return arr.indexOf(v) === i;
      })
      .sort(function (a, b) {
        return a - b;
      });

    var anterior = 0;
    rango.forEach(function (num) {
      if (num - anterior > 1) contenedor.appendChild(elipsis());
      contenedor.appendChild(botonPagina(num));
      anterior = num;
    });

    // Botón siguiente
    var next = document.createElement("button");
    next.className = "page-btn";
    next.textContent = "›";
    next.disabled = paginaActual === totalPaginas;
    next.addEventListener("click", function () {
      if (paginaActual < totalPaginas) mostrarPagina(paginaActual + 1);
    });
    contenedor.appendChild(next);
  }

  mostrarPagina(1);
}

document.addEventListener("DOMContentLoaded", function () {
  paginarTabla(".ingreso-row", "ingresos-pagination", 20);
  paginarTabla(".egreso-row", "gastos-pagination", 20);
});
