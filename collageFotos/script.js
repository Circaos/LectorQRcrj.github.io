const LimitSize = 2

class PDFCollageMaker {
    constructor() {
        this.images = [];
        this.maxImages = 400;
        this.imagesPerPage = 8;
        this.isGenerating = false;
        this.quality = 40; // Calidad por defecto 80%
        this.maxPDFSizeMB = 2; // Tamaño máximo por PDF en MB

        this.initElements();
        this.bindEvents();
        this.setupDragAndDrop();
        this.createQualityControl();
    }

    initElements() {
        this.fileInput = document.getElementById('fileInput');
        this.uploadArea = document.getElementById('uploadArea');
        this.previewGrid = document.getElementById('previewGrid');
        this.imageCountSpan = document.getElementById('imageCount');
        this.pageCountSpan = document.getElementById('pageCount');
        this.totalSizeSpan = document.getElementById('totalSize');
        this.totalSizeCompress = document.getElementById('totalSizeCompress');
        this.generateBtn = document.getElementById('generateBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.progressContainer = document.getElementById('progressContainer');
        this.progressFill = document.getElementById('progressFill');
        this.progressPercent = document.getElementById('progressPercent');
        this.progressDetail = document.getElementById('progressDetail');
    }

    bindEvents() {
        this.fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));
        this.generateBtn.addEventListener('click', () => this.generatePDF());
        this.clearBtn.addEventListener('click', () => this.clearAll());
    }

    setupDragAndDrop() {
        this.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadArea.classList.add('drag-over');
        });

        this.uploadArea.addEventListener('dragleave', () => {
            this.uploadArea.classList.remove('drag-over');
        });

        this.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadArea.classList.remove('drag-over');
            const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
            this.handleFiles(files);
        });

        // this.uploadArea.addEventListener('click', () => {
        //     console.log("pollito")
        //     this.fileInput.click();
        // });
    }

    async recategorizacion() {

        if (this.images.length == 0) {
            this.updateStats()
            return
        }

        this.changeActivacionBotonesPanel(true)

        this.showProgress(true, 'Recalculando Compresión...');
        this.changeActivacionBotonesPanel()
        console.log("inicio recat")
        for (let index = 0; index < this.images.length; index++) {
            // console.log(index)
            const imagen = this.images[index];
            this.images[index]["data"] = await this.compressImage(this.images[index]["fileOriginalImagen"])


            this.updateProgress((index + 1) / this.images.length * 100, `Cargando ${index + 1}/${this.images.length}`);
        }

        // await this.mostrarTamanioCompress()

        //     const testBlob = await this.generatePDFBlob(testImages);
        //     const testSizeMB = testBlob.size / (1024 * 1024);
        this.updateStats()
        this.changeActivacionBotonesPanel(false)
        console.log("this.imagesthis.images", this.images)
        this.showProgress(false);
        console.log("fin recat")
    }

    // calcularSize(){

    // }

    changeActivacionBotonesPanel(activar) {
        if (activar == null || activar == undefined) {
            console.log("fallo en changue boton")
            return
        }
        const panelControl = document.querySelector(".control-panel")
        if (activar) {
            panelControl.classList.add("inactive")
        } else {
            panelControl.classList.remove("inactive")
        }

        const botones = document.querySelectorAll(".quality-presets>button")
        botones.forEach((boton => {
            // console.log(boton.textContent)
            boton.disabled = activar
        }))
    }

    createQualityControl() {
        // Crear panel de control de calidad
        const controlPanel = document.createElement('div');
        controlPanel.className = 'control-panel';
        controlPanel.innerHTML = `
            <div class="control-group">
                <label>🎨 Calidad de imágenes en PDF:</label>
                <div class="quality-control">
                    <!-- <input type="range" id="qualitySlider" min="10" max="100" value="${this.quality}" step="5"> -->
                    <span id="qualityValue" class="quality-value">${this.quality}%</span>  
                    <div class="quality-presets">
                        <button type="button" data-quality="10" class="quality-preset">10% (Estas a Limite)</button>
                        <button type="button" data-quality="15" class="quality-preset">15% (Hardcore)</button>
                        <button type="button" data-quality="25" class="quality-preset">25% (Menor tamaño)</button>
                        <button type="button" data-quality="40" class="quality-preset active">40% (Recomendado)</button>
                        <button type="button" data-quality="55" class="quality-preset">55% (Mejor Calidad)</button>
                        <button type="button" data-quality="70" class="quality-preset">70% (Casi lo Mismo)</button>
                    </div>
                </div>
                <!-- <small class="quality-note">🔍 Menor calidad = menor tamaño de archivo</small> -->
            </div>
            
            <!-- <div class="control-group">
                <label>📦 División por tamaño:</label>
                <div class="size-control">
                    <span>Máximo ${this.maxPDFSizeMB} MB por PDF</span>
                    <button type="button" id="configureSizeBtn" class="small-btn">Configurar</button>
                </div>
                <small class="size-note">⚡ Si el PDF supera ${this.maxPDFSizeMB}MB, se dividirá automáticamente</small>
            </div> -->
        `;

        // Insertar después del área de estadísticas
        const stats = document.querySelector('.stats');
        stats.parentNode.insertBefore(controlPanel, stats.nextSibling);

        // Configurar eventos de calidad
        const qualitySlider = document.getElementById('qualitySlider');
        const qualityValue = document.getElementById('qualityValue');
        const qualityPresets = document.querySelectorAll('.quality-preset');

        // qualitySlider.addEventListener('input', (e) => {
        //     this.quality = parseInt(e.target.value);
        //     qualityValue.textContent = `${this.quality}%`;

        //     // Actualizar presets activos
        //     qualityPresets.forEach(preset => {
        //         const presetQuality = parseInt(preset.dataset.quality);
        //         if (Math.abs(presetQuality - this.quality) <= 5) {
        //             preset.classList.add('active');
        //         } else {
        //             preset.classList.remove('active');
        //         }
        //     });

        //     // console.log("this.images",this.images)
        //     this.recategorizacion()
        // });

        qualityPresets.forEach(preset => {
            preset.addEventListener('click', () => {
                const newQuality = parseInt(preset.dataset.quality);
                this.quality = newQuality;
                // qualitySlider.value = newQuality;
                qualityValue.textContent = `${newQuality}%`;

                qualityPresets.forEach(p => p.classList.remove('active'));
                preset.classList.add('active');

                this.recategorizacion()
            });
        });

        // Configurar evento de tamaño máximo
        // const configureSizeBtn = document.getElementById('configureSizeBtn');
        // configureSizeBtn.addEventListener('click', () => this.configureMaxSize());
    }

    // configureMaxSize() {
    //     const modal = document.createElement('div');
    //     modal.className = 'modal-overlay';
    //     modal.innerHTML = `
    //         <div class="modal-content">
    //             <h3>Configurar tamaño máximo por PDF</h3>
    //             <div class="modal-body">
    //                 <label>Tamaño máximo (MB):</label>
    //                 <input type="number" id="maxSizeInput" value="${this.maxPDFSizeMB}" min="0.5" max="10" step="0.5">
    //                 <small>Entre 0.5 MB y 10 MB</small>
    //             </div>
    //             <div class="modal-actions">
    //                 <button class="btn-modal btn-modal-cancel">Cancelar</button>
    //                 <button class="btn-modal btn-modal-confirm">Aceptar</button>
    //             </div>
    //         </div>
    //     `;

    //     document.body.appendChild(modal);

    //     const confirmBtn = modal.querySelector('.btn-modal-confirm');
    //     const cancelBtn = modal.querySelector('.btn-modal-cancel');
    //     const sizeInput = modal.querySelector('#maxSizeInput');

    //     confirmBtn.onclick = () => {
    //         let newSize = parseFloat(sizeInput.value);
    //         if (isNaN(newSize)) newSize = 2;
    //         if (newSize < 0.5) newSize = 0.5;
    //         if (newSize > 10) newSize = 10;

    //         this.maxPDFSizeMB = newSize;
    //         const sizeNote = document.querySelector('.size-note');
    //         sizeNote.innerHTML = `⚡ Si el PDF supera ${this.maxPDFSizeMB}MB, se dividirá automáticamente`;

    //         document.body.removeChild(modal);
    //     };

    //     cancelBtn.onclick = () => {
    //         document.body.removeChild(modal);
    //     };

    //     modal.onclick = (e) => {
    //         if (e.target === modal) {
    //             document.body.removeChild(modal);
    //         }
    //     };
    // }

    async handleFiles(files) {
        console.log("file", files)
        const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));

        if (this.images.length + imageFiles.length > this.maxImages) {
            alert(`❌ Solo puedes subir máximo ${this.maxImages} imágenes. Actualmente tienes ${this.images.length}`);
            return;
        }
        this.changeActivacionBotonesPanel(true)
        this.showProgress(true, 'Cargando imágenes...');

        for (let i = 0; i < imageFiles.length; i++) {
            const file = imageFiles[i];
            // console.log("file", file)
            const compressedImage = await this.compressImage(file);
            // console.log("compressedImage", compressedImage)
            this.images.push({
                id: Date.now() + Math.random() + i,
                data: compressedImage,
                name: file.name,
                size: file.size,
                originalQuality: this.quality,
                fileOriginalImagen: file
            });

            this.updateProgress((i + 1) / imageFiles.length * 100, `Cargando ${i + 1}/${imageFiles.length}`);
        }

        // await this.mostrarTamanioCompress()


        this.updatePreview();
        this.updateStats();
        this.changeActivacionBotonesPanel(false)
        this.showProgress(false);
    }

    // async mostrarTamanioCompress() {
    //     console.log("polloWil")
    //     const sizeTempoBlob = await this.generatePDFBlob(this.images);
    //     const testSizeMB = sizeTempoBlob.size / (1000 * 1024);
    //     this.totalSizeCompress.textContent = `${testSizeMB.toFixed(2)} aprx`

    //     let pesoTempo = 0
    //     for (let index = 0; index < this.images.length; index++) {
    //         const imagenTempo = this.images[index]
    //         const bytesOriginales = ((imagenTempo["data"].length * 3) / 4)/(1);
    //         console.log(bytesOriginales)
    //         pesoTempo = pesoTempo + bytesOriginales
    //     }

    //     console.log("testSizeMB", testSizeMB)
    //     console.log("testSizeMB2", pesoTempo)
    //     console.log("polloWil2")
    // }
    obtenerTamanioCompress() {
        console.log("polloWil")
        // const sizeTempoBlob = await this.generatePDFBlob(this.images);
        // const testSizeMB = sizeTempoBlob.size / (1000 * 1024);
        // this.totalSizeCompress.textContent = `${testSizeMB.toFixed(2)} aprx`

        let pesoTempo = 0
        for (let index = 0; index < this.images.length; index++) {
            const imagenTempo = this.images[index]
            const bytesOriginales = ((imagenTempo["data"].length * 3) / 4) / (1024 * 1024);
            // console.log(bytesOriginales)
            pesoTempo = pesoTempo + bytesOriginales
        }

        // console.log("testSizeMB", testSizeMB)
        console.log("testSizeMB2", pesoTempo)
        console.log("polloWil2")
        return `${pesoTempo.toFixed(2)} aprx`
    }

    compressImage(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Redimensionar si es muy grande (máximo 1200px)
                    const maxDimension = 1200;
                    if (width > maxDimension || height > maxDimension) {
                        if (width > height) {
                            height = (height * maxDimension) / width;
                            width = maxDimension;
                        } else {
                            width = (width * maxDimension) / height;
                            height = maxDimension;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Usar la calidad seleccionada (convertir a decimal 0-1)
                    const qualityDecimal = this.quality / 100;
                    resolve(canvas.toDataURL('image/jpeg', qualityDecimal));
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    updatePreview() {
        if (this.images.length === 0) {
            this.previewGrid.innerHTML = '<div class="empty-state">📸 No hay imágenes seleccionadas. Sube algunas imágenes para comenzar.</div>';
            return;
        }

        this.previewGrid.innerHTML = '';

        this.images.forEach((image, index) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';

            const img = document.createElement('img');
            img.src = image.data;
            img.alt = image.name;

            const info = document.createElement('div');
            info.className = 'preview-info';
            info.textContent = `#${index + 1}`;

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.innerHTML = '×';
            removeBtn.onclick = (e) => {
                e.stopPropagation();
                this.removeImage(index);
            };

            previewItem.appendChild(img);
            previewItem.appendChild(info);
            previewItem.appendChild(removeBtn);
            this.previewGrid.appendChild(previewItem);
        });

        this.previewGrid.scrollTop = this.previewGrid.scrollHeight;
    }

    removeImage(index) {
        this.images.splice(index, 1);
        this.updatePreview();
        this.updateStats();

        if (this.images.length === 0) {
            this.generateBtn.disabled = true;
        }
    }

    updateStats() {
        const totalImages = this.images.length;
        const totalPages = Math.ceil(totalImages / this.imagesPerPage);
        const totalSize = this.images.reduce((sum, img) => sum + (img.size || 0), 0);

        this.imageCountSpan.textContent = totalImages;
        this.pageCountSpan.textContent = totalPages;
        this.totalSizeSpan.textContent = (totalSize / (1024 * 1024)).toFixed(2);
        this.totalSizeCompress.textContent = this.obtenerTamanioCompress()

        this.generateBtn.disabled = totalImages === 0 || this.isGenerating;
    }

    async generatePDF() {
        if (this.images.length === 0) {
            alert('No hay imágenes para generar el PDF');
            return;
        }

        if (this.isGenerating) {
            alert('Ya se está generando un PDF. Por favor espera...');
            return;
        }

        this.isGenerating = true;
        this.generateBtn.disabled = true;
        this.changeActivacionBotonesPanel(true)
        this.showProgress(true, 'Preparando PDF...');

        try {
            // Generar el PDF completo para medir tamaño
            const fullPDFBlob = await this.generatePDFBlob(this.images);
            const fullPDFSizeMB = fullPDFBlob.size / (1024 * 1024);
            console.log("fullPDFSizeMB", fullPDFSizeMB)

            if (fullPDFSizeMB <= this.maxPDFSizeMB) {
                // Un solo PDF es suficiente
                this.downloadPDF(fullPDFBlob, `FOTOS.pdf`);
                this.updateProgress(100, '¡PDF generado exitosamente!');
                setTimeout(() => {
                    this.showProgress(false);
                    alert(`✅ PDF generado con éxito!\n📄 Tamaño: ${fullPDFSizeMB.toFixed(2)} MB\n🖼️ ${this.images.length} imágenes`);
                }, 1000);
            } else {
                // Dividir en múltiples PDFs
                await this.splitAndGeneratePDFs();
            }

        } catch (error) {
            this.changeActivacionBotonesPanel(false)
            console.error('Error:', error);
            alert('❌ Error al generar el PDF. Por favor intenta de nuevo.');
            this.showProgress(false);
        } finally {
            this.changeActivacionBotonesPanel(false)
            this.isGenerating = false;
            this.generateBtn.disabled = this.images.length === 0;
        }
    }

    async generatePDFBlob(images, startIndex = 0, endIndex = null) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait',
            compress: true
        });

        const targetImages = endIndex ? images.slice(startIndex, endIndex) : images;
        const totalPages = Math.ceil(targetImages.length / this.imagesPerPage);

        // Dimensiones A4
        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 6;
        const cellSpacing = 2;

        const availableWidth = pageWidth - (margin * 2);
        const availableHeight = pageHeight - (margin * 2);

        const cellWidth = (availableWidth - cellSpacing) / 2;
        const cellHeight = (availableHeight - (cellSpacing * 2)) / 4;
        // pollo
        for (let page = 0; page < totalPages; page++) {
            if (page > 0) {
                pdf.addPage();
            }

            const startIdx = page * this.imagesPerPage;
            const endIdx = Math.min(startIdx + this.imagesPerPage, targetImages.length);

            for (let i = startIdx; i < endIdx; i++) {
                const position = i - startIdx;
                const row = Math.floor(position / 2);
                const col = position % 2;

                const x = margin + (col * (cellWidth + cellSpacing));
                const y = margin + (row * (cellHeight + cellSpacing));

                // Detectar si la imagen es vertical
                const isVertical = await this.isImageVertical(targetImages[i].data);

                if (isVertical) {
                    // ROTAR la imagen vertical 90 grados
                    const rotatedImage = await this.rotateImage(targetImages[i].data, 270);
                    await this.addImageToPDF(pdf, rotatedImage, x, y, cellWidth, cellHeight);
                } else {
                    // Imagen normal sin rotar
                    await this.addImageToPDF(pdf, targetImages[i].data, x, y, cellWidth, cellHeight);
                }
            }
        }

        return pdf.output('blob');
    }

    // Función para rotar imagen
    rotateImage(imageData, degrees) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (degrees === 90 || degrees === 270) {
                    // Intercambiar ancho y alto para rotación de 90 o 270 grados
                    canvas.width = img.height;
                    canvas.height = img.width;
                } else {
                    canvas.width = img.width;
                    canvas.height = img.height;
                }

                // Aplicar rotación
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(degrees * Math.PI / 180);
                ctx.drawImage(img, -img.width / 2, -img.height / 2);

                resolve(canvas.toDataURL('image/jpeg', this.quality / 100));
            };
            img.src = imageData;
        });
    }

    // Función para detectar si una imagen es vertical
    isImageVertical(imageData) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                // Considerar vertical si la altura es mayor que el ancho por un margen del 10%
                resolve(img.height > img.width * 1.1);
            };
            img.onerror = () => {
                resolve(false);
            };
            img.src = imageData;
        });
    }

    async splitAndGeneratePDFs() {
        this.updateProgress(0, 'Calculando división óptima...');

        const totalImages = this.images.length;
        console.log("totalImages", totalImages)
        const pdfsToGenerate = [];
        let currentStart = 0;

        // Probar diferentes tamaños de lote para encontrar la división óptima
        let testBatchSize = Math.ceil(totalImages / 2);
        let bestBatchSize = testBatchSize;

        bestBatchSize = 5
        // while (testBatchSize > 5) {
        //     console.log("pollo")
        //     const testImages = this.images.slice(currentStart, Math.min(currentStart + testBatchSize, totalImages));
        //     const testBlob = await this.generatePDFBlob(testImages);
        //     const testSizeMB = testBlob.size / (1024 * 1024);
        //     console.log("testSizeMB",testSizeMB)

        //     if (testSizeMB <= this.maxPDFSizeMB) {
        //         bestBatchSize = testBatchSize;
        //         testBatchSize = Math.min(testBatchSize + Math.ceil(testBatchSize / 2), totalImages);
        //     } else {
        //         testBatchSize = Math.floor(testBatchSize / 2);
        //     }
        // }

        let divisorTempo = 2
        let verificador = true
        while (verificador) {
            console.log("pollito", divisorTempo)
            const tamanoParte = Math.ceil(this.images.length / divisorTempo)
            const partes = [];
            for (let i = 0; i < this.images.length; i += tamanoParte) {
                partes.push(this.images.slice(i, i + tamanoParte));
            }

            let veriTotalSub = false
            for (let index = 0; index < partes.length; index++) {
                const pesito = await this.generatePDFBlob(partes[index]);
                if (pesito > this.maxPDFSizeMB) {
                    veriTotalSub = true
                    break
                }
            }
            console.log("holiwis")
            if (!veriTotalSub) {
                verificador = veriTotalSub
                bestBatchSize = tamanoParte
            }
            divisorTempo = divisorTempo + 1
        }


        // Generar PDFs divididos
        let currentIndex = 0;
        let pdfNumber = 1;

        while (currentIndex < totalImages) {
            let batchSize = bestBatchSize;
            let validBatch = false;

            while (!validBatch && batchSize > 0) {
                const endIndex = Math.min(currentIndex + batchSize, totalImages);
                const batchImages = this.images.slice(currentIndex, endIndex);
                const pdfBlob = await this.generatePDFBlob(batchImages);
                const pdfSizeMB = pdfBlob.size / (1024 * 1024);

                if (pdfSizeMB <= this.maxPDFSizeMB || batchSize <= 5) {
                    pdfsToGenerate.push({
                        blob: pdfBlob,
                        start: currentIndex,
                        end: endIndex,
                        size: pdfSizeMB
                    });
                    currentIndex = endIndex;
                    validBatch = true;

                    this.updateProgress(
                        (currentIndex / totalImages) * 100,
                        `Preparando PDF ${pdfNumber} (${pdfSizeMB.toFixed(2)} MB)...`
                    );
                    pdfNumber++;
                } else {
                    batchSize = Math.floor(batchSize * 0.8);
                }
            }
        }

        // Descargar todos los PDFs
        this.updateProgress(50, `Generando ${pdfsToGenerate.length} archivos PDF...`);

        for (let i = 0; i < pdfsToGenerate.length; i++) {
            const pdf = pdfsToGenerate[i];
            const fileName = `FOTOS_${i + 1}_de_${pdfsToGenerate.length}.pdf`;
            this.downloadPDF(pdf.blob, fileName);

            this.updateProgress(
                50 + ((i + 1) / pdfsToGenerate.length) * 50,
                `Descargando PDF ${i + 1} de ${pdfsToGenerate.length}...`
            );

            // Pequeña pausa entre descargas
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        this.updateProgress(100, '¡Todos los PDFs generados exitosamente!');
        setTimeout(() => {
            this.showProgress(false);
            alert(`✅ Se generaron ${pdfsToGenerate.length} archivos PDF\n📊 Cada uno menor a ${this.maxPDFSizeMB} MB\n🖼️ Total: ${this.images.length} imágenes`);
        }, 1000);
    }

    downloadPDF(blob, filename) {
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    addImageToPDF(pdf, imageData, x, y, width, height) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                try {
                    const imgWidth = img.width;
                    const imgHeight = img.height;
                    const ratio = Math.min(width / imgWidth, height / imgHeight);
                    const finalWidth = imgWidth * ratio;
                    const finalHeight = imgHeight * ratio;
                    const offsetX = x + (width - finalWidth) / 2;
                    const offsetY = y + (height - finalHeight) / 2;

                    // Usar la calidad seleccionada para la imagen en PDF
                    const qualityDecimal = this.quality / 100;
                    pdf.addImage(imageData, 'JPEG', offsetX, offsetY, finalWidth, finalHeight, undefined, 'FAST');
                    resolve();
                } catch (error) {
                    console.error('Error al añadir imagen:', error);
                    resolve();
                }
            };
            img.onerror = () => {
                console.error('Error cargando imagen');
                resolve();
            };
            img.src = imageData;
        });
    }


    showProgress(show, message = '') {
        this.progressContainer.style.display = show ? 'block' : 'none';
        if (message && show) {
            this.progressDetail.textContent = message;
        }
    }

    updateProgress(percent, message) {
        const percentage = Math.min(100, Math.max(0, percent));
        this.progressFill.style.width = `${percentage}%`;
        this.progressPercent.textContent = `${Math.round(percentage)}%`;
        if (message) {
            this.progressDetail.textContent = message;
        }
    }

    clearAll() {
        if (this.images.length === 0) return;

        if (confirm(`¿Estás seguro de que quieres eliminar todas las ${this.images.length} imágenes?`)) {
            this.images = [];
            this.updatePreview();
            this.updateStats();
            this.fileInput.value = '';
            this.showProgress(false);
        }
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    window.app = new PDFCollageMaker();
});