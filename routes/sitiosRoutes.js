"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sitiosController_1 = __importDefault(require("../controllers/sitiosController"));
class SitiosRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', sitiosController_1.default.list);
        this.router.get('/:id', sitiosController_1.default.getOne);
        this.router.post('/', sitiosController_1.default.create);
        this.router.put('/:id', sitiosController_1.default.update);
        this.router.delete('/:id', sitiosController_1.default.delete);
    }
}
exports.default = new SitiosRoutes().router;
