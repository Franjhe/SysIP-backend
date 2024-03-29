import Commissions from '../db/CommissionsModel.js';

const searchCualquierData = async () => {
    const CualquierData = await Commissions.searchCualquierData();
    if (CualquierData.error) {
        return {
            error: CualquierData.error
        }
    }

    return CualquierData;
}

const searchComisionesProductores = async () => {
    const returnData = await Commissions.searchComisionesProductores();
    if (returnData.error) {
        return {
            error: returnData.error
        }
    }

    return returnData;
}
const searchInsurerCommissions = async (data) => {
    const returnData = await Commissions.searchInsurerCommissions(data);
    if (returnData.error) {
        return {
            error: returnData.error
        }
    }

    return returnData;
}
const searchDataProductor = async (data) => {
    const returnData = await Commissions.searchDataProductor(data);
    if (returnData.error) {
        return {
            error: returnData.error
        }
    }

    return returnData;
}
const searchPaymentRequests = async (notification) => {

    const updateReceiptDifference = await Commissions.searchPaymentRequests(notification);
    if (updateReceiptDifference.error) {
        return {
            error: updateReceiptDifference.error
        }
    }
    return updateReceiptDifference;
}
const createPaymentRequests = async (data) => {
    const returnData = await Commissions.createPaymentRequests(data);
    if (returnData.error) {
        return {
            error: returnData.error
        }
    }

    return returnData;
}
const payPaymentRequests = async (data) => {
    const returnData = await Commissions.payPaymentRequests(data);
    if (returnData.error) {
        return {
            error: returnData.error
        }
    }

    return returnData;
}
const detailPaymentRequest = async (data) => {
    const returnData = await Commissions.detailPaymentRequest(data);
    if (returnData.error) {
        return {
            error: returnData.error
        }
    }

    return returnData;
}



export default {
    searchCualquierData,
    searchComisionesProductores,
    searchInsurerCommissions,
    searchDataProductor,
    searchPaymentRequests,
    createPaymentRequests,
    payPaymentRequests,
    detailPaymentRequest,
}