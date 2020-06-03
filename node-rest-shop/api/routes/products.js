const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'handling GET requests to /products'
    })
})

router.post('/', (req, res, next) => {
    res.status(200).json({
        message: 'handling POST requests to /products'
    })
})

module.exports = router;