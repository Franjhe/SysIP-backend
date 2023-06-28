import sequelize from '../config/database.js';

const User = sequelize.define('seusuarios', {});

const searchUser = async () => {
    try {
      const user = await User.findAll({
        attributes: ['cusuario', 'xnombre', 'xapellido', 'xlogin', ],
      });
      const users = user.map((item) => item.get({ plain: true }));
      return users;
    } catch (error) {
      return { error: error.message };
    }
  };

  export default {
    searchUser
  };