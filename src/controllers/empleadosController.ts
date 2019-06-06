import { Request, Response, json } from 'express';
import moment from 'moment';


import pool from '../database';
import { exists } from 'fs';
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
class EmpleadosController {

    public async test(req: Request, res: Response): Promise<any> {
        return res.status(200).send({ test: 'test' });
    }

    public async login(req: Request, res: Response): Promise<any> {
        const usuario = req.body.usuario;
        const password = req.body.password;
        if (usuario != undefined && password != undefined) {
            const empleado = await pool.query('SELECT * FROM empleados WHERE usuario = ?', [usuario]);
            if (empleado.length > 0) {
                if (bcrypt.compareSync(req.body.password, empleado[0].password)) {
                    empleado[0].password = undefined;
                    const loginEmpleado = await pool.query('SELECT * FROM loginEmpleados WHERE clvEmpleado = ? AND fechaClose IS NULL ORDER by idLogin DESC LIMIT 1', [empleado[0].clvEmpleado]);
                    if (loginEmpleado.length > 0) {
                        return res.status(200).send({ error: 'LG0003' });
                    } else {
                        return res.json(empleado[0]);
                    }
                } else {

                    return res.status(404).send({ error: 'LG0002' });
                }
            } else {
                return res.status(404).send({ error: 'LG0001' });
            }

        } else {
            return res.status(500).send({ error: ' Favor de enviar los datos completos' });

        }

    }
    public async restore(req: Request, res: Response): Promise<any> {

        const usuario = req.body.usuario;
        const password = req.body.password;


        if (usuario != undefined && password != undefined) {
            const empleado = await pool.query('SELECT * FROM empleados WHERE usuario = ?  ORDER by idEmpleado DESC LIMIT 1', [usuario]);

            if (empleado.length > 0) {
                var save = {
                    clvEmpleado: empleado[0].clvEmpleado,
                    fechaClose: moment().format('YYYY-MM-DD HH:mm:ss'),
                    token: jwt.createToken(req.body)
                };
                const loginEmpleado = await pool.query('UPDATE loginEmpleados  set ? WHERE clvEmpleado = ? AND fechaClose IS NULL ORDER by idlogin DESC LIMIT 1 ', [save, empleado[0].clvEmpleado]);

                return res.json(empleado);
            } else {
                return res.status(404).send({ error: 'LG0001' });
            }

        } else {
            return res.status(500).send({ error: ' Favor de enviar los datos completos' });

        }

    }

    public async obtenerToken(req: Request, res: Response): Promise<void> {
        const loginEmpleado = await pool.query('SELECT * FROM loginEmpleados WHERE clvEmpleado = ? AND fechaClose IS NULL ORDER by idLogin DESC LIMIT 1', req.body.clvEmpleado);
        // var res = loginEmpleado[0].token;
        // res.json(loginEmpleado);
        if (loginEmpleado.length > 0) {
            return res.json(loginEmpleado[0]);
        }
        res.status(404).json({ text: "El empleado no existe" });

    }

    public async list(req: Request, res: Response): Promise<void> {

        var empleados = await pool.query('SELECT * FROM empleados');
        // console.log('entro empleados');
        // console.log(req.body);
        // for (var i = 0; i < empleados.length; i++) {
        //     empleados[i]['password'] = undefined;
        // }
        console.log(empleados);
        res.json(empleados);
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        const { clvEmpleado } = req.params;
        const empleado = await pool.query('SELECT * FROM empleados WHERE clvEmpleado = ?', [clvEmpleado]);
        if (empleado.length > 0) {
            empleado[0]['password'] = undefined;
            return res.json(empleado[0]);
        }
        res.status(404).json({ text: "El empleado no existe" });
    }
    public async getCountClv(req: Request, res: Response): Promise<any> {
        const { clv } = req.params;
        const clave = await pool.query('SELECT * FROM empleados where clvEmpleado like %?', [clv]);
        if (clave.length > 0) {
            return res.json(clave);
        }
        res.status(404).json({ text: "El clave no existe" });
    }

    public async create(req: Request, res: Response): Promise<void> {
        const usuario = req.body.usuario;
        const clvEmpleado = req.body.clvEmpleado;
        req.body.fechaCreacion = moment().format('YYYY-MM-DD HH:mm:ss');
        req.body.ultimaActualizacion = moment().format('YYYY-MM-DD HH:mm:ss');
        if (req.body.nombre == null ||
            req.body.apellidoPaterno == null ||
            req.body.apellidoMaterno == null ||
            req.body.clvEmpleado == null ||
            req.body.usuario == null ||
            req.body.password == null ||
            req.body.rolEmpleado == null) {
            return res.status(200).send({ error: 'Envía los campos requeridos.' });
        }

        req.body.nombre = req.body.nombre.trim();
        req.body.activo = true;
        req.body.fechaSalida = null;
        var name = req.body.nombre;
        var nombre: any = "";
        var i = 0;
        var pass;
        req.body.nombre = req.body.nombre.trim();
        var name: any = convertName(req.body.nombre);
        for (var i = 0; i < name.length; i++) {
            if (name[i] != "") {
                name[i] = MaysPrimera(name[i]);
                nombre = nombre + name[i] + ' ';
            }
        }
        nombre.trim();
        req.body.nombre = nombre; // A
        req.body.apellidoPaterno = MaysPrimera(req.body.apellidoPaterno);
        req.body.apellidoMaterno = MaysPrimera(req.body.apellidoMaterno);
        req.body.usuario = req.body.usuario.toLowerCase();
        req.body.apellidoPaterno = req.body.apellidoPaterno.trim();
        req.body.apellidoMaterno = req.body.apellidoMaterno.trim();
        req.body.clvEmpleado = req.body.clvEmpleado.trim();
        req.body.usuario = req.body.usuario.trim();
        pass = bcrypt.hashSync(req.body.password);
        req.body.password = pass;
        var empleado = await pool.query('SELECT * FROM empleados WHERE usuario = ?', [usuario]);
        if (empleado.length > 0) {
            return res.status(200).send({ error: 'Ya existe un empleado con ese usuario. ' });
        } else {
            if (clvEmpleado.length < 8 || clvEmpleado.length > 8) {
                return res.status(200).send({ error: 'Clave de usuario no valida ' });
            } else {
                var empleado2 = await pool.query('SELECT * FROM empleados WHERE clvEmpleado = ?', [clvEmpleado]);
                if (empleado2.length > 0) {
                    return res.status(200).send({ error: 'Ya existe un empleado con esa clave de empleado. ' });
                } else {

                    const result = await pool.query('INSERT INTO empleados  set ?', [req.body]);
                    res.json({ message: 'Nuevo empleado guardado' });
                }
            }
        }

    }
    public async saveToken(req: Request, res: Response): Promise<void> {
        const { clvEmpleado } = req.params;
        const oldEmpleado = req.body;
        req.body.ultimaActualizacion = moment().format('YYYY-MM-DD HH:mm:ss');
        var updateEmpleado = await pool.query('UPDATE empleados set ? WHERE clvEmpleado = ?', [req.body.token, clvEmpleado]);
        if (updateEmpleado.affectedRows <= 0) {
            res.json({ error: "No se pudo localizar el empleado" });
        } else {
            res.json({ message: "El empleado fue actualizado" });
        }

    }

    public async update(req: Request, res: Response): Promise<void> {
        const { clvEmpleado } = req.params;
        const oldEmpleado = req.body;

        req.body.ultimaActualizacion = moment().format('YYYY-MM-DD HH:mm:ss');
        var updateEmpleado = await pool.query('UPDATE empleados set ? WHERE clvEmpleado = ?', [req.body, clvEmpleado]);
        if (updateEmpleado.affectedRows <= 0) {
            res.json({ error: "No se pudo localizar el empleado" });
        } else {
            res.json({ message: "El empleado fue actualizado" });
        }

    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { clvEmpleado } = req.params;
        req.body.activo = false;
        const oldEmpleado = req.body;
        req.body.ultimaActualizacion = moment().format('YYYY-MM-DD HH:mm:ss');
        req.body.fechaSalida = moment().format('YYYY-MM-DD HH:mm:ss');
        var updateEmpleado = await pool.query('UPDATE empleados set ? WHERE clvEmpleado = ?', [req.body, clvEmpleado]);
        if (updateEmpleado.affectedRows <= 0) {
            res.json({ error: "No se pudo localizar el empleado" });
        } else {
            res.json({ message: "El empleado fue actualizado" });
        }
    }
    public async salida(req: Request, res: Response): Promise<void> {

        const { clvEmpleado } = req.params;
        req.body.activo = false;
        const oldEmpleado = req.body;
        req.body.activo = false;
        req.body.fechaSalida = moment().format('YYYY-MM-DD HH:mm:ss');
        req.body.ultimaActualizacion = moment().format('YYYY-MM-DD HH:mm:ss');
        req.body.fechaSalida = moment().format('YYYY-MM-DD HH:mm:ss');
        var updateEmpleado = await pool.query('UPDATE empleados set ? WHERE clvEmpleado = ?', [req.body, clvEmpleado]);
        if (updateEmpleado.affectedRows <= 0) {
            res.json({ error: "No se pudo localizar el empleado" });
        } else {
            res.json({ message: "El empleado fue actualizado" });
        }
    }
    public async activate(req: Request, res: Response): Promise<void> {
        const { clvEmpleado } = req.params;
        req.body.activo = true;
        req.body.fechaSalida = null;
        const oldEmpleado = req.body;
        req.body.ultimaActualizacion = moment().format('YYYY-MM-DD HH:mm:ss');
        var updateEmpleado = await pool.query('UPDATE empleados set ? WHERE clvEmpleado = ?', [req.body, clvEmpleado]);
        if (updateEmpleado.affectedRows <= 0) {
            res.json({ error: "No se pudo localizar el empleado" });
        } else {
            res.json({ message: "El empleado fue actualizado" });
        }
    }


}
function MaysPrimera(string: string) {
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function convertName(string: string) {

    var res = string.split(" ");
    return res;
}


const empleadosController = new EmpleadosController;
export default empleadosController; 