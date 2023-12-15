const fs = require('fs').promises;
const path = require('path');

const productsFilePath = path.join("src/products.json");


const getProducts = async (req, res) => {
  try {
    const productsData = await fs.readFile(productsFilePath, 'utf-8');
    const products = JSON.parse(productsData);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos.' });
  }
};

const getProductById = async (req, res) => {
  const productId = req.params.pid;
  try {
    const productsData = await fs.readFile(productsFilePath, 'utf-8');
    const products = JSON.parse(productsData);
    const product = products.find(p => p.id.toString() === productId.toString());

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto.' });
  }
};

const createProduct = async (req, res) => {
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
};

const updateProduct = async (req, res) => {
  const productId = req.params.pid;
  const updatedFields = req.body;

  try {
    const productsData = await fs.readFile(productsFilePath, 'utf-8');
    let products = JSON.parse(productsData);

    const productIndex = products.findIndex(p => p.id.toString() === productId.toString());

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    products[productIndex] = { ...products[productIndex], ...updatedFields };

    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));

    res.json(products[productIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto.' });
  }
};

const deleteProduct = async (req, res) => {
  const productId = req.params.pid;

  try {
    const productsData = await fs.readFile(productsFilePath, 'utf-8');
    let products = JSON.parse(productsData);

    products = products.filter(p => p.id.toString() !== productId.toString());

    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto.' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
