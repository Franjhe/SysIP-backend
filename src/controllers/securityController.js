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
    return res
        .status(200)
        .send({
            status: true,
            data: {
                message: 'Usuario Creado exitosamente.'
            }
        });
}

const deleteUser = async (req, res) => {
    const resultDelete = await securityService.deleteUser(req.body);
    if (resultDelete.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: resultDelete.permissionError
            });
    }
    if (resultDelete.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: resultDelete.error
            });
        }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                message: 'El usuario ha sido eliminado exitosamente'
            }
        });
}

const searchDepartament = async (req, res) => {
    const departaments = await securityService.searchDepartament();
    if (departaments.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: departaments.permissionError
            });
    }
    if (departaments.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: departaments.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                departaments: departaments
            }
        });
}

const infoDepartament = async (req, res) => {
    const infoDep= await securityService.infoDepartament(req.body);
    if (infoDep.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: infoDep.permissionError
            });
    }
    if (infoDep.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: infoDep.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                xdepartamento: infoDep.xdepartamento
            }
        });
}

const updateDepartament = async (req, res) => {
    const updateDep = await securityService.updateDepartament(req.body);
    if (updateDep.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: updateDep.permissionError
            });
    }
    if (updateDep.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: updateDep.error
            });
        }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                message: 'Departamento Modificado exitosamente.'
            }
        });
}

const createDepartament = async (req, res) => {
    const createDep = await securityService.createDepartament(req.body);
    if (createDep.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: createDep.permissionError
            });
    }
    if (createDep.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: createDep.error
            });
        }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                message: 'Departamento Creado exitosamente.'
            }
        });
}

const deleteDepartament = async (req, res) => {
    const resultDeleteDep = await securityService.deleteDepartament(req.body);
    if (resultDeleteDep.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: resultDeleteDep.permissionError
            });
    }
    if (resultDeleteDep.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: resultDeleteDep.error
            });
        }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                message: 'El Departamento ha sido eliminado exitosamente'
            }
        });
}

const searchRol = async (req, res) => {
    const rols = await securityService.searchRol();
    if (rols.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: rols.permissionError
            });
    }
    if (rols.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: rols.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                rols: rols
            }
        });
}

const infoRol = async (req, res) => {
    const infR= await securityService.infoRol(req.body);
    if (infR.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: infR.permissionError
            });
    }
    if (infR.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: infR.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                cdepartamento: infR.cdepartamento,
                xrol: infR.xrol,
                xdepartamento: infR.xdepartamento,
                bcrear: infR.bcrear,
                bmodificar: infR.bmodificar,
                bconsultar: infR.bconsultar,
                beliminar: infR.beliminar,
            }
        });
}

const updateRol = async (req, res) => {
    const updateR = await securityService.updateRol(req.body);
    if (updateR.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: updateR.permissionError
            });
    }
    if (updateR.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: updateR.error
            });
        }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                message: 'Rol Modificado exitosamente.'
            }
        });
}

const createRol = async (req, res) => {
    const createR = await securityService.createRol(req.body);
    if (createR.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: createR.permissionError
            });
    }
    if (createR.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: createR.error
            });
        }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                message: 'Rol Creado exitosamente.'
            }
        });
}

const deleteRol = async (req, res) => {
    const resultDeleteRol = await securityService.deleteRol(req.body);
    if (resultDeleteRol.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: resultDeleteRol.permissionError
            });
    }
    if (resultDeleteRol.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: resultDeleteRol.error
            });
        }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                message: 'El Rol ha sido eliminado exitosamente'
            }
        });
}

const searchMainMenu = async (req, res) => {
    const mainMenu = await securityService.searchMainMenu();
    if (mainMenu.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: mainMenu.permissionError
            });
    }
    if (mainMenu.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: mainMenu.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                mainMenu: mainMenu
            }
        });
}

const searchMenu = async (req, res) => {
    const MenuResult = await securityService.searchMenu();
    if (MenuResult.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: MenuResult.permissionError
            });
    }
    if (MenuResult.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: MenuResult.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                Menu: MenuResult
            }
        });
}

const searchSubMenu = async (req, res) => {
    const SubMenuResult = await securityService.searchSubMenu();
    if (SubMenuResult.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: SubMenuResult.permissionError
            });
    }
    if (SubMenuResult.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: SubMenuResult.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                Submenu: SubMenuResult
            }
        });
}

export default {
  //Usuarios
    searchUser,
    infoUser,
    updateUser,
    createUser,
    deleteUser,

  //Departamentos
    searchDepartament,
    infoDepartament,
    updateDepartament,
    createDepartament,
    deleteDepartament,

  //Roles
    searchRol,
    infoRol,
    updateRol,
    createRol,
    deleteRol,

  //Menu
    searchMainMenu,
    searchMenu,
    searchSubMenu
}