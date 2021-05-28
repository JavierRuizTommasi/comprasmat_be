const Offers = require('./offers.dao')
const Tenders = require('../tenders/tenders.dao')

exports.createOffers = (req, res, next) => {
    const newOffer = req.body
    console.log(newOffer)
    
      Offers.create(newOffer, (err, offers) => {
        if (err && err.code === 11000) return res.send({ message: 'Offer already exists' })
        if (err) res.json({errr: err})

        Tenders.assignOffer(
            { _id: offers.licitacion_id } ,
            { $push: { offer: offers._id } },
            (err, tender) => {
                if (err) res.json({ error: err})
            })

        res.json({ message: 'Offer created successfully'})
    })
} 

exports.getOffers = (req, res, next) => {
    // console.log('Offers')
    Offers.get({}, (err, offers) => {
        return new Promise((resolve) => { 
            let messaje = ''
            if (err) {
                message = 'Server error!'
            } else {
                // res.json({Users: users})
                message = {Offers: offers}
            }
            resolve(res.send(message))
        })
    })
}

exports.getOffer = (req, res, next) => {
    Offers.findOne({ _id: req.params.id }, (err, offer) => {
        if (err) res.json({ error: err })
        res.json({Offer: offer})
    })
}
  
exports.udpateOffers = (req, res, next) => {
    const offer = req.body
    
    Offers.update({ _id: req.params.id }, offer, async (err, offer) => {
        if (err) res.json({ error: err})

        if (offer.licitacion_id) {
            // console.log(offer.licitacion, offer._id)

            Tenders.assignOffer(
                { _id: offer.licitacion_id } ,
                { $addToSet: { offer: offer._id } },
                (err, tender) => {
                    if (err) res.json({ error: err})
                }
            )
        }

        res.json({message: 'Offer updated successfully'})        
    })

}

exports.udpateOfferStates = (req, res, next) => {
    const offer_id = req.params.id
    Offers.findOne({ _id: offer_id }, (err, offer) => {
        if (err) res.json({ error: err })

        if (offer.licitacion_id) {
            Tenders.assignOffer(
                { _id: offer.licitacion_id } ,
                { $set: { estado: 2 } },
                async (err, tender) => {
                    console.log('Adjudicada', tender.licitacion)
                }
            )

            Offers.get({ licitacion_id: offer.licitacion_id }, async (err, offers) => {
                if (err) res.json({ error: err})

                offers.forEach(elem => { 

                    if (elem._id != offer_id) {
                        Offers.update({ _id: elem._id }, { estado: 2 }, async (err, offer2) => {
                            if (err) res.json({ error: err})
                            console.log(offer2._id, offer2.estado)
                        })
                    }
                })

                res.json({ message: 'Offers rejected'})
            })
        }
    })
}

exports.deleteOffers = async (req, res, next) => {
    const offer = await Offers.delete({ _id: req.params.id }, (err, offer) => {
        if (err) res.json({ error: err})

        if (offer.licitacion) {
            // console.log(offer.licitacion, offer._id)

            Tenders.assignOffer(
                { _id: offer.licitacion_id } ,
                { $pull: { offer: offer._id } },
                (err, tender) => {
                    if (err) res.json({ error: err})
                }
            )
        }

        res.json({message: 'Offer deleted successfully'})
    })
}

exports.findMyOffers = (req, res, next) => {
    // console.log('Offers')
    Offers.get({ usuario: req.params.usuario }, (err, offers) => {
        if (err) res.json({ error: err})
        // res.json({Users: users})
        res.send({Offers: offers})
    })
}

exports.removeUpload = (req, res, next) => {
    // console.log(req.params)
    const upload = req.body
    console.log(upload)

    Offers.assignUpload(
        { _id: req.params.id },
        { $pull: { upload: upload._id } },
        (err, upload) => {
            if (err) res.json({ error: err})
        }
    )
    res.json({ upload: 'Upload removed successfully'}) 
}

