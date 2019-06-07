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
const moment_1 = __importDefault(require("moment"));
var jwt = require('../services/jwt');
class LoginEmpleadosController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const login = yield database_1.default.query('SELECT * FROM loginEmpleados');
            res.json(login);
        });
    }
    getOneById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const login = yield database_1.default.query('SELECT COUNT FROM loginEmpleados WHERE idLogin = ? ORDER by idLogin DESC LIMIT 1 ', [id]);
            if (login.length > 0) {
                return res.json(login[0]);
            }
            res.status(404).json({ text: "No hay registros de login con ese id" });
        });
    }
    getOneByClv(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { clvEmpleado } = req.params;
            const login = yield database_1.default.query('SELECT * FROM loginEmpleados WHERE clvEmpleado = ?  ORDER by idLogin DESC LIMIT 1', [clvEmpleado]);
            if (login.length > 0) {
                return res.json(login[0]);
            }
            res.status(404).json({ text: "No hay registros de login con esa clave" });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            req.body.fechaLogin = moment_1.default().format('YYYY-MM-DD HH:mm:ss');
            ;
            var save = {
                clvEmpleado: req.body.clvEmpleado,
                fechaLogin: moment_1.default().format('YYYY-MM-DD HH:mm:ss'),
                fechaClose: null,
                token: jwt.createToken(req.body)
            };
            const loginEmpleado = yield database_1.default.query('INSERT INTO loginEmpleados  set ?', [save]);
            res.json({ message: "El LoginEmpleado fue creado" });
        });
    }
    closeLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { clvEmpleado } = req.params;
            req.body.fechaLogin = moment_1.default().format('YYYY-MM-DD HH:mm:ss');
            ;
            // console.log('entro a close');
            // console.log(req.body);
            // console.log(req.params);
            var save = {
                clvEmpleado: req.body.clvEmpleado,
                fechaClose: moment_1.default().format('YYYY-MM-DD HH:mm:ss'),
                token: jwt.createToken(req.body)
            };
            // console.log(save);
            const loginEmpleado = yield database_1.default.query('UPDATE loginEmpleados set ?  WHERE clvEmpleado = ? AND fechaClose IS NULL ORDER by idLogin DESC LIMIT 1 ', [save, clvEmpleado]);
            // console.log(loginEmpleado);
            if (loginEmpleado.affectedRows <= 0) {
                res.json({ error: "No se pudo localizar el Sitio" });
            }
            else {
                res.json({ message: "El sitio fue actualizado" });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (req.body.fechaSalida = 1) {
                req.body.fechaClose = moment_1.default().format('YYYY-MM-DD HH:mm:ss');
                ;
                req.body.fechaSalida = null;
            }
            var updateLoginEmpleado = yield database_1.default.query('UPDATE loginEmpleados set ? WHERE idLogin = ? AND fechaClose IS NULL ORDER by idLogin DESC LIMIT 1', [req.body, id]);
            if (updateLoginEmpleado.affectedRows <= 0) {
                res.json({ error: "No se pudo localizar el Sitio" });
            }
            else {
                res.json({ message: "El sitio fue actualizado" });
            }
        });
    }
}
const loginEmpleadosController = new LoginEmpleadosController;
exports.default = loginEmpleadosController;
