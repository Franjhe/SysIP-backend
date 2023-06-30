import securityService from '../service/securityService.js';

const searchUser = async (req, res) => {
    const users = await securityService.searchUser();
    if (users.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: users.permissionError
            });
    }
    if (users.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: users.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                users: users
            }
        });
}

const infoUser = async (req, res) => {
    const info = await securityService.infoUser(req.body);
    if (info.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: info.permissionError
            });
    }
    if (info.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: info.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                xnombre: info.xnombre,
                xapellido: info.xapellido,
                xlogin: info.xlogin,
                xusuario: info.xusuario,
                xcorreo: info.xcorreo,
                xobservacion: info.xobservacion,
                cdepartamento: info.cdepartamento,
                crol: info.crol
            }
        });
}

const updateUser = async (req, res) => {
    const update = await securityService.updateUser(req.body);
    if (update.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: update.permissionError
            });
    }
    if (update.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: update.error
            });
        }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                message: 'Usuario Modificado exitosamente.'
            }
        });
}

const createUser = async (req, res) => {
    const create = await securityService.createUser(req.body);
    if (create.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: create.permissionError
            });
    }
    if (create.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: create.error
            });
        }

        console.log(create)
    return res
        .status(200)
        .send({
            status: true,
            data: {
                message: 'Usuario Creado exitosamente.'
            }
        });
}

export default {
    searchUser,
    infoUser,
    updateUser,
    createUser
}