import chatBoot from '../db/virtualAssistant.js';

const getIdClient = async (cedula) => {
    const clientId = await chatBoot.searchClient(cedula);
    if (clientId.error) {
        return {
            error: clientId.error
        }
    }
    return clientId;
};

const getPoliza = async (cedula) => {
    const poliza = await chatBoot.searchPoliza(cedula);
    if (poliza.error) {
        return {
            error: poliza.error
        }
    }
    return poliza;
};

export default {
    getIdClient,
    getPoliza
}