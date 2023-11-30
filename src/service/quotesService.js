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

export default {
    createQuotes,
    updateQuotes
}