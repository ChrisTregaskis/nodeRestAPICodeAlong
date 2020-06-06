const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product')

router.get('/', (req, res, next) => {
    Order
        .find()
        .select('product quantity _id')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:5050/orders/' + doc._id
                        }
                    }
                })

            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {

            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }

            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity
            });

            return order.save()
        })
        .then(result => {
            res.status(201).json({
                message: 'Order successfully placed',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:5050/orders/' + result._id
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
        .exec()
        .then(order => {
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:5050/orders/'
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order deleted',
        orderId: req.params.orderId
    });
});

module.exports = router;