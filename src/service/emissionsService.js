import Emissions from '../db/Emissions.js';

const searchHullPrice = async (searchHullPrice) => {
    console.log(searchHullPrice)
    const result = await Emissions.searchHullPrice(searchHullPrice);
    if (result.error) {
        return {
            error: result.error
        }
    }
    return result;
} 

const searchOtherPrice = async (searchOtherPrice) => {
    const rates = await Emissions.searchOtherPrice(searchOtherPrice);
    if (rates.error) {
        return {
            error: rates.error
        }
    }
    return rates;
}

const executePremiumAmount = async (executePremiumAmount) => {
    const result = await Emissions.executePremiumAmount(executePremiumAmount);
    if (result.error) {
        return {
            error: result.error
        }
    }
    return result;
}

const createIndividualContract = async (createIndividualContract) => {
    const result = await Emissions.createIndividualContract(createIndividualContract);
    if (result.error) {
        return {
            error: result.error
        }
    }
    return result;
}

const searchContractIndividual = async () => {
    const contract = await Emissions.searchContractIndividual();
    if (contract.error) {
        return {
            error: contract.error
        }
    }
    return contract;
}

// const createIndividualContractArys = async (createIndividualContract) => {
//     const result = await Emissions.createIndividualContractArys(createIndividualContract);
//     if (result.error) {
//         return {
//             error: result.error
//         }
//     }
//     return result;
// }

const searchAllContract = async (searchAllContract) => {
    const result = await Emissions.searchAllContract(searchAllContract);
    if (result.error) {
        return {
            error: result.error
        }
    }
    return result;
}

const searchPropietary = async (searchPropietary) => {
    const propietary = await Emissions.searchPropietary(searchPropietary);
    if (propietary.error) {
        return {
            error: propietary.error
        }
    }
    return propietary;
}

const searchVehicle = async (searchVehicle) => {
    const vehicle = await Emissions.searchVehicle(searchVehicle);
    if (vehicle.error) {
        return {
            error: vehicle.error
        }
    }
    return vehicle;
}

const updateUbii = async (updateUbii) => {
    const result = await Emissions.updateUbii(updateUbii);
    if (result.error) {
        return {
            error: result.error
        }
    }
    return result;
}

const updateContract = async (updateContract) => {
    const result2 = await Emissions.updateContract(updateContract);
    if (result2.error) {
        return {
            error: result2.error
        }
    }
    return result2;
}

const searchRiotRate = async (searchRiotRate) => {
    const result = await Emissions.searchRiotRate(searchRiotRate);
    if (result.error) {
        return {
            error: result.error
        }
    }
    return result;
}

const createGroupContract = async (createGroupContract) => {
    const result = await Emissions.createGroupContract(createGroupContract);
    if (result.error) {
        return {
            error: result.error
        }
    }
    return result;
}

export default {
    searchHullPrice,
    searchOtherPrice,
    executePremiumAmount,
    createIndividualContract,
    searchContractIndividual,
    searchAllContract,
    searchPropietary,
    searchVehicle,
    updateUbii,
    updateContract,
    searchRiotRate,
    createGroupContract
}