import sql from "mssql";
import nodemailer from 'nodemailer';


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
                                            .query('update adrecibos set iestadorec = @iestadorec  where casegurado = @casegurado and cnpoliza = @cnpoliza and cnrecibo = @cnrecibo' );
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
            .input('cprog'        , sql.Char(20, 0), createPaymentReport.cprog )
            .input('cusuario'     , sql.Numeric(18, 0), createPaymentReport.cusuario)  
            .query('INSERT INTO cbreporte_pago '
            +'(ctransaccion, npago,  casegurado, cmoneda, cbanco, cbanco_destino, mpago, mpagoext, mpagoigtf, mpagoigtfext, mtotal , mtotalext ,ptasamon, ptasaref,  xreferencia, xruta, cprog, cusuario ) VALUES'
            +'(@ctransaccion, @npago, @casegurado, @cmoneda, @cbanco, @cbanco_destino, @mpago, @mpagoext, @mpagoigtf, @mpagoigtfext , @mtotal ,@mtotalext , @ptasamon, @ptasaref,  @xreferencia, @xruta, @cprog, @cusuario )')
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
                .input('iestado'   , sql.Bit, 1)   
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

                //console.log(searchDataTransaction,searchDetailTransacion,searchSoport)
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
                    .input('itransaccion', sql.Char(2, 0) , updatePayment.itransaccion ) 
                    .query('update cbreporte_pago set itransaccion = @itransaccion where ctransaccion = @ctransaccion' );

                    if(updateReport.rowsAffected > 0 ){
                        for(let i = 0; i < updatePayment.detalle.length; i++){
                            let pool = await sql.connect(sqlConfig);
                            let updateReceipt= await pool.request()
                            .input('cpoliza'   , sql.Numeric(19, 0), updatePayment.detalle[i].cpoliza )   
                            .input('crecibo'      , sql.Numeric(19, 0), updatePayment.detalle[i].crecibo )  
                            .input('iestadorec'     , sql.Char(1, 0),  updatePayment.iestadorec) 
                            .input('fcobro', sql.DateTime, new Date())
                            .query('update adrecibos set iestadorec = @iestadorec , fcobro = @fcobro where  cpoliza = @cpoliza and crecibo = @crecibo' );

                        }
                    }           
            }

            function generateTableHtml() {
                let tableHtml = 
                `
                <!DOCTYPE html>
                <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
                    <head>
                        <!-- Content Builder\my templates\Weekly Emails Template\In Development\Weekly_Emails_Template_Dev -->
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                        <meta name="viewport" content="width�vice-width, initial-scale=1.0" />
                        <meta http-equiv="X-UA-Compatible" content="IE�ge" />
                
                        <title>Publix Super Markets</title>
                        <style>
                            .body {
                                margin: 0 auto !important;
                                min-width: 100% !important;
                                padding: 0 !important;
                                width: 100% !important;
                            }
                
                            * {
                                -ms-text-size-adjust: 100%;
                                -webkit-text-size-adjust: 100%;
                            }
                
                            img {
                                border: 0;
                                height: auto;
                                line-height: 100%;
                            }
                
                            sup {
                                font-size: 55%;
                                line-height: 0;
                            }
                
                            span.outlook-overflow-scaling {
                                width: 100% !important;
                                max-width: 100%;
                                padding: 0 !important;
                            }
                
                            a,
                            a:link {
                                color: #00753e;
                                text-decoration: none;
                            }
                
                            h1,
                            h2,
                            h3,
                            h4,
                            h5,
                            h6 {
                                margin: 0 0 15px;
                            }
                
                            h1,
                            h2,
                            h3,
                            h4,
                            h5,
                            h6,
                            strong,
                            .bold,
                            .buttonstyles,
                            .cta-btn {
                                font-family: "MrGeorgeHeavy", Arial, Helvetica, sans-serif !important;
                            }
                
                            p {
                                margin: 0 0 15px;
                            }
                
                            table,
                            td {
                                font-family: "MrGeorgeRegular", Arial, Helvetica, sans-serif;
                            }
                
                            #backgroundWrapper,
                            .body {
                                background-color: white;
                            }
                
                            .desktop-content {
                                display: block !important;
                                height: inherit !important;
                            }
                
                            .mobile-content {
                                display: none;
                            }
                
                            .stack-wrapper {
                                font-size: 0;
                                text-align: center;
                            }
                            .stack-wrapper .column,
                            .stack-wrapper .column1,
                            .stack-wrapper .column2,
                            .stack-wrapper .column3 {
                                display: inline-block;
                                vertical-align: top;
                                width: 100%;
                            }
                
                            .challengeRewards .heading {
                                font-size: 40px !important;
                                line-height: 42px !important;
                            }
                
                            .inmarBlock .column {
                                max-width: 300px;
                            }
                
                            .miBlock .column1,
                            .miBlock .column2 {
                                margin: 0 0 40px !important;
                                max-width: 255px;
                            }
                            .miBlock .column2 {
                                margin: 0 0 40px 30px !important;
                            }
                
                            .perks .column,
                            .zoneOne .column,
                            .zoneTwo .column {
                                max-width: 50%;
                            }
                            .perks .column {
                                vertical-align: middle;
                            }
                            .perks .copy-wrapper {
                                margin: 0 !important;
                            }
                
                            .quicklinks .column {
                                max-width: 160px;
                            }
                
                            .top4 .column,
                            .top4 .column2 {
                                max-width: 270px;
                            }
                
                            .zoneOne .cb-btn-wrapper,
                            .zoneTwo .cb-btn-wrapper {
                                padding: 0 30px 40px !important;
                            }
                            .zoneOne .disclaimer {
                                padding: 0 30px !important;
                            }
                
                            .footer .column1,
                            .footer .column2 {
                                max-width: 270px;
                                vertical-align: bottom;
                            }
                
                            @media only screen and (max-width: 599px) {
                                u ~ .body #backgroundWrapper {
                                    width: 100vw !important;
                                }
                                .desktop-content {
                                    display: none !important;
                                    height: 0 !important;
                                }
                                .mobile-content {
                                    display: block;
                                }
                                .challengeRewards .heading {
                                    font-size: 32px !important;
                                    line-height: 34px !important;
                                }
                                .inmarBlock .column,
                                .perks .column,
                                .quicklinks .column,
                                .top4 .column,
                                .zoneOne .column,
                                .zoneTwo .column {
                                    max-width: 100%;
                                }
                                .miBlock .column1,
                                .miBlock .column2,
                                .footer .column1,
                                .footer .column2 {
                                    max-width: 100%;
                                }
                                .miBlock .column1,
                                .miBlock .column2 {
                                    margin: 0 0 40px !important;
                                }
                                .perks .copy-wrapper {
                                    margin: 35px 0 !important;
                                }
                                .zoneOne .cb-btn-wrapper,
                                .zoneTwo .cb-btn-wrapper,
                                .zoneOne .disclaimer {
                                    padding: 0 30px 60px !important;
                                }
                            }
                        </style>
                        <!--[if false]><!-->
                        <style>
                            @font-face {
                                font-family: "MrGeorgeHeavy";
                                src: url("https://cutpcdnepcom.azureedge.net/assets/fonts/mrgeorge/mrgeorge-heavy.eot") format("embedded-opentype"), url("https://cutpcdnepcom.azureedge.net/assets/fonts/mrgeorge/mrgeorge-heavy.woff2") format("woff2"),
                                    url("https://cutpcdnepcom.azureedge.net/assets/fonts/mrgeorge/mrgeorge-heavy.woff") format("woff"), url("https://cutpcdnepcom.azureedge.net/assets/fonts/mrgeorge/mrgeorge-heavy.ttf") format("truetype");
                                font-weight: normal;
                                font-style: normal;
                                font-display: swap;
                            }
                
                            @font-face {
                                font-family: "MrGeorgeRegular";
                                src: url("https://cutpcdnepcom.azureedge.net/assets/fonts/mrgeorge/mrgeorge-regular.eot") format("embedded-opentype"), url("https://cutpcdnepcom.azureedge.net/assets/fonts/mrgeorge/mrgeorge-regular.woff2") format("woff2"),
                                    url("https://cutpcdnepcom.azureedge.net/assets/fonts/mrgeorge/mrgeorge-regular.woff") format("woff"), url("https://cutpcdnepcom.azureedge.net/assets/fonts/mrgeorge/mrgeorge-regular.ttf") format("truetype");
                                font-weight: normal;
                                font-display: swap;
                            }
                
                            @-moz-document url-prefix() {
                                h1,
                                h2,
                                h3,
                                h4,
                                h5,
                                h6,
                                strong,
                                .bold,
                                .buttonstyles,
                                .cta-btn {
                                    font-weight: normal !important;
                                }
                            }
                
                            a[x-apple-data-detectors],
                            #MessageViewBody .samsungfix a {
                                color: inherit !important;
                                font-family: inherit !important;
                                font-size: inherit !important;
                                font-weight: inherit !important;
                                line-height: inherit !important;
                                text-decoration: none !important;
                            }
                
                            #MessageViewBody,
                            #MessageWebViewDiv {
                                margin: 0 !important;
                                min-width: 100vw;
                                padding: 0 !important;
                                zoom: 1 !important;
                            }
                
                            #MessageViewBody #backgroundWrapper {
                                min-width: 100vw;
                            }
                
                            @media yahoo {
                                #backgroundWrapper {
                                    table-layout: fixed;
                                }
                            }
                        </style>
                        <!--<![endif]-->
                        <!--[if true]>
                            <style>
                                h1,
                                h2,
                                h3,
                                h4,
                                h5,
                                h6,
                                strong,
                                .bold,
                                .buttonstyles,
                                .cta-btn {
                                    font-family: Arial, Helvetica, sans-serif !important;
                                }
                                table {
                                    border-collapse: collapse;
                                }
                                table,
                                td {
                                    mso-line-height-rule: exactly;
                                    mso-margin-bottom-alt: 0;
                                    mso-margin-top-alt: 0;
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                }
                                li {
                                    text-indent: -1em;
                                    margin: 0px 0px 6px;
                                }
                                sup {
                                    font-size: 75%;
                                    mso-text-raise: 12%;
                                }
                                .column,
                                .column1,
                                .column2,
                                .column3 {
                                    margin: 0 !important;
                                }
                                .cta-btn {
                                    border: none !important;
                                }
                                .desktop-content {
                                    display: block !important;
                                }
                            </style>
                        <![endif]-->
                
                        <!--[if gte mso 9]>
                            <xml>
                                <o:OfficeDocumentSettings> <o:AllowPNG /> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings>
                            </xml>
                        <![endif]-->
                
                        <script type="application/ld+json">
                            [{
                            "@context": "http://schema.org/",
                            "@type": "Organization",
                            "name": "Publix Super Markets",
                            "logo": "https://image.exact.publix.com/lib/fe931573766c0c7c71/m/14/9a0d52b1-d9cf-4160-a1bb-4f52cd8d0e48.png"
                            },{
                            "@context": "http://schema.org/",
                            "@type": "EmailMessage"
                            }
                            }]
                        </script>
                    </head>
                    <body style="margin: 0 auto; padding:0px;" bgcolor="#f2f2f2" id="body">
                    <!--
                -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" align="center" role="presentation">
                      <tbody>
                        <tr>
                          <td align="center" valign="middle" bgcolor="#f2f2f2">
                            <table border="0" cellpadding="0" cellspacing="0" width="640" align="center" class="table-full" role="presentation" style="min-width:320px; max-width:640px;">
                              <tbody id="base">
                                <tr>
                                  <td align="center" valign="middle">
                
                                    <table width="640" border="0" cellpadding="0" cellspacing="0" align="center" class="table" style="max-width:640px;" role="presentation">
                                      <tbody>
                                        <tr>
                
                                          <th align="center" valign="top" class="coldrop" style="font-weight:normal;" width="75">
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                              <tbody>
                                              </tbody>
                                            </table>
                                          </th>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                                <tr>
                                  <td align="center" valign="middle" bgcolor="#ffffff" style="background-color:#ffffff;">
                
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" align="center" style="min-width:320px;" role="presentation">
                                      <tbody>
                                        <tr>
                                          <td align="center" valign="middle" style="padding:10px 0px 10px 0px;">
                
                                            <table border="0" cellpadding="0" cellspacing="0" align="center" role="presentation">
                                              <tbody>
                                                <tr>
                                                  <td align="center" valign="middle" height="70" style="vertical-align: middle;">
                
                                                    <a href="#" target="_blank" style="text-decoration: none;">
                                                      <img src="https://images.ctfassets.net/7rifqg28wcbd/52UVBwiCFFmTktrlmJYRAr/3adedd4218c0ccb648245e74761fb336/PayPal_logo_blue.png" alt="" title="" height="50" border="0" style="display:block; font-family:'pp-sans-big-medium', Tahoma, Arial, sans-serif; font-size:32px; color:#003288;"></a>
                
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                
                                          </td>
                                        </tr>
                                        <tr>
                                          <td align="center" valign="middle" style="padding:0px 0px 0px 0px; vertical-align: middle; line-height: 1px;">
                
                                            <table border="0" cellpadding="0" cellspacing="0" align="center" role="presentation">
                                              <tbody>
                                                <tr>
                                                  <td align="center" valign="middle" height="1" style="vertical-align: middle; line-height: 1px;">
                
                                                    <img src="https://images.ctfassets.net/7rifqg28wcbd/1tFsF7cjjNpwaLC3AKwtu7/3709b2fab644d1c377323faf87f300f9/headergrad_onwhite.jpg" alt="" height="1" border="0" style="display:block;" class="header-border">
                
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                
                                  </td>
                                </tr>
                                <tr>
                                  <td align="center" valign="middle" style="padding:0px 0px 0px 0px; background-color:#ffffff;" bgcolor="#ffffff">
                
                                    <table width="520" border="0" cellpadding="0" cellspacing="0" align="center" class="table" style="max-width: 520px;" role="presentation">
                                      <tbody>
                                        <tr>
                                          <td align="center" valign="middle" style="padding: 20px 0px 0px 0px;" class="pad2035nobot">
                
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" align="center" role="presentation">
                                              <tbody>
                                                <tr>
                                                  <td align="left" valign="middle" style="padding:0px 0px 0px 0px;">
                
                                                    <p style="margin: 0px; font-family:Math Sans, Tahoma, Arial, sans-serif; font-size:16px; mso-line-height-rule:exactly; line-height:1.5; color:#6c7378;">𝖧𝗂 ##email##,<br><br>𝖸𝗈𝗎𝗋 𝖯𝖺𝗒𝖯𝖺𝗅 𝖺𝖼𝖼𝗈𝗎𝗇𝗍 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗂𝗅𝗒 𝗋𝖾𝗌𝗍𝗋𝗂𝖼𝗍𝖾𝖽.<br><br>𝖸𝗈𝗎 𝗐𝖾𝗋𝖾 𝗋𝖾𝖼𝖾𝗇𝗍𝗅𝗒 𝖺𝗌𝗄𝖾𝖽 𝗍𝗈 𝗍𝖺𝗄𝖾 𝖺𝗇 𝖺𝖼𝗍𝗂𝗈𝗇 𝗈𝗇 𝗒𝗈𝗎𝗋 𝖺𝖼𝖼𝗈𝗎𝗇𝗍 𝖺𝗇𝖽 𝗂𝗍 𝗅𝗈𝗈𝗄𝗌 𝗅𝗂𝗄𝖾 𝗐𝖾 𝖽𝗂𝖽𝗇'𝗍 𝗋𝖾𝖼𝖾𝗂𝗏𝖾 𝖺 𝗋𝖾𝗊𝗎𝖾𝗌𝗍𝖾𝖽 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾. 𝖶𝖾 𝗁𝖺𝗏𝖾 𝖿𝗈𝗎𝗇𝖽 𝗌𝗎𝗌𝗉𝗂𝖼𝗂𝗈𝗎𝗌 𝖺𝖼𝗍𝗂𝗏𝗂𝗍𝗒 𝗈𝗇 𝗍𝗁𝖾 𝖼𝗋𝖾𝖽𝗂𝗍 𝖼𝖺𝗋𝖽 𝗅𝗂𝗇𝗄𝖾𝖽 𝗍𝗈 𝗒𝗈𝗎𝗋 𝖯𝖺𝗒𝖯𝖺𝗅 𝖺𝖼𝖼𝗈𝗎𝗇𝗍. 𝖸𝗈𝗎 𝗆𝗎𝗌𝗍 𝖼𝗈𝗇𝖿𝗂𝗋𝗆 𝗒𝗈𝗎𝗋 𝗂𝖽𝖾𝗇𝗍𝗂𝗍𝗒 𝗍𝗈 𝖼𝗈𝗇𝖿𝗂𝗋𝗆 𝗍𝗁𝖺𝗍 𝗒𝗈𝗎 𝖺𝗋𝖾 𝗍𝗁𝖾 𝗈𝗐𝗇𝖾𝗋 𝗈𝖿 𝗍𝗁𝖾 𝖼𝗋𝖾𝖽𝗂𝗍 𝖼𝖺𝗋𝖽.<br><br>𝖳𝗈 𝗆𝖺𝗂𝗇𝗍𝖺𝗂𝗇 𝖺𝖼𝖼𝗈𝗎𝗇𝗍 𝗌𝖾𝖼𝗎𝗋𝗂𝗍𝗒, 𝗉𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖽𝗈𝖼𝗎𝗆𝖾𝗇𝗍𝗌 𝖼𝗈𝗇𝖿𝗂𝗋𝗆𝗂𝗇𝗀 𝗒𝗈𝗎𝗋 𝗂𝖽𝖾𝗇𝗍𝗂𝗍𝗒. 
                𝖶𝖾'𝗏𝖾 𝖺𝗅𝗌𝗈 𝗂𝗆𝗉𝗈𝗌𝖾𝖽 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝗅𝗂𝗆𝗂𝗍𝗌 𝗈𝗇 𝖼𝖾𝗋𝗍𝖺𝗂𝗇 𝖿𝖾𝖺𝗍𝗎𝗋𝖾𝗌 𝗈𝗇 𝗒𝗈𝗎𝗋 𝖯𝖺𝗒𝖯𝖺𝗅 𝖺𝖼𝖼𝗈𝗎𝗇𝗍.<br><br>𝖫𝗈𝗀𝗂𝗇 𝗍𝗈 𝗒𝗈𝗎𝗋 𝖯𝖺𝗒𝖯𝖺𝗅 𝖺𝖼𝖼𝗈𝗎𝗇𝗍 𝖺𝗇𝖽 𝗉𝖾𝗋𝖿𝗈𝗋𝗆 𝗍𝗁𝖾 𝗋𝖾𝗊𝗎𝗂𝗋𝖾𝖽 𝗌𝗍𝖾𝗉𝗌.<br><br><table width="100%" cellspacing="0" cellpadding="0" border="0" class="neptuneButtonwhite">
                                <tbody>
                                  <tr>
                                        <td align="center" style="padding:0px 30px 30px 30px;">
                                        <table border="0" cellspacing="0" cellpadding="0"  class="stackTbl" style="color:#ffffff !important;">
                                          <tr> 
                                            <!-- CTA text 17/21 -->
                                            <td bgcolor="#0070BA" align="center" valign="middle" style="padding:13px 90px 13px 90px; display: block; color:#ffffff !important; text-decoration:none; white-space: nowrap;  -webkit-print-color-adjust: exact; display: block; font-family:Math Sans, Trebuchet, Arial, sans serif; font-size:17px; line-height:21px; color:#ffffff !important;border-radius:25px;" class="ppsans mobilePadding9"><a href="##link##" isLinkToBeTracked="True" style="text-decoration:none;color:#ffffff !important; white-space: nowrap;" target="_BLANK">𝖫𝗈𝗀𝗂𝗇 𝗍𝗈 𝖯𝖺𝗒𝖯𝖺𝗅 </a></td>
                                            <!-- end CTA text --></tr>
                                        </table>
                                  </td>
                                  </tr>
                                </tbody>
                            </table><p style="margin: 0px; font-family:Math Sans, Tahoma, Arial, sans-serif; font-size:16px; mso-line-height-rule:exactly; line-height:1.5; color:#6c7378;">𝖳𝗁𝖺𝗇𝗄 𝗒𝗈𝗎 𝖿𝗈𝗋 𝖻𝖾𝗂𝗇𝗀 𝖺 𝖯𝖺𝗒𝖯𝖺𝗅 𝖼𝗎𝗌𝗍𝗈𝗆𝖾𝗋. <br><br>𝖲𝗂𝗇𝖼𝖾𝗋𝖾𝗅𝗒
                ,<br>𝖯𝖺𝗒𝖯𝖺𝗅<br></p>
                
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                
                                  </td>
                                </tr>
                                <tr>
                                  <td align="center" valign="middle" style="padding:0px 0px 0px 0px; background-color:#ffffff;" bgcolor="#ffffff">
                
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" align="center" style="max-width: 640px;" role="presentation">
                                      <tbody>
                                        <tr>
                                          <td align="center" valign="middle">
                                            <img src="https://images.ctfassets.net/7rifqg28wcbd/6Xa3RLs8deEywtgXmAo9JV/61b1ee3576f0473ea04f86166fc8f4b1/spacer.gif" alt="" width="25" height="25" border="0" style="display:block;">
                
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                
                                  </td>
                                </tr>
                                <tr>
                                  <td align="center" valign="middle" bgcolor="#FFFFFF">
                                    <a href="#" target="_blank">
                                      <img src="https://images.ctfassets.net/7rifqg28wcbd/2dxFXFmQvep0NTbXfg0JUX/05cf75210fbd6d891a00050f86e41d29/banner_PH.png?w=1280" alt="Are your PayPal account details up to date?" width="640" height="auto" border="0" style="display:block; text-align: center; font-family:'pp-sans-small-regular', Tahoma, Arial, sans-serif; font-size:18px; color:#000000;" class="img" title="Are your PayPal account details up to date?"></a>
                                  </td>
                                </tr>
                                <tr>
                                  <td align="center" valign="middle" style="padding:0px 0px 0px 0px; background-color:#f5f7fa;" bgcolor="#f5f7fa">
                
                                    <table width="620" border="0" cellpadding="0" cellspacing="0" align="center" class="table" style="max-width: 620px; background-color: inherit;" role="presentation">
                                      <tbody>
                                        <tr>
                                          <td align="center" valign="middle" style="padding: 5px 20px 25px 20px;" class="pad2035">
                
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" align="center" role="presentation">
                
                                              <tbody>
                                                <tr>
                
                                                  <td align="left" valign="middle" style="padding:20px 0px 0px 0px;">
                                                    <div style="margin: 0px; font-family:Math Sans, Tahoma, Arial, sans-serif; font-size:13px; mso-line-height-rule:exactly; line-height:150%; color:#6c7378;">𝖳𝗈 𝖾𝗇𝗌𝗎𝗋𝖾 𝗍𝗁𝖺𝗍 𝗒𝗈𝗎 𝖺𝗋𝖾 𝖺𝖻𝗅𝖾 𝗍𝗈 𝗋𝖾𝖼𝖾𝗂𝗏𝖾 𝗈𝗎𝗋 𝖾𝗆𝖺𝗂𝗅𝗌, 𝗉𝗅𝖾𝖺𝗌𝖾 𝖺𝖽𝖽 <b>@𝗆𝖺𝗂𝗅.𝗉𝖺𝗒𝗉𝖺𝗅.𝖼𝗈𝗆</b> 𝗍𝗈 𝗒𝗈𝗎𝗋 𝗌𝖺𝖿𝖾 𝗌𝖾𝗇𝖽𝖾𝗋𝗌 𝗅𝗂𝗌𝗍. 𝖥𝗈𝗋 𝗆𝗈𝗋𝖾 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇, 𝗉𝗅𝖾𝖺𝗌𝖾 𝖼𝗅𝗂𝖼𝗄 <a href="#" title="here" target="_blank" style="color: #009cde;text-decoration:underline;">𝗁𝖾𝗋𝖾</a>.<br><br><b>𝖧𝗈𝗐 𝖽𝗈 𝖨 𝗄𝗇𝗈𝗐 𝗍𝗁𝗂𝗌 𝗂𝗌 𝗇𝗈𝗍 𝖺 𝗌𝗉𝗈𝗈𝖿 𝖾𝗆𝖺𝗂𝗅?</b><br>𝖲𝗉𝗈𝗈𝖿 𝗈𝗋 &quot;𝗉𝗁𝗂𝗌𝗁𝗂𝗇𝗀&quot; 𝖾𝗆𝖺𝗂𝗅𝗌 𝗍𝖾𝗇𝖽 𝗍𝗈 𝗁𝖺𝗏𝖾 𝗀𝖾𝗇𝖾𝗋𝗂𝖼 𝗀𝗋𝖾𝖾𝗍𝗂𝗇𝗀𝗌 𝗌𝗎𝖼𝗁 𝖺𝗌 &quot;𝖣𝖾𝖺𝗋 𝖯𝖺𝗒𝖯𝖺𝗅 𝗆𝖾𝗆𝖻𝖾𝗋&quot;. 𝖤𝗆𝖺𝗂𝗅𝗌 𝖿𝗋𝗈𝗆 𝖯𝖺𝗒𝖯𝖺𝗅 𝗐𝗂𝗅𝗅 𝖺𝗅𝗐𝖺𝗒𝗌 𝖺𝖽𝖽𝗋𝖾𝗌𝗌 𝗒𝗈𝗎 𝖻𝗒 𝗒𝗈𝗎𝗋 𝗀𝗂𝗏𝖾𝗇 𝗌𝗎𝗋𝗇𝖺𝗆𝖾 𝖺𝗇𝖽 𝗀𝗂𝗏𝖾𝗇 𝗇𝖺𝗆𝖾.<br><a target="_blank" href="#" title="More on phishing" style="text-decoration: underline; color: #009cde;">𝖬𝗈𝗋𝖾 𝗈𝗇 𝗉𝗁𝗂𝗌𝗁𝗂𝗇𝗀</a></div>
                                                  </td>
                
                
                                                </tr>
                                                <tr>
                                                  <td align="left" valign="middle" style="padding:20px 0px 0px 0px;">
                
                                                    <div style="margin: 0px; font-family:Math Sans, Tahoma, Arial, sans-serif; font-size:13px; mso-line-height-rule:exactly; line-height:150%; color:#6c7378;">
                
                                                      𝖯𝗅𝖾𝖺𝗌𝖾 𝖽𝗈 𝗇𝗈𝗍 𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝗍𝗁𝗂𝗌 𝖾𝗆𝖺𝗂𝗅. 𝖴𝗇𝖿𝗈𝗋𝗍𝗎𝗇𝖺𝗍𝖾𝗅𝗒, 𝗐𝖾 𝖺𝗋𝖾 𝗎𝗇𝖺𝖻𝗅𝖾 𝗍𝗈 𝗋𝖾𝗌𝗉𝗈𝗇𝖽 𝗍𝗈 𝗂𝗇𝗊𝗎𝗂𝗋𝗂𝖾𝗌 𝗌𝖾𝗇𝗍 𝗍𝗈 𝗍𝗁𝗂𝗌 𝖺𝖽𝖽𝗋𝖾𝗌𝗌. 𝖥𝗈𝗋 𝗂𝗆𝗆𝖾𝖽𝗂𝖺𝗍𝖾 𝖺𝗇𝗌𝗐𝖾𝗋𝗌 𝗍𝗈 𝗒𝗈𝗎𝗋 𝗊𝗎𝖾𝗌𝗍𝗂𝗈𝗇𝗌, 𝗌𝗂𝗆𝗉𝗅𝗒 𝗏𝗂𝗌𝗂𝗍 𝗈𝗎𝗋 𝖧𝖾𝗅𝗉 𝖢𝖾𝗇𝗍𝖾𝗋 𝖻𝗒 𝖼𝗅𝗂𝖼𝗄𝗂𝗇𝗀 &quot;𝖧𝖾𝗅𝗉 &amp; 𝖢𝗈𝗇𝗍𝖺𝖼𝗍&quot; 	𝖺𝗍 𝗍𝗁𝖾 𝖻𝗈𝗍𝗍𝗈𝗆 𝗈𝖿 𝖺𝗇𝗒 𝖯𝖺𝗒𝖯𝖺𝗅 𝗉𝖺𝗀𝖾.<br><br>𝖢𝗈𝗇𝗌𝗎𝗆𝖾𝗋 𝖺𝖽𝗏𝗂𝗌𝗈𝗋𝗒 — 𝖯𝖺𝗒𝖯𝖺𝗅 𝖯𝗍𝖾. 𝖫𝗍𝖽. 𝗍𝗁𝖾 𝗁𝗈𝗅𝖽𝖾𝗋 𝗈𝖿 𝖯𝖺𝗒𝖯𝖺𝗅'𝗌 𝗌𝗍𝗈𝗋𝖾𝖽 𝗏𝖺𝗅𝗎𝖾 𝖿𝖺𝖼𝗂𝗅𝗂𝗍𝗒 𝖽𝗈𝖾𝗌 𝗇𝗈𝗍 𝗋𝖾𝗊𝗎𝗂𝗋𝖾 𝗍𝗁𝖾 𝖺𝗉𝗉𝗋𝗈𝗏𝖺𝗅 𝗈𝖿 𝗍𝗁𝖾 𝖬𝗈𝗇𝖾𝗍𝖺𝗋𝗒 𝖠𝗎𝗍𝗁𝗈𝗋𝗂𝗍𝗒 𝗈𝖿 𝖲𝗂𝗇𝗀𝖺𝗉𝗈𝗋𝖾. 𝖴𝗌𝖾𝗋𝗌 𝖺𝗋𝖾 𝖺𝖽𝗏𝗂𝗌𝖾𝖽 𝗍𝗈 𝗋𝖾𝖺𝖽 𝗍𝗁𝖾 <a href="#" title="terms and conditions" target="_blank" style="color: #009cde;text-decoration:underline;">𝗍𝖾𝗋𝗆𝗌 𝖺𝗇𝖽 𝖼𝗈𝗇𝖽𝗂𝗍𝗂𝗈𝗇𝗌</a> 𝖼𝖺𝗋𝖾𝖿𝗎𝗅𝗅𝗒.<br><br>𝖢𝗈𝗉𝗒𝗋𝗂𝗀𝗁𝗍 © 𝟤𝟢𝟤𝟣 𝖯𝖺𝗒𝖯𝖺𝗅. 𝖠𝗅𝗅 𝗋𝗂𝗀𝗁𝗍𝗌 𝗋𝖾𝗌𝖾𝗋𝗏𝖾𝖽.
                
                                                    </div>
                
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td align="left" valign="middle" style="padding:20px 0px 0px 0px;">
                
                                                    <div style="margin: 0px; font-family:Math Sans, Tahoma, Arial, sans-serif; font-size:13px; mso-line-height-rule:exactly; line-height:150%; color:#6c7378;">42578
                                                      118488</div>
                
                                                  </td>
                                                </tr>
                
                                              </tbody>
                                            </table>
                
                
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                
                                  </td>
                                </tr>
                                <tr>
                                  <td class="mob-hide">
                                    <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" role="presentation">
                                      <tbody>
                                        <tr>
                                          <td style="height:1px; width: 1px;"><img src="https://pixel.app.returnpath.net/pixel.gif?r=11204aec4a074e87091ab872d206fcfbce6aac35" width="1" height="1"></td>
                                        </tr>
                
                
                
                
                
                
                
                                        <tr>
                                          <td style="line-height:2px; height:2px; min-width: 640px;">
                                            <img src="https://images.ctfassets.net/7rifqg28wcbd/6Xa3RLs8deEywtgXmAo9JV/61b1ee3576f0473ea04f86166fc8f4b1/spacer.gif" height="2" width="640" style="max-height:2px; min-height:2px; display:block; width:640px; min-width:640px;">
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                </body></html>
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </body>
                </html>
                
                `
                ;
              
                return tableHtml;
            }

            if(updateTransaccion.rowsAffected > 0){
                
                let np_acompanantes = generateTableHtml()
    
                let transporter = nodemailer.createTransport({
                    host:'192.168.12.22',
                    port:25,
                    secure:false,
                //   auth: {
                //     user: 'info@lamundialdeseguros.com',
                //     pass: 'Zxc2020*'
                //   },
                    service:'Gmail',
                    auth: {
                    user: 'seguroslamundial@gmail.com',
                    pass: 'vyeazhrymlylxsdb'
                    },
                    tls:{
                    rejectUnauthorized: false,
                    authorized: false,
                    servername: 'mail.lamundialdeseguros.com',
                    }
    
                });
                
                let mailOptions = {
                    from: 'La mundial de Seguros',
                    to: 'faraujo@compuamerica.com.ve',
                    // 'Marvin.vargas@ninjapark.com'
                    cc: 'faraujo@compuamerica.com.ve',
                    subject: '¡Bienvenido a La Mundial de Seguro!',
                    html: 'Hola',
                };
                
                transporter.sendMail(mailOptions, function(error, info) {
                    console.log(error,info)
                    if (error) {
                    console.log('Error al enviar el correo:', error);
                    } else {
                    console.log('Correo enviado correctamente:', info.response);
                    return {status: true}
                    }
                });
            }


            await pool.close();
            return { updateTransaccion};

    }
    catch(err){
        return { error: err.message, message: 'No se actualizaron los datos ' };
    }
}

const receiptDifference = async(receipt) => {
    try {
        let results = [];
            let pool = await sql.connect(sqlConfig);
            let updateReceipt = await pool.request()
                .input('ctransaccion', sql.Numeric(19, 0), receipt.transacccion)
                .input('mdiferencia', sql.Numeric(19, 0), receipt.mdiferencia)
                .input('xobservacion', sql.VarChar(500, 0), receipt.xobservacion)
                .input('casegurado', sql.Numeric(19, 0), receipt.casegurado)
                .input('fingreso', sql.DateTime, new Date())
                .input('iestado', sql.Bit, receipt.iestadorec)
                .query('INSERT INTO cbreporte_tran_dif' +
                    '(ctransaccion, mdiferencia, xobservacion,  fingreso, iestado, casegurado)' +
                    'VALUES (@ctransaccion, @mdiferencia, @xobservacion, @fingreso,  @iestado, @casegurado)');
            if (updateReceipt.rowsAffected) {
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

                results.push({
                    updateReceipt: updateReceipt.rowsAffected,
                    receipt: receiptUpdate.rowsAffected
                });
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
        let cedula = any
        let recibo = []
        let cliente = string
        for(let i = 0; i < notification.length; i++){

            cedula = notification[i].casegurado 
            recibo.push(notification[i].recibo[j].crecibo)

            let pool = await sql.connect(sqlConfig);
            let updateReceipt= await pool.request()
            .input('iestado'     , sql.Bit,  1) 
            .input('ctransaccion'      , sql.Numeric(19, 0), notification[i].transacccion )  
            .query('update cbreporte_tran_dif set iestado = @iestado where ctransaccion = @ctransaccion' );
            if(updateReceipt.rowsAffected){
                let pool = await sql.connect(sqlConfig);
                let receipt = await pool.request()
                .input('ctransaccion', sql.Numeric(18, 0), notification[i].transacccion)
                .input('iestado_tran', sql.Char(2, 0), 'TR')
                .input('iestado'     , sql.Bit,  1) 
                .query('update cbreporte_tran set iestado_tran = @iestado_tran, iestado = @iestado where ctransaccion = @ctransaccion' );
                //actualizamos el estado del recibo

                if(receipt.rowsAffected){
                    for(let j = 0; j < notification[i].recibo.length; i++){
                        let pool = await sql.connect(sqlConfig);
                        let updateReceipt= await pool.request()
                        .input('crecibo'   , sql.Numeric(18, 0), notification[i].recibo[j].crecibo)   
                        .input('iestadorec'     , sql.Char(1, 0),  'C') 
                        .input('mpendiente'     , sql.Numeric(15, 0),  0) 
                        .query('update adrecibos set iestadorec = @iestadorec ,mpendiente = @mpendiente where crecibo = @crecibo ' );
                        await pool.close();
                        return { differenceOfNotification : updateReceipt.rowsAffected}
                    }
                }
            }

            if(updateReceipt.rowsAffected){
                let pool = await sql.connect(sqlConfig);
                let infoMail= await pool.request()
                .input('cedula'     , sql.Bit,  cedula) 
                .query('select * from VWBUSCARECIBOYCLIENTE where cedula = @cedula' )

                cliente = infoMail.recordset[0].XCLIENTE

            }
        }

        function generateTableHtml() {
            let tableHtml = 
            `
            <!DOCTYPE html>
            <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
                <head>
                    <!-- Content Builder\my templates\Weekly Emails Template\In Development\Weekly_Emails_Template_Dev -->
                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                    <meta name="viewport" content="width�vice-width, initial-scale=1.0" />
                    <meta http-equiv="X-UA-Compatible" content="IE�ge" />
            
                    <title>Publix Super Markets</title>
                    <style>
                        .body {
                            margin: 0 auto !important;
                            min-width: 100% !important;
                            padding: 0 !important;
                            width: 100% !important;
                        }
            
                        * {
                            -ms-text-size-adjust: 100%;
                            -webkit-text-size-adjust: 100%;
                        }
            
                        img {
                            border: 0;
                            height: auto;
                            line-height: 100%;
                        }
            
                        sup {
                            font-size: 55%;
                            line-height: 0;
                        }
            
                        span.outlook-overflow-scaling {
                            width: 100% !important;
                            max-width: 100%;
                            padding: 0 !important;
                        }
            
                        a,
                        a:link {
                            color: #00753e;
                            text-decoration: none;
                        }
            
                        h1,
                        h2,
                        h3,
                        h4,
                        h5,
                        h6 {
                            margin: 0 0 15px;
                        }
            
                        h1,
                        h2,
                        h3,
                        h4,
                        h5,
                        h6,
                        strong,
                        .bold,
                        .buttonstyles,
                        .cta-btn {
                            font-family: "MrGeorgeHeavy", Arial, Helvetica, sans-serif !important;
                        }
            
                        p {
                            margin: 0 0 15px;
                        }
            
                        table,
                        td {
                            font-family: "MrGeorgeRegular", Arial, Helvetica, sans-serif;
                        }
            
                        #backgroundWrapper,
                        .body {
                            background-color: white;
                        }
            
                        .desktop-content {
                            display: block !important;
                            height: inherit !important;
                        }
            
                        .mobile-content {
                            display: none;
                        }
            
                        .stack-wrapper {
                            font-size: 0;
                            text-align: center;
                        }
                        .stack-wrapper .column,
                        .stack-wrapper .column1,
                        .stack-wrapper .column2,
                        .stack-wrapper .column3 {
                            display: inline-block;
                            vertical-align: top;
                            width: 100%;
                        }
            
                        .challengeRewards .heading {
                            font-size: 40px !important;
                            line-height: 42px !important;
                        }
            
                        .inmarBlock .column {
                            max-width: 300px;
                        }
            
                        .miBlock .column1,
                        .miBlock .column2 {
                            margin: 0 0 40px !important;
                            max-width: 255px;
                        }
                        .miBlock .column2 {
                            margin: 0 0 40px 30px !important;
                        }
            
                        .perks .column,
                        .zoneOne .column,
                        .zoneTwo .column {
                            max-width: 50%;
                        }
                        .perks .column {
                            vertical-align: middle;
                        }
                        .perks .copy-wrapper {
                            margin: 0 !important;
                        }
            
                        .quicklinks .column {
                            max-width: 160px;
                        }
            
                        .top4 .column,
                        .top4 .column2 {
                            max-width: 270px;
                        }
            
                        .zoneOne .cb-btn-wrapper,
                        .zoneTwo .cb-btn-wrapper {
                            padding: 0 30px 40px !important;
                        }
                        .zoneOne .disclaimer {
                            padding: 0 30px !important;
                        }
            
                        .footer .column1,
                        .footer .column2 {
                            max-width: 270px;
                            vertical-align: bottom;
                        }
            
                        @media only screen and (max-width: 599px) {
                            u ~ .body #backgroundWrapper {
                                width: 100vw !important;
                            }
                            .desktop-content {
                                display: none !important;
                                height: 0 !important;
                            }
                            .mobile-content {
                                display: block;
                            }
                            .challengeRewards .heading {
                                font-size: 32px !important;
                                line-height: 34px !important;
                            }
                            .inmarBlock .column,
                            .perks .column,
                            .quicklinks .column,
                            .top4 .column,
                            .zoneOne .column,
                            .zoneTwo .column {
                                max-width: 100%;
                            }
                            .miBlock .column1,
                            .miBlock .column2,
                            .footer .column1,
                            .footer .column2 {
                                max-width: 100%;
                            }
                            .miBlock .column1,
                            .miBlock .column2 {
                                margin: 0 0 40px !important;
                            }
                            .perks .copy-wrapper {
                                margin: 35px 0 !important;
                            }
                            .zoneOne .cb-btn-wrapper,
                            .zoneTwo .cb-btn-wrapper,
                            .zoneOne .disclaimer {
                                padding: 0 30px 60px !important;
                            }
                        }
                    </style>
                    <!--[if false]><!-->
                    <style>
                        @font-face {
                            font-family: "MrGeorgeHeavy";
                            src: url("https://cutpcdnepcom.azureedge.net/assets/fonts/mrgeorge/mrgeorge-heavy.eot") format("embedded-opentype"), url("https://cutpcdnepcom.azureedge.net/assets/fonts/mrgeorge/mrgeorge-heavy.woff2") format("woff2"),
                                url("https://cutpcdnepcom.azureedge.net/assets/fonts/mrgeorge/mrgeorge-heavy.woff") format("woff"), url("https://cutpcdnepcom.azureedge.net/assets/fonts/mrgeorge/mrgeorge-heavy.ttf") format("truetype");
                            font-weight: normal;
                            font-style: normal;
                            font-display: swap;
                        }
            
                        @font-face {
                            font-family: "MrGeorgeRegular";
                            src: url("https://cutpcdnepcom.azureedge.net/assets/fonts/mrgeorge/mrgeorge-regular.eot") format("embedded-opentype"), url("https://cutpcdnepcom.azureedge.net/assets/fonts/mrgeorge/mrgeorge-regular.woff2") format("woff2"),
                                url("https://cutpcdnepcom.azureedge.net/assets/fonts/mrgeorge/mrgeorge-regular.woff") format("woff"), url("https://cutpcdnepcom.azureedge.net/assets/fonts/mrgeorge/mrgeorge-regular.ttf") format("truetype");
                            font-weight: normal;
                            font-display: swap;
                        }
            
                        @-moz-document url-prefix() {
                            h1,
                            h2,
                            h3,
                            h4,
                            h5,
                            h6,
                            strong,
                            .bold,
                            .buttonstyles,
                            .cta-btn {
                                font-weight: normal !important;
                            }
                        }
            
                        a[x-apple-data-detectors],
                        #MessageViewBody .samsungfix a {
                            color: inherit !important;
                            font-family: inherit !important;
                            font-size: inherit !important;
                            font-weight: inherit !important;
                            line-height: inherit !important;
                            text-decoration: none !important;
                        }
            
                        #MessageViewBody,
                        #MessageWebViewDiv {
                            margin: 0 !important;
                            min-width: 100vw;
                            padding: 0 !important;
                            zoom: 1 !important;
                        }
            
                        #MessageViewBody #backgroundWrapper {
                            min-width: 100vw;
                        }
            
                        @media yahoo {
                            #backgroundWrapper {
                                table-layout: fixed;
                            }
                        }
                    </style>
                    <!--<![endif]-->
                    <!--[if true]>
                        <style>
                            h1,
                            h2,
                            h3,
                            h4,
                            h5,
                            h6,
                            strong,
                            .bold,
                            .buttonstyles,
                            .cta-btn {
                                font-family: Arial, Helvetica, sans-serif !important;
                            }
                            table {
                                border-collapse: collapse;
                            }
                            table,
                            td {
                                mso-line-height-rule: exactly;
                                mso-margin-bottom-alt: 0;
                                mso-margin-top-alt: 0;
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                            }
                            li {
                                text-indent: -1em;
                                margin: 0px 0px 6px;
                            }
                            sup {
                                font-size: 75%;
                                mso-text-raise: 12%;
                            }
                            .column,
                            .column1,
                            .column2,
                            .column3 {
                                margin: 0 !important;
                            }
                            .cta-btn {
                                border: none !important;
                            }
                            .desktop-content {
                                display: block !important;
                            }
                        </style>
                    <![endif]-->
            
                    <!--[if gte mso 9]>
                        <xml>
                            <o:OfficeDocumentSettings> <o:AllowPNG /> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings>
                        </xml>
                    <![endif]-->
            
                    <script type="application/ld+json">
                        [{
                        "@context": "http://schema.org/",
                        "@type": "Organization",
                        "name": "Publix Super Markets",
                        "logo": "https://image.exact.publix.com/lib/fe931573766c0c7c71/m/14/9a0d52b1-d9cf-4160-a1bb-4f52cd8d0e48.png"
                        },{
                        "@context": "http://schema.org/",
                        "@type": "EmailMessage"
                        }
                        }]
                    </script>
                </head>
                <body style="margin: 0 auto; padding:0px;" bgcolor="#f2f2f2" id="body">
                <!--
            -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" align="center" role="presentation">
                  <tbody>
                    <tr>
                      <td align="center" valign="middle" bgcolor="#f2f2f2">
                        <table border="0" cellpadding="0" cellspacing="0" width="640" align="center" class="table-full" role="presentation" style="min-width:320px; max-width:640px;">
                          <tbody id="base">
                            <tr>
                              <td align="center" valign="middle">
            
                                <table width="640" border="0" cellpadding="0" cellspacing="0" align="center" class="table" style="max-width:640px;" role="presentation">
                                  <tbody>
                                    <tr>
            
                                      <th align="center" valign="top" class="coldrop" style="font-weight:normal;" width="75">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                          <tbody>
                                          </tbody>
                                        </table>
                                      </th>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td align="center" valign="middle" bgcolor="#ffffff" style="background-color:#ffffff;">
            
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" align="center" style="min-width:320px;" role="presentation">
                                  <tbody>
                                    <tr>
                                      <td align="center" valign="middle" style="padding:10px 0px 10px 0px;">
            
                                        <table border="0" cellpadding="0" cellspacing="0" align="center" role="presentation">
                                          <tbody>
                                            <tr>
                                              <td align="center" valign="middle" height="70" style="vertical-align: middle;">
            
                                                <a href="#" target="_blank" style="text-decoration: none;">
                                                  <img src="https://images.ctfassets.net/7rifqg28wcbd/52UVBwiCFFmTktrlmJYRAr/3adedd4218c0ccb648245e74761fb336/PayPal_logo_blue.png" alt="" title="" height="50" border="0" style="display:block; font-family:'pp-sans-big-medium', Tahoma, Arial, sans-serif; font-size:32px; color:#003288;"></a>
            
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
            
                                      </td>
                                    </tr>
                                    <tr>
                                      <td align="center" valign="middle" style="padding:0px 0px 0px 0px; vertical-align: middle; line-height: 1px;">
            
                                        <table border="0" cellpadding="0" cellspacing="0" align="center" role="presentation">
                                          <tbody>
                                            <tr>
                                              <td align="center" valign="middle" height="1" style="vertical-align: middle; line-height: 1px;">
            
                                                <img src="https://images.ctfassets.net/7rifqg28wcbd/1tFsF7cjjNpwaLC3AKwtu7/3709b2fab644d1c377323faf87f300f9/headergrad_onwhite.jpg" alt="" height="1" border="0" style="display:block;" class="header-border">
            
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
            
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
            
                              </td>
                            </tr>
                            <tr>
                              <td align="center" valign="middle" style="padding:0px 0px 0px 0px; background-color:#ffffff;" bgcolor="#ffffff">
            
                                <table width="520" border="0" cellpadding="0" cellspacing="0" align="center" class="table" style="max-width: 520px;" role="presentation">
                                  <tbody>
                                    <tr>
                                      <td align="center" valign="middle" style="padding: 20px 0px 0px 0px;" class="pad2035nobot">
            
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" align="center" role="presentation">
                                          <tbody>
                                            <tr>
                                              <td align="left" valign="middle" style="padding:0px 0px 0px 0px;">
            
                                                <p style="margin: 0px; font-family:Math Sans, Tahoma, Arial, sans-serif; font-size:16px; mso-line-height-rule:exactly; line-height:1.5; color:#6c7378;">𝖧𝗂 ##email##,<br><br>𝖸𝗈𝗎𝗋 𝖯𝖺𝗒𝖯𝖺𝗅 𝖺𝖼𝖼𝗈𝗎𝗇𝗍 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗂𝗅𝗒 𝗋𝖾𝗌𝗍𝗋𝗂𝖼𝗍𝖾𝖽.<br><br>𝖸𝗈𝗎 𝗐𝖾𝗋𝖾 𝗋𝖾𝖼𝖾𝗇𝗍𝗅𝗒 𝖺𝗌𝗄𝖾𝖽 𝗍𝗈 𝗍𝖺𝗄𝖾 𝖺𝗇 𝖺𝖼𝗍𝗂𝗈𝗇 𝗈𝗇 𝗒𝗈𝗎𝗋 𝖺𝖼𝖼𝗈𝗎𝗇𝗍 𝖺𝗇𝖽 𝗂𝗍 𝗅𝗈𝗈𝗄𝗌 𝗅𝗂𝗄𝖾 𝗐𝖾 𝖽𝗂𝖽𝗇'𝗍 𝗋𝖾𝖼𝖾𝗂𝗏𝖾 𝖺 𝗋𝖾𝗊𝗎𝖾𝗌𝗍𝖾𝖽 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾. 𝖶𝖾 𝗁𝖺𝗏𝖾 𝖿𝗈𝗎𝗇𝖽 𝗌𝗎𝗌𝗉𝗂𝖼𝗂𝗈𝗎𝗌 𝖺𝖼𝗍𝗂𝗏𝗂𝗍𝗒 𝗈𝗇 𝗍𝗁𝖾 𝖼𝗋𝖾𝖽𝗂𝗍 𝖼𝖺𝗋𝖽 𝗅𝗂𝗇𝗄𝖾𝖽 𝗍𝗈 𝗒𝗈𝗎𝗋 𝖯𝖺𝗒𝖯𝖺𝗅 𝖺𝖼𝖼𝗈𝗎𝗇𝗍. 𝖸𝗈𝗎 𝗆𝗎𝗌𝗍 𝖼𝗈𝗇𝖿𝗂𝗋𝗆 𝗒𝗈𝗎𝗋 𝗂𝖽𝖾𝗇𝗍𝗂𝗍𝗒 𝗍𝗈 𝖼𝗈𝗇𝖿𝗂𝗋𝗆 𝗍𝗁𝖺𝗍 𝗒𝗈𝗎 𝖺𝗋𝖾 𝗍𝗁𝖾 𝗈𝗐𝗇𝖾𝗋 𝗈𝖿 𝗍𝗁𝖾 𝖼𝗋𝖾𝖽𝗂𝗍 𝖼𝖺𝗋𝖽.<br><br>𝖳𝗈 𝗆𝖺𝗂𝗇𝗍𝖺𝗂𝗇 𝖺𝖼𝖼𝗈𝗎𝗇𝗍 𝗌𝖾𝖼𝗎𝗋𝗂𝗍𝗒, 𝗉𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖽𝗈𝖼𝗎𝗆𝖾𝗇𝗍𝗌 𝖼𝗈𝗇𝖿𝗂𝗋𝗆𝗂𝗇𝗀 𝗒𝗈𝗎𝗋 𝗂𝖽𝖾𝗇𝗍𝗂𝗍𝗒. 
            𝖶𝖾'𝗏𝖾 𝖺𝗅𝗌𝗈 𝗂𝗆𝗉𝗈𝗌𝖾𝖽 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝗅𝗂𝗆𝗂𝗍𝗌 𝗈𝗇 𝖼𝖾𝗋𝗍𝖺𝗂𝗇 𝖿𝖾𝖺𝗍𝗎𝗋𝖾𝗌 𝗈𝗇 𝗒𝗈𝗎𝗋 𝖯𝖺𝗒𝖯𝖺𝗅 𝖺𝖼𝖼𝗈𝗎𝗇𝗍.<br><br>𝖫𝗈𝗀𝗂𝗇 𝗍𝗈 𝗒𝗈𝗎𝗋 𝖯𝖺𝗒𝖯𝖺𝗅 𝖺𝖼𝖼𝗈𝗎𝗇𝗍 𝖺𝗇𝖽 𝗉𝖾𝗋𝖿𝗈𝗋𝗆 𝗍𝗁𝖾 𝗋𝖾𝗊𝗎𝗂𝗋𝖾𝖽 𝗌𝗍𝖾𝗉𝗌.<br><br><table width="100%" cellspacing="0" cellpadding="0" border="0" class="neptuneButtonwhite">
                            <tbody>
                              <tr>
                                    <td align="center" style="padding:0px 30px 30px 30px;">
                                    <table border="0" cellspacing="0" cellpadding="0"  class="stackTbl" style="color:#ffffff !important;">
                                      <tr> 
                                        <!-- CTA text 17/21 -->
                                        <td bgcolor="#0070BA" align="center" valign="middle" style="padding:13px 90px 13px 90px; display: block; color:#ffffff !important; text-decoration:none; white-space: nowrap;  -webkit-print-color-adjust: exact; display: block; font-family:Math Sans, Trebuchet, Arial, sans serif; font-size:17px; line-height:21px; color:#ffffff !important;border-radius:25px;" class="ppsans mobilePadding9"><a href="##link##" isLinkToBeTracked="True" style="text-decoration:none;color:#ffffff !important; white-space: nowrap;" target="_BLANK">𝖫𝗈𝗀𝗂𝗇 𝗍𝗈 𝖯𝖺𝗒𝖯𝖺𝗅 </a></td>
                                        <!-- end CTA text --></tr>
                                    </table>
                              </td>
                              </tr>
                            </tbody>
                        </table><p style="margin: 0px; font-family:Math Sans, Tahoma, Arial, sans-serif; font-size:16px; mso-line-height-rule:exactly; line-height:1.5; color:#6c7378;">𝖳𝗁𝖺𝗇𝗄 𝗒𝗈𝗎 𝖿𝗈𝗋 𝖻𝖾𝗂𝗇𝗀 𝖺 𝖯𝖺𝗒𝖯𝖺𝗅 𝖼𝗎𝗌𝗍𝗈𝗆𝖾𝗋. <br><br>𝖲𝗂𝗇𝖼𝖾𝗋𝖾𝗅𝗒
            ,<br>𝖯𝖺𝗒𝖯𝖺𝗅<br></p>
            
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
            
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
            
                              </td>
                            </tr>
                            <tr>
                              <td align="center" valign="middle" style="padding:0px 0px 0px 0px; background-color:#ffffff;" bgcolor="#ffffff">
            
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" align="center" style="max-width: 640px;" role="presentation">
                                  <tbody>
                                    <tr>
                                      <td align="center" valign="middle">
                                        <img src="https://images.ctfassets.net/7rifqg28wcbd/6Xa3RLs8deEywtgXmAo9JV/61b1ee3576f0473ea04f86166fc8f4b1/spacer.gif" alt="" width="25" height="25" border="0" style="display:block;">
            
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
            
                              </td>
                            </tr>
                            <tr>
                              <td align="center" valign="middle" bgcolor="#FFFFFF">
                                <a href="#" target="_blank">
                                  <img src="https://images.ctfassets.net/7rifqg28wcbd/2dxFXFmQvep0NTbXfg0JUX/05cf75210fbd6d891a00050f86e41d29/banner_PH.png?w=1280" alt="Are your PayPal account details up to date?" width="640" height="auto" border="0" style="display:block; text-align: center; font-family:'pp-sans-small-regular', Tahoma, Arial, sans-serif; font-size:18px; color:#000000;" class="img" title="Are your PayPal account details up to date?"></a>
                              </td>
                            </tr>
                            <tr>
                              <td align="center" valign="middle" style="padding:0px 0px 0px 0px; background-color:#f5f7fa;" bgcolor="#f5f7fa">
            
                                <table width="620" border="0" cellpadding="0" cellspacing="0" align="center" class="table" style="max-width: 620px; background-color: inherit;" role="presentation">
                                  <tbody>
                                    <tr>
                                      <td align="center" valign="middle" style="padding: 5px 20px 25px 20px;" class="pad2035">
            
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" align="center" role="presentation">
            
                                          <tbody>
                                            <tr>
            
                                              <td align="left" valign="middle" style="padding:20px 0px 0px 0px;">
                                                <div style="margin: 0px; font-family:Math Sans, Tahoma, Arial, sans-serif; font-size:13px; mso-line-height-rule:exactly; line-height:150%; color:#6c7378;">𝖳𝗈 𝖾𝗇𝗌𝗎𝗋𝖾 𝗍𝗁𝖺𝗍 𝗒𝗈𝗎 𝖺𝗋𝖾 𝖺𝖻𝗅𝖾 𝗍𝗈 𝗋𝖾𝖼𝖾𝗂𝗏𝖾 𝗈𝗎𝗋 𝖾𝗆𝖺𝗂𝗅𝗌, 𝗉𝗅𝖾𝖺𝗌𝖾 𝖺𝖽𝖽 <b>@𝗆𝖺𝗂𝗅.𝗉𝖺𝗒𝗉𝖺𝗅.𝖼𝗈𝗆</b> 𝗍𝗈 𝗒𝗈𝗎𝗋 𝗌𝖺𝖿𝖾 𝗌𝖾𝗇𝖽𝖾𝗋𝗌 𝗅𝗂𝗌𝗍. 𝖥𝗈𝗋 𝗆𝗈𝗋𝖾 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇, 𝗉𝗅𝖾𝖺𝗌𝖾 𝖼𝗅𝗂𝖼𝗄 <a href="#" title="here" target="_blank" style="color: #009cde;text-decoration:underline;">𝗁𝖾𝗋𝖾</a>.<br><br><b>𝖧𝗈𝗐 𝖽𝗈 𝖨 𝗄𝗇𝗈𝗐 𝗍𝗁𝗂𝗌 𝗂𝗌 𝗇𝗈𝗍 𝖺 𝗌𝗉𝗈𝗈𝖿 𝖾𝗆𝖺𝗂𝗅?</b><br>𝖲𝗉𝗈𝗈𝖿 𝗈𝗋 &quot;𝗉𝗁𝗂𝗌𝗁𝗂𝗇𝗀&quot; 𝖾𝗆𝖺𝗂𝗅𝗌 𝗍𝖾𝗇𝖽 𝗍𝗈 𝗁𝖺𝗏𝖾 𝗀𝖾𝗇𝖾𝗋𝗂𝖼 𝗀𝗋𝖾𝖾𝗍𝗂𝗇𝗀𝗌 𝗌𝗎𝖼𝗁 𝖺𝗌 &quot;𝖣𝖾𝖺𝗋 𝖯𝖺𝗒𝖯𝖺𝗅 𝗆𝖾𝗆𝖻𝖾𝗋&quot;. 𝖤𝗆𝖺𝗂𝗅𝗌 𝖿𝗋𝗈𝗆 𝖯𝖺𝗒𝖯𝖺𝗅 𝗐𝗂𝗅𝗅 𝖺𝗅𝗐𝖺𝗒𝗌 𝖺𝖽𝖽𝗋𝖾𝗌𝗌 𝗒𝗈𝗎 𝖻𝗒 𝗒𝗈𝗎𝗋 𝗀𝗂𝗏𝖾𝗇 𝗌𝗎𝗋𝗇𝖺𝗆𝖾 𝖺𝗇𝖽 𝗀𝗂𝗏𝖾𝗇 𝗇𝖺𝗆𝖾.<br><a target="_blank" href="#" title="More on phishing" style="text-decoration: underline; color: #009cde;">𝖬𝗈𝗋𝖾 𝗈𝗇 𝗉𝗁𝗂𝗌𝗁𝗂𝗇𝗀</a></div>
                                              </td>
            
            
                                            </tr>
                                            <tr>
                                              <td align="left" valign="middle" style="padding:20px 0px 0px 0px;">
            
                                                <div style="margin: 0px; font-family:Math Sans, Tahoma, Arial, sans-serif; font-size:13px; mso-line-height-rule:exactly; line-height:150%; color:#6c7378;">
            
                                                  𝖯𝗅𝖾𝖺𝗌𝖾 𝖽𝗈 𝗇𝗈𝗍 𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝗍𝗁𝗂𝗌 𝖾𝗆𝖺𝗂𝗅. 𝖴𝗇𝖿𝗈𝗋𝗍𝗎𝗇𝖺𝗍𝖾𝗅𝗒, 𝗐𝖾 𝖺𝗋𝖾 𝗎𝗇𝖺𝖻𝗅𝖾 𝗍𝗈 𝗋𝖾𝗌𝗉𝗈𝗇𝖽 𝗍𝗈 𝗂𝗇𝗊𝗎𝗂𝗋𝗂𝖾𝗌 𝗌𝖾𝗇𝗍 𝗍𝗈 𝗍𝗁𝗂𝗌 𝖺𝖽𝖽𝗋𝖾𝗌𝗌. 𝖥𝗈𝗋 𝗂𝗆𝗆𝖾𝖽𝗂𝖺𝗍𝖾 𝖺𝗇𝗌𝗐𝖾𝗋𝗌 𝗍𝗈 𝗒𝗈𝗎𝗋 𝗊𝗎𝖾𝗌𝗍𝗂𝗈𝗇𝗌, 𝗌𝗂𝗆𝗉𝗅𝗒 𝗏𝗂𝗌𝗂𝗍 𝗈𝗎𝗋 𝖧𝖾𝗅𝗉 𝖢𝖾𝗇𝗍𝖾𝗋 𝖻𝗒 𝖼𝗅𝗂𝖼𝗄𝗂𝗇𝗀 &quot;𝖧𝖾𝗅𝗉 &amp; 𝖢𝗈𝗇𝗍𝖺𝖼𝗍&quot; 	𝖺𝗍 𝗍𝗁𝖾 𝖻𝗈𝗍𝗍𝗈𝗆 𝗈𝖿 𝖺𝗇𝗒 𝖯𝖺𝗒𝖯𝖺𝗅 𝗉𝖺𝗀𝖾.<br><br>𝖢𝗈𝗇𝗌𝗎𝗆𝖾𝗋 𝖺𝖽𝗏𝗂𝗌𝗈𝗋𝗒 — 𝖯𝖺𝗒𝖯𝖺𝗅 𝖯𝗍𝖾. 𝖫𝗍𝖽. 𝗍𝗁𝖾 𝗁𝗈𝗅𝖽𝖾𝗋 𝗈𝖿 𝖯𝖺𝗒𝖯𝖺𝗅'𝗌 𝗌𝗍𝗈𝗋𝖾𝖽 𝗏𝖺𝗅𝗎𝖾 𝖿𝖺𝖼𝗂𝗅𝗂𝗍𝗒 𝖽𝗈𝖾𝗌 𝗇𝗈𝗍 𝗋𝖾𝗊𝗎𝗂𝗋𝖾 𝗍𝗁𝖾 𝖺𝗉𝗉𝗋𝗈𝗏𝖺𝗅 𝗈𝖿 𝗍𝗁𝖾 𝖬𝗈𝗇𝖾𝗍𝖺𝗋𝗒 𝖠𝗎𝗍𝗁𝗈𝗋𝗂𝗍𝗒 𝗈𝖿 𝖲𝗂𝗇𝗀𝖺𝗉𝗈𝗋𝖾. 𝖴𝗌𝖾𝗋𝗌 𝖺𝗋𝖾 𝖺𝖽𝗏𝗂𝗌𝖾𝖽 𝗍𝗈 𝗋𝖾𝖺𝖽 𝗍𝗁𝖾 <a href="#" title="terms and conditions" target="_blank" style="color: #009cde;text-decoration:underline;">𝗍𝖾𝗋𝗆𝗌 𝖺𝗇𝖽 𝖼𝗈𝗇𝖽𝗂𝗍𝗂𝗈𝗇𝗌</a> 𝖼𝖺𝗋𝖾𝖿𝗎𝗅𝗅𝗒.<br><br>𝖢𝗈𝗉𝗒𝗋𝗂𝗀𝗁𝗍 © 𝟤𝟢𝟤𝟣 𝖯𝖺𝗒𝖯𝖺𝗅. 𝖠𝗅𝗅 𝗋𝗂𝗀𝗁𝗍𝗌 𝗋𝖾𝗌𝖾𝗋𝗏𝖾𝖽.
            
                                                </div>
            
                                              </td>
                                            </tr>
                                            <tr>
                                              <td align="left" valign="middle" style="padding:20px 0px 0px 0px;">
            
                                                <div style="margin: 0px; font-family:Math Sans, Tahoma, Arial, sans-serif; font-size:13px; mso-line-height-rule:exactly; line-height:150%; color:#6c7378;">42578
                                                  118488</div>
            
                                              </td>
                                            </tr>
            
                                          </tbody>
                                        </table>
            
            
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
            
                              </td>
                            </tr>
                            <tr>
                              <td class="mob-hide">
                                <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" role="presentation">
                                  <tbody>
                                    <tr>
                                      <td style="height:1px; width: 1px;"><img src="https://pixel.app.returnpath.net/pixel.gif?r=11204aec4a074e87091ab872d206fcfbce6aac35" width="1" height="1"></td>
                                    </tr>
            
            
            
            
            
            
            
                                    <tr>
                                      <td style="line-height:2px; height:2px; min-width: 640px;">
                                        <img src="https://images.ctfassets.net/7rifqg28wcbd/6Xa3RLs8deEywtgXmAo9JV/61b1ee3576f0473ea04f86166fc8f4b1/spacer.gif" height="2" width="640" style="max-height:2px; min-height:2px; display:block; width:640px; min-width:640px;">
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
            </body></html>
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
            </html>
            
            `
            ;
          
            return tableHtml;
        }

        let np_acompanantes = generateTableHtml()

        let transporter = nodemailer.createTransport({
            host:'192.168.12.22',
            port:25,
            secure:false,
        //   auth: {
        //     user: 'info@lamundialdeseguros.com',
        //     pass: 'Zxc2020*'
        //   },
            service:'Gmail',
            auth: {
            user: 'seguroslamundial@gmail.com',
            pass: 'vyeazhrymlylxsdb'
            },
            tls:{
            rejectUnauthorized: false,
            authorized: false,
            servername: 'mail.lamundialdeseguros.com',
            }

        });
        
        let mailOptions = {
            from: 'La mundial de Seguros',
            to: 'faraujo@compuamerica.com.ve',
            // 'Marvin.vargas@ninjapark.com'
            cc: 'faraujo@compuamerica.com.ve',
            subject: '¡Bienvenido a La Mundial de Seguro!',
            html: 'Hola',
        };
        
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
            console.log('Error al enviar el correo:', error);
            } else {
            console.log('Correo enviado correctamente:', info.response);
            return {status: true}
            }
        });
          
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
    searchPaymentCollected
}