//Importacion Store
// import { getState, setState, suscribir, getOtrosDatos } from './store.js'
import { getState, setState, suscribir, getOtrosDatos } from './storeMI.js'

// import { fechaToFormatoInput, inputToFormatoFecha } from './funciones/funcionesBasicas.js'
import { fechaToFormatoInput, inputToFormatoFecha } from './funciones/funcionesBasicasMI.js'

// import { guardarApiDam,createEmpresaApiDam } from './funciones/funcionesAPI.js'
import { guardarApiDam,createEmpresaApiDam } from './funciones/funcionesAPIMI.js'

// Datos iniciales
let datos = {}
let dataFromState = {}

let rucDATA = ""
let razonSocialDATA = ""
// Variables para controlar edición
let editandoLugarIndex = null;
let editandoCorreoIndex = null;
let editandoResponsableIndex = null;
let editandoArt2Index = null;


document.addEventListener("DOMContentLoaded", () => {
    agregarListenersModalConfig()
    suscribir((estado) => {
        console.log("Cambio en estado detectado en MODAL.JS")
        // console.log("from estado", estado)

        const rptOtrosDatos = getOtrosDatos()
        rucDATA = rptOtrosDatos[0]
        razonSocialDATA = rptOtrosDatos[1]

        // console.log("rucDATA", rucDATA)
        // console.log("razonSocialDATA", razonSocialDATA)
        pintadoCabecera()
        datos = estado
        if (estado == null) {
            datos = {}
            datos["Art2"] = []
            datos["lugarAforo"] = []
            datos["correoCeca"] = []
            datos["responsable"] = []
        }
        dataFromState = estado
        renderizarTodo();
    })
})


// Inicializar
function Inicializador() {
    // datos = getState()
}

// Renderizar todo el contenido
function renderizarTodo() {
    renderizarArt2();
    renderizarLugarAforo();
    renderizarCorreoCeca();
    renderizarResponsables();
}



//Cabecera
function pintadoCabecera() {
    document.getElementById("titleModalConfig").textContent = `📋 Gestor de Información ${razonSocialDATA} - ${rucDATA}`
}


// ==================== ART2 (Múltiples) ====================
function renderizarArt2() {
    const container = document.getElementById('art2-container');


    if (!datos || !datos.Art2 || datos.Art2.length === 0) {
        container.innerHTML = '<p style="color: #999;">No hay registros Art2</p>';
        return;
    }


    container.innerHTML = datos.Art2.map((art, index) => `
        <div class="art2-card" data-index="${index}">
            ${editandoArt2Index === index ? renderizarFormularioEdicionArt2(art, index) : renderizarVistaArt2(art, index)}
        </div>
    `).join('');

    for (let index = 0; index < datos.Art2.length; index++) {
        const contTempo = container.querySelector(`.art2-card[data-index="${index}"]`)
        if (index == editandoArt2Index) {
            contTempo.querySelector("button.btn-save-form").onclick = () => guardarEdicionArt2(index);
            contTempo.querySelector("button.btn-cancel").onclick = () => cancelarEdicionArt2();
        } else {
            contTempo.querySelector("button.btn-edit").onclick = () => editarArt2(index);
            contTempo.querySelector("button.btn-delete").onclick = () => eliminarArt2(index);
        }
    }

}





function renderizarVistaArt2(art, index) {
    return `
        <div class="art2-item">
            <div class="art2-info">
                <span class="art2-badge">Art2 #${index + 1}</span>
                <div class="art2-details">
                    <span class="${art.cumple ? 'cumple-si' : 'cumple-no'}">
                        ${art.cumple ? '✅ Cumple' : '❌ No cumple'}
                    </span>
                    <span>📅 Fecha: ${art.fecha || 'No especificada'}</span>
                    <span>🔢 Nombre Articulo: ${art.nombreArt || 'N/A'}</span>
                    <span>📆 Año: ${art.year || 'N/A'}</span>
                </div>
            </div>
            <div class="art2-actions">
                <button class="btn-edit">✏️ Editar</button>
                <button class="btn-delete">🗑️ Eliminar</button>
            </div>
        </div>
    `;
}

function renderizarFormularioEdicionArt2(art, index) {
    return `
        <div class="art2-item editing">
            <div class="art2-form">
                <label>
                    ✅ Cumple:
                    <input type="checkbox" id="edit-art2-cumple-${index}" ${art.cumple ? 'checked' : ''}>
                </label>
                <label>
                    🔢 Nombre Articulo:
                    <input type="text" id="edit-art2-numero-${index}" value="${art.nombreArt || ''}" placeholder="Número">
                </label>
                <label>
                    📆 Año:
                    <input type="text" id="edit-art2-year-${index}" value="${art.year || ''}" placeholder="Año">
                </label>
                <label>
                    📅 Fecha:
                    <input type="date" id="edit-art2-fecha-${index}" value="${fechaToFormatoInput(art.fecha) || ''}">
                </label>
            </div>
            <div class="art2-actions">
                <button class="btn-save-form">💾 Guardar</button>
                <button class="btn-cancel">❌ Cancelar</button>
            </div>
        </div>
    `;
}

function editarArt2(index) {
    editandoArt2Index = index;
    renderizarArt2();
}

function guardarEdicionArt2(index) {
    const cumple = document.getElementById(`edit-art2-cumple-${index}`).checked;
    const nombreArt = document.getElementById(`edit-art2-numero-${index}`).value;
    const year = document.getElementById(`edit-art2-year-${index}`).value;
    const fecha = inputToFormatoFecha(document.getElementById(`edit-art2-fecha-${index}`).value);

    datos.Art2[index] = {
        cumple: cumple,
        nombreArt: nombreArt,
        year: year,
        fecha: fecha
    };

    editandoArt2Index = null;
    renderizarArt2();
    guardarEnLocalStorage();
    mostrarNotificacion('Art2 actualizado ✓', 'success');
}

function cancelarEdicionArt2() {
    editandoArt2Index = null;
    renderizarArt2();
}

function agregarArt2() {
    const nuevoArt2 = {
        cumple: false,
        nombreArt: "",
        year: new Date().getFullYear().toString(),
        fecha: ""
    };

    datos.Art2.push(nuevoArt2);
    renderizarArt2();
    guardarEnLocalStorage();
    mostrarNotificacion('Nuevo Art2 agregado ✓', 'success');
}

function eliminarArt2(index) {
    if (confirm('¿Eliminar este registro Art2?')) {
        datos.Art2.splice(index, 1);
        if (editandoArt2Index === index) editandoArt2Index = null;
        renderizarArt2();
        guardarEnLocalStorage();
        mostrarNotificacion('Art2 eliminado ✓', 'success');
    }
}



// ==================== Lugar Aforo ====================
function renderizarLugarAforo() {
    const container = document.getElementById('lugarAforo-container');

    if (!datos || !datos.lugarAforo || datos.lugarAforo.length === 0) {
        container.innerHTML = '<p style="color: #999;">No hay lugares registrados</p>';
        return;
    }

    container.innerHTML = datos.lugarAforo.map((lugar, index) => `
        <div class="item-lugar" data-index="${index}">
            ${editandoLugarIndex === index ? renderizarFormularioEdicionLugar(lugar, index) : renderizarVistaLugar(lugar, index)}
        </div>
    `).join('');


    for (let index = 0; index < datos.lugarAforo.length; index++) {
        const contTempo = container.querySelector(`.item-lugar[data-index="${index}"]`)
        if (index == editandoLugarIndex) {
            contTempo.querySelector(`button.btn-save-form`).onclick = () => guardarEdicionLugar(index);
            contTempo.querySelector(`button.btn-cancel`).onclick = () => cancelarEdicionLugar();
        } else {
            contTempo.querySelector(`button.btn-edit`).onclick = () => editarLugarAforo(index);
            contTempo.querySelector(`button.btn-delete`).onclick = () => eliminarLugarAforo(index);
        }

    }
}

function renderizarVistaLugar(lugar, index) {
    return `
        <span class="item-content">📍 ${lugar}</span>
        <div>
            <button class="btn-edit">✏️ Editar</button>
            <button class="btn-delete">🗑️ Eliminar</button>
        </div>
    `;
}

function renderizarFormularioEdicionLugar(lugar, index) {
    return `
        <input type="text" id="edit-lugar-${index}" value="${lugar}" class="edit-input" autofocus>
        <div>
            <button class="btn-save-form">💾 Guardar</button>
            <button class="btn-cancel">❌ Cancelar</button>
        </div>
    `;
}

function editarLugarAforo(index) {
    // console.log(`editando ${index}`)
    editandoLugarIndex = index;
    renderizarLugarAforo();
}

function guardarEdicionLugar(index) {
    const nuevoValor = document.getElementById(`edit-lugar-${index}`).value.trim();
    if (nuevoValor) {
        datos.lugarAforo[index] = nuevoValor;
        editandoLugarIndex = null;
        renderizarLugarAforo();
        guardarEnLocalStorage();
        mostrarNotificacion('Lugar actualizado ✓', 'success');
    } else {
        mostrarNotificacion('El lugar no puede estar vacío', 'error');
    }
}

function cancelarEdicionLugar() {
    editandoLugarIndex = null;
    renderizarLugarAforo();
}

function agregarLugarAforo() {
    const input = document.getElementById('new-lugarAforo');
    const nuevoLugar = input.value.trim();

    if (nuevoLugar) {
        datos.lugarAforo.push(nuevoLugar);
        renderizarLugarAforo();
        // guardarEnLocalStorage();
        input.value = '';
        mostrarNotificacion(`Lugar "${nuevoLugar}" agregado ✓`, 'success');
    } else {
        mostrarNotificacion('Por favor ingrese un lugar válido', 'error');
    }
}

function eliminarLugarAforo(index) {
    if (confirm('¿Eliminar este lugar?')) {
        datos.lugarAforo.splice(index, 1);
        if (editandoLugarIndex === index) editandoLugarIndex = null;
        renderizarLugarAforo();
        guardarEnLocalStorage();
        mostrarNotificacion('Lugar eliminado ✓', 'success');
    }
}


// ==================== Correos CECA ====================
function renderizarCorreoCeca() {
    const container = document.getElementById('correoCeca-container');

    if (!datos || !datos.correoCeca || datos.correoCeca.length === 0) {
        container.innerHTML = '<p style="color: #999;">No hay correos registrados</p>';
        return;
    }

    container.innerHTML = datos.correoCeca.map((correo, index) => `
        <div class="item-correo" data-index="${index}">
            ${editandoCorreoIndex === index ? renderizarFormularioEdicionCorreo(correo, index) : renderizarVistaCorreo(correo, index)}
        </div>
    `).join('');

    for (let index = 0; index < datos.correoCeca.length; index++) {
        const contTempo = container.querySelector(`.item-correo[data-index="${index}"]`)
        if (index == editandoCorreoIndex) {
            contTempo.querySelector(`button.btn-save-form`).onclick = () => guardarEdicionCorreo(index);
            contTempo.querySelector(`button.btn-cancel`).onclick = () => cancelarEdicionCorreo();
        } else {
            contTempo.querySelector(`button.btn-edit`).onclick = () => editarCorreo(index);
            contTempo.querySelector(`button.btn-delete`).onclick = () => eliminarCorreo(index);
        }

    }

}

function renderizarVistaCorreo(correo, index) {
    return `
        <span class="item-content">📧 ${correo}</span>
        <div>
            <button class="btn-edit">✏️ Editar</button>
            <button class="btn-delete">🗑️ Eliminar</button>
        </div>
    `;
}

function renderizarFormularioEdicionCorreo(correo, index) {
    return `
        <input type="email" id="edit-correo-${index}" value="${correo}" class="edit-input" autofocus>
        <div>
            <button class="btn-save-form">💾 Guardar</button>
            <button class="btn-cancel">❌ Cancelar</button>
        </div>
    `;
}

function editarCorreo(index) {
    editandoCorreoIndex = index;
    renderizarCorreoCeca();
}

function guardarEdicionCorreo(index) {
    const nuevoCorreo = document.getElementById(`edit-correo-${index}`).value.trim();
    if (nuevoCorreo && nuevoCorreo.includes('@')) {
        datos.correoCeca[index] = nuevoCorreo;
        editandoCorreoIndex = null;
        renderizarCorreoCeca();
        guardarEnLocalStorage();
        mostrarNotificacion('Correo actualizado ✓', 'success');
    } else {
        mostrarNotificacion('Correo inválido (debe contener @)', 'error');
    }
}

function cancelarEdicionCorreo() {
    editandoCorreoIndex = null;
    renderizarCorreoCeca();
}

function agregarCorreo() {
    const input = document.getElementById('new-correo');
    const nuevoCorreo = input.value.trim();

    if (nuevoCorreo && nuevoCorreo.includes('@')) {
        datos.correoCeca.push(nuevoCorreo);
        renderizarCorreoCeca();
        guardarEnLocalStorage();
        input.value = '';
        mostrarNotificacion(`Correo "${nuevoCorreo}" agregado ✓`, 'success');
    } else {
        mostrarNotificacion('Por favor ingrese un correo válido', 'error');
    }
}

function eliminarCorreo(index) {
    if (confirm('¿Eliminar este correo?')) {
        datos.correoCeca.splice(index, 1);
        if (editandoCorreoIndex === index) editandoCorreoIndex = null;
        renderizarCorreoCeca();
        guardarEnLocalStorage();
        mostrarNotificacion('Correo eliminado ✓', 'success');
    }
}



// ==================== Responsables ====================
function renderizarResponsables() {
    const container = document.getElementById('responsables-container');

    if (!datos || !datos.responsable || datos.responsable.length === 0) {
        container.innerHTML = '<p style="color: #999;">No hay responsables registrados</p>';
        return;
    }

    container.innerHTML = datos.responsable.map((resp, index) => `
        <div class="item-responsable" data-index="${index}">
            ${editandoResponsableIndex === index ? renderizarFormularioEdicionResponsable(resp, index) : renderizarVistaResponsable(resp, index)}
        </div>
    `).join('');


    for (let index = 0; index < datos.responsable.length; index++) {
        const contTempo = container.querySelector(`.item-responsable[data-index="${index}"]`)
        if (index == editandoResponsableIndex) {
            contTempo.querySelector(`button.btn-save-form`).onclick = () => guardarEdicionResponsable(index);
            contTempo.querySelector(`button.btn-cancel`).onclick = () => cancelarEdicionResponsable();
        } else {
            contTempo.querySelector(`button.btn-edit`).onclick = () => editarResponsable(index);
            contTempo.querySelector(`button.btn-delete`).onclick = () => eliminarResponsable(index);
        }
    }

}

function renderizarVistaResponsable(resp, index) {
    return `
        <span class="item-content">👤 ${resp.preNombre} ${resp.nombre} - ${resp.tipoDoc}: ${resp.documento}</span>
        <div>
            <button class="btn-edit">✏️ Editar</button>
            <button class="btn-delete">🗑️ Eliminar</button>
        </div>
    `;
}

function renderizarFormularioEdicionResponsable(resp, index) {
 
    return `
        <div class="edit-responsable-form">
            <select name="preNombre" id="preNombre">
                <option value="Sr." ${(resp.preNombre == "Sr.") ? "selected" : "" }>Sr.</option>
                <option value="Sra." ${(resp.preNombre == "Sra.") ? "selected" : "" }>Sra.</option>
            </select>
            <input type="text" id="edit-resp-nombre-${index}" value="${resp.nombre}" placeholder="Nombre" class="edit-input">
            <select name="tipoDoc" id="tipoDoc">
                <option value="DNI" ${(resp.tipoDoc == "DNI") ? "selected" : "" }>DNI</option>
                <option value="CE" ${(resp.tipoDoc == "CE") ? "selected" : "" }>CE</option>
            </select>
            <input type="text" id="edit-resp-documento-${index}" value="${resp.documento}" placeholder="Documento" class="edit-input">
        </div>
        <div>
            <button class="btn-save-form">💾 Guardar</button>
            <button class="btn-cancel">❌ Cancelar</button>
        </div>
    `;
}

function editarResponsable(index) {
    editandoResponsableIndex = index;
    renderizarResponsables();
}

function guardarEdicionResponsable(index) {
    const nombre = document.getElementById(`edit-resp-nombre-${index}`).value.trim();
    const documento = document.getElementById(`edit-resp-documento-${index}`).value.trim();
    const preNombre = document.getElementById('preNombre').value.trim();
    const tipoDoc = document.getElementById('tipoDoc').value.trim();

    console.log(`${nombre} - ${documento} - ${preNombre} - ${tipoDoc}`)
    if (nombre && documento && preNombre && tipoDoc) {
        datos.responsable[index] = { nombre, documento,preNombre,tipoDoc };
        editandoResponsableIndex = null;
        renderizarResponsables();
        guardarEnLocalStorage();
        mostrarNotificacion('Responsable actualizado ✓', 'success');
    } else {
        mostrarNotificacion('Complete nombre y Documento', 'error');
    }
}

function cancelarEdicionResponsable() {
    editandoResponsableIndex = null;
    renderizarResponsables();
}

function agregarResponsable() {
    const nombre = document.getElementById('new-responsable-nombre').value.trim();
    const documento = document.getElementById('new-responsable-documento').value.trim();
    const preNombre = document.getElementById('new-preNombre').value.trim();
    const tipoDoc = document.getElementById('new-tipoDoc').value.trim();

    if (nombre && documento && preNombre && tipoDoc) {
        datos.responsable.push({ nombre, documento, preNombre,tipoDoc });
        renderizarResponsables();
        guardarEnLocalStorage();
        document.getElementById('new-responsable-nombre').value = '';
        document.getElementById('new-responsable-documento').value = '';
        document.getElementById('new-preNombre').selectedIndex  = 0
        document.getElementById('new-tipoDoc').selectedIndex  = 0
        mostrarNotificacion(`Responsable "${nombre}" agregado ✓`, 'success');
    } else {
        mostrarNotificacion('Complete nombre y Documento', 'error');
    }
}

function eliminarResponsable(index) {
    if (confirm('¿Eliminar este responsable?')) {
        datos.responsable.splice(index, 1);
        if (editandoResponsableIndex === index) editandoResponsableIndex = null;
        renderizarResponsables();
        guardarEnLocalStorage();
        mostrarNotificacion('Responsable eliminado ✓', 'success');
    }
}










// FUNCIONES ADICIONALES



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



//
function agregarListenersModalConfig() {
    document.getElementById("btnAddLugarAforo").addEventListener("click", (e) => {
        agregarLugarAforo()
    })
    document.getElementById("btnAddLugarArt2").addEventListener("click", (e) => {
        agregarArt2()
    })
    document.getElementById("btnAddCorreoCeca").addEventListener("click", (e) => {
        agregarCorreo()
    })
    document.getElementById("btnAddResponsable").addEventListener("click", (e) => {
        agregarResponsable()
    })

    document.getElementById("GuardarModalConfig").addEventListener("click", async () => {

        const botoncitoGuardar = document.getElementById("GuardarModalConfig")
        botoncitoGuardar.disabled = true
        botoncitoGuardar.textContent = "GUARDANDO ..."

        let rptApi = null
        if (dataFromState == null) {
            //create 

            let dataPreparada = {
                ruc: rucDATA,
                dataCreate: {
                    nombreEmpresa: razonSocialDATA,
                    Art2: datos["Art2"],
                    lugarAforo: datos["lugarAforo"],
                    correoCeca: datos["correoCeca"],
                    responsable: datos["responsable"],
                }
            }

            console.log("create")
            console.log("dataPreparada", dataPreparada)
            rptApi = await createEmpresaApiDam(dataPreparada)
            console.log("rptApi", rptApi)

        } else {
            //update
            let dataPreparada = {
                ruc: datos["RUC"],
                dataUpdate: {
                    nombreEmpresa: datos["nombreEmpresa"],
                    Art2: datos["Art2"],
                    lugarAforo: datos["lugarAforo"],
                    correoCeca: datos["correoCeca"],
                    responsable: datos["responsable"],
                }
            }
            console.log("update")
            console.log("dataPreparada", dataPreparada)
            rptApi = await guardarApiDam(dataPreparada)
            console.log("rptApi", rptApi)
        }

        if (rptApi == null) {
            mostrarNotificacion("ERROR AL REALIZAR LA SOLICITUD", "error")
        } else {
            mostrarNotificacion("SOLICITUD EXITOSAS", "success")

            setState(rptApi["info"])

            const modal = document.getElementById("miModalConfig").style.display = "none"
        }

        botoncitoGuardar.disabled = false
        botoncitoGuardar.textContent = "Guardar Todo"
    })
    document.getElementById("cancelarModalConfig").addEventListener("click", () => {
        document.getElementById("miModalConfig").style.display = "none"
    })
}



function guardarEnLocalStorage() { }





// Estilos para animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);