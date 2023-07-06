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

const getUser = async () => {
    const users = await Valrep.getUser();
    if (users.error) {
        return {
            error: users.error
        }
    }
    return users;
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
    getUser
}