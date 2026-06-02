
function fechaToFormatoInput(fecha) {
    let [dia, mes, anio] = fecha.split('/');
    return `${anio}-${mes}-${dia}`;
}
function inputToFormatoFecha(input) {
    let [anio, mes, dia] = input.split('-');
    return `${dia}/${mes}/${anio}`;
}

function numeroAPalabras(num) {
    if (num === 0) return 'cero';
    if (num === 1000000) return 'un millón';

    const unidades = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    const especiales = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
    const decenas = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    const centenas = ['', 'cien', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

    function convertirHasta999(n) {
        if (n === 0) return '';
        if (n < 10) return unidades[n];
        if (n < 20) return especiales[n - 10];
        if (n < 100) {
            let d = Math.floor(n / 10);
            let u = n % 10;
            if (u === 0) return decenas[d];
            if (d === 2) return 'veinti' + unidades[u];
            return decenas[d] + ' y ' + unidades[u];
        }
        // Centenas
        let c = Math.floor(n / 100);
        let resto = n % 100;
        if (resto === 0) {
            return c === 1 ? 'cien' : centenas[c];
        }
        return (c === 1 ? 'ciento' : centenas[c]) + ' ' + convertirHasta999(resto);
    }

    // Miles (1,000 - 999,999)
    let miles = Math.floor(num / 1000);
    let resto = num % 1000;
    let resultado = '';

    if (miles > 0) {
        if (miles === 1) {
            resultado = 'mil';
        } else {
            resultado = convertirHasta999(miles) + ' mil';
        }
    }

    if (resto > 0) {
        if (resultado) resultado += ' ';
        resultado += convertirHasta999(resto);
    }

    return resultado;
}

function nomAduana(s1) {
    var s4 = "SEDE CENTRAL";
    if (s1 == "118" || s1 == "pram1")
        s4 = "ADUANA MARITIMA DEL CALLAO";
    if (s1 == "235" || s1 == "prae1")
        s4 = "ADUANA AEREA Y POSTAL";
    if (s1 == "172" || s1 == "prta1")
        s4 = "ADUANA DE TACNA";
    if (s1 == "055" || s1 == "prpi1")
        s4 = "ADUANA DE CHICLAYO";
    if (s1 == "262" || s1 == "prde")
        s4 = "ADUANA DE DESAGUADERO";
    if (s1 == "244" || s1 == "prap1")
        s4 = "ADUANA POSTAL";
    if (s1 == "091" || s1 == "prch1")
        s4 = "ADUANA DE CHIMBOTE";
    if (s1 == "190" || s1 == "prcu1")
        s4 = "ADUANA DE CUZCO";
    if (s1 == "127" || s1 == "prps1")
        s4 = "ADUANA DE PISCO";
    if (s1 == "181" || s1 == "prpu1")
        s4 = "ADUANA DE PUNO";
    if (s1 == "226" || s1 == "priq1")
        s4 = "ADUANA DE IQUITOS";
    if (s1 == "019" || s1 == "prtu1")
        s4 = "ADUANA DE TUMBES";
    if (s1 == "163" || s1 == "pril1")
        s4 = "ADUANA DE ILO";
    if (s1 == "154" || s1 == "prar1")
        s4 = "ADUANA DE AREQUIPA";
    if (s1 == "046" || s1 == "prpa1")
        s4 = "ADUANA DE PAITA";
    if (s1 == "145" || s1 == "prmo1")
        s4 = "ADUANA DE MOLLENDO";
    if (s1 == "217" || s1 == "prpl1")
        s4 = "ADUANA DE PUCALLPA";
    if (s1 == "271" || s1 == "prtr1")
        s4 = "ADUANA DE TARAPOTO";
    if (s1 == "028" || s1 == "prtl1")
        s4 = "ADUANA DE TALARA";
    if (s1 == "000" || s1 == "prad1")
        s4 = "SEDE CENTRAL";
    if (s1 == "082" || s1 == "prsa1")
        s4 = "ADUANA DE SALAVERRY";

    return `INTENDENCIA DE ${s4}`;
}


function resumirCodigos(codigos) {
    // Convertir a números y ordenar
    const numeros = codigos
        .map(c => parseInt(c, 10))
        .sort((a, b) => a - b);


    const rangos = [];
    let inicioRango = numeros[0];
    let finRango = numeros[0];

    for (let i = 1; i < numeros.length; i++) {
        // Si el número actual es consecutivo al anterior
        if (numeros[i] === finRango + 1) {
            finRango = numeros[i];
        } else {
            // Guardar el rango o número individual
            if (inicioRango === finRango) {
                rangos.push(`${inicioRango}`);
            } else {
                rangos.push(`${inicioRango}-${finRango}`);
            }
            inicioRango = numeros[i];
            finRango = numeros[i];
        }
    }

    // Guardar el último rango o número
    if (inicioRango === finRango) {
        rangos.push(`${inicioRango}`);
    } else {
        rangos.push(`${inicioRango}-${finRango}`);
    }

    return rangos;
}

function obtenerMercaReconocida(listaSeriesDatos) {

    const unicos = Array.from(
        new Map(listaSeriesDatos.map(p => [p.descripciones[0], p])).values()
    );

    let partidaNandinaDef = "Conforme a lo declarado en DAM"
    let partidaNabandinaDef = "Conforme a lo declarado en DAM"
    let descriProductosDef = "PENDIENTE-PRODUCTOS"

    // console.log("UNICOSUNICOSUNICOS");
    // console.log(unicos);
    
    let textos = []
    let arregloPartidas = []
    for (const serie of unicos) {
        arregloPartidas.push(serie["partida"])
        textos.push(serie["descripciones"][0])
    }

    const miSetPartidas = new Set(arregloPartidas)
    const partidasFiltradas = [...miSetPartidas]
    if (partidasFiltradas.length == 1) {
        partidaNandinaDef = unicos[0]["partida"].match(/.{1,2}/g).join('.');
        partidaNabandinaDef = unicos[0]["partidaNabandina"].match(/.{1,2}/g).join('.');
    }


    // Paso 1: Estructurar los datos
    const agrupado = {};

    textos.forEach(texto => {
        const [producto, marca, modelo] = texto.split(',').map(s => s.trim());

        if (!agrupado[producto]) {
            agrupado[producto] = {};
        }

        if (!agrupado[producto][marca]) {
            agrupado[producto][marca] = [];
        }

        agrupado[producto][marca].push(modelo);
    });

    // Paso 2: Generar el resumen con "marca" y "modelo"
    const preResumen = Object.entries(agrupado)
    let resumen = descriProductosDef
    if (preResumen.length <= 10) {
        resumen = preResumen.map(([producto, marcas]) => {
            const marcasTexto = Object.entries(marcas).map(([marca, modelos]) => {
                if (modelos.length === 1) {
                    return `marca ${marca} modelo ${modelos[0]}`;
                } else {
                    const ultimoModelo = modelos.pop();
                    return `marca ${marca} modelo ${modelos.join(', modelo ')} y modelo ${ultimoModelo}`;
                }
            });
    
            if (marcasTexto.length === 1) {
                return `${producto} ${marcasTexto[0]}`;
            } else if (marcasTexto.length === 2) {
                return `${producto} ${marcasTexto[0]} y ${marcasTexto[1]}`;
            } else {
                const ultimaMarca = marcasTexto.pop();
                return `${producto} ${marcasTexto.join(', ')} y ${ultimaMarca}`;
            }
        }).join('; ');
    }

    return {
        "descri": resumen.toUpperCase(),
        "partNandina": partidaNandinaDef,
        "partNabandina": partidaNabandinaDef
    }
}

function formatearResumen(codigos, formato = 'completo') {
    // console.log("RESUMIENDO")
    const rangos = resumirCodigos(codigos);

    if (formato === 'simple') {
        return rangos.join(', ');
    }

    if (formato === "formal") {
        const formatoPad = 2
        // Formato legible en español
        const partes = rangos.map(rango => {
            if (rango.includes('-')) {
                const [inicio, fin] = rango.split('-');
                // Formatear con ceros a la izquierda (3 dígitos)
                const inicioFormateado = inicio.padStart(formatoPad, '0');
                const finFormateado = fin.padStart(formatoPad, '0');
                return `desde el ${inicioFormateado} hasta el ${finFormateado}`;
            } else {
                return `el ${rango.padStart(formatoPad, '0')}`;
            }
        });

        if (partes.length === 1) {
            return partes[0];
        }

        const ultimo = partes.pop();
        return `${partes.join(', ')} y ${ultimo}`;

    }
    const formatoPad = 2
    // Formato legible en español
    const partes = rangos.map(rango => {
        if (rango.includes('-')) {
            const [inicio, fin] = rango.split('-');
            // Formatear con ceros a la izquierda (3 dígitos)
            const inicioFormateado = inicio.padStart(formatoPad, '0');
            const finFormateado = fin.padStart(formatoPad, '0');
            return `${inicioFormateado} al ${finFormateado}`;
        } else {
            return `${rango.padStart(formatoPad, '0')}`;
        }
    });

    if (partes.length === 1) {
        return partes[0];
    }

    const ultimo = partes.pop();
    return `${partes.join(', ')} y ${ultimo}`;
}

function flattenObject(obj, parentKey = '', result = {}) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            const newKey = parentKey ? `${parentKey}-${key}` : key;

            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                // Si es un objeto y no un array, recursión
                flattenObject(obj[key], newKey, result);
            } else {
                // Si es un valor primitivo o un array
                result[newKey] = obj[key];
            }
        }
    }
    return result;
}

function reconfiguracionObjeto(objeto) {
    let objetoPlano = flattenObject(objeto)
    const keysObjetos = Object.keys(objetoPlano)

    for (const key of keysObjetos) {
        // console.log(key)
        if (!key.includes("estado")) {
            if (objetoPlano[key].includes("PENDIENTE-")) {
                objetoPlano[`${key}RRR`] = objetoPlano[key]
                objetoPlano[key] = ''
            } else {
                objetoPlano[`${key}RRR`] = ''
            }
        }

    }



    const AVArray = objetoPlano["cuadroDeudaTributaria-cuadroGeneral-AdValorem"]
    const IPMArray = objetoPlano["cuadroDeudaTributaria-cuadroGeneral-IPM"]
    const IGVArray = objetoPlano["cuadroDeudaTributaria-cuadroGeneral-IGV"]
    const TotalArray = objetoPlano["cuadroDeudaTributaria-cuadroGeneral-totales"]


    if (objetoPlano[""]) {
        
    }
    //Redodeando TOTALES
    TotalArray[0] = Math.round(TotalArray[0])
    TotalArray[4] = Math.round(TotalArray[4])
    TotalArray[5] = Math.round(TotalArray[5])
    //REDONDEADO LIQUIDACION ARANCEL NACIONAL
    // const pepe = obtenerRedondeoInicales(TotalArray[0],AVArray[0],IPMArray[0],IGVArray[0])
    // console.log("pepe",pepe)
    const datosRedondosLiqui = obtenerRedondeoInicales(TotalArray[0],AVArray[0],IPMArray[0],IGVArray[0])
    AVArray[0] = datosRedondosLiqui[0]
    IPMArray[0] = datosRedondosLiqui[1]
    IGVArray[0] = datosRedondosLiqui[2] 
    // //RED. DS 015-94
    const datosRedondosPECO = obtenerRedondeoInicales(TotalArray[4],AVArray[4],IPMArray[4],IGVArray[4])
    AVArray[4] = datosRedondosPECO[0]
    IPMArray[4] = datosRedondosPECO[1]
    IGVArray[4] = datosRedondosPECO[2]
    // [AVArray[4],IPMArray[4],IGVArray[4]] = obtenerRedondeoInicales(TotalArray[4],AVArray[4],IPMArray[4],IGVArray[4])
    // //RED. 27037
    const datosRedondosAmazonia = obtenerRedondeoInicales(TotalArray[5],AVArray[5],IPMArray[5],IGVArray[5])
    AVArray[5] = datosRedondosAmazonia[0]
    IPMArray[5] = datosRedondosAmazonia[1]
    IGVArray[5] = datosRedondosAmazonia[2]
    // [AVArray[5],IPMArray[5],IGVArray[5]] = obtenerRedondeoInicales(TotalArray[5],AVArray[5],IPMArray[5],IGVArray[5])
    



    objetoPlano["textoAVLiqu"] = formatearNumeroDOC(AVArray[0])
    objetoPlano["textoIPMLiqu"] = formatearNumeroDOC(IPMArray[0])
    objetoPlano["textoIGVLiqu"] = formatearNumeroDOC(IGVArray[0])
    objetoPlano["textoTotLiqu"] = formatearNumeroDOC(TotalArray[0])

    objetoPlano["textoAVRegu27"] = formatearNumeroDOC(AVArray[5])
    objetoPlano["textoIPMRegu27"] = formatearNumeroDOC(IPMArray[5])
    objetoPlano["textoIGVRegu27"] = formatearNumeroDOC(IGVArray[5])
    objetoPlano["textoTotRegu27"] = formatearNumeroDOC(TotalArray[5])

    objetoPlano["textoAVReguPECO"] = formatearNumeroDOC(AVArray[4])
    objetoPlano["textoIPMReguPECO"] = formatearNumeroDOC(IPMArray[4])
    objetoPlano["textoIGVReguPECO"] = formatearNumeroDOC(IGVArray[4])
    objetoPlano["textoTotReguPECO"] = formatearNumeroDOC(TotalArray[4])
    
    if (objeto["estadoOnlyAMAZONIA"]) {
        objetoPlano["textoAVNoReg"] = formatearNumeroDOC(AVArray[0] - AVArray[5])
        objetoPlano["textoIPMNoReg"] = formatearNumeroDOC(IPMArray[0] - IPMArray[5])
        objetoPlano["textoIGVNoReg"] = formatearNumeroDOC(IGVArray[0] - IGVArray[5])
        objetoPlano["textoTotNoReg"] = formatearNumeroDOC(TotalArray[0] - TotalArray[5])
    }else{
        objetoPlano["textoAVNoReg"] = formatearNumeroDOC(AVArray[0] - AVArray[5] - AVArray[4])
        objetoPlano["textoIPMNoReg"] = formatearNumeroDOC(IPMArray[0] - IPMArray[5]- IPMArray[4])
        objetoPlano["textoIGVNoReg"] = formatearNumeroDOC(IGVArray[0] - IGVArray[5] - IGVArray[4])
        objetoPlano["textoTotNoReg"] = formatearNumeroDOC(TotalArray[0] - TotalArray[5] - TotalArray[4])
    }




    objetoPlano["estadoPECOyAMAZONIAProc"] = objeto["estadoPECOyAMAZONIA"] && AVArray[4] > 0
    objetoPlano["estadoPECOyAMAZONIAnoProcPECO"] = objeto["estadoPECOyAMAZONIA"] && AVArray[4] == 0
    
    objetoPlano["estadoJuridiccionOtros"] = !objetoPlano["estadoJuridiccionLoreto"]

    objetoPlano["veriFaltanGuias"] = (objeto["guiasData"].length == 0)
    objetoPlano["veriFaltaDeudaTributaria"] = !(TotalArray[0] != -1 && TotalArray[5] != -1)


    if (objetoPlano["fromDam-cantBultosNumero"] != objetoPlano["fromDam-bultosReconocidos"]) {
        objetoPlano["veriBultosRevisados"] = true
        objetoPlano["fromDam-cantMODI"] = `${objetoPlano["fromDam-cantBultosNumero"]}(*)`
    }else{
        objetoPlano["fromDam-cantMODI"] = `${objetoPlano["fromDam-cantBultosNumero"]}`
        objetoPlano["veriBultosRevisados"] = false
    }
    objetoPlano["veriFaltanDatosMercaReconocido"] = (
        objetoPlano["fromDam-cantBultosNumero"]==""|| 
        objetoPlano["fromDam-bultosReconocidos"]=="" || 
        objetoPlano["fromDam-partidaNabandina"]=="" || 
        objetoPlano["fromDam-partidaNandina"]==""
    )

    //TIPADO FACTURA "estadopagoFacturaTipoVencimiento" - "estadoPagoFacturaTipoPlazo" - "estadoPago"
    objetoPlano["estadoPago"] = false
    objetoPlano["estadopagoFacturaTipoVencimiento"] = false
    objetoPlano["estadoPagoFacturaTipoPlazo"] = false
    if (objetoPlano["estadoPagadoFactura"]) {
        objetoPlano["estadoPago"] = true
        objetoPlano["estadopagoFacturaTipoVencimiento"] = false
        objetoPlano["estadoPagoFacturaTipoPlazo"] = false
    }else{
        objetoPlano["estadoPago"] = false
        if (objetoPlano["estadoCompleTipoFactura"] == "VENCIMIENTO") {
            objetoPlano["estadoPagoFacturaTipoPlazo"] = false
            objetoPlano["estadopagoFacturaTipoVencimiento"] = true
        }else if(objetoPlano["estadoCompleTipoFactura"] == "PLAZO"){
            objetoPlano["estadoPagoFacturaTipoPlazo"] = true
            objetoPlano["estadopagoFacturaTipoVencimiento"] = false

            if (objetoPlano["estadoCompleTipoPlazo"] == "FECHAFACTURA") {
                if (objetoPlano["datosFactura-fechaFac"].includes("PENDIENTE") || objetoPlano["datosFactura-fechaFac"] == "") {
                    objetoPlano["textoFechaTipadoRRR"] = "PENDIENTE-ESTABLECER-FECHA-FACTURA"
                    objetoPlano["textoFechaTipado"] = ""
                }else{
                    objetoPlano["textoFechaTipado"] = `fecha de la factura; teniendo que la fecha de la factura digitalizada por el importador y remitida a esta administración es del ${objetoPlano["datosFactura-fechaFac"]}`
                    objetoPlano["textoFechaTipadoRRR"] = ""
                }
            }else if (objeto["estadoCompleTipoPlazo"] == "FECHALLEGADA"){
                if (objetoPlano["datosFactura-fechaLlegada"].includes("PENDIENTE") || objetoPlano["datosFactura-fechaLlegada"] == "") {
                    objetoPlano["textoFechaTipadoRRR"] = "PENDIENTE-ESTABLECER-FECHA-LLEGADA"
                    objetoPlano["textoFechaTipado"] = ""
                }else{
                    objetoPlano["textoFechaTipado"] = `fecha de llegada, tal como se observa en la factura digitalizada por el importador y remitida a esta administración; teniendo que la fecha de llegada es del ${objetoPlano["datosFactura-fechaLlegada"]}`
                    objetoPlano["textoFechaTipadoRRR"] = ""
                }
            }else if (objeto["estadoCompleTipoPlazo"] == "FECHABL"){
                if (objetoPlano["datosFactura-fechaBL"].includes("PENDIENTE") || objetoPlano["datosFactura-fechaBL"] == "") {
                    objetoPlano["textoFechaTipadoRRR"] = "PENDIENTE-ESTABLECER-FECHA-BL"
                    objetoPlano["textoFechaTipado"] = ""
                }else{
                    objetoPlano["textoFechaTipado"] = `fecha del Bill of Lading, tal como se observa en la factura digitalizada por el importador y remitida a esta administración; teniendo que la fecha que se estipúla en el Bill of Lading digitalizado por el importador y remitida a esta administración es del ${objetoPlano["datosFactura-fechaLlegada"]}`
                    objetoPlano["textoFechaTipadoRRR"] = ""
                }
            }
        }
    }
    objetoPlano["estadoPagadoFacturaInvert"] = !objetoPlano["estadoPagadoFactura"]

    if (objetoPlano.estadoPECOyAMAZONIA) {
        objetoPlano["textoVisto"] = "en el marco del Decreto Supremo n.º 015-94-EF y de la Ley n.º 27037 Ley de Promoción de la Inversión en la Amazonía y normas conexas"
        objetoPlano["textoParrafo01"] = "en los procedimientos DESPA-PE.01.13 y/o DESPA-PE.01.15, aprobados con Resolución de Superintendencia n.º 000248-2025/SUNAT y n.º 000247-2025/SUNAT respectivamente, con el objeto de acogerse a los procedimientos de devolución establecidos por el Decreto Supremo n.º 015-94-EF y Decreto Supremo n.º 103-99-EF y demás normas legales conexas"
        objetoPlano["textoSolReg01"] = "previsto por el artículo 1º del Decreto Supremo n.º 015-94-EF y artículo 18º del Decreto Supremo n.º 103-99-EF"
        objetoPlano["textoSolReg02"] = "solicita la regularización de la DAM referida, de acuerdo a los procedimientos DESPA-PE.01.13 y DESPA-PE.01.15 respectivamente"
        objetoPlano["textoProceReco"] = "lo establecido en el numeral 6 del literal C2 de la Sección VII del Procedimiento Específico DESPA-PE.01.13 (v3), y numeral 7 del literal C2 de la Sección VII del Procedimiento Específico DESPA-PE.01.15 (v3)"
        objetoPlano["textoRecoFis"] = "marco del Convenio de Cooperación Aduanera Peruano Colombiano, Decreto Supremo n.º 015 -94 -EF, Resolución Ministerial n.º 107 -94 -EF/10,"
    }else if(objetoPlano.estadoOnlyAMAZONIA){
        objetoPlano["textoVisto"] = "en el marco de la Ley n.º 27037 Ley de Promoción de la Inversión en la Amazonía y normas conexas"
        objetoPlano["textoParrafo01"] = "en el procedimiento DESPA-PE.01.15, aprobado con Resolución de Superintendencia n.º000247-2025/SUNAT, con el objeto de acogerse al procedimiento de devolución por el Decreto Supremo n.º103-99-EF y demás normas legales conexas"
        objetoPlano["textoSolReg01"] = "previsto por el artículo 18° del Decreto Supremo n.º103-99-EF"
        objetoPlano["textoSolReg02"] = "solicita regulación de la DAM referida, de acuerdo con el procedimiento DESPA-PE.01.15"
        objetoPlano["textoProceReco"] = "lo establecido en el numeral 7 del literal C2 de la Sección VII del Procedimiento Específico DESPA-PE.01.15 (v3)"
        objetoPlano["textoRecoFis"] = "marco de la"
    }else{
        objetoPlano["textoRecoFis"] = "PENDIENTE-PECO-REC-FIS"
        objetoPlano["textoVisto"] = "PENDIENTE-ASIGNACION-BENEFICIO"
        objetoPlano["textoParrafo01"] = "PENDIENTE-ASIGNACION-BENEFICIO"
        objetoPlano["textoSolReg01"] = "PENDIENTE-PLAZOS"
        objetoPlano["textoSolReg02"] = "PENDIENTE-PROCEDIMIENTO"
        objetoPlano["textoProceReco"] = "PENDIENTE PROCEDIMIENTO-RECONOCIMIENTO"
    }





    console.log(objetoPlano)
    return objetoPlano

}

function obtenerRedondeoInicales(sumaRedondeada, primerBruto, segundoBruto, terceroBruto) {
    let primerRedondo = Math.round(primerBruto)
    let segundoRedondo = Math.round(segundoBruto)
    let terceroRedondo = Math.round(terceroBruto)

    let diferenciaTempo = sumaRedondeada - (primerRedondo + segundoRedondo + terceroRedondo)
    if (diferenciaTempo == 0) {
        return [primerRedondo, segundoRedondo, terceroRedondo]
    } else {

        let difPrimer = 0
        let difSegun = 0
        let difTerc = 0
        if (diferenciaTempo > 0) {
            let mayorTempo = Math.max(primerBruto, segundoBruto, terceroBruto)
            if (mayorTempo == primerBruto) {
                difPrimer = diferenciaTempo
            } else if (mayorTempo == segundoBruto) {
                difSegun = diferenciaTempo
            } else {
                difTerc = diferenciaTempo
            }
            return [primerRedondo + difPrimer, segundoRedondo + difSegun, terceroRedondo + difTerc]
        } else {
            let mayorTempo = Math.min(primerBruto, segundoBruto, terceroBruto)
            if (mayorTempo == primerBruto) {
                difPrimer = diferenciaTempo
            } else if (mayorTempo == segundoBruto) {
                difSegun = diferenciaTempo
            } else {
                difTerc = diferenciaTempo
            }
            return [primerRedondo + difPrimer, segundoRedondo + difSegun, terceroRedondo + difTerc]
        }
    }

}

function formatearNumeroDOC(numeroBig) {
    let numero = numeroBig;
    // let numero = 7896536452;
    let resultado = numero.toLocaleString('es-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).replace(/,/g, ' ');

    return resultado
}


export {
    numeroAPalabras,
    nomAduana,
    formatearResumen,
    fechaToFormatoInput,
    inputToFormatoFecha,
    reconfiguracionObjeto,
    formatearNumeroDOC,
    obtenerMercaReconocida
}