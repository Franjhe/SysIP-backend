import ConsulPagos from '../db/ConsulPagos.js';

const createUsersFromConsulPagos = async (createUsersFromConsulPagos) => {

    const url = 'https://pydolarvenezuela-api.vercel.app/api/v1/dollar/page?page=bcv';

    try {
        const response = await httpService(url);
        let bcv = response.monitors.usd.price
        const createCP = await ConsulPagos.createUsersFromConsulPagos(createUsersFromConsulPagos,bcv);
        if (createCP.error) {
            return {
                error: createCP.error
            }
        }
        return createCP;
    } catch (error) {
        console.error('Ooops. Ha ocurrido un error:', error.message);
        return {
            error: error.message
        };
    }

}

export default {
    createUsersFromConsulPagos
}