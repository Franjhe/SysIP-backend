import express from 'express';
import authenticate from '../../middlewares/authenticate.js';
import securityController from '../../controllers/securityController.js';

const router = express.Router();

router

    //CRUD User.
    .post("/user/search", securityController.searchUser)
    .post("/user/info",   securityController.infoUser)
    .post("/user/update", securityController.updateUser)
    .post("/user/create", securityController.createUser)
    .post("/user/delete", securityController.deleteUser)

    //CRUD Departament.
    .post("/departament/search", securityController.searchDepartament)
    .post("/departament/info",   securityController.infoDepartament)
    .post("/departament/update", securityController.updateDepartament)
    .post("/departament/create", securityController.createDepartament)
    .post("/departament/delete", securityController.deleteDepartament)

    //CRUD Rol
    .post("/rol/search", securityController.searchRol)
    .post("/rol/info",   securityController.infoRol)
    .post("/rol/update", securityController.updateRol)
    .post("/rol/create", securityController.createRol)
    .post("/rol/delete", securityController.deleteRol)

    //CRUD Menu
    .post("/menu/search/main-menu",     securityController.searchMainMenu)
    .post("/menu/search/menu",          securityController.searchMenu)
    .post("/menu/search/submenu",       securityController.searchSubMenu)
    .post("/menu/info/main-menu",       securityController.infoMainMenu)
    .post("/menu/info/menu",            securityController.infoMenu)
    .post("/menu/info/submenu",         securityController.infoSubMenu)
    .post("/menu/update/main-menu",     securityController.updateMainMenu)
    .post("/menu/update/menu",          securityController.updateMenu)
    .post("/menu/update/submenu",       securityController.updateSubMenu)
    .post("/menu/create/main-menu",     securityController.createMainMenu)
    .post("/menu/create/menu",          securityController.createMenu)
    .post("/menu/create/submenu",       securityController.createSubMenu)
    .post("/menu/delete/main-menu",     securityController.deleteMainMenu)
    .post("/menu/delete/menu",          securityController.deleteMenu)
    .post("/menu/delete/submenu",       securityController.deleteSubMenu)
    .post("/menu/create/distribution",  securityController.distributionMenu)


export default router;