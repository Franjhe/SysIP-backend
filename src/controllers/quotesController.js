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
    return res
        .status(200)
        .send({
            status: true,
            data: {
                amplia: coverageAmplia,
                perdida: coveragePerdida,
                rcv: rcv,
            }
        });
}

export default {
    createQuotes,
    updateQuotes,
    searchCoverages
}