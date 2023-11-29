import Valrep from '../db/Valrep.js';

const getTrade = async () => {
    const trades = await Valrep.getTrade();
    if (trades.error) {
        return {
            error: trades.error
        }
    }
    return trades;
}

const getCoin = async () => {
    const coins = await Valrep.getCoin();
    if (coins.error) {
        return {
            error: coins.error
        }
    }
    return coins;
}

const getClient = async () => {
    const clients = await Valrep.getClient();
    if (clients.error) {
        return {
            error: clients.error
        }
    }
    return clients;
}

const getBrokers = async () => {
    const brokers = await Valrep.getBrokers();
    if (brokers.error) {
        return {
            error: brokers.error
        }
    }
    return brokers;
}

const getDepartament = async () => {
    const departaments = await Valrep.getDepartament();
    if (departaments.error) {
        return {
            error: departaments.error
        }
    }
    return departaments;
}

const getRol = async (rolData) => {
    const rols = await Valrep.getRol(rolData);
    if (rols.error) {
        return {
            error: rols.error
        }
    }
    return rols;
}

const getMainMenu = async () => {
    const mainMenu = await Valrep.getMainMenu();
    if (mainMenu.error) {
        return {
            error: mainMenu.error
        }
    }
    return mainMenu;
}

const getMenu = async (getMenu) => {
    const menuResult = await Valrep.getMenu(getMenu);
    if (menuResult.error) {
        return {
            error: menuResult.error
        }
    }
    return menuResult;
}

const getSubMenu = async (getSubMenu) => {
    const subMenuResult = await Valrep.getSubMenu(getSubMenu);
    if (subMenuResult.error) {
        return {
            error: subMenuResult.error
        }
    }
    return subMenuResult;
}

const getUser = async () => {
    const users = await Valrep.getUser();
    if (users.error) {
        return {
            error: users.error
        }
    }
    return users;
}

const getPark = async () => {
    const parks = await Valrep.getPark();
    if (parks.error) {
        return {
            error: parks.error
        }
    }
    return parks;
}

const getState = async (getState) => {
    const state = await Valrep.getState(getState);
    if (state.error) {
        return {
            error: state.error
        }
    }
    return state;
}

const getCity = async (getCity) => {
    const city = await Valrep.getCity(getCity);
    if (city.error) {
        return {
            error: city.error
        }
    }
    return city;
}

const getBrand = async (getBrand) => {
    const brand = await Valrep.getBrand(getBrand);
    if (brand.error) {
        return {
            error: brand.error
        }
    }
    return brand;
}

const getModel = async (getModel) => {
    const model = await Valrep.getModel(getModel);
    if (model.error) {
        return {
            error: model.error
        }
    }
    return model;
}

const getVersion = async (getVersion) => {
    const version = await Valrep.getVersion(getVersion);
    if (version.error) {
        return {
            error: version.error
        }
    }
    return version;
}

const getColor = async () => {
    const color = await Valrep.getColor();
    if (color.error) {
        return {
            error: color.error
        }
    }
    return color;
}

const getRates = async () => {
    const rates = await Valrep.getRates();
    if (rates.error) {
        return {
            error: rates.error
        }
    }
    return rates;
}

const getTypeVehicle = async () => {
    const type = await Valrep.getTypeVehicle();
    if (type.error) {
        return {
            error: type.error
        }
    }
    return type;
}

const getUtility = async () => {
    const utility = await Valrep.getUtility();
    if (utility.error) {
        return {
            error: utility.error
        }
    }
    return utility;
}

const getClass = async () => {
    const classV = await Valrep.getClass();
    if (classV.error) {
        return {
            error: classV.error
        }
    }
    return classV;
}

const getPlan = async () => {
    const plan = await Valrep.getPlan();
    if (plan.error) {
        return {
            error: plan.error
        }
    }
    return plan;
}

const getAccesories = async () => {
    const accesories = await Valrep.getAccesories();
    if (accesories.error) {
        return {
            error: accesories.error
        }
    }
    return accesories;
}

const getMethodOfPayment = async () => {
    const payment = await Valrep.getMethodOfPayment();
    if (payment.error) {
        return {
            error: payment.error
        }
    }
    return payment;
}

const getTakers = async () => {
    const takers = await Valrep.getTakers();
    if (takers.error) {
        return {
            error: takers.error
        }
    }
    return takers;
}

const getTypeOfPayment = async () => {
    const typePayment = await Valrep.getTypeOfPayment();
    if (typePayment.error) {
        return {
            error: typePayment.error
        }
    }
    return typePayment;
}

const getBank = async (getBank) => {
    const bank = await Valrep.getBank(getBank);
    if (bank.error) {
        return {
            error: bank.error
        }
    }
    return bank;
}

const getTargetBank = async (getTargetBank) => {
    const targetBank = await Valrep.getTargetBank(getTargetBank);
    if (targetBank.error) {
        return {
            error: targetBank.error
        }
    }
    return targetBank;
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