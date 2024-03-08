import commissionsService from '../service/commissionsService.js';


const searchCualquierData = async (req, res) => {
    const cualquierData = await commissionsService.searchCualquierData();
    if (cualquierData.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: cualquierData.permissionError
            });
    }
    if (cualquierData.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: cualquierData.error
            });
    }

    return res
        .status(200)
        .send({
            status: true,
            cualquierData,
            message: 'Consulta exitosa.'
            
        });
}

const searchComisionesProductores = async (req, res) => {
    const cualquierData = await commissionsService.searchComisionesProductores();
    if (cualquierData.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: cualquierData.permissionError
            });
    }
    if (cualquierData.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: cualquierData.error
            });
    }

    return res
        .status(200)
        .send({
            status: true,
            cualquierData,
            message: 'Consulta exitosa.'
            
        });
}
const searchComisionesProductor = async (req, res) => {
    
    const cualquierData = await commissionsService.searchComisionesProductor(req.params.id);
    if (cualquierData.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: cualquierData.permissionError
            });
    }
    if (cualquierData.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: cualquierData.error
            });
    }

    return res
        .status(200)
        .send({
            status: true,
            cualquierData,
            message: 'Consulta exitosa.'
            
        });
}

const searchCommissionsbyClient = async (req, res) => {
    const searchReceipt = await commissionsService.searchDataReceipt(req.body.cedula);
    if (searchReceipt.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: searchReceipt.permissionError
            });
    }
    if (searchReceipt.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: searchReceipt.error
            });
    }

    return res
        .status(200)
        .send({
            status: true,
            searchReceipt,
            message: 'Consulta exitosa.'
            
        });
}


const Commissions =  async (req, res) => {
    console.log(req.file)


    // const searchReceipt = await commissionsService.Commissions(req.body);
    // if (searchReceipt.permissionError) {
    //     return res
    //         .status(403)
    //         .send({
    //             status: false,
    //             message: searchReceipt.permissionError
    //         });
    // }
    // if (searchReceipt.error) {
    //     return res
    //         .status(500)
    //         .send({
    //             status: false,
    //             message: searchReceipt.error
    //         });
    // }

    // return res
    //     .status(200)
    //     .send({
    //         status: true,
    //         ctransaccion : searchReceipt,
    //     });
}

const createPaymentReporTrans = async (req, res) => {
    const searchReceipt = await commissionsService.createPaymentReportTrans(req.body);

    if (searchReceipt.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: searchReceipt.permissionError
            });
    }
    if (searchReceipt.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: searchReceipt.error
            });
    }

    return res
        .status(200)
        .send({
            status: true,
            ctransaccion : searchReceipt,
        });
}

const createPaymentReportSoport = async (req, res) => {
    const searchReceipt = await commissionsService.createPaymentReportSoport(req.body);

    if (searchReceipt.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: searchReceipt.permissionError
            });
    }
    if (searchReceipt.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: searchReceipt.error
            });
    }

    return res
        .status(200)
        .send({
            status: true,
            message: 'Su reporte de pago ha sido registrado exitosamente.'
            
        });
}

const searchPaymentReportNotification= async (req, res) => {
    const searchPaymentReport = await commissionsService.searchPaymentReportData(req.body.cedula);

    if (searchPaymentReport.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: searchPaymentReport.permissionError
            });
    }
    if (searchPaymentReport.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: searchPaymentReport.error
            });
    }

    return res
        .status(200)
        .send({
            status: true,
            searchPaymentReport,
            message: 'Consulta exitosa.'
            
        });
}

const searchPaymentReportNotificationData = async (req, res) => {
    const searchPaymentReport = await commissionsService.searchPaymentTransaction(req.params.id);
    if (searchPaymentReport.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: searchPaymentReport.permissionError
            });
    }
    if (searchPaymentReport.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: searchPaymentReport.error
            });
    }

    return res
        .status(200)
        .send({
            status: true,
            searchPaymentReport,
            message: 'Consulta exitosa.'
            
        });
}

const searchPaymentPending= async (req, res) => {
    const searchPaymentPendingData = await commissionsService.searchPaymentPendingData();

    if (searchPaymentPendingData.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: searchPaymentPendingData.permissionError
            });
    }
    if (searchPaymentPendingData.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: searchPaymentPendingData.error
            });
    }

    return res
        .status(200)
        .send({
            status: true,
            searchPaymentPendingData,
            message: 'Consulta exitosa.'
            
        });
}

const PaymentsCollected= async (req, res) => {
    const searchPaymentsCollected = await commissionsService.getAllPaymentsCollected();

    if (searchPaymentsCollected.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: searchPaymentsCollected.permissionError
            });
    }
    if (searchPaymentsCollected.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: searchPaymentsCollected.error
            });
    }

    return res
        .status(200)
        .send({
            status: true,
            searchPaymentsCollected,
            message: 'Consulta exitosa.'
            
        });
}

const updateReceipt = async (req, res) => {
    const updateReceiptData = await commissionsService.updateDataReceipt(req.body);
    if (updateReceiptData.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: updateReceiptData.permissionError
            });
    }
    if (updateReceiptData.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: updateReceiptData.error
            });
    }

    return res
        .status(200)
        .send({
            status: true,
            message: 'Actualizacion exitosa.'
            
        });
}

const searchReceiptClient = async (req, res) => {
    const searchReceiptClientData = await commissionsService.searchReceiptCliet(req.params.id);
    if (searchReceiptClientData.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: searchReceiptClientData.permissionError
            });
    }
    if (searchReceiptClientData.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: searchReceiptClientData.error
            });
    }

    return res
        .status(200)
        .send({
            status: true,
            searchReceiptClientData,
            message: 'consulta exitosa.'
            
        });
}

const searchClient = async (req, res) => {
    const searchClientData = await commissionsService.searchCliet(req.params.id);
    if (searchClientData.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: searchClientData.permissionError
            });
    }
    if (searchClientData.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: searchClientData.error
            });
    }

    return res
        .status(200)
        .send({
            status: true,
            searchClientData,
            message: 'consulta exitosa.'
            
        });
}

const searchPaymentVencin= async (req, res) => {
    const searchPaymentData = await commissionsService.searchPaymentVencidaData();

    if (searchPaymentData.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: searchPaymentData.permissionError
            });
    }
    if (searchPaymentData.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: searchPaymentData.error
            });
    }

    return res
        .status(200)
        .send({
            status: true,
            searchPaymentData,
            message: 'Consulta exitosa.'
            
        });
}

const searchPaymentCollected= async (req, res) => {
    const searchPaymentCollected = await commissionsService.searchPaymentCollected();
    if (searchPaymentCollected.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: searchPaymentCollected.permissionError
            });
    }
    if (searchPaymentCollected.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: searchPaymentCollected.error
            });
    }

    return res
        .status(200)
        .send({
            status: true,
            searchPaymentCollected,
            message: 'Consulta exitosa.'
            
        });
}

const receiptUnderReview = async (req, res) => {
    const searchReceipt = await commissionsService.receiptUnderReviewData(req.body);

    if (searchReceipt.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: searchReceipt.permissionError
            });
    }
    if (searchReceipt.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: searchReceipt.error
            });
    }

    return res
        .status(200)
        .send({
            status: true,
            message: 'El recibo ha sido actualizado con exito.'
            
        });
}

const differenceOfNotification = async (req, res) => {
    const searchDifferenceOfNotification = await commissionsService.differenceOfNotificationData(req.params.id);

    if (searchDifferenceOfNotification.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: searchDifferenceOfNotification.error
            });
    }

    return res
        .status(200)
        .send({
            status: true,
            message: 'Consulta realizada con exito.'
            
        });
}

const updateDifferenceOfNotification = async (req, res) => {
    const searchDifferenceOfNotification = await commissionsService.updateDifferenceOfNotificationData(req.body);

    if (searchDifferenceOfNotification.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: searchDifferenceOfNotification.error
            });
    }

    return res
        .status(200)
        .send({
            status: true,
            message: 'Consulta realizada con exito.'
            
        });
}

export default {
    searchCualquierData,
    searchComisionesProductores,
    searchComisionesProductor,
    searchCommissionsbyClient,
    createPaymentReporTrans,
    createPaymentReportSoport,
    searchPaymentReportNotification,
    searchPaymentReportNotificationData,
    searchPaymentPending,
    PaymentsCollected,
    updateReceipt,
    searchReceiptClient,
    searchClient,
    searchPaymentVencin,
    receiptUnderReview,
    differenceOfNotification,
    updateDifferenceOfNotification,
    searchPaymentCollected
}