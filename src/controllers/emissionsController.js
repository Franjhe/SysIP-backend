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
    if(!result[0]){
        return res
        .status(200)
        .send({
            status: true,
        });
    }else{
        return res
        .status(200)
        .send({
            status: true,
            data: {
                ptasa_casco: result[0].pcobertura_amplia, 
                pperdida_total: result[0].pperdida_total, 
            }
        });
    }
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
                ccubii: result.result.recordset[0].CCUBII,
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
    // if (resultArys.error) {
    //     return res
    //         .status(500)
    //         .send({
    //             status: false,
    //             message: resultArys.error
    //         });
    // }
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

const updateUbii = async (req, res) => {
    const result = await emissionsService.updateUbii(req.body);
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
    const result2 = await emissionsService.updateContract(req.body);
    return res
        .status(200)
        .send({
            status: true,
            data: {
                message: 'Se ha generado exitósamente el contrato',
            }
        });
}

const searchRiotRate = async (req, res) => {
    const result = await emissionsService.searchRiotRate(req.body);
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
    if(req.body.xcobertura == 'Rcv'){
        return res
        .status(200)
        .send({
            status: true,
            data: {
                pmotin: 0
            }
        });
    }else{
        return res
        .status(200)
        .send({
            status: true,
            data: {
                pmotin: result[0].ptasa
            }
        });
    }

}

const createGroupContract = async (req, res) => {
    const result = await emissionsService.createGroupContract(req.body);
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
                message: 'Fino',
            }
        });
}

const searchQuotes = async (req, res) => {
    const result = await emissionsService.searchQuotes(req.body);
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
    let xcobertura;
    if(result[0].brcv == 1){
        xcobertura = 'Rcv';
    }else if(result[0].bamplia == 1){
        xcobertura = 'Cobertura Amplia';
    }else if(result[0].bperdida == 1){
        xcobertura = 'Perdida Total';
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                xnombre: result[0].xnombre, 
                xapellido: result[0].xapellido, 
                email: result[0].xcorreo, 
                xmarca: result[0].xmarca, 
                xmodelo: result[0].xmodelo, 
                xversion: result[0].xversion, 
                npasajeros: result[0].npasajero, 
                fano: result[0].qano, 
                cplan: result[0].cplan_rc, 
                xcobertura: xcobertura,
                mtotal_rcv: result[0].mtotal_rcv,
                ccorredor: result[0].ccorredor,
                xcorredor: result[0].xcorredor
            }
        });
}


const createEmmisionHealthGeneric = async (req, res) => {
    const createEmmision = await emissionsService.createEmmisionHealth(req.body);
    if (createEmmision.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: createEmmision.error
            });
    }

    return res
        .status(200)
        .send({status : true, messaje: "Se ha generado la Emisión de Salud con éxito"});
}


const createEmmisionAutomovileGeneric = async (req, res) => {
    const createEmmision = await emissionsService.createEmmisionAutomovil(req.body);
    if (createEmmision.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: createEmmision.error
            });
    }

    return res
        .status(200)
        .send({status : true, messaje: "Se ha generado la Emisión de Automovil con éxito"});
}


const searchRates = async (req, res) => {
    let message;
    let casco = false
    const result = await emissionsService.searchRates(req.body);
    if (result.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: result.error
            });
    }
    if(!result[0]){
        message = 'No es posible cotizar/emitir cobertura de casco por la antigüedad del vehículo';
        casco = false
        return res
        .status(200)
        .send({
            status: true,
            message: message,
            casco: casco
        });
    }else{
        casco = true;
        return res
        .status(200)
        .send({
            status: true,
            casco: casco
        });
    }
}

export default {
    searchHullPrice,
    executePremiumAmount,
    createIndividualContract,
    searchAllContract,
    searchPropietary,
    searchVehicle,
    updateUbii,
    searchRiotRate,
    createGroupContract,
    searchQuotes,
    createEmmisionHealthGeneric,
    createEmmisionAutomovileGeneric,
    searchRates
}