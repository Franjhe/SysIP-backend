import Collection from '../db/Collection.js';

const searchDataReceipt = async (searchDataReceipt) => {
    const searchReceipt = await Collection.searchDataReceipt(searchDataReceipt);
    if (searchReceipt.error) {
        return {
            error: searchReceipt.error
        }
    }
    return searchReceipt;
}

export default {
    searchDataReceipt
}