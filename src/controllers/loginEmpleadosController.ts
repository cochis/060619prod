import { Request, Response } from 'express';
import pool from '../database';
import moment from 'moment';
var jwt = require('../services/jwt');


class LoginEmpleadosController {

    public async list(req: Request, res: Response): Promise<void> {
        const login = await pool.query('SELECT * FROM loginEmpleados');
        res.json(login);
    }

    public async getOneById(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const login = await pool.query('SELECT COUNT FROM loginEmpleados WHERE idLogin = ? ORDER by idLogin DESC LIMIT 1 ', [id]);
        if (login.length > 0) {
            return res.json(login[0]);
        }
        res.status(404).json({ text: "No hay registros de login con ese id" });
    }
    public async getOneByClv(req: Request, res: Response): Promise<any> {
        const { clvEmpleado } = req.params;
        const login = await pool.query('SELECT * FROM loginEmpleados WHERE clvEmpleado = ?  ORDER by idLogin DESC LIMIT 1', [clvEmpleado]);
        if (login.length > 0) {
            return res.json(login[0]);
        }
        res.status(404).json({ text: "No hay registros de login con esa clave" });
    }


    public async create(req: Request, res: Response): Promise<void> {
        req.body.fechaLogin =  moment().format('YYYY-MM-DD HH:mm:ss');;
        var save = {
            clvEmpleado: req.body.clvEmpleado,
            fechaLogin:  moment().format('YYYY-MM-DD HH:mm:ss'),
            fechaClose: null,
            token: jwt.createToken(req.body)
        };
        const loginEmpleado = await pool.query('INSERT INTO loginEmpleados  set ?', [save]);
        res.json({ message: "El LoginEmpleado fue creado" });

    }
    public async closeLogin(req: Request, res: Response): Promise<void> {

        const { clvEmpleado } = req.params;
        req.body.fechaLogin =  moment().format('YYYY-MM-DD HH:mm:ss');;
        // console.log('entro a close');
        // console.log(req.body);
        // console.log(req.params);


        var save = {
            clvEmpleado: req.body.clvEmpleado,
            fechaClose:  moment().format('YYYY-MM-DD HH:mm:ss'),
            token: jwt.createToken(req.body)
        };
        // console.log(save);
        const loginEmpleado = await pool.query('UPDATE loginEmpleados set ?  WHERE clvEmpleado = ? AND fechaClose IS NULL ORDER by idLogin DESC LIMIT 1 ', [save, clvEmpleado]);
        // console.log(loginEmpleado);
        if (loginEmpleado.affectedRows <= 0) {
            res.json({ error: "No se pudo localizar el Sitio" });
        } else {
            res.json({ message: "El sitio fue actualizado" });
        }
    }
    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        if (req.body.fechaSalida = 1) {
            req.body.fechaClose =  moment().format('YYYY-MM-DD HH:mm:ss');;
            req.body.fechaSalida = null;
        }
        
        var updateLoginEmpleado = await pool.query('UPDATE loginEmpleados set ? WHERE idLogin = ? AND fechaClose IS NULL ORDER by idLogin DESC LIMIT 1', [req.body, id]);

       
        if (updateLoginEmpleado.affectedRows <= 0) {
            res.json({ error: "No se pudo localizar el Sitio" });
        } else {
            res.json({ message: "El sitio fue actualizado" });
        }

    }
} 

const loginEmpleadosController = new LoginEmpleadosController;
export default loginEmpleadosController; 