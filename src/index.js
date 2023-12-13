const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 8080;

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

// Rutas para productos
const productsRouter = express.Router();

const productsFilePath = path.join(__dirname, 'src', 'productos.json');

productsRouter.get('/', async (req, res) => {
  try {
    const productsData = await fs.readFile(productsFilePath, 'utf-8');
    const products = JSON.parse(productsData);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos.' });
  }
});

productsRouter.get('/:pid', async (req, res) => {
  const productId = req.params.pid;
  try {
    const productsData = await fs.readFile(productsFilePath, 'utf-8');
    const products = JSON.parse(productsData);
    const product = products.find(p => p.id === productId);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto.' });
  }
});

productsRouter.post('/', async (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;
  const newProduct = {
    id: Math.random().toString(36).substr(2, 9),
    title,
    description,
    code,
    price,
    status: true,
    stock,
    category,
    thumbnails,
  };

  try {
    const productsData = await fs.readFile(productsFilePath, 'utf-8');
    const products = JSON.parse(productsData);

    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    products.push(newProduct);

    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto.' });
  }
});

productsRouter.put('/:pid', async (req, res) => {
  const productId = req.params.pid;
  const updatedFields = req.body;

  try {
    const productsData = await fs.readFile(productsFilePath, 'utf-8');
    let products = JSON.parse(productsData);

    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    products[productIndex] = { ...products[productIndex], ...updatedFields };

    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));

    res.json(products[productIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto.' });
  }
});

productsRouter.delete('/:pid', async (req, res) => {
  const productId = req.params.pid;

  try {
    const productsData = await fs.readFile(productsFilePath, 'utf-8');
    let products = JSON.parse(productsData);

    products = products.filter(p => p.id !== productId);

    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto.' });
  }
});

// Rutas para carritos
const cartsRouter = express.Router();

// Ajusta la ruta para carritos.json si está dentro de src
const cartsFilePath = path.join(__dirname, 'src', 'carritos.json');

cartsRouter.post('/', async (req, res) => {
  const newCart = {
    id: Math.random().toString(36).substr(2, 9),
    products: [],
  };

  try {
    const cartsData = await fs.readFile(cartsFilePath, 'utf-8');
    const carts = JSON.parse(cartsData);

    carts.push(newCart);

    await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));

    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el carrito.' });
  }
});

cartsRouter.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cartsData = await fs.readFile(cartsFilePath, 'utf-8');
    const carts = JSON.parse(cartsData);

    const cart = carts.find(c => c.id === cartId);

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado.' });
    }

    res.json(cart.products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos del carrito.' });
  }
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  try {
    const cartsData = await fs.readFile(cartsFilePath, 'utf-8');
    let carts = JSON.parse(cartsData);

    const cartIndex = carts.findIndex(c => c.id === cartId);

    if (cartIndex === -1) {
      return res.status(404).json({ error: 'Carrito no encontrado.' });
    }

    const productsData = await fs.readFile(productsFilePath, 'utf-8');
    const products = JSON.parse(productsData);
    const product = products.find(p => p.id === productId);

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
});

// Montar los routers en las rutas especificadas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});










