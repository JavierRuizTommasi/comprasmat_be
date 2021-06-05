const myProducts = require('./myproducts.dao')

exports.createMyProduct = (req, res, next) => {
    const newMyProduct = req.body
    console.log(newMyProducts)
    myProducts.create(newMyProduct, (err, myproduct) => {
        if (err && err.code === 11000) return res.send({ message: 'myProduct already exists' })
        if (err) res.json({errr: err})
        res.json({ message: 'myProduct created successfully'})
    })
} 

exports.insertMyProducts = async (req, res, next) => {
    const newMyProducts = req.body
    
    await myProducts.insert(newMyProducts, (err, myproduct) => {
        if (err) res.json({errr: err})
        res.json({ message: 'myProduct inserted successfully'})
    })
} 
exports.getMyProducts = async (req, res, next) => {
    // console.log('MyProducts')
    await myProducts.get({}, (err, myproducts) => {
        if (err) res.json({ error: err})
        // res.json({Users: users})
        res.send({myProducts: myproducts})
    })
}

exports.getMyProduct = (req, res, next) => {
    myProducts.findOne({ _id: req.params.id }, (err, myproduct) => {
        if (err) res.json({ error: err })
        res.json({myProduct: myproduct})
    })
}
  
exports.udpateMyProduct = (req, res, next) => {
    const myproduct = req.body

    myProducts.update({ _id: req.params.id }, myproduct, (err, myproduct) => {
        if (err) res.json({ error: err})
        res.json({message: 'myProduct updated successfully'})        
    })
}

exports.deleteMyProduct = (req, res, next) => {
    myProducts.delete({ _id: req.params.id }, (err, myproduct) => {
        if (err) res.json({ error: err})
        res.json({message: 'myProduct deleted successfully'})
    })
}

// exports.updateMyProduct = (req, res, next) => {
//     const myproduct = req
//     myProducts.update({ codigo: req.params.codigo }, req, (err, myproduct) => {
//         if (err) res.json({ error: err})
//         res.json({message: 'myProduct updated successfully'})        
//     })
// }

exports.findMyProducts = async (req, res, next) => {
    // console.log('MyProducts')
    await myProducts.get({ usuario: req.params.usuario }, (err, myproducts) => {
        if (err) res.json({ error: err})
        // res.json({Users: users})
        res.send({myProducts: myproducts})
    })
}

exports.deleteMyProductsGroup = async (req, res, next) => {
    const deleteMyProducts = req.body
    // console.log(deleteMyProducts)
    
    await myProducts.deleteMany(deleteMyProducts, (err, myproduct) => {
        if (err) res.json({ error: err})
        res.json({message: 'myProduct Selection deleted successfully'})
    })
}


