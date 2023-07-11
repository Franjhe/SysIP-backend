import NinjaPark from '../db/NinjaPark.js';

const createUsersFromNinja = async (createUsersFromNinja) => {
    const createUN = await NinjaPark.createUsersFromNinja(createUsersFromNinja);
    if (createUN.error) {
        return {
            error: createUN.error
        }
    }
    return createUN;
}

export default {
    createUsersFromNinja
}