const menu = require('../data/menu');

const findItemById = (id) => {
    for (const category of menu) {
        const item = category.items.find(it => it.id == id);
        if (item) return { item, categoryName: category.name };
    }
    return null;
};

const updateStock = (orderedItems) => {
    for (const orderedItem of orderedItems) {
        const { item } = findItemById(orderedItem.id);
        if (item) {
            item.quantity -= orderedItem.quantity;
        }
    }
};

const getMenu = () => menu;

module.exports = {
    findItemById,
    updateStock,
    getMenu
};
