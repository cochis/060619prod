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
const moment_1 = __importDefault(require("moment"));
const database_1 = __importDefault(require("../database"));
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
class EmpleadosController {
    test(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.status(200).send({ test: 'test' });
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = req.body.usuario;
            const password = req.body.password;
            if (usuario != undefined && password != undefined) {
                const empleado = yield database_1.default.query('SELECT * FROM empleados WHERE usuario = ?', [usuario]);
                if (empleado.length > 0) {
                    if (bcrypt.compareSync(req.body.password, empleado[0].password)) {
                        empleado[0].password = undefined;
                        const loginEmpleado = yield database_1.default.query('SELECT * FROM loginEmpleados WHERE clvEmpleado = ? AND fechaClose IS NULL ORDER by idLogin DESC LIMIT 1', [empleado[0].clvEmpleado]);
                        if (loginEmpleado.length > 0) {
                            return res.status(200).send({ error: 'LG0003' });
                        }
                        else {
                            return res.json(empleado[0]);
                        }
                    }
                    else {
                        return res.status(404).send({ error: 'LG0002' });
                    }
                }
                else {
                    return res.status(404).send({ error: 'LG0001' });
                }
            }
            else {
                return res.status(500).send({ error: ' Favor de enviar los datos completos' });
            }
        });
    }
    restore(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = req.body.usuario;
            const password = req.body.password;
            if (usuario != undefined && password != undefined) {
                const empleado = yield database_1.default.query('SELECT * FROM empleados WHERE usuario = ?  ORDER by idEmpleado DESC LIMIT 1', [usuario]);
                if (empleado.length > 0) {
                    var save = {
                        clvEmpleado: empleado[0].clvEmpleado,
                        fechaClose: moment_1.default().format('YYYY-MM-DD HH:mm:ss'),
                        token: jwt.createToken(req.body)
                    };
                    const loginEmpleado = yield database_1.default.query('UPDATE loginEmpleados  set ? WHERE clvEmpleado = ? AND fechaClose IS NULL ORDER by idlogin DESC LIMIT 1 ', [save, empleado[0].clvEmpleado]);
                    return res.json(empleado);
                }
                else {
                    return res.status(404).send({ error: 'LG0001' });
                }
            }
            else {
                return res.status(500).send({ error: ' Favor de enviar los datos completos' });
            }
        });
    }
    obtenerToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginEmpleado = yield database_1.default.query('SELECT * FROM loginEmpleados WHERE clvEmpleado = ? AND fechaClose IS NULL ORDER by idLogin DESC LIMIT 1', req.body.clvEmpleado);
            // var res = loginEmpleado[0].token;
            // res.json(loginEmpleado);
            if (loginEmpleado.length > 0) {
                return res.json(loginEmpleado[0]);
            }
            res.status(404).json({ text: "El empleado no existe" });
        });
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var empleados = yield database_1.default.query('SELECT * FROM empleados');
            // console.log('entro empleados');
            // console.log(req.body);
            // for (var i = 0; i < empleados.length; i++) {
            //     empleados[i]['password'] = undefined;
            // }
            console.log(empleados);
            res.json(empleados);
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { clvEmpleado } = req.params;
            const empleado = yield database_1.default.query('SELECT * FROM empleados WHERE clvEmpleado = ?', [clvEmpleado]);
            if (empleado.length > 0) {
                empleado[0]['password'] = undefined;
                return res.json(empleado[0]);
            }
            res.status(404).json({ text: "El empleado no existe" });
        });
    }
    getCountClv(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { clv } = req.params;
            const clave = yield database_1.default.query('SELECT * FROM empleados where clvEmpleado like %?', [clv]);
            if (clave.length > 0) {
                return res.json(clave);
            }
            res.status(404).json({ text: "El clave no existe" });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = req.body.usuario;
            const clvEmpleado = req.body.clvEmpleado;
            req.body.fechaCreacion = moment_1.default().format('YYYY-MM-DD HH:mm:ss');
            req.body.ultimaActualizacion = moment_1.default().format('YYYY-MM-DD HH:mm:ss');
            if (req.body.nombre == null ||
                req.body.apellidoPaterno == null ||
                req.body.apellidoMaterno == null ||
                req.body.clvEmpleado == null ||
                req.body.usuario == null ||
                req.body.password == null ||
                req.body.rolEmpleado == null) {
                return res.status(200).send({ error: 'Envía los campos requeridos.' });
            }
            req.body.nombre = req.body.nombre.trim();
            req.body.activo = true;
            req.body.fechaSalida = null;
            var name = req.body.nombre;
            var nombre = "";
            var i = 0;
            var pass;
            req.body.nombre = req.body.nombre.trim();
            var name = convertName(req.body.nombre);
            for (var i = 0; i < name.length; i++) {
                if (name[i] != "") {
                    name[i] = MaysPrimera(name[i]);
                    nombre = nombre + name[i] + ' ';
                }
            }
            nombre.trim();
            req.body.nombre = nombre; // A
            req.body.apellidoPaterno = MaysPrimera(req.body.apellidoPaterno);
            req.body.apellidoMaterno = MaysPrimera(req.body.apellidoMaterno);
            req.body.usuario = req.body.usuario.toLowerCase();
            req.body.apellidoPaterno = req.body.apellidoPaterno.trim();
            req.body.apellidoMaterno = req.body.apellidoMaterno.trim();
            req.body.clvEmpleado = req.body.clvEmpleado.trim();
            req.body.usuario = req.body.usuario.trim();
            pass = bcrypt.hashSync(req.body.password);
            req.body.password = pass;
            var empleado = yield database_1.default.query('SELECT * FROM empleados WHERE usuario = ?', [usuario]);
            if (empleado.length > 0) {
                return res.status(200).send({ error: 'Ya existe un empleado con ese usuario. ' });
            }
            else {
                if (clvEmpleado.length < 8 || clvEmpleado.length > 8) {
                    return res.status(200).send({ error: 'Clave de usuario no valida ' });
                }
                else {
                    var empleado2 = yield database_1.default.query('SELECT * FROM empleados WHERE clvEmpleado = ?', [clvEmpleado]);
                    if (empleado2.length > 0) {
                        return res.status(200).send({ error: 'Ya existe un empleado con esa clave de empleado. ' });
                    }
                    else {
                        const result = yield database_1.default.query('INSERT INTO empleados  set ?', [req.body]);
                        res.json({ message: 'Nuevo empleado guardado' });
                    }
                }
            }
        });
    }
    saveToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { clvEmpleado } = req.params;
            const oldEmpleado = req.body;
            req.body.ultimaActualizacion = moment_1.default().format('YYYY-MM-DD HH:mm:ss');
            var updateEmpleado = yield database_1.default.query('UPDATE empleados set ? WHERE clvEmpleado = ?', [req.body.token, clvEmpleado]);
            if (updateEmpleado.affectedRows <= 0) {
                res.json({ error: "No se pudo localizar el empleado" });
            }
            else {
                res.json({ message: "El empleado fue actualizado" });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { clvEmpleado } = req.params;
            const oldEmpleado = req.body;
            req.body.ultimaActualizacion = moment_1.default().format('YYYY-MM-DD HH:mm:ss');
            var updateEmpleado = yield database_1.default.query('UPDATE empleados set ? WHERE clvEmpleado = ?', [req.body, clvEmpleado]);
            if (updateEmpleado.affectedRows <= 0) {
                res.json({ error: "No se pudo localizar el empleado" });
            }
            else {
                res.json({ message: "El empleado fue actualizado" });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { clvEmpleado } = req.params;
            req.body.activo = false;
            const oldEmpleado = req.body;
            req.body.ultimaActualizacion = moment_1.default().format('YYYY-MM-DD HH:mm:ss');
            req.body.fechaSalida = moment_1.default().format('YYYY-MM-DD HH:mm:ss');
            var updateEmpleado = yield database_1.default.query('UPDATE empleados set ? WHERE clvEmpleado = ?', [req.body, clvEmpleado]);
            if (updateEmpleado.affectedRows <= 0) {
                res.json({ error: "No se pudo localizar el empleado" });
            }
            else {
                res.json({ message: "El empleado fue actualizado" });
            }
        });
    }
    salida(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { clvEmpleado } = req.params;
            req.body.activo = false;
            const oldEmpleado = req.body;
            req.body.activo = false;
            req.body.fechaSalida = moment_1.default().format('YYYY-MM-DD HH:mm:ss');
            req.body.ultimaActualizacion = moment_1.default().format('YYYY-MM-DD HH:mm:ss');
            req.body.fechaSalida = moment_1.default().format('YYYY-MM-DD HH:mm:ss');
            var updateEmpleado = yield database_1.default.query('UPDATE empleados set ? WHERE clvEmpleado = ?', [req.body, clvEmpleado]);
            if (updateEmpleado.affectedRows <= 0) {
                res.json({ error: "No se pudo localizar el empleado" });
            }
            else {
                res.json({ message: "El empleado fue actualizado" });
            }
        });
    }
    activate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { clvEmpleado } = req.params;
            req.body.activo = true;
            req.body.fechaSalida = null;
            const oldEmpleado = req.body;
            req.body.ultimaActualizacion = moment_1.default().format('YYYY-MM-DD HH:mm:ss');
            var updateEmpleado = yield database_1.default.query('UPDATE empleados set ? WHERE clvEmpleado = ?', [req.body, clvEmpleado]);
            if (updateEmpleado.affectedRows <= 0) {
                res.json({ error: "No se pudo localizar el empleado" });
            }
            else {
                res.json({ message: "El empleado fue actualizado" });
            }
        });
    }
}
function MaysPrimera(string) {
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function convertName(string) {
    var res = string.split(" ");
    return res;
}
const empleadosController = new EmpleadosController;
exports.default = empleadosController;
