import virtualAssistantService from '../service/virtualAssistantService.js';

const searchClient = async (req, res) => {
    const search = await virtualAssistantService.getIdClient(req.params.id);
    if (search.error) {
        return res
            .status(500)
            .send(search.error);
    }

    if(!search){
        return res
          .status(404)
          .send({
                status: false,
                message: 'Cliente no encontrado'
            });
    }

    const poliza = await virtualAssistantService.getPoliza(req.params.id);
    if (poliza.error) {
        return res
            .status(500)
            .send(poliza.error);
    }
    return res
        .status(200)
        .send({
            cliente : search,
            polizas : poliza
        });
}

export default {
    searchClient,
}