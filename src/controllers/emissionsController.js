import emissionsService from '../service/emissionsService.js';

const searchHullPrice = async (req, res) => {
    const result = await emissionsService.searchHullPrice(req.body);
    if (result.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: result.permissionError
            });
    }
    if (result.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: result.error
            });
    }
    const rates = await emissionsService.searchOtherPrice(req.body);
    let jsonList = [];
    for(let i = 0; i < rates.length; i++){
        jsonList.push({ptarifa: rates[i].ptarifa});
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                ptasa_casco: result,
                ptarifa: jsonList,
            }
        });
}

const executePremiumAmount = async (req, res) => {
    const result = await emissionsService.executePremiumAmount(req.body);
    if (result.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: result.permissionError
            });
    }
    if (result.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: result.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                mprima: result.result.recordset[0].MPRIMA,
            }
        });
}

export default {
    searchHullPrice,
    executePremiumAmount
}