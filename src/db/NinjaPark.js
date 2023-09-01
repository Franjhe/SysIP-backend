import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import sql from "mssql";
import nodemailer from 'nodemailer';

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

const Search = sequelize.define('np_recibos', {});

const NpVacompanantes = sequelize.define('npVacompanantes', {
  nrofac: {
    type: Sequelize.STRING,
    primaryKey: false,
    allowNull: false,
  },
  cedula: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  nombre_acompa: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  item: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  plan_adquirido: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  mcosto_ext: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  mcosto_local: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

  const createUsersFromNinja = async(createUsersFromNinja) => {
    try{
        let rowsAffected = 0;
        let pool = await sql.connect(sqlConfig);
        let insert = await pool.request()
          .input('tipoid', sql.Char, createUsersFromNinja.data.tipoid)
          .input('cedula', sql.NVarChar, createUsersFromNinja.data.cedula)
          .input('nombApell', sql.NVarChar, createUsersFromNinja.data.nombApell)
          .input('fechanac', sql.NVarChar, createUsersFromNinja.data.fechanac)
          .input('correo', sql.NVarChar, createUsersFromNinja.data.correo)
          .input('nrofac', sql.NVarChar, createUsersFromNinja.data.nrofac)
          .input('cantidad_tickes', sql.SmallInt, createUsersFromNinja.data.cantidad_tickes)
          .input('localidad', sql.NVarChar, createUsersFromNinja.data.localidad)
          .input('plan_adquirido', sql.NVarChar, createUsersFromNinja.data.plan_adquirido)
          .input('fecha_in', sql.NVarChar, createUsersFromNinja.data.fecha_in)
          .input('fecha_out', sql.NVarChar, createUsersFromNinja.data.fecha_out)
          .input('hora_emision', sql.NVarChar, createUsersFromNinja.data.hora_emision)
          .input('fingreso', sql.DateTime, new Date())
          .query('insert into np_recibos (tipoid, cedula, nombApell, fechanac, correo, nrofac, cantidad_tickes, localidad, plan_adquirido, fecha_in, fecha_out, hora_emision, fingreso) values (@tipoid, @cedula, @nombApell, @fechanac, @correo, @nrofac, @cantidad_tickes, @localidad, @plan_adquirido, @fecha_in, @fecha_out, @hora_emision, @fingreso)')  
 
          if(insert.rowsAffected > 0){
            for(let i = 0; i < createUsersFromNinja.acopanantes.length; i++){
              let insert = await pool.request()
                .input('nrofac', sql.NVarChar, createUsersFromNinja.data.nrofac)
                .input('nombre_acompa', sql.NVarChar, createUsersFromNinja.acopanantes[i].nombre_acompa)
                .input('edad', sql.NVarChar, createUsersFromNinja.acopanantes[i].edad)
                .input('cedula', sql.NVarChar, createUsersFromNinja.data.cedula)
                .query('insert into np_acompanantes (nrofac, nombre_acompa, edad, cedula) values (@nrofac, @nombre_acompa, @edad, @cedula)')  
            }
            for(let i = 0; i < createUsersFromNinja.boletos.length; i++){
              let insert = await pool.request()
                .input('nrofac', sql.NVarChar, createUsersFromNinja.data.nrofac)
                .input('cod_prod', sql.NVarChar, createUsersFromNinja.boletos[i].cod_prod)
                .input('nom_prod', sql.NVarChar, createUsersFromNinja.boletos[i].nom_prod)
                .input('cant_prod', sql.Int, parseInt(createUsersFromNinja.boletos[i].cant_prod))
                .input('plan_seguro', sql.NVarChar, createUsersFromNinja.boletos[i].plan_seguro)
                .input('uso_futuro', sql.NVarChar, createUsersFromNinja.boletos[i].uso_futuro)
                .input('cedula', sql.NVarChar, createUsersFromNinja.data.cedula)
                .query('insert into np_boletos (nrofac, cod_prod, nom_prod, cant_prod, plan_seguro, uso_futuro, cedula) values (@nrofac, @cod_prod, @nom_prod, @cant_prod, @plan_seguro, @uso_futuro, @cedula)')  
            }

          }

          let sendmail = await insert

          function generateTableHtml() {
            let tableHtml = 
            `

<!doctype html>
<html lang="en-US">

    <head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <title>New Account Email Template</title>
        <meta name="description" content="New Account Email Template.">

        <style type="text/css">
            a:hover {text-decoration: underline !important;}
        </style>

    </head>

    <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
        <!-- 100% body table -->
        <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
            style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
            <tr>
                <td>
                    <table style="background-color: #f2f3f8; max-width:670px; margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                    <tr>
                    <td style="height:80px;">&nbsp;</td>
                    </tr>
                    <tr>
                    <td style="text-align:center;">
                    <a href="https://lamundialdeseguros.com/" title="La Mundial de Seguros" target="_blank">
                    <img src="https://lamundialdeseguros.com/wp-content/uploads/2022/06/Logotipo-La-Mundial-RGB-3.png" title="La Mundial de Seguros" alt="La Mundial de Seguros">
                    </a>
                    </td>
                    </tr>
                    <tr>
                    <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                            style="max-width:670px; background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">
                                    <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Plan Contradato
                                    </h1>
                                    <p style="font-size:15px; color:#455056; margin:8px 0 0; line-height:24px;">
                                    Ofrecemos las siguientes coberturas por niño <strong>durante el uso del parque:<strong>

                                    <br>
                                    <strong>
                                    ° Muerte Accidental <br>
                                    ° Invalidez Total <br>
                                    ° Gastos médicos y de farmacia <br>
                                    ° Atención Médica en sitio y traslado en ambulancia<br></p>
                                    <p style="color:#455056; font-size:18px;line-height:20px; margin:0; font-weight: 500;">
                                    Responsable :
                                    </strong> ${createUsersFromNinja.data.nombApell} titular ${createUsersFromNinja.data.cedula} 
                                    <br>
                                    
                          
    
                                    </p>
                                    <span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>

                                    <p style="color:#455056; font-size:18px;line-height:20px; margin:0; font-weight: 500;">

                                    <strong  style="display: block;font-size: 13px; margin: 0 0 4px; color:rgba(0,0,0,.64); font-weight:normal;">Usuarios: </strong>


                                    </p>

                                    `
                                    for (let i = 0; i < createUsersFromNinja.acopanantes.length; i++) {

                                    tableHtml += `

                                    <p style="color:#455056; font-size:18px;line-height:20px; margin:0; font-weight: 500;">

                                    <strong  style="display: block;font-size: 13px; margin: 0 0 4px; color:rgba(0,0,0,.64); font-weight:normal;"> ${createUsersFromNinja.acopanantes[i].nombre_acompa} </strong>

                                    </p>
                                    `;
                                    }

                                    tableHtml += `
                                    <br> <a style="background:#323cf4;text-decoration:none !important; display:inline-block; font-weight:500; margin-top:24px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">
                                    Disfrute sus atracciones</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                        <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>https://lamundialdeseguros.com/</strong> </p>
                    </td>
                    </tr>
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                    </table>
                </td>
            </tr>
        </table>
        <!--/100% body table-->
    </body>

</html>
            `
            ;
          
            return tableHtml;
          }

          let np_acompanantes = generateTableHtml()
          if(sendmail){
            let transporter = nodemailer.createTransport({
              host:'mail.lamundialdeseguros.com',
              port:25,
              secure:true,
              auth: {
                user: 'info@lamundialdeseguros.com',
                pass: 'Zxc2020*'
              }
            });
          
            let mailOptions = {
              from: 'La mundial de Seguros',
              to: createUsersFromNinja.data.correo,
              // 'Marvin.vargas@ninjapark.com'
              cc: 'faraujo@compuamerica.com.ve',
              subject: '¡Bienvenido a La Mundial de Seguro!',
              html: np_acompanantes,
            };
            
            transporter.sendMail(mailOptions, function(error, info) {
              if (error) {
                console.log('Error al enviar el correo:', error);
              } else {
                console.log('Correo enviado correctamente:', info.response);
                return {status: true}
              }
            });
          }


          const createUN = rowsAffected   
          return createUN
    }
    catch(err){
      console.log(err.message)
        return { error: err.message, message: 'Error al crear el Usuario, por favor revise.' };
    }
  }

  const searchUsersFromNinja = async (searchUsersFromNinja) => {
    try {
      const searchNinja = await Search.findAll({
        attributes: ['tipoid', 'cedula', 'nombApell', 'fechanac', 'correo', 'nrofac', 'cantidad_tickes',
        'localidad', 'mcosto_ext', 'fingreso', 'fecha_out', 'hora_emision'],
        where: {
          plan_adquirido: searchUsersFromNinja.plan_adquirido
        },
      });
      const search = searchNinja.map((item) => item.get({ plain: true }));
      return search;
    } catch (error) {
      return { error: error.message };
    }
  };

  const detailUsersFromNinja = async (detailUsersFromNinja) => {
    try {
      const uniqueCompanions = await NpVacompanantes.findAll({
        attributes: [
          'nombre_acompa',
          [Sequelize.fn('MAX', Sequelize.col('cod_prod')), 'cod_prod'],
          [Sequelize.fn('MAX', Sequelize.col('nom_prod')), 'nom_prod'],
          [Sequelize.fn('MAX', Sequelize.col('cant_prod')), 'cant_prod'],
          [Sequelize.fn('MAX', Sequelize.col('plan_seguro')), 'plan_seguro'],
          [Sequelize.fn('MAX', Sequelize.col('mcosto_ext')), 'mcosto_ext'],
          [Sequelize.fn('MAX', Sequelize.col('mcosto_local')), 'mcosto_local']
        ],
        where: {
          cedula: detailUsersFromNinja.cedula
        },
        group: ['nombre_acompa'],
        raw: true,
      });
  
      const detail = uniqueCompanions.map((item) => item);
      return detail;
    } catch (error) {
      return { error: error.message };
    }
  };

export default {
    createUsersFromNinja,
    searchUsersFromNinja,
    detailUsersFromNinja
};