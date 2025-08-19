// controllers/orderController.js
const { Op } = require('sequelize');
// controllers/orderController.js
const { sequelize, Order, Product, OrderItem, User, Address } = require('../models/tableRelations');

const PRICE_PER_UNIT = parseFloat(process.env.PRICE_PER_UNIT || '1.50');

// Crear pedido (cliente)
// Crear pedido (cliente) con líneas N:M
exports.createOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      deliveryTime,
      id_address,
      deliveryDate,
      instructions,
      paymentMethod,
      items               // [{ id_product, quantity }]
    } = req.body;

    const id_user = req.user?.id;

    if (!id_user) return res.status(401).json({ message: 'No autenticado' });
    if (!deliveryTime) return res.status(400).json({ message: 'deliveryTime es obligatorio' });
    if (!id_address) return res.status(400).json({ message: 'id_address es obligatorio' });

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'items debe ser un arreglo con al menos un producto' });
    }
    for (const it of items) {
      if (!it?.id_product || !it?.quantity || Number(it.quantity) <= 0) {
        return res.status(400).json({ message: 'Cada item requiere id_product y quantity > 0' });
      }
    }
    if (paymentMethod && !['efectivo', 'transferencia'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'paymentMethod inválido' });
    }

    let deliveryDateOnly = deliveryDate;
    if (!deliveryDateOnly) {
      const dt = new Date(deliveryTime);
      if (isNaN(dt.getTime())) return res.status(400).json({ message: 'deliveryTime inválido' });
      deliveryDateOnly = dt.toISOString().slice(0, 10);
    }

    const order = await Order.create({
      id_user,
      id_address,
      deliveryTime,
      deliveryDate: deliveryDateOnly,
      instructions: instructions || null,
      paymentMethod: paymentMethod || 'efectivo',
      status: 'pendiente',
      quantity: 0,      // se recalcula
      totalPrice: 0     // se recalcula
    }, { transaction: t });

    let totalQty = 0;
    let totalAmount = 0;

    for (const it of items) {
      const product = await Product.findByPk(it.id_product, { transaction: t });
      if (!product || !product.active) throw new Error(`Producto inválido o inactivo: ${it.id_product}`);

      const qty = Number(it.quantity);
      const unitPrice = Number(product.price);
      const subtotal = Number((qty * unitPrice).toFixed(2));

      await OrderItem.create({
        id_order: order.id_order,
        id_product: product.id_product,
        quantity: qty,
        unitPrice: unitPrice.toFixed(2),
        subtotal: subtotal.toFixed(2)
      }, { transaction: t });

      totalQty += qty;
      totalAmount += subtotal;
    }

    await order.update({
      quantity: totalQty,
      totalPrice: totalAmount.toFixed(2)
    }, { transaction: t });

    await t.commit();

    const fullOrder = await Order.findByPk(order.id_order, {
      include: [
        { model: Product, as: 'items', attributes: ['id_product', 'name', 'price', 'image_url'],
          through: { attributes: ['quantity', 'unitPrice', 'subtotal'] } },
        { model: Address, as: 'address', attributes: ['label','mainStreet','secondaryStreet','reference','sector'] }
      ]
    });

    return res.status(201).json({ message: 'Pedido registrado', order: fullOrder });
  } catch (error) {
    await t.rollback();
    console.error('createOrder error:', error);
    return res.status(500).json({ message: 'Error al crear el pedido', error: error?.message || error });
  }
};



// Ver todos los pedidos (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, attributes: ['fullName', 'phone'], as: 'user', required: false },
        { model: Address, attributes: ['label','mainStreet','secondaryStreet','reference','sector'], as: 'address', required: false },
        { model: Product, as: 'items', attributes: ['id_product','name','price','image_url'],
          through: { attributes: ['quantity','unitPrice','subtotal'] } }
      ],
      order: [['deliveryTime', 'DESC']]
    });
    return res.json(orders);
  } catch (error) {
    console.error('getAllOrders error:', error);
    return res.status(500).json({ message: 'Error al obtener pedidos', error: error?.message || error });
  }
};


// Obtener un pedido por ID (admin ve todos; cliente solo los suyos)
exports.getOrderById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const order = await Order.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['fullName', 'phone'], required: false },
        { model: Address, as: 'address', attributes: ['label','mainStreet','secondaryStreet','reference','sector'], required: false },
        { model: Product, as: 'items', attributes: ['id_product','name','price','image_url'],
          through: { attributes: ['quantity','unitPrice','subtotal'] } }
      ]
    });

    if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });

    const isAdmin = req.user?.role === 'admin';
    if (!isAdmin && order.id_user !== req.user?.id) {
      return res.status(403).json({ message: 'No tienes permiso para ver este pedido' });
    }

    return res.json(order);
  } catch (error) {
    console.error('getOrderById error:', error);
    return res.status(500).json({ message: 'Error al obtener pedido', error: error?.message || error });
  }
};


// Ver pedidos del cliente autenticado (cliente)
// Ver pedidos del cliente autenticado (cliente) CON PAGINACIÓN
exports.getOrdersByClient = async (req, res) => {
  try {
    const id_user = req.user?.id;
    if (!id_user) return res.status(401).json({ message: 'No autenticado' });

    // Parámetros de paginación
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'DESC';
    const offset = (page - 1) * limit;

    // Contar total
    const totalCount = await Order.count({ where: { id_user } });
    
    // Obtener pedidos paginados
    const orders = await Order.findAll({
      where: { id_user },
      include: [
        { model: Address, as: 'address', attributes: ['label','mainStreet','secondaryStreet','reference','sector'] },
        { model: Product, as: 'items', attributes: ['id_product','name','price','image_url'],
          through: { attributes: ['quantity','unitPrice','subtotal'] } }
      ],
      order: [[sortBy, sortOrder]],
      limit: limit,
      offset: offset
    });

    // Calcular metadatos
    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return res.json({
      orders: orders,
      totalCount: totalCount,
      currentPage: page,
      totalPages: totalPages,
      hasNext: hasNext,
      hasPrev: hasPrev
    });
  } catch (error) {
    console.error('getOrdersByClient error:', error);
    return res.status(500).json({ message: 'Error al obtener pedidos del cliente', error: error?.message || error });
  }
};


// Actualizar estado del pedido (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params; // puede ser id_order
    const { status } = req.body;

    const allowed = [
      'pendiente',
      'confirmado',
      'preparado',
      'en_camino',
      'entregado',
      'cancelado_cliente',
      'cancelado_admin',
      'fallido_no_encontrado'
    ];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });

    order.status = status;
    await order.save();

    return res.json({ message: 'Estado actualizado', order });
  } catch (error) {
    console.error('updateOrderStatus error:', error);
    return res.status(500).json({ message: 'Error al actualizar estado', error: error?.message || error });
  }
};

// Eliminar pedido (admin)
exports.deleteOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, { transaction: t });
    if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });

    await OrderItem.destroy({ where: { id_order: id }, transaction: t }); // si no usas CASCADE
    await order.destroy({ transaction: t });

    await t.commit();
    return res.json({ message: 'Pedido eliminado' });
  } catch (error) {
    await t.rollback();
    console.error('deleteOrder error:', error);
    return res.status(500).json({ message: 'Error al eliminar pedido', error: error?.message || error });
  }
};

