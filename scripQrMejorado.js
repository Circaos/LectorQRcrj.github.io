let dam = null
let lastScamProporcion = 1

const contenedorInputDam = document.getElementById("idContenedorInputDam")
const formBusquedaDam = document.getElementById("formBusqueda")
const alertaInputDam = document.getElementById("idMensajeAlertaInputDam")


const contenedorInfoDam = document.getElementById("idContenedorInfoDam")
const tablaInfo = document.getElementById("idTablaInfo")
const tablaCabeceraInfo = document.getElementById("idTablaCabeceraInfo")
const btnLector = document.getElementById("idBtnLector")


const contenedorLector = document.getElementById("idContenedorLector")
const sonidoExito = new Audio('./exitoSonido.mp3');
const sonidoError = new Audio('./errorSonido.mp3');
const btnVolverScanear = document.getElementById("idBtnVolverScanear")
const btnAtrasScam = document.getElementById("idBtnAtrasScam")
const responseScam = document.getElementById("idResponseScam")
// Elementos del DOM
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resultDiv = document.getElementById('result');
const formatSpan = document.getElementById('formatSpan');
const statusDiv = document.getElementById('status');
const contenedorBtnResize = document.getElementById('idContenedorBtnResize');
const sliderZoom = document.getElementById("mi-control-zoom")
const miniContenedor = document.getElementById("miniContenedorRPT")

// Configuración del escáner
let html5QrCode = null;
let isScanning = false;
let lastResult = '';

let inicialiadoControlesScam = false
// Configuración avanzada para mejor lectura



let qrCodeConfig = {
    fps: 30, // Fotogramas por segundo
    qrbox: { width: 200, height: 200 }, // Área de escaneo
    aspectRatio: 1.0,
    disableFlip: false,
    rememberLastUsedCamera: true,
    videoConstraints: {
        facingMode: "environment", // Sigue siendo la cámara trasera
        width: { ideal: 2048 },  // ¡ASÍ LE PIDES ALTA RESOLUCIÓN!
        height: { ideal: 2048 }  // El navegador usará la resolución más cercana que pueda
    },
    supportedScanTypes: [
        Html5QrcodeScanType.SCAN_TYPE_CAMERA,
        Html5QrcodeScanType.SCAN_TYPE_FILE
    ],
    advanced: [{ focusMode: "continuous" }]
};
const supportedFormatsList = [
    'QR_CODE', 'AZTEC', 'CODABAR', 'CODE_39', 'CODE_93', 'CODE_128',
    'DATA_MATRIX', 'EAN_8', 'EAN_13', 'ITF', 'MAXICODE', 'PDF_417',
    'RSS_14', 'RSS_EXPANDED', 'UPC_A', 'UPC_E', 'UPC_EAN_EXTENSION'
];




formBusquedaDam.addEventListener("submit", async (event) => {
    event.preventDefault();
    const valorBusqueda = document.getElementById("inputBusqueda").value
    const botonBuscar = document.querySelector("#formBusqueda > button")
    if (valorBusqueda.length != 13) {
        alertaInputDam.textContent = "Error - Ingresar un DAM correcta"
        return
    } else {
        botonBuscar.disabled = true
        alertaInputDam.textContent = "Buscando ..."
    }

    // const dam = await obtenerApiDam(valorBusqueda)
    dam = await obtenerApiDam(valorBusqueda)

    if (dam == null) {
        alertaInputDam.textContent = "Error - Dam no Encontrada"
        botonBuscar.disabled = false
        return
    }

    contenedorInputDam.classList.add("noView")
    contenedorInfoDam.classList.remove("noView")

    rellenarTablaDam(dam)
    await agregarListener()

    // console.log("criscris")
    // console.log(valorBusqueda)
})


async function obtenerApiDam(dam) {
    // // const damFinalTempo = await fetch(`./${dam}.json`)

    // // console.log(damFinalTempo)
    // // if (!damFinalTempo.ok) {
    // //     return null
    // // }

    // const damFinalTempo = await fetch(`./1182610071567.json`)
    // const damFinal = await damFinalTempo.json();



    // const url = "http://localhost:3050/dtarc/getInfoDam"
    const url = "https://apiproviaspruebav1-production.up.railway.app/dtarc/getInfoDam"
    const data = { 'dua': dam }
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    const damFinal = await response.json()





    return damFinal["dam"]
}


function rellenarTablaDam(dam) {

    console.log("rellenar", dam)

    const tbodyCabecera = tablaCabeceraInfo.querySelector("tbody")
    const filaCabecera1 = tbodyCabecera.insertRow();
    filaCabecera1.insertCell(0).textContent = "DECLARACION"
    filaCabecera1.insertCell(1).textContent = dam["dam"]
    filaCabecera1.insertCell(2).textContent = "FECHA NUMERACION"
    filaCabecera1.insertCell(3).textContent = dam["fechaNumeracion"]

    const filaCabecera2 = tbodyCabecera.insertRow();
    filaCabecera2.insertCell(0).textContent = "IMPORTADOR"
    filaCabecera2.insertCell(1).textContent = dam["rucImportador"]
    let celdaImportador = filaCabecera2.insertCell(2)
    celdaImportador.colSpan = 2
    celdaImportador.textContent = dam["nomImportador"]

    const filaCabecera3 = tbodyCabecera.insertRow();
    filaCabecera3.insertCell(0).textContent = "UNDS. FISICAS"
    filaCabecera3.insertCell(1).textContent = dam["cantUndFisicas"]
    filaCabecera3.insertCell(2).textContent = "UNDS. COMERCIALES"
    filaCabecera3.insertCell(3).textContent = dam["cantUndComerciales"]


    const filaCabecera4 = tbodyCabecera.insertRow();
    filaCabecera4.insertCell(0).textContent = "SERIES"
    filaCabecera4.insertCell(1).textContent = dam["cantSeries"]
    filaCabecera4.insertCell(2).textContent = "BULTOS"
    filaCabecera4.insertCell(3).textContent = dam["cantBultos"]



    const tbody = tablaInfo.querySelector("tbody")
    const series = dam["series"]

    instertarSeries(tbody, series)
}

function instertarSeries(tbody, series) {
    for (const serie of series) {
        const fila0 = tbody.insertRow();
        let celdaSeparador = fila0.insertCell(0)
        // celdaSeparador.textContent = "-"
        celdaSeparador.colSpan = 4

        const fila = tbody.insertRow();
        fila.insertCell(0).textContent = serie["serie"]
        fila.insertCell(1).textContent = serie["partida"]
        fila.insertCell(2).textContent = serie["unidadesFisicas"]
        fila.insertCell(3).textContent = "FOB"


        const fila2 = tbody.insertRow();
        fila2.insertCell(0).textContent = ""
        fila2.insertCell(1).textContent = serie["tratoPreferente"]
        let celdaAcogimiento = fila2.insertCell(2)
        celdaAcogimiento.colSpan = 2
        celdaAcogimiento.textContent = serie["codLiber"]

        // fila.insertCell(0).textContent = serie["unidadesFisicas"]

        let veriPeco = serie["tratoPreferente"].includes("35")
        let veriAmazonia = serie["codLiber"].includes("4438")
        let claseEleccion = "filaNever"

        if (veriPeco && veriAmazonia) {
            claseEleccion = "filaPecoAmazonia"
        } else if (veriPeco) {
            claseEleccion = "filaPeco"
        } else if (veriAmazonia) {
            claseEleccion = "filaAmazonia"
        }

        // fila0.classList.add(claseEleccion)
        fila.classList.add(claseEleccion)
        fila2.classList.add(claseEleccion)


        for (const descri of serie["descripciones"]) {
            const filita = tbody.insertRow()
            filita.insertCell(0).textContent = ""
            let descriCelda = filita.insertCell(1)
            descriCelda.colSpan = 3
            descriCelda.textContent = descri

            filita.classList.add(claseEleccion)
        }

    }
}

async function agregarListener() {
    btnLector.addEventListener("click", async () => {
        console.log("cricris")
        contenedorLector.classList.remove("noView")
        contenedorInfoDam.classList.add("noView")

        await iniciarPantallaSCAM()
    })
}



/////////////////////////////////////////////////////////////////
// FUNCIONES SCAM
// Función para actualizar el estado
function updateStatus(message, type = 'info') {
    // statusDiv.className = `status ${type}`;
    // statusDiv.innerHTML = message;
}

// Función para formatear el nombre del formato
function formatFormatName(format) {
    const formatNames = {
        'QR_CODE': 'QR',
        'AZTEC': 'Aztec',
        'CODABAR': 'Codabar',
        'CODE_39': 'Code 39',
        'CODE_93': 'Code 93',
        'CODE_128': 'Code 128',
        'DATA_MATRIX': 'Data Matrix',
        'EAN_8': 'EAN-8',
        'EAN_13': 'EAN-13',
        'ITF': 'ITF-14',
        'MAXICODE': 'MaxiCode',
        'PDF_417': 'PDF417',
        'RSS_14': 'RSS-14',
        'RSS_EXPANDED': 'RSS-Expanded',
        'UPC_A': 'UPC-A',
        'UPC_E': 'UPC-E',
        'UPC_EAN_EXTENSION': 'UPC/EAN Extension'
    };
    return formatNames[format] || format;
}

// Callback cuando se detecta un código
function onScanSuccess(decodedText, decodedResult) {
    // Evitar lecturas duplicadas del mismo código consecutivamente
    // if (lastResult === decodedText) {
    //     return;
    // }

    sliderZoom.classList.add("noView")
    contenedorBtnResize.classList.add("noView")
    responseScam.classList.remove("noView")

    stopScanner()
    console.log("decodedText", decodedText)
    console.log("decodedResult", decodedResult)
    console.log('dam["series"]', dam["series"])
    let rptAlgoritmo = algoritoBuscado(decodedText)
    console.log(rptAlgoritmo)
    console.log("decodedResult")
    console.log("decodedResult")


    enviarResponse(rptAlgoritmo)
    btnVolverScanear.classList.remove("noView")

}
// Callback cuando hay error en lectura
function onScanError(errorMessage) {
    // Los errores son muy frecuentes durante el escaneo normal, no los mostramos
    // Solo mostramos errores críticos
    if (errorMessage.includes('No MultiFormat Readers were able to detect the code')) {
        // Esto es normal mientras busca códigos, no mostrar
        return;
    }
    console.warn('Error de escaneo:', errorMessage);
}

// Iniciar el escáner
async function startScanner(sizeProporcion = 1) {

    sliderZoom.classList.remove("noView")
    contenedorBtnResize.classList.remove("noView")
    responseScam.classList.add("noView")

    // lastScamProporcion = 1
    if (lastScamProporcion == null || lastScamProporcion == undefined) {
        lastScamProporcion = 1
    }

    if (isScanning && sizeProporcion == lastScamProporcion) {
        updateStatus('⚠️ El escáner ya está activo', 'info');
        return;
    }

    lastScamProporcion = sizeProporcion

    updateStatus('🔄 Solicitando acceso a la cámara...', 'info');

    try {
        // Verificar si el navegador soporta la API
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Tu navegador no soporta acceso a la cámara');
        }

        // Solicitar permisos de notificación
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }

        // Crear instancia del escáner
        html5QrCode = new Html5Qrcode("reader");


        const contentDiv = document.querySelector('.content');
        // console.log(contentDiv)
        // console.log(contentDiv.offsetWidth)
        let widthQR = contentDiv.offsetWidth * .85
        qrCodeConfig.qrbox = {
            width: widthQR,
            height: widthQR / lastScamProporcion
        }
        console.log(qrCodeConfig.qrbox)

        // Configuración de la cámara
        const cameraConfig = {
            fps: qrCodeConfig.fps,
            qrbox: qrCodeConfig.qrbox,
            aspectRatio: qrCodeConfig.aspectRatio,
            disableFlip: qrCodeConfig.disableFlip,
            videoConstraints: qrCodeConfig.videoConstraints,
            advanced: qrCodeConfig.advanced
        };

        // Iniciar escaneo con la cámara trasera preferentemente
        await html5QrCode.start(
            { facingMode: "environment" }, // Usar cámara trasera
            cameraConfig,
            onScanSuccess,
            onScanError
        ).then(() => {
            console.log("stream")
            // Obtener el stream y sus tracks
            const stream = html5QrCode.getRunningTrackCameraCapabilities();
            if (stream) {
                // Método CORRECTO para obtener el stream
                const videoElement = document.querySelector("#reader video");
                if (videoElement && videoElement.srcObject) {
                    const stream = videoElement.srcObject;
                    const track = stream.getVideoTracks()[0];
                    const capabilities = track.getCapabilities();
                    const settings = track.getSettings();

                    console.log("=== INFO DE LA CÁMARA ===");
                    console.log("Etiqueta:", track.label);
                    console.log("Resolución real:", settings.width, "x", settings.height);
                    console.log("Frame rate real:", settings.frameRate);
                    console.log("Facing mode usado:", settings.facingMode);
                    console.log("Capacidades:", {
                        widthMax: capabilities.width?.max,
                        heightMax: capabilities.height?.max,
                        frameRateMax: capabilities.frameRate?.max
                    });

                    document.getElementById("idTextoInformacion").textContent = `calidad ${settings.width} x ${settings.height} | frame ${settings.frameRate} | Facing mode usado ${settings.facingMode} | etiqueta ${track.label}`

                } else {
                    console.log("No se encontró el elemento de video");
                }

                try {

                    if (html5QrCode.getRunningTrackCapabilities) {
                        const trackCapabilities = html5QrCode.getRunningTrackCapabilities();

                        // Revisamos si la cámara SOPORTA ZOOM
                        if (trackCapabilities.zoom) {
                            let mensajeTempo = `| Zoom soportado! Rango: min=${trackCapabilities.zoom.min}, max=${trackCapabilities.zoom.max}, step=${trackCapabilities.zoom.step}`
                            console.log(mensajeTempo);

                            // Aquí puedes, por ejemplo, habilitar un control deslizante (slider) en tu UI
                            // y configurarle el rango: min, max, step.
                            // const zoomSlider = document.getElementById('mi-control-zoom');
                            sliderZoom.min = trackCapabilities.zoom.min;
                            sliderZoom.max = trackCapabilities.zoom.max;
                            sliderZoom.step = trackCapabilities.zoom.step;
                            sliderZoom.disabled = false;


                            document.getElementById("idTextoInformacion").textContent = document.getElementById("idTextoInformacion").textContent + mensajeTempo

                        } else {
                            let mensajeTempo = "| Tu cámara o navegador no soporta el control de zoom."
                            console.warn(mensajeTempo);

                            document.getElementById("idTextoInformacion").textContent = document.getElementById("idTextoInformacion").textContent + mensajeTempo
                        }
                    }
                } catch (error) {
                    document.getElementById("idTextoInformacion").textContent = document.getElementById("idTextoInformacion").textContent + "ERROR -> " + error
                }


            }
        })

        isScanning = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        updateStatus('✅ Escáner activo - Apunta a un código de barras', 'success');

    } catch (err) {
        console.error('Error al iniciar el escáner:', err);
        updateStatus(`❌ Error: ${err.message || 'No se pudo acceder a la cámara'}`, 'error');

        // Intentar con la cámara frontal si falla la trasera
        if (err.message && err.message.includes('environment')) {
            try {
                updateStatus('🔄 Intentando con cámara frontal...', 'info');
                await html5QrCode.start(
                    { facingMode: "user" },
                    {
                        fps: qrCodeConfig.fps,
                        qrbox: qrCodeConfig.qrbox,
                        aspectRatio: qrCodeConfig.aspectRatio,
                        disableFlip: qrCodeConfig.disableFlip,
                        videoConstraints: qrCodeConfig.videoConstraints,
                        advanced: qrCodeConfig.advanced
                    },
                    onScanSuccess,
                    onScanError
                ).then(() => {
                    console.log("stream")
                    // Obtener el stream y sus tracks
                    const stream = html5QrCode.getRunningTrackCameraCapabilities();
                    if (stream) {
                        const track = stream.getVideoTracks()[0];
                        const capabilities = track.getCapabilities();
                        const settings = track.getSettings();

                        console.log("=== INFO DE LA CÁMARA ===");
                        console.log("Etiqueta:", track.label);
                        console.log("Resolución real:", settings.width, "x", settings.height);
                        console.log("Frame rate real:", settings.frameRate);
                        console.log("Facing mode usado:", settings.facingMode);
                        console.log("Capacidades máximas:", {
                            width: capabilities.width?.max,
                            height: capabilities.height?.max,
                            frameRate: capabilities.frameRate?.max
                        });
                    }
                })



                isScanning = true;
                startBtn.disabled = true;
                stopBtn.disabled = false;
                updateStatus('✅ Escáner activo (cámara frontal)', 'success');
            } catch (err2) {
                updateStatus(`❌ No se pudo acceder a ninguna cámara. Verifica los permisos.`, 'error');
            }
        }
    }
}

// Detener el escáner
async function stopScanner() {

    if (!isScanning || !html5QrCode) {
        updateStatus('ℹ️ El escáner no está activo', 'info');
        return;
    }

    try {
        await html5QrCode.stop();
        html5QrCode.clear();
        isScanning = false;
        startBtn.disabled = false;
        stopBtn.disabled = true;
        updateStatus('⏹️ Escáner detenido. Presiona "Iniciar" para continuar', 'info');
    } catch (err) {
        console.error('Error al detener el escáner:', err);
        updateStatus('⚠️ Error al detener el escáner', 'error');
    }
}

async function iniciarPantallaSCAM() {

    startScanner(lastScamProporcion)
    if (!inicialiadoControlesScam) {

        inicialiadoControlesScam = true
        // Event listeners
        startBtn.addEventListener('click', () => {
            startScanner(lastScamProporcion)
        });
        stopBtn.addEventListener('click', stopScanner);
        btnVolverScanear.addEventListener('click', () => {

            btnVolverScanear.classList.add("noView")
            stopScanner()
            setTimeout(() => {
                startScanner(lastScamProporcion)
            }, 250)

        })
        btnAtrasScam.addEventListener('click', () => {
            stopScanner()
            contenedorLector.classList.add("noView")
            contenedorInfoDam.classList.remove("noView")
        })

        const botonesResizes = document.querySelectorAll('.cajaBotonesRedimensionarScam > .btnScam')
        botonesResizes.forEach((boton, index) => {
            boton.id = `boton-${index + 1}`
            boton.addEventListener('click', () => {
                stopScanner()
                setTimeout(() => {
                    startScanner(index + 1)
                }, 250)
            })
        })
    }

}

function enviarResponse(rptAlgoritmo) {

    responseScam.classList.remove("noView")


    if (rptAlgoritmo["tipo"] == "unico") {
        console.log("pollo")
        if (rptAlgoritmo.encontrado) {
            sonidoExito.play()

            responseScam.querySelector("h3").textContent = `✅ Se econtró ${rptAlgoritmo["textoClave"]} en la serie ${rptAlgoritmo["serie"]}✅`
            responseScam.classList.add("responseOKScam")
            responseScam.classList.remove("responseNOScam")


            pintadoTablaSerieEncontrada(miniContenedor,rptAlgoritmo["serie"],rptAlgoritmo["textoClave"])


        } else {
            sonidoError.play()

            responseScam.querySelector("h3").textContent = `❌ NO Se econtró ${rptAlgoritmo["textoClave"]} en ninguna serie ❌`
            responseScam.classList.add("responseNOScam")
            responseScam.classList.remove("responseOKScam")
        }

    }else if(rptAlgoritmo["tipo"] == "multiple"){
        responseScam.classList.remove("responseOKScam")
        responseScam.classList.remove("responseNOScam")

        miniContenedor.innerHTML = ''
        console.log("pollo multiple")
        if (rptAlgoritmo["cantidadNegativos"] == 0) {
            sonidoExito.play()
            responseScam.querySelector("h3").textContent = `✅✅ Se han analizado ${rptAlgoritmo["rptMultiple"].length} "UNIQUE SERIAL" y TODOS fueron encontrados en la DAM ✅✅`
        }else if(rptAlgoritmo["cantidadPositivos"] == 0){
            sonidoError.play()
            responseScam.querySelector("h3").textContent = `❌❌ Se han analizado ${rptAlgoritmo["rptMultiple"].length} "UNIQUE SERIAL" y NINGUNO fue encontrado en la DAM ❌❌`
        }else{
            responseScam.querySelector("h3").textContent = `🚨⚠️ Se han analizado ${rptAlgoritmo["rptMultiple"].length} "UNIQUE SERIAL" de los cuales ${rptAlgoritmo["cantidadPositivos"]} SI fueron encontrados y  ${rptAlgoritmo["cantidadNegativos"]} NO fueron encontrados ⚠️🚨`
        }

        for (let index = 0; index < rptAlgoritmo["rptMultiple"].length; index++) {
            const element = rptAlgoritmo["rptMultiple"][index];
            const nuevoDiv = document.createElement('div');
            nuevoDiv.classList.add("miniDivRPT")
            if (element["encontrado"]) {
                nuevoDiv.innerHTML = `✅ <p class="resalteScam2"> ${element["textoClave"]} </p> en Serie ${element["serie"]} ✅`
            }else{
                nuevoDiv.innerHTML = `❌ <p class="resalteScam2"> ${element["textoClave"]} </p>   NO se encontró  ❌`
            }
            miniContenedor.appendChild(nuevoDiv)

        }

    }

}

function pintadoTablaSerieEncontrada(miniContenedorS, numeroSerie,textoClave) {
    miniContenedorS.innerHTML = '<table><tbody class="tBodyRptScam"></tbody></table>'
    const tbody = miniContenedorS.querySelector("tbody")
    instertarSeries(tbody, [dam["series"][numeroSerie - 1]])

    miniContenedorS.innerHTML = miniContenedorS.innerHTML.replaceAll(textoClave, `<p class="resalteScam">${textoClave}</p>`)
}

function extraerNumerosLargos(texto, longitudMinima = 8) {
    // Patrón que busca números de N dígitos o más (sin separadores)
    const patron = new RegExp(`\\b\\d{${longitudMinima},}\\b`, 'g');
    const numerosEncontrados = texto.match(patron) || [];
    return numerosEncontrados;
}


function miniAlgoritmoBusqueda(palabraClave) {
    console.log("entrando al miniAlgoritmo")
    const seriesOriginal = dam["series"]
    for (let index = 0; index < seriesOriginal.length; index++) {
        let miniSerie = seriesOriginal[index]
        let encontrado = false
        const descripciones = miniSerie["descripciones"]
        for (let index = 0; index < descripciones.length; index++) {
            if (descripciones[index].includes(palabraClave.trim())) {
                encontrado = true
                break
            }
        }
        if (encontrado) {
            return {
                "textoClave": palabraClave,
                "encontrado": encontrado,
                "serie": Number(miniSerie["serie"])
            }
            break
        }
    }
    return {
        "textoClave": palabraClave,
        "encontrado": false
    }
}

// ALGORITMO DE BUSQUEDA
function algoritoBuscado(palabraClave) {
    console.log("entrando al algoritmo")
    let seriesOriginal = dam["series"]
    console.log(palabraClave)
    // console.log(seriesOriginal)

    if (palabraClave.length <= 50) {
        console.log("entrando Unico")
        let rptUnico = miniAlgoritmoBusqueda(palabraClave)
        rptUnico["tipo"] = "unico"
        return rptUnico
    } else {
        console.log("entrando Multiple")

        let arregloImeis = extraerNumerosLargos(palabraClave)
        console.log("arregloImeis", arregloImeis)

        let rptMultiple = []
        let cantidadPositivos = 0
        let cantidadNegativos = 0
        arregloImeis.forEach((imei) => {
            let rptTempo = miniAlgoritmoBusqueda(imei)

            if (rptTempo["encontrado"]) {
                cantidadPositivos = cantidadPositivos + 1
            }else{
                cantidadNegativos = cantidadNegativos + 1
            }

            rptMultiple.push(rptTempo)
        })

        return {
            "tipo": "multiple",
            "cantidadPositivos":cantidadPositivos,
            "cantidadNegativos":cantidadNegativos,
            "rptMultiple": rptMultiple
        }
    }

}

// Esta función se ejecuta, por ejemplo, cuando el usuario mueve el slider
async function cambiarZoom(nuevoValorZoom) {
    if (html5QrCode.applyVideoConstraints) {
        try {
            // Aplicamos la nueva restricción de zoom
            await html5QrCode.applyVideoConstraints({
                zoom: { exact: parseFloat(nuevoValorZoom) }
            });
            console.log(`Zoom ajustado a: ${nuevoValorZoom}`);
        } catch (error) {
            console.error("No se pudo aplicar el zoom:", error);
            // Esto puede fallar si el valor está fuera del rango soportado
        }
    }
}

sliderZoom.addEventListener('input', (event) => {
    cambiarZoom(event.target.value);
});

























