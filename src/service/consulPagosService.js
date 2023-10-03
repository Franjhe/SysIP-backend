import ConsulPagos from '../db/ConsulPagos.js';

const createUsersFromConsulPagos = async (createUsersFromConsulPagos) => {
    const createCP = await ConsulPagos.createUsersFromConsulPagos(createUsersFromConsulPagos);
    if (createCP.error) {
        return {
            error: createCP.error
        }
    }
    return createCP;
}

export default {
    createUsersFromConsulPagos
}