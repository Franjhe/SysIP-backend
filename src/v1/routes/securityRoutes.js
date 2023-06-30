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

export default router;