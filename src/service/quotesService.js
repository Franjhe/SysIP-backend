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

export default {
    createQuotes
}