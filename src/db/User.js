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

const verifyIfUsernameExists = async (xlogin) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('xlogin', sql.NVarChar, xlogin)
            .query('select cusuario, xusuario, xlogin from seusuariosweb where xlogin = @xlogin')
            await pool.close();
        return { 
            result: result 
        };
    }
    catch (error) {
        console.log(error.message)
        return { error: error.message }
    }
}

const verifyIfPasswordMatchs = async (xlogin, xcontrasena) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('xlogin', sql.NVarChar, xlogin)
            .input('xcontrasena', sql.NVarChar, xcontrasena)
            .query('select cusuario from seusuariosweb where xlogin = @xlogin and xcontrasena = @xcontrasena')
            await pool.close();
        return { result: result };
    }
    catch (error) {
        console.log(error.message)
        return { error: error.message };
    }
}

const getOneUser = async (xlogin) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
           .input('xlogin', sql.NVarChar, xlogin)
           .query('select * from seVlogin where xlogin = @xlogin')
        if (result.rowsAffected < 1) {
            return false;
        }
        await pool.close();
        return result.recordset[0];
    }
    catch (error) {
        return { error: error.message };
    }
}

// const getOneUserPhp = async (getOneUserPhp) => {
//     console.log(getOneUserPhp.xcorreo)
//     try {
//         let pool = await sql.connect(sqlConfig);
//         let result = await pool.request()
//            .input('xcorreo', sql.NVarChar, getOneUserPhp.xcorreo)
//            .query('select * from seVlogin where xcorreo_corredor = @xcorreo')
//         if (result.rowsAffected < 1) {
//             return false;
//         }
//         console.log(result.recordset[0])
//         await pool.close();
//         return result.recordset[0];
//     }
//     catch (error) {
//         console.log(error.message);
//         return { error: error.message };
//     }
// }

const getOneUserPhp = async (getOneUserPhp) => {
    console.log(getOneUserPhp.xcorreo);
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('xcorreo', sql.NVarChar, getOneUserPhp.xcorreo)
            .query(`
                SELECT
                    ccorredor,
                    xcorredor,
                    xcorreo_corredor,
                    cagencia,
                    xnombre_agencia,
                    xcorreo_agencia,
                    cproductor,
                    xnombre_productor,
                    xcorreo_productor,
                    CASE
                        WHEN xcorreo_corredor = @xcorreo THEN 'Corredor'
                        WHEN xcorreo_agente = @xcorreo THEN 'Agente'
                        WHEN xcorreo_productor = @xcorreo THEN 'Productor'
                        ELSE 'No encontrado'
                    END AS TipoEmisor
                FROM
                    maVagentesxcorredor
                WHERE
                    xcorreo_corredor = @xcorreo OR xcorreo_agente = @xcorreo OR xcorreo_productor = @xcorreo
            `);

        if (result.rowsAffected < 1) {
            return false;
        }

        console.log(result.recordset[0]);
        await pool.close();
        return result.recordset[0];
    } catch (error) {
        console.log(error.message);
        return { error: error.message };
    }
};

export default {
    verifyIfUsernameExists,
    verifyIfPasswordMatchs,
    getOneUser,
    getOneUserPhp
}