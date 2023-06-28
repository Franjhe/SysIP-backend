import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';


const User = sequelize.define('seusuariosweb', {}, { tableName: 'seusuariosweb' });
const Info = sequelize.define('seusuariosweb', {
  cusuario: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  xnombre: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  xapellido: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  xlogin: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  xusuario: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  xcorreo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  xobservacion: {
    type: Sequelize.STRING,
    allowNull: true,
  },
}, {
  tableName: 'seusuariosweb',
});
const Update = sequelize.define('seusuariosweb', {
  cusuario: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  xnombre: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  xapellido: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  xlogin: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  xusuario: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  xcorreo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  xobservacion: {
    type: Sequelize.STRING,
    allowNull: true,
  },
}, {
  tableName: 'seusuariosweb',
  timestamps: false, // Agregar esta opción para deshabilitar los timestamps
});

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

const infoUser = async (infoUser) => {
  try {
    const infoQuery = await Info.findOne({
      where: infoUser,
      attributes: ['cusuario', 'xnombre', 'xapellido', 'xlogin', 'xusuario', 'xcorreo', 'xobservacion'],
    });
    const info = infoQuery ? infoQuery.get({ plain: true }) : null;
    return info;
  } catch (error) {
    return { error: error.message };
  }
};

// const updateUser = async (updateUser) => {
//   const { xnombre, xapellido, xlogin, xusuario, xcorreo, xobservacion } = updateUser;
//   try {
//     const updatedUser = await Update.update(
//       { xnombre, xapellido, xlogin, xusuario, xcorreo, xobservacion },
//       { where: { cusuario: parseInt(updateUser.cusuario) } }
//     );

//     if (updatedUser[0] === 1) {
//       console.log('Usuario actualizado correctamente');
//       const update = updatedUser[0] ? updatedUser[0].get({ plain: true }) : null;
//       return update;
//     } else {
//       return { success: false, message: 'No se encontró ningún usuario' };
//     }
//   } catch (error) {
//     console.log(error);
//     return { success: false, message: 'Error al actualizar el usuario', error };
//   }
// };

const updateUser = async (updateUser) => {
  const { xnombre, xapellido, xlogin, xusuario, xcorreo, xobservacion } = updateUser;
  try {
    const [rowCount] = await Update.update(
      { xnombre, xapellido, xlogin, xusuario, xcorreo, xobservacion },
      { where: { cusuario: parseInt(updateUser.cusuario) } }
    );

    if (rowCount === 1) {
      console.log('Usuario actualizado correctamente');
      const updatedRow = await Update.findOne({
        where: { cusuario: parseInt(updateUser.cusuario) }
      });
      const update = updatedRow ? updatedRow.get({ plain: true }) : null;
      return update;
    } else {
      return { success: false, message: 'No se encontró ningún usuario' };
    }
  } catch (error) {
    console.log(error);
    return { success: false, message: 'Error al actualizar el usuario', error };
  }
};


export default {
  searchUser,
  infoUser,
  updateUser
};