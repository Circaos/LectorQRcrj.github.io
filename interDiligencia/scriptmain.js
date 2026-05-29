//Importacion Store
import { setState, suscribir, setOtrosDatos } from './store.js'

import { obtenerApiDam, simularAPI, obtenerApiDamCompleto } from './funciones/funcionesAPI.js';

import { numeroAPalabras, nomAduana, formatearResumen, fechaToFormatoInput, inputToFormatoFecha, reconfiguracionObjeto, formatearNumeroDOC, obtenerMercaReconocida } from './funciones/funcionesBasicas.js'

let dataAlimentadorWord = {
    fromDam: {
        nombreEmpresa: "PENDIENTE-NOMBRE-EMPRESA",
        ruc: "PENDIENTE-RUC",
        domicilioFiscal: "PENDIENTE-DOMICILIO-FISCAL",
        fechaNumeracion: "PENDIENTE-FECHA-NUMERACION",
        agenteAduana: "PENDIENTE-AGENTE-ADUANA",
        numeroDam: "PENDIENTE-NUMERO-DAM",
        cantBultosNumero: "PENDIENTE-CANTIDAD-BULTOS-NUMERO",
        cantBultosTexto: "PENDIENTE-CANTIDAD-BULTOS-TEXTO",
        cantUnidComerNumero:"PENDIENTE-CANTIDAD-UND-COMERC",
        aduanaNumeracion: "PENDIENTE-ADUANA-NUMERACION",
        fechaCancelacionTributos: "PENDIENTE-FECHA-CANCELACION",
        rangoSeriesAcogida: "PENDIENTE-RANGO-ACOGIDO",
        rangoSeriesAcogidaSoloPeco: "PENDIENTE-RANGO-SOLOPECO",
        descripcionMerca: "PENDIENTE-DESCRIPCION",
        partidaNandina: "PENDIENTE-NANDINA",
        partidaNabandina: "PENDIENTE-NABANDINA",
        bultosReconocidos: "PENDIENTE-BULTOS-RECO",
        unidComerReconocidos: "PENDIENTE-UND-COMER-RECO",

    },
    datosFactura: {
        numeroReqFac: "PENDIENTE-NUMERO-REQUERIMIENTO",
        fechaReqFac: "PENDIENTE-NUMERO-REQUERIMIENTO",
        plazoFac: "PENDIENTE-NUMERO-REQUERIMIENTO",
        fechaFac: "PENDIENTE-NUMERO-REQUERIMIENTO",
    },
    fromInputs: {
        numeroInformeArt2: "PENDIENTE-NUMERO-INFORMEART2",
        fechaInformeArt2: "PENDIENTE-FECHA-INFORMEART2",
        lugarAforo: "PENDIENTE-LUGAR-AFORO",
        fechaAforo: "PENDIENTE-FECHA-AFORO",
        correoCeca: "PENDIENTE-CORREO-CECA",
        fechaCorreoCeca: "PENDIENTE-FECHA-CORREO-CECA",
        nombreEncargado: "PENDIENTE-NOMBRE-ENCARGADO",
        dniEncargado: "PENDIENTE-DNI-ENCARGADO",
        tipoDocumento: "PENDIENTE-TIPO-DOCUMENTO",
        preNombre: "PENDIENTE-PRE-NOMBRE",
        horaAforo: "PENDIENTE-HORA-AFORO",
    },
    cuadroPedoAmazonia: {
        numeroRegularizacion: "PENDIENTE-NUMERO-REGULARIZACION",
        fechaRegularizacion: "PENDIENTE-FECHA-REGULARIZACION",
        numeroConfirmacion: "PENDIENTE-NUMERO-CONFIRMACION",
        fechaConfirmacion: "PENDIENTE-FECHA-CONFIRMACION"
    },
    cuadroDeudaTributaria: {
        cuadroGeneral: {
            IGV: [-1, -1, -1, -1, -1, -1],
            IPM: [-1, -1, -1, -1, -1, -1],
            AdValorem: [-1, -1, -1, -1, -1, -1],
            ISC: [-1, -1, -1, -1, -1, -1],
            tasaDespacho: [-1, -1, -1, -1, -1, -1],
            derechoEspecifico: [-1, -1, -1, -1, -1, -1],
            derechoAntidumping: [-1, -1, -1, -1, -1, -1],
            sobretasaAdicional: [-1, -1, -1, -1, -1, -1],
            totales: [-1, -1, -1, -1, -1, -1]
        },
        miniCuadro: {
            fechaUltimoDiaPago: "PENDIENTE-FECHA-ULTIMODIAPAGO",
            fechaCancelacion: "PENDIENTE-FECHA-CANCELACION",
            tipoCancelacion: "PENDIENTE-TIPO-CANCELACION",
            tipoCambio: "PENDIENTE-TIPO-CAMBIO",
            lugarPago: "PENDIENTE-LUGAR-PAGO",
            montoPagado: "PENDIENTE-MONTO-PAGADO",
        }
    },
    guiasData: [],
    estadoPagadoFactura: true,
    estadoOnlyPECO: false,
    estadoOnlyAMAZONIA: false,
    estadoPECOyAMAZONIA: false,
    estadoSeleccionBultos:true
}


const listIDs = {
    idBuscadorDam: "idBuscadorDam",
    idInformeArt2: "idInformeArt2",
    idFechaArt2: "idFechaArt2",
    idLugarAforo: "idLugarAforo",
    idFechaAforo: "idFechaAforo",
    idCorreoCeca: "idCorreoCeca",
    idFechaCeca: "idFechaCeca",
    idModalPeca: "idModalPeca",
    idModalTributos: "idModalTributos",
    idNombreEncargado: "idNombreEncargado",
    idDNIEncargado: "idDNIEncargado",
    idBotonGuias: "idBotonGuias"
}

const listIDs2 = {
    idDamBuscada: ["idDamBuscada", "numeroDam"],
    // idFechaNumeracion: ["idFechaNumeracion", "fechaNumeracion"],
    // idAduanaOrigen: ["idAduanaOrigen", "aduanaNumeracion"],
    idNombreEmpresa: ["idNombreEmpresa", "nombreEmpresa"],
    idRucEmpresa: ["idRucEmpresa", "ruc"],
    idCantBultosNumber: ["idCantBultosNumber", "cantBultosNumero"],
    idCantUnidComerNumber: ["idCantUnidComerNumber", "cantUnidComerNumero"],
    // idCantBultosTexto: ["idCantBultosTexto", "cantBultosTexto"],
    // idAgenteAduana: ["idAgenteAduana", "agenteAduana"],
    idDomicilioFiscal: ["idDomicilioFiscal", "domicilioFiscal"],
    idDescriMerca: ["idDescriMerca", "descripcionMerca"],
    // idPartiNandina: ["idPartiNandina", "partidaNandina"],
    // idPartiNabandina: ["idPartiNabandina", "partidaNabandina"],
    idBultosReco: ["idBultosReco", "bultosReconocidos"],
    idUnidComerReco: ["idUnidComerReco", "unidComerReconocidos"],
}

const listIDsAgrupador = {
    idCeca: "idCeca",
    idAforo: "idAforo",
    idArt2: "idArt2",
    idEncargado: "idEncargado",
    idBuscadorDam: "idBuscadorDam",
    idGuias: "idGuias"
}

const listTipoHint = {
    alerta: "alerta",
    error: "error",
    ok: "ok",
    oculto: "oculto"
}


let estadoLocal = {}

let seleccionInputsHelper = {
    indexArt2: null,
    indexLugarAforo: null,
    fechaAforo: null,
    indexCorreoCeca: null,
    fechaCorreoCeca: null,
    indexEncargado: null
}

//ESTADOS
let estadoPagoFacturas = true
let estadoSeleccionBultosTipo = true

// -------- OBTENER ELEMENTOS DEL DOM ----------
const fraseSelect = document.getElementById('fraseSelect');
const nombreInput = document.getElementById('nombreInput');
const fechaInput = document.getElementById('fechaInput');
const estiloRadios = document.querySelectorAll('input[name="estilo"]');
const contextoSelect = document.getElementById('contextoSelect');
const incluirDespedidaCheck = document.getElementById('incluirDespedida');
const paragraphDiv = document.getElementById('dynamicParagraph');
const copyButton = document.getElementById('copyBtn');
const toastMsg = document.getElementById('toastMsg');

// función auxiliar para formatear fecha a "dd/mm/yyyy" (legible)
function formatearFechaLegible(fechaISO) {
    if (!fechaISO) return "fecha no especificada";
    try {
        const partes = fechaISO.split('-');
        if (partes.length === 3) {
            const [year, month, day] = partes;
            return `${day}/${month}/${year}`;
        }
        // si viene otro formato, intentamos con Date
        const dateObj = new Date(fechaISO);
        if (!isNaN(dateObj.getTime())) {
            const d = dateObj.getDate();
            const m = dateObj.getMonth() + 1;
            const y = dateObj.getFullYear();
            return `${d.toString().padStart(2, '0')}/${m.toString().padStart(2, '0')}/${y}`;
        }
        return fechaISO;
    } catch (e) {
        return fechaISO;
    }
}

// función para obtener el estilo seleccionado (formal, inspirador, divertido)
function getEstiloSeleccionado() {
    let selected = "formal";
    for (let radio of estiloRadios) {
        if (radio.checked) {
            selected = radio.value;
            break;
        }
    }
    return selected;
}

// Obtener contexto descripción según combobox
function getContextoTexto(contextoValor) {
    const mapContexto = {
        negocios: "en el mundo de los negocios y el emprendimiento",
        educacion: "en el proceso de aprendizaje continuo",
        motivacion: "en tu camino hacia el crecimiento personal",
        tecnologia: "en la era digital y la innovación tecnológica"
    };
    return mapContexto[contextoValor] || "en tu día a día";
}

function generarParrafo2() {
    let titulo = `${dataAlimentadorWord.fromDam.nombreEmpresa}   ${dataAlimentadorWord.fromDam.numeroDam}`

    let fechitaAforo = `FECHA AFORO: ${dataAlimentadorWord.fromInputs.fechaAforo}`
    let horitaAfoto = `HORA AFORO: ${dataAlimentadorWord.fromInputs.horaAforo}`
    let bultitosAforo = `BULTOS AFORO: ${dataAlimentadorWord.fromDam.cantBultosNumero}`
    let undComerAforo = `UNIDADES COMERCIALES AFORO: ${dataAlimentadorWord.fromDam.cantUnidComerNumero}`

    const cantBultosVeri = Number(dataAlimentadorWord.fromDam.bultosReconocidos)
    const cantBultosNumber  =Number(dataAlimentadorWord.fromDam.cantBultosNumero)

    const cantUndComerVeri = Number(dataAlimentadorWord.fromDam.unidComerReconocidos)
    const cantUndComerNumber = Number(dataAlimentadorWord.fromDam.cantUnidComerNumero)
    
    
    const palabraBultito = ( cantBultosNumber==1)? "bulto":"bultos"
    let inicialBasica = ""
    if (dataAlimentadorWord.estadoSeleccionBultos) {

        inicialBasica = `Se verificó la llegada de ${cantBultosNumber} ${palabraBultito}, reconocimiento físico ${(cantBultosVeri==cantBultosNumber)?`de ${cantBultosNumber} ${palabraBultito}`: `, selectivo y aleatorio de ${cantBultosVeri} de ${cantBultosNumber} bultos` }, conteniendo ${dataAlimentadorWord.fromDam.descripcionMerca}, según lo declarado y solicitado a regularización, aforo en presencia de persona autorizada por la empresa ${dataAlimentadorWord.fromInputs.preNombre} ${dataAlimentadorWord.fromInputs.nombreEncargado} ${(dataAlimentadorWord.fromInputs.preNombre=="Sr.")?"identificado":"identificada"} con ${dataAlimentadorWord.fromInputs.tipoDocumento} N° ${dataAlimentadorWord.fromInputs.dniEncargado}`
    }else{
        inicialBasica = `Se verificó la llegada de ${cantBultosNumber} ${palabraBultito}, reconocimiento físico${(cantUndComerVeri==cantUndComerNumber)?` de ${cantUndComerNumber} unidades comerciales`: `, selectivo y aleatorio de ${cantUndComerVeri} de ${cantUndComerNumber} unidades comerciales` }, conteniendo ${dataAlimentadorWord.fromDam.descripcionMerca}, según lo declarado y solicitado a regularización, aforo en presencia de persona autorizada por la empresa ${dataAlimentadorWord.fromInputs.preNombre} ${dataAlimentadorWord.fromInputs.nombreEncargado} ${(dataAlimentadorWord.fromInputs.preNombre=="Sr.")?"identificado":"identificada"} con ${dataAlimentadorWord.fromInputs.tipoDocumento} N° ${dataAlimentadorWord.fromInputs.dniEncargado}`
    }


    let primerParrafo = `${inicialBasica}, al amparo de la Ley Nro 27037 y del D.S. Nro 015-94-EF. Base legal: DESPA-PE.01.15 y DESPA-PE.01.13. `
    
    let primerParrafoOnlyPeco = `${inicialBasica}, al amparo del D.S. Nro 015-94-EF.  Base legal: DESPA-PE.01.13`

    let primerParrafoOnlyAmazon = `${inicialBasica}, al amparo de la Ley Nro 27037. Base legal: DESPA-PE.01.15. `



    let segundoParrafo = `Conforme al INFORME N.º${dataAlimentadorWord.fromInputs.numeroInformeArt2}, el importador ${dataAlimentadorWord.fromDam.nombreEmpresa} identificado con RUC N° ${dataAlimentadorWord.fromDam.ruc}, con domicilio fiscal ubicado en ${dataAlimentadorWord.fromDam.domicilioFiscal}, SI cumple con los requisitos establecidos en el artículo 2° del Decreto Supremo N° 103-99-EF “Aprueban el Reglamento de las Disposiciones Tributarias contenidas en la Ley de Promoción de la inversión en la Amazonía” y modificatoria, configurando dicho cumplimiento el goce del beneficio contemplado en la Ley N° 27037 “Ley de Promoción de la Inversión en la Amazonía”.`

    // let tercerParrafoSicumple = ``

    let noPagoParrafo = `Asimismo, queda usted notificado para que en el plazo de 5 días hábiles de efectuado el pago de la Compraventa de las mercancías que ampara esta DAM o vencido el plazo declarado por el OCE para la operación al crédito, se sirva presentar conforme lo establecido en el Art 3-A TUO de la Ley para la Lucha contra la Evasión y para la Formalización de la Economía - D.S. N° 150-2007-EF y modificatorias, los documentos que acreditan el uso de los medios de pago establecidos en el Art. 5.° de la norma citada, caso contrario estará incurso en la infracción PA8 estipulada en la Tabla de Sanciones de la Ley General de Aduanas, equivalente al 10% del valor FOB declarado de la mercancía. Se precisa que la presentación de los documentos que sustente el uso de los medios de pago puede ser presentados vía expediente a través de la mesa de parte virtual de la SUNAT o en su defecto a través del requerimiento generado en la DAM por la transmisión de la rectificación electrónica de la casilla 4.1 del Formato B indicando el código/nombre de la entidad financiera y el número de operación.`

    let rpt = `${titulo}\n\n${fechitaAforo}\n${horitaAfoto}\n${bultitosAforo}\n${undComerAforo}`

    if (dataAlimentadorWord.estadoOnlyPECO && !dataAlimentadorWord.estadoOnlyAMAZONIA) {
        rpt = `${rpt}\n\n${primerParrafoOnlyPeco}`
    }else if(!dataAlimentadorWord.estadoOnlyPECO && dataAlimentadorWord.estadoOnlyAMAZONIA){
        rpt = `${rpt}\n\n${primerParrafoOnlyAmazon}`
    }else{
        rpt = `${rpt}\n\n${primerParrafo}`
    }


    if (!dataAlimentadorWord.estadoPagadoFactura) {
        rpt = `${rpt}\n\n${noPagoParrafo}`
    }

    if (dataAlimentadorWord.estadoOnlyAMAZONIA || dataAlimentadorWord.estadoPECOyAMAZONIA) {
        rpt = `${rpt}\n\n${segundoParrafo}`
    }

    return rpt
}
// Función principal que genera el párrafo basado en todas las selecciones
function generarParrafo() {
    // 1. Obtener valores actualizados
    let frase = fraseSelect.value;
    let nombre = nombreInput.value.trim();
    if (nombre === "") nombre = "usuario";

    let fechaRaw = fechaInput.value;
    let fechaLegible = formatearFechaLegible(fechaRaw);

    let estilo = getEstiloSeleccionado();
    let contextoValor = contextoSelect.value;
    let contextoFrase = getContextoTexto(contextoValor);
    let incluirDespedida = incluirDespedidaCheck.checked;

    // 2. Construcción de párrafo base con plantilla dinámica
    // Inicio del párrafo según estilo
    let saludoInicial = "";
    let conectorEstilo = "";
    let adjetivoExtra = "";

    if (estilo === "formal") {
        saludoInicial = `Estimado/a ${nombre},`;
        conectorEstilo = "Es un placer compartir esta reflexión fundamentada en principios sólidos.";
        adjetivoExtra = " profesional y estratégica";
    } else if (estilo === "inspirador") {
        saludoInicial = `✨ Querido/a ${nombre},`;
        conectorEstilo = "Hoy quiero recordarte que cada paso cuenta, y la luz del cambio está en tus manos.";
        adjetivoExtra = " llena de propósito y magia";
    } else { // divertido
        saludoInicial = `🎉 ¡Ey ${nombre}!`;
        conectorEstilo = "Prepárate para sonreír, porque el mejor momento de tu día está aquí. (Y sin estrés)";
        adjetivoExtra = " divertida y llena de buena energía";
    }

    // Construir la sección central según frase y contexto + fecha
    let cuerpoCentral = `En esta fecha tan especial: ${fechaLegible}, recordamos que "${frase}". `;
    cuerpoCentral += `Este principio nos inspira especialmente ${contextoFrase}. `;

    if (estilo === "formal") {
        cuerpoCentral += `Bajo este enfoque, la claridad y la organización son claves para alcanzar metas sobresalientes. `;
    } else if (estilo === "inspirador") {
        cuerpoCentral += `Confía en tu esencia, permite que la motivación te guíe y verás florecer oportunidades únicas. `;
    } else {
        cuerpoCentral += `Así que ya sabes, ríete del estrés, disfruta el proceso y déjate sorprender por lo inesperado. `;
    }

    // agregar detalle del contexto específico más vínculo con el nombre
    let contextoExtra = "";
    if (contextoValor === "negocios") {
        contextoExtra = ` ${nombre}, tu visión emprendedora puede transformar este aprendizaje en resultados concretos.`;
    } else if (contextoValor === "educacion") {
        contextoExtra = ` Nunca dejes de aprender, ${nombre}, porque el conocimiento es la llave que abre todas las puertas.`;
    } else if (contextoValor === "motivacion") {
        contextoExtra = ` Sigue brillando, ${nombre}, tu actitud positiva marca una gran diferencia en el mundo.`;
    } else if (contextoValor === "tecnologia") {
        contextoExtra = ` La tecnología avanza, ${nombre}, y tú puedes aprovechar cada herramienta para innovar y crecer.`;
    }

    cuerpoCentral += contextoExtra;

    // Cierre del párrafo: despedida personalizada o cierre estándar
    let despedida = "";
    if (incluirDespedida) {
        if (estilo === "formal") {
            despedida = `\n\nAtentamente, el equipo de inspiración profesional. Le deseamos un excelente día.`;
        } else if (estilo === "inspirador") {
            despedida = `\n\n🌸 Sigue adelante con fe. ¡Tú puedes lograr lo que sueñas! Con cariño, tu aliado motivacional.`;
        } else {
            despedida = `\n\n🎈 ¡Chao pescao! Que tengas un día tan genial como este párrafo. Nos leemos pronto. 😄`;
        }
    } else {
        // Sin despedida, solo un cierre neutro
        if (estilo === "formal") {
            despedida = `\n\nSaludos cordiales.`;
        } else if (estilo === "inspirador") {
            despedida = `\n\nSigue creyendo en ti.`;
        } else {
            despedida = `\n\n¡Nos vemos en la siguiente aventura!`;
        }
    }

    // Unir todo, respetando saltos de línea para buena legibilidad (HTML se renderiza con white-space: pre-wrap)
    let parrafoCompleto = `${saludoInicial} ${conectorEstilo}\n\n${cuerpoCentral}\n${despedida}`;

    // Pequeño post-formato: añadir opcionalmente mención de que el texto es generado con base en las selecciones
    // opcional: podemos mejorar legibilidad eliminando dobles espacios.
    parrafoCompleto = parrafoCompleto.replace(/\s+/g, ' ').replace(/\. \n/g, '.\n').trim();
    // pero respetamos los saltos de línea agregados
    // Los saltos artificiales los mostramos correctamente con white-space: pre-wrap, reconstruimos con saltos consistentes
    // Para mayor claridad, volvemos a dar formato: unir las partes con saltos de línea controlados:
    // mejor reconstrucción manual con saltos:
    let versionFinal = `${saludoInicial} ${conectorEstilo}\n\n${cuerpoCentral}\n${despedida}`;
    // Corregir posibles espacios redundantes después de puntuación.
    versionFinal = versionFinal.replace(/\. +/g, '. ').replace(/ ,/g, ',');
    return versionFinal;
}

// función para actualizar el DOM del párrafo
function actualizarTextoGenerado() {
    const nuevoTexto = generarParrafo();
    paragraphDiv.innerText = nuevoTexto;
}

// --- Eventos para refrescar automáticamente cada cambio ---
function bindEvents() {
    fraseSelect.addEventListener('change', actualizarTextoGenerado);
    nombreInput.addEventListener('input', actualizarTextoGenerado);
    fechaInput.addEventListener('change', actualizarTextoGenerado);
    contextoSelect.addEventListener('change', actualizarTextoGenerado);
    incluirDespedidaCheck.addEventListener('change', actualizarTextoGenerado);
    // radios: cada uno al cambiar
    estiloRadios.forEach(radio => {
        radio.addEventListener('change', actualizarTextoGenerado);
    });
    // adicional: input de fecha también permite escritura directa
    fechaInput.addEventListener('input', actualizarTextoGenerado);
}

// ---- Función para copiar texto al portapapeles con selección incluida pero copia total ----
async function copiarTexto() {
    const textoACopiar = paragraphDiv.innerText;
    if (!textoACopiar || textoACopiar.trim() === "") {
        mostrarToast("⚠️ No hay texto para copiar", 1500);
        return;
    }
    try {
        await navigator.clipboard.writeText(textoACopiar);
        mostrarToast("✅ ¡Párrafo copiado al portapapeles!", 1800);
        // efecto visual adicional: resaltar brevemente el área de texto
        paragraphDiv.style.transition = "background 0.2s";
        paragraphDiv.style.backgroundColor = "#d9f0e6";
        setTimeout(() => {
            paragraphDiv.style.backgroundColor = "";
        }, 300);
    } catch (err) {
        console.error("Error al copiar: ", err);
        // Fallback antiguo para navegadores
        fallbackCopiarTexto(textoACopiar);
    }
}

function fallbackCopiarTexto(texto) {
    const textarea = document.createElement('textarea');
    textarea.value = texto;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    mostrarToast("📋 Copiado (método alternativo)", 1500);
}

function mostrarToast(mensaje, duracion = 2000) {
    toastMsg.textContent = mensaje;
    toastMsg.style.opacity = "1";
    setTimeout(() => {
        toastMsg.style.opacity = "0";
    }, duracion);
}

// ---- Hacer que el texto sea totalmente seleccionable con el mouse (ya es un div con texto plano)
// ---- Además añadimos un pequeño helper para que se pueda doble clic / seleccionar fácil
// el div generado tiene ya estilos para permitir selección de texto (user-select: text por defecto)
// y cursor de texto.
// Adicional: para mejorar experiencia, aseguramos que el texto generado sea completamente seleccionable
// y el botón copiar no interfiere.

// Hacer que el div sea "enfocable" opcionalmente para mejorar selección en móviles.
paragraphDiv.setAttribute('tabindex', '0');
paragraphDiv.style.userSelect = "text";

// Inicializar generación
function init() {
    // bindEvents();
    // actualizarTextoGenerado();  // primer texto por defecto con valores iniciales
    copyButton.addEventListener('click', copiarTexto);
    // También se puede permitir copiar con Ctrl+C normalmente porque el texto es seleccionable.
}

init();


















////PROPIO
//Agrupadores
document.querySelectorAll(".agrupador[data-id]").forEach(agrupador => {
    // console.log(agrupador.dataset.id)
    const botoncito = agrupador.querySelector("button")
    if (botoncito) {
        botoncito.addEventListener("click", async (e) => {
            e.preventDefault()
            switch (agrupador.dataset.id) {
                case listIDsAgrupador.idBuscadorDam:
                    console.log("pollo")
                    await llamadoApiBuscadorDam(agrupador, botoncito)
                    break;
                case listIDsAgrupador.idArt2:
                    mostrarModalConfig()
                    break;
                case listIDsAgrupador.idAforo:
                    mostrarModalConfig()
                    break;
                case listIDsAgrupador.idCeca:
                    mostrarModalConfig()
                    break;
                case listIDsAgrupador.idEncargado:
                    mostrarModalConfig()
                    break;
                case listIDsAgrupador.idGuias:
                    mostrarModalGuias()
                    break;
                default:
                    break;
            }
        })
    }
})


async function llamadoApiBuscadorDam(agrupador, boton) {

    const form = agrupador.querySelector(".form-group")
    const textoInput = agrupador.querySelector("input").value
    asignarHint(form, listTipoHint.oculto, "DAM NO VALIDA")
    if (textoInput.length != 13) {
        asignarHint(form, listTipoHint.error, "DAM NO VALIDA")
        return
    }

    if (!Number(textoInput)) {
        asignarHint(form, listTipoHint.error, "ERROR EN CARACTERES")
        boton.textContent = "Buscar"
        boton.disabled = false;
        return
    }
    boton.textContent = "Cargando..."
    boton.disabled = true;

    // setState({})
    pintarCuadrosInputBlanco2()

    const dataRpt = await obtenerApiDamCompleto(textoInput)


    if (dataRpt == null || dataRpt == undefined) {
        asignarHint(form, listTipoHint.error, "ERROR EN BUSQUEDA - API")
        boton.textContent = "Buscar"
        boton.disabled = false;
        return
    }
    const data = dataRpt["dam"]
    const infoRuc = dataRpt["infoRuc"]

    rellenarAlimentadorFromDam(data)


    setState(infoRuc)


    rellenarRangoAcogidas(data["series"])


    boton.textContent = "Buscar"
    boton.disabled = false;


    updateVisualDataFromDam()
    asignarHint(form, listTipoHint.ok, "LISTO")
}

function asignarHint(formGroup, tipoHint, mensaje = null) {
    const small = formGroup.querySelector("small")
    small.style.fontWeight = "700"

    if (tipoHint == listTipoHint.oculto) {
        small.style.display = "none"
    } else {
        small.style.display = "inline"
        switch (tipoHint) {
            case listTipoHint.ok:
                small.textContent = (mensaje == null) ? "✅ OK" : `✅ ${mensaje}`
                small.style.color = "#1bc331"
                break;

            case listTipoHint.alerta:
                small.textContent = (mensaje == null) ? "⚠️ ALERTA" : `⚠️ ${mensaje}`
                small.style.color = "#d78607"

                break;

            case listTipoHint.error:
                small.textContent = (mensaje == null) ? "❌ ERROR" : `❌ ${mensaje}`
                small.style.color = "red"

                break;
            default:
                break;
        }
    }
}


function pintarCuadrosInputBlanco2() {
    const formArt2 = document.querySelector('.form-group[data-id="idInformeArt2"]')
    const selectArt2 = formArt2.querySelector("select")
    selectArt2.innerHTML = ''
    document.querySelector(`.form-group[data-id="${listIDs.idFechaArt2}"] input`).value = ''
    asignarHint(formArt2, listTipoHint.oculto, "---")

    const formLugar = document.querySelector('.form-group[data-id="idLugarAforo"]')
    const selectLugar = formLugar.querySelector("select")
    selectLugar.innerHTML = ''
    asignarHint(formLugar, listTipoHint.oculto, "---")

    const formCorreo = document.querySelector('.form-group[data-id="idCorreoCeca"]')
    const selectCorreo = formCorreo.querySelector("select")
    selectCorreo.innerHTML = ''
    asignarHint(formCorreo, listTipoHint.oculto, "---")

    const formEncargado = document.querySelector('.form-group[data-id="idNombreEncargado"]')
    const selectEncargado = formEncargado.querySelector("select")
    selectEncargado.innerHTML = ''
    document.querySelector(`.form-group[data-id="${listIDs.idDNIEncargado}"] input`).value = ''
    asignarHint(formEncargado, listTipoHint.oculto, "---")
}

function rellenarAlimentadorFromDam(data) {

    console.log("rellenando DAM")
    // console.log("rellenarAlimentadorFromDam",data)
    const rucData = data["rucImportador"].split("-")[1]
    const razonSocialData = data["nomImportador"]
    dataAlimentadorWord.fromDam.nombreEmpresa = razonSocialData
    dataAlimentadorWord.fromDam.ruc = rucData
    setOtrosDatos(rucData, razonSocialData)


    dataAlimentadorWord.fromDam.aduanaNumeracion = nomAduana(data["dam"].slice(0, 3)).toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

    dataAlimentadorWord.fromDam.agenteAduana = data["nomDeclarante"]
    dataAlimentadorWord.fromDam.cantBultosNumero = Number(data["cantBultos"].replace(',', '')).toString()
    dataAlimentadorWord.fromDam.cantUnidComerNumero = Number(data["cantUndComerciales"].replace(',', '')).toString()
    dataAlimentadorWord.fromDam.cantBultosTexto = numeroAPalabras(Number(data["cantBultos"].replace(',', '')))
    dataAlimentadorWord.fromDam.domicilioFiscal = data["direccionFiscal"]
    dataAlimentadorWord.fromDam.fechaNumeracion = data["fechaNumeracion"].replaceAll("/", ".")
    dataAlimentadorWord.fromDam.fechaCancelacionTributos = data["fechaCancelacion"].replaceAll("/", ".")
    dataAlimentadorWord.fromDam.numeroDam = data["dam"].slice(0, -3)

    console.log("dataAlimentadorWord.fromDam")
    console.log(dataAlimentadorWord)
    actualizarPrevisualizacion()
}

function rellenarDatosFactura(dataFactura) {
    // dataAlimentadorWord.datosFactura.numeroReqFac = dataFactura.numeroReqFac
    // dataAlimentadorWord.datosFactura.fechaReqFac = dataFactura.fechaReqFac
    // dataAlimentadorWord.datosFactura.plazoFac = dataFactura.plazoFac
    // dataAlimentadorWord.datosFactura.fechaFac = dataFactura.fechaFac
    dataAlimentadorWord.estadoPagadoFactura = estadoPagoFacturas

    actualizarPrevisualizacion()
}

function actualizarPrevisualizacion() {
    console.log("dataAlimentadorWord",dataAlimentadorWord)
    const nuevoTexto = generarParrafo2();
    paragraphDiv.innerText = nuevoTexto;
}

//Funciones alimentador visual
function updateVisualDataFromDam() {
    // console.log("pollito")
    // const agrupados = document.querySelectorAll('.separador2[data-id3="sepradorInputs"] .form-group[data-id2] ')
    const contenedor = document.querySelector('.separador2[data-id3="sepradorInputs"]')
    // console.log(contenedor)
    Object.entries(listIDs2).forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
        const inputTempo = contenedor.querySelector(`.form-group[data-id2="${value[0]}"] > input`)

        const padreInput = inputTempo.parentNode
        const small = padreInput.querySelector("small")
        if (dataAlimentadorWord.fromDam[value[1]].includes("PENDIENTE") && small) {
            asignarHint(padreInput, listTipoHint.alerta, "VERIFICAR")
        }else if(small){
            asignarHint(padreInput, listTipoHint.oculto, "VERIFICAR")
        }
        inputTempo.value = dataAlimentadorWord.fromDam[value[1]]
    })
}

function rellenarRangoAcogidas(seriesDam) {
    let listaSeries = []
    let listaSerieDatos = []
    let listaSeriesSoloPeco = []

    let veriPeco = false
    let veriAmazonia = false

    seriesDam.forEach(serie => {
        if (serie["codLiber"].includes("4438")) {
            listaSeries.push(serie["serie"])
            listaSerieDatos.push(serie)
            if (!veriAmazonia) {
                veriAmazonia = true
            }
        } else if (serie["tratoPreferente"].includes("35")) {
            listaSeries.push(serie["serie"])
            listaSerieDatos.push(serie)

        }

        if (serie["tratoPreferente"].includes("35")) {
            listaSeriesSoloPeco.push(serie["serie"])
            if (!veriPeco) {
                veriPeco = true
            }
        }
    })
    let rpt = formatearResumen(listaSeries)
    // console.log("listaSeriesSoloPeco", listaSeriesSoloPeco)
    let rangoSoloPECO = formatearResumen(listaSeriesSoloPeco)
    let rptMercaReconocida = obtenerMercaReconocida(listaSerieDatos)
    console.log("rptMercaReconocidarptMercaReconocidarptMercaReconocida")
    console.log(rptMercaReconocida)

    if (veriPeco && veriAmazonia) {
        dataAlimentadorWord.estadoPECOyAMAZONIA = true
    } else if (veriPeco) {
        dataAlimentadorWord.estadoOnlyPECO = true
    } else if (veriAmazonia) {
        dataAlimentadorWord.estadoOnlyAMAZONIA = true
    }


    dataAlimentadorWord.fromDam.descripcionMerca = rptMercaReconocida.descri
    dataAlimentadorWord.fromDam.partidaNandina = rptMercaReconocida.partNandina
    dataAlimentadorWord.fromDam.partidaNabandina = rptMercaReconocida.partNabandina
    // dataAlimentadorWord.fromDam.bultosReconocidos = rpt

    dataAlimentadorWord.fromDam.rangoSeriesAcogida = rpt
    dataAlimentadorWord.fromDam.rangoSeriesAcogidaSoloPeco = rangoSoloPECO
    console.log("dataAlimentadorWord.fromDam.rangoSeriesAcogida")
    console.log(dataAlimentadorWord)
    actualizarPrevisualizacion()
}


function mostrarModalConfig() {
    const modal = document.getElementById("miModalConfig")
    modal.style.display = "flex"
}

document.addEventListener("DOMContentLoaded", () => {
    suscribir((estado) => {
        console.log("Cambio en estado detectado en APP.JS")
        estadoLocal = estado

        pintarCuadrosInput()
    })
})

function pintarCuadrosInput() {
    console.log("pintando cuadros input")
    let datosEmpresas = estadoLocal

    if (datosEmpresas == null || datosEmpresas == {}) {
        pintarCuadrosInputBlanco()
        return
    }


    const fromInputsTempo = {
        numeroInformeArt2: "PENDIENTE-NUMERO-INFORMEART2",
        fechaInformeArt2: "PENDIENTE-FECHA-INFORMEART2",
        lugarAforo: "PENDIENTE-LUGAR-AFORO",
        fechaAforo: "PENDIENTE-FECHA-AFORO",
        correoCeca: "PENDIENTE-CORREO-CECA",
        fechaCorreoCeca: "PENDIENTE-FECHA-CORREO-CECA",
        nombreEncargado: "PENDIENTE-NOMBRE-ENCARGADO",
        dniEncargado: "PENDIENTE-DNI-ENCARGADO",
        tipoDocumento: "PENDIENTE-TIPO-DOCUMENTO",
        preNombre: "PENDIENTE-PRE-NOMBRE",
        horaAforo: "PENDIENTE-HORA-AFORO",
    }

    // ART 2
    const dataArt2 = datosEmpresas["Art2"]
    if (dataArt2) {
        const formArt2 = document.querySelector('.form-group[data-id="idInformeArt2"]')
        if (dataArt2.length == 0) {
            asignarHint(formArt2, listTipoHint.error, "No hay ART2")
            seleccionInputsHelper.indexArt2 = null
        } else {
            const selectArt2 = formArt2.querySelector("select")
            selectArt2.innerHTML = ''
            for (let index = 0; index < dataArt2.length; index++) {
                // const element = dataArt2[index];
                const opcion = document.createElement("option");
                opcion.value = index;
                opcion.text = dataArt2[index]["nombreArt"]
                selectArt2.appendChild(opcion)
            }
            asignarHint(formArt2, listTipoHint.oculto, "Elegir ART2")
            if (seleccionInputsHelper.indexArt2 == null) {
                seleccionInputsHelper.indexArt2 = 0
            } else {
                selectArt2.selectedIndex = seleccionInputsHelper.indexArt2
            }
            document.querySelector(`.form-group[data-id="${listIDs.idFechaArt2}"] > input`).value = fechaToFormatoInput(dataArt2[seleccionInputsHelper.indexArt2]["fecha"])

            fromInputsTempo.numeroInformeArt2 = dataArt2[seleccionInputsHelper.indexArt2]["nombreArt"]
            fromInputsTempo.fechaInformeArt2 = dataArt2[seleccionInputsHelper.indexArt2]["fecha"].replaceAll("/", ".")
        }

    }

    //AFOROlugar
    const dataLugarAforo = datosEmpresas["lugarAforo"]
    if (dataLugarAforo) {
        const formLugar = document.querySelector('.form-group[data-id="idLugarAforo"]')
        if (dataLugarAforo.length == 0) {
            asignarHint(formLugar, listTipoHint.error, "No hay LUGAR")
            seleccionInputsHelper.indexLugarAforo = null
        } else {
            const selectLugar = formLugar.querySelector("select")
            selectLugar.innerHTML = ''
            for (let index = 0; index < dataLugarAforo.length; index++) {
                // const element = dataLugarAforo[index];
                const opcion = document.createElement("option");
                opcion.value = index;
                opcion.text = dataLugarAforo[index]
                selectLugar.appendChild(opcion)
            }
            asignarHint(formLugar, listTipoHint.oculto, "Elegir Lugar")
            if (seleccionInputsHelper.indexLugarAforo == null) {
                seleccionInputsHelper.indexLugarAforo = 0
            } else {
                selectLugar.selectedIndex = seleccionInputsHelper.indexLugarAforo
            }

            fromInputsTempo.lugarAforo = dataLugarAforo[seleccionInputsHelper.indexLugarAforo]
        }
    }



    //CORREOCECA 
    const dataCorreoCeca = datosEmpresas["correoCeca"]
    if (dataCorreoCeca) {
        const formLugar = document.querySelector('.form-group[data-id="idCorreoCeca"]')
        if (dataCorreoCeca.length == 0) {
            asignarHint(formLugar, listTipoHint.error, "No hay CORREO")
            seleccionInputsHelper.indexCorreoCeca = null
        } else {
            const selectLugar = formLugar.querySelector("select")
            selectLugar.innerHTML = ''
            for (let index = 0; index < dataCorreoCeca.length; index++) {
                const opcion = document.createElement("option");
                opcion.value = index;
                opcion.text = dataCorreoCeca[index]
                selectLugar.appendChild(opcion)
            }
            asignarHint(formLugar, listTipoHint.oculto, "Elegir Lugar")
            if (seleccionInputsHelper.indexCorreoCeca == null) {
                seleccionInputsHelper.indexCorreoCeca = 0
            } else {
                selectLugar.selectedIndex = seleccionInputsHelper.indexCorreoCeca
            }
            fromInputsTempo.correoCeca = dataCorreoCeca[seleccionInputsHelper.indexCorreoCeca]
        }
    }
    //RESPONSABLE
    const dataResponsable = datosEmpresas["responsable"]
    if (dataResponsable) {
        const formLugar = document.querySelector('.form-group[data-id="idNombreEncargado"]')
        if (dataResponsable.length == 0) {
            asignarHint(formLugar, listTipoHint.error, "No hay RESPONSABLE")
            seleccionInputsHelper.indexEncargado = null
        } else {
            const selectLugar = formLugar.querySelector("select")
            selectLugar.innerHTML = ''
            for (let index = 0; index < dataResponsable.length; index++) {
                const opcion = document.createElement("option");
                opcion.value = index;
                opcion.text = dataResponsable[index]["nombre"]
                selectLugar.appendChild(opcion)
            }
            asignarHint(formLugar, listTipoHint.oculto, "Elegir Lugar")
            if (seleccionInputsHelper.indexEncargado == null) {
                seleccionInputsHelper.indexEncargado = 0
            } else {
                selectLugar.selectedIndex = seleccionInputsHelper.indexEncargado
            }
            document.querySelector(`.form-group[data-id="${listIDs.idDNIEncargado}"] > input`).value = dataResponsable[seleccionInputsHelper.indexEncargado]["documento"]

            fromInputsTempo.dniEncargado = dataResponsable[seleccionInputsHelper.indexEncargado]["documento"]
            fromInputsTempo.nombreEncargado = dataResponsable[seleccionInputsHelper.indexEncargado]["nombre"]
            fromInputsTempo.tipoDocumento = dataResponsable[seleccionInputsHelper.indexEncargado]["tipoDoc"]
            fromInputsTempo.preNombre = dataResponsable[seleccionInputsHelper.indexEncargado]["preNombre"]
        }
    }

    //HORA AFORO
    const formHoraAforo = document.querySelector('.form-group[data-id="idHoraAforo"]')
    const horaAforoValue = formHoraAforo.querySelector("input").value
    if (horaAforoValue == '') {
        asignarHint(formHoraAforo, listTipoHint.alerta, "PENDIENTE")
    }else{
        fromInputsTempo.horaAforo = horaAforoValue
        asignarHint(formHoraAforo, listTipoHint.oculto, "PENDIENTE")
    }
    //FECHA AFORO
    const formFechaAforo = document.querySelector('.form-group[data-id="idFechaAforo"]')
    const fechaAforoValue = formFechaAforo.querySelector("input").value
    if (fechaAforoValue == '') {
        asignarHint(formFechaAforo, listTipoHint.alerta, "PENDIENTE")
    } else {
        fromInputsTempo.fechaAforo = inputToFormatoFecha(fechaAforoValue).replaceAll("/", ".")
        asignarHint(formFechaAforo, listTipoHint.oculto, "PENDIENTE")
    }
    //FECHA CECA
    const formFechaCeca = document.querySelector('.form-group[data-id="idFechaCeca"]')
    const fechaCorreoCecaValue = formFechaCeca.querySelector("input").value
    if (fechaCorreoCecaValue == '') {
        asignarHint(formFechaCeca, listTipoHint.alerta, "PENDIENTE")
    } else {
        fromInputsTempo.fechaCorreoCeca = inputToFormatoFecha(fechaCorreoCecaValue).replaceAll("/", ".")
        asignarHint(formFechaCeca, listTipoHint.oculto, "PENDIENTE")
    }

    if (fechaAforoValue != fechaCorreoCecaValue && fechaCorreoCecaValue != '' && fechaAforoValue != '') {
        asignarHint(formFechaCeca, listTipoHint.error, "Dif.Fech. Aforo")
        asignarHint(formFechaAforo, listTipoHint.error, "Dif.Fech. Correo Ceca")
    }

    rellenarInfoInputs(fromInputsTempo)
}

function rellenarInfoInputs(fromInputsTempo) {
    dataAlimentadorWord.fromInputs = fromInputsTempo
    console.log("dataAlimentadorWord.fromInputs")
    console.log(dataAlimentadorWord)
    actualizarPrevisualizacion()
}

let estadoEdicionFactura = false
let estadoEdicionDam = false
document.querySelectorAll("button[id]").forEach(boton => {
    // console.log("----------")
    // console.log(boton)
    boton.addEventListener("click", (e) => {
        e.preventDefault()
        switch (e.target.id) {
            case "cerrarModal":
                cerrarModal()
                break;

            case "idBtnPegarContenido":
                // saveAs(blob, "informe.docx");
                if (estadoBTNpegadoModal == listIDs.idModalPeca) {
                    console.log("se esta pegando PECO")
                    pasteFromClipboard("peco")
                } else if (estadoBTNpegadoModal == listIDs.idModalTributos) {
                    console.log("se esta pegando TRIBUTOS")
                    pasteFromClipboard("tributos")
                }
                break;
            case "idCorreccionDAM":

                if (estadoEdicionDam) {
                    console.log("se va a guardar")
                    rellenarInfoCorreccion()
                }
                changeEdicionInputsDams(estadoEdicionDam, boton)
                break;
            case "idCorreccionPagoFactura":
                // console.log(boton)
                changeEdicionPagoFactura(estadoEdicionFactura, boton)
                break
            case "cerrarModalGuias":
                cerrarModalGuias()
                break;
            default:
                break;
        }

    })
})

function changeEdicionPagoFactura(cambiador, boton) {

    const separadorPagoFactura = document.querySelector('.separador2[data-id3="sepradorPagoFactura"]')
    const formTempo = separadorPagoFactura.querySelector('.form-group-type2')
    const checkBox = formTempo.querySelector("input")
    if (!cambiador) {
        boton.textContent = "💾 Guardar Correccion"
        formTempo.querySelector("span").style.display = "none"
        checkBox.style.display = "inline";
    } else {
        const span = formTempo.querySelector("span")
        span.style.display = "inline"
        // span.textContent = (checkBox.checked) ? "✅ Pagado" : "⚠️ Pendiente Pago"
        if (checkBox.checked) {
            span.textContent = "✅ Pagado"
            span.classList.add("cumple-si")
            span.classList.remove("cumple-no")
        } else {
            span.textContent = "⚠️ Pendiente de pago"
            span.classList.remove("cumple-si")
            span.classList.add("cumple-no")
        }
        checkBox.style.display = "none";



        let datosFacturaParaAlimentar = {
            numeroReqFac: "PENDIENTE-NUMERO-REQUERIMIENTO",
            fechaReqFac: "PENDIENTE-NUMERO-REQUERIMIENTO",
            plazoFac: "PENDIENTE-NUMERO-REQUERIMIENTO",
            fechaFac: "PENDIENTE-NUMERO-REQUERIMIENTO",
        }

        const formNumeroReqFac = separadorPagoFactura.querySelector('div[data-id2="idReqFactura"]')
        const valueNumReq = formNumeroReqFac.querySelector("input").value
        if (valueNumReq == '') {
            asignarHint(formNumeroReqFac, listTipoHint.alerta, "Pendiente")
        } else {
            datosFacturaParaAlimentar.numeroReqFac = valueNumReq
        }
        const formPlazoFac = separadorPagoFactura.querySelector('div[data-id2="idPlazoFactura"]')
        const valuePlazoReq = formPlazoFac.querySelector("input").value
        if (valuePlazoReq == '') {
            asignarHint(formPlazoFac, listTipoHint.alerta, "Pendiente")
        } else {
            datosFacturaParaAlimentar.plazoFac = valuePlazoReq
        }
        const formFechaReqFac = separadorPagoFactura.querySelector('div[data-id2="idFechaReqFactura"]')
        const valueFechaReq = formFechaReqFac.querySelector("input").value
        if (valueFechaReq == '') {
            asignarHint(formFechaReqFac, listTipoHint.alerta, "Pendiente")
        } else {
            datosFacturaParaAlimentar.fechaReqFac = inputToFormatoFecha(valueFechaReq)
        }
        const formFechaFac = separadorPagoFactura.querySelector('div[data-id2="idFechaFactura"]')
        const valueFechaFac = formFechaFac.querySelector("input").value
        if (valueFechaFac == '') {
            asignarHint(formFechaFac, listTipoHint.alerta, "Pendiente")
        } else {
            datosFacturaParaAlimentar.fechaFac = inputToFormatoFecha(valueFechaFac)
        }

        rellenarDatosFactura(datosFacturaParaAlimentar)

        boton.textContent = "✏️ Corregir"
    }

    // checkBox.disabled = true
    estadoEdicionFactura = !cambiador
    pintadoInputsFactura()
}

function pintadoInputsFactura() {
    const separadorPagoFactura = document.querySelector('.separador2[data-id3="sepradorPagoFactura"]')
    const formTempo = separadorPagoFactura.querySelector('.form-group-type2')
    const checkBox = formTempo.querySelector("input")

    // separadorPagoFactura.querySelectorAll(".agrupador").forEach(agrupado => {
    //     if (!checkBox.checked) {
    //         agrupado.style.display = "flex"
    //     } else {
    //         agrupado.style.display = "none"
    //     }
    // })

    console.log("estadoEdicionDam", estadoEdicionFactura)
    // separadorPagoFactura.querySelectorAll(".agrupador input").forEach(input => {
    //     input.readOnly = !estadoEdicionFactura
    //     // if (!estadoEdicionDam) {
    //     // }

    // })
}

document.querySelector('.separador2[data-id4="separadorCombos"]').addEventListener("change", (e) => {
    const dataIdPadre = e.target.parentElement.dataset.id
    console.log("e.target.value", e.target.value)
    console.log("padre", dataIdPadre)
    switch (dataIdPadre) {
        case listIDs.idInformeArt2:
            seleccionInputsHelper.indexArt2 = e.target.value
            break;
        case listIDs.idLugarAforo:
            seleccionInputsHelper.indexLugarAforo = e.target.value

            break;
        case listIDs.idCorreoCeca:
            seleccionInputsHelper.indexCorreoCeca = e.target.value

            break;
        case listIDs.idNombreEncargado:
            seleccionInputsHelper.indexEncargado = e.target.value
            break;

        default:
            break;
    }
    pintarCuadrosInput()
})

function changeEdicionInputsDams(cambiador, boton) {
    const inputs = document.querySelectorAll(".form-group[data-id2] > input")
    inputs.forEach((input) => {
        input.readOnly = cambiador
    })
    document.querySelector("input#bultos").disabled = cambiador
    document.querySelector("input#unidComer").disabled = cambiador
    if (!cambiador) {
        boton.textContent = "💾 Guardar Correccion"
    } else {
        boton.textContent = "✏️ Corregir"
    }

    estadoEdicionDam = !cambiador
}

function rellenarInfoCorreccion() {
    const contenedor = document.querySelector('.separador2[data-id3="sepradorInputs"]')
    Object.entries(listIDs2).forEach(([key, value]) => {

        const inputTempo = contenedor.querySelector(`.form-group[data-id2="${value[0]}"] > input`)
        const padreInput = inputTempo.parentNode
        const small = padreInput.querySelector("small")
        if (inputTempo.value.includes("PENDIENTE") && small) {
            asignarHint(padreInput, listTipoHint.alerta, "VERIFICAR")
        }else if(small){
            asignarHint(padreInput, listTipoHint.oculto, "VERIFICAR")
        }

        dataAlimentadorWord.fromDam[value[1]] = inputTempo.value

    })

    // document.getElementById("input#bultos")
    // if (estadoSeleccionBultosTipo) {
        
    // }else{

    // }

    actualizarPrevisualizacion()
}

document.getElementById("idCheckboxFactura").addEventListener("change", (e) => {
    estadoPagoFacturas = e.target.checked
})

document.querySelector(".contentRadios").addEventListener("change", (e) => {
    if (e.target.type === 'radio') {
        // estado.textContent = `Seleccionado: ${e.target.value}`;
        // console.log(`Seleccionado: ${e.target.value}`)
        const formBultos = document.querySelector('div[data-id2="idBultosReco"]')    
        const formUndComer = document.querySelector('div[data-id2="idUnidComerReco"]')    
        if (e.target.value=="bultos") {
            dataAlimentadorWord.estadoSeleccionBultos = true
            formBultos.style.display = "inline"
            formUndComer.style.display = "none"
        }else{
            dataAlimentadorWord.estadoSeleccionBultos = false
            formBultos.style.display = "none"
            formUndComer.style.display = "inline"
        }
        // dataAlimentadorWord.estadoSeleccionBultos = (e.target.value=="bultos")
    }
})

function pintarCuadrosInputBlanco() {
    const formArt2 = document.querySelector('.form-group[data-id="idInformeArt2"]')
    const selectArt2 = formArt2.querySelector("select")
    selectArt2.innerHTML = ''
    document.querySelector(`.form-group[data-id="${listIDs.idFechaArt2}"] input`).value = ''
    asignarHint(formArt2, listTipoHint.error, "Empresa sin INFO")

    const formLugar = document.querySelector('.form-group[data-id="idLugarAforo"]')
    const selectLugar = formLugar.querySelector("select")
    selectLugar.innerHTML = ''
    asignarHint(formLugar, listTipoHint.error, "Empresa sin INFO")

    const formCorreo = document.querySelector('.form-group[data-id="idCorreoCeca"]')
    const selectCorreo = formCorreo.querySelector("select")
    selectCorreo.innerHTML = ''
    asignarHint(formCorreo, listTipoHint.error, "Empresa sin INFO")

    const formEncargado = document.querySelector('.form-group[data-id="idNombreEncargado"]')
    const selectEncargado = formEncargado.querySelector("select")
    selectEncargado.innerHTML = ''
    document.querySelector(`.form-group[data-id="${listIDs.idDNIEncargado}"] input`).value = ''
    asignarHint(formEncargado, listTipoHint.error, "Empresa sin INFO")
}