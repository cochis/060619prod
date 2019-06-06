import { Request, Response } from 'express';
import pool from '../database';
import moment from 'moment';

class RolesController {

    public async list(req: Request, res: Response): Promise<void> {
        const roles = await pool.query('SELECT * FROM roles');
        res.json(roles);
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        const { clvRol } = req.params;
        const rol = await pool.query('SELECT * FROM roles WHERE clvRol = ?', [clvRol]);
        if (rol.length > 0) {
            return res.json(rol[0]);
        }
        res.status(404).json({ text: "El rol no existe" });
    }

    public async create(req: Request, res: Response): Promise<void> {
        //SETEAMOS USUARIO PARA HACER LA BUSQUEDA POR USUARIO
        const nombre = req.body.nombre;
        const clvRol = req.body.clvRol;
        req.body.fechaCreacion =  moment().format('YYYY-MM-DD HH:mm:ss');
        req.body.ultimaActualizacion =  moment().format('YYYY-MM-DD HH:mm:ss');
        req.body.activo = true;
        if (req.body.nombre == null ||
            req.body.clvRol == null) {
            return res.status(200).send({ error: 'Envía los campos requeridos.' });
        }
        req.body.nombre = MaysPrimera(req.body.nombre);
        req.body.clvRol = req.body.clvRol;
        req.body.activo = true;
        var rol = await pool.query('SELECT * FROM roles WHERE nombre = ?', [nombre]);
        if (rol.length > 0) {
            return res.status(200).send({ error: 'Ya existe un rol con ese nombre. ' });
        } else {
            if (clvRol.length < 5 || clvRol.length > 5) {
                return res.status(200).send({ error: 'Clave de rol no valida. ' });
            } else {
                var rol2 = await pool.query('SELECT * FROM roles WHERE clvRol = ?', [clvRol]);
                if (rol2.length > 0) {
                    return res.status(200).send({ error: 'Ya existe un rol con esa clave de rol. ' });
                } else {

                    const result = await pool.query('INSERT INTO roles  set ?', [req.body]);
                    res.json({ message: 'Nuevo rol guardado' });
                }
            }
        }
    }
    public async update(req: Request, res: Response): Promise<void> {
        const { clvRol } = req.params;
        console.log(req.params);
        
        const oldRol = req.body;
        // req.body.nombre = cleanString(req.body.nombre);
        // req.body.clvRol = cleanString(req.body.clvRol );
        req.body.ultimaActualizacion =  moment().format('YYYY-MM-DD HH:mm:ss');
        if (req.body.nombre == null || req.body.clvRol == null || req.body.nombre == "" || req.body.clvRol == "") {
            return res.status(200).send({ error: 'Verifique los campos. ' });
        }
        if (clvRol.length != 5) {
            return res.status(200).send({ error: 'Clave de rol no valida. ' });
        }
        var updateRol = await pool.query('UPDATE roles set ? WHERE clvRol = ?', [req.body, clvRol]);
        if (updateRol.affectedRows <= 0) {
            res.json({ error: "No se pudo localizar el Rol" });
        } else {
            res.json({ message: "El rol fue actualizado" });
        }

    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { clvRol } = req.params;
        req.body.activo = false;
        req.body.ultimaActualizacion =  moment().format('YYYY-MM-DD HH:mm:ss');
        const oldRol = req.body;
        var updateRol = await pool.query('UPDATE roles set ? WHERE clvRol = ?', [req.body, clvRol]);
        if (updateRol.affectedRows <= 0) {
            res.json({ error: "No se pudo localizar el rol" });
        } else {
            res.json({ message: "El rol fue actualizado" });
        }
    }
    public async activated(req: Request, res: Response): Promise<void> {
        const { clvRol } = req.params;
        req.body.activo = true;
        req.body.ultimaActualizacion =  moment().format('YYYY-MM-DD HH:mm:ss');
        const oldRol = req.body;
        var updateRol = await pool.query('UPDATE roles set ? WHERE clvRol = ?', [req.body, clvRol]);
        if (updateRol.affectedRows <= 0) {
            res.json({ error: "No se pudo localizar el rol" });
        } else {
            res.json({ message: "El rol fue actualizado" });
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

function cleanString(string: string) {
    string = string.trim();
    return string;
}

const rolesController = new RolesController;
export default rolesController; 