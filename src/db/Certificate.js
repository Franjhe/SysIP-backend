import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import sql from "mssql";

const sqlConfig = {
    user: process.env.USER_BD,
    password: process.env.PASSWORD_BD,
    server: process.env.SERVER_BD,
    database: process.env.NAME_BD,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}

const sqlConfigLM = {
    user: process.env.USER_BD_LM,
    password: process.env.PASSWORD_BD_LM,
    server: process.env.SERVER_BD,
    database: process.env.NAME_BD_LM,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}

const searchCertificate = async () => {
    try{
        let pool = await sql.connect(sqlConfig);
        let resultP = await pool.request()
        .query('select * from TMPOLIZA_AP');

        if(resultP.rowsAffected > 0){

            let poliza =  resultP.recordset[0].cpoliza

            let pool = await sql.connect(sqlConfig);
            let resultC = await pool.request()

            .input('cpoliza', sql.Numeric(20, 0), poliza)
            .query('SELECT * FROM TMPOLIZA_AP_COBER WHERE cpoliza = @cpoliza ');


            if(resultC.rowsAffected > 0){

                let poliza =  resultP.recordset[0].cpoliza
    
                let pool = await sql.connect(sqlConfig);
                let resultB = await pool.request()
                .input('cpoliza', sql.Numeric(20, 0), poliza)
                .query('SELECT * FROM TMPOLIZA_BEN WHERE cpoliza = @cpoliza ');
        
                return {    
                    beneficiario: resultB.recordsets,
                    poliza: resultP.recordsets,
                    cobertura: resultC.recordsets,
                    };
            }

        }
        
              
    }catch(err){
        return { error: err.message };
        }
}

export default {
    searchCertificate,
}