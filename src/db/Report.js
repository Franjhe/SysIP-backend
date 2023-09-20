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

const searchReceipt = async (searchReceipt) => {
    try{
        let pool = await sql.connect(sqlConfigLM);
        let result = await pool.request()
        .input('iestado', sql.Int, searchReceipt.id_status)
        .input('fdesde', sql.DateTime, searchReceipt.fdesde)
        .input('fhasta', sql.DateTime, searchReceipt.fhasta)
        .execute('inBPrimas_Pend_Cob');
         let query= await pool.request()
        .query('select * from tmprimas_pend_cob');
        await pool.close();
        return { receipt: query };
              
    }catch(err){
        return { error: err.message };
        }
}

export default {
    searchReceipt,
}