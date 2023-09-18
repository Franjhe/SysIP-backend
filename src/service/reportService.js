import Report from '../db/Report.js';

const searchPremiums = async (searchPremiums) => {
    if(searchPremiums.bprima == 'Primas Pendientes'){
        
    }
    const search = await Report.searchPremiums(searchPremiums);
    if (search.error) {
        return {
            error: search.error
        }
    }
    return search;
}

const searchReceipt = async (searchReceipt) => {
    const receipt = await Report.searchReceipt(searchReceipt);
    if (receipt.error) {
        return {
            error: receipt.error
        }
    }
    return receipt;
}

export default {
    searchPremiums,
    searchReceipt
}