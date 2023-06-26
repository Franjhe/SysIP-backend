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

export default {
    getTrade,
    getCoin,
    getClient,
    getBrokers
}