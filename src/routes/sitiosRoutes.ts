import express, { Router } from 'express';

import sitiosController from '../controllers/sitiosController';

class SitiosRoutes {

    router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', sitiosController.list);
        this.router.get('/:id', sitiosController.getOne);
        this.router.post('/', sitiosController.create);
        this.router.put('/:id', sitiosController.update);
        this.router.delete('/:id', sitiosController.delete);
    }

}

export default new SitiosRoutes().router;

