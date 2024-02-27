import sql from "mssql";

import EmailService from "./../config/email.service.js";

import ejs from "ejs";
import * as fs from 'node:fs/promises';

const emailService = new EmailService();

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
            .query('select fpago,mpendiente, mpendientext,  xobserva, cnpoliza,cnrecibo,casegurado , qcuotas, crecibo,cpoliza ,fanopol , fmespol ,'+
            ' cramo , cmoneda , fhasta_pol , fdesde , fhasta , fdesde_pol , mprimabruta , mprimabrutaext ' + 
            ' from adrecibos where iestadorec = @iestadorec and casegurado = @casegurado ')

            let diferenceList = []
            if(receipt.rowsAffected){
                let diference = await pool.request()
                .input('casegurado'   , sql.Numeric(19, 0), searchDataReceipt)   
                .input('iestado'   , sql.Bit, 1)   
                .query('select mdiferencia, ctransaccion ,xobservacion , cmoneda from cbreporte_tran_dif where casegurado = @casegurado')
                diferenceList = diference.recordset

            }
            return { 
                receipt: receipt.recordset ,
                client : search.recordset,
                diferenceList
            };

        }

        await pool.close();
        return { result: search.recordset};

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
            .input('iestado_tran'     , sql.Char(18, 0), 'TN')  
            .query('INSERT INTO cbreporte_tran  '
            +'(freporte, casegurado, mpago,  mpagoext, ptasamon, cprog, ifuente, iestado ,cusuario , iestado_tran )'
            +'VALUES (@freporte, @casegurado, @mpago, @mpagoext,  @ptasamon, @cprog, @ifuente, @iestado, @cusuario , @iestado_tran)')
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
                                .input('mprimabruta'      , sql.Numeric(18, 2), createPaymentReport.receipt[i].mprimabruta )  
                                .input('mprimabrutaext'        , sql.Numeric(18, 2), createPaymentReport.receipt[i].mprimabrutaext ) 
                                .input('ptasamon'        , sql.Numeric(18, 2), createPaymentReport.receipt[i].ptasamon ) 
                                .input('cusuario'     , sql.Numeric(18, 0), createPaymentReport.cusuario) 
                                .query('INSERT INTO cbreporte_pago_d  '
                                +'(ctransaccion, crecibo, casegurado, cnpoliza, cnrecibo, cpoliza, fanopol, fmespol, cramo, cmoneda, fdesde_pol, fhasta_pol, fdesde_rec,fhasta_rec, mprimabruta , mprimabrutaext, ptasamon, cusuario)'
                                +'VALUES (@ctransaccion, @crecibo, @casegurado, @cnpoliza, @cnrecibo, @cpoliza, @fanopol, @fmespol, @cramo, @cmoneda, @fdesde_pol, @fhasta_pol, @fdesde_rec, @fhasta_rec ,@mprimabruta , @mprimabrutaext, @ptasamon, @cusuario )')
        
                            }

                            return searchTransaccion.recordset[0].ctransaccion 
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
        let data ;
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
            // .input('cprog'        , sql.Char(20, 0), createPaymentReport.report[i].cprog )
            // .input('cusuario'     , sql.Numeric(18, 0), createPaymentReport.report[i].cusuario)  
            .query('INSERT INTO cbreporte_pago '
            +'(ctransaccion, npago,  casegurado, cmoneda, cbanco, cbanco_destino, mpago, mpagoext, mpagoigtf, mpagoigtfext, mtotal , mtotalext ,ptasamon, ptasaref,  xreferencia, xruta ) VALUES'
            +'(@ctransaccion, @npago, @casegurado, @cmoneda, @cbanco, @cbanco_destino, @mpago, @mpagoext, @mpagoigtf, @mpagoigtfext , @mtotal ,@mtotalext , @ptasamon, @ptasaref,  @xreferencia, @xruta )')
            data = insertReport
        }
        
 
        await pool.close();
        return { result: data };

    }
    catch(err){
        return { error: err.message, message: 'No se registraron los datos ' };
    }
}

const searchDataPaymentReport = async() => {
    try{
        const dataTransaction = []
        let pool = await sql.connect(sqlConfig);
        let searchDataTransaction = await pool.request()
        .input('iestado'     , sql.Bit, 0)  
        .query('select ctransaccion ,casegurado, freporte ,mpago, mpagoext,'+
        ' ptasamon, cprog, ifuente,iestado_tran , qagrupado ,cusuario , ivalida from cbreporte_tran where iestado = @iestado')

        if(searchDataTransaction.rowsAffected){
            let pool = await sql.connect(sqlConfig);
            await pool.request()

            for(let i = 0; i < searchDataTransaction.recordset.length; i++){
                let pool = await sql.connect(sqlConfig);
                let searchDetailTransacion  = await pool.request()

                .input('ctransaccion'   , sql.Numeric(18, 0), searchDataTransaction.recordset[i].ctransaccion)   
                .query('select ctransaccion, crecibo, casegurado, cnpoliza, cnrecibo, cpoliza, fanopol, fmespol, cramo, cmoneda, fdesde_pol, fhasta_pol, fhasta_rec, mprimabruta , mprimabrutaext, ptasamon, cusuario'+
                ' from cbreporte_pago_d where ctransaccion = @ctransaccion')

                let pool1 = await sql.connect(sqlConfig);
                let searchSoport  = await pool1.request()
                .input('ctransaccion'   , sql.Numeric(18, 0), searchDataTransaction.recordset[i].ctransaccion)   
                .query(' select ctransaccion, npago,  casegurado, cmoneda, cbanco, cbanco_destino, mpago, mpagoext, mpagoigtf, mpagoigtfext,ptasamon, ptasaref,  xreferencia, xruta, cprog, cusuario'+
                ' from cbreporte_pago where ctransaccion = @ctransaccion')

                let pool2 = await sql.connect(sqlConfig);
                let searchDiference = await pool2.request()
                .input('ctransaccion'   , sql.Numeric(19, 0), searchDataTransaction.recordset[i].ctransaccion )   
                .input('iestado'   , sql.Bit, 0)   
                .query('select mdiferencia, ctransaccion ,xobservacion from cbreporte_tran_dif where iestado = @iestado and ctransaccion = @ctransaccion')

                dataTransaction.push({
                    transaccion: {
                        id : searchDataTransaction.recordset[i].ctransaccion,
                        casegurado : searchDataTransaction.recordset[i].casegurado,
                        freporte: searchDataTransaction.recordset[i].freporte,
                        iestado_tran: searchDataTransaction.recordset[i].iestado_tran,
                        mpagoext: searchDataTransaction.recordset[i].mpagoext,
                        mpago: searchDataTransaction.recordset[i].mpago,
                        ptasamon: searchDataTransaction.recordset[i].ptasamon,
                    },
                    detalle : searchDetailTransacion.recordset,
                    soporte : searchSoport.recordset,
                    diference : searchDiference.recordset
                })

            }
        }

        return { dataTransaction };

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
        .input('fhasta'        , sql.DateTime , new Date())
        .input('iestadorec', sql.Char(1, 0), 'P')
        .query('select * from VWBUSCARECIBOYCLIENTE where iestadorec = @iestadorec AND @fhasta < fhasta' )
        await pool.close();

        return { recibo : searchReport.recordset};


    }
    catch(err){
        return { error: err.message, message: 'No se registrarons los datos ' };
    }
}

const searchDataPaymentVencida= async() => {
    try{
        let pool = await sql.connect(sqlConfig);
        let searchReport = await pool.request()
        .input('iestadorec', sql.Char(1, 0), 'P')
        .query('select * from VWBUSCARECIBOYCLIENTE where iestadorec = @iestadorec  AND GETDATE() > fhasta')


        await pool.close();

        return { recibo : searchReport.recordset};


    }
    catch(err){
        return { error: err.message, message: 'No se registrarons los datos ' };
    }
}

const searchPaymentCollected= async() => {
    try{
        let pool = await sql.connect(sqlConfig);
        let searchReport = await pool.request()
        .input('iestadorec', sql.Char(1, 0), 'C')
        .query('select * from vwbuscarcobranza where iestadorec = @iestadorec')
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

        // let cedula = any
        // let recibo = []
        // let cliente = string
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
                    .input('itransaccion', sql.Char(2, 0) , updatePayment.iestadorec ) 
                    .query('update cbreporte_pago set itransaccion = @itransaccion where ctransaccion = @ctransaccion' );

                    if(updateReport.rowsAffected > 0 ){
                        for(let i = 0; i < updatePayment.detalle.length; i++){
                            let pool = await sql.connect(sqlConfig);
                            let updateReceipt= await pool.request()
                            .input('cpoliza'   , sql.Numeric(19, 0), updatePayment.detalle[i].cpoliza )   
                            .input('crecibo'      , sql.Numeric(19, 0), updatePayment.detalle[i].crecibo )  
                            .input('iestadorec'     , sql.Char(1, 0),  updatePayment.iestadorec) 
                            .input('fcobro', sql.DateTime, new Date())
                            .query('update adrecibos set iestadorec = @iestadorec,fcobro = @fcobro where crecibo = @crecibo' );

                        }
                    }           
            }


            const template = await fs.readFile('src/templates/welcome.ejs', 'utf-8');
            const datosPlantilla = {
              nombre: 'Juan',
            };
            
            const html = ejs.render(template, datosPlantilla);
            try {
              const enviado = await emailService.enviarCorreo('franjhely.andre13@gmail.com', 'Asunto del correo', html);
              if (enviado) {
                console.log('Correo enviado con éxito');
              } else {
                console.log('Error al enviar el correo');
              }
            } catch (error) {
              console.error('Error al procesar el correo:', error);
            }
            

            await pool.close();
            return { updateTransaccion};

    }
    catch(err){
        return { error: err.message, message: 'No se actualizaron los datos ' };
    }
}


const updateReceiptNotifiquedSys = async(updatePayment) =>{
    try {

        let pool = await sql.connect(sqlConfig);
        let receiptUpdate = await pool.request()
        .input('ctransaccion', sql.Numeric(20, 0) , updatePayment.transacccion )  
        .input('iestado'     , sql.Bit, 1)  
        .query('update cbreporte_tran_dif set iestado = @iestado where ctransaccion = @ctransaccion' );
        await pool.close();


        return receiptUpdate;
    }
    catch(err){
        return { error: err.message, message: 'No se actualizaron los datos ' };
    }

}

const receiptDifferenceSys = async(receipt) =>{
    try {

        let pool = await sql.connect(sqlConfig);
        let receiptUpdate = await pool.request()
        .input('ctransaccion', sql.Numeric(19, 0), receipt.transacccion)
        .input('mdiferencia', sql.Numeric(19, 0), receipt.mdiferencia)
        .input('xobservacion', sql.VarChar(500, 0), receipt.xobservacion)
        .input('casegurado', sql.Numeric(19, 0), receipt.casegurado)
        .input('fingreso', sql.DateTime, new Date())
        .input('iestado', sql.Bit, 0)
        .query('INSERT INTO cbreporte_tran_dif' +
            '(ctransaccion, mdiferencia, xobservacion,  fingreso, iestado, casegurado)' +
            'VALUES (@ctransaccion, @mdiferencia, @xobservacion, @fingreso,  @iestado, @casegurado)');
        await pool.close();


        return receiptUpdate;
    }
    catch(err){
        return { error: err.message, message: 'No se actualizaron los datos ' };
    }

}

const receiptDifference = async(receipt) => {
    try {
        let results = [];

                let pool = await sql.connect(sqlConfig);
                let receiptUpdate = await pool.request()
                    .input('ctransaccion', sql.Numeric(18, 0), receipt.transacccion)
                    .input('iestado_tran', sql.Char(2, 0), 'ER')
                    .query('update cbreporte_tran set iestado_tran = @iestado_tran where ctransaccion = @ctransaccion');
                await pool.close();

                        
                if (receiptUpdate.rowsAffected) {
                    let pool = await sql.connect(sqlConfig);
                    let receiptUpdateSys = await pool.request()
                        .input('fpago', sql.DateTime, new Date())
                        .input('iestadorec', sql.Char(2, 0), 'P')
                        .input('mpendiente', sql.Numeric(19, 2), receipt.mdiferencia)
                        .input('mpendientext', sql.Numeric(19, 2), receipt.mdiferenciaext)
                        .input('xobserva', sql.Char(150, 0), receipt.xobservacion)
                        .input('crecibo', sql.Numeric(19, 0), receipt.recibo)
                        .query('update adrecibos set iestadorec = @iestadorec ,mpendiente = @mpendiente, mpendientext = @mpendientext , xobserva = @xobserva, fpago = @fpago '+
                        ' where crecibo = @crecibo ' );
                    await pool.close();
 
                }


                const template = await fs.readFile('src/templates/diference.ejs', 'utf-8');
                const datosPlantilla = {
                  nombre: 'Juan',
                };
                
                const html = ejs.render(template, datosPlantilla);
                try {
                  const enviado = await emailService.enviarCorreo('franjhely.andre13@gmail.com', 'Asunto del correo', html);
                  if (enviado) {
                    console.log('Correo enviado con éxito');
                  } else {
                    console.log('Error al enviar el correo');
                  }
                } catch (error) {
                  console.error('Error al procesar el correo:', error);
                }

            
        

        return results;
    }
    catch(err){
        return { error: err.message, message: 'No se actualizaron los datos ' };
    }
}

const differenceOfNotification = async(receipt) => {
    try{
        let pool = await sql.connect(sqlConfig);
        let updateReceipt= await pool.request()
        .input('ctransaccion'   , sql.Numeric(19, 0), receipt )   
        .input('iestado'   , sql.Bit, 0 )   
        .query('select  mdiferencia, ctransaccion , xobservacion from cbreporte_tran_dif where iestado = @iestado and ctransaccion = @ctransaccion')
           return { differenceOfNotification : updateReceipt.recordset}
    }
    catch(err){
        return { error: err.message, message: 'No se encontraron diferencias en el recibo notificado ' };
    }
}

const updateReceiptDifference = async(notification) => {
    try{

        for(let i = 0; i < notification.length; i++){
            let pool = await sql.connect(sqlConfig);
            let updateReceipt= await pool.request()
            .input('iestado' , sql.Bit,  1) 
            .input('ctransaccion' , sql.Numeric(19, 0), notification[i].transaccion )  
            .query('update cbreporte_tran_dif set iestado = @iestado where ctransaccion = @ctransaccion' );
            if(updateReceipt.rowsAffected){
                let pool = await sql.connect(sqlConfig);
                let receipt = await pool.request()
                .input('ctransaccion', sql.Numeric(18, 0), notification[i].transaccion)
                .input('iestado_tran', sql.Char(2, 0), 'TR')
                .input('iestado'     , sql.Bit,  1) 
                .query('update cbreporte_tran set iestado = @iestado where ctransaccion = @ctransaccion' );
                //actualizamos el estado del recibo

                if(receipt.rowsAffected){
                    for(let j = 0; j < notification[i].recibo.length; j++){
                        let pool = await sql.connect(sqlConfig);
                        let updateReceipt= await pool.request()
                        .input('crecibo'   , sql.Numeric(18, 0), notification[i].recibo[j].crecibo)   
                        .input('iestadorec'     , sql.Char(1, 0),  'C') 
                        .input('mpendiente'     , sql.Numeric(15, 0),  0) 
                        .query('update adrecibos set iestadorec = @iestadorec ,mpendiente = @mpendiente where crecibo = @crecibo ' );
                        await pool.close();

                    }
                }
            }


        }

       
        const template = await fs.readFile('src/templates/welcome.ejs', 'utf-8');
        const datosPlantilla = {
          nombre: 'Juan',
        };
        
        const html = ejs.render(template, datosPlantilla);
        try {
          const enviado = await emailService.enviarCorreo('franjhely.andre13@gmail.com', 'Asunto del correo', html);
          if (enviado) {
            console.log('Correo enviado con éxito');
          } else {
            console.log('Error al enviar el correo');
          }
        } catch (error) {
          console.error('Error al procesar el correo:', error);
        }
        

        await pool.close();
        return { status : true};
    
          
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
    searchDataClient,
    searchDataPaymentVencida,
    receiptDifference,
    differenceOfNotification,
    updateReceiptDifference,
    searchPaymentCollected,
    receiptDifferenceSys,
    updateReceiptNotifiquedSys
}