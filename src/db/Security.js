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

const DeleteU = sequelize.define('seusuariosweb', {
  cusuario: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  istatus: {
    type: Sequelize.STRING,
    allowNull: true,
  }
}, {
  tableName: 'seusuariosweb',
  timestamps: false, // Agregar esta opción para deshabilitar los timestamps
});

const Departament = sequelize.define('sedepartamento', {}, { tableName: 'sedepartamento' });

const InfoDepartament = sequelize.define('sedepartamento', {
  cdepartamento: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  xdepartamento: {
    type: Sequelize.STRING,
    allowNull: true,
  },
}, {
  tableName: 'sedepartamento',
});

const UpdateDepartament = sequelize.define('sedepartamento', {
  cdepartamento: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  xdepartamento: {
    type: Sequelize.STRING,
    allowNull: true,
  },
}, {
  tableName: 'sedepartamento',
  timestamps: false, // Agregar esta opción para deshabilitar los timestamps
});

const DeleteDep = sequelize.define('sedepartamento', {
  cdepartamento: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  istatus: {
    type: Sequelize.STRING,
    allowNull: true,
  }
}, {
  tableName: 'sedepartamento',
  timestamps: false, // Agregar esta opción para deshabilitar los timestamps
});

const Rol = sequelize.define('seVroles', {});

const InfoRol = sequelize.define('seVroles', {
  crol: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  cdepartamento: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  xdepartamento: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  xrol: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  bcrear: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
  bmodificar: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
  bconsultar: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
  beliminar: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
}, {
  tableName: 'seVroles',
});

const UpdateRol = sequelize.define('serol', {
  crol: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  cdepartamento: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  xrol: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  bcrear: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
  bmodificar: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
  bconsultar: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
  beliminar: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
}, {
  tableName: 'serol',
  timestamps: false, // Agregar esta opción para deshabilitar los timestamps
});

const DeleteRol = sequelize.define('serol', {
  crol: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  istatus: {
    type: Sequelize.STRING,
    allowNull: true,
  }
}, {
  tableName: 'serol',
  timestamps: false, // Agregar esta opción para deshabilitar los timestamps
});

const searchUser = async () => {
  try {
    const user = await User.findAll({
      where: { istatus: 'V' },
      attributes: ['cusuario', 'xnombre', 'xapellido', 'xlogin', ],
    });
    const users = user.map((item) => item.get({ plain: true }));
    return users;
  } catch (error) {
    return { error: error.message, message: 'Ha ocurrido un error al buscar el usuario' };
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
    return { error: error.message, message: 'Ha ocurrido un error al recuperar información del usuario solicitado' };
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
        .input('istatus', sql.Char, 'V')
        .input('fingreso', sql.DateTime, new Date())
        .query('insert into seusuariosweb (u_version, xnombre, xapellido, xlogin, xcontrasena, xusuario, xobservacion, cdepartamento, crol, xcorreo, iestado, fingreso) values (@u_version, @xnombre, @xapellido, @xlogin, @xcontrasena, @xusuario, @xobservacion, @cdepartamento, @crol, @xcorreo, @iestado, @fingreso)')        
        rowsAffected = rowsAffected + insert.rowsAffected;
        const create = rowsAffected   
        return create
  }
  catch(err){
      return { error: err.message, message: 'No se pudo crear el Usuario, por favor revise.' };
  }
}

const deleteUser = async (deleteUser) => {
  const { istatus } = deleteUser;
  try {
    const resultDelete = await DeleteU.update(
      { istatus },
      { where: { cusuario: parseInt(deleteUser.cusuario) } }
    );
    return resultDelete;
  } catch (error) {
    console.log(error);
    return { success: false, message: 'Error al eliminar el usuario', error };
  }
};

const searchDepartament = async () => {
  try {
    const departament = await Departament.findAll({
      where: { istatus: 'V' },
      attributes: ['cdepartamento', 'xdepartamento', 'istatus'],
    });
    const departaments = departament.map((item) => item.get({ plain: true }));
    return departaments;
  } catch (error) {
    console.log(error.message)
    return { error: error.message, message: 'Ha ocurrido un error al buscar el departamento' };
  }
};

const infoDepartament = async (infoDepartament) => {
  try {
    const infoDepQuery = await InfoDepartament.findOne({
      where: {cdepartamento: infoDepartament.cdepartamento},
      attributes: ['xdepartamento'],
    });
    const infoDep = infoDepQuery ? infoDepQuery.get({ plain: true }) : null;
    return infoDep;
  } catch (error) {
    console.log(error.message)
    return { error: error.message, message: 'Ha ocurrido un error al recuperar información del departamento solicitado' };
  }
};

const updateDepartament = async (updateDepartament) => {
  const { xdepartamento } = updateDepartament;
  try {
    const updateDep = await UpdateDepartament.update(
      { xdepartamento },
      { where: { cdepartamento: parseInt(updateDepartament.cdepartamento) } }
    );
    return updateDep;
  } catch (error) {
    console.log(error);
    return { success: false, message: 'Error al actualizar el Departamento', error };
  }
};

const createDepartament = async(createDepartament) => {
  try{
      let rowsAffected = 0;
      let pool = await sql.connect(sqlConfig);
      let insert = await pool.request()
        .input('u_version', sql.NVarChar, createDepartament.u_version)
        .input('xdepartamento', sql.NVarChar, createDepartament.xdepartamento)
        .input('istatus', sql.Char, 'V')
        .input('fingreso', sql.DateTime, new Date())
        .query('insert into sedepartamento (u_version, xdepartamento, istatus, fingreso) values (@u_version, @xdepartamento, @istatus, @fingreso)')        
        rowsAffected = rowsAffected + insert.rowsAffected;
        const createDep = rowsAffected   
        return createDep
  }
  catch(err){
      return { error: err.message, message: 'Error al crear el Departamento, por favor revise.' };
  }
}

const deleteDepartament = async (deleteDepartament) => {
  const { istatus } = deleteDepartament;
  try {
    const resultDeleteDep = await DeleteDep.update(
      { istatus },
      { where: { cdepartamento: parseInt(deleteDepartament.cdepartamento) } }
    );
    return resultDeleteDep;
  } catch (error) {
    console.log(error);
    return { success: false, message: 'Error al eliminar el departamento', error };
  }
};

const searchRol = async () => {
  try {
    const rol = await Rol.findAll({
      where: { istatus: 'V' },
      attributes: ['cdepartamento', 'xdepartamento', 'crol', 'xrol', ],
    });
    const rols = rol.map((item) => item.get({ plain: true }));
    return rols;
  } catch (error) {
    return { error: error.message, message: 'Ha ocurrido un error al buscar el rol' };
  }
};

const infoRol = async (infoRol) => {
  try {
    const infoRolQuery = await InfoRol.findOne({
      where: {crol: infoRol.crol},
      attributes: ['cdepartamento', 'xrol', 'xdepartamento', 'bcrear', 'bmodificar', 'bconsultar', 'beliminar'],
    });
    const infR = infoRolQuery ? infoRolQuery.get({ plain: true }) : null;
    return infR;
  } catch (error) {
    console.log(error.message)
    return { error: error.message, message: 'Ha ocurrido un error al recuperar información del departamento solicitado' };
  }
};

const updateRol = async (updateRol) => {
  const { xrol, cdepartamento, bcrear, bconsultar, bmodificar, beliminar } = updateRol;
  try {
    const updateR = await UpdateRol.update(
      { xrol, cdepartamento, bcrear, bconsultar, bmodificar, beliminar },
      { where: { crol: parseInt(updateRol.crol) } }
    );
    return updateR;
  } catch (error) {
    console.log(error);
    return { success: false, message: 'Error al actualizar el Departamento', error };
  }
};

const createRol = async(createRol) => {
  try{
      let rowsAffected = 0;
      let pool = await sql.connect(sqlConfig);
      let insert = await pool.request()
        .input('u_version', sql.Char, createRol.u_version)
        .input('xrol', sql.NVarChar, createRol.xrol)
        .input('cdepartamento', sql.Int, createRol.cdepartamento)
        .input('bcrear', sql.Bit, createRol.bcrear)
        .input('bmodificar', sql.Bit, createRol.bmodificar)
        .input('bconsultar', sql.Bit, createRol.bconsultar)
        .input('beliminar', sql.Bit, createRol.beliminar)
        .input('istatus', sql.Char, 'V')
        .input('fingreso', sql.DateTime, new Date())
        .query('insert into serol (u_version, xrol, cdepartamento, bcrear, bmodificar, bconsultar, beliminar, istatus, fingreso) values (@u_version, @xrol, @cdepartamento, @bcrear, @bmodificar, @bconsultar, @beliminar, @istatus, @fingreso)')        
        rowsAffected = rowsAffected + insert.rowsAffected;
        const createR = rowsAffected   
        return createR
  }
  catch(err){
      return { error: err.message, message: 'Error al crear el Departamento, por favor revise.' };
  }
}

const deleteRol = async (deleteRol) => {
  const { istatus } = deleteRol;
  try {
    const resultDeleteRol = await DeleteRol.update(
      { istatus },
      { where: { crol: parseInt(deleteRol.crol) } }
    );
    return resultDeleteRol;
  } catch (error) {
    console.log(error);
    return { success: false, message: 'Error al eliminar el departamento', error };
  }
};

export default {
//Usuarios
  searchUser,
  infoUser,
  updateUser,
  createUser,
  deleteUser,

//Departamento
  searchDepartament,
  infoDepartament,
  updateDepartament,
  createDepartament,
  deleteDepartament,

//Roles
  searchRol,
  infoRol,
  updateRol,
  createRol,
  deleteRol
};