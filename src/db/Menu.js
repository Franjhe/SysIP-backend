import sequelize from '../config/database.js';

// Se usa para buscar en la vista seVmenu
const MenuPrincipal = sequelize.define('seVmenu', {}, { tableName: 'seVmenu' });

// Realiza la busqueda en la tabla pasandole los campos.
const getAllMainMenu = async (menuData) => {
  console.log(menuData)
  try {
    const menuPrincipalQuery = await MenuPrincipal.findAll({
      where: menuData,
      attributes: ['cmenuprincipal', 'cmenu', 'csubmenu', 'xmenuprincipal', 'xicono', 'xrutaprincipal', 
                   'xmenu', 'xrutamenu', 'xsubmenu', 'xrutasubmenu'],
    });
    const menuPrincipal = menuPrincipalQuery.map((item) => item.get({ plain: true }));
    return menuPrincipal;
  } catch (error) {
    console.log(error.message)
    return { error: error.message };
  }
};

// Realiza la búsqueda en la tabla pasándole los campos.
// const getAllMainMenu = async (menuData) => {
//   try {
//     const menuPrincipalQuery = await MenuPrincipal.findAll({
//       where: menuData,
//       attributes: [['cmenuprincipal', 'distinct_cmenuprincipal'], 'cmenu', 'csubmenu', 'xmenuprincipal', 'xicono', 'xrutaprincipal',
//         'xmenu', 'xrutamenu', 'xsubmenu', 'xrutasubmenu'],
//     });

//     // Eliminamos duplicados en el campo cmenuprincipal utilizando Set
//     const cmenuprincipalSet = new Set();
//     const menuPrincipal = menuPrincipalQuery
//       .filter((item) => {
//         const cmenuprincipal = item.get('distinct_cmenuprincipal');
//         if (!cmenuprincipalSet.has(cmenuprincipal)) {
//           cmenuprincipalSet.add(cmenuprincipal);
//           return true;
//         }
//         return false;
//       })
//       .map((item) => item.get({ plain: true }));

//     return menuPrincipal;
//   } catch (error) {
//     return { error: error.message };
//   }
// };

export default {
    getAllMainMenu
};