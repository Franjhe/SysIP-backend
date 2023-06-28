import express from 'express';
import authenticate from '../../middlewares/authenticate.js';
import securityController from '../../controllers/securityController.js';

const router = express.Router();

router

    .post("/user/search", authenticate, securityController.searchUser)
    .post("/user/info", authenticate, securityController.infoUser)
    .post("/user/update", authenticate, securityController.updateUser)

export default router;