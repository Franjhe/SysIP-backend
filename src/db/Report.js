import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import sql from "mssql";
import EmailService from "./../config/email.service.js";
import ejs from "ejs";
import * as fs from 'node:fs/promises';
const emailService = new EmailService();

// const sqlConfig = {
//     user: process.env.USER_BD,
//     password: process.env.PASSWORD_BD,
//     server: process.env.SERVER_BD,
//     database: process.env.NAME_BD,
//     requestTimeout: 30000,
//     options: {
//         encrypt: true,
//         trustServerCertificate: true
//     }
// }

const sqlConfigLM = {
    user: process.env.USER_BD_LM,
    password: process.env.PASSWORD_BD_LM,
    server: process.env.SERVER_BD,
    database: process.env.NAME_BD_LM,
    requestTimeout: 60000,
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

const sendMailReportSys = async(estatus) =>{

    const template = await fs.readFile('src/templates/reports.ejs', 'utf-8');
    const datosPlantilla = {
        nombre: 'Juan',
        url : process.env.URLReport,
        estatus : estatus

    };

    
    const html = ejs.render(template, datosPlantilla);
    try {
        const enviado = await emailService.enviarCorreo('michaelarismendi2@gmail.com@lamundialdeseguros.com', 'Asunto del correo', html);
        if (enviado) {
        console.log('Correo enviado con éxito');
        } else {
        console.log('Error al enviar el correo');
        }
    } catch (error) {
        console.error('Error al procesar el correo:', error);
    }
    
}

export default {
    searchReceipt,
    sendMailReportSys
}