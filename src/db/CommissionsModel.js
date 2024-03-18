import sql from "mssql";

import EmailService from "../config/email.service.js";

import ejs from "ejs";
import * as fs from 'node:fs/promises';

const emailService = new EmailService();

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

const searchCualquierData = async () => {
    try {

        let pool = await sql.connect(sqlConfig);
        let search = await pool.request()
            // .query(`SELECT * FROM rpBComisiones`);
            .query(`SELECT B.cnpoliza, B.crecibo, A.imovcom, A.canexo, B.femision, B.mprimabrutaext, A.mmovcom FROM admovcom A
        LEFT JOIN adrecibos B ON B.crecibo = A.ccodigo
        WHERE A.cproductor = 0`);

        if (search.rowsAffected) {
            return {
                search: search.recordset
            };

        }

        await pool.close();
        return { result: search.recordset };

    }
    catch (err) {
        return { error: err.message, message: 'No se pudo encontrar comisión, por favor revise los datos e intente nuevamente ' };
    }
}

const searchComisionesProductores = async () => {
    try {

        let pool = await sql.connect(sqlConfig);
        let search = await pool.request()
            .query(`select A.cproductor, B.xnombre, sum(A.mmovcom) as mcomtot, sum(A.mmovcomext) as mcomexttot, (sum(A.mmovcom) + sum(A.mmovcomext)) as mmovcom, A.cmoneda from admovcom A
            left join maclient B On A.cproductor=b.cci_rif AND B.ccategoria=24 WHERE istatcom = 'P' GROUP BY A.cproductor, B.xnombre, A.cmoneda ;`);

        if (search.rowsAffected) {

            // console.log( Object.values(search.recordset));
            // var arraylol = Object.values(search.recordset);
            var new_array = []
            for (let i = 0; i < search.recordset.length; i++) {
                const element = search.recordset[i];

                // console.log(element.cproductor);
                // console.log(element.cmoneda);

                let result = await pool.request()
                    .input('cproductor', sql.Numeric(11, 0), element.cproductor)
                    .input('cmoneda', sql.Char(4, 0), element.cmoneda)
                    .query(`SELECT ccodigo FROM admovcom WHERE cproductor = @cproductor AND cmoneda = @cmoneda AND istatcom = 'P';`);

                // console.log(result);
                // var value = Object.values(result.recordset[0]);
                var minilist = [];
                result.recordset.forEach(e => {
                    minilist.push(e.ccodigo)
                    Object.assign(search.recordset[i], { 'recibos': minilist });
                });

            }

            return {
                search: search.recordset
            };


        }

        await pool.close();
        return { result: search.recordset };

    }
    catch (err) {
        return { error: err.message, message: 'No se pudo encontrar comisión, por favor revise los datos e intente nuevamente ' };
    }
}
const searchInsurerCommissions = async (data) => {
    try {

        console.log('↓');
        console.log(data);
        let pool = await sql.connect(sqlConfig);
        let search = await pool.request()
            .input('cproductor', sql.Numeric(11, 0), data.ccorredor)
            .input('cmoneda', sql.Char(4, 0), data.cmoneda)
            // .query(`SELECT * FROM rpBComisiones`);
            .query(`SELECT B.cnpoliza, B.crecibo, A.imovcom, A.canexo, B.femision, B.mmontoapag, A.mmovcom, A.cmoneda FROM admovcom A
            LEFT JOIN adrecibos B ON B.crecibo = A.ccodigo
            WHERE A.cproductor = @cproductor and A.cmoneda = @cmoneda`);

        if (search.rowsAffected) {
            return {
                search: search.recordset
            };

        }

        await pool.close();
        return { result: search.recordset };

    }
    catch (err) {
        return { error: err.message, message: 'No se pudo encontrar comisión, por favor revise los datos e intente nuevamente ' };
    }
}
const searchDataProductor = async (data) => {
    try {

        console.log(data);
        let pool = await sql.connect(sqlConfig);
        let search = await pool.request()
            .input('cproductor', sql.Numeric(11, 0), data)
            .query(`SELECT B.cid, B.cci_rif, B.xnombre FROM maproduc A
        LEFT JOIN maclient B ON B.cci_rif = A.cproductor
        WHERE A.cproductor = @cproductor`);

        if (search.rowsAffected) {
            return {
                search: search.recordset
            };

        }

        await pool.close();
        return { result: search.recordset };

    }
    catch (err) {
        return { error: err.message, message: 'No se pudo encontrar comisión, por favor revise los datos e intente nuevamente ' };
    }
}

const searchPaymentRequests = async () => {
    try {

        let pool = await sql.connect(sqlConfig);
        let search = await pool.request()
            // .query(`SELECT * FROM rpBComisiones`);
            .query(`SELECT 
            CASE 
                WHEN istatsol = 'P' THEN 'Pendiente'
                WHEN istatsol = 'C' THEN 'Cancelado'
                ELSE ''
            END as xstatsol
            ,* FROM adsolpg;`);

        if (search.rowsAffected) {
            return {
                search: search.recordset
            };
        }

        await pool.close();
        return { result: search.recordset };

    }
    catch (err) {
        return { error: err.message, message: 'No se pudo encontrar solicitud de pago, por favor revise los datos e intente nuevamente ' };
    }
}

const createPaymentRequests = async (data) => {
    try {

        console.log("↓");
        let csolpag;

        let pool = await sql.connect(sqlConfig);


        // if(searchcsolpag.rowsAffected){


        for (let i = 0; i < data.list.length; i++) {
            console.log(data.list[i]);
            let searchcsolpag = await pool.request()
                .query(`SELECT MAX(csolpag) FROM adsolpg`);
            csolpag = Object.values(searchcsolpag.recordset[0])[0] + 1;
            if (searchcsolpag.rowsAffected) {

                let search = await pool.request()
                    .input('csolpag', sql.Numeric(17, 0), csolpag) //
                    .input('xtransaccion', sql.Char(30, 0), data.list[i].xtransaccion) //
                    .input('csucursal', sql.Numeric(3, 0), data.list[i].csucursal) //
                    // .input('xsucursal',         sql.Numeric(18, 0), data.list[i].xsucursal)
                    .input('ffacturacion', sql.DateTime, new Date()) //
                    .input('fanopol', sql.Numeric(4, 0), new Date().getFullYear()) //
                    .input('fmespol', sql.Numeric(2, 0), new Date().getMonth()) //
                    // .input('cstatus',           sql.Numeric(18, 0), data.list[i].cstatus)
                    // .input('xstatus',           sql.Numeric(18, 0), data.list[i].xstatus)
                    .input('cid', sql.Char(30, 0), data.list[i].cid) //
                    .input('xbeneficiario', sql.Char(60, 0), data.list[i].xbeneficiario)
                    // .input('cconcepto',         sql.Numeric(11, 0), data.list[i].cconcepto)
                    .input('xconcepto', sql.Char(30, 0), data.list[i].xconcepto) //
                    .input('ccorredor', sql.Numeric(11, 0), data.list[i].ccorredor) //
                    // .input('xcorredor',         sql.Numeric(18, 0), data.list[i].xcorredor)
                    .input('mmontototal', sql.Numeric(11, 0), data.list[i].mmontototal) //
                    .input('cmoneda', sql.Char(4, 0), data.list[i].cmoneda) //
                    .input('xobservaciones', sql.VarChar(255, 0), data.list[i].xobservaciones) //
                    .query(`INSERT INTO adsolpg (csolpag, cmoneda, fsolicit, fmovim, fanopol, fmespol, istatsol, csucur, cproductor, cben, cid_ben, xbeneficiario, mpagosol, xconcepto_1, xconcepto_2, xobserva, fingreso)
                    VALUES (@csolpag, @cmoneda, @ffacturacion, @ffacturacion, @fanopol, @fmespol, 'P', @csucursal, @ccorredor, @ccorredor, @cid, @xbeneficiario, @mmontototal, @xtransaccion, @xconcepto, @xobservaciones, @ffacturacion)`)

                // if (search.rowsAffected) {
                for (let j = 0; j < data.list[i].recibos.length; j++) {
                    console.log(data.list[i].recibos[j]);
                    // const element = data.list[i].recibos[j];
                    console.log(data.list[i].ccorredor);

                    let updateReceipt = pool.request()
                        .input('ccodigo', sql.Numeric(19, 0), data.list[i].recibos[j])
                        .input('cproductor', sql.Numeric(11, 0), data.list[i].ccorredor)
                        .query(`UPDATE [dbo].[admovcom] SET [istatcom] = 'C' WHERE [cproductor] = @cproductor 
                            AND [ccodigo] = @ccodigo;`);
                }

                // }


            }



            // if(search.rowsAffected){

            //     return { result: data };

            // }

            return { result: { message: 'Datos insertados correctamente.' } };

            // }
            await pool.close();
            return { result: data };

        }
    }
    catch (err) {
        return { error: err.message, message: 'No se pudo encontrar la orden, por favor revise los datos e intente nuevamente ' };
    }
}
const payPaymentRequests = async (data) => {
    try {

        console.log("↓");
        let csolpag = data.csolpag;
        let pool = await sql.connect(sqlConfig);

        let update = await pool.request()
            .input('csolpag', sql.Numeric(17, 0), csolpag) //
            .query(`UPDATE [dbo].[adsolpg] SET [istatsol] = 'C' WHERE [csolpag] = @csolpag`);

        if (update.rowsAffected) {

            return { result: { message: `Solicitud de pago #${csolpag} cancelada correctamente.` } };

            await pool.close();
            return { result: data };

        }
    }
    catch (err) {
        return { error: err.message, message: 'No se pudo encontrar la orden, por favor revise los datos e intente nuevamente ' };
    }
}
const detailPaymentRequest = async (data) => {
    try {

        console.log("↓");
        let csolpag = data.csolpag;
        let pool = await sql.connect(sqlConfig);

        let search = await pool.request()
            .input('csolpag', sql.Numeric(17, 0), csolpag) //
            .query(`SELECT 
            CASE 
                WHEN istatsol = 'P' THEN 'Pendiente'
                WHEN istatsol = 'C' THEN 'Cancelado'
                ELSE ''
            END as xstatsol
            ,* FROM adsolpg
            WHERE csolpag = @csolpag;`);

        if (search.rowsAffected) {
            return {
                search: search.recordset
            };
        }

        await pool.close();
        return { result: search.recordset };

    }
    catch (err) {
        return { error: err.message, message: 'No se pudo encontrar la orden, por favor revise los datos e intente nuevamente ' };
    }
}



export default {
    searchCualquierData,
    searchComisionesProductores,
    searchInsurerCommissions,
    searchDataProductor,
    searchPaymentRequests,
    createPaymentRequests,
    payPaymentRequests,
    detailPaymentRequest,
}