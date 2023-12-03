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
            .input('iestadorec', sql.Char(1, 0), 'P')
            .query('select qcuotas,cnpoliza,cnrecibo, crecibo,cpoliza ,fanopol , fmespol , cramo , cmoneda , fhasta_pol , fdesde , fhasta , ' + 
                   'fdesde_pol , mprimabruta , mprimabrutaext  from adrecibos where casegurado = @casegurado and iestadorec = @iestadorec ')
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
        //inserta en cbreporte pago
        let pool = await sql.connect(sqlConfig);
        let insertReport = await pool.request()
        .input('casegurado'   , sql.Numeric(18, 0), createPaymentReport.casegurado)   
        .input('cmoneda'      , sql.Char(4, 0), createPaymentReport.cmoneda )  
        .input('mpago_dec'        , sql.Numeric(18, 2), createPaymentReport.mpago_dec ) 
        .input('mpago'        , sql.Numeric(18, 2), createPaymentReport.mpago ) 
        .input('mpagoext'     , sql.Numeric(18, 2), createPaymentReport.mpagoext)        
        .input('ptasamon'     , sql.Numeric(18, 2), createPaymentReport.ptasamon )        
        .input('freporte'     , sql.DateTime , createPaymentReport.freporte )
        .input('xruta'        , sql.VarChar(1000, 0), createPaymentReport.xruta )  
        .input('cprog'        , sql.Char(20, 0), createPaymentReport.cprog )
        .input('cusuario'     , sql.Numeric(18, 0), createPaymentReport.cusuario)  
        //.input('ccategoria'   , sql.Numeric(18, 0), createPaymentReport.ccategoria)
        .query('INSERT INTO cbreporte_pago  '
        +'(casegurado, cmoneda, mpago_dec,  mpago, mpagoext, ptasamon, freporte, xruta, cprog, cusuario )'
        +'VALUES (@casegurado, @cmoneda, @mpago_dec, @mpago, @mpagoext, @ptasamon, @freporte, @xruta, @cprog, @cusuario )')


        //buscamos el numero de caja que acabamos de crear
        if(insertReport.rowsAffected){
            let pool = await sql.connect(sqlConfig);
            let searchBox = await pool.request()
            .query('SELECT MAX(ncaja) AS ncaja from cbreporte_pago')
  
            //Insertamos los recibos que el cliente selecciono para la respectiva validacion
                if(searchBox.recordset[0].ncaja){
                    for(let i = 0; i < createPaymentReport.receipt.length; i++){
                        let pool = await sql.connect(sqlConfig);
                        let insertReportDet = await pool.request()
                        .input('ncaja'   , sql.Numeric(18, 0), searchBox.recordset[0].ncaja)
                        .input('crecibo'   , sql.Numeric(18, 0), createPaymentReport.receipt[i].crecibo)   
                        .input('casegurado'   , sql.Numeric(18, 0), createPaymentReport.casegurado)   
                        .input('cnpoliza'   , sql.Char(30, 0), createPaymentReport.receipt[i].cnpoliza)   
                        .input('cnrecibo'      , sql.Char(30, 0), createPaymentReport.receipt[i].cnrecibo )  
                        .input('cpoliza'        , sql.Numeric(19, 0), createPaymentReport.receipt[i].cpoliza ) 
                        .input('fanopol'        , sql.Numeric(18, 0), createPaymentReport.receipt[i].fanopol ) 
                        .input('fmespol'     , sql.TinyInt, createPaymentReport.receipt[i].fmespol)        
                        .input('cramo'     , sql.SmallInt, createPaymentReport.receipt[i].cramo )        
                        .input('cmoneda'     , sql.Char(4,0) , createPaymentReport.receipt[i].cmoneda )
                        .input('fdesde_pol'        , sql.DateTime, createPaymentReport.receipt[i].fdesde_pol )  
                        .input('fhasta_pol'        , sql.DateTime , createPaymentReport.receipt[i].fhasta_pol )
                        .input('fdesde_rec'     , sql.DateTime, createPaymentReport.receipt[i].fdesde_rec)  
                        .input('fhasta_rec'   , sql.DateTime, createPaymentReport.receipt[i].fhasta_rec)   
                        .input('mprimabruta'      , sql.Numeric(4, 2), createPaymentReport.receipt[i].mprimabruta )  
                        .input('mprimabrutaext'        , sql.Numeric(18, 2), createPaymentReport.receipt[i].mprimabrutaext ) 
                        .input('ptasamon'        , sql.Numeric(18, 2), createPaymentReport.receipt[i].ptasamon ) 
                        .input('cusuario'     , sql.Numeric(18, 0), createPaymentReport.cusuario) 
                        .query('INSERT INTO cbreporte_pago_d  '
                        +'(ncaja, crecibo, casegurado, cnpoliza, cnrecibo, cpoliza, fanopol, fmespol, cramo, cmoneda, fdesde_pol, fhasta_pol, fdesde_rec, mprimabruta , mprimabrutaext, ptasamon, cusuario)'
                        +'VALUES (@ncaja, @crecibo, @casegurado, @cnpoliza, @cnrecibo, @cpoliza, @fanopol, @fmespol, @cramo, @cmoneda, @fdesde_pol, @fhasta_pol, @fdesde_rec, @mprimabruta , @mprimabrutaext, @ptasamon, @cusuario )')

                        //actualizasmos el estado del recibo
                        if(insertReportDet.rowsAffected){
                            try{
                                for(let i = 0; i < createPaymentReport.receipt.length; i++){
                                    let pool = await sql.connect(sqlConfig);
                                    let updateReceipt= await pool.request()
                                    .input('casegurado'   , sql.Numeric(18, 0), createPaymentReport.casegurado)   
                                    .input('cnpoliza'   , sql.Char(30, 0), createPaymentReport.receipt[i].cnpoliza)   
                                    .input('cnrecibo'      , sql.Char(30, 0), createPaymentReport.receipt[i].cnrecibo )  
                                    .input('iestadorec'     , sql.Char(1, 0),  createPaymentReport.iestadorec) 
                                    .query('update adrecibos set iestadorec = @iestadorec where casegurado = @casegurado and cnpoliza = @cnpoliza and cnrecibo = @cnrecibo' );
                                }
                            }catch(err){
                                return { error: err.message, message: 'No se registrarons los datos ' };
                            }
                        }
                    }
                }
        }

        await pool.close();
        return { result: insertReport };

    }
    catch(err){
        return { error: err.message, message: 'No se registrarons los datos ' };
    }
}

const searchDataPaymentReport = async(searchDataReceipt) => {
    try{

        let pool = await sql.connect(sqlConfig);
        let searchReport = await pool.request()
        .query('select ncaja , casegurado, cmoneda, mpago_dec,  mpago, mpagoext,'+
        ' ptasamon, freporte, xruta, cprog, cusuario from cbreporte_pago')
        await pool.close();

        return { recibo : searchReport.recordset};


    }
    catch(err){
        return { error: err.message, message: 'No se registrarons los datos ' };
    }
}

const searchDataPaymentPending= async(searchDataReceipt) => {
    try{

        let pool = await sql.connect(sqlConfig);
        let searchReport = await pool.request()

        .input('iestadorec', sql.Char(1, 0), 'P')
        .query('select cnpoliza,cnrecibo, qcuotas, crecibo,cpoliza ,fanopol , fmespol , cramo , cmoneda , fhasta_pol , fdesde , fhasta , ' + 
               'fdesde_pol , mprimabruta , mprimabrutaext  from adrecibos where iestadorec = @iestadorec ')

        await pool.close();

        return { recibo : searchReport.recordset};


    }
    catch(err){
        return { error: err.message, message: 'No se registrarons los datos ' };
    }
}

const searchDataPaymentsCollected = async(searchDataReceipt) => {
    try{

        let pool = await sql.connect(sqlConfig);
        let searchReport = await pool.request()

        .input('iestadorec', sql.Char(1, 0), 'C')
        .query('select cnpoliza,cnrecibo, qcuotas, crecibo,cpoliza ,fanopol , fmespol , cramo , cmoneda , fhasta_pol , fdesde , fhasta , ' + 
               'fdesde_pol , mprimabruta , mprimabrutaext  from adrecibos where iestadorec = @iestadorec ')

        await pool.close();

        return { recibo : searchReport.recordset};


    }
    catch(err){
        return { error: err.message, message: 'No se registrarons los datos ' };
    }
}

export default {
    searchDataReceipt,
    createPaymentReportW,
    searchDataPaymentReport,
    searchDataPaymentPending,
    searchDataPaymentsCollected
}