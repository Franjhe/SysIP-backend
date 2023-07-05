import express from 'express';
import authenticate from '../../middlewares/authenticate.js';
import securityController from '../../controllers/securityController.js';

const router = express.Router();

router

    //CRUD User.
    .post("/user/search", authenticate, securityController.searchUser)
    .post("/user/info",   authenticate, securityController.infoUser)
    .post("/user/update", authenticate, securityController.updateUser)
    .post("/user/create", authenticate, securityController.createUser)
    .post("/user/delete", authenticate, securityController.deleteUser)

    //CRUD Departament.
    .post("/departament/search", authenticate, securityController.searchDepartament)
    .post("/departament/info",   authenticate, securityController.infoDepartament)
    .post("/departament/update", authenticate, securityController.updateDepartament)
    .post("/departament/create", authenticate, securityController.createDepartament)
    .post("/departament/delete", authenticate, securityController.deleteDepartament)

    //CRUD Rol
    .post("/rol/search", authenticate, securityController.searchRol)
    .post("/rol/info",   authenticate, securityController.infoRol)
    .post("/rol/update", authenticate, securityController.updateRol)
    .post("/rol/create", authenticate, securityController.createRol)
    .post("/rol/delete", authenticate, securityController.deleteRol)

    //CRUD Menu
    .post("/menu/search/main-menu", authenticate, securityController.searchMainMenu)
    .post("/menu/search/menu",      authenticate, securityController.searchMenu)
    .post("/menu/search/submenu",   authenticate, securityController.searchSubMenu)
    .post("/menu/info/main-menu",   authenticate, securityController.infoMainMenu)
    .post("/menu/info/menu",        authenticate, securityController.infoMenu)
    .post("/menu/info/submenu",     authenticate, securityController.infoSubMenu)
    .post("/menu/update/main-menu", authenticate, securityController.updateMainMenu)
    .post("/menu/update/menu",      authenticate, securityController.updateMenu)
    .post("/menu/update/submenu",   authenticate, securityController.updateSubMenu)


export default router;