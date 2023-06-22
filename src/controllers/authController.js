import authService from '../services/authService.js';

const createJWT = async (req, res) => {
    const clogin = req.body.clogin;
    const verifiedUsername = await authService.verifyIfUsernameExists(clogin);
    if (verifiedUsername.error) { 
        res
            .status(verifiedUsername.code)
            .send({ 
                status: false,
                message: verifiedUsername.error
            });
        return;
    }
    const xclavesec = req.body.xclavesec;
    const verifiedPassword = await authService.verifyIfPasswordMatchs(clogin, xclavesec);
    if (verifiedPassword.error) { 
        res
            .status(verifiedPassword.code)
            .send({ 
                status: false,
                message: verifiedPassword.error
            });
        return;
    }
    const user = await authService.getOneUser(clogin);
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
                xusuario: user.xusuario,
                csucursal: user.csucursal,
                xsucursal: user.xsucursal,
                bmaster: user.bmaster,
                token: 'Bearer ' + jwt
            }
        });
    return;
};

const getUserModules = async (req, res) => {
    const userModules = await authService.getUserModules(res.locals.decodedJWT.cusuario);
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

export default {
    createJWT,
    getUserModules
}