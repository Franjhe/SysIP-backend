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

export default {
    createQuotes
}