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

const createIndividualContract = async (req, res) => {
    const result = await emissionsService.createIndividualContract(req.body);
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
    const contract = await emissionsService.searchContractIndividual();
    return res
        .status(200)
        .send({
            status: true,
            data: {
                ccontratoflota: contract.ccontratoflota,
            }
        });
}

const searchAllContract = async (req, res) => {
    const result = await emissionsService.searchAllContract(req.body);
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

    const combinedData = result.map(item => ({
        ccontratoflota: `${item.ccontratoflota}`,
        xnombre: `${item.xnombre} ${item.xapellido}`,
        xvehiculo: `${item.xmarca} - ${item.xmodelo} - ${item.xversion}`,
        xplaca: `${item.xplaca}`,
    }));

    return res
        .status(200)
        .send({
            status: true,
            data: {
                contract: combinedData,
            }
        });
}

const searchPropietary = async (req, res) => {
    const propietary = await emissionsService.searchPropietary(req.body);
    if (propietary.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: propietary.permissionError
            });
    }
    if (propietary.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: propietary.error
            });
    }
    if (!propietary[0]) {
        return res.status(500).send({
          status: false,
        });
    }else{
        return res
        .status(200)
        .send({
            status: true,
            data: {
                xnombre: propietary[0].xnombre,
                xapellido: propietary[0].xapellido,
                xtelefono_emp: propietary[0].xtelefonocasa,
                email: propietary[0].xemail,
                cestado: propietary[0].cestado,
                cciudad: propietary[0].cciudad,
                xdireccion: propietary[0].xdireccion,
            }
        });
    }

}

const searchVehicle = async (req, res) => {
    const vehicle = await emissionsService.searchVehicle(req.body);
    if (vehicle.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: vehicle.permissionError
            });
    }
    if (vehicle.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: vehicle.error
            });
    }
    if (vehicle[0]) {
        return res.status(200).send({
          status: true,
          message:
            'Lo sentimos, la placa ingresada ya se encuentra registrada en nuestro sistema. Por favor, verifique la información o comuníquese con nuestro servicio de atención al cliente para obtener asistencia adicional.',
        });
    }
    return res
        .status(200)
        .send({
            status: false
        });
}

export default {
    searchHullPrice,
    executePremiumAmount,
    createIndividualContract,
    searchAllContract,
    searchPropietary,
    searchVehicle
}