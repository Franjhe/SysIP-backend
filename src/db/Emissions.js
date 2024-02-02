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

const createGroupContract = async (createGroupContract) => {
  try {
    let rowsAffected = 0;
    let pool = await sql.connect(sqlConfig);
    let contractNoInsert = [];
    let foundIds = []
    foundIds.ids = [];

    for (let i = 0; i < createGroupContract.group.length; i++) {
      // Validar si tiene código de inma
      if (createGroupContract.group[i].xmarca && createGroupContract.group[i].xmodelo && createGroupContract.group[i].xversion) {
        let searchInma = await pool.request()
          .input('u_version', sql.Char, '!')
          .input('xmarca', sql.NVarChar, createGroupContract.group[i].xmarca)
          .input('xmodelo', sql.NVarChar, createGroupContract.group[i].xmodelo)
          .input('xversion', sql.NVarChar, createGroupContract.group[i].xversion)
          .input('cano', sql.Int, createGroupContract.group[i].cano)
          .query(`SELECT ID AS ID_INMA FROM mainma WHERE u_version = @u_version${createGroupContract.group[i].xmarca ? ' and xmarca = @xmarca' : ''}${createGroupContract.group[i].xmodelo ? ' and xmodelo = @xmodelo' : ''}${createGroupContract.group[i].xversion ? ' and xversion = @xversion' : ''}${createGroupContract.group[i].cano ? ' and qano = @cano' : ''}`);

        if (searchInma.recordset.length === 0) {
          contractNoInsert.push(createGroupContract.group[i]);
        } else {
          foundIds.push(searchInma.recordset.map(record => record.ID_INMA));
        }
      }

      if (createGroupContract.group[i].xplaca) {
        let searchPlaca = await pool.request()
          .input('xplaca', sql.NVarChar, createGroupContract.group[i].xplaca)
          .query(`SELECT * FROM VWBUSCARSUCONTRATOFLOTADATA WHERE CPAIS = 58${createGroupContract.group[i].xplaca ? ' and XPLACA = @xplaca' : ''}`);

        if (searchPlaca.recordset.length > 0) {
          contractNoInsert.push(createGroupContract.group[i]);
        }
      }

      if (createGroupContract.group[i].xcobertura !== 'Rcv') {
        const year = parseInt(createGroupContract.group[i].cano);
        if (year < 2006) {
          contractNoInsert.push(createGroupContract.group[i]);
        }
      }
    }

    for (let j = 0; j < createGroupContract.group.length; j++) {
      const item = createGroupContract.group[j];
      const foundIdsArray = foundIds;

      console.log(createGroupContract.group[j])

      if (!contractNoInsert.some(existingItem => areObjectsEqual(existingItem, item))) {
        for (const foundId of foundIdsArray) {
          await pool.request()
          .input('icedula', sql.Char, 'V' ? item.icedula : undefined)
          .input('xrif_cliente', sql.NVarChar, item.xcedula ? item.xcedula : undefined)
          .input('xcedula', sql.NVarChar, item.xcedula ? item.xcedula : undefined)
          .input('xnombre', sql.NVarChar, item.xnombre ? item.xnombre.toUpperCase() : undefined)
          .input('xapellido', sql.NVarChar, item.xapellido ? item.xapellido.toUpperCase() : undefined)
          .input('xtelefono_emp', sql.NVarChar, item.xtelefono ? item.xtelefono : undefined)
          .input('email', sql.NVarChar, item.email ? item.email.toUpperCase() : undefined)
          .input('cestado', sql.Int, item.cestado ? item.cestado : undefined)
          .input('cciudad', sql.Int, item.cciudad ? item.cciudad : undefined)
          .input('fnac', sql.NVarChar, item.fnacimiento ? item.fnacimiento : undefined)
          .input('iestado_civil', sql.NVarChar, item.iestado_civil ? item.iestado_civil : undefined)
          .input('isexo', sql.NVarChar, item.isexo ? item.isexo : undefined)
          .input('xdireccionfiscal', sql.NVarChar, item.xdireccion.toUpperCase() ? item.xdireccion : undefined)
          .input('xplaca', sql.NVarChar, item.xplaca.toUpperCase() ? item.xplaca : undefined)
          .input('xmarca', sql.NVarChar, item.xmarca.toUpperCase() ? item.xmarca : undefined)
          .input('xmodelo', sql.NVarChar, item.xmodelo.toUpperCase() ? item.xmodelo : undefined)
          .input('xversion', sql.NVarChar, item.xversion.toUpperCase() ? item.xversion : undefined)
          .input('cano', sql.Int, item.cano ? item.cano : undefined)
          .input('ncapacidad_p', sql.Int, item.ncapacidad ? item.ncapacidad : undefined)
          .input('xcolor', sql.NVarChar, item.xcolor.toUpperCase() ? item.xcolor : undefined)
          .input('xserialcarroceria', sql.NVarChar, item.xserialcarroceria.toUpperCase() ? item.xserialcarroceria : undefined)
          .input('xserialmotor', sql.NVarChar, item.xserialmotor.toUpperCase() ? item.xserialmotor : undefined)
          .input('xcobertura', sql.NVarChar, item.xcobertura ? item.xcobertura : undefined)
          .input('ctarifa_exceso', sql.Int, item.ctarifa ? item.ctarifa : undefined)
          .input('cplan_rc', sql.Int, item.cplan ? item.cplan : undefined)
          .input('ccorredor', sql.Int, item.ccorredor ? item.ccorredor : 80080)
          .input('ctomador', sql.Int, item.ctomador ? item.ctomador : undefined)
          .input('fdesde_pol', sql.DateTime, item.fdesde ? item.fdesde : undefined)
          .input('fhasta_pol', sql.DateTime, item.fhasta ? item.fhasta : undefined)
          .input('cclasificacion', sql.Char, item.cclasificacion ? item.cclasificacion : undefined)
          .input('id_inma', sql.Int, foundId)
          .input('pcasco', sql.Numeric(17, 2), item.pcasco ? item.pcasco : undefined)
          .input('msuma_aseg', sql.Numeric(17, 2), item.msuma_aseg ? item.msuma_aseg : undefined)
          .input('mprima_bruta', sql.Numeric(17, 2), item.mprima_bruta ? item.mprima_bruta : undefined)
          .input('mprima_casco', sql.Numeric(17, 2), item.mprima_casco ? item.mprima_casco : undefined)
          .input('pblindaje', sql.Numeric(17, 2), item.pblindaje ? item.pblindaje : undefined)
          .input('msuma_blindaje', sql.Numeric(17, 2), item.msuma_blindaje ? item.msuma_blindaje : undefined)
          .input('mprima_blindaje', sql.Numeric(17, 2), item.mprima_blindaje ? item.mprima_blindaje : undefined)
          .input('femision', sql.DateTime, new Date())
          .input('cpais', sql.Int, 58)
          .query(`INSERT INTO TMEMISION_INDIVIDUAL (
            icedula, xrif_cliente, xcedula, xnombre, xapellido, xtelefono_emp, email, cestado, cciudad,
            fnac, iestado_civil, isexo, xdireccionfiscal, xplaca, xmarca, xmodelo, xversion, cano,
            ncapacidad_p, xcolor, xserialcarroceria, xserialmotor, xcobertura, ctarifa_exceso, cplan_rc,
            ccorredor, ctomador, fdesde_pol, fhasta_pol, cclasificacion, id_inma, pcasco, msuma_aseg,
            mprima_bruta, mprima_casco, pblindaje, msuma_blindaje, mprima_blindaje, femision, cpais
          ) VALUES (
            @icedula, @xrif_cliente, @xcedula, @xnombre, @xapellido, @xtelefono_emp, @email,
            @cestado, @cciudad, @fnac, @iestado_civil, @isexo, @xdireccionfiscal, @xplaca,
            @xmarca, @xmodelo, @xversion, @cano, @ncapacidad_p, @xcolor, @xserialcarroceria,
            @xserialmotor, @xcobertura, @ctarifa_exceso, @cplan_rc, @ccorredor, @ctomador,
            @fdesde_pol, @fhasta_pol, @cclasificacion, @id_inma, @pcasco, @msuma_aseg, @mprima_bruta,
            @mprima_casco, @pblindaje, @msuma_blindaje, @mprima_blindaje, @femision, @cpais
          )`);
  
          rowsAffected++;
          console.log(`Datos insertados para el ítem con Nombre ${item.xnombre}`);
        }
      } else {
        console.log(`El ítem con icedula ${item.icedula} ya está en contractNoInsert y no se insertará en la base de datos.`);
      }
    }

    await pool.close();

    return { result: { rowsAffected: rowsAffected, status: true } };
  } catch (err) {
    console.log(err.message)
    return { error: err.message };
  }
}

function areObjectsEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
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
    searchQuotes
  };