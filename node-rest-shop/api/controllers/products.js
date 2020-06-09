const Product = require('../models/product');

exports.products_get_all = (req, res, next) => {
    Product
        .find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:5050/products/' + doc._id
                        }
                    }
                })
            }
            if (docs.length > 0) {
                res.status(200).json({response});
            } else {
                res.status(404).json({
                    message: 'no data in db'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
};