import express, { Router } from 'express';

import loginEmpleasdosController from '../controllers/loginEmpleadosController';
var md_auth = require('../middlewares/authenticated');
class EmpleadosRoutes {

    router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        // Servicio de Login

        this.router.get('/', loginEmpleasdosController.list);
        this.router.get('/id/:id', loginEmpleasdosController.getOneById);
        this.router.get('/clv/:clvEmpleado', loginEmpleasdosController.getOneByClv);
        this.router.post('/', loginEmpleasdosController.create);
        this.router.put('/actualizar/:id', loginEmpleasdosController.getOneById);
        this.router.post('/closeLogin/:clvEmpleado', loginEmpleasdosController.closeLogin);
       
        
        
    } 

}

export default new EmpleadosRoutes().router;

