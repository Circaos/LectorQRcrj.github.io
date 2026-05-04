let dam = null


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
const responseScam = document.getElementById("idResponseScam")
// Elementos del DOM
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resultDiv = document.getElementById('result');
const formatSpan = document.getElementById('formatSpan');
const statusDiv = document.getElementById('status');
// Configuración del escáner
let html5QrCode = null;
let isScanning = false;
let lastResult = '';
// Configuración avanzada para mejor lectura
const qrCodeConfig = {
    fps: 30, // Fotogramas por segundo
    qrbox: { width: 300, height: 200 }, // Área de escaneo
    aspectRatio: 1.0,
    disableFlip: false,
    rememberLastUsedCamera: true,
    supportedScanTypes: [
        Html5QrcodeScanType.SCAN_TYPE_CAMERA,
        Html5QrcodeScanType.SCAN_TYPE_FILE
    ]
};
const supportedFormatsList = [
    'QR_CODE', 'AZTEC', 'CODABAR', 'CODE_39', 'CODE_93', 'CODE_128',
    'DATA_MATRIX', 'EAN_8', 'EAN_13', 'ITF', 'MAXICODE', 'PDF_417',
    'RSS_14', 'RSS_EXPANDED', 'UPC_A', 'UPC_E', 'UPC_EAN_EXTENSION'
];




formBusquedaDam.addEventListener("submit", async (event) => {
    event.preventDefault();
    const valorBusqueda = document.getElementById("inputBusqueda").value

     if (valorBusqueda.length != 13) {
         alertaInputDam.textContent = "Error - Ingresar un DAM correcta"
         return
     }

     const dam = await obtenerApiDam(valorBusqueda)
    //dam = await obtenerApiDam("1182610134752")

    if (dam == null) {
        alertaInputDam.textContent = "Error - Dam no Encontrada"
        return
    }

    contenedorInputDam.classList.add("noView")
    contenedorInfoDam.classList.remove("noView")

    rellenarTablaDam(dam)
    agregarListener()

    // console.log("criscris")
    // console.log(valorBusqueda)
})


async function obtenerApiDam(dam) {
    //const damFinalTempo = await fetch(`./${dam}.json`)

    //console.log(damFinalTempo)
    //if (!damFinalTempo.ok) {
     //   return null
   // }

   // const damFinal = await damFinalTempo.json();



             const url = "https://apiproviaspruebav1-production.up.railway.app/damcito/getDamcito"
             const data = { 'dua': serie }

             const response = await fetch(url, {
                 method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(data)
             })

            const damFinal["dam = await response.json()






    return damFinal["dam"]
}


function rellenarTablaDam(dam) {
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


function agregarListener() {
    btnLector.addEventListener("click", () => {
        console.log("cricris")
        contenedorLector.classList.remove("noView")
        contenedorInfoDam.classList.add("noView")

        iniciarPantallaSCAM()
    })
}




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
    
    stopScanner()
    console.log("decodedText", decodedText)
    console.log("decodedResult", decodedResult)
    let rptAlgoritmo =  algoritoBuscado(decodedText,dam["series"])
    console.log(rptAlgoritmo)
    console.log("decodedResult" )
    console.log("decodedResult" )
    
    
    enviarResponse(rptAlgoritmo,decodedText)
    btnVolverScanear.classList.remove("noView")
    // lastResult = decodedText;
    // const format = decodedResult?.result?.format?.formatName || 'Desconocido';
    // const formattedFormat = formatFormatName(format);

    // // Mostrar resultado
    // resultDiv.innerHTML = decodedText;
    // formatSpan.innerHTML = formattedFormat;
    // formatSpan.style.background = '#4caf50';
    // formatSpan.style.color = 'white';

    // updateStatus(`✅ ¡Código leído! Formato: ${formattedFormat}`, 'success');

    // // Reproducir sonido de lectura (opcional)
    // try {
    //     const beep = new Audio('data:audio/wav;base64,U3RlYWx0aCBzb3VuZA==');
    //     beep.play().catch(e => console.log('No se pudo reproducir el sonido'));
    // } catch (e) { }

    // // Resetear el formato del badge después de 2 segundos
    // setTimeout(() => {
    //     if (formatSpan.innerHTML === formattedFormat) {
    //         formatSpan.style.background = '#e8f5e9';
    //         formatSpan.style.color = '#2e7d32';
    //     }
    // }, 2000);

    // // Mostrar notificación si está permitido
    // if (Notification.permission === 'granted') {
    //     new Notification('Código leído', {
    //         body: `${formattedFormat}: ${decodedText}`,
    //         icon: 'https://cdn-icons-png.flaticon.com/512/149/149060.png'
    //     });
    // }
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
async function startScanner() {
    if (isScanning) {
        updateStatus('⚠️ El escáner ya está activo', 'info');
        return;
    }

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

        // Configuración de la cámara
        const cameraConfig = {
            fps: qrCodeConfig.fps,
            qrbox: qrCodeConfig.qrbox,
            aspectRatio: qrCodeConfig.aspectRatio,
            disableFlip: qrCodeConfig.disableFlip
        };

        // Iniciar escaneo con la cámara trasera preferentemente
        await html5QrCode.start(
            { facingMode: "environment" }, // Usar cámara trasera
            cameraConfig,
            onScanSuccess,
            onScanError
        );

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
                        aspectRatio: qrCodeConfig.aspectRatio
                    },
                    onScanSuccess,
                    onScanError
                );
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

function iniciarPantallaSCAM() {
    startScanner()
    // Event listeners
    startBtn.addEventListener('click', startScanner);
    stopBtn.addEventListener('click', stopScanner);
    btnVolverScanear.addEventListener('click', startScanner)
}

function enviarResponse(rptAlgoritmo, busquedaPalabra) {
    console.log("pollo")
    responseScam.classList.remove("noView")
    // responseScam.textContent = "hols"
    console.log("pollo2")
    if (rptAlgoritmo.encontrado) {
        responseScam.textContent = `Se econtró ${busquedaPalabra} en la serie ${rptAlgoritmo["serie"]}`
        responseScam.classList.add("responseOKScam")
        responseScam.classList.remove("responseNOScam")
    }else{
        responseScam.textContent = `NO Se econtró ${busquedaPalabra} en ninguna serie`
        responseScam.classList.add("responseNOScam")
        responseScam.classList.remove("responseOKScam")
    }
}


// ALGORITMO DE BUSQUEDA
function algoritoBuscado(palabraClave, seriesOriginal) {
    console.log("entrando al algoritmo")
    console.log(palabraClave)
    console.log(seriesOriginal)
    for (let index = 0; index < seriesOriginal.length; index++) {
        // console.log("buscando",index)
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
                "encontrado": encontrado,
                "serie": miniSerie["serie"],
                "serieData": miniSerie
            }

            break
        }
    }
    return {
        "encontrado": false
    }
}




























