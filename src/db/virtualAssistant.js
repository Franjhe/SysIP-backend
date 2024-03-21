import sql from "mssql";

//SELECT DISTINCT Country FROM Customers;

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

const searchClient = async (cedula) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('cci_rif', sql.NVarChar, cedula)
            .query('select RTRIM(xnombre) as Nombre ,RTRIM(xapellido) as Apellido from maclient where cci_rif = @cci_rif')
            await pool.close();
            if(result.rowsAffected > 0){
                return { 
                    Nombre: result.recordset[0].Nombre ,
                    Apellido: result.recordset[0].Apellido
                };

            }else{
                return false
            }  
    }
    catch (error) {
        return { error: error.message }
    }
}

const searchPoliza = async (cedula) => {
    try {
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
            .input('cci_rif', sql.NVarChar, cedula)
            .query('select DISTINCT cpoliza as n_poliza, RTRIM(ramo) as ramo FROM adVpol_Coberturas where ctenedor = @cci_rif ')
            await pool.close();
        return result.recordsets[0]
    }
    catch (error) {
        console.log(error.message)
        return { error: error.message }
    }
}

export default {
    searchClient,
    searchPoliza
}