import quotesService from '../service/quotesService.js';
import PdfPrinter from 'pdfmake';
import nodemailer from 'nodemailer';
import { SMTPClient } from 'emailjs';
import fs from 'fs';

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
    const result = await quotesService.detailQuotesAutomobile();
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
                list: quote
            }
        });
}

const generatePdf = (pdfDefinition) => {
    return new Promise((resolve, reject) => {
      try {
        const pdfDoc = printer.createPdfKitDocument(pdfDefinition);
        const chunks = [];
  
        pdfDoc.on('data', (chunk) => {
          chunks.push(chunk);
        });
  
        pdfDoc.on('end', () => {
          const buffer = Buffer.concat(chunks);
          const fileName = 'output.pdf';
          fs.writeFileSync(fileName, buffer);
          console.log('PDF generado con éxito.');
          resolve(fileName);
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
  
      const pdfFileName = await generatePdf(req.body.pdfDefinition);

      const client = new SMTPClient({
        user: 'alenjhon9@gmail.com',
        password: 'nnvwygxnvdpjegbj',
        host: 'smtp.gmail.com',
        ssl: true
      });
    
      // Detalles del correo electrónico
      const mensaje = {
        text,
        from: 'alenjhon9@gmail.com',
        to,
        subject,
        attachments: [
          {
            path: pdfFileName,
            name: 'Cotización.pdf',
            type: 'application/pdf',
            encoding: 'base64'
          }
        ]
      };
    
      try {
        // Envía el correo electrónico
        await client.send(mensaje);
    
        console.log('Correo electrónico enviado exitosamente.');
        res.status(200).json({ message: 'Correo electrónico enviado exitosamente.' });
      } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ error: 'Error al enviar el correo electrónico.' });
      }
  };


export default {
    createQuotes,
    updateQuotes,
    searchCoverages,
    detailQuotes,
    detailQuotesAutomobile,
    searchQuotes,
    sendEmail
}