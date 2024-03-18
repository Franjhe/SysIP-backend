import Emissions from '../db/Emissions.js';

import httpService  from './apiclient.js';

const searchHullPrice = async (searchHullPrice) => {
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

    const url = 'https://pydolarvenezuela-api.vercel.app/api/v1/dollar?page=bcv';

    try {
        const response = await httpService(url);
        let bcv = response.monitors.usd.price
        const result = await Emissions.createIndividualContract(createIndividualContract,bcv);
        if (result.error) {
            return {
                error: result.error
            }
        }
        return result;
    } catch (error) {
        console.error('Ooops. Ha ocurrido un error:', error.message);
        return {
            error: error.message
        };
    }


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
    const url = 'https://pydolarvenezuela-api.vercel.app/api/v1/dollar?page=bcv';
    const response = await httpService(url);
    let bcv = response.monitors.usd.price
    const result = await Emissions.createGroupContract(createGroupContract, bcv);
    if (result.error) {
        return {
            error: result.error
        }
    }
    return result;
}

const searchQuotes = async (searchQuotes) => {
    const result = await Emissions.searchQuotes(searchQuotes);
    if (result.error) {
        return {
            error: result.error
        }
    }
    return result;
}


const createEmmisionHealth = async (create) => {

    const url = 'https://pydolarvenezuela-api.vercel.app/api/v1/dollar?page=bcv';

    try {
        const response = await httpService(url);
        let bcv = response.monitors.usd.price

        const truncateTables = await Emissions.deleteEmmisionGHB(create);

        const createEmmisionBen = await Emissions.createEmmisionGHB(create);
        if (createEmmisionBen.error) {
            return {
                error: createEmmisionBen.error
            }
        }

        const createEmmisionAseg = await Emissions.createEmmisionGHA(create);
        if (createEmmisionAseg.error) {
            return {
                error: createEmmisionAseg.error
            }
        }

        const createEmmision = await Emissions.createEmmisionGH(create,bcv);
        if (createEmmision.error) {
            return {
                error: createEmmision.error
            }
        }

        return createEmmision;

    } catch (error) {
        console.error('Ooops. Ha ocurrido un error:', error.message);
        return {
            error: error.message
        };
    }


}


const createEmmisionAutomovil = async (create) => {
    const url = 'https://pydolarvenezuela-api.vercel.app/api/v1/dollar?page=bcv';

    try {
        const response = await httpService(url);
        let bcv = response.monitors.usd.price
        const createEmmision = Emissions.createEmmisionAutomovile(create, bcv);
        if (createEmmision.error) {
            return {
                error: createEmmision.error
            };
        }

        return createEmmision;
    } catch (error) {
        console.error('Ooops. Ha ocurrido un error:', error.message);
        return {
            error: error.message
        };
    }
};
    
const searchRates = async (searchRates) => {
    const result = await Emissions.searchRates(searchRates);
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
    createGroupContract,
    searchQuotes,
    createEmmisionHealth,
    searchRates,
    createEmmisionAutomovil
}