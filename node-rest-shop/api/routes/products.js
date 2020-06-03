const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'handling GET requests to /products'
    });
});

router.post('/', (req, res, next) => {
    res.status(200).json({
        message: 'handling POST requests to /products'
    });
});

//get info about 1 single product
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    console.log(id);
    if (id === 'special') {
        res.status(200).json({
            message: 'You discovered the special ID',
            id: id
        });
    } else {
        res.status(200).json({
            message: 'You passed an ID'
        });
    }
});

//patch 1 single product
router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Updated product'
    });
});

//delete 1 single product
router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted product'
    });
});

module.exports = router;