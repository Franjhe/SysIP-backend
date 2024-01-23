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

const createPaymentReportTrans = async (createPaymentReport) => {
    const createPaymentReportData = await Collection.createPaymentReportTransW(createPaymentReport);
    if (createPaymentReportData.error) {
        return {
            error: createPaymentReportData.error
        }
    }
    return createPaymentReportData;
}

const createPaymentReportSoport = async (createPaymentReport) => {
    const createPaymentReportData = await Collection.createPaymentReportSoportW(createPaymentReport);
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

    const transactionDetail = [];
    const diference = []

    for (let i = 0; i < searchPaymentReportN.transacciones.length; i++) {

        const transactionDetailData = await Collection.searchDataPaymentTransaction(searchPaymentReportN.transacciones[i].ctransaccion);
        transactionDetail.push(transactionDetailData);

        const diferenceData = await Collection.differenceOfNotification(searchPaymentReportN.transacciones[i].ctransaccion);
        diference.push(diferenceData.differenceOfNotification);
    }

    const dataTransaction = []
    dataTransaction.push({
        transaccion : searchPaymentReportN.transacciones,
        transaccionDetalle : transactionDetail, 
        diferencia : diference
    })

    return {
        dataTransaction
    };

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

const getAllPaymentsCollected= async () => {
    const searchPaymentsCollected = await Collection.searchDataPaymentsCollected();
    if (searchPaymentsCollected.error) {
        return {
            error: searchPaymentsCollected.error
        }
    }
    return searchPaymentsCollected;
}

const searchPaymentTransaction = async (searchPaymentReport) => {
    const searchPaymentsCollected = await Collection.searchDataPaymentTransaction(searchPaymentReport);
    if (searchPaymentsCollected.error) {
        return {
            error: searchPaymentsCollected.error
        }
    }
    return searchPaymentsCollected;
}

const searchReceiptCliet = async (searchPaymentReport) => {
    const searchPaymentsCollected = await Collection.searchDataPaymentsCollectedClient(searchPaymentReport);
    if (searchPaymentsCollected.error) {
        return {
            error: searchPaymentsCollected.error
        }
    }
    return searchPaymentsCollected;
}

const searchCliet = async (searchPaymentReport) => {
    const searchPaymentsCollected = await Collection.searchDataClient(searchPaymentReport);
    if (searchPaymentsCollected.error) {
        return {
            error: searchPaymentsCollected.error
        }
    }
    return searchPaymentsCollected;
}

const updateDataReceipt = async (updatePaymentReport) => {
    const updatePaymentsCollected = await Collection.updateReceiptNotifiqued(updatePaymentReport);
    if (updatePaymentsCollected.error) {
        return {
            error: updatePaymentsCollected.error
        }
    }
    return updatePaymentsCollected;
}



const searchPaymentVencidaData = async () => {
    const searchPaymentVencidaData = await Collection.searchDataPaymentVencida();
    if (searchPaymentVencidaData.error) {
        return {
            error: searchPaymentVencidaData.error
        }
    }
    return searchPaymentVencidaData;
}

const receiptUnderReviewData = async (receiptUnderReview) => {

    const receipt = []
    for(let i = 0; i < receiptUnderReview.receipt.length; i++){

        if(receiptUnderReview.receipt[i].crecibo == receiptUnderReview.crecibo){
            receipt.push({
                cpoliza : receiptUnderReview.receipt[i].cpoliza,
                crecibo : receiptUnderReview.receipt[i].crecibo,
                casegurado : receiptUnderReview.receipt[i].casegurado,
                cramo : receiptUnderReview.receipt[i].cramo,
                mprimabrutaext : receiptUnderReview.receipt[i].mprimabrutaext,
                mprimabruta : receiptUnderReview.receipt[i].mprimabruta
            })

        }

    }
    const updateReceiptDifference = await Collection.receiptDifference(receiptUnderReview,receipt);
    if (updateReceiptDifference.error) {
        return {
            error: updateReceiptDifference.error
        }
    }
    return updateReceiptDifference;
}

const differenceOfNotificationData = async (notification) => {

    const updateReceiptDifference = await Collection.differenceOfNotification(notification);
    if (updateReceiptDifference.error) {
        return {
            error: updateReceiptDifference.error
        }
    }
    return updateReceiptDifference;
}

const updateDifferenceOfNotificationData = async (notification) => {

    const updateReceiptDifference = await Collection.updateReceiptDifference(notification);
    if (updateReceiptDifference.error) {
        return {
            error: updateReceiptDifference.error
        }
    }
    return updateReceiptDifference;
}

export default {
    searchDataReceipt,
    createPaymentReportTrans,
    createPaymentReportSoport,
    searchPaymentReportData,
    searchPaymentPendingData,
    getAllPaymentsCollected,
    searchPaymentTransaction,
    updateDataReceipt,
    searchReceiptCliet,
    searchCliet,
    searchPaymentVencidaData,
    receiptUnderReviewData,
    differenceOfNotificationData,
    updateDifferenceOfNotificationData
}