import Certificate from '../db/Certificate.js';

const searchCertificate = async (searchPremiums) => {
    const search = await Certificate.searchCertificate(searchPremiums);
    if (search.error) {
        return {
            error: search.error
        }
    }
    return search;
}


export default {
    searchCertificate,

}