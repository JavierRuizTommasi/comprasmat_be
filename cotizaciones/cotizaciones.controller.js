const convert = require('xml-js')
const axios = require('axios')
const fetch = require('node-fetch')

formatNumber = function (value, decimalPlaces) {
        let decimals = decimalPlaces || 2;
        let convertedValue = parseFloat(value.replace('.', '').replace(',', '.'))
        return !isNaN(convertedValue) ? convertedValue.toFixed(decimals) : 'No cotiza'
}

exports.getDolar = async (req, res, next) => {
    try {
        const response = await fetch('https://dolarapi.com/v1/dolares/oficial');
        if (!response.ok) {
            throw new Error(`Error al obtener datos: ${response.statusText}`);
        }
        const data = await response.json();
        // La API devuelve un objeto con la cotización, incluyendo 'compra' y 'venta'
        console.log('Cotización Dólar Oficial (DolarApi.com):');
        console.log(`Fecha: ${data.fechaActualizacion}`);
        console.log(`Compra: ${data.compra}`);
        console.log(`Venta: ${data.venta}`);
        console.log(`Moneda: ${data.moneda}`);
        const valores = {
            //fecha: this.util.getDateTime(),
            compra: data.compra,
            venta: data.venta
        }
        res.json(valores);
    } catch (error) {
        console.error('Hubo un problema con la petición:', error);
        const valores = {
            //fecha: this.util.getDateTime(),
            compra: 0,
            venta: 0
        }
        res.json(valores);
    }
}

// exports.getDolar = async (req, res, next) => {
//     try {
//         const dataDolar = await axios.get("https://www.dolarsi.com/api/dolarSiInfo.xml")
//         const json = convert.xml2json(dataDolar.data, {compact: true, spaces: 4});
//         const data = JSON.parse(json);
//         // console.log(data)
//         const valores = {
//             //fecha: this.util.getDateTime(),
//             compra: formatNumber(data.cotiza.Capital_Federal.casa6.compra._text),
//             venta: formatNumber(data.cotiza.Capital_Federal.casa6.venta._text)
//         }

//         res.json(valores)

//     } catch(e) {
//         const valores = {
//             //fecha: this.util.getDateTime(),
//             compra: 0,
//             venta: 0
//         }
//         res.json(valores)
//         //res.sendStatus(500)
//         console.log(e)
//     }
// }

