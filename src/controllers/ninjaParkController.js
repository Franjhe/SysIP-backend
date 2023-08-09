import ninjaParkService from '../service/ninjaParkService.js';

const createUsersFromNinja = async (req, res) => {
    const createUN = await ninjaParkService.createUsersFromNinja(req.body);
    if (createUN.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: createUN.permissionError
            });
    }
    if (createUN.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: createUN.error
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

const searchUsersFromNinja = async (req, res) => {
    const search = await ninjaParkService.searchUsersFromNinja();
    if (search.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: search.permissionError
            });
    }
    if (search.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: search.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                list: search
            }
        });
}

const detailUsersFromNinja = async (req, res) => {
    const detail = await ninjaParkService.detailUsersFromNinja(req.body);
    if (detail.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: detail.permissionError
            });
    }
    if (detail.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: detail.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                list: detail
            }
        });
}

export default {
    createUsersFromNinja,
    searchUsersFromNinja,
    detailUsersFromNinja
}