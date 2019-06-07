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
class LocalidadesController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const localidades = yield database_1.default.query('SELECT * FROM localidades');
            res.json(localidades);
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const rol = yield database_1.default.query('SELECT * FROM localidades WHERE idLocalidad = ?', [id]);
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
            //SETEAMOS clvEmpleado PARA HACER LA BUSQUEDA POR CLAVE DE EMPLEADO
            req.body.fechaCreacion = Date.now();
            req.body.activo = true;
            if (req.body.nombre == null ||
                req.body.clvRol == null) {
                return res.status(200).send({ error: 'Envía los campos requeridos.' });
            }
            req.body.nombre = MaysPrimera(req.body.nombre);
            req.body.clvRol = req.body.clvRol;
            req.body.activo = true;
            var rol = yield database_1.default.query('SELECT * FROM localidades WHERE nombre = ?', [nombre]);
            if (rol.length > 0) {
                return res.status(200).send({ error: 'Ya existe un rol con ese nombre. ' });
            }
            else {
                if (clvRol.length < 5 || clvRol.length > 5) {
                    return res.status(200).send({ error: 'Clave de rol no valida. ' });
                }
                else {
                    var rol2 = yield database_1.default.query('SELECT * FROM localidades WHERE clvRol = ?', [clvRol]);
                    if (rol2.length > 0) {
                        return res.status(200).send({ error: 'Ya existe un rol con esa clave de rol. ' });
                    }
                    else {
                        const result = yield database_1.default.query('INSERT INTO localidades  set ?', [req.body]);
                        res.json({ message: 'Nuevo empleado guardado' });
                    }
                }
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const oldRol = req.body;
            // req.body.nombre = cleanString(req.body.nombre);
            // req.body.clvRol = cleanString(req.body.clvRol );
            if (req.body.nombre == null || req.body.clvRol == null || req.body.nombre == "" || req.body.clvRol == "") {
                return res.status(200).send({ error: 'Verifique los campos. ' });
            }
            if (req.body.clvRol.length != 5) {
                return res.status(200).send({ error: 'Clave de rol no valida. ' });
            }
            var updateLocalidad = yield database_1.default.query('UPDATE localidades set ? WHERE idLocalidad = ?', [req.body, id]);
            if (updateLocalidad.affectedRows <= 0) {
                res.json({ error: "No se pudo localizar el Rol" });
            }
            else {
                res.json({ message: "El rol fue actualizado" });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            req.body.activo = false;
            const oldRol = req.body;
            var updateLocalidad = yield database_1.default.query('UPDATE localidades set ? WHERE idLocalidad = ?', [req.body, id]);
            if (updateLocalidad.affectedRows <= 0) {
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
const localidadesController = new LocalidadesController;
exports.default = localidadesController;
