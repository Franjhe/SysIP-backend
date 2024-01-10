import Collection from '../db/Collection.js';
import PdfPrinter from 'pdfmake';
import fs from 'fs'

var fonts = {
    Roboto: {
        normal: 'node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.ttf',
        bold: 'node_modules/roboto-font/fonts/Roboto/roboto-bold-webfont.ttf',
        italics: 'node_modules/roboto-font/fonts/Roboto/roboto-italic-webfont.ttf',
        bolditalics: 'node_modules/roboto-font/fonts/Roboto/roboto-bolditalic-webfont.ttf'
    }
};

var printer = new PdfPrinter(fonts);

var dd = {
    content: [
        'First paragraph',
        'Another paragraph'
    ]
}
var pdfDoc = printer.createPdfKitDocument(dd);
pdfDoc.pipe(fs.createWriteStream('basics.pdf')).on('finish',function(){
    //success
});
pdfDoc.end();


const searchDataReceipt = async (searchDataReceipt) => {
    const searchReceipt = await Collection.searchDataReceipt(searchDataReceipt);
    if (searchReceipt.error) {
        return {
            error: searchReceipt.error
        }
    }
    for(let i = 0; i < searchReceipt.receipt.length; i++){

        const receipt = await Collection.searchReceiptDifference(searchReceipt.receipt[i].crecibo)


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
    receiptUnderReviewData
}