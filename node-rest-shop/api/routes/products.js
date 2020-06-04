const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product')

router.get('/', (req, res, next) => {
    Product
        .find()
        .select('name price _id') // controlling what data you want to fetch
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
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
});

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(), // generates new object id
        name: req.body.name,
        price: req.body.price
    });

    product
        .save()
        .then(result => {
            res.status(201).json({
                message: 'handling POST requests to /products',
                createdProduct: product
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });

});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({
                    message: 'No valid entry found for provided id'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOperations = {};

    for (const ops of req.body) {
        updateOperations[ops.propName] = ops.value;
    }

    Product
        .update({_id: id}, { $set: updateOperations})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });

});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product
        .remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

module.exports = router;