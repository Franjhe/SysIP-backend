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

export default {
    searchUser
}