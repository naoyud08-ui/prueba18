/* =========================================
   SULLANA ECO-RESILIENTE
   SISTEMA DE EVALUACIÓN FEN
   BLUEPRINT: 6 FASES
========================================= */

const formulario = document.getElementById("evaluationForm");
const resultado = document.getElementById("resultado");
const contenedorResultado = document.getElementById("contenedorResultado");
const againButton = document.getElementById("againButton");

/* =========================================
   FASE 1: ESCUCHAR
   Capturar el clic del usuario.
========================================= */
formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    /* =========================================
       FASE 2: EXTRAER
       Obtener valores del HTML y convertirlos
       en números enteros listos para operar.
       3 variables base + 2 variables adicionales.
       Cada variable aporta de 1 a 3 puntos; máximo total: 15.
    ========================================= */
    const referencia = document.getElementById("referencia").value.trim();

    const valorTecho = parseInt(
        document.getElementById("techo").value,
        10
    );

    const valorDrenaje = parseInt(
        document.getElementById("drenaje").value,
        10
    );

    const valorZona = parseInt(
        document.getElementById("zona").value,
        10
    );

    const valorEstado = parseInt(
        document.getElementById("estado").value,
        10
    );

    const valorParedes = parseInt(
        document.getElementById("paredes").value,
        10
    );

    /* =========================================
       FASE 3: VALIDAR
       isNaN + operador || para detectar campos
       vacíos o valores que no sean números.
    ========================================= */
    const camposInvalidos =
        isNaN(valorTecho) ||
        isNaN(valorDrenaje) ||
        isNaN(valorZona) ||
        isNaN(valorEstado) ||
        isNaN(valorParedes);

    formulario.querySelectorAll("select").forEach(function (select) {
        select.classList.toggle("campo-error", select.value === "");
    });

    if (camposInvalidos) {
        alert("Por favor, responde todas las preguntas antes de evaluar.");
        return;
    }

    /* =========================================
       FASE 4: CALCULAR
       Suma algorítmica de las cinco variables.
       Cada variable vale de 1 a 3 puntos. Puntaje máximo: 15.
    ========================================= */
    const puntajeTotal =
        valorTecho +
        valorDrenaje +
        valorZona +
        valorEstado +
        valorParedes;

    /* =========================================
       FASE 5: DECIDIR
       Riesgo bajo: 1–5
       Riesgo medio: 6–9
       Riesgo alto: 10–15
    ========================================= */
    let diagnostico;
    let claseColor;
    let recomendacion;

    if (puntajeTotal <= 5) {
        diagnostico = "Vivienda Resiliente";
        claseColor = "riesgo-bajo";
        recomendacion =
            "Mantén el mantenimiento preventivo y revisa periódicamente el techo y el drenaje.";
    } else if (puntajeTotal <= 9) {
        diagnostico = "Vulnerabilidad Moderada";
        claseColor = "riesgo-medio";
        recomendacion =
            "Refuerza las uniones del techo, revisa el drenaje y atiende las condiciones que presenten deterioro.";
    } else {
        diagnostico = "Peligro Severo";
        claseColor = "riesgo-alto";
        recomendacion =
            "Prioriza las medidas preventivas, revisa las zonas vulnerables y busca orientación técnica cuando sea necesario.";
    }

    /* =========================================
       FASE 6: INYECTAR
       innerHTML reconstruye el contenedor con
       el diagnóstico exacto al instante.
    ========================================= */
    const referenciaTexto =
        referencia !== "" ? `<p class="resultado-referencia">${referencia}</p>` : "";

    contenedorResultado.innerHTML = `
        <div class="result-card ${claseColor}">
            <div class="result-icon">
                <i class="fa-solid ${
                    claseColor === "riesgo-bajo"
                        ? "fa-circle-check"
                        : "fa-triangle-exclamation"
                }"></i>
            </div>

            <span class="result-label">DIAGNÓSTICO FEN</span>

            <h2>${diagnostico}</h2>

            ${referenciaTexto}

            <p class="result-main-text">
                Puntaje acumulado: <strong>${puntajeTotal} / 15</strong>
            </p>

            <div class="score-area">
                <div class="score-top">
                    <span>Puntaje acumulado</span>
                    <strong><span id="scoreCounter">0</span>/15</strong>
                </div>

                <div class="progress ${claseColor}" aria-label="Puntaje acumulado de ${puntajeTotal} sobre 15">
                    <div id="scoreProgressBar"></div>
                </div>

            </div>

            <div class="recommendation">
                <div class="recommendation-icon">
                    <i class="fa-solid fa-lightbulb"></i>
                </div>
                <div>
                    <h3>Recomendación preventiva</h3>
                    <p>${recomendacion}</p>
                </div>
            </div>

            <button id="againButtonDynamic" class="again-button" type="button">
                <i class="fa-solid fa-rotate-right"></i>
                Realizar otra evaluación
            </button>
        </div>
    `;

    resultado.classList.remove("hidden");

    /* Animación del puntaje: el número y la barra avanzan hasta
       el valor real obtenido y adoptan el color del diagnóstico. */
    const scoreCounter = document.getElementById("scoreCounter");
    const scoreProgressBar = document.getElementById("scoreProgressBar");
    const porcentaje = (puntajeTotal / 15) * 100;
    let valorActual = 0;
    const duracion = 900;
    const inicio = performance.now();

    function actualizarColorDuranteAnimacion(valor) {
        const progress = scoreProgressBar.parentElement;

        progress.classList.remove("riesgo-bajo", "riesgo-medio", "riesgo-alto");

        if (valor <= 5) {
            progress.classList.add("riesgo-bajo");
            scoreCounter.style.color = "#159c78";
        } else if (valor <= 9) {
            progress.classList.add("riesgo-medio");
            scoreCounter.style.color = "#d89b20";
        } else {
            progress.classList.add("riesgo-alto");
            scoreCounter.style.color = "#d95353";
        }
    }

    function animarPuntaje(ahora) {
        const progreso = Math.min((ahora - inicio) / duracion, 1);
        const suavizado = 1 - Math.pow(1 - progreso, 3);
        valorActual = Math.round(puntajeTotal * suavizado);

        scoreCounter.textContent = valorActual;
        scoreProgressBar.style.width = `${porcentaje * suavizado}%`;
        actualizarColorDuranteAnimacion(valorActual);

        if (progreso < 1) {
            requestAnimationFrame(animarPuntaje);
        } else {
            scoreCounter.textContent = puntajeTotal;
            scoreProgressBar.style.width = `${porcentaje}%`;
            actualizarColorDuranteAnimacion(puntajeTotal);
        }
    }

    requestAnimationFrame(animarPuntaje);

    document
        .getElementById("againButtonDynamic")
        .addEventListener("click", reiniciarEvaluacion);

    setTimeout(function () {
        resultado.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }, 150);
});

/* =========================================
   VOLVER A EVALUAR
========================================= */
function reiniciarEvaluacion() {
    formulario.reset();

    formulario.querySelectorAll("select").forEach(function (select) {
        select.classList.remove("campo-error");
    });

    contenedorResultado.innerHTML = "";
    resultado.classList.add("hidden");

    window.scrollTo({
        top: document.getElementById("evaluacion").offsetTop - 90,
        behavior: "smooth"
    });
}

/* =========================================
   CHECKLIST PREVENTIVO
========================================= */
const checklistInputs = document.querySelectorAll(".checklist-input");
const checkPercent = document.getElementById("checkPercent");
const checkProgressBar = document.getElementById("checkProgressBar");

function actualizarChecklist() {
    if (!checklistInputs.length || !checkPercent || !checkProgressBar) return;

    const total = checklistInputs.length;
    const completadas = [...checklistInputs].filter(item => item.checked).length;
    const porcentaje = Math.round((completadas / total) * 100);

    checkPercent.textContent = porcentaje + "%";
    checkProgressBar.style.width = porcentaje + "%";
}

checklistInputs.forEach(function (item) {
    item.addEventListener("change", actualizarChecklist);
});

actualizarChecklist();

/* =========================================
   NAVEGACIÓN ACTIVA
========================================= */
const navLinks = document.querySelectorAll(".navbar nav a");
const observedSections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window && navLinks.length) {
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            navLinks.forEach((link) => link.classList.remove("active"));

            const active = document.querySelector(
                `.navbar nav a[href="#${entry.target.id}"]`
            );

            if (active) active.classList.add("active");
        });
    }, {
        threshold: 0.25,
        rootMargin: "-80px 0px -55% 0px"
    });

    observedSections.forEach(section => navObserver.observe(section));
}

/* =========================================
   MENÚ MÓVIL — SOLO CELULAR
========================================= */
const mobileMenuButton = document.getElementById("mobileMenuButton");
const mobileMenu = document.getElementById("mobileMenu");

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", function () {
        const abierto = mobileMenu.classList.toggle("open");

        mobileMenuButton.setAttribute(
            "aria-expanded",
            abierto ? "true" : "false"
        );

        mobileMenuButton.setAttribute(
            "aria-label",
            abierto ? "Cerrar menú" : "Abrir menú"
        );

        mobileMenuButton.innerHTML = abierto
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            mobileMenu.classList.remove("open");
            mobileMenuButton.setAttribute("aria-expanded", "false");
            mobileMenuButton.setAttribute("aria-label", "Abrir menú");
            mobileMenuButton.innerHTML = '<i class="fa-solid fa-bars"></i>';
        });
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 768) {
            mobileMenu.classList.remove("open");
            mobileMenuButton.setAttribute("aria-expanded", "false");
            mobileMenuButton.setAttribute("aria-label", "Abrir menú");
            mobileMenuButton.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
    });
    document.getElementById('btn-evaluar').addEventListener('click', function() {
    // Paso 1: Captura de datos desde el formulario
    const techo = parseInt(document.getElementById('select-techo').value) || 0;
    const drenaje = parseInt(document.getElementById('select-drenaje').value) || 0;
    const zona = parseInt(document.getElementById('select-zona').value) || 0;

    // Suma de puntaje total
    const puntajeTotal = techo + drenaje + zona;

    // Variables para almacenar los resultados
    let categoriaRiesgo = "";
    let claseEstilo = "";
    let recomendaciones = "";

    // Paso 3: Codificación de decisiones según la matriz de riesgo
    if (puntajeTotal <= 5) {
        categoriaRiesgo = "RIESGO BAJO";
        claseEstilo = "alerta-bajo";
        recomendaciones = "Limpieza preventiva de canaletas y revisión general.";
    } else if (puntajeTotal <= 9) {
        categoriaRiesgo = "RIESGO MEDIO";
        claseEstilo = "alerta-medio";
        recomendaciones = "Reforzar la estructura del techo y despejar vías de drenaje.";
    } else {
        categoriaRiesgo = "RIESGO ALTO";
        claseEstilo = "alerta-alto";
        recomendaciones = "Evacuación preventiva o colocación urgente de coberturas impermeables.";
    }

    // Paso 4: Inyección de resultados en el DOM
    const contenedorResultado = document.getElementById('resultado-evaluacion');
    if (contenedorResultado) {
        contenedorResultado.className = `alerta ${claseEstilo}`;
        contenedorResultado.innerHTML = `
            <h3>${categoriaRiesgo}</h3>
            <p><strong>Puntaje total:</strong> ${puntajeTotal}</p>
            <p>${recomendaciones}</p>
        `;
    }
});
}

