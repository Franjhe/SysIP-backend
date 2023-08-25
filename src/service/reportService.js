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

export default {
    searchPremiums
}