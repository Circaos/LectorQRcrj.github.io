// Datos iniciales
let datos = {}
let razonSocial = ""
let ruc = ""

const suscriptores = [];

function getState() {
    return datos;
}

function setState(nuevoDato) {
    datos = nuevoDato
    suscriptores.forEach(suscriptor => suscriptor(datos));
}

function suscribir(callback) {
    console.log("SE GENERO UNA SUSCRIPCION")
    suscriptores.push(callback);
    // Devolver función para desuscribirse
    return () => {
        const index = suscriptores.indexOf(callback);
        if (index > -1) suscriptores.splice(index, 1);
    };
}



function setOtrosDatos(nuevoRuc,nuevoRazonSocial) {
    ruc = nuevoRuc
    razonSocial = nuevoRazonSocial
}

function getOtrosDatos() {
    return [ruc,razonSocial]
}


export {
    getState,
    setState,
    suscribir,
    setOtrosDatos,
    getOtrosDatos
}