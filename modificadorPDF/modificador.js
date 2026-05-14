let pdfFiles = [];
let processedPDFs = new Map();

const nombreExtArchi = "_procesado.pdf"
const pdfColorDefinition = PDFLib.rgb(1, 1, 1)

// Elementos del DOM
const fileInput = document.getElementById('fileInput');
const dragDropArea = document.getElementById('dragDropArea');
const pdfListDiv = document.getElementById('pdfList');
const processAllBtn = document.getElementById('processAllBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const downloadZipBtn = document.getElementById('downloadZipBtn');
const downloadAllBtn = document.getElementById('downloadAllBtn');
const pdfCountSpan = document.getElementById('pdfCount');
const modal = document.getElementById('modal');
const modalProgress = document.getElementById('modalProgress');
const modalStatus = document.getElementById('modalStatus');

// Configurar Drag & Drop
dragDropArea.addEventListener('click', () => {
    fileInput.click();
});

dragDropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dragDropArea.classList.add('drag-over');
});

dragDropArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dragDropArea.classList.remove('drag-over');
});

dragDropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dragDropArea.classList.remove('drag-over');
    const files = Array.from(e.dataTransfer.files);
    agregarPDFs(files);
});

// Cargar archivos mediante input
fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    agregarPDFs(files);
    fileInput.value = '';
});

let pdfBData = null;

async function obtenerPDFB() {
    console.log("cricris")
    const tempo = await fetch("./Hoja B.pdf")
    pdfBData = await tempo.arrayBuffer()
    // console.log(pdfBData)
}

await obtenerPDFB()

// Función para agregar PDFs
function agregarPDFs(files) {
    const pdfFilesList = files.filter(file => file.type === 'application/pdf');

    if (pdfFilesList.length === 0) {
        showAlert('Solo se permiten archivos PDF', 'error');
        return;
    }

    if (pdfFiles.length + pdfFilesList.length > 15) {
        showAlert(`Solo puedes cargar hasta 15 PDFs. Actualmente tienes ${pdfFiles.length}`, 'error');
        return;
    }

    pdfFilesList.forEach(file => {
        pdfFiles.push({
            id: Date.now() + Math.random() + Math.random(),
            file: file,
            name: file.name,
            size: file.size,
            status: 'pending',
            processedBlob: null
        });
    });

    renderPDFList();
    showAlert(`${pdfFilesList.length} PDF(s) agregado(s) exitosamente`, 'success');
}

// Renderizar lista de PDFs
function renderPDFList() {
    pdfCountSpan.textContent = pdfFiles.length;

    if (pdfFiles.length === 0) {
        pdfListDiv.innerHTML = `
                    <div class="empty-state">
                        <div class="icon">📄</div>
                        <p>No hay PDFs cargados</p>
                        <small>Arrastra archivos o haz clic para seleccionar hasta 15 PDFs</small>
                    </div>
                `;
        downloadZipBtn.disabled = true;
        downloadAllBtn.disabled = true;
        return;
    }

    const hasSuccess = pdfFiles.some(pdf => pdf.status === 'success');
    downloadZipBtn.disabled = !hasSuccess;
    downloadAllBtn.disabled = !hasSuccess;

    pdfListDiv.innerHTML = pdfFiles.map(pdf => `
                <div class="pdf-card ${pdf.status === 'success' ? 'selected' : ''}">
                    <div class="pdf-icon">${getPDFIcon(pdf.status)}</div>
                    <div class="pdf-name" title="${pdf.name}">${truncateName(pdf.name)}</div>
                    <div class="pdf-size">${formatBytes(pdf.size)}</div>
                    <div class="pdf-status status-${pdf.status}">
                        ${getStatusText(pdf.status)}
                    </div>
                    <div class="pdf-actions">
                        <button class="btn btn-sm btn-primary" onclick="processSinglePDF('${pdf.id}')" ${pdf.status === 'processing' || pdf.status === 'success' ? 'disabled' : ''}>
                            🔄 Procesar
                        </button>
                        ${pdf.status === 'success' ? `
                            <button class="btn btn-sm btn-success" onclick="downloadSinglePDF('${pdf.id}')">
                                ⬇️ Descargar
                            </button>
                        ` : ''}
                        <button class="btn btn-sm btn-danger" onclick="removePDF('${pdf.id}')">
                            🗑️ Eliminar
                        </button>
                    </div>
                </div>
            `).join('');
}

// Procesar un PDF individual
window.processSinglePDF = async function (pdfId) {
    console.log("individual")
    const pdf = pdfFiles.find(p => p.id == pdfId);
    if (!pdf || pdf.status === 'processing') return;

    // const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
    pdf.status = 'processing';
    renderPDFList();

    try {
        const arrayBuffer = await pdf.file.arrayBuffer();
        // const coordenadas = getCoordenadas();

        const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPages();

        for (const page of pages) {
            // page.drawRectangle({
            //     x: coordenadas.x,
            //     y: coordenadas.y,
            //     width: coordenadas.width,
            //     height: coordenadas.height,
            //     color: pdfColorDefinition,
            //     opacity: 1,
            //     borderWidth: 0
            // });
            page.drawRectangle({
                x: 478,
                y: 587.8,
                width: 68,
                height: 10.1,
                color: pdfColorDefinition,
                opacity: 1,
                borderWidth: 0
            });
            page.drawText('SOLES', {
                x: 487,
                y: 588.8,
                size: 8.5,
                color: PDFLib.rgb(0, 0, 0)
            })
            page.drawRectangle({
                x: 417,
                y: 557.2,
                width: 6,
                height: 12,
                color: pdfColorDefinition,
                opacity: 1,
                borderWidth: 0
            });

        }

        const pdfDocB = await PDFLib.PDFDocument.load(pdfBData);
        const paginasB = await pdfDoc.copyPages(pdfDocB, pdfDocB.getPageIndices());
        for (const pagina of paginasB) {
            pdfDoc.addPage(pagina);
        }


        const modifiedPdfBytes = await pdfDoc.save();
        const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });

        pdf.processedBlob = blob;
        pdf.status = 'success';
        processedPDFs.set(pdf.id, blob);

        showAlert(`✅ ${pdf.name} procesado correctamente`, 'success');
    } catch (error) {
        console.error(error);
        pdf.status = 'error';
        showAlert(`❌ Error al procesar ${pdf.name}: ${error.message}`, 'error');
    }

    renderPDFList();
}

// Procesar todos los PDFs
async function processAllPDFs() {
    console.log("multiple")
    const pendingPDFs = pdfFiles.filter(pdf => pdf.status !== 'success' && pdf.status !== 'processing');

    if (pendingPDFs.length === 0) {
        showAlert('Todos los PDFs ya están procesados', 'info');
        return;
    }

    modal.style.display = 'flex';
    let completed = 0;
    const total = pendingPDFs.length;

    for (let i = 0; i < pendingPDFs.length; i++) {
        const pdf = pendingPDFs[i];
        pdf.status = 'processing';
        renderPDFList();

        modalStatus.textContent = `Procesando: ${pdf.name} (${i + 1}/${total})`;

        try {
            const arrayBuffer = await pdf.file.arrayBuffer();
            // const coordenadas = getCoordenadas();

            const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
            const pages = pdfDoc.getPages();

            for (const page of pages) {
                // page.drawRectangle({
                //     x: coordenadas.x,
                //     y: coordenadas.y,
                //     width: coordenadas.width,
                //     height: coordenadas.height,
                //     color: pdfColorDefinition,
                //     opacity: 1,
                //     borderWidth: 0
                // });
                page.drawRectangle({
                    x: 478,
                    y: 587.8,
                    width: 68,
                    height: 10.1,
                    color: pdfColorDefinition,
                    opacity: 1,
                    borderWidth: 0
                });
                page.drawText('SOLES', {
                    x: 487,
                    y: 588.8,
                    size: 8.5,
                    color: PDFLib.rgb(0, 0, 0)
                })
                page.drawRectangle({
                    x: 417,
                    y: 557.2,
                    width: 6,
                    height: 12,
                    color: pdfColorDefinition,
                    opacity: 1,
                    borderWidth: 0
                });
            }

            const pdfDocB = await PDFLib.PDFDocument.load(pdfBData);
            const paginasB = await pdfDoc.copyPages(pdfDocB, pdfDocB.getPageIndices());
            for (const pagina of paginasB) {
                pdfDoc.addPage(pagina);
            }

            const modifiedPdfBytes = await pdfDoc.save();
            const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });

            pdf.processedBlob = blob;
            pdf.status = 'success';
            processedPDFs.set(pdf.id, blob);

            completed++;
            const percent = (completed / total) * 100;
            modalProgress.style.width = `${percent}%`;
            modalProgress.textContent = `${Math.round(percent)}%`;

        } catch (error) {
            console.error(error);
            pdf.status = 'error';
            showAlert(`❌ Error en ${pdf.name}`, 'error');
        }

        renderPDFList();
    }

    setTimeout(() => {
        modal.style.display = 'none';
        modalProgress.style.width = '0%';
        showAlert(`✅ Procesamiento completado: ${completed} de ${total} PDFs exitosos`, 'success');
    }, 500);
}

// Descargar todos los PDFs individualmente (uno por uno)
async function downloadAllIndividual() {
    const successPDFs = pdfFiles.filter(pdf => pdf.status === 'success' && pdf.processedBlob);

    if (successPDFs.length === 0) {
        showAlert('No hay PDFs procesados para descargar', 'error');
        return;
    }

    showAlert(`🔄 Preparando ${successPDFs.length} archivos para descargar...`, 'info');

    // Descargar uno por uno con un pequeño retraso para evitar bloqueos del navegador
    for (let i = 0; i < successPDFs.length; i++) {
        const pdf = successPDFs[i];
        setTimeout(() => {
            const url = URL.createObjectURL(pdf.processedBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = pdf.name.replace('.pdf', nombreExtArchi);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            if (i === successPDFs.length - 1) {
                showAlert(`✅ Descarga completada: ${successPDFs.length} archivos`, 'success');
            }
        }, i * 300); // 300ms de diferencia entre cada descarga
    }
}

// Descargar todos en ZIP
async function downloadAllAsZip() {
    const successPDFs = pdfFiles.filter(pdf => pdf.status === 'success' && pdf.processedBlob);

    if (successPDFs.length === 0) {
        showAlert('No hay PDFs procesados para descargar', 'error');
        return;
    }

    modal.style.display = 'flex';
    modalStatus.textContent = 'Creando archivo ZIP...';
    modalProgress.style.width = '50%';
    modalProgress.textContent = '50%';

    try {
        const zip = new JSZip();

        for (const pdf of successPDFs) {
            const baseName = pdf.name.replace('.pdf', '');
            zip.file(`${baseName}${nombreExtArchi}`, pdf.processedBlob);
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        saveAs(zipBlob, `pdfs_procesados_${new Date().toISOString().slice(0, 19)}.zip`);

        showAlert(`📦 ZIP creado con ${successPDFs.length} archivos`, 'success');
    } catch (error) {
        showAlert('Error al crear el ZIP', 'error');
    } finally {
        setTimeout(() => {
            modal.style.display = 'none';
            modalProgress.style.width = '0%';
        }, 500);
    }
}

// Descargar un PDF individual
window.downloadSinglePDF = function (pdfId) {
    const pdf = pdfFiles.find(p => p.id == pdfId);
    if (pdf && pdf.processedBlob) {
        const url = URL.createObjectURL(pdf.processedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = pdf.name.replace('.pdf', nombreExtArchi);
        a.click();
        URL.revokeObjectURL(url);
        showAlert(`⬇️ Descargando: ${pdf.name}`, 'success');
    }
}

// Eliminar un PDF
window.removePDF = function (pdfId) {
    pdfFiles = pdfFiles.filter(p => p.id != pdfId);
    processedPDFs.delete(pdfId);
    renderPDFList();
    showAlert('PDF eliminado', 'info');
}

// Limpiar todos los PDFs
clearAllBtn.addEventListener('click', () => {
    if (pdfFiles.length > 0 && confirm('¿Seguro que quieres eliminar todos los PDFs?')) {
        pdfFiles = [];
        processedPDFs.clear();
        renderPDFList();
        showAlert('Todos los PDFs han sido eliminados', 'info');
    }
});

// Event Listeners
processAllBtn.addEventListener('click', processAllPDFs);
downloadZipBtn.addEventListener('click', downloadAllAsZip);
downloadAllBtn.addEventListener('click', downloadAllIndividual);

// Utilidades
// function getCoordenadas() {
//     return {
//         x: parseFloat(document.getElementById('coordX').value) || 0,
//         y: parseFloat(document.getElementById('coordY').value) || 0,
//         width: parseFloat(document.getElementById('coordWidth').value) || 100,
//         height: parseFloat(document.getElementById('coordHeight').value) || 30
//     };
// }

function getPDFIcon(status) {
    const icons = {
        'pending': '📄',
        'processing': '⏳',
        'success': '✅',
        'error': '❌'
    };
    return icons[status] || '📄';
}

function getStatusText(status) {
    const texts = {
        'pending': 'Pendiente',
        'processing': 'Procesando...',
        'success': 'Procesado ✓',
        'error': 'Error'
    };
    return texts[status] || 'Pendiente';
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function truncateName(name, maxLength = 30) {
    return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
}

function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    document.body.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 3000);
}