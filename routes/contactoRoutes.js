"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactoController_1 = __importDefault(require("../controllers/contactoController"));
var md_auth = require('../middlewares/authenticated');
class ContactoRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    // md_auth.ensureAuth ,
    config() {
        // Servicio de Login
        this.router.post('/', contactoController_1.default.sendMail);
    }
}
exports.default = new ContactoRoutes().router;
