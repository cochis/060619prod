import express, { Router } from 'express';

import datosEmpleadoController from '../controllers/datosEmpleadoController';
var md_auth = require('../middlewares/authenticated');
class DatosEmpleadoRoutes {

    router: Router = Router();

    constructor() {
        this.config();
    }
    // md_auth.ensureAuth ,
    config() {
        // Servicio de Login
        this.router.get('/datos/', datosEmpleadoController.list);
        this.router.get('/:clvEmpleado', datosEmpleadoController.getOne);
        this.router.post('/:clvEmpleado', datosEmpleadoController.create);
        this.router.put('/:clvEmpleado',datosEmpleadoController.update);
        this.router.put('/desactivar/:clvEmpleado' , datosEmpleadoController.delete);
        this.router.put('/activar/:clvEmpleado', datosEmpleadoController.activate);
        
    }

}

export default new DatosEmpleadoRoutes().router;


