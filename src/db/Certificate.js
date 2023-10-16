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

const getFleetContractDataQuery = async (fleetContractData) => {
    try{
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('cpais', sql.Numeric(4, 0), fleetContractData.cpais ? fleetContractData.cpais: undefined)
            .input('ccompania', sql.Int, fleetContractData.ccompania)
            .input('ccontratoflota', sql.Int, fleetContractData.ccontratoflota)
            .query('select * from VWBUSCARSUCONTRATOFLOTADATA where CCONTRATOFLOTA = @ccontratoflota and CCOMPANIA = @ccompania');
        //sql.close();
        return { result: result };
    }catch(err){
        return { error: err.message };
    }
}

 const getFleetContractOwnerDataQuery = async(fleetContractData, cpropietario) => {
    try{
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('cpais', sql.Numeric(4, 0), fleetContractData.cpais)
            .input('ccompania', sql.Int, fleetContractData.ccompania)
            .input('cpropietario', sql.Int, cpropietario)
            .query('select * from VWBUSCARPROPIETARIOXCONTRATOFLOTADATA where  CCOMPANIA = @ccompania and CPROPIETARIO = @cpropietario');
        //sql.close();
        return { result: result };
    }catch(err){
        return { error: err.message };
    }
}

const getContractClientData = async(ccliente) => {
    try{
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('ccliente', sql.Int, ccliente)
            .query('select * from VWBUSCARCLIENTEXCONTRATOFLOTADATA where CCLIENTE = @ccliente');
        //sql.close();
        return { result: result };
    }catch(err){
        return { error: err.message };
    }
}

const getPlanData = async(cplan) => {
    try{
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('cplan', sql.Int, cplan)
            .query('select * from PRPLAN_RC where CPLAN_RC = @cplan');
        //sql.close();
        return { result: result };
    }catch(err){
        return { error: err.message };
    }
}

const getPlanCoverages = async(cplan, ccontratoflota) => {
    try{
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('ccontratoflota', sql.Int, ccontratoflota)
            .query('select * from VWBUSCARCOBERTURASXCONTRATOFLOTA where ccontratoflota = @ccontratoflota');
        //sql.close();
        return { result: result };
    }catch(err){
        return { error: err.message };
    }
}

const getFleetContractServices = async(ccarga) => {
    try{
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('ccarga', sql.Int, ccarga)
            .query('select * from VWBUSCARSERVICIOSXCONTRATOFLOTA where ccarga = @ccarga');
        //sql.close();
        return { result: result };
    }catch(err){
        return { error: err.message };
    }
}

const getBroker = async(ccorredor) => {
    try{
        let pool = await sql.connect(config);
        let result = await pool.request()
        .input('ccorredor', sql.Int, ccorredor)
        .query('select * from macorredores where ccorredor = @ccorredor');
        return { result: result }
    }catch(err){
        return { error: err.message };
    }
}

const getPlanArys = async(cplan) => {
    try{
         let pool = await sql.connect(config);
         let result = await pool.request()
             .input('cplan', sql.Int, cplan)
             .query('select * from POPLAN where CPLAN = @cplan');
         //sql.close();
         return { result: result };
     }catch(err){
         return { error: err.message };
     }
 }

 const getFleetContractAccesoriesQuery = async(ccontratoflota) => {
    try{
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('CCONTRATOFLOTA', sql.Int, ccontratoflota)
            .query('SELECT * FROM VWBUSCARACCESORIOSXCONTRATO WHERE CCONTRATOFLOTA = @CCONTRATOFLOTA')
        return { result: result}
    }catch(err){
        console.log(err.message);
        return { error: err.message };
    }
}

const  getPolicyEffectiveDateQuery = async(ccontratoflota) => {
    try{
        let pool = await sql.connect(config);
        let result = await pool.request()
        .input('ccontratoflota', sql.Int, ccontratoflota)
        .query('select top 1 FDESDE_POL, FHASTA_POL from SURECIBO where CCONTRATOFLOTA = @ccontratoflota and BACTIVO = 1');
        return { result: result };
    }catch(err){
        console.log(err.message);
        return { error: err.message };
    }
}

export default {
    searchCertificate,
    getFleetContractDataQuery,
    getFleetContractOwnerDataQuery,
    getContractClientData,
    getPlanData,
    getPlanCoverages,
    getFleetContractServices,
    getBroker,
    getPlanArys,
    getFleetContractAccesoriesQuery,
    getPolicyEffectiveDateQuery
}