import httpService  from '../service/apiclient.js';
import Coin from '../db/Moneda.js';
import cron from 'node-cron';
import moment from 'moment';

const Update = cron.schedule('* * * * *', async () => {
    try {

      const url = 'https://pydolarvenezuela-api.vercel.app/api/v1/dollar?page=bcv';
      const time = moment().tz('America/Caracas').format('HH:mm');

      if (['9:05','9:15','13:01','13:15','17:15'].includes(time)) {
        const tasa = await httpService(url);
        const bcv = tasa.monitors.usd.price;
  
        const monedaMaster = await Coin.updateMaster(bcv);
        if (monedaMaster.error) {
          throw new Error(monedaMaster.error);
        }
  
        const monedaHistory = await Coin.updateHistory(bcv);
        if (monedaHistory.error) {
          throw new Error(monedaHistory.error);
        }
        
        return monedaMaster;
      }
    } catch (error) {
      console.error('Error en la actualización:', error.message);
      throw error; // Retransmitir el error para un manejo centralizado
    }
  });
  
  export default Update;

