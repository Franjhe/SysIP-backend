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

// const createQuotes = async (createQuotes) => {
//     console.log(createQuotes)
//     try {
//         let pool = await sql.connect(sqlConfig);
//         let request = pool.request()
//             .input('id_inma', sql.Int, createQuotes.id_inma)
//             .input('xnombre', sql.NVarChar, createQuotes.xnombre)
//             .input('xapellido', sql.NVarChar, createQuotes.xapellido)
//             .input('ctarifa_exceso', sql.Int, createQuotes.ctarifa_exceso)
//             .input('xcorreo', sql.NVarChar, createQuotes.email)
//             .input('fano', sql.Int, createQuotes.fano)
//             .input('ncapacidad_p', sql.Int, createQuotes.ncapacidad_p)
//             .input('msuma', sql.Numeric(18, 2), createQuotes.msum)
//             .input('ccorredor', sql.Int, createQuotes.ccorredor)
//             .input('xtipo', sql.Char, createQuotes.xtipo);

//         if (createQuotes.xclasificacion) {
//             request.input('xclasificacion', sql.NVarChar, createQuotes.xclasificacion.trim());
//         }else{
//             request.input('xclasificacion', sql.NVarChar, null);
//         }

//         let result = await request.execute('trBCotizacionAuto');

//         if(createQuotes.xtipo == 'V'){
//             let query = await pool.request()
//             .query('SELECT TOP 5 ccotizacion, xmarca, xmodelo, xnombre, xapellido, cplan_rc, xplan_rc, mtotal_rcv, mtotal_amplia, mtotal_perdida, xcorredor, xcorreocorredor, xtelefonocorredor, pperdida_total, pcobertura_amplia FROM VWBUSCARCOTIZACION ORDER BY ccotizacion DESC');
//         }else{
//             let query = await pool.request()
//             .query('SELECT TOP 1 ccotizacion, xmarca, xmodelo, xnombre, xapellido, cplan_rc, xplan_rc, mtotal_rcv, mtotal_amplia, mtotal_perdida, xcorredor, xcorreocorredor, xtelefonocorredor, pperdida_total, pcobertura_amplia FROM VWBUSCARCOTIZACION ORDER BY ccotizacion DESC');
//         }
        
//         await pool.close();
//         return { result: query.recordset };

//     } catch (err) {
//         console.log(err.message);
//         return { error: err.message };
//     }
// }

const createQuotes = async (createQuotes) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let request = pool.request()
            .input('id_inma', sql.Int, createQuotes.id_inma)
            .input('xnombre', sql.NVarChar, createQuotes.xnombre)
            .input('xapellido', sql.NVarChar, createQuotes.xapellido)
            .input('ctarifa_exceso', sql.Int, createQuotes.ctarifa_exceso)
            .input('xcorreo', sql.NVarChar, createQuotes.email)
            .input('fano', sql.Int, createQuotes.fano)
            .input('ncapacidad_p', sql.Int, createQuotes.ncapacidad_p)
            .input('msuma', sql.Numeric(18, 2), createQuotes.msum)
            .input('ccorredor', sql.Int, createQuotes.ccorredor)
            .input('xtipo', sql.Char, createQuotes.xtipo);

        if (createQuotes.xclasificacion) {
            request.input('xclasificacion', sql.NVarChar, createQuotes.xclasificacion.trim());
        } else {
            request.input('xclasificacion', sql.NVarChar, null);
        }

        let result = await request.execute('trBCotizacionAuto');
        let query;

        if (createQuotes.xtipo == 'V') {
            query = await pool.request()
                .query('SELECT TOP 5 ccotizacion, xmarca, xmodelo, xnombre, xapellido, cplan_rc, xplan_rc, mtotal_rcv, mtotal_amplia, mtotal_perdida, xcorredor, xcorreocorredor, xtelefonocorredor, pperdida_total, pcobertura_amplia FROM VWBUSCARCOTIZACION ORDER BY ccotizacion DESC');
        } else {
            query = await pool.request()
                .query('SELECT TOP 1 ccotizacion, xmarca, xmodelo, xnombre, xapellido, cplan_rc, xplan_rc, mtotal_rcv, mtotal_amplia, mtotal_perdida, xcorredor, xcorreocorredor, xtelefonocorredor, pperdida_total, pcobertura_amplia FROM VWBUSCARCOTIZACION ORDER BY ccotizacion DESC');
        }

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

const detailQuotesAutomobile = async (detailQuotesAutomobile) => {
    try {
        const whereCondition = {
            iaceptado: 0
        };

        if (detailQuotesAutomobile.ccorredor !== null) {
            whereCondition.ccorredor = detailQuotesAutomobile.ccorredor;
        }

        const quotes = await DetailAuto.findAll({
            where: whereCondition,
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
        console.log(error.message);
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

  const updatePremiums = async (updatePremiums) => {
    try {
        let pool = await sql.connect(sqlConfig);
        console.log(updatePremiums.quotes)
        if (updatePremiums.quotes) {
            for (let i = 0; i < updatePremiums.quotes.length; i++) {
                let mtotal_amplia = isNaN(updatePremiums.quotes[i].mtotal_amplia) ? 0 : updatePremiums.quotes[i].mtotal_amplia;
                let mtotal_perdida = isNaN(updatePremiums.quotes[i].mtotal_perdida) ? 0 : updatePremiums.quotes[i].mtotal_perdida;
                let cplan_rc = isNaN(updatePremiums.quotes[i].cplan_rc) ? 0 : updatePremiums.quotes[i].cplan_rc;

                if (updatePremiums.quotes[i].pcobertura_amplia == null) {
                    let msuma_amplia = 0
                    let update = await pool.request()
                        .input('ccotizacion', sql.Int, updatePremiums.ccotizacion)
                        .input('msuma_amplia', sql.Numeric(18, 2), msuma_amplia)
                        .input('msuma_total', sql.Numeric(18, 2), updatePremiums.msuma_aseg)
                        .input('msuma_catastrofico', sql.Numeric(18, 2), updatePremiums.msuma_aseg)
                        .input('msuma_motin', sql.Numeric(18, 2), updatePremiums.msuma_aseg)
                        .input('mtotal_amplia', sql.Numeric(18, 2), mtotal_amplia)
                        .input('mtotal_perdida', sql.Numeric(18, 2), mtotal_perdida)
                        .input('cplan_rc', sql.Numeric(18, 2), cplan_rc)
                        .query('UPDATE TMEMISION_COTIZACION SET msuma_amplia = @msuma_amplia, msuma_total = @msuma_total, msuma_catastrofico = @msuma_catastrofico, msuma_motin = @msuma_motin, mtotal_amplia = @mtotal_amplia, mtotal_perdida = @mtotal_perdida WHERE ccotizacion = @ccotizacion and cplan_rc = @cplan_rc');

                        if(msuma_amplia){
                            let updateReporte = await pool.request()
                            .query('UPDATE tmreporte_cotiza SET m2 = NULL');
                        }

                } else if (updatePremiums.quotes[i].pperdida_total == null) {
                    let msuma_total = 0
                    let update = await pool.request()
                        .input('ccotizacion', sql.Int, updatePremiums.ccotizacion)
                        .input('msuma_amplia', sql.Numeric(18, 2), updatePremiums.msuma_aseg)
                        .input('msuma_total', sql.Numeric(18, 2), msuma_total)
                        .input('msuma_catastrofico', sql.Numeric(18, 2), updatePremiums.msuma_aseg)
                        .input('msuma_motin', sql.Numeric(18, 2), updatePremiums.msuma_aseg)
                        .input('mtotal_amplia', sql.Numeric(18, 2), mtotal_amplia)
                        .input('mtotal_perdida', sql.Numeric(18, 2), mtotal_perdida)
                        .input('cplan_rc', sql.Numeric(18, 2), cplan_rc)
                        .query('UPDATE TMEMISION_COTIZACION SET msuma_amplia = @msuma_amplia, msuma_total = @msuma_total, msuma_catastrofico = @msuma_catastrofico, msuma_motin = @msuma_motin, mtotal_amplia = @mtotal_amplia, mtotal_perdida = @mtotal_perdida WHERE ccotizacion = @ccotizacion and cplan_rc = @cplan_rc');

                    let updateReporte = await pool.request()
                        .query('UPDATE tmreporte_cotiza SET m3 = NULL');
                } else {
                    let update = await pool.request()
                        .input('ccotizacion', sql.Int, updatePremiums.ccotizacion)
                        .input('msuma_amplia', sql.Numeric(18, 2), updatePremiums.msuma_aseg)
                        .input('msuma_total', sql.Numeric(18, 2), updatePremiums.msuma_aseg)
                        .input('msuma_catastrofico', sql.Numeric(18, 2), updatePremiums.msuma_aseg)
                        .input('msuma_motin', sql.Numeric(18, 2), updatePremiums.msuma_aseg)
                        .input('mtotal_amplia', sql.Numeric(18, 2), mtotal_amplia)
                        .input('mtotal_perdida', sql.Numeric(18, 2), mtotal_perdida)
                        .input('cplan_rc', sql.Numeric(18, 2), cplan_rc)
                        .query('UPDATE TMEMISION_COTIZACION SET msuma_amplia = @msuma_amplia, msuma_total = @msuma_total, msuma_catastrofico = @msuma_catastrofico, msuma_motin = @msuma_motin, mtotal_amplia = @mtotal_amplia, mtotal_perdida = @mtotal_perdida WHERE ccotizacion = @ccotizacion and cplan_rc = @cplan_rc');
                }
            }
        }
        return { success: true, message: 'Cotizaciones actualizadas correctamente' };
    } catch (error) {
        return { success: false, message: 'Error al actualizar las Cotizaciones', error };
    }
};

export default {
    createQuotes,
    updateQuotes,
    searchCoverages,
    detailQuotes,
    detailQuotesAutomobile,
    searchQuotes,
    updatePremiums
}