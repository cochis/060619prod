import express, { Router } from 'express';

import contactoController from '../controllers/contactoController';
var md_auth = require('../middlewares/authenticated');
class ContactoRoutes {

    router: Router = Router();

    constructor() {
        this.config();
    }
    // md_auth.ensureAuth ,
    config() {
        // Servicio de Login
        this.router.post('/', contactoController.sendMail);
        
    }

}

export default new ContactoRoutes().router;


