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

const createPaymentReport = async (req, res) => {
    console.log(req.body)
    const searchReceipt = await collectionService.createPaymentReport(req.body);

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
            message: 'Su reporte de pago ha sido registrado exitosamente.'
            
        });
}

const searchPaymentReportNotification= async (req, res) => {
    const searchPaymentReport = await collectionService.searchPaymentReportData(req.body.cedula);

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

export default {
    searchCollectionbyClient,
    createPaymentReport,
    searchPaymentReportNotification,
    searchPaymentPending
}