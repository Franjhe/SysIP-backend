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

const createPaymentReport = async (createPaymentReport) => {
    const createPaymentReportData = await Collection.createPaymentReportW(createPaymentReport);
    if (createPaymentReportData.error) {
        return {
            error: createPaymentReportData.error
        }
    }
    return createPaymentReportData;
}


export default {
    searchDataReceipt,
    createPaymentReport
}