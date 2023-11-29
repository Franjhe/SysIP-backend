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

const searchDataReceipt = async(searchDataReceipt) => {
    try{
        let pool = await sql.connect(sqlConfig);
        let search = await pool.request()
        .input('xcontrato', sql.Numeric(18, 0), searchDataReceipt)
        .query('select xcliente from clcliente where xcontrato  = @xcontrato')

        if(search.rowsAffected){
            let pool = await sql.connect(sqlConfig);
            let receipt = await pool.request()
            .input('casegurado', sql.Numeric(18, 0), searchDataReceipt)
            .input('iestcont', sql.Char(1, 0), 'P')
            .query('select cnpoliza,cnrecibo, cpoliza ,fanopol , fmespol , cramo , cmoneda , fhasta_pol , fdesde , fhasta , ' + 
                   'fdesde_pol , mprimabruta , mprimabrutaext  from adrecibos where casegurado = @casegurado and iestcont = @iestcont ')
            await pool.close();
            return { 
                receipt: receipt.recordset ,
                client : search.recordset
            };

        }

        await pool.close();
        return { result: search.recordset };

    }
    catch(err){
        return { error: err.message, message: 'No se pudo encontrar el cliente, por favor revise los datos e intente nuevamente ' };
    }
}

const createPaymentReportW = async(createPaymentReport) => {
    try{
        let pool = await sql.connect(sqlConfig);
        let search = await pool.request()
        .input('casegurado'   , sql.Numeric(18, 0), createPaymentReport.casegurado)   
        .input('cmoneda'      , sql.Char(4, 0), createPaymentReport.cmoneda )  
        .input('mpago_dec'        , sql.Numeric(18, 0), createPaymentReport.mpago_dec ) 
        .input('mpago'        , sql.Numeric(18, 0), createPaymentReport.mpago ) 
        .input('mpagoext'     , sql.Numeric(18, 0), createPaymentReport.mpagoext)        
        .input('ptasamon'     , sql.Numeric(18, 0), createPaymentReport.ptasamon )        
        .input('freporte'     , sql.DateTime , createPaymentReport.freporte )
        .input('xruta'        , sql.VarChar(1000, 0), createPaymentReport.xruta )  
        .input('cprog'        , sql.Char(20, 0), createPaymentReport.cprog )
        .input('cusuario'     , sql.Numeric(18, 0), createPaymentReport.cusuario)  
        //.input('ccategoria'   , sql.Numeric(18, 0), createPaymentReport.ccategoria)
        .query('INSERT INTO cbreporte_pago  '
        +'(casegurado, cmoneda, mpago_dec,  mpago, mpagoext, ptasamon, freporte, xruta, cprog, cusuario )'
        +'VALUES (@casegurado, @cmoneda, @mpago_dec, @mpago, @mpagoext, @ptasamon, @freporte, @xruta, @cprog, @cusuario )')
        console.log(search.rowsAffected)
        // if(search.rowsAffected){
        //     let pool = await sql.connect(sqlConfig);
        //     let receipt = await pool.request()
        //     .input('casegurado', sql.Numeric(18, 0), searchDataReceipt)
        //     .input('iestcont', sql.Char(1, 0), 'P')
        //     .query('select cnpoliza,cnrecibo, cpoliza ,fanopol , fmespol , cramo , cmoneda , fhasta_pol , fdesde , fhasta , ' + 
        //            'fdesde_pol , mprimabruta , mprimabrutaext  from adrecibos where casegurado = @casegurado and iestcont = @iestcont ')
        //     await pool.close();
        //     return { 
        //         receipt: receipt.recordset ,
        //         client : search.recordset
        //     };

        // }

        await pool.close();
        return { result: search.recordset };

    }
    catch(err){
        return { error: err.message, message: 'No se pudo encontrar el cliente, por favor revise los datos e intente nuevamente ' };
    }
}


  export default {
    searchDataReceipt,
    createPaymentReportW
  }