import menuService from '../service/menuService.js';

const getAllMenu = async (req, res) => {
    const menuPrincipal = await menuService.getAllMainMenu();
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
    console.log(menuPrincipal.menuPrincipal)
    console.log(menuPrincipal.menu)
    console.log(menuPrincipal.subMenu)
    return res
        .status(200)
        .send({
            status: true,
            data: {
                menuPrincipal: menuPrincipal.menuPrincipal,
                menu: menuPrincipal.menu,
                subMenu: menuPrincipal.subMenu
            }
        });
}

export default {
    getAllMenu
}