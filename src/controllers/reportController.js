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

const searchReceipt = async (req, res) => {
    const receipt = await reportService.searchReceipt(req.body);
    if (receipt.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: receipt.permissionError
            });
    }
    if (receipt.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: receipt.error,
                code: 500
            });
    }

    const formattedList = receipt.receipt.recordset.map((item) => ({
        ...item,
        start_date: item.start_date ? new Date(item.start_date).toLocaleDateString('es-ES') : null,
        end_date: item.start_date ? new Date(item.end_date).toLocaleDateString('es-ES') : null,
    }));

    return res
        .status(200)
        .send({
            status: true,
            data: {
                list: formattedList
            }
        });
}

export default {
    searchPremiums,
    searchReceipt
}