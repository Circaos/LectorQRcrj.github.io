function obtenerTableHTML(data) {
    if (data.length === 0) return;

    const maxCols = Math.max(...data.map(row => row.length));
    const headers = data[0];
    const hasHeader = headers && headers.length > 0;

    let html = '<table class="tablaHtml" >';

    // Headers
    if (hasHeader) {
        html += '<thead><tr>';
        for (let i = 0; i < maxCols; i++) {
            html += `<th>${headers[i] || `Columna ${i + 1}`}</th>`;
        }
        html += '</tr></thead>';
    }

    // Body
    html += '<tbody>';
    for (let i = hasHeader ? 1 : 0; i < data.length; i++) {
        html += '<tr>';
        for (let j = 0; j < maxCols; j++) {
            html += `<td>${data[i][j] || ''}</td>`;
        }
        html += '</tr>';
    }
    html += '</tbody></table>';

    return html;
}


function analyzeText(text) {
    // const text = document.getElementById('pasteArea').value;
    if (!text.trim()) {
        // document.getElementById('info').innerHTML = 'Por favor, pega una tabla primero';
        return {
            alerta: "texto incial vacio",
            data:[]
        }
    }

    // Intentar primero como HTML
    let data = parseHTMLTable(text);

    // Si no es HTML, intentar como texto plano
    if (!data || data.length === 0) {
        data = parseTextToTable(text);
    }

    if (data.length === 0) {
        // document.getElementById('result').innerHTML = '<p>No se pudo detectar una tabla válida. Asegúrate de copiar una tabla correctamente.</p>';
        // document.getElementById('info').innerHTML = 'Formato no reconocido. Intenta copiar la tabla desde la página web.';
        return {
            alerta: "Formato no reconocido. Intenta copiar la tabla nuevamente",
            data: []
        }
    }

    // console.log("tablita",data)
    return { data: data}

    // Mostrar resultados
    // displayTable(data);
    // generateStats(data);
}

// Método 1: Analizar texto plano (tablas copiadas de Excel/Word/Web)
function parseTextToTable(text) {
    const lines = text.split(/\r?\n/);
    const data = [];

    for (let line of lines) {
        // Detectar diferentes separadores comunes
        let row;
        if (line.includes('\t')) {
            row = line.split('\t');
        } else if (line.includes('|')) {
            row = line.split('|').filter(cell => cell.trim() !== '');
        } else {
            // Intentar detectar múltiples espacios como separador
            row = line.split(/\s{2,}/);
            if (row.length === 1 && line.includes(' ')) {
                row = line.split(' ');
            }
        }

        if (row.length > 0 && row.some(cell => cell.trim() !== '')) {
            data.push(row.map(cell => cell.trim()));
        }
    }

    return data;
}

// Método 2: Analizar HTML pegado
function parseHTMLTable(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const tables = doc.getElementsByTagName('table');

    if (tables.length === 0) return null;

    const table = tables[0];
    const data = [];

    // Extraer headers
    const headers = [];
    const thElements = table.querySelectorAll('th');
    if (thElements.length > 0) {
        thElements.forEach(th => headers.push(th.textContent.trim()));
        data.push(headers);
    }

    // Extraer filas
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
        const rowData = [];
        const cells = row.querySelectorAll('td');
        if (cells.length > 0) {
            cells.forEach(cell => rowData.push(cell.textContent.trim()));
            if (rowData.length > 0) {
                data.push(rowData);
            }
        }
    });

    return data.length > 0 ? data : null;
}

export {
    analyzeText,
    obtenerTableHTML
}