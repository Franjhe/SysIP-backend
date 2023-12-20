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
    console.log(createQuotes)
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('id_inma', sql.Int, createQuotes.id_inma)
            .input('fano', sql.Int, createQuotes.fano)
            .input('xnombre', sql.NVarChar, createQuotes.xnombre)
            .input('xapellido', sql.NVarChar, createQuotes.xapellido)
            .input('xcorreo', sql.NVarChar, createQuotes.email)
            .input('ctarifa_exceso', sql.Int, createQuotes.ctarifa_exceso)
            .input('msuma', sql.Numeric(18, 2), createQuotes.msuma_aseg)
            .input('xclasificacion', sql.NVarChar, createQuotes.xclasificacion.trim())
            .input('ncapacidad_p', sql.Int, createQuotes.ncapacidad_p)
            .execute('trBCotizacionAuto');

        let query = await pool.request()
            .query('SELECT TOP 5 ccotizacion, xmarca, xmodelo, xnombre, xapellido, cplan_rc, xplan_rc, mtotal_rcv, mtotal_amplia, mtotal_perdida FROM VWBUSCARCOTIZACION ORDER BY ccotizacion DESC');
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

export default {
    createQuotes,
    updateQuotes
}