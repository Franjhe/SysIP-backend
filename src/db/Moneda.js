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

const updateMaster = async (bcv) => {
    try{
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
        .input('bcv', sql.Numeric(18,6), bcv)
        .input('cmoneda', sql.Char(4), '$   ')
        .query('update mamonedas set ptasamon = @bcv where cmoneda = @cmoneda');
        await pool.close();
        return result;
    }catch(err){
        return { error: err.message };
        }
}

const updateHistory = async (bcv) => {
    try{
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
        .input('bcv', sql.Numeric(18,6), bcv)
        .input('fmoneda', sql.DateTime, new Date())
        .input('fingreso', sql.DateTime, new Date())
        .input('cmoneda', sql.Char(4), '$   ')
        .input('cusuario', sql.Numeric(11), 1)
        .query('insert into mavamoneda (cmoneda,ptasamon, fingreso, fmoneda, cusuario ) values( @cmoneda,@bcv, @fingreso, @fmoneda, @cusuario) ');
        await pool.close();
        return result;
              
    }catch(err){
        return { error: err.message };
        }
}

export default {
    updateMaster,
    updateHistory
}