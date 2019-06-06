import { Request, Response, json } from 'express';
import pool from '../database';
// import { exists } from 'fs';
import moment from 'moment';
var now = moment().format('YYYY-MM-DD HH:mm:ss');
var bcript = require('bcrypt-nodejs');
var fs = require('fs');
var jwt = require('../services/jwt');
var path = require('path');
var nodemailer = require('nodemailer');

class ContactoController {

    public async sendMail(req: Request, res: Response): Promise<void> {

        console.log(req.body);

        // if (req.body.nombre && req.body.correo && req.body.mensaje) {
        //     res.json({ error: "No se enviar tu contacto" });
        // } else {
        const result = await pool.query('INSERT INTO contacto  set ?', [req.body]);
        // if (result.length > 0) {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: false,
            port: 25,
            auth: {
                user: 'ing.oarrs@gmail.com',
                pass: '.Yarel20.'
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        let mes = req.body.nombre + '  ' + req.body.correo + ' ' + req.body.telefono + ' ' + req.body.mensaje + ' ';
        let HelperOptions = {
            from: req.body.correo,
            to: 'ing.oarrs@gmail.com , sistemas@ambulanciashumana.com.mx',
            subject: req.body.tema,
            // text: contacto.comentarios
            text: mes

        };
        transporter.sendMail(HelperOptions, (error: any, info: any) => {
            if (error) {

                res.send(error);
            } else {
                res.status(200).send({
                   
                    message: 'Mail enviado'
                });
            }

        });

        console.log(transporter);
        console.log(mes);
        console.log(HelperOptions);

        // } else {
        //     return res.status(204).send({ error: 'No se puede enviar el contacto. ' });
        // }

        // }

    }

}
const contactoController = new ContactoController;
export default contactoController; 
