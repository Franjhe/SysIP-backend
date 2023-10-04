import certificateService from '../service/certificateService.js';

const searchCertificate = async (req, res) => {
    const search = await certificateService.searchCertificate(req.body);
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
            data: search
            
        });
}



export default {
    searchCertificate,
 
}