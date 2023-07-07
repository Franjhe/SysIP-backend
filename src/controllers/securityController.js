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

const infoMainMenu = async (req, res) => {
    const infoMM = await securityService.infoMainMenu(req.body);
    if (infoMM.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: infoMM.permissionError
            });
    }
    if (infoMM.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: infoMM.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                xmenu: infoMM.xmenu,
                xicono: infoMM.xicono,
                xruta: infoMM.xruta,
            }
        });
}

const infoMenu = async (req, res) => {
    const infoM = await securityService.infoMenu(req.body);
    if (infoM.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: infoM.permissionError
            });
    }
    if (infoM.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: infoM.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                xmenu: infoM.xmenu,
                xmenuprincipal: infoM.xmenuprincipal,
                xruta: infoM.xruta,
            }
        });
}

const infoSubMenu = async (req, res) => {
    const infoSM = await securityService.infoSubMenu(req.body);
    if (infoSM.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: infoSM.permissionError
            });
    }
    if (infoSM.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: infoSM.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                xmenu: infoSM.xmenu,
                xmenuprincipal: infoSM.xmenuprincipal,
                xsubmenu: infoSM.xsubmenu,
                xrutasubmenu: infoSM.xrutasubmenu,
            }
        });
}

const updateMainMenu = async (req, res) => {
    const updateMM = await securityService.updateMainMenu(req.body);
    if (updateMM.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: updateMM.permissionError
            });
    }
    if (updateMM.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: updateMM.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                message: 'Menu Principal Modificado exitosamente.'
            }
        });
}

const updateMenu = async (req, res) => {
    const updateM = await securityService.updateMenu(req.body);
    if (updateM.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: updateM.permissionError
            });
    }
    if (updateM.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: updateM.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                message: 'Menu Modificado exitosamente.'
            }
        });
}

const updateSubMenu = async (req, res) => {
    const updateSM = await securityService.updateSubMenu(req.body);
    if (updateSM.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: updateSM.permissionError
            });
    }
    if (updateSM.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: updateSM.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                message: 'Sub-Menu Modificado exitosamente.'
            }
        });
}

const createMainMenu = async (req, res) => {
    const createMM = await securityService.createMainMenu(req.body);
    if (createMM.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: createMM.permissionError
            });
    }
    if (createMM.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: createMM.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                message: 'Menu Principal Creado exitosamente.'
            }
        });
}

const createMenu = async (req, res) => {
    const createM = await securityService.createMenu(req.body);
    if (createM.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: createM.permissionError
            });
    }
    if (createM.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: createM.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                message: 'Menu Creado exitosamente.'
            }
        });
}

const createSubMenu = async (req, res) => {
    const createSM = await securityService.createSubMenu(req.body);
    if (createSM.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: createSM.permissionError
            });
    }
    if (createSM.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: createSM.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                message: 'Sub-Menu Creado exitosamente.'
            }
        });
}

const deleteMainMenu = async (req, res) => {
    const resultDeleteMainMenu = await securityService.deleteMainMenu(req.body);
    if (resultDeleteMainMenu.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: resultDeleteMainMenu.permissionError
            });
    }
    if (resultDeleteMainMenu.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: resultDeleteMainMenu.error
            });
        }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                message: 'El Menu Principal ha sido eliminado exitosamente'
            }
        });
}

const deleteMenu = async (req, res) => {
    const resultDeleteMenu = await securityService.deleteMenu(req.body);
    if (resultDeleteMenu.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: resultDeleteMenu.permissionError
            });
    }
    if (resultDeleteMenu.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: resultDeleteMenu.error
            });
        }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                message: 'El Menu ha sido eliminado exitosamente'
            }
        });
}

const deleteSubMenu = async (req, res) => {
    const resultDeleteSubMenu = await securityService.deleteSubMenu(req.body);
    if (resultDeleteSubMenu.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: resultDeleteSubMenu.permissionError
            });
    }
    if (resultDeleteSubMenu.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: resultDeleteSubMenu.error
            });
        }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                message: 'El Sub-Menu ha sido eliminado exitosamente'
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
    searchSubMenu,
    infoMainMenu,
    infoMenu,
    infoSubMenu,
    updateMainMenu,
    updateMenu,
    updateSubMenu,
    createMainMenu,
    createMenu,
    createSubMenu,
    deleteMainMenu,
    deleteMenu,
    deleteSubMenu
}