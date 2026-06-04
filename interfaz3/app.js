//Importacion Store
import { setState, suscribir, setOtrosDatos } from './storeMI.js'

// Importacion Basicas
import * as docx from 'https://cdn.jsdelivr.net/npm/docx-preview@0.3.3/+esm';

import {API_CONFIG} from './config/config.js'

import { analyzeText, obtenerTableHTML } from './funciones/funcionesPegadoMI.js'
import { obtenerApiDam, simularAPI, obtenerApiDamCompleto } from './funciones/funcionesAPIMI.js';
import { numeroAPalabras, nomAduana, formatearResumen, fechaToFormatoInput, inputToFormatoFecha, reconfiguracionObjeto, formatearNumeroDOC, obtenerMercaReconocida } from './funciones/funcionesBasicas.js'
//Elementos de modal

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
    idFechaNumeracion: ["idFechaNumeracion", "fechaNumeracion"],
    idAduanaOrigen: ["idAduanaOrigen", "aduanaNumeracion"],
    idNombreEmpresa: ["idNombreEmpresa", "nombreEmpresa"],
    idRucEmpresa: ["idRucEmpresa", "ruc"],
    idCantBultosNumber: ["idCantBultosNumber", "cantBultosNumero"],
    idCantBultosTexto: ["idCantBultosTexto", "cantBultosTexto"],
    idAgenteAduana: ["idAgenteAduana", "agenteAduana"],
    idDomicilioFiscal: ["idDomicilioFiscal", "domicilioFiscal"],
    idDescriMerca: ["idDescriMerca", "descripcionMerca"],
    idPartiNandina: ["idPartiNandina", "partidaNandina"],
    idPartiNabandina: ["idPartiNabandina", "partidaNabandina"],
    idBultosReco: ["idBultosReco", "bultosReconocidos"],
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
//ESTADOS
let blob = null
let estadoBTNpegadoModal = null
// let estadoPagoFacturas = true
const KEYS_PAGO_FACTURA = {
    TIPOGENERAL:{
        PLAZO: "PLAZO",
        VENCIMIENTO: "VENCIMIENTO",
    },
    TIPOPLAZOS:{
        FECHAFACTURA: "FECHAFACTURA",
        FECHALLEGADA: "FECHALLEGADA",
        FECHABL: "FECHABL"
    }
}
let estadoPagoFacturaComplejo = {
    estadoPagoFacturas : true,
    tipo : KEYS_PAGO_FACTURA.TIPOGENERAL.PLAZO,
    tipoPlazos : KEYS_PAGO_FACTURA.TIPOPLAZOS.FECHAFACTURA
}

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
        aduanaNumeracion: "PENDIENTE-ADUANA-NUMERACION",
        fechaCancelacionTributos: "PENDIENTE-FECHA-CANCELACION",
        rangoSeriesAcogida: "PENDIENTE-RANGO-ACOGIDO",
        rangoSeriesAcogidaSoloPeco: "PENDIENTE-RANGO-SOLOPECO",
        descripcionMerca: "PENDIENTE-DESCRIPCION",
        partidaNandina: "PENDIENTE-NANDINA",
        partidaNabandina: "PENDIENTE-NABANDINA",
        bultosReconocidos: "PENDIENTE-BULTOS-RECO",

    },
    datosFactura: {
        numeroReqFac: "PENDIENTE-NUMERO-REQUERIMIENTO",
        fechaReqFac: "PENDIENTE-FECHA-REQUERIMIENTO",
        plazoFac: "PENDIENTE-PLAZO-FACTURA",
        fechaFac: "PENDIENTE-FECHA-FACTURA",
        fechaLlegada: "PENDIENTE-FECHA-LLEGADA",
        fechaBL: "PENDIENTE-FECHA-BL",
        fechaVencimiento: "PENDIENTE-FECHA-VENCIMIENTO"
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
    estadoJuridiccionLoreto: false,
    estadoCompleTipoFactura: "PLAZO",
    estadoCompleTipoPlazo: "FECHAFACTURA",
}

let dataTemporalGuias = []
let editandoGuiaIndex = null
let estadoLocal = {}
let seleccionInputsHelper = {
    indexArt2: null,
    indexLugarAforo: null,
    fechaAforo: null,
    indexCorreoCeca: null,
    fechaCorreoCeca: null,
    indexEncargado: null
}

// const response = await fetch("semiPlantillaFinal.docx");
// const contentResolucion = await response.arrayBuffer();
const tipoDocumento = {
    resolucion: "resolucion",
    informe: "informe",
    informeNumerado: "informeNumerado"
}

let seleccionTipoDocumento = tipoDocumento.informe

let contentResolucion = null
let contentInforme = null
let contentInformeNumerado = null

// Función principal para actualizar la previsualización estilo "documento"
async function actualizarPrevisualizacion() {

    const previewContainer = document.getElementById('previewBody');
    
    let content = null
    if (seleccionTipoDocumento == tipoDocumento.resolucion) {
        if (contentResolucion == null) {
            const response = await fetch("semiPlantillaFinalNUEVO.docx");
            contentResolucion = await response.arrayBuffer();
        }
        content = contentResolucion
    }else if(seleccionTipoDocumento == tipoDocumento.informeNumerado){
        if (contentInformeNumerado == null) {
            // const response = await fetch("semiPlantillaFinalInformeV2.docx");
            const response = await fetch("semiPlantillaFinalInformeV3NumeradoNUEVO.docx");
            contentInformeNumerado = await response.arrayBuffer();
        }
        content = contentInformeNumerado
    }else{
        if (contentInforme == null) {
            const response = await fetch("semiPlantillaFinalInformeV2NUEVO.docx");
            contentInforme = await response.arrayBuffer();
        }
        content = contentInforme
    }
    
    const zip = new PizZip(content);
    const doc = new window.docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        // parser: angularParser
    });

    const reconfiguracionDataAlimentador = reconfiguracionObjeto(dataAlimentadorWord)
    console.log("reconfiguracionDataAlimentador", reconfiguracionDataAlimentador)
    doc.render({
        ...reconfiguracionDataAlimentador
    });

    blob = doc.getZip().generate({
        type: "blob",
        mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    });

    console.log("blob", blob)
    console.log("docx", docx)
    console.log("rr", document.getElementById("previewDocx"))
    docx.renderAsync(blob, document.getElementById("previewDocx"));

}



//Funciones Modal
async function pasteFromClipboard(type = "peco") {
    try {
        // Solicitar permiso si es necesario
        const permission = await navigator.permissions.query({ name: 'clipboard-read' });

        if (permission.state === 'denied') {
            // alert('Permiso denegado. Usa Ctrl+V manualmente.');
            alert('Permiso denegado. Debe otorgar el permiso.');
            return;
        }

        const text = await navigator.clipboard.readText();
        // document.getElementById('pasteArea').value = text;
        let data = analyzeText(text);
        console.log("data", data)

        if (data["alerta"]) {
            alert(data["alerta"])
            return;
        }

        if (type == "peco") {
            const verificarPeco = verificaforPegadoPeco(data["data"])
            // console.log(verificarPeco)
            if (!verificarPeco["verificador"]) {
                alert("esta tabla no cumple con los requisitosPECO/AMAZONIA")
                return
            }

        } else {
            const verificarPeco = verificaforPegadoTributos(data["data"])
            // console.log(verificarPeco)
            if (!verificarPeco["verificador"]) {
                alert("esta tabla no cumple con los requisitos TRIBUTARIOS")
                return
            }

        }


        let html = obtenerTableHTML(data["data"])
        if (html == undefined) {
            alert("Error en la generacion de la tabla")
        }
        if (type == "peco") {
            document.getElementById("idTablaContenidoPECO").innerHTML = html
        } else {
            document.getElementById("idTablaContenidoTRIBUTOS").innerHTML = html
        }
    } catch (err) {
        console.log('Error al leer portapapeles:', err);
        alert('No se pudo leer el portapapeles :C.');
    }
}

function verificaforPegadoTributos(data) {
    console.log("verificando PECO", data)
    const cantFilas = data.length
    if (cantFilas < 10 || cantFilas > 11) {
        return { verificador: false }
    }

    // verificador de columnas entre 6 y 7
    let minColumn = data[0].length
    let maxColumn = data[0].length
    data.forEach(fila => {
        if (fila.length < minColumn) {
            minColumn = fila.length
        }
        if (fila.length > maxColumn) {
            maxColumn = fila.length
        }
    })
    if ((minColumn < 6 || minColumn > 7) || (maxColumn < 6 || maxColumn > 7)) {
        return { verificador: false }
    }


    let tempoCuadroTributos = {
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
    }

    // let verificadorCumplimiento =
    for (let index = 0; index < cantFilas; index++) {
        const fila = data[index];
        if (fila[0].includes("GENERAL")) {
            tempoCuadroTributos.cuadroGeneral.IGV[0] = Number(fila[1])
            tempoCuadroTributos.cuadroGeneral.IGV[5] = Number(fila[6])
            tempoCuadroTributos.cuadroGeneral.IGV[4] = Number(fila[5])
        }
        if (fila[0].includes("MUNICIPAL")) {
            tempoCuadroTributos.cuadroGeneral.IPM[0] = Number(fila[1])
            tempoCuadroTributos.cuadroGeneral.IPM[5] = Number(fila[6])
            tempoCuadroTributos.cuadroGeneral.IPM[4] = Number(fila[5])
        }
        if (fila[0].includes("VALOREM")) {
            tempoCuadroTributos.cuadroGeneral.AdValorem[0] = Number(fila[1])
            tempoCuadroTributos.cuadroGeneral.AdValorem[5] = Number(fila[6])
            tempoCuadroTributos.cuadroGeneral.AdValorem[4] = Number(fila[5])
        }
        if (fila[0].includes("TOTAL")) {
            tempoCuadroTributos.cuadroGeneral.totales[0] = Number(fila[1])
            tempoCuadroTributos.cuadroGeneral.totales[5] = Number(fila[6])
            tempoCuadroTributos.cuadroGeneral.totales[4] = Number(fila[5])
        }

        if (index == (cantFilas - 1)) {
            tempoCuadroTributos.miniCuadro.tipoCambio = fila[3]
        }
    }



    rellenarCuadroTributario(tempoCuadroTributos)

    return { verificador: true }
}


function verificaforPegadoPeco(data) {
    comunicador("verificando PECO", data)
    //debe contener entre 4 y 5 filas
    const cantFilas = data.length
    if (cantFilas < 4 || cantFilas > 5) {
        return { verificador: false }
    }

    // verificador de columnas entre 4 y 5
    let minColumn = data[0].length
    let maxColumn = data[0].length
    data.forEach(fila => {
        if (fila.length < minColumn) {
            minColumn = fila.length
        }
        if (fila.length > maxColumn) {
            maxColumn = fila.length
        }
    })
    if ((minColumn < 4 || minColumn > 5) || (maxColumn < 4 || maxColumn > 5)) {
        return { verificador: false }
    }

    let numeroDocumentoRegularizacion = ""
    let fechaDocumentoRegularizacion = ""
    let numeroDocumentoConfirmacion = ""
    let fechaDocumentoConfirmacion = ""
    //verificador contenido
    if (!data[data.length - 4][minColumn - 4].includes("egularizaci")) {
        return { verificador: false }
    } else {
        numeroDocumentoRegularizacion = data[data.length - 4][minColumn - 3]
        fechaDocumentoRegularizacion = data[data.length - 4][minColumn - 2]
    }
    if (!data[data.length - 3][minColumn - 4].includes("onfirmaci")) {
        return { verificador: false }
    } else {
        numeroDocumentoConfirmacion = data[data.length - 3][minColumn - 3]
        fechaDocumentoConfirmacion = data[data.length - 3][minColumn - 2]
    }
    if (!data[data.length - 2][minColumn - 4].includes("devoluci")) {
        return { verificador: false }
    }
    if (!data[data.length - 1][minColumn - 4].includes("determinaci")) {
        return { verificador: false }
    }


    rellenarCuadroPecoAmazonia(numeroDocumentoRegularizacion, fechaDocumentoRegularizacion, numeroDocumentoConfirmacion, fechaDocumentoConfirmacion)

    // console.log(dataAlimentadorWord.cuadroPedoAmazonia)

    return { verificador: true }

}



//Listener
const listaGrupos = document.querySelectorAll(".form-group[data-id]")
listaGrupos.forEach(grupo => {
    // console.log(grupo.dataset.id)
    const botoncito = grupo.querySelector("button")
    if (botoncito) {
        botoncito.addEventListener("click", (e) => {
            e.preventDefault();
            switch (grupo.dataset.id) {
                case listIDs.idModalPeca:
                    console.log("criscris1")
                    mostrarModal(listIDs.idModalPeca)
                    break;

                case listIDs.idModalTributos:
                    mostrarModal(listIDs.idModalTributos)
                    console.log("criscris2")
                    break;
                default:
                    break;
            }
        })
    }
})
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

document.addEventListener("change", (e) => {

    comunicador("miniComu",e.target.id)
    comunicador("miniComu",e.target.type)

    switch (e.target.type) {
        case "checkbox":
            switch (e.target.id) {
                case "idCheckboxFactura":
                    estadoPagoFacturaComplejo.estadoPagoFacturas = e.target.checked
                    comunicador("ticket",e.target.id)
                    pintadoInputsFactura()
                    break;
                default:
                    break;
            }    

            break;
        case "radio":
            switch (e.target.id) {
                case "juridiccionLoreto":
                    rellenarJuridiccion(true)
                    break;
                case "juridiccionOtros":
                    rellenarJuridiccion(false)
                    break;
                case "fechaPlazoTipo":
                    estadoPagoFacturaComplejo.tipo = KEYS_PAGO_FACTURA.TIPOGENERAL.PLAZO
                    pintadoInputsFactura()
                    break;
                case "fechaVencimientoTipo":
                    estadoPagoFacturaComplejo.tipo = KEYS_PAGO_FACTURA.TIPOGENERAL.VENCIMIENTO
                    pintadoInputsFactura()
                    break;
                case "fechaFacturaPlazo":
                    estadoPagoFacturaComplejo.tipoPlazos = KEYS_PAGO_FACTURA.TIPOPLAZOS.FECHAFACTURA
                    pintadoInputsFactura()
                    break;
                case "fechaLlegadaPlazo":
                    estadoPagoFacturaComplejo.tipoPlazos = KEYS_PAGO_FACTURA.TIPOPLAZOS.FECHALLEGADA
                    pintadoInputsFactura()
                    break;
                case "fechaBLPlazo":
                    estadoPagoFacturaComplejo.tipoPlazos = KEYS_PAGO_FACTURA.TIPOPLAZOS.FECHABL
                    pintadoInputsFactura()
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }


    // switch (e.target.id) {
    //     case "idCheckboxFactura":
    //         estadoPagoFacturas = e.target.checked
    //         comunicador("ticket",e.target.id)
    //         pintadoInputsFactura()
    //         break;
    
    //     case "idRadiosJuridiccion":
    //         if (e.target.type === 'radio') {
    //             rellenarJuridiccion((e.target.value == "juridiccionLoreto"))
    //         }
    //         break;
    //     default:
    //         break;
    // }

})

// document.getElementById("idRadiosJuridiccion").addEventListener("change",(e)=>{
//     comunicador("miniComunicador2",e.target.type )
//     comunicador("miniComunicador2",e.target.id )
//     if (e.target.type === 'radio') {
//         if (e.target.value == "juridiccionLoreto") {
//             // dataAlimentadorWord.estadoJuridiccionLoreto = true
//             rellenarJuridiccion(true)
//         }else if(e.target.value == "juridiccionOtros"){
//             // dataAlimentadorWord.estadoJuridiccionLoreto = false
//             rellenarJuridiccion(false)
//         }
//     }
// })

let estadoEdicionDam = false
let estadoEdicionFactura = false
//Botones con ID
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
                changeEdicionPagoFactura(estadoEdicionFactura, boton)
                break
            case "cerrarModalGuias":
                cerrarModalGuias()
                break;
            case "btnAddGuias":
                agregarGuia()
                break;
            case "descargarWordBtn":
                let nombreDocumentoDescarga = "documentoTemporal.docx"
                if (seleccionTipoDocumento == tipoDocumento.informe) {
                    nombreDocumentoDescarga = `Informe Regularizacion ${dataAlimentadorWord.fromDam.numeroDam}.docx`
                }else{
                    nombreDocumentoDescarga = `Resolucion Regularizacion ${dataAlimentadorWord.fromDam.numeroDam}.docx`
                }
                saveAs(blob, nombreDocumentoDescarga);
                break;
            case "idEleccionInforme":
                if (seleccionTipoDocumento != tipoDocumento.informe) {
                    seleccionTipoDocumento = tipoDocumento.informe
                    pintarBotonesFooter()
                    actualizarPrevisualizacion()
                }
                break
            case "idEleccionInformeNumerado":
                if (seleccionTipoDocumento != tipoDocumento.informeNumerado) {
                    seleccionTipoDocumento = tipoDocumento.informeNumerado
                    pintarBotonesFooter()
                    actualizarPrevisualizacion()
                }
                break
            case "idEleccionResolucion":
                if (seleccionTipoDocumento != tipoDocumento.resolucion) {
                    seleccionTipoDocumento = tipoDocumento.resolucion
                    pintarBotonesFooter()
                    actualizarPrevisualizacion()
                }
                break
            default:
                comunicador("OTRITO")
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
        document.getElementById("idCheckboxFactura").disabled = false
        document.getElementById("fechaPlazoTipo").disabled = false
        document.getElementById("fechaVencimientoTipo").disabled = false
        document.getElementById("fechaFacturaPlazo").disabled = false
        document.getElementById("fechaLlegadaPlazo").disabled = false
        document.getElementById("fechaBLPlazo").disabled = false
    } else {
        document.getElementById("idCheckboxFactura").disabled = true
        document.getElementById("fechaPlazoTipo").disabled = true
        document.getElementById("fechaVencimientoTipo").disabled = true
        document.getElementById("fechaFacturaPlazo").disabled = true
        document.getElementById("fechaLlegadaPlazo").disabled = true
        document.getElementById("fechaBLPlazo").disabled = true
        const span = formTempo.querySelector("span")
        span.style.display = "inline"
        // span.textContent = (checkBox.checked) ? "✅ Pagado" : "⚠️ Pendiente Pago"
        if (checkBox.checked) {
            span.textContent = "✅ Pagado"
            span.classList.add("cumple-si")
            span.classList.remove("cumple-no")
        } else {
            span.textContent = "⚠️ No ha realizado el pago"
            span.classList.remove("cumple-si")
            span.classList.add("cumple-no")
        }
        checkBox.style.display = "none";



        let datosFacturaParaAlimentar = {
            numeroReqFac: "PENDIENTE-NUMERO-REQUERIMIENTO",
            fechaReqFac: "PENDIENTE-FECHA-REQUERIMIENTO",
            plazoFac: "PENDIENTE-PLAZO-FACTURA",
            fechaFac: "PENDIENTE-FECHA-FACTURA",
            fechaLlegada: "PENDIENTE-FECHA-LLEGADA",
            fechaBL: "PENDIENTE-FECHA-BL",
            fechaVencimiento: "PENDIENTE-FECHA-VENCIMIENTO"
        }

        const formNumeroReqFac = separadorPagoFactura.querySelector('div[data-id2="idReqFactura"]')
        const valueNumReq = formNumeroReqFac.querySelector("input").value
        if (valueNumReq == '') {
            asignarHint(formNumeroReqFac, listTipoHint.alerta, "Pendiente")
        } else {
            asignarHint(formNumeroReqFac, listTipoHint.oculto, "Pendiente")
            datosFacturaParaAlimentar.numeroReqFac = valueNumReq
        }
        const formPlazoFac = separadorPagoFactura.querySelector('div[data-id2="idPlazoFactura"]')
        const valuePlazoReq = formPlazoFac.querySelector("input").value
        if (valuePlazoReq == '') {
            asignarHint(formPlazoFac, listTipoHint.alerta, "Pendiente")
        } else {
            asignarHint(formPlazoFac, listTipoHint.oculto, "Pendiente")
            datosFacturaParaAlimentar.plazoFac = valuePlazoReq
        }
        const formFechaReqFac = separadorPagoFactura.querySelector('div[data-id2="idFechaReqFactura"]')
        const valueFechaReq = formFechaReqFac.querySelector("input").value
        if (valueFechaReq == '') {
            asignarHint(formFechaReqFac, listTipoHint.alerta, "Pendiente")
        } else {
            asignarHint(formFechaReqFac, listTipoHint.oculto, "Pendiente")
            datosFacturaParaAlimentar.fechaReqFac = inputToFormatoFecha(valueFechaReq).replaceAll("/",".")
        }
        const formFechaFac = separadorPagoFactura.querySelector('div[data-id2="idFechaFactura"]')
        const valueFechaFac = formFechaFac.querySelector("input").value
        if (valueFechaFac == '') {
            asignarHint(formFechaFac, listTipoHint.alerta, "Pendiente")
        } else {
            asignarHint(formFechaFac, listTipoHint.oculto, "Pendiente")
            datosFacturaParaAlimentar.fechaFac = inputToFormatoFecha(valueFechaFac).replaceAll("/",".")
        }
        const formFechaLlegada = separadorPagoFactura.querySelector('div[data-id2="idFechaLlegada"]')
        const valueFechaLlegada = formFechaLlegada.querySelector("input").value
        if (valueFechaLlegada == '') {
            asignarHint(formFechaLlegada, listTipoHint.alerta, "Pendiente")
        } else {
            asignarHint(formFechaLlegada, listTipoHint.oculto, "Pendiente")
            datosFacturaParaAlimentar.fechaLlegada = inputToFormatoFecha(valueFechaLlegada).replaceAll("/",".")
        }
        const formFechaBL = separadorPagoFactura.querySelector('div[data-id2="idFechaBL"]')
        const valueFechaBL = formFechaBL.querySelector("input").value
        if (valueFechaBL == '') {
            asignarHint(formFechaBL, listTipoHint.alerta, "Pendiente")
        } else {
            asignarHint(formFechaBL, listTipoHint.oculto, "Pendiente")
            datosFacturaParaAlimentar.fechaBL = inputToFormatoFecha(valueFechaBL).replaceAll("/",".")
        }
        const formFechaVencimiento = separadorPagoFactura.querySelector('div[data-id2="idFechaVencimiento"]')
        const valueFechaVencimiento = formFechaVencimiento.querySelector("input").value
        if (valueFechaVencimiento == '') {
            asignarHint(formFechaVencimiento, listTipoHint.alerta, "Pendiente")
        } else {
            asignarHint(formFechaVencimiento, listTipoHint.oculto, "Pendiente")
            datosFacturaParaAlimentar.fechaVencimiento = inputToFormatoFecha(valueFechaVencimiento).replaceAll("/",".")
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

    if (!checkBox.checked) {
        separadorPagoFactura.querySelector("#contenedorFacturasNivel1").style.display = "block"

        if (estadoPagoFacturaComplejo.tipo == KEYS_PAGO_FACTURA.TIPOGENERAL.PLAZO) {
            separadorPagoFactura.querySelector("#contenedorFacturasNivel2-01").style.display = "block"
            separadorPagoFactura.querySelector("#contenedorFacturasNivel2-02").style.display = "none"

            if (estadoPagoFacturaComplejo.tipoPlazos == KEYS_PAGO_FACTURA.TIPOPLAZOS.FECHAFACTURA) {
                separadorPagoFactura.querySelector('.form-group[data-id2="idFechaFactura"]').style.display = "flex"
                separadorPagoFactura.querySelector('.form-group[data-id2="idFechaLlegada"]').style.display = "none"
                separadorPagoFactura.querySelector('.form-group[data-id2="idFechaBL"]').style.display = "none"
            }else if(estadoPagoFacturaComplejo.tipoPlazos == KEYS_PAGO_FACTURA.TIPOPLAZOS.FECHALLEGADA){
                separadorPagoFactura.querySelector('.form-group[data-id2="idFechaFactura"]').style.display = "none"
                separadorPagoFactura.querySelector('.form-group[data-id2="idFechaLlegada"]').style.display = "flex"
                separadorPagoFactura.querySelector('.form-group[data-id2="idFechaBL"]').style.display = "none"
            }else if(estadoPagoFacturaComplejo.tipoPlazos == KEYS_PAGO_FACTURA.TIPOPLAZOS.FECHABL){
                separadorPagoFactura.querySelector('.form-group[data-id2="idFechaFactura"]').style.display = "none"
                separadorPagoFactura.querySelector('.form-group[data-id2="idFechaLlegada"]').style.display = "none"
                separadorPagoFactura.querySelector('.form-group[data-id2="idFechaBL"]').style.display = "flex"
            }
        }else if(estadoPagoFacturaComplejo.tipo == KEYS_PAGO_FACTURA.TIPOGENERAL.VENCIMIENTO){
            separadorPagoFactura.querySelector("#contenedorFacturasNivel2-01").style.display = "none"
            separadorPagoFactura.querySelector("#contenedorFacturasNivel2-02").style.display = "block"
        }

    } else {
        separadorPagoFactura.querySelector("#contenedorFacturasNivel1").style.display = "none"
    }



    console.log("estadoEdicionDam", estadoEdicionFactura)
    separadorPagoFactura.querySelectorAll(".agrupador input").forEach(input => {
        input.readOnly = !estadoEdicionFactura
        // if (!estadoEdicionDam) {
        // }

    })
}

pintadoInputsFactura()

function changeEdicionInputsDams(cambiador, boton) {
    const inputs = document.querySelectorAll(".form-group[data-id2] > input")
    inputs.forEach((input) => {
        input.readOnly = cambiador
    })
    if (!cambiador) {
        boton.textContent = "💾 Guardar Correccion"
    } else {
        boton.textContent = "✏️ Corregir"
    }

    estadoEdicionDam = !cambiador
}

//Funciones
function mostrarModal(id) {
    estadoBTNpegadoModal = id

    const modal = document.getElementById("miModal")

    const tablaTributos = document.getElementById("idTablaContenidoTRIBUTOS")
    const tablaPeco = document.getElementById("idTablaContenidoPECO")

    modal.style.display = "flex"
    if (estadoBTNpegadoModal == listIDs.idModalTributos) {
        modal.querySelector("h1").textContent = "PEGADO [TRIBUTOS]"
        tablaTributos.classList.remove("noView")
        tablaPeco.classList.add("noView")
    } else if (estadoBTNpegadoModal == listIDs.idModalPeca) {
        modal.querySelector("h1").textContent = "PEGADO [PECO]"
        tablaTributos.classList.add("noView")
        tablaPeco.classList.remove("noView")
    }
}
function mostrarModalGuias() {
    const modal = document.getElementById("miModalGuias")
    modal.style.display = "flex"
    renderizarGuias()
}
function cerrarModalGuias() {
    rellenarGuias(dataTemporalGuias)
    // console.log(dataAlimentadorWord.guiasData)
    document.getElementById("miModalGuias").style.display = "none"
}

function mostrarModalConfig() {
    const modal = document.getElementById("miModalConfig")
    modal.style.display = "flex"
}

function cerrarModal() {
    estadoBTNpegadoModal = null
    document.getElementById("miModal").style.display = "none"
}



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

    // console.log("data", data)

    setState(infoRuc)

    // pintarCuadrosInput(infoRuc)

    rellenarRangoAcogidas(data["series"])
    // console.log("dataAlimentadorWord.fromDam")
    // console.log(dataAlimentadorWord.fromDam)


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




function rellenarInfoCorreccion() {
    const contenedor = document.querySelector('.separador2[data-id3="sepradorInputs"]')
    Object.entries(listIDs2).forEach(([key, value]) => {

        dataAlimentadorWord.fromDam[value[1]] = contenedor.querySelector(`.form-group[data-id2="${value[0]}"] > input`).value

    })

    actualizarPrevisualizacion()
}


function rellenarCuadroPecoAmazonia(numDocRegu, fechDocRegu, numDocConf, fechDocConf) {
    dataAlimentadorWord.cuadroPedoAmazonia.numeroRegularizacion = numDocRegu
    dataAlimentadorWord.cuadroPedoAmazonia.fechaRegularizacion = fechDocRegu.replaceAll("/", ".")
    dataAlimentadorWord.cuadroPedoAmazonia.numeroConfirmacion = numDocConf
    dataAlimentadorWord.cuadroPedoAmazonia.fechaConfirmacion = fechDocConf.replaceAll("/", ".")

    console.log("dataAlimentadorWord.cuadroPedoAmazonia")
    console.log(dataAlimentadorWord)
    actualizarPrevisualizacion()
}

function rellenarAlimentadorFromDam(data) {

    // console.log("rellenarAlimentadorFromDam",data)
    const rucData = data["rucImportador"].split("-")[1]
    const razonSocialData = data["nomImportador"]
    dataAlimentadorWord.fromDam.nombreEmpresa = razonSocialData
    dataAlimentadorWord.fromDam.ruc = rucData
    setOtrosDatos(rucData, razonSocialData)


    dataAlimentadorWord.fromDam.aduanaNumeracion = nomAduana(data["dam"].slice(0, 3)).toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "); 
    
    dataAlimentadorWord.fromDam.agenteAduana = data["nomDeclarante"]
    dataAlimentadorWord.fromDam.cantBultosNumero = Number(data["cantBultos"].replace(',', '')).toString()
    dataAlimentadorWord.fromDam.cantBultosTexto = numeroAPalabras(Number(data["cantBultos"].replace(',', '')))
    dataAlimentadorWord.fromDam.domicilioFiscal = data["direccionFiscal"]
    dataAlimentadorWord.fromDam.fechaNumeracion = data["fechaNumeracion"].replaceAll("/", ".")
    dataAlimentadorWord.fromDam.fechaCancelacionTributos = data["fechaCancelacion"].replaceAll("/", ".")
    dataAlimentadorWord.fromDam.numeroDam = data["dam"].slice(0, -3)

    console.log("dataAlimentadorWord.fromDam")
    console.log(dataAlimentadorWord)
    actualizarPrevisualizacion()
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

function rellenarGuias(dataGuias) {
    dataAlimentadorWord.guiasData = dataGuias

    console.log("dataAlimentadorWord.guiasData")
    console.log(dataAlimentadorWord)
    actualizarPrevisualizacion()
}

function rellenarJuridiccion(isLoreto) {
    dataAlimentadorWord.estadoJuridiccionLoreto = isLoreto
    actualizarPrevisualizacion()
}

function rellenarCuadroTributario(tempoCuadroTributos) {
    dataAlimentadorWord.cuadroDeudaTributaria = tempoCuadroTributos
    console.log("dataAlimentadorWord.cuadroDeudaTributaria")
    console.log(dataAlimentadorWord)
    actualizarPrevisualizacion()
}

function rellenarInfoInputs(fromInputsTempo) {
    dataAlimentadorWord.fromInputs = fromInputsTempo
    console.log("dataAlimentadorWord.fromInputs")
    console.log(dataAlimentadorWord)
    actualizarPrevisualizacion()
}

function rellenarDatosFactura(dataFactura) {
    dataAlimentadorWord.datosFactura.numeroReqFac = dataFactura.numeroReqFac
    dataAlimentadorWord.datosFactura.fechaReqFac = dataFactura.fechaReqFac
    dataAlimentadorWord.datosFactura.plazoFac = dataFactura.plazoFac
    dataAlimentadorWord.datosFactura.fechaFac = dataFactura.fechaFac
    dataAlimentadorWord.datosFactura.fechaLlegada = dataFactura.fechaLlegada
    dataAlimentadorWord.datosFactura.fechaBL = dataFactura.fechaBL
    dataAlimentadorWord.datosFactura.fechaVencimiento = dataFactura.fechaVencimiento
    dataAlimentadorWord.estadoPagadoFactura = estadoPagoFacturaComplejo.estadoPagoFacturas
    dataAlimentadorWord.estadoCompleTipoFactura = estadoPagoFacturaComplejo.tipo
    dataAlimentadorWord.estadoCompleTipoPlazo = estadoPagoFacturaComplejo.tipoPlazos

    actualizarPrevisualizacion()
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



function renderizarGuias() {
    console.log("rederizando GUIAS")
    const container = document.getElementById('guias-container');

    if (dataTemporalGuias.length == 0) {
        container.innerHTML = '<p style="color: #999;">No hay guias registrados</p>';
        return
    }

    // dataTemporalGuias = dataAlimentadorWord.guiasData

    container.innerHTML = dataTemporalGuias.map((guia, index) => `
        <div class="item-responsable" data-index="${index}">
            ${editandoGuiaIndex == index ? renderizarFormularioEdicionGuia(guia, index) : renderizarVistaGuia(guia, index)}
        </div>
    `).join('');

    for (let index = 0; index < dataTemporalGuias.length; index++) {
        const contTempo = container.querySelector(`.item-responsable[data-index="${index}"]`)
        if (index == editandoGuiaIndex) {
            contTempo.querySelector(`button.btn-save-form`).onclick = () => guardarEdicionGuia(index);
            contTempo.querySelector(`button.btn-cancel`).onclick = () => cancelarEdicionGuia();
        } else {
            contTempo.querySelector(`button.btn-edit`).onclick = () => editarGuia(index);
            contTempo.querySelector(`button.btn-delete`).onclick = () => eliminarGuia(index);
        }
    }

}

function renderizarVistaGuia(guia, index) {
    return `
        <span class="item-content"> 📄: ${guia.numeroGuia} - 🏢: ${guia.ruc} - ${guia.razonSocial}</span>
        <div>
            <button class="btn-edit">✏️ Editar</button>
            <button class="btn-delete">🗑️ Eliminar</button>
        </div>
    `
}

function renderizarFormularioEdicionGuia(guia, index) {
    return `
        <div class="edit-responsable-form">
            <input type="text" id="edit-guia-numero-${index}" value="${guia.numeroGuia}" placeholder="N° GUIA" class="edit-input">
            <input type="text" id="edit-guia-ruc-${index}" value="${guia.ruc}" placeholder="RUC" class="edit-input">
            <input type="text" id="edit-guia-razonSocial-${index}" value="${guia.razonSocial}" placeholder="Razón Social" class="edit-input">
        </div>
        <div>
            <button class="btn-save-form">💾 Guardar</button>
            <button class="btn-cancel">❌ Cancelar</button>
        </div>
    `
}

function editarGuia(index) {
    editandoGuiaIndex = index;
    renderizarGuias();
}

function cancelarEdicionGuia() {
    editandoGuiaIndex = null;
    renderizarGuias();
}

function guardarEdicionGuia(index) {
    const numeroGuia = document.getElementById(`edit-guia-numero-${index}`).value.trim();
    const ruc = document.getElementById(`edit-guia-ruc-${index}`).value.trim();
    const razonSocial = document.getElementById(`edit-guia-razonSocial-${index}`).value.trim();

    if (numeroGuia && ruc && razonSocial) {
        dataTemporalGuias[index] = { numeroGuia, ruc, razonSocial };
        editandoGuiaIndex = null;
        renderizarGuias();
        // guardarEnLocalStorage();
        mostrarNotificacion('Guia actualizado ✓', 'success');
    } else {
        mostrarNotificacion('Complete todos los datos de la GUIA', 'error');
    }
}
function agregarGuia() {
    const numeroGuia = document.getElementById('new-guia-numero').value.trim();
    const ruc = document.getElementById('new-guia-ruc').value.trim();
    const razonSocial = document.getElementById('new-guia-razonSocial').value.trim();

    if (numeroGuia && ruc && razonSocial) {
        dataTemporalGuias.push({ numeroGuia, ruc, razonSocial });
        renderizarGuias();
        // guardarEnLocalStorage();
        document.getElementById('new-guia-numero').value = '';
        document.getElementById('new-guia-ruc').value = '';
        document.getElementById('new-guia-razonSocial').value = '';
        mostrarNotificacion(`Guia "${numeroGuia}" agregado ✓`, 'success');
    } else {
        mostrarNotificacion('Complete todos los datos de la GUIA', 'error');
    }
}

function eliminarGuia(index) {
    if (confirm('¿Eliminar esta Guia?')) {
        dataTemporalGuias.splice(index, 1);
        if (editandoGuiaIndex === index) editandoGuiaIndex = null;
        renderizarGuias();
        // guardarEnLocalStorage();
        mostrarNotificacion('Guia eliminado ✓', 'success');
    }
}





function mostrarNotificacion(mensaje, tipo) {
    const notificacion = document.createElement('div');
    notificacion.textContent = mensaje;
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${tipo === 'success' ? '#28a745' : tipo === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;

    document.body.appendChild(notificacion);

    setTimeout(() => {
        notificacion.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notificacion.remove(), 300);
    }, 3000);
}




//Funciones alimentador visual
function updateVisualDataFromDam() {
    // console.log("pollito")
    // const agrupados = document.querySelectorAll('.separador2[data-id3="sepradorInputs"] .form-group[data-id2] ')
    const contenedor = document.querySelector('.separador2[data-id3="sepradorInputs"]')
    // console.log(contenedor)
    Object.entries(listIDs2).forEach(([key, value]) => {
        // console.log(`${key}: ${value}`);
        contenedor.querySelector(`.form-group[data-id2="${value[0]}"] > input`).value = dataAlimentadorWord.fromDam[value[1]]
    })
}


function pintarBotonesFooter() {
    const botonSeleccionInforme = document.getElementById("idEleccionInforme")
    const botonSeleccionInformeNumerado = document.getElementById("idEleccionInformeNumerado")
    const botonSeleccionResolucion = document.getElementById("idEleccionResolucion")
    if (seleccionTipoDocumento == tipoDocumento.informe) {
        botonSeleccionInforme.style.background = "#303ef3"
        botonSeleccionInforme.style.color = "white"
        botonSeleccionResolucion.style.background = "lightgray"
        botonSeleccionResolucion.style.color = "black"
        botonSeleccionInformeNumerado.style.background = "lightgray"
        botonSeleccionInformeNumerado.style.color = "black"
    }else if(seleccionTipoDocumento == tipoDocumento.resolucion){
        botonSeleccionResolucion.style.background = "#303ef3"
        botonSeleccionResolucion.style.color = "white"
        botonSeleccionInforme.style.background = "lightgray"
        botonSeleccionInforme.style.color = "black"
        botonSeleccionInformeNumerado.style.background = "lightgray"
        botonSeleccionInformeNumerado.style.color = "black"
    }else{
        botonSeleccionInformeNumerado.style.background = "#303ef3"
        botonSeleccionInformeNumerado.style.color = "white"
        botonSeleccionInforme.style.background = "lightgray"
        botonSeleccionInforme.style.color = "black"
        botonSeleccionResolucion.style.background = "lightgray"
        botonSeleccionResolucion.style.color = "black"
    }
}


function comunicador(palabras,data) {
    if (API_CONFIG.DANKERPOINT == "POLLO24") {
        console.log(palabras,data)
    }
}

pintarBotonesFooter()



document.addEventListener("DOMContentLoaded", () => {
    actualizarPrevisualizacion()
    suscribir((estado) => {
        console.log("Cambio en estado detectado en APP.JS")
        estadoLocal = estado

        pintarCuadrosInput()
    })
})