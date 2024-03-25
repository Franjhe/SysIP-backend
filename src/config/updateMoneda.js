import httpService  from '../service/apiclient.js';
import Coin from '../db/Moneda.js';
import cron from 'node-cron';

const Update = cron.schedule('0 * * * *', () => {

    const url = 'https://pydolarvenezuela-api.vercel.app/api/v1/dollar?page=bcv';
    // Get the current time in the customer's time zone
    const time = moment().tz('America/Caracas').format('HH:mm')

    console.log(time)
  
    // Check if the time is 8:00 AM
    if (time === '09:15') {
        try {
            const tasa =  httpService(url);
            let bcv = tasa.monitors.usd.price
    
            const monedaMaster =  Coin.updateMaster(bcv);
            if (monedaMaster.error) {
                return {
                    error: monedaMaster.error
                }
            }
    
            const monedaHistory = Coin.updateHistory(bcv);
            if (monedaHistory.error) {
                return {
                    error: monedaHistory.error
                }
            }
    
            return monedaMaster;
        } catch (error) {
            console.error('Ooops. Ha ocurrido un error:', error.message);
            return {
                error: error.message
            };
        }
  
    }

    if (time === '13:15') {

        try {
            const tasa =  httpService(url);
            let bcv = tasa.monitors.usd.price
    
            const monedaMaster =  Coin.updateMaster(bcv);
            if (monedaMaster.error) {
                return {
                    error: monedaMaster.error
                }
            }
    
            const monedaHistory = Coin.updateHistory(bcv);
            if (monedaHistory.error) {
                return {
                    error: monedaHistory.error
                }
            }
    
            return monedaMaster;
        } catch (error) {
            console.error('Ooops. Ha ocurrido un error:', error.message);
            return {
                error: error.message
            };
        }
    }

    if (time === '17:15') {
        try {
            const tasa =  httpService(url);
            let bcv = tasa.monitors.usd.price
    
            const monedaMaster =  Coin.updateMaster(bcv);
            if (monedaMaster.error) {
                return {
                    error: monedaMaster.error
                }
            }
    
            const monedaHistory = Coin.updateHistory(bcv);
            if (monedaHistory.error) {
                return {
                    error: monedaHistory.error
                }
            }
    
            return monedaMaster;
        } catch (error) {
            console.error('Ooops. Ha ocurrido un error:', error.message);
            return {
                error: error.message
            };
        }
  
    }
  
})

export default Update;

