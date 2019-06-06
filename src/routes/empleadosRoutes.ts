import express, { Router } from 'express';

import empleadosController from '../controllers/empleadosController';
var md_auth = require('../middlewares/authenticated');
class EmpleadosRoutes {

    router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        // Servicio de Login
        this.router.post('/login' , empleadosController.login);
        this.router.post('/' , empleadosController.create);
        this.router.post('/restore/',empleadosController.restore);
        this.router.get('/emple',empleadosController.list);
        this.router.get('/:clvEmpleado',md_auth.ensureAuth , empleadosController.getOne);
        this.router.post('/',md_auth.ensureAuth , empleadosController.create);
        this.router.put('/:clvEmpleado',md_auth.ensureAuth , empleadosController.update);
        this.router.put('/desactivar/:clvEmpleado',md_auth.ensureAuth , empleadosController.delete);
        this.router.put('/activar/:clvEmpleado',md_auth.ensureAuth , empleadosController.activate);
        this.router.put('/salida/:clvEmpleado',md_auth.ensureAuth , empleadosController.salida);
        this.router.put('/token/:clvEmpleado',md_auth.ensureAuth , empleadosController.saveToken);
        this.router.put('/token/:clvEmpleado',md_auth.ensureAuth , empleadosController.saveToken);
        this.router.get('/busqueda/:clv',md_auth.ensureAuth , empleadosController.getCountClv);
        
    }

}

export default new EmpleadosRoutes().router;


