
import * as docx from 'https://cdn.jsdelivr.net/npm/docx-preview@0.3.3/+esm';

let blob = null



// Función principal para actualizar la previsualización estilo "documento"
async function actualizarPrevisualizacion() {
    // Obtener valores del formulario
    const fechaRaw = document.getElementById('fechaDoc').value;
    const palabras = document.getElementById('palabrasClave').value.trim() || "Sin palabras clave";
    const numeroRaw = document.getElementById('numeroCantidad').value;
    const monedaRaw = document.getElementById('montoMoneda').value;
    const textoExtra = document.getElementById('textoExtra').value.trim() || "Sin comentarios adicionales";
    const referencia = document.getElementById('referencia').value.trim() || "No especificada";

    // --- Formatear fecha amigable (si existe valor) ---
    let fechaFormateada = "No especificada";
    if (fechaRaw) {
        try {
            const fechaObj = new Date(fechaRaw);
            if (!isNaN(fechaObj.getTime())) {
                const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
                fechaFormateada = fechaObj.toLocaleDateString('es-ES', opciones);
            } else {
                fechaFormateada = fechaRaw;
            }
        } catch (e) {
            fechaFormateada = fechaRaw;
        }
    }

    // --- Formatear número (con manejo de decimales) ---
    let numeroMostrar = "—";
    let numeroRawNum = parseFloat(numeroRaw);
    if (!isNaN(numeroRawNum) && numeroRaw !== "") {
        // Si es entero, mostrar sin decimales, si es decimal mostrar hasta 2 decimales
        if (Number.isInteger(numeroRawNum)) {
            numeroMostrar = numeroRawNum.toString();
        } else {
            numeroMostrar = numeroRawNum.toFixed(2);
        }
    } else if (numeroRaw !== "") {
        numeroMostrar = numeroRaw;  // si texto extraño, mostrar como string
    } else {
        numeroMostrar = "—";
    }

    // --- Formatear moneda (dólar, con símbolo) ---
    let monedaMostrar = "$ 0.00";
    let monedaNum = parseFloat(monedaRaw);
    if (!isNaN(monedaNum) && monedaRaw !== "") {
        monedaMostrar = new Intl.NumberFormat('es-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(monedaNum);
    } else if (monedaRaw !== "") {
        monedaMostrar = `$ ${monedaRaw}`;
    }

    // --- Construir HTML de previsualización (estructura tipo documento) ---
    const previewHTML = `
            <div class="preview-field">
                <span class="preview-label">📆 Fecha oficial</span>
                <div class="preview-value fecha">${escapeHtml(fechaFormateada)}</div>
            </div>
            <div class="preview-field">
                <span class="preview-label">🔖 Palabras / Título</span>
                <div class="preview-value">${escapeHtml(palabras)}</div>
            </div>
            <div class="preview-field">
                <span class="preview-label">🔢 Número (ID / Cantidad)</span>
                <div class="preview-value numero">${escapeHtml(numeroMostrar)}</div>
            </div>
            <div class="preview-field">
                <span class="preview-label">💲 Monto en moneda</span>
                <div class="preview-value moneda">${escapeHtml(monedaMostrar)}</div>
            </div>
            <div class="preview-field">
                <span class="preview-label">📌 Referencia adicional</span>
                <div class="preview-value">${escapeHtml(referencia)}</div>
            </div>
            <div class="preview-field">
                <span class="preview-label">📋 Texto / Observaciones</span>
                <div class="preview-value" style="white-space: pre-line; background: #fef7e0;">${escapeHtml(textoExtra)}</div>
            </div>
            <div style="margin-top: 1rem; padding-top: 0.5rem; border-top: 2px solid #f0ebdd; font-size: 0.7rem; color: #8f9eb2;">
                <span>✅ Documento validado · sistema de vista previa</span>
            </div>
        `;

    const previewContainer = document.getElementById('previewBody');
    // if (previewContainer) {
    //     previewContainer.innerHTML = previewHTML;
    // }


    // const response = await fetch("plantilla.docx");
    const response = await fetch("plantillaCondicional.docx");
    const content = await response.arrayBuffer();

    const zip = new PizZip(content);

    const doc = new window.docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true
    });

    doc.render({
        nombre: palabras,
        tieneBono: false
    });

    blob = doc.getZip().generate({
        type: "blob",
        mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    });

    console.log("blob", blob)
    console.log("docx", docx)
    console.log("rr",document.getElementById("previewDocx"))
    docx.renderAsync(blob, document.getElementById("previewDocx"));

}

// Función auxiliar para evitar XSS/inyecciones (por si hay texto con etiquetas)
function escapeHtml(str) {
    if (!str) return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// Escuchar cambios en tiempo real o mediante botón. 
// Añadimos listeners para cada input (cambios automáticos, pero también el botón).
// Para mejor experiencia, escuchamos eventos 'input' y 'change'
const inputsIds = ['fechaDoc', 'palabrasClave', 'numeroCantidad', 'montoMoneda', 'textoExtra', 'referencia'];

function bindEvents() {
    for (let id of inputsIds) {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', function () {
                console.log("cris 1")
                actualizarPrevisualizacion();
            });
            element.addEventListener('change', function () {
                console.log("cris 2")
                actualizarPrevisualizacion(); // cambio extra para date/number
            });
        }
    }
}

// También el botón manual por si acaso
const btnActualizar = document.getElementById('actualizarPreviewBtn');
if (btnActualizar) {
    btnActualizar.addEventListener('click', function (e) {

        console.log("criscris")

        e.preventDefault();
        actualizarPrevisualizacion();
    });
}

// Inicializar la previsualización y los eventos
document.addEventListener('DOMContentLoaded', function () {
    // Asegurar valores por defecto consistentes con el HTML inicial
    // (el HTML ya tiene values iniciales, pero por si algún navegador no los pilla)
    // Forzamos sincronía llamando a la función
    actualizarPrevisualizacion();
    bindEvents();
});

// adicional: Para el campo de moneda, mejor formato en vivo.
// Todo está cubierto.



const btnDescargaWord = document.getElementById("descargarWordBtn")
if (btnDescargaWord) {
    console.log("que")
    btnDescargaWord.addEventListener("click",()=>{
        saveAs(blob, "informe.docx");
    })
}else{
    console.log("NOOOOOOOOOO")
}