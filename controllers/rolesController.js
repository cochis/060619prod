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
class RolesController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const roles = yield database_1.default.query('SELECT * FROM roles');
            res.json(roles);
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { clvRol } = req.params;
            const rol = yield database_1.default.query('SELECT * FROM roles WHERE clvRol = ?', [clvRol]);
            if (rol.length > 0) {
                return res.json(rol[0]);
            }
            res.status(404).json({ text: "El rol no existe" });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //SETEAMOS USUARIO PARA HACER LA BUSQUEDA POR USUARIO
            const nombre = req.body.nombre;
            const clvRol = req.body.clvRol;
            req.body.fechaCreacion = moment_1.default().format('YYYY-MM-DD HH:mm:ss');
            req.body.ultimaActualizacion = moment_1.default().format('YYYY-MM-DD HH:mm:ss');
            req.body.activo = true;
            if (req.body.nombre == null ||
                req.body.clvRol == null) {
                return res.status(200).send({ error: 'Envía los campos requeridos.' });
            }
            req.body.nombre = MaysPrimera(req.body.nombre);
            req.body.clvRol = req.body.clvRol;
            req.body.activo = true;
            var rol = yield database_1.default.query('SELECT * FROM roles WHERE nombre = ?', [nombre]);
            if (rol.length > 0) {
                return res.status(200).send({ error: 'Ya existe un rol con ese nombre. ' });
            }
            else {
                if (clvRol.length < 5 || clvRol.length > 5) {
                    return res.status(200).send({ error: 'Clave de rol no valida. ' });
                }
                else {
                    var rol2 = yield database_1.default.query('SELECT * FROM roles WHERE clvRol = ?', [clvRol]);
                    if (rol2.length > 0) {
                        return res.status(200).send({ error: 'Ya existe un rol con esa clave de rol. ' });
                    }
                    else {
                        const result = yield database_1.default.query('INSERT INTO roles  set ?', [req.body]);
                        res.json({ message: 'Nuevo rol guardado' });
                    }
                }
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { clvRol } = req.params;
            console.log(req.params);
            const oldRol = req.body;
            // req.body.nombre = cleanString(req.body.nombre);
            // req.body.clvRol = cleanString(req.body.clvRol );
            req.body.ultimaActualizacion = moment_1.default().format('YYYY-MM-DD HH:mm:ss');
            if (req.body.nombre == null || req.body.clvRol == null || req.body.nombre == "" || req.body.clvRol == "") {
                return res.status(200).send({ error: 'Verifique los campos. ' });
            }
            if (clvRol.length != 5) {
                return res.status(200).send({ error: 'Clave de rol no valida. ' });
            }
            var updateRol = yield database_1.default.query('UPDATE roles set ? WHERE clvRol = ?', [req.body, clvRol]);
            if (updateRol.affectedRows <= 0) {
                res.json({ error: "No se pudo localizar el Rol" });
            }
            else {
                res.json({ message: "El rol fue actualizado" });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { clvRol } = req.params;
            req.body.activo = false;
            req.body.ultimaActualizacion = moment_1.default().format('YYYY-MM-DD HH:mm:ss');
            const oldRol = req.body;
            var updateRol = yield database_1.default.query('UPDATE roles set ? WHERE clvRol = ?', [req.body, clvRol]);
            if (updateRol.affectedRows <= 0) {
                res.json({ error: "No se pudo localizar el rol" });
            }
            else {
                res.json({ message: "El rol fue actualizado" });
            }
        });
    }
    activated(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { clvRol } = req.params;
            req.body.activo = true;
            req.body.ultimaActualizacion = moment_1.default().format('YYYY-MM-DD HH:mm:ss');
            const oldRol = req.body;
            var updateRol = yield database_1.default.query('UPDATE roles set ? WHERE clvRol = ?', [req.body, clvRol]);
            if (updateRol.affectedRows <= 0) {
                res.json({ error: "No se pudo localizar el rol" });
            }
            else {
                res.json({ message: "El rol fue actualizado" });
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
function cleanString(string) {
    string = string.trim();
    return string;
}
const rolesController = new RolesController;
exports.default = rolesController;
