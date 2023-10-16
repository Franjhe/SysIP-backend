import Emissions from '../db/Emissions.js';

const searchHullPrice = async (searchHullPrice) => {
    const result = await Emissions.searchHullPrice(searchHullPrice);
    if (result.error) {
        return {
            error: result.error
        }
    }
    return result;
}

const searchOtherPrice = async (searchOtherPrice) => {
    const rates = await Emissions.searchOtherPrice(searchOtherPrice);
    if (rates.error) {
        return {
            error: rates.error
        }
    }
    return rates;
}

const executePremiumAmount = async (executePremiumAmount) => {
    const result = await Emissions.executePremiumAmount(executePremiumAmount);
    if (result.error) {
        return {
            error: result.error
        }
    }
    return result;
}

export default {
    searchHullPrice,
    searchOtherPrice,
    executePremiumAmount
}