import Security from '../db/Security.js';

const searchUser = async () => {
    const users = await Security.searchUser();
    if (users.error) {
        return {
            error: users.error
        }
    }
    return users;
}

const infoUser = async (infoUser) => {
    const info = await Security.infoUser(infoUser);
    if (info.error) {
        return {
            error: info.error
        }
    }
    return info;
}

const updateUser = async (updateUser) => {
    const update = await Security.updateUser(updateUser);
    if (update.error) {
        return {
            error: update.error
        }
    }
    return update;
}

const createUser = async (createUser) => {
    const create = await Security.createUser(createUser);
    if (create.error) {
        return {
            error: create.error
        }
    }
    return create;
}

export default {
    searchUser,
    infoUser,
    updateUser,
    createUser
}