import collectionService from '../service/collectionService.js';


const searchCollectionbyClient = async (req, res) => {
    const searchReceipt = await collectionService.searchDataReceipt(req.body.cedula);
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

const createPaymentReporTrans = async (req, res) => {
    const searchReceipt = await collectionService.createPaymentReportTrans(req.body);

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
    const searchReceipt = await collectionService.createPaymentReportSoport(req.body);

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
    const searchPaymentReport = await collectionService.searchPaymentReportData();

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
    const searchPaymentPendingData = await collectionService.searchPaymentPendingData();

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
    const searchPaymentsCollected = await collectionService.getAllPaymentsCollected();

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
    const updateReceiptData = await collectionService.updateDataReceipt(req.body);
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
    const searchReceiptClientData = await collectionService.searchReceiptCliet(req.params.id);
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
    const searchClientData = await collectionService.searchCliet(req.params.id);
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
    const searchPaymentData = await collectionService.searchPaymentVencidaData();

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
    const searchPaymentCollected = await collectionService.searchPaymentCollected(req.params.id);
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
    const searchReceipt = await collectionService.receiptUnderReviewData(req.body);

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
    const searchDifferenceOfNotification = await collectionService.differenceOfNotificationData(req.params.id);

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
    const searchDifferenceOfNotification = await collectionService.updateDifferenceOfNotificationData(req.body);

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
    searchCollectionbyClient,
    createPaymentReporTrans,
    createPaymentReportSoport,
    searchPaymentReportNotification,
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