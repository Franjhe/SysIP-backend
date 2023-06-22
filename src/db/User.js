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

const verifyIfUsernameExists = async (clogin) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('clogin', sql.NVarChar, clogin)
            .query('select cusuario, xusuario, clogin from seusuarios where clogin = @clogin')
        return { 
            result: result 
        };
    }
    catch (error) {
        console.log(error.message);
        return { error: error.message }
    }
}

const verifyIfPasswordMatchs = async (clogin, xclavesec) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('clogin', sql.NVarChar, clogin)
            .input('xclavesec', sql.NVarChar, xclavesec)
            .query('select cusuario from seusuarios where clogin = @clogin and xclavesec = @xclavesec')
        return { result: result };
    }
    catch (error) {
        console.log(error.message);
        return { error: error.message };
    }
}

export default {
    verifyIfUsernameExists,
    verifyIfPasswordMatchs
}