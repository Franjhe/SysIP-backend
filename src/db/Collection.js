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
            //inserta en cbreporte_tran
            let pool = await sql.connect(sqlConfig);
            let inserTransaccion = await pool.request()
            .input('freporte'     , sql.DateTime , createPaymentReport.freporte )
            .input('casegurado'   , sql.Numeric(18, 0), createPaymentReport.casegurado)   
            .input('mpago'        , sql.Numeric(18, 2), createPaymentReport.mpago ) 
            .input('mpagoext'     , sql.Numeric(18, 2), createPaymentReport.mpagoext)        
            .input('ptasamon'     , sql.Numeric(18, 2), createPaymentReport.ptasamon )         
            .input('cprog'        , sql.Char(20, 0), createPaymentReport.cprog )
            .input('ifuente'     , sql.Numeric(18, 0), createPaymentReport.ifuente)  
            .input('cusuario'     , sql.Numeric(18, 0), createPaymentReport.cusuario)  
            .query('INSERT INTO cbreporte_tran  '
            +'(freporte, casegurado, mpago,  mpagoext, ptasamon, cprog, ifuente, cusuario )'
            +'VALUES (@freporte, @casegurado, @mpago, @mpagoext, @ptasamon, @cprog, @ifuente, @cusuario)')
            //busca el valor dr la transaccion para asignarlo 
            if(inserTransaccion.rowsAffected > 0 ){
                let searchTransaccion = await pool.request()
                .query('SELECT MAX(ctransaccion) AS ctransaccion from cbreporte_pago')
                //codigo de la transaccion
                if (searchTransaccion.recordset[0].ctransaccion){
                    for(let i = 0; i < createPaymentReport.transfer.length; i++){
                        let insertReport = await pool.request()
                        .input('ctransaccion'   , sql.Numeric(18, 0), createPaymentReport.transfer.ctransaccion)   
                        .input('npago'   , sql.Numeric(18, 0), i + 1)   
                        .input('casegurado'   , sql.Numeric(18, 0), createPaymentReport.transfer.casegurado)   
                        .input('cmoneda'      , sql.Char(4, 0), createPaymentReport.transfer.cmoneda )  
                        .input('cbanco'        , sql.Numeric(18, 2), createPaymentReport.transfer.cbanco ) 
                        .input('cbanco_destino'        , sql.Numeric(18, 2), createPaymentReport.cbanco_destino ) 
                        .input('mpago'        , sql.Numeric(18, 2), createPaymentReport.transfer.mpago ) 
                        .input('mpagoext'     , sql.Numeric(18, 2), createPaymentReport.transfer.mpagoext)        
                        .input('ptasamon'     , sql.Numeric(18, 2), createPaymentReport.transfer.ptasamon )        
                        .input('ptasaref'     , sql.Numeric(18, 2), createPaymentReport.transfer.ptasaref )        
                        .input('freporte'     , sql.DateTime , createPaymentReport.transfer.freporte )
                        .input('xreferencia'  , sql.VarChar(100, 0), createPaymentReport.transfer.xreferencia )  
                        .input('xruta'        , sql.VarChar(100, 0), createPaymentReport.transfer.xruta )  
                        .input('cprog'        , sql.Char(20, 0), createPaymentReport.cprog )
                        .input('cusuario'     , sql.Numeric(18, 0), createPaymentReport.cusuario)  
                        .query('INSERT INTO cbreporte_pago  '
                        +'(ctransaccion, npago,  casegurado, cmoneda, cbanco, cbanco_destino, mpago, mpagoext, ptasamon, ptasaref, freporte, xreferencia, xruta, cprog, cusuario ) VALUES'
                        +'(@ctransaccion, @npago, @casegurado, @cmoneda, @cbanco, @cbanco_destino, @mpago, @mpagoext, @ptasamon, @ptasaref, @freporte, @xreferencia, @xruta, @cprog, @cusuario )')

                        if(insertReport.rowsAffected > 0){
                            for(let i = 0; i < createPaymentReport.receipt.length; i++){
                                //insertamos detalle nde los recibos pagados 
                                let pool = await sql.connect(sqlConfig);
                                let insertReportDet = await pool.request()
                                .input('ctransaccion'   , sql.Numeric(18, 0), createPaymentReport.transfer.ctransaccion)   
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
                                +'(ctransaccion, crecibo, casegurado, cnpoliza, cnrecibo, cpoliza, fanopol, fmespol, cramo, cmoneda, fdesde_pol, fhasta_pol, fdesde_rec, mprimabruta , mprimabrutaext, ptasamon, cusuario)'
                                +'VALUES (@ctransaccion, @crecibo, @casegurado, @cnpoliza, @cnrecibo, @cpoliza, @fanopol, @fmespol, @cramo, @cmoneda, @fdesde_pol, @fhasta_pol, @fdesde_rec, @mprimabruta , @mprimabrutaext, @ptasamon, @cusuario )')
        
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
                                        return { error: err.message, message: 'No se registraron los datos ' };
                                    }
                                }
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