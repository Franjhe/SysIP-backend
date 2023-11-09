import Certificate from '../db/Certificate.js';

const searchCertificate = async (searchPremiums) => {
    const search = await Certificate.searchCertificate(searchPremiums);
    if (search.error) {
        return {
            error: search.error
        }
    }
    return search;
}


const detailCertificateCertificate = async (searchDetail) => {
    let getFleetContractData = await Certificate.getFleetContractDataQuery(searchDetail).then((res) => res);
    if(getFleetContractData.error){ return { status: false, code: 500, message: getFleetContractData.error }; }
    if(getFleetContractData.result.rowsAffected > 0){
    let getFleetContractReceiptData = await Certificate.getFleetContractReceiptData(searchDetail).then((res) => res);
    let receiptList = [];
    if (getFleetContractReceiptData.result.rowsAffected > 0) {
        for (let i = 0; i < getFleetContractReceiptData.result.recordset.length; i++) {
            // Convierte las fechas a formato "dd/mm/yyyy"
            const fdesdeRec = new Date(getFleetContractReceiptData.result.recordset[i].FDESDE_REC);
            const fhastaRec = new Date(getFleetContractReceiptData.result.recordset[i].FHASTA_REC);
    
            const dd_mm_yyyy_format = (date) => {
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Suma 1 al mes, ya que los meses en JavaScript van de 0 a 11.
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            };
    
            receiptList.push({
                crecibo: getFleetContractReceiptData.result.recordset[i].CRECIBO,
                fdesde_rec: dd_mm_yyyy_format(fdesdeRec),
                fhasta_rec: dd_mm_yyyy_format(fhastaRec),
                xmoneda: getFleetContractReceiptData.result.recordset[i].xmoneda,
                mprima: getFleetContractReceiptData.result.recordset[i].MPRIMA_BRUTA_EXT,
            });
        }
    }
    let getFleetContractOwnerData = await Certificate.getFleetContractOwnerDataQuery(searchDetail, getFleetContractData.result.recordset[0].CPROPIETARIO).then((res) => res);
        if(getFleetContractOwnerData.error){console.log(getFleetContractOwnerData.error); return { status: false, code: 500, message: getFleetContractOwnerData.error }; }
        let telefonopropietario;
        if(getFleetContractOwnerData.result.recordset[0].XTELEFONOCELULAR){
            telefonopropietario = getFleetContractOwnerData.result.recordset[0].XTELEFONOCELULAR;
        }else{
            telefonopropietario = getFleetContractOwnerData.result.recordset[0].XTELEFONOCASA
        }
        if(getFleetContractOwnerData.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Fleet Contract Owner not found.' }; }

        let getFleetContractClientData = await Certificate.getContractClientData(getFleetContractData.result.recordset[0].CCLIENTE);
        let inspections = [];
        let mprimatotal = 0;
        let mprimaprorratatotal = 0; 
        let getPlanData = await Certificate.getPlanData(getFleetContractData.result.recordset[0].CPLAN_RC);
        if(getPlanData.error){ return { status: false, code: 500, message: getFleetContractOwnerData.error }; }
        if(getPlanData.result.rowsAffected < 0){ console.log(getPlanData.error); return { status: false, code: 404, message: 'Fleet Contract Plan not found.' }; }
        let realCoverages = [];
        let coverageAnnexes = [];
        let getPlanCoverages = await Certificate.getPlanCoverages(getFleetContractData.result.recordset[0].CPLAN_RC, getFleetContractData.result.recordset[0].CCONTRATOFLOTA);
        if(getPlanCoverages.error){ console.log(getPlanCoverages.error); return { status: false, code: 500, message: getFleetContractOwnerData.error }; }
        if(getPlanCoverages.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Fleet Contract Plan Coverages not found.' }; }
        for (let i = 0; i < getPlanCoverages.result.recordset.length; i++) {
            // Solo se suma si el codigo de la moneda es 2 (usd), si la moneda es bs no lo toma en cuenta
            if (getPlanCoverages.result.recordset[i].cmoneda == 2 && getPlanCoverages.result.recordset[i].mprima) {
                mprimatotal = mprimatotal + getPlanCoverages.result.recordset[i].mprima;
            } 
            if (getPlanCoverages.result.recordset[i].cmoneda == 2 && getPlanCoverages.result.recordset[i].mprimaprorrata) {
                mprimaprorratatotal = mprimaprorratatotal + getPlanCoverages.result.recordset[i].mprimaprorrata
            }
            let getCoverageAnnexes = await Certificate.getCoverageAnnexesQuery(getPlanCoverages.result.recordset[i].CCOBERTURA)
            if (getCoverageAnnexes.result) {
                for (let i = 0; i < getCoverageAnnexes.result.recordset.length; i++) {
                    let annex = {
                        ccobertura: getCoverageAnnexes.result.recordset[i].CCOBERTURA,
                        canexo: getCoverageAnnexes.result.recordset[i].CANEXO,
                        xanexo: getCoverageAnnexes.result.recordset[i].XANEXO
                    }
                    coverageAnnexes.push(annex);
                }
            }
            let coverage = {
                ccobertura: getPlanCoverages.result.recordset[i].CCOBERTURA,
                xcobertura: getPlanCoverages.result.recordset[i].XCOBERTURA,
                ptasa: getPlanCoverages.result.recordset[i].ptasa,
                msumaasegurada: getPlanCoverages.result.recordset[i].msuma_aseg,
                mprima: getPlanCoverages.result.recordset[i].mprima,
                mprimaprorrata: getPlanCoverages.result.recordset[i].mprimaprorrata,
                ititulo: getPlanCoverages.result.recordset[i].ititulo,
                xmoneda: getPlanCoverages.result.recordset[i].xmoneda,
                ccontratoflota: getPlanCoverages.result.recordset[i].ccontratoflota,
            }
            realCoverages.push(coverage);
        }
        //Se redondea el total de la prima a dos decimales. 96,336 -> 96,34
        mprimatotal = Number(mprimatotal.toFixed(2)); // Redondea mprimatotal a 2 decimales
        if (mprimaprorratatotal > 0) {
            mprimaprorratatotal = Number(mprimaprorratatotal.toFixed(2)); // Redondea mprimaprorratatotal a 2 decimales si es mayor que 0
        }
        let services = [];
        let getFleetContractServices = await Certificate.getFleetContractServices(getFleetContractData.result.recordset[0].ccarga);
        if(getFleetContractServices.error){ console.log(getFleetContractServices.error); return { status: false, code: 500, message: getFleetContractServices.error }; }
        if(getFleetContractServices.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Fleet Contract Service not found.' }; }
        if (getFleetContractServices.result.rowsAffected > 0) {
            for(let i = 0; i < getFleetContractServices.result.recordset.length; i++){
                let service = {
                    cservicio: getFleetContractServices.result.recordset[i].cservicio,
                    xservicio: getFleetContractServices.result.recordset[i].XSERVICIO,
                }
                services.push(service);
            }
        }
        let getBroker = await Certificate.getBroker(getFleetContractData.result.recordset[0].ccorredor);
        if(getBroker.error){ console.log(getBroker.error); return { status: false, code: 500, message: getBroker.error }; }
        if(getBroker.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Fleet Contract Service not found.' }; }
        let accesories = []
        let getFleetContractAccesories = await Certificate.getFleetContractAccesoriesQuery(searchDetail.ccontratoflota);
        if(getFleetContractAccesories.error){ return { status: false, code: 500, message: getFleetContractAccesories.error }; }
        if (getFleetContractAccesories.result.rowsAffected > 0) {
            for(let i = 0; i < getFleetContractAccesories.result.recordset.length; i++){
                let accessory = {
                    caccesorio: getFleetContractAccesories.result.recordset[i].CACCESORIO,
                    xaccesorio: getFleetContractAccesories.result.recordset[i].XACCESORIO,
                    maccesoriocontratoflota: getFleetContractAccesories.result.recordset[i].MACCESORIOCONTRATOFLOTA,
                }
                accesories.push(accessory);
            }
        }
        let getPolicyEffectiveDate = await Certificate.getPolicyEffectiveDateQuery(searchDetail.ccontratoflota);
        if(getPolicyEffectiveDate.error){ return { status: false, code: 500, message: getPolicyEffectiveDate.error }; }
        if(getPolicyEffectiveDate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Fleet Contract Receipts not found.' }; }

        let getTakers = await Certificate.getTakersQuery(searchDetail.ccontratoflota);
        let xtomador; let xrif_tomador; let xdireccion_tomador; let xzona_postal_tomador; let xtelefono_tomador; let xcorreo_tomador;
        let xestado_tomador; let xciudad_tomador;
        if(getTakers.error){ return { status: false, code: 500, message: getTakers.error }; }
        if(getTakers.result.rowsAffected > 0){ 
            xtomador = getTakers.result.recordset[0].XTOMADOR
            xrif_tomador = getTakers.result.recordset[0].XRIF
            xdireccion_tomador = getTakers.result.recordset[0].XDIRECCION
            xzona_postal_tomador = getTakers.result.recordset[0].XZONA_POSTAL
            xtelefono_tomador = getTakers.result.recordset[0].XTELEFONO
            xcorreo_tomador = getTakers.result.recordset[0].XCORREO
            xestado_tomador = getTakers.result.recordset[0].XESTADO
            xciudad_tomador = getTakers.result.recordset[0].XCIUDAD
        }
        return {
            status: true,
            ccarga: getFleetContractData.result.recordset[0].ccarga,
            ccontratoflota: getFleetContractData.result.recordset[0].CCONTRATOFLOTA,
            xrecibo: getFleetContractData.result.recordset[0].XRECIBO,
            xpoliza: getFleetContractData.result.recordset[0].xpoliza,
            xtituloreporte: getFleetContractData.result.recordset[0].XTITULO_REPORTE,
            xtransmision: getFleetContractData.result.recordset[0].XTRANSMISION,
            xanexo: getFleetContractData.result.recordset[0].XANEXO,
            xobservaciones: getFleetContractData.result.recordset[0].XOBSERVACIONES,
            xdocidentidadrepresentantelegal: getFleetContractData.result.recordset[0].XDOCIDENTIDAD,
            xnombrerepresentantelegal: getFleetContractData.result.recordset[0].XREPRESENTANTELEGAL,
            ccliente: getFleetContractData.result.recordset[0].CCLIENTE,
            xnombrecliente: getFleetContractClientData.result.recordset[0].XCLIENTE,
            xdocidentidadcliente: getFleetContractClientData.result.recordset[0].XDOCIDENTIDAD,
            xdireccionfiscalcliente: getFleetContractClientData.result.recordset[0].XDIRECCIONFISCAL,
            xtelefonocliente:getFleetContractClientData.result.recordset[0].XTELEFONO,
            xemailcliente: getFleetContractClientData.result.recordset[0].XEMAIL,
            xrepresentantecliente: getFleetContractClientData.result.recordset[0].XREPRESENTANTE,
            xestadocliente: getFleetContractClientData.result.recordset[0].XESTADO,
            xciudadcliente: getFleetContractClientData.result.recordset[0].XCIUDAD,
            casociado:  getFleetContractData.result.recordset[0].CASOCIADO,
            xcertificadogestion: '',
            xcertificadoasociado: getFleetContractData.result.recordset[0].XCERTIFICADOASOCIADO,
            xsucursalemision: getFleetContractData.result.recordset[0].XSUCURSALEMISION,
            xsucursalsuscriptora: getFleetContractData.result.recordset[0].XSUCURSALSUSCRIPTORA,
            cagrupador: getFleetContractData.result.recordset[0].CAGRUPADOR,
            fsuscripcion: getFleetContractData.result.recordset[0].FINICIO,
            finicio: getFleetContractData.result.recordset[0].FDESDE_POL,
            fhasta: getFleetContractData.result.recordset[0].FHASTA_POL,
            finiciorecibo: getFleetContractData.result.recordset[0].FDESDE_REC,
            fhastarecibo: getFleetContractData.result.recordset[0].FHASTA_REC,
            femision: getFleetContractData.result.recordset[0].FINICIO,
            cestatusgeneral: getFleetContractData.result.recordset[0].CESTATUSGENERAL,
            xestatusgeneral: getFleetContractData.result.recordset[0].XESTATUSGENERAL,
            ctrabajador: getFleetContractData.result.recordset[0].CTRABAJADOR,
            ccorredor: getBroker.result.recordset[0].cproductor,
            xcorredor: getBroker.result.recordset[0].xintermediario,
            cpropietario: getFleetContractData.result.recordset[0].CPROPIETARIO,
            xnombrepropietario: getFleetContractOwnerData.result.recordset[0].XNOMBRE,
            xtipodocidentidadpropietario: getFleetContractOwnerData.result.recordset[0].XTIPODOCIDENTIDAD,
            xdocidentidadpropietario: getFleetContractOwnerData.result.recordset[0].XDOCIDENTIDAD,
            xdireccionpropietario: getFleetContractOwnerData.result.recordset[0].XDIRECCION,
            xtelefonocelularpropietario: getFleetContractOwnerData.result.recordset[0].telefonopropietario,
            xestadopropietario: getFleetContractOwnerData.result.recordset[0].XESTADO,
            xciudadpropietario: getFleetContractOwnerData.result.recordset[0].XCIUDAD,
            fnacimientopropietario: getFleetContractOwnerData.result.recordset[0].FNACIMIENTO,
            xapellidopropietario: getFleetContractOwnerData.result.recordset[0].XAPELLIDO,
            xocupacionpropietario: getFleetContractOwnerData.result.recordset[0].XOCUPACION,
            xestadocivilpropietario: getFleetContractOwnerData.result.recordset[0].XESTADOCIVIL,
            xemailpropietario: getFleetContractOwnerData.result.recordset[0].XEMAIL,
            xsexopropietario: getFleetContractOwnerData.result.recordset[0].XSEXO,
            xnacionalidadpropietario: getFleetContractOwnerData.result.recordset[0].XNACIONALIDAD,
            xtelefonopropietario: getFleetContractOwnerData.result.recordset[0].telefonopropietario,
            cvehiculopropietario: getFleetContractData.result.recordset[0].CVEHICULOPROPIETARIO,
            ctipoplan: getFleetContractData.result.recordset[0].CTIPOPLAN,
            CPLAN_RC: getFleetContractData.result.recordset[0].CPLAN_RC,
            cmetodologiapago: getFleetContractData.result.recordset[0].CMETODOLOGIAPAGO,
            xmetodologiapago: getFleetContractData.result.recordset[0].XMETODOLOGIAPAGO,
            ctiporecibo: getFleetContractData.result.recordset[0].CTIPORECIBO,
            xmarca: getFleetContractData.result.recordset[0].XMARCA,
            xmoneda: getFleetContractData.result.recordset[0].xmoneda,
            xmodelo: getFleetContractData.result.recordset[0].XMODELO,
            xversion: getFleetContractData.result.recordset[0].XVERSION,
            xcolor: getFleetContractData.result.recordset[0].XCOLOR,
            xplaca: getFleetContractData.result.recordset[0].XPLACA,
            xuso: getFleetContractData.result.recordset[0].XUSO,
            xtipovehiculo: getFleetContractData.result.recordset[0].XTIPOVEHICULO,
            fano: getFleetContractData.result.recordset[0].FANO,
            xserialcarroceria: getFleetContractData.result.recordset[0].XSERIALCARROCERIA,
            xserialmotor: getFleetContractData.result.recordset[0].XSERIALMOTOR,
            mpreciovehiculo: getFleetContractData.result.recordset[0].MPRECIOVEHICULO,
            ctipovehiculo: getFleetContractData.result.recordset[0].CTIPOVEHICULO,
            xtipomodelovehiculo: getFleetContractData.result.recordset[0].XTIPOMODELO,
            ncapacidadcargavehiculo: getFleetContractData.result.recordset[0].NCAPACIDADCARGA,
            ncapacidadpasajerosvehiculo: getFleetContractData.result.recordset[0].NCAPACIDADPASAJEROS,
            xplancoberturas: getPlanData.result.recordset[0].XPLAN_RC,
            xtomador: xtomador,
            xrif_tomador: xrif_tomador,
            xdireccion_tomador: xdireccion_tomador,
            xzona_postal_tomador: xzona_postal_tomador,
            xtelefono_tomador: xtelefono_tomador,
            xcorreo_tomador: xcorreo_tomador,
            xestado_tomador: xestado_tomador,
            xciudad_tomador: xciudad_tomador,
            xclase: getFleetContractData.result.recordset[0].XCLASE,
            nkilometraje: getFleetContractData.result.recordset[0].NKILOMETRAJE,
            xzona_postal_propietario: getFleetContractData.result.recordset[0].XZONA_POSTAL_PROPIETARIO,
            mprimatotal: mprimatotal,
            mprimaprorratatotal: mprimaprorratatotal,
            accesories: accesories,
            inspections: inspections,
            services:services,
            realCoverages: realCoverages,
            coverageAnnexes: coverageAnnexes,
            receipt: receiptList,
            fdesde_pol: getPolicyEffectiveDate.result.recordset[0].FDESDE_POL,
            fhasta_pol: getPolicyEffectiveDate.result.recordset[0].FHASTA_POL
        }
    }else{ 
        return { 
            status: false, 
            code: 404, 
            message: 'Fleet Contract not found.' 
        }; 
    }

}

export default {
    searchCertificate,
    detailCertificateCertificate

}