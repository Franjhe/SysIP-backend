import express from 'express';
import authenticate from '../../middlewares/authenticate.js';
import valrepController from '../../controllers/valrepController.js';

const router = express.Router();

router

    .post("/trade", authenticate, valrepController.getTrade)
    .post("/coin", authenticate, valrepController.getCoin)
    .post("/client", authenticate, valrepController.getClient)
    .post("/brockers", authenticate, valrepController.getBrokers)
    .post("/departament", authenticate, valrepController.getDepartament)
    .post("/rol", authenticate, valrepController.getRol)
    .post("/main-menu", authenticate, valrepController.getMainMenu)
    .post("/menu", authenticate, valrepController.getMenu)
    .post("/user", authenticate, valrepController.getUser)

export default router;