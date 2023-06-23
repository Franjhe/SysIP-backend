import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';


// Se usa para buscar en la tabla SEMENUPRINCIPAL
const MenuPrincipal = sequelize.define(
  'semenuprincipal',
  {
    cmenu_principal: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    xmenu: {
      type: DataTypes.STRING,
      field: 'xmenu'
    },
    xicono: {
      type: DataTypes.STRING,
      field: 'xicono'
    },
    xruta: {
      type: DataTypes.STRING,
      field: 'xruta'
    },
  },
  {
    tableName: 'semenuprincipal',
  }
);


// Se usa para buscar en la tabla SEMENU
const Menu = sequelize.define(
    'semenu',
    {
      cmenu: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
      },
      cmenu_principal: {
        type: DataTypes.INTEGER,
      },
      xmenu: {
        type: DataTypes.STRING,
        field: 'xmenu'
      },
      xruta: {
        type: DataTypes.STRING,
        field: 'xruta'
      },
    },
    {
      tableName: 'semenu',
    }
  );


  // Se usa para buscar en la tabla SESUBMENU
  const SubMenu = sequelize.define(
    'sesubmenu',
    {
      csubmenu: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
      },
      cmenu: {
          type: DataTypes.INTEGER,
      },
      cmenu_principal: {
        type: DataTypes.INTEGER,
      },
      xsubmenu: {
        type: DataTypes.STRING,
        field: 'xsubmenu'
      },
      xruta: {
        type: DataTypes.STRING,
        field: 'xruta'
      },
    },
    {
      tableName: 'sesubmenu',
    }
  );


  // Realiza la busqueda en la tabla pasandole los campos.
  const getAllMainMenu = async () => {
    try {
      const menuPrincipalQuery = await MenuPrincipal.findAll({ attributes: ['cmenu_principal', 'xmenu', 'xicono', 'xruta'] });
      const menuPrincipal = menuPrincipalQuery.map((item) => item.get({ plain: true }));
      return menuPrincipal;
    } catch (error) {
      return { error: error.message };
    }
  };
  
  // Si la funcion de arriba trae el menu principal, buscara por el codigo el menu
  const getAllMenus = async () => {
    try {
      const menuPrincipal = await getAllMainMenu();
      const menu = [];
  
      for (let i = 0; i < menuPrincipal.length; i++) {
        const cmenu_principal = menuPrincipal[i].cmenu_principal;
        const semenuQuery = await Menu.findAll({ where: { cmenu_principal }, attributes: ['cmenu', 'cmenu_principal', 'xmenu', 'xruta'] });
        const semenu = semenuQuery.map((item) => item.get({ plain: true }));
        menu.push(semenu);
      }
  
      return menu;
    } catch (error) {
      return { error: error.message };
    }
  };

  // Si las dos funciones traen la información solicitada, busca los submenus.
  const getAllSubMenus = async () => {
    try {
      const menuPrincipal = await getAllMainMenu();
      const menu = await getAllMenus();
      const subMenu = [];
  
      for (let i = 0; i < menuPrincipal.length; i++) {
        const cmenu_principal = menuPrincipal[i].cmenu_principal;
  
        if (Array.isArray(menu[i])) {
          const menuArray = menu[i];
          for (let j = 0; j < menuArray.length; j++) {
            const cmenu = menuArray[j].cmenu;
  
            const semenuQuery = await SubMenu.findOne({
              where: { cmenu_principal, cmenu },
              attributes: ['csubmenu', 'cmenu_principal', 'cmenu','xsubmenu', 'xruta'],
            });
  
            if (semenuQuery !== null) {
              const semenu = semenuQuery.get({ plain: true });
              subMenu.push(semenu);
            }
          }
        }
      }
  
      return subMenu;
    } catch (error) {
      return { error: error.message };
    }
  };

export default {
    getAllMainMenu,
    getAllMenus,
    getAllSubMenus
};