import consulPagosService from '../service/consulPagosService.js';

const createUsersFromConsulPagos = async (req, res) => {
    const createCP = await consulPagosService.createUsersFromConsulPagos(req.body);
    if (createCP.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: createCP.permissionError
            });
    }
    if (createCP.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: createCP.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                message: 'Se ha ingresado el usuario exitosamente.'
            }
        });
}

export default {
    createUsersFromConsulPagos,
}