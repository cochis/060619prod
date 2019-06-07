"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const unidadesController_1 = __importDefault(require("../controllers/unidadesController"));
class UnidadesRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', unidadesController_1.default.list);
        this.router.get('/:id', unidadesController_1.default.getOne);
        this.router.post('/', unidadesController_1.default.create);
        this.router.put('/:id', unidadesController_1.default.update);
        this.router.delete('/:id', unidadesController_1.default.delete);
    }
}
exports.default = new UnidadesRoutes().router;
