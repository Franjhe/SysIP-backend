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
            .input('fhasta'        , sql.DateTime , '2024-01-30 ')
            .query('select cnpoliza,cnrecibo,casegurado , qcuotas, crecibo,cpoliza ,fanopol , fmespol , cramo , cmoneda , fhasta_pol , fdesde , fhasta , fdesde_pol , mprimabruta , mprimabrutaext ' + 
            ' from adrecibos where iestadorec = @iestadorec and casegurado = @casegurado '+
            ' and MONTH(fhasta) = MONTH(@fhasta) AND YEAR(fhasta) = YEAR(@fhasta) AND GETDATE() < fhasta')
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

const createPaymentReportTransW = async(createPaymentReport) => {
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
            .input('ifuente'     , sql.Char(10), createPaymentReport.ifuente)  
            .input('iestado'     , sql.Bit, createPaymentReport.iestado)  
            .input('cusuario'     , sql.Numeric(18, 0), createPaymentReport.cusuario)  
            .query('INSERT INTO cbreporte_tran  '
            +'(freporte, casegurado, mpago,  mpagoext, ptasamon, cprog, ifuente, iestado ,cusuario )'
            +'VALUES (@freporte, @casegurado, @mpago, @mpagoext,  @ptasamon, @cprog, @ifuente, @iestado, @cusuario)')
            //busca el valor dr la transaccion para asignarlo 
            if(inserTransaccion.rowsAffected > 0 ){
                let searchTransaccion = await pool.request()
                .query('SELECT MAX(ctransaccion) AS ctransaccion from cbreporte_tran')
                //codigo de la transaccion
                if (searchTransaccion.recordset[0].ctransaccion){
                        if(inserTransaccion.rowsAffected > 0){
                            for(let i = 0; i < createPaymentReport.receipt.length; i++){
                                //insertamos detalle nde los recibos pagados 
                                let pool = await sql.connect(sqlConfig);
                                let insertReportDet = await pool.request()
                                .input('ctransaccion'   , sql.Numeric(18, 0), searchTransaccion.recordset[0].ctransaccion)   
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

                            return { result: searchTransaccion.recordset[0].ctransaccion };
                        }
                }
            }
    
        await pool.close();


    }
    catch(err){
        return { error: err.message, message: 'No se registrarons los datos ' };
    }
}

const createPaymentReportSoportW = async(createPaymentReport) => {
    try{
        let pool = await sql.connect(sqlConfig);
        for(let i = 0; i < createPaymentReport.report.length; i++){
            let insertReport = await pool.request()
            .input('ctransaccion'   , sql.Numeric(18, 0), createPaymentReport.ctransaccion)   
            .input('npago'   , sql.Numeric(18, 0), i + 1)   
            .input('casegurado'   , sql.Numeric(18, 0), createPaymentReport.casegurado)   
            .input('cmoneda'      , sql.Char(4, 0), createPaymentReport.report[i].cmoneda )  
            .input('cbanco'        , sql.Numeric(18, 2), createPaymentReport.report[i].cbanco ) 
            .input('cbanco_destino'        , sql.Numeric(18, 2), createPaymentReport.report[i].cbanco_destino ) 
            .input('mpago'        , sql.Numeric(18, 2), createPaymentReport.report[i].mpago ) 
            .input('mpagoext'     , sql.Numeric(18, 2), createPaymentReport.report[i].mpagoext) 
            .input('mpagoigtf'     , sql.Numeric(18, 2), createPaymentReport.report[i].mpagoigtf)  
            .input('mpagoigtfext'     , sql.Numeric(18, 2), createPaymentReport.report[i].mpagoigtfext)      
            .input('mtotal'     , sql.Numeric(18, 2), createPaymentReport.report[i].mtotal)  
            .input('mtotalext'     , sql.Numeric(18, 2), createPaymentReport.report[i].mtotalext)     
            .input('ptasamon'     , sql.Numeric(18, 2), createPaymentReport.report[i].ptasamon )        
            .input('ptasaref'     , sql.Numeric(18, 2), createPaymentReport.report[i].ptasaref )        
            .input('xreferencia'  , sql.VarChar(100, 0), createPaymentReport.report[i].xreferencia )  
            .input('xruta'        , sql.VarChar(100, 0), createPaymentReport.report[i].ximagen )  
            .input('cprog'        , sql.Char(20, 0), createPaymentReport.cprog )
            .input('cusuario'     , sql.Numeric(18, 0), createPaymentReport.cusuario)  
            .query('INSERT INTO cbreporte_pago '
            +'(ctransaccion, npago,  casegurado, cmoneda, cbanco, cbanco_destino, mpago, mpagoext, mpagoigtf, mpagoigtfext, mtotal , mtotalext ,ptasamon, ptasaref,  xreferencia, xruta, cprog, cusuario ) VALUES'
            +'(@ctransaccion, @npago, @casegurado, @cmoneda, @cbanco, @cbanco_destino, @mpago, @mpagoext, @mpagoigtf, @mpagoigtfext , @mtotal ,@mtotalext , @ptasamon, @ptasaref,  @xreferencia, @xruta, @cprog, @cusuario )')

            return insertReport
        }
        
 
        await pool.close();
        return { result: insertReport };

    }
    catch(err){
        return { error: err.message, message: 'No se registraron los datos ' };
    }
}

const searchDataPaymentReport = async(searchDataReceipt) => {
    try{
        let pool = await sql.connect(sqlConfig);
        let searchReport = await pool.request()
        .input('iestado'     , sql.Bit, 0)  
        .query('select ctransaccion ,casegurado, freporte ,mpago, mpagoext,'+
        ' ptasamon, cprog, ifuente, cusuario from cbreporte_tran where iestado = @iestado')
        await pool.close();

        return { recibo : searchReport.recordset};


    }
    catch(err){
        return { error: err.message, message: 'No se registrarons los datos ' };
    }
}

const searchDataPaymentTransaction = async(searchDataReceipt) => {
    try{
        let pool = await sql.connect(sqlConfig);
        let searchReport = await pool.request()
        .input('ctransaccion'   , sql.Numeric(18, 0), searchDataReceipt)   
        .query('select ctransaccion, crecibo, casegurado, cnpoliza, cnrecibo, cpoliza, fanopol, fmespol, cramo, cmoneda, fdesde_pol, fhasta_pol, fdesde_rec, mprimabruta , mprimabrutaext, ptasamon, cusuario'+
        ' from cbreporte_pago_d where ctransaccion = @ctransaccion')
        if(searchReport.rowsAffected) { 
            let pool = await sql.connect(sqlConfig);
            let searchSoport  = await pool.request()
            .input('ctransaccion'   , sql.Numeric(18, 0), searchDataReceipt)   
            .query(' select ctransaccion, npago,  casegurado, cmoneda, cbanco, cbanco_destino, mpago, mpagoext, mpagoigtf, mpagoigtfext,ptasamon, ptasaref,  xreferencia, xruta, cprog, cusuario'+
            ' from cbreporte_pago where ctransaccion = @ctransaccion')

            return { recibo : searchReport.recordset , soporte : searchSoport.recordset};
        }
        await pool.close();




    }
    catch(err){
        return { error: err.message, message: 'No se registrarons los datos ' };
    }
}

const searchDataPaymentPending= async(searchDataReceipt) => {
    try{

        let pool = await sql.connect(sqlConfig);
        let searchReport = await pool.request()
        .input('fhasta'        , sql.DateTime , '2024-01-30')
        .input('iestadorec', sql.Char(1, 0), 'P')
        .query('select cnpoliza,cnrecibo,casegurado , qcuotas, crecibo,cpoliza ,fanopol , fmespol , cramo , cmoneda , fhasta_pol , fdesde , fhasta , fdesde_pol , mprimabruta , mprimabrutaext ' + 
               ' from adrecibos where iestadorec = @iestadorec '+
               ' and MONTH(fhasta) = MONTH(@fhasta) AND YEAR(fhasta) = YEAR(@fhasta) AND GETDATE() < fhasta')
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

const searchDataPaymentsCollectedClient = async(searchDataReceipt) => {
    try{
        let pool = await sql.connect(sqlConfig);
        let searchReport = await pool.request()
        .input('crecibo'   , sql.Numeric(18, 0), searchDataReceipt)   
        .query('select cnpoliza,cnrecibo, qcuotas, crecibo,cpoliza ,fanopol , fmespol , cramo , cmoneda , fhasta_pol , fdesde , fhasta , ' + 
               'fdesde_pol , mprimabruta , mprimabrutaext  from adrecibos where crecibo = @crecibo ')

        await pool.close();

        return { recibo : searchReport.recordset};


    }
    catch(err){
        return { error: err.message, message: 'No se registrarons los datos ' };
    }
}

const searchDataClient = async(searchDataReceipt) => {
    try{
        let pool = await sql.connect(sqlConfig);
        let searchReport = await pool.request()
        .input('xcontrato'   , sql.VarChar(18, 0), searchDataReceipt)   
        .query('select xcliente,xtelefono,xemail from clcliente where xcontrato  = @xcontrato ')

        await pool.close();

        return { cliente : searchReport.recordset};


    }
    catch(err){
        return { error: err.message, message: 'No se registrarons los datos ' };
    }
}

const updateReceiptNotifiqued = async(updatePayment) => {
    try{
            //actualiza los recibos cobrados
            let pool = await sql.connect(sqlConfig);
            let updateTransaccion = await pool.request()
            .input('ctransaccion', sql.Numeric(20, 0) , updatePayment.transacccion )  
            .input('iestado'     , sql.Bit, 1)  
            .query('update cbreporte_tran set iestado = @iestado where ctransaccion = @ctransaccion' );
            if(updateTransaccion.rowsAffected > 0){
                    let pool = await sql.connect(sqlConfig);
                    let updateReport= await pool.request()
                    .input('ctransaccion', sql.Numeric(20, 0) , updatePayment.transacccion )  
                    .input('itransaccion', sql.Char(2, 0) , updatePayment.itransaccion ) 
                    .query('update cbreporte_pago set itransaccion = @itransaccion where ctransaccion = @ctransaccion' );
                    if(updateReport.rowsAffected > 0 ){
                        for(let i = 0; i < updatePayment.receipt.length; i++){
                            let pool = await sql.connect(sqlConfig);
                            let updateReceipt= await pool.request()
                            .input('cpoliza'   , sql.Numeric(19, 0), updatePayment.receipt[i].cpoliza )   
                            .input('crecibo'      , sql.Numeric(19, 0), updatePayment.receipt[i].crecibo )  
                            .input('iestadorec'     , sql.Char(1, 0),  updatePayment.iestadorec) 
                            .query('update adrecibos set iestadorec = @iestadorec where  cpoliza = @cpoliza and crecibo = @crecibo' );
                            
                            return { update: updateReceipt.rowsAffected };

        
                        }
                    }           
            }
    
        await pool.close();

    }
    catch(err){
        return { error: err.message, message: 'No se actualizaron los datos ' };
    }
}

export default {
    searchDataReceipt,
    createPaymentReportTransW,
    createPaymentReportSoportW,
    searchDataPaymentReport,
    searchDataPaymentPending,
    searchDataPaymentsCollected,
    searchDataPaymentTransaction,
    updateReceiptNotifiqued,
    searchDataPaymentsCollectedClient,
    searchDataClient
}