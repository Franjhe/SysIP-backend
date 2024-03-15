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


const createNotificationMovement = async (createPaymentReport) => {

    // const createTransMovement = await Collection.createPaymentReportTransW(createPaymentReport);
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

    // const createsoportMovement = await Collection.createPaymentReportSoportW(soportMovement);
    // if (createsoportMovement.error) {
    //     return {
    //         error: createsoportMovement.error
    //     }
    // }
}


const createPaymentReportTrans = async (createPaymentReport) => {
    const createPaymentReportData = await Collection.createPaymentReportTransW(createPaymentReport);
    if (createPaymentReportData.error) {
        return {
            error: createPaymentReportData.error
        }
    }

    const updateTransaccionReceipt = await Collection.transaccionReceipt(createPaymentReport,createPaymentReportData);
    if (updateTransaccionReceipt.error) {
        return {
            error: updateTransaccionReceipt.error
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
    const searchDataNotifiqued = await Collection.searchDataPaymentReport(searchPaymentReport);
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

    const updateReceiptDifferenceSys = await Collection.updateReceiptNotifiquedSys(updatePaymentReport);
    if (updateReceiptDifferenceSys.error) {
        return {
            error: updateReceiptDifferenceSys.error
        }
    }

    const searchDataClient = await Collection.searchDataClient(updatePaymentReport.casegurado);
    if (searchDataClient.error) {
        return {
            error: searchDataClient.error
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
            Collection.sendMailPolizandReceipt(cuotas,searchDataClient)
        }else{
            Collection.sendMailReceipt(cuotas,searchDataClient)
        }
    }
    else if(cuotasLength == 1){  //si tiene un recibo,se valida si es la cuota inial,sino,solo se enviara el recibo pagado
        const resultado = cuotas.find((numero) => numero.cuota == 1);
        const encontrado = resultado ? true : false;

        if(encontrado){
            Collection.sendMailPoliza(cuotas,searchDataClient)
        }else{
            Collection.sendMailReceipt(cuotas,searchDataClient)
        }
    }


    console.log(cuotas,searchDataClient)
    const url = 'https://pydolarvenezuela-api.vercel.app/api/v1/dollar/page?page=bcv';

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