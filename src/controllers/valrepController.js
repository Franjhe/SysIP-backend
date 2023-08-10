import valrepService from '../service/valrepService.js';

const getTrade = async (req, res) => {
    const trades = await valrepService.getTrade();
    if (trades.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: trades.permissionError
            });
    }
    if (trades.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: trades.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                trades: trades
            }
        });
}

const getCoin = async (req, res) => {
    const coins = await valrepService.getCoin();
    if (coins.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: coins.permissionError
            });
    }
    if (coins.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: coins.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                coins: coins
            }
        });
}

const getClient = async (req, res) => {
    const clients = await valrepService.getClient();
    if (clients.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: clients.permissionError
            });
    }
    if (clients.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: clients.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                clients: clients
            }
        });
}

const getBrokers = async (req, res) => {
    const brokers = await valrepService.getBrokers();
    if (brokers.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: brokers.permissionError
            });
    }
    if (brokers.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: brokers.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                brokers: brokers
            }
        });
}

const getDepartament = async (req, res) => {
    const departaments = await valrepService.getDepartament();
    if (departaments.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: departaments.permissionError
            });
    }
    if (departaments.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: departaments.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                departaments: departaments
            }
        });
}

const getRol = async (req, res) => {
    const rols = await valrepService.getRol(req.body);
    if (rols.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: rols.permissionError
            });
    }
    if (rols.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: rols.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                rols: rols
            }
        });
}

const getMainMenu = async (req, res) => {
    const mainMenu = await valrepService.getMainMenu();
    if (mainMenu.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: mainMenu.permissionError
            });
    }
    if (mainMenu.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: mainMenu.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                mainMenu: mainMenu
            }
        });
}

const getMenu = async (req, res) => {
    const menuResult = await valrepService.getMenu(req.body);
    if (menuResult.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: menuResult.permissionError
            });
    }
    if (menuResult.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: menuResult.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                menu: menuResult
            }
        });
}

const getSubMenu = async (req, res) => {
    const subMenuResult = await valrepService.getSubMenu(req.body);
    if (subMenuResult.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: subMenuResult.permissionError
            });
    }
    if (subMenuResult.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: subMenuResult.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                subMenu: subMenuResult
            }
        });
}

const getUser = async (req, res) => {
    const users = await valrepService.getUser();
    if (users.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: users.permissionError
            });
    }
    if (users.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: users.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                users: users
            }
        });
}

const getPark = async (req, res) => {
    const parks = await valrepService.getPark();
    if (parks.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: parks.permissionError
            });
    }
    if (parks.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: parks.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                parks: parks
            }
        });
}

export default {
    getTrade,
    getCoin,
    getClient,
    getBrokers,
    getDepartament,
    getRol,
    getMainMenu,
    getMenu,
    getUser,
    getSubMenu,
    getPark
}