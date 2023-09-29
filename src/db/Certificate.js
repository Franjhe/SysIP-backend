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
        let result = await pool.request()
        .query('select * from TMPOLIZA_AP');
        if(result.status){
            let pool = await sql.connect(sqlConfig);
            let query = await pool.request()
            .query('select * from TMPOLIZA_AP_COBER');
            return {    
                Certificate: result.recordsets,
                data: query.recordsets 
                    };
        }
        return { Certificate: result };
              
    }catch(err){
        return { error: err.message };
        }
}

export default {
    searchCertificate,
}