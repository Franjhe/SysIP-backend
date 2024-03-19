import quotesService from '../service/quotesService.js';
import PdfPrinter from 'pdfmake';
import nodemailer from 'nodemailer';
import { SMTPClient } from 'emailjs';
import fs from 'fs';
import path from 'path';


const fonts = {
  Roboto: {
    normal: 'node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.ttf',
    bold: 'node_modules/roboto-font/fonts/Roboto/roboto-bold-webfont.ttf',
    italics: 'node_modules/roboto-font/fonts/Roboto/roboto-italic-webfont.ttf',
    bolditalics: 'node_modules/roboto-font/fonts/Roboto/roboto-bolditalic-webfont.ttf'
  }
};

const printer = new PdfPrinter(fonts);

const createQuotes = async (req, res) => {
    const result = await quotesService.createQuotes(req.body);
    if (result.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: result.permissionError
            });
    }
    if (result.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: result.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                list: result
            }
        });
}

const updateQuotes = async (req, res) => {
    const update = await quotesService.updateQuotes(req.body);
    if (update.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: update.permissionError
            });
    }
    if (update.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: update.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                message: "Cotización exitosa"
            }
        });
}

const searchCoverages = async (req, res) => {
    const coverage = await quotesService.searchCoverages();
    if (coverage.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: coverage.permissionError
            });
    }
    if (coverage.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: coverage.error
            });
    }
    const allCoverages = coverage;

    let coverageAmplia = allCoverages.filter(c => ![15, 16, 23, 21, 18, 30].includes(c.ccobertura));
    let coveragePerdida = allCoverages.filter(c => ![13, 14, 29, 21, 18, 30].includes(c.ccobertura));
    let rcv = allCoverages.filter(c => ![13, 14, 15, 16, 17, 18, 20, 21, 23, 29, 30].includes(c.ccobertura));
    let coverages = allCoverages.filter(c => !['T'].includes(c.ititulo));
    let allCoverages2 = coverages.filter(c => ![18, 21, 30, 20].includes(c.ccobertura));
    return res
        .status(200)
        .send({
            status: true,
            data: {
                amplia: coverageAmplia,
                perdida: coveragePerdida,
                rcv: rcv,
                allCoverages: allCoverages2
            }
        });
}

const detailQuotes = async (req, res) => {
    const detail = await quotesService.detailQuotes(req.body);
    if (detail.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: detail.permissionError
            });
    }
    if (detail.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: detail.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                list: detail.result,
                payment: detail.metodology
            }
        });
}

const detailQuotesAutomobile = async (req, res) => {
    const result = await quotesService.detailQuotesAutomobile(req.body);
    if (result.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: result.permissionError
            });
    }
    if (result.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: result.error
            });
    }
    let auto = [];
    for(let i = 0; i < result.length; i++){
        auto.push({
            ccotizacion: result[i].ccotizacion,
            xnombres: result[i].xnombre + ' ' + result[i].xapellido,
            xvehiculo: result[i].xmarca + ' ' + result[i].xmodelo + ' ' + result[i].xversion,
        })
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                auto: auto,
            }
        });
}

const searchQuotes = async (req, res) => {
    const result = await quotesService.searchQuotes(req.body);
    if (result.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: result.permissionError
            });
    }
    if (result.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: result.error
            });
    }
    let quote = []
    for(let i = 0; i < result.length; i++){
        quote.push({
            mtotal_rcv: result[i].mtotal_rcv,
            mtotal_amplia: result[i].mtotal_amplia,
            mtotal_perdida: result[i].mtotal_perdida,
            xplan_rc: result[i].xplan_rc,
            cplan_rc: result[i].cplan_rc,
        })
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                xmarca: result[0].xmarca, 
                xmodelo: result[0].xmodelo,
                xversion: result[0].xversion,
                nombres: result[0].xnombre + ' ' + result[0].xapellido,
                vehiculo: result[0].xmarca + ' ' + result[0].xmodelo + ' ' + result[0].xversion,
                fano: result[0].qano,
                xcorreo: result[0].xcorreo,
                npasajero: result[0].npasajero,
                list: quote,
                xcorredor: result[0].xcorredor,
                xcorreocorredor: result[0].xcorreocorredor,
                xtelefonocorredor: result[0].xtelefonocorredor,
            }
        });
}

const generatePdf = (pdfDefinition) => {
  return new Promise((resolve, reject) => {
    try {
        const fonts = {
            Roboto: {
              normal: 'node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.ttf',
              bold: 'node_modules/roboto-font/fonts/Roboto/roboto-bold-webfont.ttf',
              italics: 'node_modules/roboto-font/fonts/Roboto/roboto-italic-webfont.ttf',
              bolditalics: 'node_modules/roboto-font/fonts/Roboto/roboto-bolditalic-webfont.ttf'
            }
          };
      const printer = new PdfPrinter(fonts); // Crear una instancia de PdfPrinter
      const pdfDoc = printer.createPdfKitDocument(pdfDefinition);
      const chunks = [];

      pdfDoc.on('data', (chunk) => {
        chunks.push(chunk);
      });

      pdfDoc.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const folderPath = 'public/documents';
        const fileName = 'output.pdf';

        // Obtener la ruta del directorio actual
        const currentDirectory = process.cwd();

        const filePath = path.join(currentDirectory, folderPath, fileName);

        // Asegurarse de que el directorio exista antes de escribir el archivo
        if (!fs.existsSync(path.join(currentDirectory, folderPath))) {
          fs.mkdirSync(path.join(currentDirectory, folderPath), { recursive: true });
        }

        fs.writeFileSync(filePath, buffer);
        console.log('PDF generado con éxito en:', filePath);
        resolve(filePath);
      });

      pdfDoc.end();
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      reject(error);
    }
  });
};
  
  const sendEmail = async (req, res) => {
    const to = req.body.to;
    const subject = req.body.subject;
    const text = req.body.text;
    const user = req.body.user;
  
    try {
      // Generar el PDF y obtener el nombre de archivo
      const pdfFileName = await generatePdf(req.body.pdfDefinition);
  
      // Crear instancia del cliente SMTP
      const client = new SMTPClient({
        user: process.env.USER_EMAIL,
        password: process.env.PASS_EMAIL,
        host: 'smtp.gmail.com',
        ssl: true
      });

          // Construir el HTML del correo con el estilo incluido directamente
    const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>La mundial de seguros</title>
        <style>
          @media only screen and (max-width: 620px) {
            table[class=body] h1 {
              font-size: 28px !important;
              margin-bottom: 10px !important;
            }
          
            table[class=body] p,
            table[class=body] ul,
            table[class=body] ol,
            table[class=body] td,
            table[class=body] span,
            table[class=body] a {
              font-size: 16px !important;
            }
          
            table[class=body] .wrapper,
            table[class=body] .article {
              padding: 10px !important;
            }
          
            table[class=body] .content {
              padding: 0 !important;
            }
          
            table[class=body] .container {
              padding: 0 !important;
              width: 100% !important;
            }
          
            table[class=body] .main {
              border-left-width: 0 !important;
              border-radius: 0 !important;
              border-right-width: 0 !important;
            }
          
            table[class=body] .btn table {
              width: 100% !important;
            }
          
            table[class=body] .btn a {
              width: 100% !important;
            }
          
            table[class=body] .img-responsive {
              height: auto !important;
              max-width: 100% !important;
              width: auto !important;
            }
          }
          @media all {
            .ExternalClass {
              width: 100%;
            }
          
            .ExternalClass,
            .ExternalClass p,
            .ExternalClass span,
            .ExternalClass font,
            .ExternalClass td,
            .ExternalClass div {
              line-height: 100%;
            }
          
            .apple-link a {
              color: inherit !important;
              font-family: inherit !important;
              font-size: inherit !important;
              font-weight: inherit !important;
              line-height: inherit !important;
              text-decoration: none !important;
            }
          
            .btn-primary table td:hover {
              background-color: #00439c !important;
            }
          
            .btn-primary a:hover {
              background-color: #00439c !important;
              border-color: #00439c !important;
            }
          }
        </style>
      </head>
      <body class style="background-color: #eaebed; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 0; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="margin-left: auto; margin-right: auto; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; background-color: #eaebed; width: 100%;" width="100%" bgcolor="#eaebed">
      <tr>
        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
        <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; max-width: 580px; padding: 10px; width: 580px; Margin: 0 auto;" width="580" valign="top">
          <div class="header" style="padding: 20px 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-left: auto; margin-right: auto; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; width: 100%;" width="100%">
              <tr>
                <td class="align-center" style="font-family: sans-serif; font-size: 14px; vertical-align: top; text-align: center;" valign="top" align="center">
                  <img src="https://lmportal.lamundialdeseguros.com/lamundialcms/dist/img/logo.png" height="80" alt="Postdrop" style="border: none; -ms-interpolation-mode: bicubic; max-width: 100%; margin: 0;">
                </td>
              </tr>
            </table>
          </div>
          <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 0px;">

            <!-- START CENTERED WHITE CONTAINER -->
            <!-- <span class="preheader">This is preheader text. Some clients will show this text as a preview.</span> -->
            <table role="presentation" class="main" style="margin-left: auto; margin-right: auto; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; width: 100%;" width="100%">

              <!-- START MAIN CONTENT AREA -->
              <tr>
                  
                <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; margin: 0px; padding: 0px; background: #ffffff; border-radius: 3px;" valign="top">
                  <img alt="banner-top" border="0" class="img-responsive" src="https://lmportal.lamundialdeseguros.com/lamundial/images/email-banner-top.jpg" style="border: none; -ms-interpolation-mode: bicubic; max-width: 100%; margin: 0;">  
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-left: auto; margin-right: auto; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; width: 100%;" width="100%">
                    <tr>
                      <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">
                        <h2 style="color: #00224f;text-align: center"> Cotización de Automóvil </h2>
                        <br>
                        <h4 style="color: #616161;text-align: center">¡${user}!</h4>
                        <br>
                        <h4 style="margin-left: 13px">Nos complace presentarle la cotización para el seguro de automóvil proporcionada</h4>
                        <h4 style="margin-left: 13px">por La Mundial de Seguros.</h4>
                        <br>
                        <h4 style="margin-left: 13px">Por favor, revise la información adjunta para obtener detalles adicionales. Si tiene</h4>
                        <h4 style="margin-left: 13px">alguna pregunta o necesita aclaraciones, no dude en ponerse en contacto con</h4>
                        <h4 style="margin-left: 13px">nosotros. Estamos aquí para ayudarle.</h4>
                      </td>
                    </tr>
                  </table>
                  <h1></h1>
                  <img alt="banner-bot" src="https://lmportal.lamundialdeseguros.com/lamundial/images/email-banner-bot.jpg" style="border: none; -ms-interpolation-mode: bicubic; max-width: 100%; margin: 0;">
                </td>
              </tr>

            <!-- END MAIN CONTENT AREA -->
            </table>

            <!-- START FOOTER -->
            <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-left: auto; margin-right: auto; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; width: 100%;" width="100%">
                <tr>
                  <td class="content-block contact" style="vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-family: Lato, Arial, sans-serif, Trebuchet MS; font-size: 14px; line-height: 25px; color: rgb(97, 97, 97); font-weight: 300; text-align: center;" valign="top" align="center">
                    <b>También puede contactarnos a través de las siguientes formas:</b>
                    <br>
                    Telefono: 0500-5526256 | email: info@lamundialdeseguros.com | web: https://lamundialdeseguros.com/.
                  </td>
                </tr>
                <tr>
                  <td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; color: #9a9ea6; font-size: 12px; text-align: center; line-height: 1.5;" valign="top" align="center">
                    <em>
                    Recibiste este correo porque estás registrado en <a href="https://lamundialdeseguros.com" style="color: #9a9ea6; font-size: 12px; text-align: center; text-decoration: underline;">lamundialdeseguros.com.</a>
                    <br>
                      Av. Francisco de Miranda, Centro Lido, Torre B, Piso, 13, Oficina 131B
                    </em>
                  </td>
                </tr>
              </table>
            </div>
            <!-- END FOOTER -->

          <!-- END CENTERED WHITE CONTAINER -->
          </div>
        </td>
        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
      </tr>
    </table>
      </body>
    </html>
  `;
  
      const mensaje = {
        text,
        from: 'La Mundial de Seguros',
        to,
        subject,
        attachment: [
          { data: emailHtml, alternative: true },
          { path: pdfFileName, type: 'application/pdf', name: 'Cotización de Automovil. La Mundial de Seguros.pdf' }
        ]
      };
  
      // Envía el correo electrónico
      await client.send(mensaje);
  
      console.log('Correo electrónico enviado exitosamente.');
      res.status(200).json({ message: 'Correo electrónico enviado exitosamente.' });
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      res.status(500).json({ error: 'Error al enviar el correo electrónico.' });
    }
  };

  const updatePremiums = async (req, res) => {
    const update = await quotesService.updatePremiums(req.body);
    if (update.permissionError) {
        return res
            .status(403)
            .send({
                status: false,
                message: update.permissionError
            });
    }
    if (update.error) {
        return res
            .status(500)
            .send({
                status: false,
                message: update.error
            });
    }
    return res
        .status(200)
        .send({
            status: true,
            data: {
                message: "Se ha actualizado la Cotización exitosamente"
            }
        });
}


export default {
    createQuotes,
    updateQuotes,
    searchCoverages,
    detailQuotes,
    detailQuotesAutomobile,
    searchQuotes,
    sendEmail,
    updatePremiums
}