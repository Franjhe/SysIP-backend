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

const searchUsersFromNinja = async () => {
    const search = await NinjaPark.searchUsersFromNinja();
    if (search.error) {
        return {
            error: search.error
        }
    }
    return search;
}

export default {
    createUsersFromNinja,
    searchUsersFromNinja
}