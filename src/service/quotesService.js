import Quotes from '../db/Quotes.js';

const createQuotes = async (createQuotes) => {
    const result = await Quotes.createQuotes(createQuotes);
    if (result.error) {
        return {
            error: result.error
        }
    }
    return result;
} 

const updateQuotes = async (updateQuotes) => {
    const update = await Quotes.updateQuotes(updateQuotes);
    if (update.error) {
        return {
            error: update.error
        }
    }
    return update;
} 

const searchCoverages = async () => {
    const coverage = await Quotes.searchCoverages();
    if (coverage.error) {
        return {
            error: coverage.error
        }
    }
    return coverage;
} 

const detailQuotes = async (detailQuotes) => {
    const detail = await Quotes.detailQuotes(detailQuotes);
    if (detail.error) {
        return {
            error: detail.error
        }
    }
    return detail;
} 

const detailQuotesAutomobile = async (detailQuotesAutomobile) => {
    const result = await Quotes.detailQuotesAutomobile(detailQuotesAutomobile);
    if (result.error) {
        return {
            error: result.error
        }
    }
    return result;
} 

const searchQuotes = async (searchQuotes) => {
    const result = await Quotes.searchQuotes(searchQuotes);
    if (result.error) {
        return {
            error: result.error
        }
    }
    return result;
} 

const updatePremiums = async (updatePremiums) => {
    const update = await Quotes.updatePremiums(updatePremiums);
    if (update.error) {
        return {
            error: update.error
        }
    }
    return update;
} 

export default {
    createQuotes,
    updateQuotes,
    searchCoverages,
    detailQuotes,
    detailQuotesAutomobile,
    searchQuotes,
    updatePremiums
}