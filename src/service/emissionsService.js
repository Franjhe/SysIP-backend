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

export default {
    searchHullPrice,
    searchOtherPrice,
    executePremiumAmount,
    createIndividualContract,
    searchContractIndividual,
    searchAllContract,
    searchPropietary,
    searchVehicle
}