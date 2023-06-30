import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import sql from "mssql";

const sqlConfig = {
    user: process.env.USER_BD,
    password: process.env.PASSWORD_BD,
    server: process.env.SERVER_BD,
    database: process.env.NAME_BD,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}

sequelize.options.logging = console.log;

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
    allowNull: true,
  },
  xapellido: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  xlogin: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  xusuario: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  xcorreo: {
    type: Sequelize.STRING,
    allowNull: true,
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
      attributes: ['cusuario', 'xnombre', 'xapellido', 'xlogin', 'xusuario', 'xcorreo', 'xobservacion', 'cdepartamento', 'crol'],
    });
    const info = infoQuery ? infoQuery.get({ plain: true }) : null;
    return info;
  } catch (error) {
    return { error: error.message };
  }
};

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

const createUser = async(createUser) => {
  try{
      let rowsAffected = 0;
      let pool = await sql.connect(sqlConfig);
      let insert = await pool.request()
        .input('u_version', sql.NVarChar, createUser.u_version)
        .input('xnombre', sql.NVarChar, createUser.xnombre)
        .input('xapellido', sql.NVarChar, createUser.xapellido)
        .input('xlogin', sql.NVarChar, createUser.xlogin)
        .input('xcontrasena', sql.NVarChar, createUser.xcontrasena)
        .input('xusuario', sql.NVarChar, createUser.xusuario)
        .input('xobservacion', sql.NVarChar, createUser.xobservacion)
        .input('cdepartamento', sql.Int, createUser.cdepartamento)
        .input('crol', sql.Int, createUser.crol)
        .input('xcorreo', sql.NVarChar, createUser.xcorreo)
        .input('iestado', sql.Char, 'A')
        .input('fingreso', sql.DateTime, new Date())
        .query('insert into seusuariosweb (u_version, xnombre, xapellido, xlogin, xcontrasena, xusuario, xobservacion, cdepartamento, crol, xcorreo, iestado, fingreso) values (@u_version, @xnombre, @xapellido, @xlogin, @xcontrasena, @xusuario, @xobservacion, @cdepartamento, @crol, @xcorreo, @iestado, @fingreso)')        
        rowsAffected = rowsAffected + insert.rowsAffected;
        const create = rowsAffected   
        return create
  }
  catch(err){
      console.log(err.message)
      return { error: err.message };
  }
}

export default {
  searchUser,
  infoUser,
  updateUser,
  createUser
};