import express from 'express';
import authenticate from '../../middlewares/authenticate.js';
import valrepController from '../../controllers/valrepController.js';

const router = express.Router();

router

    .get("/trade",valrepController.getTrade)
    .get("/coin", valrepController.getCoin)
    .post("/client", authenticate, valrepController.getClient)
    .post("/brokers", authenticate, valrepController.getBrokers)
    .post("/departament", authenticate, valrepController.getDepartament)
    .post("/rol", authenticate, valrepController.getRol)
    .post("/main-menu", authenticate, valrepController.getMainMenu)
    .post("/menu", authenticate, valrepController.getMenu)
    .post("/submenu", authenticate, valrepController.getSubMenu)
    .post("/user", authenticate, valrepController.getUser)
    .post("/park", authenticate, valrepController.getPark)
    .post("/state", authenticate, valrepController.getState)
    .post("/city", authenticate, valrepController.getCity)
    .post("/brand", authenticate, valrepController.getBrand)
    .post("/model", authenticate, valrepController.getModel)
    .post("/version", authenticate, valrepController.getVersion)
    .post("/color", authenticate, valrepController.getColor)
    .post("/rates", authenticate, valrepController.getRates)
    .post("/type-vehicle", authenticate, valrepController.getTypeVehicle)
    .post("/utility-rechange", authenticate, valrepController.getUtilityRechange)
    .post("/utility", authenticate, valrepController.getUtility)
    .post("/class", authenticate, valrepController.getClass)
    .post("/plan", authenticate, valrepController.getPlan)
    .post("/accesories", authenticate, valrepController.getAccesories)
    .post("/method-of-payment", authenticate, valrepController.getMethodOfPayment)
    .post("/takers", authenticate, valrepController.getTakers)
    .post("/type-of-payment", authenticate, valrepController.getTypeOfPayment)
    .post("/bank",  valrepController.getBank)
    .post("/target-bank",  valrepController.getTargetBank)
    
export default router;