const Products = require('./products.dao')

exports.createProduct = (req, res, next) => {
    const newProduct = req.body

    Products.create(newProduct, (err, product) => {
        if (err && err.code === 11000) return res.send({ message: 'Product already exists' })
        if (err) res.json({errr: err})
        res.json({ message: 'Product created successfully'})
    })
} 

exports.getProducts = async (req, res, next) => {
    // console.log('Products')
    await Products.get({}, (err, products) => {
        if (err) res.json({ error: err})
        // res.json({Users: users})
        res.send({Products: products})
    })
}

exports.getProduct = (req, res, next) => {
    Products.findOne({ _id: req.params.id }, (err, product) => {
        if (err) res.json({ error: err })
        res.json({Product: product})
    })
}
  
exports.udpateProduct = (req, res, next) => {
    const product = req.body
    // console.log(product)

    Products.updateOne({ _id: req.params.id }, product, (err, product) => {
        if (err) res.json({ error: err})
        res.json({message: 'Product updated successfully'})        
    })
}

exports.deleteProduct = (req, res, next) => {
    Products.delete({ _id: req.params.id }, (err, product) => {
        if (err) res.json({ error: err})
        res.json({message: 'Product deleted successfully'})
    })
}
