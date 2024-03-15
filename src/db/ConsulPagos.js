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

const createUsersFromConsulPagos = async(createUsersFromConsulPagos,bcv) => {
    try{
        let rowsAffected = 0;
        let pool = await sql.connect(sqlConfig);
        let insert = await pool.request()
        .input('id_compra', sql.Numeric(18, 0), createUsersFromConsulPagos.data.id_compra)
        .input('fregistro', sql.DateTime, createUsersFromConsulPagos.data.fregistro)
        .input('producto', sql.NVarChar, createUsersFromConsulPagos.data.producto)
        .input('poliza', sql.NVarChar, createUsersFromConsulPagos.data.poliza)
        .input('cobertura', sql.NVarChar, createUsersFromConsulPagos.data.cobertura)
        .input('tipo_doc', sql.Char, createUsersFromConsulPagos.data.tipo_doc)
        .input('doc_identidad', sql.Numeric(22, 0), createUsersFromConsulPagos.data.doc_identidad)
        .input('nombre', sql.NVarChar, createUsersFromConsulPagos.data.nombre)
        .input('apellido', sql.NVarChar, createUsersFromConsulPagos.data.apellido)
        .input('estado', sql.NVarChar, createUsersFromConsulPagos.data.estado)
        .input('ciudad', sql.NVarChar, createUsersFromConsulPagos.data.ciudad)
        .input('municipio', sql.NVarChar, createUsersFromConsulPagos.data.municipio)
        .input('direccion', sql.NVarChar, createUsersFromConsulPagos.data.direccion)
        .input('fnacimiento', sql.DateTime, createUsersFromConsulPagos.data.fnacimiento)
        .input('sexo', sql.Char, createUsersFromConsulPagos.data.sexo)
        .input('telefono', sql.NVarChar, createUsersFromConsulPagos.data.telefono)
        .input('correo', sql.NVarChar, createUsersFromConsulPagos.data.correo)
        .input('tipo_pago', sql.NVarChar, createUsersFromConsulPagos.data.tipo_pago)
        .input('banco', sql.Int, createUsersFromConsulPagos.data.banco)
        .input('telefono_pagador', sql.NVarChar, createUsersFromConsulPagos.data.telefono_pagador)
        .input('tipo_doc_pagador', sql.Char, createUsersFromConsulPagos.data.tipo_doc_pagador)
        .input('doc_identidad_pagador', sql.Numeric(22, 0), createUsersFromConsulPagos.data.doc_identidad_pagador)
        .input('sumaaseg', sql.Numeric(18, 2), createUsersFromConsulPagos.data.sumaaseg)
        .input('prima', sql.Numeric(18, 2), createUsersFromConsulPagos.data.prima)
        .input('referencia', sql.Int, createUsersFromConsulPagos.data.referencia)
        .input('marca', sql.NVarChar, createUsersFromConsulPagos.data.marca)
        .input('modelo', sql.NVarChar, createUsersFromConsulPagos.data.modelo)
        .input('version', sql.NVarChar, createUsersFromConsulPagos.data.version)
        .input('tipo', sql.NVarChar, createUsersFromConsulPagos.data.tipo)
        .input('cano', sql.Int, createUsersFromConsulPagos.data.cano)
        .input('placa', sql.NVarChar, createUsersFromConsulPagos.data.placa)
        .input('serial_carroceria', sql.NVarChar, createUsersFromConsulPagos.data.serial_carroceria)
        .input('serial_motor', sql.NVarChar, createUsersFromConsulPagos.data.serial_motor)
        .input('color', sql.NVarChar, createUsersFromConsulPagos.data.color)
        .input('vendedor', sql.Int, createUsersFromConsulPagos.data.vendedor)
        .input('tipo_doc_vendedor', sql.Char, createUsersFromConsulPagos.data.tipo_doc_vendedor)
        .input('doc_identidad_vendedor', sql.Numeric(22, 0), createUsersFromConsulPagos.data.doc_identidad_vendedor)
        .input('telefono_vendedor', sql.NVarChar, createUsersFromConsulPagos.data.telefono_vendedor)
        .input('correo_vendedor', sql.NVarChar, createUsersFromConsulPagos.data.correo_vendedor)
        .input('cplan_rc', sql.Int, createUsersFromConsulPagos.data.cplan_rc)
        .input('fcobro', sql.DateTime, createUsersFromConsulPagos.data.fcobro)
        .input('femision', sql.DateTime, createUsersFromConsulPagos.data.femision)
        .input('ptasamon', sql.Numeric(18, 2), bcv)
        // .input('fdesde_pol', sql.DateTime, createUsersFromConsulPagos.data.fdesde_pol)
        // .input('fhasta_pol', sql.DateTime, createUsersFromConsulPagos.data.fhasta_pol)
        .query('INSERT INTO eePoliza_ConsulPago (ptasamon,id_compra, fregistro, producto, poliza, cobertura, tipo_doc, doc_identidad, nombre, apellido, estado, ciudad, municipio, direccion, fnacimiento, sexo, telefono, correo, tipo_pago, banco, telefono_pagador, tipo_doc_pagador, doc_identidad_pagador, sumaaseg, prima, referencia, marca, modelo, version, tipo, cano, placa, serial_carroceria, serial_motor, color, vendedor, tipo_doc_vendedor, doc_identidad_vendedor, telefono_vendedor, correo_vendedor, cplan_rc,fcobro,femision) VALUES (@ptasamon,@id_compra, @fregistro, @producto, @poliza, @cobertura, @tipo_doc, @doc_identidad, @nombre, @apellido, @estado, @ciudad, @municipio, @direccion, @fnacimiento, @sexo, @telefono, @correo, @tipo_pago, @banco, @telefono_pagador, @tipo_doc_pagador, @doc_identidad_pagador, @sumaaseg, @prima, @referencia, @marca, @modelo, @version, @tipo, @cano, @placa, @serial_carroceria, @serial_motor, @color, @vendedor, @tipo_doc_vendedor, @doc_identidad_vendedor, @telefono_vendedor, @correo_vendedor, @cplan_rc,@fcobro,@femision)')

        rowsAffected = rowsAffected + insert.rowsAffected;
        const createCP = rowsAffected   
        return createCP
    }
    catch(err){
        return { error: err.message, message: 'No se pudo crear el Usuario, por favor revise.' };
    }
  }

  export default {
    createUsersFromConsulPagos
  }