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
                broker: brokers
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

const getState = async (req, res) => {
    const state = await valrepService.getState(req.body);
    if (state.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: state.permissionError
            });
    }
    if (state.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: state.error
            });
    }
    state.forEach((item) => {
        item.xdescripcion_l = item.xdescripcion_l.trim();
    });
    return res
        .status(200)
        .send({
            status: true,
            data: {
                state: state
            }
        });
}

const getCity = async (req, res) => {
    const city = await valrepService.getCity(req.body);
    if (city.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: city.permissionError
            });
    }
    if (city.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: city.error
            });
    }
    city.forEach((item) => {
        item.xdescripcion_l = item.xdescripcion_l.trim();
    });
    return res
        .status(200)
        .send({
            status: true,
            data: {
                city: city
            }
        });
}

const getBrand = async (req, res) => {
    const brand = await valrepService.getBrand(req.body);
    if (brand.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: brand.permissionError
            });
    }
    if (brand.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: brand.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                brand: brand
            }
        });
}

const getModel = async (req, res) => {
    const model = await valrepService.getModel(req.body);
    if (model.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: model.permissionError
            });
    }
    if (model.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: model.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                model: model
            }
        });
}

const getVersion = async (req, res) => {
    const version = await valrepService.getVersion(req.body);
    if (version.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: version.permissionError
            });
    }
    if (version.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: version.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                version: version
            }
        });
}

const getColor = async (req, res) => {
    const color = await valrepService.getColor();
    if (color.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: color.permissionError
            });
    }
    if (color.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: color.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                color: color
            }
        });
}

const getRates = async (req, res) => {
    const rates = await valrepService.getRates();
    if (rates.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: rates.permissionError
            });
    }
    if (rates.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: rates.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                rates: rates
            }
        });
}

const getTypeVehicle = async (req, res) => {
    const type = await valrepService.getTypeVehicle();
    if (type.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: type.permissionError
            });
    }
    if (type.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: type.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                type: type
            }
        });
}

const getUtilityRechange = async (req, res) => {
    const utilityR = await valrepService.getUtilityRechange();
    if (utilityR.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: utilityR.permissionError
            });
    }
    if (utilityR.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: utilityR.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                utilityR: utilityR
            }
        });
}

const getUtility = async (req, res) => {
    const utility = await valrepService.getUtility();
    if (utility.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: utility.permissionError
            });
    }
    if (utility.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: utility.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                utility: utility
            }
        });
}

const getClass = async (req, res) => {
    const classV = await valrepService.getClass();
    if (classV.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: classV.permissionError
            });
    }
    if (classV.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: classV.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                class: classV
            }
        });
}

const getPlan = async (req, res) => {
    const plan = await valrepService.getPlan();
    if (plan.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: plan.permissionError
            });
    }
    if (plan.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: plan.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                plan: plan
            }
        });
}

const getAccesories = async (req, res) => {
    const accesories = await valrepService.getAccesories();
    if (accesories.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: accesories.permissionError
            });
    }
    if (accesories.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: accesories.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                accesories: accesories
            }
        });
}

const getMethodOfPayment = async (req, res) => {
    const payment = await valrepService.getMethodOfPayment();
    if (payment.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: payment.permissionError
            });
    }
    if (payment.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: payment.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                payment: payment
            }
        });
}

const getTakers = async (req, res) => {
    const takers = await valrepService.getTakers();
    if (takers.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: takers.permissionError
            });
    }
    if (takers.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: takers.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                takers: takers
            }
        });
}

const getTypeOfPayment = async (req, res) => {
    const typePayment = await valrepService.getTypeOfPayment(req.body);
    if (typePayment.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: typePayment.permissionError
            });
    }
    if (typePayment.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: typePayment.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                typePayment: typePayment
            }
        });
}

const getBank = async (req, res) => {
    const bank = await valrepService.getBank(req.body);
    if (bank.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: bank.permissionError
            });
    }
    if (bank.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: bank.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                bank: bank
            }
        });
}

const getTargetBank = async (req, res) => {
    const targetBank = await valrepService.getTargetBank(req.body);
    if (targetBank.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: targetBank.permissionError
            });
    }
    if (targetBank.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: targetBank.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                targetBank: targetBank
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
    getPark,
    getState,
    getCity,
    getBrand,
    getModel,
    getVersion,
    getColor,
    getRates,
    getTypeVehicle,
    getUtilityRechange,
    getUtility,
    getClass,
    getPlan,
    getAccesories,
    getMethodOfPayment,
    getTakers,
    getTypeOfPayment,
    getBank,
    getTargetBank
}