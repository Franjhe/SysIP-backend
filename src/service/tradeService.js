import Trade from '../db/Trade.js';

const getAllTrade = async () => {
    const trade = await Trade.getAllTrade();
    if (trade.error) {
        return {
            error: trade.error
        }
    }
    return trade;
}

export default {
    getAllTrade
}