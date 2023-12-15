const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { productsRouter } = require('./router/products');
const { cartsRouter } = require('./router/carts');

const app = express();
const PORT = 8080;

app.use(express.json());


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
