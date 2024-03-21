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
    const returnData = await commissionsService.searchComisionesProductores();
    if (returnData.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: returnData.permissionError
            });
    }
    if (returnData.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: returnData.error
            });
    }

    return res
        .status(200)
        .send({
            status: true,
            returnData,
            message: 'Consulta exitosa.'
            
        });
}
const searchInsurerCommissions = async (req, res) => {
    
    const returnData = await commissionsService.searchInsurerCommissions(req.body);
    if (returnData.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: returnData.permissionError
            });
    }
    if (returnData.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: returnData.error
            });
    }

    return res
        .status(200)
        .send({
            status: true,
            returnData,
            message: 'Consulta exitosa.'
            
        });
}
const searchDataProductor = async (req, res) => {
    
    const returnData = await commissionsService.searchDataProductor(req.params.id);
    if (returnData.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: returnData.permissionError
            });
    }
    if (returnData.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: returnData.error
            });
    }

    return res
        .status(200)
        .send({
            status: true,
            returnData,
            message: 'Consulta exitosa.'
            
        });
}
const searchPaymentRequests = async (req, res) => {
    
    const returnData = await commissionsService.searchPaymentRequests(req.body);
    if (returnData.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: returnData.permissionError
            });
    }
    if (returnData.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: returnData.error
            });
    }

    return res
        .status(200)
        .send({
            status: true,
            returnData,
            message: 'Consulta exitosa.'
            
        });
}
const createPaymentRequests = async (req, res) => {
    
    const returnData = await commissionsService.createPaymentRequests(req.body);
    if (returnData.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: returnData.permissionError
            });
    }
    if (returnData.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: returnData.error
            });
    }

    return res
        .status(200)
        .send({
            status: true,
            returnData,
            message: 'Consulta exitosa.'
            
        });
}
const payPaymentRequests = async (req, res) => {
    
    const returnData = await commissionsService.payPaymentRequests(req.body);
    if (returnData.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: returnData.permissionError
            });
    }
    if (returnData.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: returnData.error
            });
    }

    return res
        .status(200)
        .send({
            status: true,
            returnData,
            message: 'Consulta exitosa.'
            
        });
}
const detailPaymentRequest = async (req, res) => {
    
    const returnData = await commissionsService.detailPaymentRequest(req.body);
    if (returnData.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: returnData.permissionError
            });
    }
    if (returnData.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: returnData.error
            });
    }

    return res
        .status(200)
        .send({
            status: true,
            returnData,
            message: 'Consulta exitosa.'
            
        });
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