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

const createQuotes = async (createQuotes) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('id_inma', sql.Int, createQuotes.id_inma)
            .input('fano', sql.Int, createQuotes.fano)
            .input('xcobertura', sql.NVarChar, createQuotes.xcobertura)
            .input('xnombre', sql.NVarChar, createQuotes.xnombre)
            .input('xapellido', sql.NVarChar, createQuotes.xapellido)
            .input('xcorreo', sql.NVarChar, createQuotes.email)
            .input('ctarifa_exceso', sql.Int, createQuotes.ctarifa_exceso)
            .input('cuso', sql.Int, createQuotes.cuso)
            .execute('trBCotizacionAuto');

        let query = await pool.request()
            .query('SELECT TOP 5 ccotizacion, xmarca, xmodelo, xnombre, xapellido, xplan_rc, mprima FROM VWBUSCARCOTIZACION ORDER BY ccotizacion DESC');
        await pool.close();
        return { result: query.recordset };

    } catch (err) {
        console.log(err.message);
        return { error: err.message };
    }
}

export default {
    createQuotes
}