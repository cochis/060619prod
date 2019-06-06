import { Request, Response } from 'express';
import pool from '../database';

class LocalidadesController {

    public async list(req: Request, res: Response): Promise<void> {
        const localidades = await pool.query('SELECT * FROM localidades');
        res.json(localidades);
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const rol = await pool.query('SELECT * FROM localidades WHERE idLocalidad = ?', [id]);
        if (rol.length > 0) {
            return res.json(rol[0]);
        }
        res.status(404).json({ text: "El rol no existe" });
    }

    public async create(req: Request, res: Response): Promise<void> {
        //SETEAMOS USUARIO PARA HACER LA BUSQUEDA POR USUARIO
        const nombre = req.body.nombre;
        const clvRol = req.body.clvRol;
        //SETEAMOS clvEmpleado PARA HACER LA BUSQUEDA POR CLAVE DE EMPLEADO
        req.body.fechaCreacion = Date.now();
        req.body.activo = true;
        if (req.body.nombre == null ||
            req.body.clvRol == null) {
            return res.status(200).send({ error: 'Envía los campos requeridos.' });
        }
        req.body.nombre = MaysPrimera(req.body.nombre);
        req.body.clvRol = req.body.clvRol;
        req.body.activo = true;
        var rol = await pool.query('SELECT * FROM localidades WHERE nombre = ?', [nombre]);
        if (rol.length > 0) {
            return res.status(200).send({ error: 'Ya existe un rol con ese nombre. ' });
        } else {
            if (clvRol.length < 5 || clvRol.length > 5) {
                return res.status(200).send({ error: 'Clave de rol no valida. ' });
            } else {
                var rol2 = await pool.query('SELECT * FROM localidades WHERE clvRol = ?', [clvRol]);
                if (rol2.length > 0) {
                    return res.status(200).send({ error: 'Ya existe un rol con esa clave de rol. ' });
                } else {

                    const result = await pool.query('INSERT INTO localidades  set ?', [req.body]);
                    res.json({ message: 'Nuevo empleado guardado' });
                }
            }
        }
    }
    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const oldRol = req.body;
        // req.body.nombre = cleanString(req.body.nombre);
        // req.body.clvRol = cleanString(req.body.clvRol );
        if (req.body.nombre == null || req.body.clvRol == null || req.body.nombre == "" || req.body.clvRol == "") {
            return res.status(200).send({ error: 'Verifique los campos. ' });
        }
        if (req.body.clvRol.length != 5) {
            return res.status(200).send({ error: 'Clave de rol no valida. ' });
        }
        var updateLocalidad = await pool.query('UPDATE localidades set ? WHERE idLocalidad = ?', [req.body, id]);
        if (updateLocalidad.affectedRows <= 0) {
            res.json({ error: "No se pudo localizar el Rol" });
        } else {
            res.json({ message: "El rol fue actualizado" });
        }

    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        req.body.activo = false;
        const oldRol = req.body;
        var updateLocalidad = await pool.query('UPDATE localidades set ? WHERE idLocalidad = ?', [req.body, id]);
        if (updateLocalidad.affectedRows <= 0) {
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

const localidadesController = new LocalidadesController;
export default localidadesController; 