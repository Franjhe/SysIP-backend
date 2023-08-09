import NinjaPark from '../db/NinjaPark.js';

const createUsersFromNinja = async (createUsersFromNinja) => {
    console.log(createUsersFromNinja)
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

const detailUsersFromNinja = async (detailUsersFromNinja) => {
    const detail = await NinjaPark.detailUsersFromNinja(detailUsersFromNinja);
    if (detail.error) {
        return {
            error: detail.error
        }
    }
    return detail;
}

export default {
    createUsersFromNinja,
    searchUsersFromNinja,
    detailUsersFromNinja
}