"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
// import { exists } from 'fs';
const moment_1 = __importDefault(require("moment"));
var now = moment_1.default().format('YYYY-MM-DD HH:mm:ss');
var bcript = require('bcrypt-nodejs');
var fs = require('fs');
var jwt = require('../services/jwt');
var path = require('path');
var nodemailer = require('nodemailer');
class ContactoController {
    sendMail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            // if (req.body.nombre && req.body.correo && req.body.mensaje) {
            //     res.json({ error: "No se enviar tu contacto" });
            // } else {
            const result = yield database_1.default.query('INSERT INTO contacto  set ?', [req.body]);
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
            transporter.sendMail(HelperOptions, (error, info) => {
                if (error) {
                    res.send(error);
                }
                else {
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
        });
    }
}
const contactoController = new ContactoController;
exports.default = contactoController;
