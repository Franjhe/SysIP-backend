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

const searchDataReceipt = async (searchDataReceipt) => {
    const searchReceipt = await Commissions.searchDataReceipt(searchDataReceipt);
    if (searchReceipt.error) {
        return {
            error: searchReceipt.error
        }
    }

    return searchReceipt;
}


const createNotificationMovement = async (createPaymentReport) => {

    // const createTransMovement = await Commissions.createPaymentReportTransW(createPaymentReport);
    // if (createTransMovement.error) {
    //     return {
    //         error: createTransMovement.error
    //     }
    // }
    // // return createPaymentReportData;

    // let soportMovement = []
    // for(let i = 0; i < createPaymentReport.soport.length; i++){

    //     const files = createPaymentReport.soport[i].ximagen;
    //     if (!files || files.length === 0) {
    //         const error = new Error('Please upload at least one file');
    //         error.httpStatusCode = 400;
    //         return res.status(400).json({  status: false, code: 400, message: error.message  });
    //     }
      
    //     soportMovement.push({
    //             ctransaccion : createTransMovement,
    //             cmoneda: createPaymentReport.soport[i].cmoneda,
    //             cbanco: createPaymentReport.soport[i].cbanco,
    //             cbanco_destino: createPaymentReport.soport[i].cbanco_destino,
    //             mpago: createPaymentReport.soport[i].mpago,
    //             mpagoext: createPaymentReport.soport[i].mpagoext,
    //             mpagoigtf: createPaymentReport.soport[i].mpagoigtf,
    //             mpagoigtfext: createPaymentReport.soport[i].mpagoigtfext,
    //             mtotal: createPaymentReport.soport[i].mtotal,
    //             mtotalext: createPaymentReport.soport[i].mtotalext,
    //             ptasamon: createPaymentReport.soport[i].ptasamon,
    //             ptasaref:createPaymentReport.soport[i].ptasaref, 
    //             xreferencia: createPaymentReport.soport[i].xreferencia,
    //             ximagen: files.filename ,
    //             cprog: createPaymentReport.cprog ,
    //             cusuario: createPaymentReport.cusuario,
    //             casegurado: createPaymentReport.casegurado,

    //     })
    // }

    // console.log(soportMovement)

    // const createsoportMovement = await Commissions.createPaymentReportSoportW(soportMovement);
    // if (createsoportMovement.error) {
    //     return {
    //         error: createsoportMovement.error
    //     }
    // }
}




const createPaymentReportTrans = async (createPaymentReport) => {
    const createPaymentReportData = await Commissions.createPaymentReportTransW(createPaymentReport);
    if (createPaymentReportData.error) {
        return {
            error: createPaymentReportData.error
        }
    }
    return createPaymentReportData;
}

const createPaymentReportSoport = async (createPaymentReport) => {
    const createPaymentReportData = await Commissions.createPaymentReportSoportW(createPaymentReport);
    if (createPaymentReportData.error) {
        return {
            error: createPaymentReportData.error
        }
    }
    return createPaymentReportData;
}

const searchPaymentReportData = async (searchPaymentReport) => {
    const searchDataNotifiqued = await Commissions.searchDataPaymentReport(searchPaymentReport);
    if (searchDataNotifiqued.error) {
        return {
            error: searchDataNotifiqued.error
        }
    }

    return {
        searchDataNotifiqued
    };

}

const searchPaymentPendingData = async () => {
    const searchPaymentPending = await Commissions.searchDataPaymentPending();
    if (searchPaymentPending.error) {
        return {
            error: searchPaymentPending.error
        }
    }
    return searchPaymentPending;
}

const getAllPaymentsCollected= async () => {
    const searchPaymentsCollected = await Commissions.searchDataPaymentsCollected();
    if (searchPaymentsCollected.error) {
        return {
            error: searchPaymentsCollected.error
        }
    }
    return searchPaymentsCollected;
}

const searchPaymentTransaction = async (searchPaymentReport) => {
    const searchPaymentsCollected = await Commissions.searchDataPaymentTransaction(searchPaymentReport);
    if (searchPaymentsCollected.error) {
        return {
            error: searchPaymentsCollected.error
        }
    }
    return searchPaymentsCollected;
}

const searchReceiptCliet = async (searchPaymentReport) => {
    const searchPaymentsCollected = await Commissions.searchDataPaymentsCollectedClient(searchPaymentReport);
    if (searchPaymentsCollected.error) {
        return {
            error: searchPaymentsCollected.error
        }
    }
    return searchPaymentsCollected;
}

const searchCliet = async (searchPaymentReport) => {
    const searchPaymentsCollected = await Commissions.searchDataClient(searchPaymentReport);
    if (searchPaymentsCollected.error) {
        return {
            error: searchPaymentsCollected.error
        }
    }
    return searchPaymentsCollected;
}

const updateDataReceipt = async (updatePaymentReport) => {
    const updatePaymentsCollected = await Commissions.updateReceiptNotifiqued(updatePaymentReport);
    if (updatePaymentsCollected.error) {
        return {
            error: updatePaymentsCollected.error
        }
    }

    const updateReceiptDifferenceSys = await Commissions.updateReceiptNotifiquedSys(updatePaymentReport);
    if (updateReceiptDifferenceSys.error) {
        return {
            error: updateReceiptDifferenceSys.error
        }
    }
    return updatePaymentsCollected;
}



const searchPaymentVencidaData = async () => {
    const searchPaymentVencidaData = await Commissions.searchDataPaymentVencida();
    if (searchPaymentVencidaData.error) {
        return {
            error: searchPaymentVencidaData.error
        }
    }
    return searchPaymentVencidaData;
}


const searchPaymentCollected = async () => {
    const searchPaymentCollected = await Commissions.searchPaymentCollected();
    if (searchPaymentCollected.error) {
        return {
            error: searchPaymentCollected.error
        }
    }
    return searchPaymentCollected;
}

const receiptUnderReviewData = async (receiptUnderReview) => {

    const updateReceiptDifference = await Commissions.receiptDifference(receiptUnderReview);
    if (updateReceiptDifference.error) {
        return {
            error: updateReceiptDifference.error
        }
    }

    return updateReceiptDifference;
}

const differenceOfNotificationData = async (notification) => {

    const updateReceiptDifference = await Commissions.differenceOfNotification(notification);
    if (updateReceiptDifference.error) {
        return {
            error: updateReceiptDifference.error
        }
    }
    return updateReceiptDifference;
}

const updateDifferenceOfNotificationData = async (notification) => {

    const updateReceiptDifference = await Commissions.updateReceiptDifference(notification);
    if (updateReceiptDifference.error) {
        return {
            error: updateReceiptDifference.error
        }
    }
    return updateReceiptDifference;
}

export default {
    searchCualquierData,
    searchDataReceipt,
    createNotificationMovement,
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
    updateDifferenceOfNotificationData,
    searchPaymentCollected,
    createNotificationMovement
}