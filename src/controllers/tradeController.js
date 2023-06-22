import tradeService from '../services/tradeService.js';

const getAllTrade = async (req, res) => {
    const trades = await tradeService.getAllTrade();
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

export default {
    getAllTrade
}