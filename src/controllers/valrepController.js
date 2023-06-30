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

export default {
    getTrade,
    getCoin,
    getClient,
    getBrokers,
    getDepartament,
    getRol
}