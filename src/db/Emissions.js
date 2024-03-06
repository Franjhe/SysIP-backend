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
const Quotes = sequelize.define('VWBUSCARCOTIZACION', {}, { tableName: 'VWBUSCARCOTIZACION' });

const searchHullPrice = async (searchHullPrice) => {
  try {
    const clasificacion = await Price.findAll({
      where: searchHullPrice,
      attributes: ['pcobertura_amplia', 'pperdida_total'],
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
          .input('ccorredor', sql.Int, createIndividualContract.ccorredor ? createIndividualContract.ccorredor: 80080)
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
          .input('xuso', sql.NVarChar, createIndividualContract.xuso ? createIndividualContract.xuso: undefined)
          .input('npesovacio', sql.Int, createIndividualContract.npesovacio ? createIndividualContract.npesovacio: undefined)
          .input('ncapcarga', sql.Int, createIndividualContract.ncapcarga ? createIndividualContract.ncapcarga: undefined)
          .input('paditamento', sql.Numeric(17, 2), createIndividualContract.paditamento ? createIndividualContract.paditamento: undefined)
          .input('msuma_aditamento', sql.Numeric(17, 2), createIndividualContract.msuma_aditamento ? createIndividualContract.msuma_aditamento: undefined)
          .input('mprima_aditamento', sql.Numeric(17, 2), createIndividualContract.mprima_aditamento ? createIndividualContract.mprima_aditamento: undefined)
          .query('INSERT INTO TMEMISION_INDIVIDUAL (icedula, xrif_cliente, xnombre, xapellido, xcedula, xtelefono_emp, email, cestado, cciudad, xdireccionfiscal, xplaca, xmarca, xmodelo, xversion, cano, ncapacidad_p, xcolor, xserialcarroceria, xserialmotor, xcobertura, ctarifa_exceso, cplan_rc, ccorredor, ctomador, ccotizacion, cinspeccion, fdesde_pol, fhasta_pol, cclasificacion, msuma_aseg, mprima_bruta, pdescuento, precarga, pcatastrofico, mprima_casco, mcatastrofico, mmotin, pblindaje, msuma_blindaje, mprima_blindaje, xpago, femision, cmetodologiapago, cpais, id_inma, pcasco, pmotin, cuso, ctipopago, cbanco, cbanco_destino, xreferencia, mprima_pagada, fcobro, fnac, iestado_civil, isexo, mprima_accesorios, xuso, npesovacio, ncapcarga, paditamento, msuma_aditamento, mprima_aditamento) VALUES (@icedula, @xrif_cliente, @xnombre, @xapellido, @xcedula, @xtelefono_emp, @email, @cestado, @cciudad, @xdireccionfiscal, @xplaca, @xmarca, @xmodelo, @xversion, @cano, @ncapacidad_p, @xcolor, @xserialcarroceria, @xserialmotor, @xcobertura, @ctarifa_exceso, @cplan_rc, @ccorredor, @ctomador, @ccotizacion, @cinspeccion, @fdesde_pol, @fhasta_pol, @cclasificacion, @msuma_aseg, @mprima_bruta, @pdescuento, @precarga, @pcatastrofico, @mprima_casco, @mcatastrofico, @mmotin, @pblindaje, @msuma_blindaje, @mprima_blindaje, @xpago, @femision, @cmetodologiapago, @cpais, @id_inma, @pcasco, @pmotin, @cuso, @ctipopago, @cbanco, @cbanco_destino, @xreferencia, @mprima_pagada, @fcobro, @fnac, @iestado_civil, @isexo, @mprima_accesorio, @xuso, @npesovacio, @ncapcarga, @paditamento, @msuma_aditamento, @mprima_aditamento)')
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

// const createGroupContract = async (createGroupContract) => {
//   try {
//     let rowsAffected = 0;
//     let pool = await sql.connect(sqlConfig);

//     await pool.request().query("TRUNCATE TABLE TMEMISION_FLOTA");

//     for(let i = 0; i < createGroupContract.group.length; i++){

//       if(createGroupContract.group[i].xmarca){
//         let search = await pool.request();
//         .input('xmarca', sql.NVarChar, createGroupContract.group[i].xmarca)
//         .input('xmodelo', sql.NVarChar, createGroupContract.group[i].xmodelo)
//         .input('xversion', sql.NVarChar, createGroupContract.group[i].xversion)
//         .input('cano', sql.Int, createGroupContract.group[i].cano)
//         .query(`SELECT id_inma FROM mainma where xmarca = @xmarca and xmodelo = @xmodelo and xversion = @xversion and qano = @cano`)
//       }

//       let nro = i + 1;
//       let insert = await pool.request()
//       .input('nro', sql.Int, nro)
//       .input('irif', sql.Char, createGroupContract.group[i].irif)
//       .input('id_inma', sql.Int, createGroupContract.group[i].id_inma)
//       .input('xcliente', sql.NVarChar, createGroupContract.group[i].xcliente)
//       .input('xrif_cliente', sql.NVarChar, createGroupContract.group[i].xrif_cliente)
//       .input('xnombre', sql.NVarChar, createGroupContract.group[i].xnombre)
//       .input('xapellido', sql.NVarChar, createGroupContract.group[i].xapellido)
//       .input('icedula', sql.Char, createGroupContract.group[i].icedula)
//       .input('xcedula', sql.NVarChar, createGroupContract.group[i].xcedula)
//       .input('fnac', sql.DateTime, parseDateFromString(createGroupContract.group[i].fnac))
//       .input('cmetodologiapago', sql.Int, createGroupContract.group[i].cmetodologiapago)
//       .input('cplan_rc', sql.Int, createGroupContract.group[i].cplan_rc)
//       .input('ctarifa_exceso', sql.Int, createGroupContract.group[i].ctarifa_exceso)
//       .input('xserialcarroceria', sql.NVarChar, createGroupContract.group[i].xserialcarroceria)
//       .input('xserialmotor', sql.NVarChar, createGroupContract.group[i].xserialmotor)
//       .input('xplaca', sql.NVarChar, createGroupContract.group[i].xplaca)
//       .input('xmarca', sql.NVarChar, createGroupContract.group[i].xmarca)
//       .input('xmodelo', sql.NVarChar, createGroupContract.group[i].xmodelo)
//       .input('xversion', sql.NVarChar, createGroupContract.group[i].xversion)
//       .input('cano', sql.Int, createGroupContract.group[i].cano)
//       .input('xcolor', sql.NVarChar, createGroupContract.group[i].xcolor)
//       .input('xcobertura', sql.NVarChar, createGroupContract.group[i].xcobertura)
//       .input('msuma_aseg', sql.Numeric(17, 2), createGroupContract.group[i].msuma_aseg ? createGroupContract.group[i].msuma_aseg: undefined)
//       .input('mcatastrofico', sql.Numeric(17, 2), createGroupContract.group[i].msuma_aseg ? createGroupContract.group[i].msuma_aseg: undefined)
//       .input('mmotin', sql.Numeric(17, 2), createGroupContract.group[i].msuma_aseg ? createGroupContract.group[i].msuma_aseg: undefined)
//       .input('msuma_blindaje', sql.Numeric(17, 2), createGroupContract.group[i].msuma_blindaje ? createGroupContract.group[i].msuma_blindaje: undefined)
//       .input('xdireccionfiscal', sql.NVarChar, createGroupContract.group[i].xdireccionfiscal ? createGroupContract.group[i].xdireccionfiscal: undefined)
//       .input('xtelefono_emp', sql.NVarChar, createGroupContract.group[i].xtelefono_emp ? createGroupContract.group[i].xtelefono_emp: undefined)
//       .input('email', sql.NVarChar, createGroupContract.group[i].email ? createGroupContract.group[i].email: undefined)
//       .input('femision', sql.DateTime, new Date())
//       .input('fdesde_pol', sql.DateTime, parseDateFromString(createGroupContract.group[i].fdesde_pol))
//       .input('fhasta_pol', sql.DateTime, parseDateFromString(createGroupContract.group[i].fhasta_pol))
//       .input('ncapacidad_p', sql.Int, createGroupContract.group[i].ncapacidad_p)
//       .input('xuso', sql.NVarChar, createGroupContract.group[i].xuso)
//       .input('ccorredor', sql.Int, createGroupContract.group[i].ccorredor)
//       .input('cpais', sql.Int, createGroupContract.group[i].cpais)
//       .input('cestado', sql.Int, createGroupContract.group[i].cestado)
//       .input('cciudad', sql.Int, createGroupContract.group[i].cciudad)
//       .input('cestatusgeneral', sql.Int, 7)
//       .input('cclasificacion', sql.Char, createGroupContract.group[i].cclasificacion)
//       .input('xzona_postal', sql.NVarChar, createGroupContract.group[i].xzona_postal)
//       .query(`INSERT INTO TMEMISION_FLOTA (nro, id_inma, irif, xcliente, xrif_cliente, xnombre, xapellido, icedula, xcedula, fnac, cmetodologiapago, cplan_rc, ctarifa_exceso, xserialcarroceria, xserialmotor, xplaca, xmarca, xmodelo, xversion, cano, xcolor, xcobertura, msuma_aseg, mcatastrofico, mmotin, msuma_blindaje, xdireccionfiscal, xtelefono_emp, email, femision, fdesde_pol, fhasta_pol, ncapacidad_p, xuso, ccorredor, cpais, cestado, cciudad, cestatusgeneral, cclasificacion, xzona_postal) VALUES (@nro, @id_inma, @irif, @xcliente, @xrif_cliente, @xnombre, @xapellido, @icedula, @xcedula, @fnac, @cmetodologiapago, @cplan_rc, @ctarifa_exceso, @xserialcarroceria, @xserialmotor, @xplaca, @xmarca, @xmodelo, @xversion, @cano, @xcolor, @xcobertura, @msuma_aseg, @mcatastrofico, @mmotin, @msuma_blindaje, @xdireccionfiscal, @xtelefono_emp, @email, @femision, @fdesde_pol, @fhasta_pol, @ncapacidad_p, @xuso, @ccorredor, @cpais, @cestado, @cciudad, @cestatusgeneral, @cclasificacion, @xzona_postal)`);
//     }
    
//     await pool.close();

//     return { result: { rowsAffected: rowsAffected, status: true } };
//   } catch (err) {
//     console.log(err.message)
//     return { error: err.message };
//   }
// }

const createGroupContract = async (createGroupContract) => {
  try {
    let rowsAffected = 0;
    let pool = await sql.connect(sqlConfig);
    let id_inma;
    let errors = [];

    await pool.request().query("TRUNCATE TABLE TMEMISION_FLOTA");

    for (let i = 0; i < createGroupContract.group.length; i++) {

      if (createGroupContract.group[i].xmarca) {
        let result = await pool.request()
          .input('xmarca', sql.NVarChar, createGroupContract.group[i].xmarca)
          .input('xmodelo', sql.NVarChar, createGroupContract.group[i].xmodelo)
          .input('xversion', sql.NVarChar, createGroupContract.group[i].xversion)
          .input('cano', sql.Int, createGroupContract.group[i].cano)
          .query(`SELECT id FROM mainma where xmarca = @xmarca and xmodelo = @xmodelo and xversion = @xversion and qano = @cano`);
        if (result.recordset.length > 0) {

           id_inma = result.recordset.map(record => record.id);
           let nro = i + 1;
           let insert = await pool.request()
             .input('nro', sql.Int, nro)
             .input('irif', sql.Char, createGroupContract.group[i].irif)
             .input('id_inma', sql.Int, id_inma) 
             .input('xcliente', sql.NVarChar, createGroupContract.group[i].xcliente)
             .input('xrif_cliente', sql.NVarChar, createGroupContract.group[i].xrif_cliente)
             .input('xnombre', sql.NVarChar, createGroupContract.group[i].xnombre.trim())
             .input('xapellido', sql.NVarChar, createGroupContract.group[i].xapellido ? createGroupContract.group[i].xapellido: undefined)
             .input('icedula', sql.Char, createGroupContract.group[i].icedula)
             .input('xcedula', sql.NVarChar, createGroupContract.group[i].xcedula)
             .input('cmetodologiapago', sql.Int, createGroupContract.group[i].cmetodologiapago)
             .input('cplan_rc', sql.Int, createGroupContract.group[i].cplan_rc)
             .input('xserialcarroceria', sql.NVarChar, createGroupContract.group[i].xserialcarroceria)
             .input('xserialmotor', sql.NVarChar, createGroupContract.group[i].xserialmotor)
             .input('xplaca', sql.NVarChar, createGroupContract.group[i].xplaca)
             .input('xmarca', sql.NVarChar, createGroupContract.group[i].xmarca)
             .input('xmodelo', sql.NVarChar, createGroupContract.group[i].xmodelo)
             .input('xversion', sql.NVarChar, createGroupContract.group[i].xversion)
             .input('cano', sql.Int, createGroupContract.group[i].cano)
             .input('xcolor', sql.NVarChar, createGroupContract.group[i].xcolor)
             .input('xcobertura', sql.NVarChar, createGroupContract.group[i].xcobertura)
             .input('msuma_aseg', sql.Numeric(17, 2), createGroupContract.group[i].msuma_aseg ? createGroupContract.group[i].msuma_aseg: undefined)
             .input('pcasco', sql.Numeric(17, 2), createGroupContract.group[i].pcasco ? createGroupContract.group[i].pcasco: undefined)
             .input('mprima_bruta', sql.Numeric(17, 2), createGroupContract.group[i].mprima_bruta ? createGroupContract.group[i].mprima_bruta: undefined)
             .input('mprima_casco', sql.Numeric(17, 2), createGroupContract.group[i].mprima_casco ? createGroupContract.group[i].mprima_casco: undefined)
             .input('mcatastrofico', sql.Numeric(17, 2), createGroupContract.group[i].msuma_aseg ? createGroupContract.group[i].msuma_aseg: undefined)
             .input('mmotin', sql.Numeric(17, 2), createGroupContract.group[i].msuma_aseg ? createGroupContract.group[i].msuma_aseg: undefined)
             .input('xdireccionfiscal', sql.NVarChar, createGroupContract.group[i].xdireccionfiscal ? createGroupContract.group[i].xdireccionfiscal: undefined)
             .input('xtelefono_emp', sql.NVarChar, createGroupContract.group[i].xtelefono_emp ? createGroupContract.group[i].xtelefono_emp: undefined)
             .input('email', sql.NVarChar, createGroupContract.group[i].email ? createGroupContract.group[i].email: undefined)
             .input('femision', sql.DateTime, new Date())
             .input('fdesde_pol', sql.DateTime, parseDateFromString(createGroupContract.group[i].fdesde_pol))
             .input('fhasta_pol', sql.DateTime, parseDateFromString(createGroupContract.group[i].fhasta_pol))
             .input('ccorredor', sql.Int, createGroupContract.group[i].ccorredor)
             .input('cpais', sql.Int, 58)
             .input('cestado', sql.Int, createGroupContract.group[i].cestado)
             .input('cciudad', sql.Int, createGroupContract.group[i].cciudad)
             .input('cestatusgeneral', sql.Int, 7)
             .input('xzona_postal', sql.NVarChar, createGroupContract.group[i].xzona_postal)
     
           // Ejecutar la consulta de inserción
           let resultInsert = await insert.query(`INSERT INTO TMEMISION_FLOTA (nro, id_inma, irif, xcliente, xrif_cliente, xnombre, xapellido, icedula, xcedula, cmetodologiapago, cplan_rc, xserialcarroceria, xserialmotor, xplaca, xmarca, xmodelo, xversion, cano, xcolor, xcobertura, msuma_aseg, pcasco, mprima_bruta, mprima_casco, mcatastrofico, mmotin, xdireccionfiscal, xtelefono_emp, email, femision, fdesde_pol, fhasta_pol, ccorredor, cpais, cestado, cciudad, cestatusgeneral, xzona_postal) VALUES (@nro, @id_inma, @irif, @xcliente, @xrif_cliente, @xnombre, @xapellido, @icedula, @xcedula, @cmetodologiapago, @cplan_rc, @xserialcarroceria, @xserialmotor, @xplaca, @xmarca, @xmodelo, @xversion, @cano, @xcolor, @xcobertura, @msuma_aseg, @pcasco, @mprima_bruta, @mprima_casco, @mcatastrofico, @mmotin, @xdireccionfiscal, @xtelefono_emp, @email, @femision, @fdesde_pol, @fhasta_pol, @ccorredor, @cpais, @cestado, @cciudad, @cestatusgeneral, @xzona_postal)`);
     
           // Actualizar el contador de filas afectadas
           rowsAffected += resultInsert.rowsAffected[0];
        }else {
          errors.push(`Vehículos no encontrados: ${createGroupContract.group[i].xmarca} - ${createGroupContract.group[i].xmodelo} - ${createGroupContract.group[i].xversion} - ${createGroupContract.group[i].cano}`);
        }
      }
    }

    await pool.close();

    return { result: { rowsAffected: rowsAffected, status: true, error: errors } };
  } catch (err) {
    console.log(err.message)
    return { error: err.message };
  }
}

function areObjectsEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

function parseDateFromString(dateString) {
  if (!dateString) {
    return new Date(); // Devuelve null si la cadena es undefined o vacía
  }
  const parts = dateString.split('/');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Restar 1 porque los meses en JavaScript son base 0
  const year = parseInt(parts[2], 10);
  return new Date(year, month, day);
}

const searchQuotes = async (searchQuotes) => {
  try {
    const quotes = await Quotes.findAll({
      where: { ccotizacion: searchQuotes.ccotizacion, iaceptado: 1 },
      attributes: ['xnombre', 'xapellido', 'xcorreo', 'xmarca', 'xmodelo', 'xversion', 'npasajero', 'qano', 'cplan_rc', 'brcv', 'bamplia', 'bperdida', 'mtotal_rcv', 'ccorredor', 'xcorredor'],
    });



    const result = quotes.map((item) => item.get({ plain: true }));
    console.log(result)
    return result;
  } catch (error) {
    console.log(error.message);
    return { error: error.message };
  }
};


const createEmmisionGH = async(create,bcv) => {
  try{
      let rowsAffected = 0;
      let pool = await sql.connect(sqlConfig);
      let createEmmi = await pool.request()
      .input('cnpoliza_rel', sql.NVarChar(30), create.cnpoliza_rel)
      .input('cnrecibo_rel', sql.NVarChar(250), create.cnrecibo_rel)
      .input('cramo', sql.Int, create.cramo)
      .input('xcanal_venta', sql.Int, create.xcanal_venta)
      .input('icedula_tomador', sql.Char(1), create.icedula_tomador.toUpperCase())
      .input('xrif_tomador', sql.Numeric(17,0), create.xrif_tomador)
      .input('xnombre_tomador', sql.NVarChar(17,2), create.xnombre_tomador)
      .input('xapellido_tomador', sql.NVarChar(17,2), create.xapellido_tomador)
      .input('xdireccion_tomador', sql.NVarChar(17,2), create.xdireccion_tomador)
      .input('xcorreo_tomador', sql.NVarChar(17,2), create.xcorreo_tomador)
      .input('icedula_asegurado', sql.Char(1), create.icedula_asegurado.toUpperCase())
      .input('xrif_asegurado', sql.Numeric(17,0), create.xrif_asegurado)
      .input('xnombre_asegurado', sql.NVarChar(17,2), create.xnombre_asegurado)
      .input('xapellido_asegurado', sql.NVarChar(17,2), create.xapellido_asegurado)
      .input('isexo_asegurado', sql.Char(1), create.isexo_asegurado.toUpperCase())
      .input('iestado_civil', sql.Char(1), create.iestado_civil.toUpperCase())
      .input('fnac_asegurado', sql.DateTime, create.fnac_asegurado)
      .input('xdireccion_asegurado', sql.NVarChar(17,2), create.xdireccion_asegurado)
      .input('xcorreo_asegurado', sql.NVarChar(17,2), create.xcorreo_asegurado)
      .input('xtelefono_asegurado', sql.NVarChar(17,2), create.xtelefono_asegurado)
      .input('nbeneficiarios', sql.Int, create.nbeneficiarios)
      .input('msumaasegext', sql.Numeric(17,2), create.msumaasegext)
      .input('cmetodologiapago', sql.Int, create.cmetodologiapago)
      .input('cpoliza', sql.Numeric(19,0), create.cramo)
      .input('fanopol', sql.SmallInt, create.cramo)
      .input('fmespol', sql.TinyInt, create.cramo)
      .input('cnpoliza', sql.NVarChar(30), create.cramo)
      .input('cbanco', sql.Int, create.cramo)
      .input('xreferencia', sql.NVarChar(20), create.cramo)
      .input('fcobro', sql.DateTime, create.cramo)
      .input('femision', sql.DateTime, create.cramo)
      .input('ptasamon', sql.Numeric(18,2), bcv)

      .query('INSERT INTO eePoliza_Salud ' +
      '(cnpoliza_rel, cnrecibo_rel,cramo, xcanal_venta,'+
      'icedula_tomador, xrif_tomador, xnombre_tomador, xapellido_tomador, xdireccion_tomador, xcorreo_tomador,'+ 
      'icedula_asegurado, xrif_asegurado, xnombre_asegurado, xapellido_asegurado, isexo_asegurado, iestado_civil, fnac_asegurado, xdireccion_asegurado, xcorreo_asegurado, xtelefono_asegurado,'+
      'nbeneficiarios, msumaasegext,cmetodologiapago,cpoliza,fanopol,fmespol,cnpoliza,cbanco,xreferencia,fcobro,femision,ptasamon) '
      +'VALUES (@cnpoliza_rel, @cnrecibo_rel, @cramo, @xcanal_venta,'+
      '@icedula_tomador, @xrif_tomador, @xnombre_tomador, @xapellido_tomador, @xdireccion_tomador, @xcorreo_tomador,'+ 
      '@icedula_asegurado, @xrif_asegurado, @xnombre_asegurado, @xapellido_asegurado, @isexo_asegurado, @iestado_civil, @fnac_asegurado, @xdireccion_asegurado, @xcorreo_asegurado, @xtelefono_asegurado,'+
      '@nbeneficiarios, @msumaasegext,@cmetodologiapago,@cpoliza,@fanopol,@fmespol,@cnpoliza,@cbanco,@xreferencia,@fcobro,@femision,@ptasamon)');
  
      //sql.close();
      return { rowsAffected  };
  }
  catch(err){
      console.log(err.message);
      return { error: err.message };
  }
}

const createEmmisionGHB = async(create) => {
  try{
      let pool = await sql.connect(sqlConfig);
      let createEmmiBen = await pool.request()
      .input('xrif_asegurado', sql.Int, create.xrif_asegurado)
      .query('select * from eePoliza_Salud where xrif_asegurado = @xrif_asegurado');

      let dataEmmiBen = createEmmiBen.recordset[0]
      if(createEmmiBen){
        for(let i = 0; i < create.beneficiarios.length; i++){
          let insertEmmiBen = await pool.request()
          .input('id_salud', sql.Int, dataEmmiBen.id)
          .input('icedula_beneficiario', sql.Char(1), create.beneficiarios[i].icedula_beneficiario)
          .input('xrif_beneficiario', sql.Numeric(17,0), create.beneficiarios[i].xrif_beneficiario)
          .input('xnombre_beneficiario', sql.NVarChar(17,2), create.beneficiarios[i].xnombre_beneficiario)
          .input('xapellido_beneficiario', sql.NVarChar(17,2), create.beneficiarios[i].xapellido_beneficiario)
          .input('xparentesco_beneficiario', sql.NVarChar(20), create.beneficiarios[i].xparentesco_beneficiario)
          .input('fnac_beneficiario', sql.DateTime, create.beneficiarios[i].fnac_beneficiario)
          .input('cpoliza', sql.Numeric(19, 0), dataEmmiBen.cpoliza)
          .input('fanopol', sql.SmallInt, dataEmmiBen.fanopol)
          .input('fmespol', sql.TinyInt, dataEmmiBen.fmespol)
          .input('cnpoliza', sql.VarChar(50), dataEmmiBen.cnpoliza)
          .query('INSERT INTO eePoliza_Salud_Ben ' +
          '(id_salud,'+
          'icedula_beneficiario, xrif_beneficiario, xnombre_beneficiario, xapellido_beneficiario, xparentesco_beneficiario, fnac_beneficiario,'+ 
          'cpoliza, fanopol,fmespol , cnpoliza) '
          +'VALUES (@id_salud, '+
          '@icedula_beneficiario, @xrif_beneficiario, @xnombre_beneficiario, @xapellido_beneficiario, @xparentesco_beneficiario, @fnac_beneficiario,'+ 
          '@cpoliza, @fanopol,@fmespol , @cnpoliza)');

        }

      }
      return { status : true  };
  
      //sql.close();
  }
  catch(err){
      console.log(err.message);
      return { error: err.message };
  }
}


const createEmmisionAutomovile = async(create,bcv) => {
  try{
    let pool = await sql.connect(sqlConfig);
    let createEmmi = await pool.request()
    .input('fregistro', sql.DateTime, create.fregistro)
    .input('cproductor', sql.Int, create.cproductor)
    .input('xcanal_venta', sql.NVarChar(250), create.xcanal_venta)
    .input('poliza', sql.NVarChar(250), create.poliza)
    .input('cobertura', sql.NVarChar(250), create.cobertura)
    .input('tipo_doc', sql.Char(1), create.tipo_doc)
    .input('doc_identidad', sql.Numeric(22,0), create.doc_identidad)
    .input('nombre', sql.NVarChar(250), create.nombre)
    .input('apellido', sql.NVarChar(250), create.apellido)
    .input('estado', sql.NVarChar(250), create.estado)
    .input('ciudad', sql.NVarChar(17,0), create.ciudad)
    .input('direccion', sql.NVarChar(250), create.direccion)
    .input('fnacimiento', sql.DateTime, create.fnacimiento)
    .input('sexo', sql.Char(1), create.sexo)
    .input('telefono', sql.NVarChar(250), create.telefono)
    .input('correo', sql.NVarChar(250), create.correo)
    .input('tipo_pago', sql.NVarChar(50), create.tipo_pago)
    .input('fcobro', sql.DateTime, create.fcobro)
    .input('femision', sql.DateTime, create.femision)
    .input('banco', sql.SmallInt, create.banco)
    .input('banco_destino', sql.SmallInt, create.banco_destino)
    .input('sumaaseg', sql.Numeric(18,2), create.sumaaseg)
    .input('sumaasegext', sql.Numeric(18,2), create.sumaasegext)
    .input('prima', sql.Numeric(18,2), create.prima)
    .input('primaext', sql.Numeric(18,2), create.primaext)
    .input('ptasamon', sql.Numeric(18,2), bcv)
    .input('xreferencia', sql.NVarChar(20), create.xreferencia)
    .input('xmarca', sql.NVarChar(250), create.xmarca)
    .input('xmodelo', sql.NVarChar(250), create.xmodelo)
    .input('xversion', sql.NVarChar(250), create.xversion)
    .input('cano', sql.SmallInt, create.cano)
    .input('xplaca', sql.NVarChar(7), create.xplaca)
    .input('serial_carroceria', sql.NVarChar(50), create.serial_carroceria)
    .input('serial_motor', sql.NVarChar(50), create.serial_motor)
    .input('color', sql.NVarChar(50), create.color)
    .input('cplan_rc', sql.Int, create.cplan_rc)
    .query('INSERT INTO eePoliza_auto ' +
      '(fregistro,cproductor,xcanal_venta,poliza , cobertura, tipo_doc , doc_identidad , nombre,apellido,estado,ciudad,'+
      'direccion,fnacimiento,sexo,telefono,correo,tipo_pago,fcobro,femision,banco,banco_destino,sumaaseg,'+
      'sumaasegext,prima,primaext,ptasamon, xreferencia, xmarca, xmodelo , xversion , cano , xplaca,' +
      'serial_carroceria, serial_motor , color , cplan_rc)'
    +'VALUES (@fregistro,@cproductor,@xcanal_venta,@poliza , @cobertura, @tipo_doc , @doc_identidad , @nombre,@apellido,@estado,@ciudad,'+
    '@direccion,@fnacimiento,@sexo,@telefono,@correo,@tipo_pago,@fcobro,@femision,@banco,@banco_destino,@sumaaseg,'+
    '@sumaasegext,@prima,@primaext,@ptasamon, @xreferencia, @xmarca, @xmodelo , @xversion , @cano , @xplaca,' +
    '@serial_carroceria, @serial_motor , @color , @cplan_rc)' )

    //sql.close();
      return { status : true  };
  
      //sql.close();
  }
  catch(err){
      console.log(err.message);
      return { error: err.message };
  }
}

const searchRates = async (searchRates) => {

  try {
    const clasificacion = await Price.findAll({
      where: { cano: searchRates.cano, 
               xclase: searchRates.xclase, },
      attributes: ['pcobertura_amplia', 'pperdida_total'],
    });
    const result = clasificacion.map((item) => item.get({ plain: true }));
    return result;
  } catch (error) {
    return { error: error.message };
  }
};

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
    createGroupContract,
    searchQuotes,
    createEmmisionGH,
    createEmmisionGHB,
    searchRates,
    createEmmisionAutomovile
  };