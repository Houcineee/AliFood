const { v4: uuidv4 } = require('uuid');
const orders = require('../data/orders');
const menuService = require('./menuService');

const getAllOrders = () => orders;

const getOrderById = (id) => orders.find(o => o.id == id);

const createOrder = (items) => {
    const orderedItems = [];

    // 1. Validation
    for (const item of items) {
        const found = menuService.findItemById(item.id);
        if (!found) throw new Error(`Item ${item.id} does not exist`);
        
        if (found.item.quantity < item.quantity) {
            throw new Error(`Insufficient stock for ${found.item.name}`);
        }

        orderedItems.push({
            ...found.item,
            categoryName: found.categoryName,
            quantity: item.quantity
        });
    }

    // 2. Deduct Stock
    menuService.updateStock(orderedItems);

    // 3. Save Order
    const newOrder = {
        id: uuidv4(),
        status: "pending",
        createdAt: new Date().toISOString(),
        items: orderedItems
    };

    orders.push(newOrder);
    return newOrder;
};

const updateOrderStatus = (id, status) => {
    const order = getOrderById(id);
    if (!order) return null;

    order.status = status;
    if (status === "ready") {
        order.readyAt = new Date().toISOString();
    }
    return order;
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrderStatus
};
