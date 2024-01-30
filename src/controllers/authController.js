import authService from '../service/authService.js';

const createJWT = async (req, res) => {
    const xlogin = req.body.xlogin;
    const verifiedUsername = await authService.verifyIfUsernameExists(xlogin);
    if (verifiedUsername.error) { 
        res
            .status(verifiedUsername.code)
            .send({ 
                status: false,
                message: verifiedUsername.error
            });
        return;
    }
    const xcontrasena = req.body.xcontrasena;
    const verifiedPassword = await authService.verifyIfPasswordMatchs(xlogin, xcontrasena);
    if (verifiedPassword.error) { 
        res
            .status(verifiedPassword.code)
            .send({ 
                status: false,
                message: verifiedPassword.error
            });
        return;
    }
    const user = await authService.getOneUser(xlogin);
    if (user.error) {
        return res
            .status(user.code)
            .send({
                status: false,
                message: user.error
            });
    }
    const jwt = authService.createJWT(user);
    res
        .status(201).send({ 
            status: true, 
            message: 'Usuario Autenticado',
            data: {
                cusuario: user.cusuario,
                xusuario: user.xusuario,
                cdepartamento: user.cdepartamento,
                crol: user.crol,
                bcrear: user.bcrear,
                bconsultar: user.bconsultar,
                bmodificar: user.bmodificar,
                beliminar: user.beliminar,
                ccorredor: user.ccorredor,
                xcorredor: user.xcorredor,
                token: 'Bearer ' + jwt
            }
        });
    return;
};

const getUserModules = async (req, res) => {
    const userModules = await authService.getUserModules(req.body.cusuario);
    if (userModules.error) {
        return res
            .status(userModules.code)
            .send({
                status: false,
                message: userModules.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                groups: userModules
            }
        })
}

const createJWTPHP = async (req, res) => {
    const user = await authService.getOneUserPhp(req.body);
    if (user.error) {
        return res
            .status(user.code)
            .send({
                status: false,
                message: user.error
            });
    }
    const jwt = authService.createJWTPHP(user);
    res
        .status(201).send({ 
            status: true, 
            message: 'Usuario Autenticado',
            data: {
                cusuario: user.cusuario,
                xusuario: user.xusuario,
                cdepartamento: user.cdepartamento,
                crol: user.crol,
                bcrear: user.bcrear,
                bconsultar: user.bconsultar,
                bmodificar: user.bmodificar,
                beliminar: user.beliminar,
                ccorredor: user.ccorredor,
                xcorredor: user.xcorredor,
                token: 'Bearer ' + jwt
            }
        });
    return;
};

export default {
    createJWT,
    getUserModules,
    createJWTPHP
}