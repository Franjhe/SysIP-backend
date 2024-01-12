import sql from "mssql";
import { Sequelize, DataTypes } from 'sequelize';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

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

const Coverages = sequelize.define('MACOBERTURA_RCV', {}, { tableName: 'MACOBERTURA_RCV' });
const Detail = sequelize.define('TMEMISION_COTIZACION', {}, { tableName: 'TMEMISION_COTIZACION' });
const DetailAuto = sequelize.define('VWBUSCARCOTIZACION', {}, { tableName: 'VWBUSCARCOTIZACION' });
const Search = sequelize.define('VWBUSCARCOTIZACION', {}, { tableName: 'VWBUSCARCOTIZACION' });

const createQuotes = async (createQuotes) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('id_inma', sql.Int, createQuotes.id_inma)
            .input('xnombre', sql.NVarChar, createQuotes.xnombre)
            .input('xapellido', sql.NVarChar, createQuotes.xapellido)
            .input('ctarifa_exceso', sql.Int, createQuotes.ctarifa_exceso)
            .input('xcorreo', sql.NVarChar, createQuotes.email)
            .input('fano', sql.Int, createQuotes.fano)
            .input('ncapacidad_p', sql.Int, createQuotes.ncapacidad_p)
            .input('msuma', sql.Numeric(18, 2), createQuotes.msum)
            .input('xclasificacion', sql.NVarChar, createQuotes.xclasificacion.trim())
            .input('ccorredor', sql.Int, createQuotes.ccorredor)
            
            .execute('trBCotizacionAuto');

        let query = await pool.request()
            .query('SELECT TOP 5 ccotizacion, xmarca, xmodelo, xnombre, xapellido, cplan_rc, xplan_rc, mtotal_rcv, mtotal_amplia, mtotal_perdida, xcorredor, xcorreocorredor, xtelefonocorredor FROM VWBUSCARCOTIZACION ORDER BY ccotizacion DESC');
        await pool.close();
        return { result: query.recordset };

    } catch (err) {
        console.log(err.message);
        return { error: err.message };
    }
}

const updateQuotes = async (updateQuotes) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let update = await pool.request()
            .input('ccotizacion', sql.Int, updateQuotes.ccotizacion)
            .input('cplan_rc', sql.Int, updateQuotes.cplan_rc)
            .input('brcv', sql.Bit, updateQuotes.brcv)
            .input('bamplia', sql.Bit, updateQuotes.bamplia)
            .input('bperdida', sql.Bit, updateQuotes.bperdida)
            .input('iaceptado', sql.Bit, updateQuotes.iaceptado)
            .input('faceptado', sql.DateTime, new Date())
            .query('UPDATE TMEMISION_COTIZACION SET iaceptado = @iaceptado, brcv = @brcv, bamplia = @bamplia, bperdida = @bperdida, faceptado = @faceptado WHERE ccotizacion = @ccotizacion AND cplan_rc = @cplan_rc')

        return update;
    } catch (error) {
        console.log(error);
        return { success: false, message: 'Error al actualizar la Cotizacion', error };
    }
};

const searchCoverages = async () => {
    try {
        const coverages = await Coverages.findAll({
            attributes: ['ccobertura', 'xcobertura', 'ititulo', 'corden'],
            where: {
                CORDEN: {
                    [Op.lte]: 29
                }
            },
            order: [
                ['CORDEN', 'ASC']
            ]
        });

        const coverage = coverages.map((item) => item.get({ plain: true }));
        return coverage;
    } catch (error) {
        console.log(error.message)
        return { error: error.message };
    }
};

// const detailQuotes = async (detailQuotes) => {
//     try {
//         const quotes = await Detail.findAll({
//             attributes: ['msuma_persona', 
//                          'msuma_dc', 
//                          'msuma_exceso', 
//                          'msuma_defensa',
//                          'msuma_muerte',
//                          'msuma_invalidez',
//                          'msuma_gm',
//                          'msuma_gf',
//                          'msuma_amplia',
//                          'msuma_total',
//                          'msuma_catastrofico',
//                          'msuma_motin',
//                          'mprima_motin_pt',
//                          'msuma_indem'],
//             where: {
//                 ccotizacion: detailQuotes.ccotizacion,
//                 cplan_rc: detailQuotes.cplan,
//             }
//         });

//         const detail = quotes.map((item) => item.get({ plain: true }));
//         return detail;
//     } catch (error) {
//         console.log(error.message)
//         return { error: error.message };
//     }
// };

const detailQuotes = async (detailQuotes) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('ncotizacion', sql.Int, detailQuotes.ccotizacion)
            .input('cplan_rc', sql.Int, detailQuotes.cplan)
            .input('fano', sql.Int, detailQuotes.fano)
            .execute('trBReporte_Cot');

        let query = await pool.request()
            .query('select * from TMREPORTE_COTIZA order by corden');


        let query2 = await pool.request()
        .query('select * from TMFRACCIONAMIENTO order by cmetodologiapago desc');
        
        await pool.close();
        return { result: query.recordset, metodology: query2.recordset };

    } catch (err) {
        console.log(err.message);
        return { error: err.message };
    }
}

const detailQuotesAutomobile = async () => {
    try {
      const quotes = await DetailAuto.findAll({
        where: {iaceptado: 0},
        attributes: [
            [Sequelize.literal('DISTINCT ccotizacion'), 'ccotizacion'],
            'xnombre',
            'xapellido',
            'xmarca',
            'xmodelo',
            'xversion',
            'iaceptado',
          ],
      });
  
      const result = quotes.map((item) => item.get({ plain: true }));
      return result;
    } catch (error) {
        console.log(error.message)
      return { error: error.message };
    }
  };

  const searchQuotes = async (searchQuotes) => {
    try {
      const quotes = await DetailAuto.findAll({
        where: {ccotizacion: searchQuotes.ccotizacion},
        attributes: [
            'ccotizacion',
            'cplan_rc',
            'xmarca',
            'xmodelo',
            'xversion',
            'xnombre',
            'xapellido',
            'mtotal_rcv',
            'mtotal_amplia',
            'mtotal_perdida',
            'xplan_rc',
            'npasajero',
            'qano',
            'xcorreo',
            'xcorredor',
            'xcorreocorredor',
            'xtelefonocorredor',
          ],
      });
  
      const result = quotes.map((item) => item.get({ plain: true }));
      return result;
    } catch (error) {
        console.log(error.message)
      return { error: error.message };
    }
  };


export default {
    createQuotes,
    updateQuotes,
    searchCoverages,
    detailQuotes,
    detailQuotesAutomobile,
    searchQuotes
}