import virtualAssistantService from '../service/virtualAssistantService.js';

const searchClient = async (req, res) => {
    const search = await virtualAssistantService.searchPremiums(req.body);
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
        .send(
            search
            );
}

export default {
    searchClient,
}