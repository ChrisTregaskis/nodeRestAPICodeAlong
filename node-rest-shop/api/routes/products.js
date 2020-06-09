const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 *1024 * 5
    },
    fileFilter: fileFilter
});

const Product = require('../models/product');
const ProductsController = require('../controllers/products');

router.get('/', ProductsController.products_get_all);

router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(), // generates new object id
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    product
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Created product successfully',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:5050/products/' + result._id
                    }
                }
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
    Product
        .findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        description: 'Get all products',
                        url: 'http://localhost:5050/products/'
                    }
                });
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

router.patch('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId;
    const updateOperations = {};

    for (const ops of req.body) {
        updateOperations[ops.propName] = ops.value;
    }

    Product
        .updateOne({_id: id}, { $set: updateOperations})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:5050/products/' + id
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });

});

router.delete('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId;
    Product
        .deleteOne({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:5050/products',
                    body: { name: 'String', price: 'Number' }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

module.exports = router;