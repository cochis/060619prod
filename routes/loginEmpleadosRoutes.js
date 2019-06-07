"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loginEmpleadosController_1 = __importDefault(require("../controllers/loginEmpleadosController"));
var md_auth = require('../middlewares/authenticated');
class EmpleadosRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        // Servicio de Login
        this.router.get('/', loginEmpleadosController_1.default.list);
        this.router.get('/id/:id', loginEmpleadosController_1.default.getOneById);
        this.router.get('/clv/:clvEmpleado', loginEmpleadosController_1.default.getOneByClv);
        this.router.post('/', loginEmpleadosController_1.default.create);
        this.router.put('/actualizar/:id', loginEmpleadosController_1.default.getOneById);
        this.router.post('/closeLogin/:clvEmpleado', loginEmpleadosController_1.default.closeLogin);
    }
}
exports.default = new EmpleadosRoutes().router;
