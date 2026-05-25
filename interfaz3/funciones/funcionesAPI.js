import {API_CONFIG} from '../config/config.js'

async function obtenerApiDam(dam) {
    // // const damFinalTempo = await fetch(`./${dam}.json`)

    // // console.log(damFinalTempo)
    // // if (!damFinalTempo.ok) {
    // //     return null
    // // }

    // const damFinal = await damFinalTempo.json();

    // const url = "https://apiproviaspruebav1-production.up.railway.app/dtarc/getInfoDam"

    try {
        const url = `${API_CONFIG.BASE_URL}/dtarc/getInfoDam`
        const data = { 'dua': dam }

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })

        const damFinal = await response.json()


        return damFinal["dam"]

    } catch (error) {
        return null
    }

}

async function obtenerApiDamCompleto(dam) {
    // // const damFinalTempo = await fetch(`./${dam}.json`)

    // // console.log(damFinalTempo)
    // // if (!damFinalTempo.ok) {
    // //     return null
    // // }

    // const damFinal = await damFinalTempo.json();

    // const url = "https://apiproviaspruebav1-production.up.railway.app/dtarc/getInfoDamCompleto"

    try {
        const url = `${API_CONFIG.BASE_URL}/dtarc/getInfoDamCompleto`
        const data = { 'dua': dam }

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })

        const damFinal = await response.json()


        return {
            "dam":damFinal["dam"],
            "infoRuc": damFinal["infoRuc"]
        }

    } catch (error) {
        return null
    }

}


async function guardarApiDam(datos) {

    // console.log("datos",datos)
    // const url = "https://apiproviaspruebav1-production.up.railway.app/dtarc/getInfoDamCompleto"

    try {
        const url = `${API_CONFIG.BASE_URL}/dtarc/setInfoRucEmpresa`
        const data = datos

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })

        const damFinal = await response.json()
        console.log("damFinal",damFinal)


        if (damFinal["estado"]== "error" ) {
            return null
        }else{
            return {
                "info": damFinal["dataActualizada"]
            }
        }


    } catch (error) {
        console.log("error",error)
        return null
    }

}
async function createEmpresaApiDam(datos) {

    // console.log("datos",datos)
    // const url = "https://apiproviaspruebav1-production.up.railway.app/dtarc/getInfoDamCompleto"

    try {
        const url = `${API_CONFIG.BASE_URL}/dtarc/createInfoRucEmpresa`
        const data = datos

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })

        const damFinal = await response.json()
        console.log("damFinal",damFinal)


        if (damFinal["estado"]== "error" ) {
            return null
        }else{
            return {
                "info": damFinal["dataCreada"]
            }
        }


    } catch (error) {
        console.log("error",error)
        return null
    }

}




function simularAPI() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve( {
                "Art2": [
                    {
                        "cumple": true,
                        "nombreArt": "001",
                        "year": "2024",
                        "fecha": "2024-05-15"
                    },
                    {
                        "cumple": false,
                        "nombreArt": "002",
                        "year": "2024",
                        "fecha": "2024-06-20"
                    }
                ],
                "lugarAforo": ["Auditorio Principal", "Sala de Conferencias"],
                "correoCeca": ["ceca1@ejemplo.com", "ceca2@ejemplo.com"],
                "responsable": [
                    {
                        "nombre": "Juan Pérez",
                        "dni": "12345678"
                    },
                    {
                        "nombre": "María García",
                        "dni": "87654321"
                    }
                ]
            })
        }, 2500)
    })
}


// function simularAPI() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       // Simula un 90% de éxito y un 10% de fallo (para probar errores)
//       const exito = Math.random() > 0.1;
      
//       if (exito) {
//         resolve(baseDeDatos);
//       } else {
//         reject(new Error("Error 500: No se pudo conectar al servidor"));
//       }
//     }, 1000); // Retraso de 1 segundo (1000 ms)
//   });
// }

export {
    obtenerApiDam,
    simularAPI,
    obtenerApiDamCompleto,
    guardarApiDam,
    createEmpresaApiDam
}
