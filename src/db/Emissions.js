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

const Clasification = sequelize.define('MACLASIFICACION_VEH', {}, { tableName: 'MACLASIFICACION_VEH' });
const Price = sequelize.define('MATARIFA_CASCO', {}, { tableName: 'MATARIFA_CASCO' });
const OtherPrice = sequelize.define('MATARIFA_OTROS', {}, { tableName: 'MATARIFA_OTROS' });
const Contract = sequelize.define('SUCONTRATOFLOTA', {}, { tableName: 'SUCONTRATOFLOTA' });
const AllContract = sequelize.define('VWBUSCARSUCONTRATOFLOTADATA', {}, { tableName: 'VWBUSCARSUCONTRATOFLOTADATA' });
const Propietary = sequelize.define('TRPROPIETARIO', {}, { tableName: 'TRPROPIETARIO' });
const Vehicle = sequelize.define('VWBUSCARSUCONTRATOFLOTADATA', {}, { tableName: 'VWBUSCARSUCONTRATOFLOTADATA' });

const searchHullPrice = async (searchHullPrice) => {
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
        .input('cmetodologiapago', sql.Int, executePremiumAmount.cmetodologiapago)
        .input('cplan_rc', sql.Int, executePremiumAmount.cplan)
        .input('ctarifa_exceso', sql.Int, executePremiumAmount.ctarifa_exceso)
        .input('igrua', sql.Bit, executePremiumAmount.igrua)
        .input('ncapacidad_p', sql.Int, executePremiumAmount.npasajeros)
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
          .query('INSERT INTO TMEMISION_INDIVIDUAL (icedula, xrif_cliente, xnombre, xapellido, xcedula, xtelefono_emp, email, cestado, cciudad, xdireccionfiscal, xplaca, xmarca, xmodelo, xversion, cano, ncapacidad_p, xcolor, xserialcarroceria, xserialmotor, xcobertura, ctarifa_exceso, cplan_rc, ccorredor, ctomador, ccotizacion, cinspeccion, fdesde_pol, fhasta_pol, cclasificacion, msuma_aseg, mprima_bruta, pdescuento, pcatastrofico, mprima_casco, mcatastrofico, mmotin, pblindaje, msuma_blindaje, mprima_blindaje, xpago, femision, cmetodologiapago, cpais, id_inma, pcasco, pmotin) VALUES (@icedula, @xrif_cliente, @xnombre, @xapellido, @xcedula, @xtelefono_emp, @email, @cestado, @cciudad, @xdireccionfiscal, @xplaca, @xmarca, @xmodelo, @xversion, @cano, @ncapacidad_p, @xcolor, @xserialcarroceria, @xserialmotor, @xcobertura, @ctarifa_exceso, @cplan_rc, @ccorredor, @ctomador, @ccotizacion, @cinspeccion, @fdesde_pol, @fhasta_pol, @cclasificacion, @msuma_aseg, @mprima_bruta, @pdescuento, @pcatastrofico, @mprima_casco, @mcatastrofico, @mmotin, @pblindaje, @msuma_blindaje, @mprima_blindaje, @xpago, @femision, @cmetodologiapago, @cpais, @id_inma, @pcasco, @pmotin)')
          await pool.close();

          if(createIndividualContract.accesorios){
            
              const maxContract = await Contract.findOne({
                attributes: ['ccontratoflota'],
                order: [['ccontratoflota', 'DESC']],
                limit: 1,
              });
              const contrato = maxContract ? maxContract.get({ plain: true }) : null;

              let pool = await sql.connect(sqlConfig);
              for(let i = 0; i < createIndividualContract.accesorios.length; i++){
                let insert = await pool.request()
                .input('ccontratoflota', sql.Int, contrato.ccontratoflota)
                .input('caccesorio', sql.Int, createIndividualContract.accesorios[i].caccesorio)
                .input('maccesoriocontratoflota', sql.Numeric(11, 2), createIndividualContract.accesorios[i].xprimaAccesorio)
                .input('fcreacion', sql.DateTime, new Date()) 
                .input('cusuariocreacion', sql.Int, createIndividualContract.cusuario)
                .query('INSERT INTO SUACCESORIOCONTRATOFLOTA (ccontratoflota, caccesorio, maccesoriocontratoflota, fcreacion, cusuariocreacion) VALUES (@ccontratoflota, @caccesorio, @maccesoriocontratoflota, @fcreacion, @cusuariocreacion)');
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

export default {
    searchHullPrice,
    searchOtherPrice,
    executePremiumAmount,
    createIndividualContract,
    searchContractIndividual,
    searchAllContract,
    searchPropietary,
    searchVehicle
  };