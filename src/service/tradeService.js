import Trade from '../db/Trade.js';

const getAllTrade = async () => {
    const trade = await Trade.getAllTrade();
    if (trade.error) {
        return {
            error: trade.error
        }
    }
    console.log(trade);
    return trade;
}

export default {
    getAllTrade
}