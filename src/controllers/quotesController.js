import quotesService from '../service/quotesService.js';

const createQuotes = async (req, res) => {
    const result = await quotesService.createQuotes(req.body);
    if (result.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: result.permissionError
            });
    }
    if (result.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: result.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                list: result
            }
        });
}

const updateQuotes = async (req, res) => {
    const update = await quotesService.updateQuotes(req.body);
    if (update.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: update.permissionError
            });
    }
    if (update.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: update.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                message: "Cotización exitosa"
            }
        });
}

const searchCoverages = async (req, res) => {
    const coverage = await quotesService.searchCoverages();
    if (coverage.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: coverage.permissionError
            });
    }
    if (coverage.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: coverage.error
            });
    }
    const allCoverages = coverage;

    let coverageAmplia = allCoverages.filter(c => ![15, 16, 23, 21, 18, 30].includes(c.ccobertura));
    let coveragePerdida = allCoverages.filter(c => ![13, 14, 29, 21, 18, 30].includes(c.ccobertura));
    let rcv = allCoverages.filter(c => ![13, 14, 15, 16, 17, 18, 20, 21, 23, 29, 30].includes(c.ccobertura));
    let coverages = allCoverages.filter(c => !['T'].includes(c.ititulo));
    let allCoverages2 = coverages.filter(c => ![18, 21, 30, 20].includes(c.ccobertura));
    return res
        .status(200)
        .send({
            status: true,
            data: {
                amplia: coverageAmplia,
                perdida: coveragePerdida,
                rcv: rcv,
                allCoverages: allCoverages2
            }
        });
}

const detailQuotes = async (req, res) => {
    const detail = await quotesService.detailQuotes(req.body);
    if (detail.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: detail.permissionError
            });
    }
    if (detail.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: detail.error
            });
    }
    let comparativeList = [];
    const mapping = {
      'Cobertura Amplia': 'msuma_amplia',
      'Perdida Total': 'msuma_total',
      'Riesgo Catastrofico': 'msuma_catastrofico',
      'Indemnizacion Diaria por Robo': 'msuma_indem',
      'Indemnizacion Diaria por Perdida Total': 'msuma_indem',
      'Daños a Cosas': 'msuma_dc',
      'Daños a Personas': 'msuma_persona',
      'Defensa Penal': 'msuma_defensa',
      'Exceso de Limite': 'msuma_exceso',
      'Muerte Accidental': 'msuma_muerte',
      'Invalidez Permanente': 'msuma_invalidez',
      'Gastos Médicos': 'msuma_gm',
      'Gastos Funerarios': 'msuma_gf',
    };
    
    for (let i = 0; i < req.body.coverage.length; i++) {
      const currentCoverage = req.body.coverage[i].xcobertura;
      const mappedField = mapping[currentCoverage];
    
      if (mappedField) {
        const newItem = {
          xcobertura: currentCoverage,
          [mappedField]: detail[0][mappedField],
        };
    
        comparativeList.push(newItem);
      }
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                list: comparativeList
            }
        });
}

const detailQuotesAutomobile = async (req, res) => {
    const result = await quotesService.detailQuotesAutomobile();
    if (result.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: result.permissionError
            });
    }
    if (result.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: result.error
            });
    }
    let auto = [];
    for(let i = 0; i < result.length; i++){
        auto.push({
            ccotizacion: result[i].ccotizacion,
            xnombres: result[i].xnombre + ' ' + result[i].xapellido,
            xvehiculo: result[i].xmarca + ' ' + result[i].xmodelo + ' ' + result[i].xversion,
        })
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                auto: auto
            }
        });
}

const searchQuotes = async (req, res) => {
    const result = await quotesService.searchQuotes(req.body);
    if (result.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: result.permissionError
            });
    }
    if (result.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: result.error
            });
    }
    let quote = []
    for(let i = 0; i < result.length; i++){
        quote.push({
            mtotal_rcv: result[i].mtotal_rcv,
            mtotal_amplia: result[i].mtotal_amplia,
            mtotal_perdida: result[i].mtotal_perdida,
            xplan_rc: result[i].xplan_rc,
            cplan_rc: result[i].cplan_rc,
        })
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                xmarca: result[0].xmarca, 
                xmodelo: result[0].xmodelo,
                xversion: result[0].xversion,
                nombres: result[0].xnombre + ' ' + result[0].xapellido,
                vehiculo: result[0].xmarca + ' ' + result[0].xmodelo + ' ' + result[0].xversion,
                fano: result[0].qano,
                xcorreo: result[0].xcorreo,
                list: quote
            }
        });
}


export default {
    createQuotes,
    updateQuotes,
    searchCoverages,
    detailQuotes,
    detailQuotesAutomobile,
    searchQuotes
}