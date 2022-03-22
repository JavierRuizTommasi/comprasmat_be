const convert = require('xml-js')
const axios = require('axios')

formatNumber = function (value, decimalPlaces) {
        let decimals = decimalPlaces || 2;
        let convertedValue = parseFloat(value.replace('.', '').replace(',', '.'))
        return !isNaN(convertedValue) ? convertedValue.toFixed(decimals) : 'No cotiza'
}

exports.getDolar = async (req, res, next) => {
    try {
        const dataDolar = await axios.get("https://www.dolarsi.com/api/dolarSiInfo.xml")
        const json = convert.xml2json(dataDolar.data, {compact: true, spaces: 4});
        const data = JSON.parse(json);
        // console.log(data)

        const valores = {
            //fecha: this.util.getDateTime(),
            compra: formatNumber(data.cotiza.Capital_Federal.casa6.compra._text),
            venta: formatNumber(data.cotiza.Capital_Federal.casa6.venta._text)
        }

        res.json(valores)

    } catch(e) {
        const valores = {
            //fecha: this.util.getDateTime(),
            compra: 0,
            venta: 0
        }

        res.json(valores)

        //res.sendStatus(500)
        console.log(e)
    }
}

