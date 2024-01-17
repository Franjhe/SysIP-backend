import menuService from '../service/menuService.js';
const transformMenuData = (menuPrincipal) => {
    const result = [];
  
    // Agrupar por cmenuprincipal
    const groupedByMenuPrincipal = menuPrincipal.reduce((acc, item) => {
      if (!acc[item.cmenuprincipal]) {
        acc[item.cmenuprincipal] = [];
      }
      acc[item.cmenuprincipal].push(item);
      return acc;
    }, {});
  
    // Construir la estructura deseada
    for (const key in groupedByMenuPrincipal) {
      const menuPrincipalItem = groupedByMenuPrincipal[key][0];
      const menuPrincipalObject = {
        cmenuprincipal: menuPrincipalItem.cmenuprincipal,
        xmenuprincipal: menuPrincipalItem.xmenuprincipal,
        xrutaprincipal: menuPrincipalItem.xrutaprincipal,
        xicono: menuPrincipalItem.xicono,
        children: [],
      };
  
      for (const submenuItem of groupedByMenuPrincipal[key]) {
        const submenuObject = {
          cmenu: submenuItem.cmenu,
          xmenu: submenuItem.xmenu,
          xrutamenu: submenuItem.xrutamenu,
          children: [],
        };
  
        if (submenuItem.csubmenu !== null) {
          submenuObject.csubmenu = submenuItem.csubmenu;
          submenuObject.xsubmenu = submenuItem.xsubmenu;
          submenuObject.xrutasubmenu = submenuItem.xrutasubmenu;
        }
  
        menuPrincipalObject.children.push(submenuObject);
      }
  
      result.push(menuPrincipalObject);
    }
  
    return result;
  };

const getAllMenu = async (req, res) => {
    const menuPrincipal = await menuService.getAllMainMenu(req.body);
    if (menuPrincipal.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: menuPrincipal.permissionError
            });
    }
    if (menuPrincipal.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: menuPrincipal.error
            });
    }
    const transformedMenu = transformMenuData(menuPrincipal);
    return res
        .status(200)
        .send({
            status: true,
            data: {
                menuPrincipal: transformedMenu
            }
        });
}

export default {
    getAllMenu
}