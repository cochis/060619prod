import express, { Router } from 'express';

import unidadesController from '../controllers/unidadesController';

class UnidadesRoutes {

    router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', unidadesController.list);
        this.router.get('/:id', unidadesController.getOne);
        this.router.post('/', unidadesController.create);
        this.router.put('/:id', unidadesController.update);
        this.router.delete('/:id', unidadesController.delete);
    }

}

export default new UnidadesRoutes().router;

