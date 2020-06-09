const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Order = require('../models/order');
const Product = require('../models/product')

router.get('/', checkAuth, (req, res, next) => {
    Order
        .find()
        .select('product quantity _id')
        .populate('product', 'name')
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

router.post('/', checkAuth, (req, res, next) => {
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

router.get('/:orderId', checkAuth, (req, res, next) => {
    Order.findById(req.params.orderId)
        .populate('product', 'name price')
        .exec()
        .then(order => {

            if (!order) {
                return res.status(404).json({
                    message: 'Order not found'
                })
            }

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

router.delete('/:orderId', checkAuth, (req, res, next) => {
    Order.deleteOne({_id: req.params.orderId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:5050/orders/',
                    body: { productId: '_id', quantity: 'Number'}
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;