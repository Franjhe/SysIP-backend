import collectionService from '../service/collectionService.js';

const searchCollectionbyClient = async (req, res) => {
    const searchReceipt = await collectionService.searchDataReceipt(req.body.cedula);

    if (searchReceipt.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: searchReceipt.permissionError
            });
    }
    if (searchReceipt.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: searchReceipt.error
            });
    }

    return res
        .status(200)
        .send({
            status: true,
            searchReceipt,
            message: 'Consulta exitosa.'
            
        });
}

export default {
    searchCollectionbyClient,
}