"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rolesController_1 = __importDefault(require("../controllers/rolesController"));
var md_auth = require('../middlewares/authenticated');
class RolesRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', md_auth.ensureAuth, rolesController_1.default.list);
        this.router.get('/:clvRol', md_auth.ensureAuth, rolesController_1.default.getOne);
        this.router.post('/', md_auth.ensureAuth, rolesController_1.default.create);
        this.router.put('/:clvRol', md_auth.ensureAuth, rolesController_1.default.update);
        this.router.delete('/desactivar/:clvRol', md_auth.ensureAuth, rolesController_1.default.delete);
        this.router.put('/activar/:clvRol', md_auth.ensureAuth, rolesController_1.default.activated);
    }
}
exports.default = new RolesRoutes().router;
