import Security from '../db/Security.js';

const searchUser = async () => {
    const users = await Security.searchUser();
    if (users.error) {
        return {
            error: users.error
        }
    }
    return users;
}

const infoUser = async (infoUser) => {
    const info = await Security.infoUser(infoUser);
    if (info.error) {
        return {
            error: info.error
        }
    }
    return info;
}

const updateUser = async (updateUser) => {
    const update = await Security.updateUser(updateUser);
    if (update.error) {
        return {
            error: update.error
        }
    }
    return update;
}

const createUser = async (createUser) => {
    const create = await Security.createUser(createUser);
    if (create.error) {
        return {
            error: create.error
        }
    }
    return create;
}

const deleteUser = async (deleteUser) => {
    const resultDelete = await Security.deleteUser(deleteUser);
    if (resultDelete.error) {
        return {
            error: resultDelete.error
        }
    }
    return resultDelete;
}

const searchDepartament = async () => {
    const departaments = await Security.searchDepartament();
    if (departaments.error) {
        return {
            error: departaments.error
        }
    }
    return departaments;
}

const infoDepartament = async (infoDepartament) => {
    const infoDep = await Security.infoDepartament(infoDepartament);
    if (infoDep.error) {
        return {
            error: infoDep.error
        }
    }
    return infoDep;
}

const updateDepartament = async (updateDepartament) => {
    const updateDep = await Security.updateDepartament(updateDepartament);
    if (updateDep.error) {
        return {
            error: updateDep.error
        }
    }
    return updateDep;
}

const createDepartament = async (createDepartament) => {
    const createDep = await Security.createDepartament(createDepartament);
    if (createDep.error) {
        return {
            error: createDep.error
        }
    }
    return createDep;
}

const deleteDepartament = async (deleteDepartament) => {
    const resultDeleteDep = await Security.deleteDepartament(deleteDepartament);
    if (resultDeleteDep.error) {
        return {
            error: resultDeleteDep.error
        }
    }
    return resultDeleteDep;
}

const searchRol = async () => {
    const rols = await Security.searchRol();
    if (rols.error) {
        return {
            error: rols.error
        }
    }
    return rols;
}

const infoRol = async (infoRol) => {
    const infR = await Security.infoRol(infoRol);
    if (infR.error) {
        return {
            error: infR.error
        }
    }
    return infR;
}

const updateRol = async (updateRol) => {
    const updateR = await Security.updateRol(updateRol);
    if (updateR.error) {
        return {
            error: updateR.error
        }
    }
    return updateR;
}

const createRol = async (createRol) => {
    const createR = await Security.createRol(createRol);
    if (createR.error) {
        return {
            error: createR.error
        }
    }
    return createR;
}

const deleteRol = async (deleteRol) => {
    const resultDeleteRol = await Security.deleteRol(deleteRol);
    if (resultDeleteRol.error) {
        return {
            error: resultDeleteRol.error
        }
    }
    return resultDeleteRol;
}

const searchMainMenu = async () => {
    const mainMenu = await Security.searchMainMenu();
    if (mainMenu.error) {
        return {
            error: mainMenu.error
        }
    }
    return mainMenu;
}

const searchMenu = async () => {
    const MenuResult = await Security.searchMenu();
    if (MenuResult.error) {
        return {
            error: MenuResult.error
        }
    }
    return MenuResult;
}

const searchSubMenu = async () => {
    const SubMenuResult = await Security.searchSubMenu();
    if (SubMenuResult.error) {
        return {
            error: SubMenuResult.error
        }
    }
    return SubMenuResult;
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