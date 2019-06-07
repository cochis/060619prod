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
class UnidadesController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const unidades = yield database_1.default.query('SELECT * FROM unidades');
            res.json(unidades);
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const unidad = yield database_1.default.query('SELECT * FROM unidades WHERE idUnidad = ?', [id]);
            if (unidad.length > 0) {
                return res.json(unidad[0]);
            }
            res.status(404).json({ text: "La unidad no existe." });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //SETEAMOS USUARIO PARA HACER LA BUSQUEDA POR USUARIO
            const nombre = req.body.nombre;
            const clvUnidad = req.body.clvUnidad;
            //SETEAMOS clvEmpleado PARA HACER LA BUSQUEDA POR CLAVE DE EMPLEADO
            req.body.fechaCreacion = Date.now();
            if (req.body.nombre == null ||
                req.body.clvUnidad == null ||
                req.body.placa == null ||
                req.body.economico == null ||
                req.body.marca == null ||
                req.body.modelo == null ||
                req.body.tipo == null) {
                return res.status(200).send({ error: 'Envía los campos requeridos.' });
            }
            req.body.nombre = req.body.nombre.toUpperCase();
            req.body.clvUnidad = req.body.clvUnidad.toUpperCase();
            req.body.activo = true;
            var unidad = yield database_1.default.query('SELECT * FROM unidades WHERE nombre = ?', [nombre]);
            if (unidad.length > 0) {
                return res.status(200).send({ error: 'Ya existe una unidad con ese nombre. ' });
            }
            else {
                if (clvUnidad.length < 5 || clvUnidad.length > 5) {
                    return res.status(200).send({ error: 'Clave de unidad no valida. ' });
                }
                else {
                    var unidad2 = yield database_1.default.query('SELECT * FROM unidades WHERE clvUnidad = ?', [clvUnidad]);
                    if (unidad2.length > 0) {
                        return res.status(200).send({ error: 'Ya existe un unidad con esa clave de unidad. ' });
                    }
                    else {
                        const result = yield database_1.default.query('INSERT INTO unidades  set ?', [req.body]);
                        res.json({ message: 'Nueva unidad guardada' });
                    }
                }
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const oldUnidad = req.body;
            if (req.body.nombre == null || req.body.clvUnidad == null || req.body.nombre == "" || req.body.clvUnidad == "") {
                return res.status(200).send({ error: 'Verifique los campos. ' });
            }
            if (req.body.clvUnidad.length != 5) {
                return res.status(200).send({ error: 'Clave de unidad no valida. ' });
            }
            var validaUnidad = yield database_1.default.query('SELECT * FROM unidades WHERE nombre = ?', [req.body.nombre]);
            if (validaUnidad.length > 0) {
                return res.status(200).send({ error: 'Ya existe una unidad con ese nombre. ' });
            }
            validaUnidad = yield database_1.default.query('SELECT * FROM unidades WHERE clvUnidad = ?', [req.body.clvUnidad]);
            if (validaUnidad.length > 0) {
                return res.status(200).send({ error: 'Ya existe una unidad con esa clave de unidad. ' });
            }
            var updateUnidad = yield database_1.default.query('UPDATE unidades set ? WHERE idUnidad = ?', [req.body, id]);
            if (updateUnidad.affectedRows <= 0) {
                res.json({ error: "No se pudo localizar la unidad" });
            }
            else {
                res.json({ message: "La unidad fue actualizada" });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            req.body.activo = false;
            const oldUnidad = req.body;
            var updateUnidad = yield database_1.default.query('UPDATE unidades set ? WHERE idUnidad = ?', [req.body, id]);
            if (updateUnidad.affectedRows <= 0) {
                res.json({ error: "No se pudo localizar la unidad" });
            }
            else {
                res.json({ message: "la unidad fue actualizada" });
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
const unidadesController = new UnidadesController;
exports.default = unidadesController;
