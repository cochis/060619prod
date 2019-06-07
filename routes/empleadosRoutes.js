"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const empleadosController_1 = __importDefault(require("../controllers/empleadosController"));
var md_auth = require('../middlewares/authenticated');
class EmpleadosRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        // Servicio de Login
        this.router.post('/login', empleadosController_1.default.login);
        this.router.post('/', empleadosController_1.default.create);
        this.router.post('/restore/', empleadosController_1.default.restore);
        this.router.get('/emple', empleadosController_1.default.list);
        this.router.get('/:clvEmpleado', md_auth.ensureAuth, empleadosController_1.default.getOne);
        this.router.post('/', md_auth.ensureAuth, empleadosController_1.default.create);
        this.router.put('/:clvEmpleado', md_auth.ensureAuth, empleadosController_1.default.update);
        this.router.put('/desactivar/:clvEmpleado', md_auth.ensureAuth, empleadosController_1.default.delete);
        this.router.put('/activar/:clvEmpleado', md_auth.ensureAuth, empleadosController_1.default.activate);
        this.router.put('/salida/:clvEmpleado', md_auth.ensureAuth, empleadosController_1.default.salida);
        this.router.put('/token/:clvEmpleado', md_auth.ensureAuth, empleadosController_1.default.saveToken);
        this.router.put('/token/:clvEmpleado', md_auth.ensureAuth, empleadosController_1.default.saveToken);
        this.router.get('/busqueda/:clv', md_auth.ensureAuth, empleadosController_1.default.getCountClv);
    }
}
exports.default = new EmpleadosRoutes().router;
