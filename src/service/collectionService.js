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

const searchPaymentReportData = async (searchPaymentReport) => {
    const searchPaymentReportN = await Collection.searchDataPaymentReport(searchPaymentReport);
    if (searchPaymentReportN.error) {
        return {
            error: searchPaymentReportN.error
        }
    }
    return searchPaymentReportN;
}

const searchPaymentPendingData = async () => {
    const searchPaymentPending = await Collection.searchDataPaymentPending();
    if (searchPaymentPending.error) {
        return {
            error: searchPaymentPending.error
        }
    }
    return searchPaymentPending;
}


export default {
    searchDataReceipt,
    createPaymentReport,
    searchPaymentReportData,
    searchPaymentPendingData
}