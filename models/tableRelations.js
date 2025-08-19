// models/tableRelations.js
const sequelize = require('../config/database');

const User = require('./userModel');
const Address = require('./addressModel');
const Order = require('./orderModel');
const Product = require('./productModel');
const OrderItem = require('./orderItemModel'); // <-- nuevo

// User ↔ Address (1:N)
User.hasMany(Address, { as: 'addresses', foreignKey: 'id_user' });
Address.belongsTo(User, { as: 'user', foreignKey: 'id_user' });

// User ↔ Order (1:N)
User.hasMany(Order, { as: 'orders', foreignKey: 'id_user' });
Order.belongsTo(User, { as: 'user', foreignKey: 'id_user' });

// Address ↔ Order (1:N)
Address.hasMany(Order, { as: 'orders', foreignKey: 'id_address' });
Order.belongsTo(Address, { as: 'address', foreignKey: 'id_address' });

// 🔹 Order ↔ Product (N:M) vía OrderItem
Order.belongsToMany(Product, {
  through: OrderItem,
  as: 'items',                   // order.items
  foreignKey: 'id_order',
  otherKey: 'id_product',
  onDelete: 'CASCADE'
});

Product.belongsToMany(Order, {
  through: OrderItem,
  as: 'orders',                  // product.orders
  foreignKey: 'id_product',
  otherKey: 'id_order',
  onDelete: 'RESTRICT'
});

// (Opcional) Accesos directos 1:N hacia OrderItem
Order.hasMany(OrderItem, { as: 'orderItems', foreignKey: 'id_order', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { as: 'order', foreignKey: 'id_order' });

Product.hasMany(OrderItem, { as: 'orderItems', foreignKey: 'id_product', onDelete: 'RESTRICT' });
OrderItem.belongsTo(Product, { as: 'product', foreignKey: 'id_product' });

module.exports = {
  sequelize,
  User,
  Address,
  Order,
  Product,
  OrderItem
};
