import Menu from '../db/Menu.js';

const getAllMainMenu = async (menuData) => {
    try {
      const menuPrincipal = await Menu.getAllMainMenu(menuData);
      if (menuPrincipal.error) {
        return { error: menuPrincipal.error };
      }
      return menuPrincipal ;
    } catch (error) {
      return { error: error.message };
    }
  };

export default {
    getAllMainMenu
}