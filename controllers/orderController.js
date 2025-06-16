const Order = require('../models/Order');
const User = require('../models/User');

// Crear pedido (cliente)
exports.createOrder = async (req, res) => {
  try {
    const { quantity, deliveryTime } = req.body;
    const userId = req.user.id;

    if (!quantity || !deliveryTime) {
      return res.status(400).json({ message: 'Cantidad y hora de entrega son obligatorias' });
    }

    const totalPrice = quantity * 1.50; // Precio por botellón (puedes ajustarlo)

    const newOrder = await Order.create({
      quantity,
      deliveryTime,
      totalPrice,
      userId
    });

    res.status(201).json({ message: 'Pedido registrado', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el pedido', error });
  }
};

// Ver todos los pedidos (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: { model: User, attributes: ['fullName', 'phone'] }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pedidos', error });
  }
};

// Ver pedidos por cliente (cliente)
exports.getOrdersByClient = async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await Order.findAll({
      where: { userId: id },
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pedidos del cliente', error });
  }
};

// Actualizar estado del pedido (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });

    order.status = status;
    await order.save();

    res.json({ message: 'Estado actualizado', order });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar estado', error });
  }
};

// Eliminar pedido (admin)
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });

    await order.destroy();
    res.json({ message: 'Pedido eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar pedido', error });
  }
};
