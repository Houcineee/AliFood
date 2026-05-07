const orderService = require('../services/orderService');

const getOrders = (req, res) => {
    const orders = orderService.getAllOrders();
    res.json(orders);
};

const getOrderById = (req, res) => {
    const order = orderService.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
};

const createOrder = (req, res) => {
    const { items } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Invalid items array" });
    }

    try {
        const newOrder = orderService.createOrder(items);
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ message: "Status is required" });

    const updatedOrder = orderService.updateOrderStatus(id, status);
    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

    res.json(updatedOrder);
};

module.exports = {
    getOrders,
    getOrderById,
    createOrder,
    updateStatus
};
