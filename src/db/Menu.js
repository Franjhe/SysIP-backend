import sequelize from '../config/database.js';

// Se usa para buscar en la vista seVmenu
const MenuPrincipal = sequelize.define('seVmenu', {}, { tableName: 'seVmenu' });

// Realiza la busqueda en la tabla pasandole los campos.
const getAllMainMenu = async (menuData) => {
  try {
    const menuPrincipalQuery = await MenuPrincipal.findAll({
      where: menuData,
      attributes: ['cmenuprincipal', 'cmenu', 'csubmenu', 'xmenuprincipal', 'xicono', 'xrutaprincipal', 
                   'xmenu', 'xrutamenu', 'xsubmenu', 'xrutasubmenu'],
    });
    const menuPrincipal = menuPrincipalQuery.map((item) => item.get({ plain: true }));
    return menuPrincipal;
  } catch (error) {
    return { error: error.message };
  }
};

export default {
    getAllMainMenu
};