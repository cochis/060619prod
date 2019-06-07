"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const datosEmpleadoController_1 = __importDefault(require("../controllers/datosEmpleadoController"));
var md_auth = require('../middlewares/authenticated');
class DatosEmpleadoRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    // md_auth.ensureAuth ,
    config() {
        // Servicio de Login
        this.router.get('/datos/', datosEmpleadoController_1.default.list);
        this.router.get('/:clvEmpleado', datosEmpleadoController_1.default.getOne);
        this.router.post('/:clvEmpleado', datosEmpleadoController_1.default.create);
        this.router.put('/:clvEmpleado', datosEmpleadoController_1.default.update);
        this.router.put('/desactivar/:clvEmpleado', datosEmpleadoController_1.default.delete);
        this.router.put('/activar/:clvEmpleado', datosEmpleadoController_1.default.activate);
    }
}
exports.default = new DatosEmpleadoRoutes().router;
