import User from '../db/User.js';

const verifyIfUsernameExists = async (clogin) => {
    const verifiedUsername = await User.verifyIfUsernameExists(clogin.toLowerCase());
    if (verifiedUsername.error) {
        return { error: verifiedUsername.error, code: 500 };
    }
    if (verifiedUsername.result.rowsAffected < 1) {
        return { error: "Authentication Error", code: 401 };
    }
    return verifiedUsername;
}

const verifyIfPasswordMatchs = async (clogin, xclavesec) => {
    const verifiedPassword = await User.verifyIfPasswordMatchs(clogin, xclavesec);
    if (verifiedPassword.error) {
        return { error: verifiedPassword.error, code: 500 };
    }
    if (verifiedPassword.result.rowsAffected < 1) {
        return { error: "Authentication Error", code: 401 };
    }
    return verifiedPassword;
};

export default {
    verifyIfUsernameExists,
    verifyIfPasswordMatchs
}