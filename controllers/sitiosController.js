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
var now = moment_1.default().format('YYYY-MM-DD HH:mm:ss');
class SitiosController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const sitios = yield database_1.default.query('SELECT * FROM roles');
            res.json(sitios);
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const rol = yield database_1.default.query('SELECT * FROM sitios WHERE idSitio = ?', [id]);
            if (rol.length > 0) {
                return res.json(rol[0]);
            }
            res.status(404).json({ text: "El sitio no existe" });
        });
    }
    getOneByLocalidad(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { clvLocalidad } = req.params;
            const rol = yield database_1.default.query('SELECT * FROM sitios WHERE clvLocalidad = ?', [clvLocalidad]);
            if (rol.length > 0) {
                return res.json(rol[0]);
            }
            res.status(404).json({ text: "El sitio no existe" });
        });
    }
    getOneBySitio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { clvSitio } = req.params;
            const rol = yield database_1.default.query('SELECT * FROM sitios WHERE clvSitio = ?', [clvSitio]);
            if (rol.length > 0) {
                return res.json(rol[0]);
            }
            res.status(404).json({ text: "El sitio no existe" });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const nombre = req.body.nombre;
            const clvSitio = req.body.clvSitio;
            const clvLocalidad = req.body.clvLocalidad;
            //SETEAMOS clvEmpleado PARA HACER LA BUSQUEDA POR CLAVE DE EMPLEADO
            req.body.fechaCreacion = now;
            req.body.activo = true;
            console.log(req.body);
            if (req.body.nombre == null ||
                req.body.clvSitio == null ||
                req.body.clvLocalidad == null) {
                return res.status(200).send({ error: 'Envía los campos requeridos.' });
            }
            req.body.nombre = MaysPrimera(req.body.nombre);
            req.body.activo = true;
            var sitio = yield database_1.default.query('SELECT * FROM sitios WHERE nombre = ?', [nombre]);
            if (sitio.length > 0) {
                return res.status(200).send({ error: 'Ya existe un sitio con ese nombre. ' });
            }
            else {
                if (clvSitio.length < 5 || clvSitio.length > 5) {
                    return res.status(200).send({ error: 'Clave de sitio no valida. ' });
                }
                else {
                    var sitio2 = yield database_1.default.query('SELECT * FROM sitios WHERE clvSitio = ?', [clvSitio]);
                    if (sitio2.length > 0) {
                        return res.status(200).send({ error: 'Ya existe un sitio con esa clave de sitio. ' });
                    }
                    else {
                        const result = yield database_1.default.query('INSERT INTO sitios  set ?', [req.body]);
                        res.json({ message: 'Nuevo sitio guardado' });
                    }
                }
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const oldSitio = req.body;
            if (req.body.nombre == null || req.body.clvSitio == null || req.body.nombre == "" || req.body.clvLocalidad == "") {
                return res.status(200).send({ error: 'Verifique los campos. ' });
            }
            if (req.body.clvSitio.length != 5) {
                return res.status(200).send({ error: 'Clave de sitio no valida. ' });
            }
            var updateSitio = yield database_1.default.query('UPDATE sitios set ? WHERE idSitio = ?', [req.body, id]);
            if (updateSitio.affectedRows <= 0) {
                res.json({ error: "No se pudo localizar el Sitio" });
            }
            else {
                res.json({ message: "El sitio fue actualizado" });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            req.body.activo = false;
            const oldSitio = req.body;
            var updateSitio = yield database_1.default.query('UPDATE sitios set ? WHERE idSitio = ?', [req.body, id]);
            if (updateSitio.affectedRows <= 0) {
                res.json({ error: "No se pudo localizar el sitio" });
            }
            else {
                res.json({ message: "El sitio fue actualizado" });
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
const sitiosController = new SitiosController;
exports.default = sitiosController;
