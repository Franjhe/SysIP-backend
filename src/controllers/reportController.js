import reportService from '../service/reportService.js';

const searchPremiums = async (req, res) => {
    const search = await reportService.searchPremiums(req.body);
    if (search.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: search.permissionError
            });
    }
    if (search.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: search.error
            });
    }

    return res
        .status(200)
        .send({
            status: true,
            data: {
                list: search
            }
        });
}

export default {
    searchPremiums
}