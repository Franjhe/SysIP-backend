import menuService from '../service/menuService.js';

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
    return res
        .status(200)
        .send({
            status: true,
            data: {
                menuPrincipal: menuPrincipal
            }
        });
}

export default {
    getAllMenu
}