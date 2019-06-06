import express, { Router } from 'express';

import rolesController from '../controllers/rolesController';
var md_auth = require('../middlewares/authenticated');
class RolesRoutes {

    router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', md_auth.ensureAuth , rolesController.list);
        this.router.get('/:clvRol',  md_auth.ensureAuth ,rolesController.getOne);
        this.router.post('/', md_auth.ensureAuth , rolesController.create);
        this.router.put('/:clvRol', md_auth.ensureAuth , rolesController.update);
        this.router.delete('/desactivar/:clvRol',  md_auth.ensureAuth , rolesController.delete);
        this.router.put('/activar/:clvRol',  md_auth.ensureAuth , rolesController.activated);
    }

}

export default new RolesRoutes().router;

