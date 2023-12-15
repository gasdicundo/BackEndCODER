const express = require('express');
const { createCart, getCartProducts, addProductToCart } = require('../services/cartsmanager');
const cartsRouter = express.Router();


cartsRouter.post('/', createCart);
cartsRouter.get('/:cid', getCartProducts);
cartsRouter.post('/:cid/product/:pid', addProductToCart);

module.exports = cartsRouter;
