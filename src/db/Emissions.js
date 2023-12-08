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

const sqlConfigArys = {
  user: process.env.USER_BD_AR,
  password: process.env.PASSWORD_BD_AR,
  server: process.env.SERVER_BD_AR,
  database: process.env.NAME_BD_AR,
  options: {
      encrypt: true,
      trustServerCertificate: true
  }
}

const Clasification = sequelize.define('MACLASIFICACION_VEH', {}, { tableName: 'MACLASIFICACION_VEH' });
const Price = sequelize.define('MATARIFA_CASCO', {}, { tableName: 'MATARIFA_CASCO' });
const OtherPrice = sequelize.define('MATARIFA_OTROS', {}, { tableName: 'MATARIFA_OTROS' });
const Contract = sequelize.define('SUCONTRATOFLOTA', {}, { tableName: 'SUCONTRATOFLOTA' });
const AllContract = sequelize.define('VWBUSCARSUCONTRATOFLOTADATA', {}, { tableName: 'VWBUSCARSUCONTRATOFLOTADATA' });
const Propietary = sequelize.define('TRPROPIETARIO', {}, { tableName: 'TRPROPIETARIO' });
const Vehicle = sequelize.define('VWBUSCARSUCONTRATOFLOTADATA', {}, { tableName: 'VWBUSCARSUCONTRATOFLOTADATA' });
const Motin = sequelize.define('PRTARIFA_MOTIN_CAT', {}, { tableName: 'PRTARIFA_MOTIN_CAT' });

const searchHullPrice = async (searchHullPrice) => {
  console.log(searchHullPrice)
  try {
    const clasificacion = await Price.findAll({
      where: searchHullPrice,
      attributes: ['pcobertura_amplia'],
    });
    const result = clasificacion.map((item) => item.get({ plain: true }));
    return result;
  } catch (error) {
    return { error: error.message };
  }
};

  const searchOtherPrice = async (searchOtherPrice) => {
    try {
      const otros = await OtherPrice.findAll({
        where: {
            xcobertura: searchOtherPrice.xcobertura,
          },
        attributes: ['ptarifa'],
      });
      const rates = otros.map((item) => item.get({ plain: true }));
      return rates;
    } catch (error) {
      return { error: error.message };
    }
  };

  const executePremiumAmount = async (executePremiumAmount) => {
    try{
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
        .input('cplan_rc', sql.Int, executePremiumAmount.cplan)
        .input('ctarifa_exceso', sql.Int, executePremiumAmount.ctarifa_exceso)
        .input('ncapacidad_p', sql.Int, executePremiumAmount.npasajeros)
        .input('cuso', sql.Bit, executePremiumAmount.cuso)
        .execute('tmBCalculo_Recibo');
         let query= await pool.request()
        .query('select * from TMCALCULO_RECIBO');
        await pool.close();
        return { result: query };
              
    }catch(err){
      console.log(err.message)
        return { error: err.message };
        }
}

const createIndividualContract = async(createIndividualContract) => {
  try{
      let rowsAffected = 0;
      let pool = await sql.connect(sqlConfig);

      if (createIndividualContract.xtomador) {
        
        const matomadorResult = await pool.request()
          .input('xtomador', sql.NVarChar, createIndividualContract.xtomador.toUpperCase())
          .input('xrif', sql.NVarChar, createIndividualContract.xrif_tomador.toUpperCase())
          .input('xcorreo', sql.NVarChar, createIndividualContract.xemail_tomador.toUpperCase())
          .input('cestado', sql.Int, createIndividualContract.cestado_tomador)
          .input('cciudad', sql.Int, createIndividualContract.cciudad_tomador)
          .input('xdireccion', sql.NVarChar, createIndividualContract.xdireccion_tomador.toUpperCase())
          .input('xzona_postal', sql.NVarChar, createIndividualContract.xzona_postal_tomador.toUpperCase())
          .input('xtelefono', sql.NVarChar, createIndividualContract.xtelefono_tomador)
          .input('cpais', sql.Int, 58)
          .input('cestatusgeneral', sql.Int, 2)
          .query('INSERT INTO MATOMADORES (xtomador, xrif, xcorreo, cestado, cciudad, xdireccion, xzona_postal, xtelefono, cpais, cestatusgeneral) VALUES (@xtomador, @xrif, @xcorreo, @cestado, @cciudad, @xdireccion, @xzona_postal, @xtelefono, @cpais, @cestatusgeneral) SELECT SCOPE_IDENTITY() AS ctomador');

        if (matomadorResult.recordset.length > 0) {
          createIndividualContract.ctomador = matomadorResult.recordset[0].ctomador;
        }
      }

      let insert = await pool.request()
          .input('icedula', sql.Char, createIndividualContract.icedula ? createIndividualContract.icedula: undefined)
          .input('xrif_cliente', sql.NVarChar, createIndividualContract.xrif_cliente ? createIndividualContract.xrif_cliente: undefined)
          .input('xcedula', sql.NVarChar, createIndividualContract.xrif_cliente ? createIndividualContract.xrif_cliente: undefined)
          .input('xnombre', sql.NVarChar, createIndividualContract.xnombre.toUpperCase() ? createIndividualContract.xnombre: undefined)
          .input('xapellido', sql.NVarChar, createIndividualContract.xapellido.toUpperCase() ? createIndividualContract.xapellido: undefined)
          .input('xtelefono_emp', sql.NVarChar, createIndividualContract.xtelefono_emp ? createIndividualContract.xtelefono_emp: undefined)
          .input('email', sql.NVarChar, createIndividualContract.email.toUpperCase() ? createIndividualContract.email: undefined)
          .input('cestado', sql.Int, createIndividualContract.cestado ? createIndividualContract.cestado: undefined)
          .input('cciudad', sql.Int, createIndividualContract.cciudad ? createIndividualContract.cciudad: undefined)
          .input('fnac', sql.NVarChar, createIndividualContract.fnacimiento ? createIndividualContract.fnacimiento: undefined)
          .input('iestado_civil', sql.NVarChar, createIndividualContract.iestado_civil ? createIndividualContract.iestado_civil: undefined)
          .input('isexo', sql.NVarChar, createIndividualContract.isexo ? createIndividualContract.isexo: undefined)
          .input('xdireccionfiscal', sql.NVarChar, createIndividualContract.xdireccion.toUpperCase() ? createIndividualContract.xdireccion: undefined)
          .input('xplaca', sql.NVarChar, createIndividualContract.xplaca.toUpperCase() ? createIndividualContract.xplaca: undefined)
          .input('xmarca', sql.NVarChar, createIndividualContract.xmarca.toUpperCase() ? createIndividualContract.xmarca: undefined)
          .input('xmodelo', sql.NVarChar, createIndividualContract.xmodelo.toUpperCase() ? createIndividualContract.xmodelo: undefined)
          .input('xversion', sql.NVarChar, createIndividualContract.xversion.toUpperCase() ? createIndividualContract.xversion: undefined)
          .input('cano', sql.Int, createIndividualContract.fano ? createIndividualContract.fano: undefined)
          .input('ncapacidad_p', sql.Int, createIndividualContract.npasajeros ? createIndividualContract.npasajeros: undefined)
          .input('xcolor', sql.NVarChar, createIndividualContract.xcolor.toUpperCase() ? createIndividualContract.xcolor: undefined)
          .input('xserialcarroceria', sql.NVarChar, createIndividualContract.xserialcarroceria.toUpperCase() ? createIndividualContract.xserialcarroceria: undefined)
          .input('xserialmotor', sql.NVarChar, createIndividualContract.xserialmotor.toUpperCase() ? createIndividualContract.xserialmotor: undefined)
          .input('xcobertura', sql.NVarChar, createIndividualContract.xcobertura ? createIndividualContract.xcobertura: undefined)
          .input('ctarifa_exceso', sql.Int, createIndividualContract.ctarifa_exceso ? createIndividualContract.ctarifa_exceso: undefined)
          .input('cplan_rc', sql.Int, createIndividualContract.cplan_rc ? createIndividualContract.cplan_rc: undefined)
          .input('ccorredor', sql.Int, createIndividualContract.ccorredor ? createIndividualContract.ccorredor: undefined)
          .input('ctomador', sql.Int, createIndividualContract.ctomador ? createIndividualContract.ctomador: undefined)
          .input('ccotizacion', sql.Int, createIndividualContract.ccotizacion ? createIndividualContract.ccotizacion: undefined)
          .input('cinspeccion', sql.Int, createIndividualContract.cinspeccion ? createIndividualContract.cinspeccion: undefined)
          .input('fdesde_pol', sql.DateTime, createIndividualContract.fdesde_pol ? createIndividualContract.fdesde_pol: undefined)
          .input('fhasta_pol', sql.DateTime, createIndividualContract.fhasta_pol ? createIndividualContract.fhasta_pol: undefined)
          .input('cclasificacion', sql.Char, createIndividualContract.cclasificacion ? createIndividualContract.cclasificacion: undefined)
          .input('id_inma', sql.Int, createIndividualContract.id_inma ? createIndividualContract.id_inma: undefined)
          .input('pcasco', sql.Numeric(17, 2), createIndividualContract.pcasco ? createIndividualContract.pcasco: undefined)
          .input('msuma_aseg', sql.Numeric(17, 2), createIndividualContract.msuma_aseg ? createIndividualContract.msuma_aseg: undefined)
          .input('mprima_bruta', sql.Numeric(17, 2), createIndividualContract.mprima_bruta ? createIndividualContract.mprima_bruta: undefined)
          .input('pdescuento', sql.Numeric(17, 2), createIndividualContract.pdescuento ? createIndividualContract.pdescuento: undefined)
          .input('precarga', sql.Numeric(17, 2), createIndividualContract.precarga ? createIndividualContract.precarga: undefined)
          .input('pmotin', sql.Numeric(17, 2), createIndividualContract.pmotin ? createIndividualContract.pmotin: undefined)
          .input('pcatastrofico', sql.Numeric(17, 2), createIndividualContract.pcatastrofico ? createIndividualContract.pcatastrofico: undefined)
          .input('mprima_casco', sql.Numeric(17, 2), createIndividualContract.mprima_casco ? createIndividualContract.mprima_casco: undefined)
          .input('mcatastrofico', sql.Numeric(17, 2), createIndividualContract.mcatastrofico ? createIndividualContract.mcatastrofico: undefined)
          .input('mmotin', sql.Numeric(17, 2), createIndividualContract.mmotin ? createIndividualContract.mmotin: undefined)
          .input('pblindaje', sql.Numeric(17, 2), createIndividualContract.pblindaje ? createIndividualContract.pblindaje: undefined)
          .input('msuma_blindaje', sql.Numeric(17, 2), createIndividualContract.msuma_blindaje ? createIndividualContract.msuma_blindaje: undefined)
          .input('mprima_blindaje', sql.Numeric(17, 2), createIndividualContract.mprima_blindaje ? createIndividualContract.mprima_blindaje: undefined)
          .input('xpago', sql.NVarChar, createIndividualContract.xpago ? createIndividualContract.xpago: undefined)
          .input('femision', sql.DateTime, new Date()) 
          .input('cmetodologiapago', sql.Int, createIndividualContract.cmetodologiapago ? createIndividualContract.cmetodologiapago: undefined)
          .input('cpais', sql.Int, createIndividualContract.cpais ? createIndividualContract.cpais: undefined)
          .input('cuso', sql.Int, createIndividualContract.cuso ? createIndividualContract.cuso: undefined)
          .input('ctipopago', sql.Int, createIndividualContract.ctipopago ? createIndividualContract.ctipopago: undefined)
          .input('cbanco', sql.Int, createIndividualContract.cbanco ? createIndividualContract.cbanco: undefined)
          .input('cbanco_destino', sql.Int, createIndividualContract.cbanco_destino ? createIndividualContract.cbanco_destino: undefined)
          .input('fcobro', sql.DateTime, createIndividualContract.fcobro ? createIndividualContract.fcobro: undefined)
          .input('xreferencia', sql.NVarChar, createIndividualContract.xreferencia ? createIndividualContract.xreferencia: undefined)
          .input('mprima_pagada', sql.Numeric(18, 2), createIndividualContract.mprima_pagada ? createIndividualContract.mprima_pagada: undefined)
          .input('mprima_accesorio', sql.Numeric(18, 2), createIndividualContract.mprima_accesorio ? createIndividualContract.mprima_accesorio: undefined)
          .query('INSERT INTO TMEMISION_INDIVIDUAL (icedula, xrif_cliente, xnombre, xapellido, xcedula, xtelefono_emp, email, cestado, cciudad, xdireccionfiscal, xplaca, xmarca, xmodelo, xversion, cano, ncapacidad_p, xcolor, xserialcarroceria, xserialmotor, xcobertura, ctarifa_exceso, cplan_rc, ccorredor, ctomador, ccotizacion, cinspeccion, fdesde_pol, fhasta_pol, cclasificacion, msuma_aseg, mprima_bruta, pdescuento, precarga, pcatastrofico, mprima_casco, mcatastrofico, mmotin, pblindaje, msuma_blindaje, mprima_blindaje, xpago, femision, cmetodologiapago, cpais, id_inma, pcasco, pmotin, cuso, ctipopago, cbanco, cbanco_destino, xreferencia, mprima_pagada, fcobro, fnac, iestado_civil, isexo, mprima_accesorios) VALUES (@icedula, @xrif_cliente, @xnombre, @xapellido, @xcedula, @xtelefono_emp, @email, @cestado, @cciudad, @xdireccionfiscal, @xplaca, @xmarca, @xmodelo, @xversion, @cano, @ncapacidad_p, @xcolor, @xserialcarroceria, @xserialmotor, @xcobertura, @ctarifa_exceso, @cplan_rc, @ccorredor, @ctomador, @ccotizacion, @cinspeccion, @fdesde_pol, @fhasta_pol, @cclasificacion, @msuma_aseg, @mprima_bruta, @pdescuento, @precarga, @pcatastrofico, @mprima_casco, @mcatastrofico, @mmotin, @pblindaje, @msuma_blindaje, @mprima_blindaje, @xpago, @femision, @cmetodologiapago, @cpais, @id_inma, @pcasco, @pmotin, @cuso, @ctipopago, @cbanco, @cbanco_destino, @xreferencia, @mprima_pagada, @fcobro, @fnac, @iestado_civil, @isexo, @mprima_accesorio)')
          await pool.close();

          if (createIndividualContract.accesorios) {
            const accesoriosConMonto = createIndividualContract.accesorios.filter(accesorio => accesorio.xprimaAccesorio !== '');
        
            if (accesoriosConMonto.length > 0) {
                const maxContract = await Contract.findOne({
                    attributes: ['ccontratoflota'],
                    order: [['ccontratoflota', 'DESC']],
                    limit: 1,
                });
                const contrato = maxContract ? maxContract.get({ plain: true }) : null;
        
                let pool = await sql.connect(sqlConfig);
                for (let i = 0; i < accesoriosConMonto.length; i++) {
                    const montoAccesorio = parseFloat(accesoriosConMonto[i].xprimaAccesorio);
                    const sumaAccesorio = parseFloat(accesoriosConMonto[i].sumaAsegurada);
                    let insert = await pool.request()
                        .input('ccontratoflota', sql.Int, contrato.ccontratoflota)
                        .input('caccesorio', sql.Int, accesoriosConMonto[i].caccesorio)
                        .input('msuma_aseg', sql.Numeric(18, 2), sumaAccesorio)
                        .input('maccesoriocontratoflota', sql.Numeric(11, 2), montoAccesorio)
                        .input('fcreacion', sql.DateTime, new Date())
                        .input('cusuariocreacion', sql.Int, createIndividualContract.cusuario)
                        .query('INSERT INTO SUACCESORIOCONTRATOFLOTA (ccontratoflota, caccesorio, msuma_aseg, maccesoriocontratoflota, fcreacion, cusuariocreacion) VALUES (@ccontratoflota, @caccesorio, @msuma_aseg, @maccesoriocontratoflota, @fcreacion, @cusuariocreacion)');
        
                    let exec = await pool.request()
                        .input('ccontratoflota', sql.Int, contrato.ccontratoflota)
                        .execute('trBAcesorios_ContratoFlota');
                }
            }
        }
          return { result: { rowsAffected: rowsAffected, status: true } };
  }
  catch(err){
      console.log(err.message)
      return { error: err.message };
  }
}

// const createIndividualContractArys = async(createIndividualContract) => {
//   console.log(createIndividualContract)
//   try{
//       let rowsAffected = 0;
//       let pool = await sql.connect(sqlConfigArys);

//       if (createIndividualContract.xtomador) {
        
//         const matomadorResult = await pool.request()
//           .input('xtomador', sql.NVarChar, createIndividualContract.xtomador.toUpperCase())
//           .input('xrif', sql.NVarChar, createIndividualContract.xrif_tomador.toUpperCase())
//           .input('xcorreo', sql.NVarChar, createIndividualContract.xemail_tomador.toUpperCase())
//           .input('cestado', sql.Int, createIndividualContract.cestado_tomador)
//           .input('cciudad', sql.Int, createIndividualContract.cciudad_tomador)
//           .input('xdireccion', sql.NVarChar, createIndividualContract.xdireccion_tomador.toUpperCase())
//           .input('xzona_postal', sql.NVarChar, createIndividualContract.xzona_postal_tomador.toUpperCase())
//           .input('xtelefono', sql.NVarChar, createIndividualContract.xtelefono_tomador)
//           .input('cpais', sql.Int, 58)
//           .input('cestatusgeneral', sql.Int, 2)
//           .query('INSERT INTO MATOMADORES (xtomador, xrif, xcorreo, cestado, cciudad, xdireccion, xzona_postal, xtelefono, cpais, cestatusgeneral) VALUES (@xtomador, @xrif, @xcorreo, @cestado, @cciudad, @xdireccion, @xzona_postal, @xtelefono, @cpais, @cestatusgeneral) SELECT SCOPE_IDENTITY() AS ctomador');

//         if (matomadorResult.recordset.length > 0) {
//           createIndividualContract.ctomador = matomadorResult.recordset[0].ctomador;
//         }
//       }

//       let cmarcaValue;
//       let cmodeloValue;
//       let cversionValue;

//       if(createIndividualContract.xmarca){
//         const getCmarcaResult = await pool
//         .request()
//         .input('xmarca', sql.NVarChar, createIndividualContract.xmarca.toUpperCase())
//         .query('SELECT cmarca FROM MAMARCA WHERE xmarca = @xmarca');
    
//         cmarcaValue = getCmarcaResult.recordset.length > 0 ? getCmarcaResult.recordset[0].cmarca : undefined;
//       }
      
//       if(createIndividualContract.xmodelo){
//         const getCmodeloResult = await pool
//         .request()
//         .input('xmodelo', sql.NVarChar, createIndividualContract.xmodelo.toUpperCase())
//         .input('cmarca', sql.Int, cmarcaValue)
//         .query('SELECT cmodelo FROM MAMODELO WHERE xmodelo = @xmodelo AND cmarca = @cmarca');
    
//         cmodeloValue = getCmodeloResult.recordset.length > 0 ? getCmodeloResult.recordset[0].cmodelo : undefined;
//       }
  
//       if(createIndividualContract.xversion){
//         const getCversionResult = await pool
//           .request()
//           .input('xversion', sql.NVarChar, createIndividualContract.xversion.toUpperCase())
//           .input('cmodelo', sql.Int, cmodeloValue)
//           .input('cmarca', sql.Int, cmarcaValue)
//           .query('SELECT cversion FROM MAVERSION WHERE xversion = @xversion AND cmodelo = @cmodelo AND cmarca = @cmarca');

//           cversionValue = getCversionResult.recordset.length > 0 ? getCversionResult.recordset[0].cversion : undefined;
//       }

//       let insert = await pool.request()
//           .input('icedula', sql.Char, createIndividualContract.icedula ? createIndividualContract.icedula: undefined)
//           .input('xrif_cliente', sql.NVarChar, createIndividualContract.xrif_cliente ? createIndividualContract.xrif_cliente: undefined)
//           .input('xcedula', sql.NVarChar, createIndividualContract.xrif_cliente ? createIndividualContract.xrif_cliente: undefined)
//           .input('xnombre', sql.NVarChar, createIndividualContract.xnombre.toUpperCase() ? createIndividualContract.xnombre: undefined)
//           .input('xapellido', sql.NVarChar, createIndividualContract.xapellido.toUpperCase() ? createIndividualContract.xapellido: undefined)
//           .input('xtelefono_emp', sql.NVarChar, createIndividualContract.xtelefono_emp ? createIndividualContract.xtelefono_emp: undefined)
//           .input('email', sql.NVarChar, createIndividualContract.email.toUpperCase() ? createIndividualContract.email: undefined)
//           .input('cestado', sql.Int, createIndividualContract.cestado ? createIndividualContract.cestado: undefined)
//           .input('cciudad', sql.Int, createIndividualContract.cciudad ? createIndividualContract.cciudad: undefined)
//           .input('xdireccionfiscal', sql.NVarChar, createIndividualContract.xdireccion.toUpperCase() ? createIndividualContract.xdireccion: undefined)
//           .input('xplaca', sql.NVarChar, createIndividualContract.xplaca.toUpperCase() ? createIndividualContract.xplaca: undefined)
//           .input('xmarca', sql.NVarChar, createIndividualContract.xmarca.toUpperCase() ? createIndividualContract.xmarca: undefined)
//           .input('xmodelo', sql.NVarChar, createIndividualContract.xmodelo.toUpperCase() ? createIndividualContract.xmodelo: undefined)
//           .input('xversion', sql.NVarChar, createIndividualContract.xversion.toUpperCase() ? createIndividualContract.xversion: undefined)
//           .input('cmarca', sql.Int, cmarcaValue ? cmarcaValue: undefined)
//           .input('cmodelo', sql.Int, cmodeloValue ? cmodeloValue: undefined)
//           .input('cversion', sql.Int, cversionValue ? cversionValue: undefined)
//           .input('cano', sql.Int, createIndividualContract.fano ? createIndividualContract.fano: undefined)
//           .input('ncapacidad_p', sql.Int, createIndividualContract.npasajeros ? createIndividualContract.npasajeros: undefined)
//           .input('xcolor', sql.NVarChar, createIndividualContract.xcolor.toUpperCase() ? createIndividualContract.xcolor: undefined)
//           .input('xserialcarroceria', sql.NVarChar, createIndividualContract.xserialcarroceria.toUpperCase() ? createIndividualContract.xserialcarroceria: undefined)
//           .input('xserialmotor', sql.NVarChar, createIndividualContract.xserialmotor.toUpperCase() ? createIndividualContract.xserialmotor: undefined)
//           .input('xcobertura', sql.NVarChar, createIndividualContract.xcobertura ? createIndividualContract.xcobertura: undefined)
//           .input('ctarifa_exceso', sql.Int, createIndividualContract.ctarifa_exceso ? createIndividualContract.ctarifa_exceso: undefined)
//           .input('cplan_rc', sql.Int, createIndividualContract.cplan_rc ? createIndividualContract.cplan_rc: undefined)
//           .input('ccorredor', sql.Int, createIndividualContract.ccorredor ? createIndividualContract.ccorredor: undefined)
//           .input('ctomador', sql.Int, createIndividualContract.ctomador ? createIndividualContract.ctomador: undefined)
//           .input('ccotizacion', sql.Int, createIndividualContract.ccotizacion ? createIndividualContract.ccotizacion: undefined)
//           .input('cinspeccion', sql.Int, createIndividualContract.cinspeccion ? createIndividualContract.cinspeccion: undefined)
//           .input('fdesde_pol', sql.DateTime, createIndividualContract.fdesde_pol ? createIndividualContract.fdesde_pol: undefined)
//           .input('fhasta_pol', sql.DateTime, createIndividualContract.fhasta_pol ? createIndividualContract.fhasta_pol: undefined)
//           .input('cclasificacion', sql.Char, createIndividualContract.cclasificacion ? createIndividualContract.cclasificacion: undefined)
//           .input('pcasco', sql.Numeric(17, 2), createIndividualContract.pcasco ? createIndividualContract.pcasco: undefined)
//           .input('msuma_aseg', sql.Numeric(17, 2), createIndividualContract.msuma_aseg ? createIndividualContract.msuma_aseg: undefined)
//           .input('mprima_bruta', sql.Numeric(17, 2), createIndividualContract.mprima_bruta ? createIndividualContract.mprima_bruta: undefined)
//           .input('pdescuento', sql.Numeric(17, 2), createIndividualContract.pdescuento ? createIndividualContract.pdescuento: undefined)
//           .input('pmotin', sql.Numeric(17, 2), createIndividualContract.pmotin ? createIndividualContract.pmotin: undefined)
//           .input('pcatastrofico', sql.Numeric(17, 2), createIndividualContract.pcatastrofico ? createIndividualContract.pcatastrofico: undefined)
//           .input('mprima_casco', sql.Numeric(17, 2), createIndividualContract.mprima_casco ? createIndividualContract.mprima_casco: undefined)
//           .input('mcatastrofico', sql.Numeric(17, 2), createIndividualContract.mcatastrofico ? createIndividualContract.mcatastrofico: undefined)
//           .input('mmotin', sql.Numeric(17, 2), createIndividualContract.mmotin ? createIndividualContract.mmotin: undefined)
//           .input('pblindaje', sql.Numeric(17, 2), createIndividualContract.pblindaje ? createIndividualContract.pblindaje: undefined)
//           .input('msuma_blindaje', sql.Numeric(17, 2), createIndividualContract.msuma_blindaje ? createIndividualContract.msuma_blindaje: undefined)
//           .input('mprima_blindaje', sql.Numeric(17, 2), createIndividualContract.mprima_blindaje ? createIndividualContract.mprima_blindaje: undefined)
//           .input('xpago', sql.NVarChar, createIndividualContract.xpago ? createIndividualContract.xpago: undefined)
//           .input('femision', sql.DateTime, new Date()) 
//           .input('cmetodologiapago', sql.Int, createIndividualContract.cmetodologiapago ? createIndividualContract.cmetodologiapago: undefined)
//           .input('cpais', sql.Int, createIndividualContract.cpais ? createIndividualContract.cpais: undefined)
//           .query('INSERT INTO TMEMISION_INDIVIDUAL (icedula, xrif_cliente, xnombre, xapellido, xcedula, xtelefono_emp, email, cestado, cciudad, xdireccionfiscal, xplaca, cmarca, cmodelo, cversion, xmarca, xmodelo, xversion, cano, ncapacidad_p, xcolor, xserialcarroceria, xserialmotor, xcobertura, ctarifa_exceso, cplan_rc, ccorredor, ctomador, ccotizacion, cinspeccion, fdesde_pol, fhasta_pol, cclasificacion, msuma_aseg, mprima_bruta, pdescuento, pcatastrofico, mprima_casco, mcatastrofico, mmotin, pblindaje, msuma_blindaje, mprima_blindaje, xpago, femision, cmetodologiapago, cpais, pcasco, pmotin) VALUES (@icedula, @xrif_cliente, @xnombre, @xapellido, @xcedula, @xtelefono_emp, @email, @cestado, @cciudad, @xdireccionfiscal, @xplaca, @cmarca, @cmodelo, @cversion, @xmarca, @xmodelo, @xversion, @cano, @ncapacidad_p, @xcolor, @xserialcarroceria, @xserialmotor, @xcobertura, @ctarifa_exceso, @cplan_rc, @ccorredor, @ctomador, @ccotizacion, @cinspeccion, @fdesde_pol, @fhasta_pol, @cclasificacion, @msuma_aseg, @mprima_bruta, @pdescuento, @pcatastrofico, @mprima_casco, @mcatastrofico, @mmotin, @pblindaje, @msuma_blindaje, @mprima_blindaje, @xpago, @femision, @cmetodologiapago, @cpais, @pcasco, @pmotin)')
//           await pool.close();

//           return { result: { rowsAffected: rowsAffected, status: true } };
//   }
//   catch(err){
//       console.log(err.message)
//       return { error: err.message };
//   }
// }

const searchContractIndividual = async () => {
  try {
    const maxContract = await Contract.findOne({
      attributes: ['ccontratoflota'],
      order: [['ccontratoflota', 'DESC']],
      limit: 1,
    });

    return maxContract ? maxContract.get({ plain: true }) : null;
  } catch (error) {
    return { error: error.message };
  }
};

const searchAllContract = async (searchAllContract) => {
  try {
    const contratos = await AllContract.findAll({
      where: searchAllContract,
      attributes: [
        [Sequelize.literal('DISTINCT ccontratoflota'), 'ccontratoflota'],
        'xnombre',
        'xapellido',
        'xmarca',
        'xmodelo',
        'xversion',
        'xplaca',
      ],
    });

    const result = contratos.map((item) => item.get({ plain: true }));
    return result;
  } catch (error) {
    return { error: error.message };
  }
};
  
const searchPropietary = async (searchPropietary) => {
  try {
    const propietario = await Propietary.findAll({
      where: {
          xdocidentidad: searchPropietary.xrif_cliente,
        },
      attributes: ['xnombre', 'xapellido', 'xtelefonocasa', 'xemail', 'cestado', 'cciudad', 'xdireccion'],
    });
    const propietary = propietario.map((item) => item.get({ plain: true }));
    return propietary;
  } catch (error) {
    return { error: error.message };
  }
};

const searchVehicle = async (searchVehicle) => {
  try {
    const vehiculo = await Vehicle.findAll({
      where: {
          xplaca: searchVehicle.xplaca,
          cestatusgeneral: {
            [Sequelize.Op.ne]: 3,
          },
        },
      attributes: ['ccontratoflota'],
    });
    const vehicle = vehiculo.map((item) => item.get({ plain: true }));
    return vehicle;
  } catch (error) {
    return { error: error.message };
  }
};

const updateUbii = async(updateUbii) => {
  try{
      let rowsAffected = 0;
      let pool = await sql.connect(sqlConfig);
      let update = await pool.request()
      .input('ccontratoflota', sql.Int, updateUbii.paymentData.ccontratoflota)
      .input('orderId', sql.NVarChar, updateUbii.paymentData.orderId)
      .input('ctipopago', sql.Int, updateUbii.paymentData.ctipopago)
      .input('xreferencia', sql.NVarChar, updateUbii.paymentData.xreferencia)
      .input('fcobro', sql.DateTime, updateUbii.paymentData.fcobro)
      .input('mprima_pagada', sql.Numeric(17,2), updateUbii.paymentData.mprima_pagada)
      .input('mtasa_cambio', sql.Numeric(17,2), updateUbii.paymentData.mtasa_cambio)
      .input('cestatusgeneral', sql.Int, 7)
      .query('update SURECIBO set CCODIGO_UBII = @orderId, XREFERENCIA = @xreferencia, CTIPOPAGO = @ctipopago, FCOBRO = @fcobro, MPRIMA_PAGADA = @mprima_pagada, CESTATUSGENERAL = @cestatusgeneral, MTASA_CAMBIO = @mtasa_cambio where CRECIBO IN (SELECT TOP 1 CRECIBO FROM SURECIBO WHERE CCONTRATOFLOTA = @ccontratoflota AND CESTATUSGENERAL = 13)' );
      rowsAffected = rowsAffected + update.rowsAffected;
      //sql.close();
      return { result: { rowsAffected: rowsAffected } };
  }
  catch(err){
      console.log(err.message);
      return { error: err.message };
  }
}

const updateContract = async(updateContract) => {
  try{
      let rowsAffected = 0;
      let pool = await sql.connect(sqlConfig);
      let update = await pool.request()
      .input('ccontratoflota', sql.Int, updateContract.paymentData.ccontratoflota)
      .input('cestatusgeneral', sql.Int, 7)
      .query('update SUCONTRATOFLOTA set CESTATUSGENERAL = @cestatusgeneral where CCONTRATOFLOTA = @ccontratoflota')
      rowsAffected = rowsAffected + update.rowsAffected;
      return { result: { rowsAffected: rowsAffected}};
  }
  catch(err){
      console.log(err.message);
      return { error: err.message };
  }
}

const searchRiotRate = async (searchRiotRate) => {
  console.log(searchRiotRate)
  try {
    const motin = await Motin.findAll({
      where: {
          xcobertura: searchRiotRate.xcobertura
        },
      attributes: ['ptasa'],
    });
    const result = motin.map((item) => item.get({ plain: true }));
    return result;
  } catch (error) {
    return { error: error.message };
  }
};

const createGroupContract = async(createGroupContract) => {
  try{
      let rowsAffected = 0;
      let pool = await sql.connect(sqlConfig);
      let contractNoInsert = [];
      let foundIds = [];

      for(let i = 0; i < createGroupContract.group.length; i++){

        //Valido si tiene codigo de inma
        if (createGroupContract.group[i].xmarca && createGroupContract.group[i].xmodelo && createGroupContract.group[i].xversion) {
          let searchInma = await pool.request()
            .input('u_version', sql.Char, '!')
            .input('xmarca', sql.NVarChar, createGroupContract.group[i].xmarca)  
            .input('xmodelo', sql.NVarChar, createGroupContract.group[i].xmodelo)
            .input('xversion', sql.NVarChar, createGroupContract.group[i].xversion)
            .query(`SELECT ID AS ID_INMA FROM mainma WHERE u_version = @u_version${createGroupContract.group[i].xmarca ? ' and xmarca = @xmarca' : ''}${createGroupContract.group[i].xmodelo ? ' and xmodelo = @xmodelo' : ''}${createGroupContract.group[i].xversion ? ' and xversion = @xversion' : ''}`);

            if (searchInma.recordset.length === 0) {
              contractNoInsert.push(createGroupContract.group[i]);
            } else {
              foundIds.push(searchInma.recordset[0].ID_INMA);
            }
        }

        if(createGroupContract.group[i].xplaca){

        }
        // let insert = await pool.request()
        // .input('icedula', sql.Char, createGroupContract.icedula ? createGroupContract.icedula: undefined)
        // .input('xrif_cliente', sql.NVarChar, createGroupContract.xrif_cliente ? createGroupContract.xrif_cliente: undefined)
        // .input('xcedula', sql.NVarChar, createGroupContract.xrif_cliente ? createGroupContract.xrif_cliente: undefined)
        // .input('xnombre', sql.NVarChar, createGroupContract.xnombre.toUpperCase() ? createGroupContract.xnombre: undefined)
        // .input('xapellido', sql.NVarChar, createGroupContract.xapellido.toUpperCase() ? createGroupContract.xapellido: undefined)
        // .input('xtelefono_emp', sql.NVarChar, createGroupContract.xtelefono_emp ? createGroupContract.xtelefono_emp: undefined)
        // .input('email', sql.NVarChar, createGroupContract.email.toUpperCase() ? createGroupContract.email: undefined)
        // .input('cestado', sql.Int, createGroupContract.cestado ? createGroupContract.cestado: undefined)
        // .input('cciudad', sql.Int, createGroupContract.cciudad ? createGroupContract.cciudad: undefined)
        // .input('fnac', sql.NVarChar, createGroupContract.fnacimiento ? createGroupContract.fnacimiento: undefined)
        // .input('iestado_civil', sql.NVarChar, createGroupContract.iestado_civil ? createGroupContract.iestado_civil: undefined)
        // .input('isexo', sql.NVarChar, createGroupContract.isexo ? createGroupContract.isexo: undefined)
        // .input('xdireccionfiscal', sql.NVarChar, createGroupContract.xdireccion.toUpperCase() ? createGroupContract.xdireccion: undefined)
        // .input('xplaca', sql.NVarChar, createGroupContract.xplaca.toUpperCase() ? createGroupContract.xplaca: undefined)
        // .input('xmarca', sql.NVarChar, createGroupContract.xmarca.toUpperCase() ? createGroupContract.xmarca: undefined)
        // .input('xmodelo', sql.NVarChar, createGroupContract.xmodelo.toUpperCase() ? createGroupContract.xmodelo: undefined)
        // .input('xversion', sql.NVarChar, createGroupContract.xversion.toUpperCase() ? createGroupContract.xversion: undefined)
        // .input('cano', sql.Int, createGroupContract.fano ? createGroupContract.fano: undefined)
        // .input('ncapacidad_p', sql.Int, createGroupContract.npasajeros ? createGroupContract.npasajeros: undefined)
        // .input('xcolor', sql.NVarChar, createGroupContract.xcolor.toUpperCase() ? createGroupContract.xcolor: undefined)
        // .input('xserialcarroceria', sql.NVarChar, createGroupContract.xserialcarroceria.toUpperCase() ? createGroupContract.xserialcarroceria: undefined)
        // .input('xserialmotor', sql.NVarChar, createGroupContract.xserialmotor.toUpperCase() ? createGroupContract.xserialmotor: undefined)
        // .input('xcobertura', sql.NVarChar, createGroupContract.xcobertura ? createGroupContract.xcobertura: undefined)
        // .input('ctarifa_exceso', sql.Int, createGroupContract.ctarifa_exceso ? createGroupContract.ctarifa_exceso: undefined)
        // .input('cplan_rc', sql.Int, createGroupContract.cplan_rc ? createGroupContract.cplan_rc: undefined)
        // .input('ccorredor', sql.Int, createGroupContract.ccorredor ? createGroupContract.ccorredor: undefined)
        // .input('ctomador', sql.Int, createGroupContract.ctomador ? createGroupContract.ctomador: undefined)
        // .input('ccotizacion', sql.Int, createGroupContract.ccotizacion ? createGroupContract.ccotizacion: undefined)
        // .input('cinspeccion', sql.Int, createGroupContract.cinspeccion ? createGroupContract.cinspeccion: undefined)
        // .input('fdesde_pol', sql.DateTime, createGroupContract.fdesde_pol ? createGroupContract.fdesde_pol: undefined)
        // .input('fhasta_pol', sql.DateTime, createGroupContract.fhasta_pol ? createGroupContract.fhasta_pol: undefined)
        // .input('cclasificacion', sql.Char, createGroupContract.cclasificacion ? createGroupContract.cclasificacion: undefined)
        // .input('id_inma', sql.Int, createGroupContract.id_inma ? createGroupContract.id_inma: undefined)
        // .input('pcasco', sql.Numeric(17, 2), createGroupContract.pcasco ? createGroupContract.pcasco: undefined)
        // .input('msuma_aseg', sql.Numeric(17, 2), createGroupContract.msuma_aseg ? createGroupContract.msuma_aseg: undefined)
        // .input('mprima_bruta', sql.Numeric(17, 2), createGroupContract.mprima_bruta ? createGroupContract.mprima_bruta: undefined)
        // .input('pdescuento', sql.Numeric(17, 2), createGroupContract.pdescuento ? createGroupContract.pdescuento: undefined)
        // .input('precarga', sql.Numeric(17, 2), createGroupContract.precarga ? createGroupContract.precarga: undefined)
        // .input('pmotin', sql.Numeric(17, 2), createGroupContract.pmotin ? createGroupContract.pmotin: undefined)
        // .input('pcatastrofico', sql.Numeric(17, 2), createGroupContract.pcatastrofico ? createGroupContract.pcatastrofico: undefined)
        // .input('mprima_casco', sql.Numeric(17, 2), createGroupContract.mprima_casco ? createGroupContract.mprima_casco: undefined)
        // .input('mcatastrofico', sql.Numeric(17, 2), createGroupContract.mcatastrofico ? createGroupContract.mcatastrofico: undefined)
        // .input('mmotin', sql.Numeric(17, 2), createGroupContract.mmotin ? createGroupContract.mmotin: undefined)
        // .input('pblindaje', sql.Numeric(17, 2), createGroupContract.pblindaje ? createGroupContract.pblindaje: undefined)
        // .input('msuma_blindaje', sql.Numeric(17, 2), createGroupContract.msuma_blindaje ? createGroupContract.msuma_blindaje: undefined)
        // .input('mprima_blindaje', sql.Numeric(17, 2), createGroupContract.mprima_blindaje ? createGroupContract.mprima_blindaje: undefined)
        // .input('xpago', sql.NVarChar, createGroupContract.xpago ? createGroupContract.xpago: undefined)
        // .input('femision', sql.DateTime, new Date()) 
        // .input('cmetodologiapago', sql.Int, createGroupContract.cmetodologiapago ? createGroupContract.cmetodologiapago: undefined)
        // .input('cpais', sql.Int, createGroupContract.cpais ? createGroupContract.cpais: undefined)
        // .input('cuso', sql.Int, createGroupContract.cuso ? createGroupContract.cuso: undefined)
        // .input('ctipopago', sql.Int, createGroupContract.ctipopago ? createGroupContract.ctipopago: undefined)
        // .input('cbanco', sql.Int, createGroupContract.cbanco ? createGroupContract.cbanco: undefined)
        // .input('cbanco_destino', sql.Int, createGroupContract.cbanco_destino ? createGroupContract.cbanco_destino: undefined)
        // .input('fcobro', sql.DateTime, createGroupContract.fcobro ? createGroupContract.fcobro: undefined)
        // .input('xreferencia', sql.NVarChar, createGroupContract.xreferencia ? createGroupContract.xreferencia: undefined)
        // .input('mprima_pagada', sql.Numeric(18, 2), createGroupContract.mprima_pagada ? createGroupContract.mprima_pagada: undefined)
        // .input('mprima_accesorio', sql.Numeric(18, 2), createGroupContract.mprima_accesorio ? createGroupContract.mprima_accesorio: undefined)
        // .query('INSERT INTO TMEMISION_INDIVIDUAL (icedula, xrif_cliente, xnombre, xapellido, xcedula, xtelefono_emp, email, cestado, cciudad, xdireccionfiscal, xplaca, xmarca, xmodelo, xversion, cano, ncapacidad_p, xcolor, xserialcarroceria, xserialmotor, xcobertura, ctarifa_exceso, cplan_rc, ccorredor, ctomador, ccotizacion, cinspeccion, fdesde_pol, fhasta_pol, cclasificacion, msuma_aseg, mprima_bruta, pdescuento, precarga, pcatastrofico, mprima_casco, mcatastrofico, mmotin, pblindaje, msuma_blindaje, mprima_blindaje, xpago, femision, cmetodologiapago, cpais, id_inma, pcasco, pmotin, cuso, ctipopago, cbanco, cbanco_destino, xreferencia, mprima_pagada, fcobro, fnac, iestado_civil, isexo, mprima_accesorios) VALUES (@icedula, @xrif_cliente, @xnombre, @xapellido, @xcedula, @xtelefono_emp, @email, @cestado, @cciudad, @xdireccionfiscal, @xplaca, @xmarca, @xmodelo, @xversion, @cano, @ncapacidad_p, @xcolor, @xserialcarroceria, @xserialmotor, @xcobertura, @ctarifa_exceso, @cplan_rc, @ccorredor, @ctomador, @ccotizacion, @cinspeccion, @fdesde_pol, @fhasta_pol, @cclasificacion, @msuma_aseg, @mprima_bruta, @pdescuento, @precarga, @pcatastrofico, @mprima_casco, @mcatastrofico, @mmotin, @pblindaje, @msuma_blindaje, @mprima_blindaje, @xpago, @femision, @cmetodologiapago, @cpais, @id_inma, @pcasco, @pmotin, @cuso, @ctipopago, @cbanco, @cbanco_destino, @xreferencia, @mprima_pagada, @fcobro, @fnac, @iestado_civil, @isexo, @mprima_accesorio)')
      }

          await pool.close();

          return { result: { rowsAffected: rowsAffected, status: true } };
  }
  catch(err){
      console.log(err.message)
      return { error: err.message };
  }
}

export default {
    searchHullPrice,
    searchOtherPrice,
    executePremiumAmount,
    createIndividualContract,
    searchContractIndividual,
    searchAllContract,
    searchPropietary,
    searchVehicle,
    updateUbii,
    updateContract,
    searchRiotRate,
    createGroupContract
  };