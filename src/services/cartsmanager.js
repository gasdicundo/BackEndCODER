const fs = require('fs').promises;
const path = require('path');

const cartsFilePath = path.join("src/carts.json");


const createCart = async (req, res) => {
  try {
    const newCart = {
      id: Math.random().toString(36).substr(2, 9),
      products: [],
    };

    const cartsData = await fs.readFile(cartsFilePath, 'utf-8');
    const carts = JSON.parse(cartsData);

    carts.push(newCart);

    await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));

    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el carrito.' });
  }
};

const getCartProducts = async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cartsData = await fs.readFile(cartsFilePath, 'utf-8');
    const carts = JSON.parse(cartsData);

    const cart = carts.find(c => c.id.toString() === cartId.toString());

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado.' });
    }

    res.json(cart.products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos del carrito.' });
  }
};

const addProductToCart = async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  try {
    const cartsData = await fs.readFile(cartsFilePath, 'utf-8');
    let carts = JSON.parse(cartsData);

    const cartIndex = carts.findIndex(c => c.id.toString() === cartId.toString());

    if (cartIndex === -1) {
      return res.status(404).json({ error: 'Carrito no encontrado.' });
    }

    const productsData = await fs.readFile(productsFilePath, 'utf-8');
    const products = JSON.parse(productsData);
    const product = products.find(p => p.id.toString() === productId.toString());

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    const existingProductIndex = carts[cartIndex].products.findIndex(p => p.id === productId);

    if (existingProductIndex !== -1) {
      carts[cartIndex].products[existingProductIndex].quantity += 1;
    } else {
      carts[cartIndex].products.push({ id: productId, quantity: 1 });
    }

    await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));

    res.json(carts[cartIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto al carrito.' });
  }
};

module.exports = {
  createCart,
  getCartProducts,
  addProductToCart,
};
