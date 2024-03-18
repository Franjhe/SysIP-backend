import Collection from '../db/Collection.js';

import httpService  from './apiclient.js';


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
    const createTransAndDetail = await Collection.createPaymentReportTransW(createPaymentReport);
    if (createTransAndDetail.error) {
        return {
            error: createTransAndDetail.error
        }
    }


    const updateReceipt = await Collection.transaccionReceipt(createPaymentReport);
    if (updateReceipt.error) {
        return {
            error: updateReceipt.error
        }
    }
    if(createPaymentReport.diference){
        const createPaymentReportData = await Collection.createPaymentReportSoportDiference(createPaymentReport);
        if (createPaymentReportData.error) {
            return {
                error: createPaymentReportData.error
            }
        }
        return createPaymentReportData;
    }else if(!createPaymentReport.diference){
        const createPaymentReportData = await Collection.createPaymentReportSoportW(createPaymentReport);
        if (createPaymentReportData.error) {
            return {
                error: createPaymentReportData.error
            }
        }
        return createPaymentReportData;
    }
}



const searchPaymentReportData = async () => {
    const searchDataNotifiqued = await Collection.searchDataPaymentReport();
    if (searchDataNotifiqued.error) {
        return {
            error: searchDataNotifiqued.error
        }
    }

    return searchDataNotifiqued

}

const createPaymentReportSoport = async (createPaymentReport) => {
    if(createPaymentReport.diference){
        const createPaymentReportData = await Collection.createPaymentReportSoportW(createPaymentReport);
        if (createPaymentReportData.error) {
            return {
                error: createPaymentReportData.error
            }
        }
        return createPaymentReportData;
    }else{
        const createPaymentReportData = await Collection.createPaymentReportSoportDiference(createPaymentReport);
        if (createPaymentReportData.error) {
            return {
                error: createPaymentReportData.error
            }
        }
        return createPaymentReportData;
    }
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


    let cuotas = [] //llenamos un alosta con los recibos y cuotas recibidos
    for(let i = 0; i < updatePaymentReport.detalle.length; i++){
        cuotas.push({
            cuota:updatePaymentReport.detalle[i].qcuota,
            cnpoliza:updatePaymentReport.detalle[i].cnpoliza,
        })
    }
    let cuotasLength = cuotas.length //asgignamos una variable a la longitud

//la Logica representa la busqueda del valor de la cuota para especifcar si se enviar el cuadro poliza,el cuadro recibo o ambos al mismo tiempo 

    if(cuotasLength > 1){   //si tiene mas de un recibo,se valida si posee la cuota inial,sino,solo se enviara una lista de recibos pagados

        const resultado = cuotas.find((numero) => numero.cuota === 1);

        const encontrado = resultado ? true : false;

        if(encontrado){
            Collection.sendMailPolizandReceipt(cuotas,updatePaymentReport.correo)
        }else{
            Collection.sendMailReceipt(cuotas,updatePaymentReport.correo)
        }
    }
    else if(cuotasLength == 1){  //si tiene un recibo,se valida si es la cuota inial,sino,solo se enviara el recibo pagado
        const resultado = cuotas.find((numero) => numero.cuota == 1);
        const encontrado = resultado ? true : false;

        if(encontrado){
            Collection.sendMailPoliza(cuotas,updatePaymentReport.correo)
        }else{
            Collection.sendMailReceipt(cuotas,updatePaymentReport.correo)
        }
    }

                                              
    const url = 'https://pydolarvenezuela-api.vercel.app/api/v1/dollar?page=bcv';

    try {
        const response = await httpService(url);
        let bcv = response.monitors.usd.price

        const createCommision = await Collection.createCommision(updatePaymentReport,bcv);
        if (createCommision.error) {
            return {
                error: createCommision.error
            }
        }
        return updatePaymentsCollected;
    } catch (error) {
        console.error('Ooops. Ha ocurrido un error:', error.message);
        return {
            error: error.message
        };
    }


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


const searchPaymentCollected = async (estado) => {
    const searchPaymentCollected = await Collection.searchPaymentCollected(estado);
    if (searchPaymentCollected.error) {
        return {
            error: searchPaymentCollected.error
        }
    }
    return searchPaymentCollected;
}

const receiptUnderReviewData = async (receiptUnderReview) => {

    const updateReceiptDifference = await Collection.receiptDifference(receiptUnderReview);
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
    searchPaymentReportData,
    searchPaymentPendingData,
    getAllPaymentsCollected,
    updateDataReceipt,
    searchReceiptCliet,
    searchCliet,
    searchPaymentVencidaData,
    receiptUnderReviewData,
    differenceOfNotificationData,
    updateDifferenceOfNotificationData,
    searchPaymentCollected,
    createPaymentReportSoport
}