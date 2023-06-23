import Menu from '../db/Menu.js';

const getAllMainMenu = async () => {
    try {
      const menuPrincipal = await Menu.getAllMainMenu();
      if (menuPrincipal.error) {
        return { error: menuPrincipal.error };
      }
  
      const menu = await Menu.getAllMenus();
      if (menu.error) {
        return { error: menu.error };
      }

      const subMenu = await Menu.getAllSubMenus();
      if (subMenu.error) {
        return { error: subMenu.error };
      }
  
      return { menuPrincipal, menu, subMenu };
    } catch (error) {
      return { error: error.message };
    }
  };

export default {
    getAllMainMenu
}