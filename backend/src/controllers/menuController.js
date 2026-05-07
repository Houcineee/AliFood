const menuService = require('../services/menuService');

const getMenu = (req, res) => {
    try {
        const menu = menuService.getMenu();
        res.json(menu);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMenu
};
