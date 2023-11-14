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
    return res
        .status(200)
        .send({
            status: true,
            data: {
                ptasa_casco: result[0].pcobertura_amplia, 
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
    // const resultArys = await emissionsService.createIndividualContractArys(req.body);
    if (resultArys.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: resultArys.error
            });
    }
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
          message: `Lo sentimos, la placa ingresada ya se encuentra registrada con la póliza N° ${vehicle[0].ccontratoflota}`,
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