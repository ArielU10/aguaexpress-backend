// controllers/productController.js
const { Op } = require('sequelize');
const Product = require('../models/productModel');

// --- helpers ---
const ALLOWED_TYPES = ['botellon', 'botella', 'dispenser'];
const isValidType = (t) => ALLOWED_TYPES.includes(t);

// Crear producto
// POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const {
      name, code, type,
      capacity_ml, is_returnable,
      price, stock, active,
      image_url
    } = req.body;

    if (!name || !type || price == null) {
      return res.status(400).json({ message: 'name, type y price son obligatorios' });
    }
    if (!isValidType(type)) {
      return res.status(400).json({ message: `type inválido. Permitidos: ${ALLOWED_TYPES.join(', ')}` });
    }
    if (price < 0) {
      return res.status(400).json({ message: 'price no puede ser negativo' });
    }
    if (stock != null && stock < 0) {
      return res.status(400).json({ message: 'stock no puede ser negativo' });
    }

    // code (SKU) opcional pero único si viene
    if (code) {
      const exists = await Product.findOne({ where: { code } });
      if (exists) return res.status(409).json({ message: 'code ya existe' });
    }

    const product = await Product.create({
      name,
      code: code || null,
      type,
      capacity_ml: capacity_ml ?? null,
      is_returnable: typeof is_returnable === 'boolean' ? is_returnable : true,
      price,
      stock: stock ?? null,
      active: typeof active === 'boolean' ? active : true,
      image_url: image_url || null
    });

    return res.status(201).json({ message: 'Producto creado', product });
  } catch (error) {
    console.error('createProduct error:', error);
    return res.status(500).json({ message: 'Error al crear producto', error: error?.message || error });
  }
};

// Listar productos (con filtros y paginación)
// GET /api/products?search=&type=&active=&minPrice=&maxPrice=&page=1&pageSize=20&orderBy=createdAt&orderDir=DESC
exports.getAllProducts = async (req, res) => {
  try {
    const {
      search,
      type,
      active,
      minPrice,
      maxPrice,
      page = 1,
      pageSize = 20,
      orderBy = 'createdAt',
      orderDir = 'DESC'
    } = req.query;

    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { code: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (type && isValidType(type)) {
      where.type = type;
    }
    if (active !== undefined) {
      if (active === 'true' || active === true) where.active = true;
      else if (active === 'false' || active === false) where.active = false;
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = Number(minPrice);
      if (maxPrice) where.price[Op.lte] = Number(maxPrice);
    }

    const limit = Math.max(1, Number(pageSize));
    const offset = (Math.max(1, Number(page)) - 1) * limit;

    const validOrderDir = String(orderDir).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { rows, count } = await Product.findAndCountAll({
      where,
      order: [[orderBy, validOrderDir]],
      limit,
      offset
    });

    return res.json({
      items: rows,
      total: count,
      page: Number(page),
      pageSize: limit,
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('getAllProducts error:', error);
    return res.status(500).json({ message: 'Error al obtener productos', error: error?.message || error });
  }
};

// Obtener producto por ID
// GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    return res.json(product);
  } catch (error) {
    console.error('getProductById error:', error);
    return res.status(500).json({ message: 'Error al obtener producto', error: error?.message || error });
  }
};

// Actualizar producto
// PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, code, type,
      capacity_ml, is_returnable,
      price, stock, active,
      image_url
    } = req.body;

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    if (type && !isValidType(type)) {
      return res.status(400).json({ message: `type inválido. Permitidos: ${ALLOWED_TYPES.join(', ')}` });
    }
    if (price != null && price < 0) {
      return res.status(400).json({ message: 'price no puede ser negativo' });
    }
    if (stock != null && stock < 0) {
      return res.status(400).json({ message: 'stock no puede ser negativo' });
    }

    if (code && code !== product.code) {
      const exists = await Product.findOne({ where: { code } });
      if (exists) return res.status(409).json({ message: 'code ya existe' });
    }

    await product.update({
      name: name ?? product.name,
      code: code ?? product.code,
      type: type ?? product.type,
      capacity_ml: capacity_ml ?? product.capacity_ml,
      is_returnable: typeof is_returnable === 'boolean' ? is_returnable : product.is_returnable,
      price: price ?? product.price,
      stock: stock ?? product.stock,
      active: typeof active === 'boolean' ? active : product.active,
      image_url: image_url ?? product.image_url
    });

    return res.json({ message: 'Producto actualizado', product });
  } catch (error) {
    console.error('updateProduct error:', error);
    return res.status(500).json({ message: 'Error al actualizar producto', error: error?.message || error });
  }
};

// Eliminar producto (soft opcional si prefieres desactivarlo)
// DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    await product.destroy();
    return res.json({ message: 'Producto eliminado' });
  } catch (error) {
    console.error('deleteProduct error:', error);
    return res.status(500).json({ message: 'Error al eliminar producto', error: error?.message || error });
  }
};

// Activar / Desactivar (útil si no quieres borrar)
// PATCH /api/products/:id/active
exports.toggleActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body; // true | false

    if (active == null) {
      return res.status(400).json({ message: 'active es requerido (true/false)' });
    }

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    product.active = !!active;
    await product.save();

    return res.json({ message: `Producto ${product.active ? 'activado' : 'desactivado'}`, product });
  } catch (error) {
    console.error('toggleActive error:', error);
    return res.status(500).json({ message: 'Error al actualizar estado', error: error?.message || error });
  }
};

// Actualizar stock rápidamente
// PATCH /api/products/:id/stock
exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock == null || Number(stock) < 0) {
      return res.status(400).json({ message: 'stock inválido' });
    }

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    product.stock = Number(stock);
    await product.save();

    return res.json({ message: 'Stock actualizado', product });
  } catch (error) {
    console.error('updateStock error:', error);
    return res.status(500).json({ message: 'Error al actualizar stock', error: error?.message || error });
  }
};
