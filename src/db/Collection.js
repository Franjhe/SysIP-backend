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
        let receipt = await pool.request()
        .input('casegurado', sql.Numeric(18, 0), searchDataReceipt)
        .input('iestadorec', sql.Char(1, 0), 'P')
        .query('select cnpoliza,mmontorec,mmontorecext,cnrecibo,casegurado , qcuotas, crecibo,cpoliza ,fanopol , fmespol ,idiferencia,'+
        ' cramo , cproductor, xcliente, fhasta_pol ,cdoccob, fdesde , fhasta , fdesde_pol , mprimabruta , mprimabrutaext , mdiferenciaext, cmoneda, mdiferencia,  ctransaccion , xobservacion ,ptasamon' + 
        ' from rpbcliente_recibo where iestadorec = @iestadorec and casegurado = @casegurado ')
        if(receipt.rowsAffected){
                let pool = await sql.connect(sqlConfig);
                let searchTransaccion = await pool.request()
                .query('SELECT MAX(ctransaccion) AS ctransaccion from cbreporte_tran')
                await pool.close();
                return { 
                    receipt:receipt.recordset,
                    transaccion: searchTransaccion.recordset[0].ctransaccion + 1,  
                };
        }

        await pool.close();

    }
    catch(err){
        return { error: err.message, message: 'No se pudo encontrar el cliente, por favor revise los datos e intente nuevamente ' };
    }
}

const createPaymentReportTransW = async(createPaymentReport) => {
    try{
            let data ;
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
            .input('fingreso'     , sql.DateTime , new Date() )
            .query('INSERT INTO cbreporte_tran'
            +'(freporte, casegurado, mpago,  mpagoext, ptasamon, cprog, ifuente, iestado ,cusuario , iestado_tran ,fingreso )'
            +'VALUES (@freporte, @casegurado, @mpago, @mpagoext,  @ptasamon, @cprog, @ifuente, @iestado, @cusuario , @iestado_tran , @fingreso)')
                //codigo de la transaccion
                if(inserTransaccion.rowsAffected > 0){
                    for(let i = 0; i < createPaymentReport.receipt.length; i++){
                        //insertamos detalle nde los recibos pagados 
                        let pool = await sql.connect(sqlConfig);
                        let insertReportDet = await pool.request()
                        .input('ctransaccion'   , sql.Numeric(18, 0), createPaymentReport.ctransaccion)   
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
                        .input('ccorredor'     , sql.Int , createPaymentReport.receipt[i].cproductor )
                        .query('INSERT INTO cbreporte_pago_d  '
                        +'(ctransaccion, crecibo, casegurado, cnpoliza, cnrecibo, cpoliza, fanopol, fmespol, cramo, cmoneda, fdesde_pol, fhasta_pol, fdesde_rec,fhasta_rec, mprimabruta , mprimabrutaext, ptasamon, cusuario,ccorredor)'
                        +'VALUES (@ctransaccion, @crecibo, @casegurado, @cnpoliza, @cnrecibo, @cpoliza, @fanopol, @fmespol, @cramo, @cmoneda, @fdesde_pol, @fhasta_pol, @fdesde_rec, @fhasta_rec ,@mprimabruta , @mprimabrutaext, @ptasamon, @cusuario,@ccorredor )')

                        data = insertReportDet.rowsAffected
                        await pool.close();
                        
                    }

                    return  data ;

                }
                
        await pool.close();


    }
    catch(err){
        return { error: err.message, message: 'No se registraron los datos ' };
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
            .input('xruta'        , sql.VarChar(100, 0), createPaymentReport.report[i].ximage)  
            // .input('cprog'        , sql.Char(20, 0), createPaymentReport.report[i].cprog )
            // .input('cusuario'     , sql.Numeric(18, 0), createPaymentReport.report[i].cusuario)  
            .query('INSERT INTO cbreporte_pago '
            +'(ctransaccion, npago,  casegurado, cmoneda, cbanco, cbanco_destino, mpago, mpagoext, mpagoigtf, mpagoigtfext, mtotal , mtotalext ,ptasamon, ptasaref,  xreferencia, xruta ) VALUES'
            +'(@ctransaccion, @npago, @casegurado, @cmoneda, @cbanco, @cbanco_destino, @mpago, @mpagoext, @mpagoigtf, @mpagoigtfext , @mtotal ,@mtotalext , @ptasamon, @ptasaref,  @xreferencia, @xruta )')
            data = insertReport
        }
        
 
        await pool.close();
        return  data ;

    }
    catch(err){
        return { error: err.message, message: 'No se registraron los datos ' };
    }
}

const createPaymentReportSoportDiference = async(createPaymentReport) => {
    try{
        let pool = await sql.connect(sqlConfig);
        let data ;

        let searchTransaccion = await pool.request()
        .query('SELECT MAX(npago) AS npago from cbreporte_pago')

        if(searchTransaccion.rowsAffected) {

            for(let i = 0; i < createPaymentReport.report.length; i++){
                let insertReport = await pool.request()
                .input('ctransaccion'   , sql.Numeric(18, 0), createPaymentReport.ctransaccion)   
                .input('npago'   , sql.Numeric(18, 0), searchTransaccion.recordset[0].npago + 1 + i)    
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
                .input('xruta'        , sql.VarChar(100, 0), createPaymentReport.report[i].ximage )  
                // .input('cprog'        , sql.Char(20, 0), createPaymentReport.report[i].cprog )
                // .input('cusuario'     , sql.Numeric(18, 0), createPaymentReport.report[i].cusuario)  
                .query('INSERT INTO cbreporte_pago '
                +'(ctransaccion, npago,  casegurado, cmoneda, cbanco, cbanco_destino, mpago, mpagoext, mpagoigtf, mpagoigtfext, mtotal , mtotalext ,ptasamon, ptasaref,  xreferencia, xruta ) VALUES'
                +'(@ctransaccion, @npago, @casegurado, @cmoneda, @cbanco, @cbanco_destino, @mpago, @mpagoext, @mpagoigtf, @mpagoigtfext , @mtotal ,@mtotalext , @ptasamon, @ptasaref,  @xreferencia, @xruta )')
                data = insertReport
            }
            
        }

        await pool.close();
        return  data ;

    }
    catch(err){
        return { error: err.message, message: 'No se registraron los datos ' };
    }
}

const transaccionReceipt = async(recibo) => {
    try{
        let pool = await sql.connect(sqlConfig);
        let data ;
        for(let i = 0; i < recibo.receipt.length; i++){
            //insertamos detalle nde los recibos pagados 
            let pool = await sql.connect(sqlConfig);
            let insertReportDet = await pool.request()
            .input('ctransaccion'   , sql.Numeric(18, 0), recibo.ctransaccion)   
            .input('crecibo'   , sql.Numeric(18, 0), recibo.receipt[i].crecibo)   
            .query('update adrecibos set cdoccob = @ctransaccion where crecibo = @crecibo')
            data = insertReportDet.rowsAffected
        }
        await pool.close();
        return data ;

    }
    catch(err){
        return { error: err.message, message: 'No se registraron los datos ' };
    }
}

const createCommision = async(createCommision,bcv) => {
    try{
        let pool = await sql.connect(sqlConfig);
        let data ;
        for(let i = 0; i < createCommision.detalle.length; i++){
            let updateReceipt= await pool.request()
            .input('crecibo'      , sql.Numeric(19, 0), createCommision.detalle[i].crecibo )  
            .input('fcobro', sql.DateTime, new Date())
            .query('update adrecibos set fcobro = @fcobro where crecibo = @crecibo' );
           if(updateReceipt.rowsAffected > 0) {
                let searchDataReceipt= await pool.request()
                .input('crecibo'      , sql.Numeric(19, 0), createCommision.detalle[i].crecibo )  
                .input('fcobro', sql.DateTime, new Date())
                .query('select * from adrecibos where crecibo = @crecibo' );
                if(searchDataReceipt.recordset.length > 0){
                    for(let j = 0; j < searchDataReceipt.recordset.length; j++){
                        let insertReport = await pool.request()
                        .input('cproductor'   , sql.Numeric(18, 0), searchDataReceipt.recordset[j].cproductor )   
                        .input('ccodigo'   , sql.Numeric(18, 0), createCommision.detalle[i].crecibo )   
                        .input('cnrecibo'   , sql.Numeric(18, 0), searchDataReceipt.recordset[j].cnrecibo )   
                        .input('imovcom'   , sql.Char(2), 'PR')   
                        .input('canexo'      , sql.SmallInt, j + 1 )  
                        .input('cmoneda'        , sql.Char(4), searchDataReceipt.recordset[j].cmoneda ) 
                        .input('ptasamon'     , sql.Numeric(18, 2), bcv) 
                        .input('fmovcom'     , sql.DateTime, new Date())  
                        .input('mmovcom'     , sql.Numeric(18, 2), searchDataReceipt.recordset[j].mcomision)      
                        .input('mmovcomext'     , sql.Numeric(18, 2), searchDataReceipt.recordset[j].mcomisionext)  
                        .input('istatcon'     , sql.Char(1), 'P')     
                        .input('istatcom'     , sql.Char(1), 'P')     
                        // .input('cusuario'     , sql.Numeric(18, 2), createCommision.cusuario )        
                        .query('INSERT INTO admovcom '
                        +'(cproductor, ccodigo, cnrecibo, imovcom, canexo, cmoneda, ptasamon, fmovcom, mmovcom, mmovcomext , istatcon ,istatcom) VALUES'
                        +'(@cproductor, @ccodigo, @cnrecibo, @imovcom, @canexo, @cmoneda, @ptasamon, @fmovcom, @mmovcom, @mmovcomext , @istatcon ,@istatcom)')
                        data = insertReport.rowsAffected                    }
                }
            }

        }

        await pool.close();
        return  data 

    }
    catch(err){
        return { error: err.message, message: 'No se registraron los datos ' };
    }
}

const searchDataPaymentReport = async() => {
    try{
        let pool = await sql.connect(sqlConfig);
        let searchDataTransaction = await pool.request()
        .input('iestado'     , sql.Bit, 0)  
        .query('select * from vwbuscartransaccion where iestado = @iestado')
        return  searchDataTransaction.recordsets[0] ;
    }
    catch(err){
        return { error: err.message, message: 'No se registraron los datos ' };
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
        return { error: err.message, message: 'No se registraron los datos ' };
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
        return { error: err.message, message: 'No se registraron los datos ' };
    }
}

const searchPaymentCollected= async(estado) => {
    console.log(estado)
    try{
        let pool = await sql.connect(sqlConfig);
        let searchReport = await pool.request()
        .input('estado', sql.Char(1, 0), estado)
        .execute('rpbrecibos');
        await pool.close();

        return { recibo : searchReport.recordset};


    }
    catch(err){
        return { error: err.message, message: 'No se registraron los datos ' };
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
        return { error: err.message, message: 'No se registraron los datos ' };
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
        return { error: err.message, message: 'No se registraron los datos ' };
    }
}

const searchDataClient = async(searchDataReceipt) => {
    try{
        let pool = await sql.connect(sqlConfig);
        let searchReport = await pool.request()
        .input('Cedula'   , sql.Numeric(11), searchDataReceipt)   
        .query('select * from maVRecibos where Cedula = @Cedula ')

        await pool.close();

        return { cliente : searchReport.recordset};


    }
    catch(err){
        return { error: err.message, message: 'No se registraron los datos ' };
    }
}

const updateReceiptNotifiqued = async(updatePayment) => {
    try{
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
                    let data ;
                    for(let i = 0; i < updatePayment.detalle.length; i++){
                        let pool = await sql.connect(sqlConfig);
                        let updateReceipt= await pool.request()
                        .input('cpoliza'   , sql.Numeric(19, 0), updatePayment.detalle[i].cpoliza )   
                        .input('crecibo'      , sql.Numeric(19, 0), updatePayment.detalle[i].crecibo )  
                        .input('iestadorec'     , sql.Char(1, 0),  updatePayment.iestadorec) 
                        .input('fcobro', sql.DateTime, new Date())
                        .query('update adrecibos set iestadorec = @iestadorec,fcobro = @fcobro where crecibo = @crecibo' );
                        data = updateReceipt.rowsAffected
                    }

                    return data;
                }           
        }

    }
    catch(err){
        return { error: err.message, message: 'No se actualizaron los datos ' };
    }
}

const sendMailReceipt = async(cuota,info) =>{
    console.log(cuota,info , 'recibo')

    const template = await fs.readFile('src/templates/receipt.ejs', 'utf-8');
    const datosPlantilla = {
        nombre: 'Juan',
    };
    
    const html = ejs.render(template, datosPlantilla);
    try {
        const enviado = await emailService.enviarCorreo(info, 'Asunto del correo', html);
        if (enviado) {
        console.log('Correo enviado con éxito');
        } else {
        console.log('Error al enviar el correo');
        }
    } catch (error) {
        console.error('Error al procesar el correo:', error);
    }
    

}

const sendMailPoliza = async(cuota,info) =>{
    console.log(cuota,info , 'poliza')
    const template = await fs.readFile('src/templates/welcome.ejs', 'utf-8');
    const datosPlantilla = {
        nombre: 'Juan',
        url : process.env.URLPoliza,
        poliza : info.cnpoliza

    };
    
    const html = ejs.render(template, datosPlantilla);
    try {
        const enviado = await emailService.enviarCorreo(info, 'Asunto del correo', html);
        if (enviado) {
        console.log('Correo enviado con éxito');
        } else {
        console.log('Error al enviar el correo');
        }
    } catch (error) {
        console.error('Error al procesar el correo:', error);
    }
    

}

const sendMailPolizandReceipt = async(cuota,info) =>{

    console.log(cuota,info, 'ambos')

    const template = await fs.readFile('src/templates/welcomeAndReceipt.ejs', 'utf-8');
    const datosPlantilla = {
        nombre: 'Juan',
        url : process.env.URLPoliza,
        poliza : info.cnpoliza

    };
    
    const html = ejs.render(template, datosPlantilla);
    try {
        const enviado = await emailService.enviarCorreo(info, 'Asunto del correo', html);
        if (enviado) {
        console.log('Correo enviado con éxito');
        } else {
        console.log('Error al enviar el correo');
        }
    } catch (error) {
        console.error('Error al procesar el correo:', error);
    }
    
}

const updateReceiptNotifiquedSys = async(updatePayment) =>{
    try {

        let pool = await sql.connect(sqlConfig);
        let receiptUpdate = await pool.request()
        .input('ctransaccion', sql.Numeric(20, 0) , updatePayment.ctransaccion )  
        .input('iestado'     , sql.Bit, 1)  
        .query('update cbreporte_tran_dif set iestado = @iestado where ctransaccion = @ctransaccion' );
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
                    .input('ctransaccion', sql.Numeric(18, 0), receipt.ctransaccion)
                    .input('iestado_tran', sql.Char(2, 0), 'ER')
                    .query('update cbreporte_tran set iestado_tran = @iestado_tran where ctransaccion = @ctransaccion');
                        
                if (receiptUpdate.rowsAffected) {
                    let pool = await sql.connect(sqlConfig);
                    let receiptUpdate = await pool.request()
                    .input('ctransaccion', sql.Numeric(18, 0), receipt.ctransaccion)
                    .input('mdiferencia', sql.Numeric(19, 0), receipt.mdiferencia)
                    .input('mdiferenciaext', sql.Numeric(19, 0), receipt.mdiferenciaext)
                    .input('xobservacion', sql.VarChar(500, 0), receipt.xobservacion)
                    .input('casegurado', sql.Numeric(19, 0), receipt.casegurado)
                    .input('fingreso', sql.DateTime, new Date())
                    .input('iestado', sql.Bit, 0)
                    .input('crecibo'   , sql.Numeric(18, 0), parseFloat(receipt.recibo))   
                    .input('freporte', sql.DateTime, new Date())
                    .input('idiferencia', sql.Char(1), receipt.idiferencia)
                    .input('cmoneda', sql.NVarChar(5), receipt.cmoneda)
                    .input('ptasamon', sql.Numeric(19, 0), receipt.tasa)
                    .query('INSERT INTO cbreporte_tran_dif' +
                        '(ctransaccion,mdiferencia,mdiferenciaext, xobservacion,  fingreso, iestado, casegurado,crecibo,freporte,idiferencia,cmoneda,ptasamon)' +
                        'VALUES (@ctransaccion,@mdiferencia,@mdiferenciaext, @xobservacion, @fingreso,  @iestado, @casegurado,@crecibo,@freporte,@idiferencia,@cmoneda,@ptasamon)');
                }


                const template = await fs.readFile('src/templates/diference.ejs', 'utf-8');
                const datosPlantilla = {
                  nombre: 'Juan',
                };
                
                const html = ejs.render(template, datosPlantilla);
                try {
                  const enviado = await emailService.enviarCorreo(receipt.correo, 'Asunto del correo', html);
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
            .input('ctransaccion' , sql.Numeric(19, 0), notification[i].ctransaccion )  
            .query('update cbreporte_tran_dif set iestado = @iestado where ctransaccion = @ctransaccion' );
            if(updateReceipt.rowsAffected){
                let pool = await sql.connect(sqlConfig);
                let receipt = await pool.request()
                .input('ctransaccion', sql.Numeric(18, 0), notification[i].ctransaccion)
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

       
        const template = await fs.readFile('src/templates/receipt.ejs', 'utf-8');
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
    updateReceiptNotifiqued,
    searchDataPaymentsCollectedClient,
    searchDataClient,
    searchDataPaymentVencida,
    receiptDifference,
    differenceOfNotification,
    updateReceiptDifference,
    searchPaymentCollected,
    updateReceiptNotifiquedSys,
    createCommision,
    transaccionReceipt,
    sendMailReceipt,
    sendMailPoliza,
    sendMailPolizandReceipt,
    createPaymentReportSoportDiference
    
}