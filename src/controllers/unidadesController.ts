import { Request, Response } from 'express';
import pool from '../database';

class UnidadesController {

    public async list(req: Request, res: Response): Promise<void> {
        const unidades = await pool.query('SELECT * FROM unidades');
        res.json(unidades);
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const unidad = await pool.query('SELECT * FROM unidades WHERE idUnidad = ?', [id]);
        if (unidad.length > 0) {
            return res.json(unidad[0]);
        }
        res.status(404).json({ text: "La unidad no existe." });
    }

    public async create(req: Request, res: Response): Promise<void> {
        //SETEAMOS USUARIO PARA HACER LA BUSQUEDA POR USUARIO
        const nombre = req.body.nombre;
        const clvUnidad = req.body.clvUnidad;
        //SETEAMOS clvEmpleado PARA HACER LA BUSQUEDA POR CLAVE DE EMPLEADO
        req.body.fechaCreacion = Date.now();
        if (req.body.nombre == null ||
            req.body.clvUnidad == null ||
            req.body.placa == null ||
            req.body.economico == null ||
            req.body.marca == null ||
            req.body.modelo == null ||
            req.body.tipo == null) {
            return res.status(200).send({ error: 'Envía los campos requeridos.' });
        }
        req.body.nombre = req.body.nombre.toUpperCase();
        req.body.clvUnidad = req.body.clvUnidad.toUpperCase();
        req.body.activo = true;
        var unidad = await pool.query('SELECT * FROM unidades WHERE nombre = ?', [nombre]);
        if (unidad.length > 0) {
            return res.status(200).send({ error: 'Ya existe una unidad con ese nombre. ' });
        } else {
            if (clvUnidad.length < 5 || clvUnidad.length > 5) {
                return res.status(200).send({ error: 'Clave de unidad no valida. ' });
            } else {
                var unidad2 = await pool.query('SELECT * FROM unidades WHERE clvUnidad = ?', [clvUnidad]);
                if (unidad2.length > 0) {
                    return res.status(200).send({ error: 'Ya existe un unidad con esa clave de unidad. ' });
                } else {

                    const result = await pool.query('INSERT INTO unidades  set ?', [req.body]);
                    res.json({ message: 'Nueva unidad guardada' });
                }
            }
        }
    }
    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const oldUnidad = req.body;

        if (req.body.nombre == null || req.body.clvUnidad == null || req.body.nombre == "" || req.body.clvUnidad == "") {
            return res.status(200).send({ error: 'Verifique los campos. ' });
        }
        if (req.body.clvUnidad.length != 5) {
            return res.status(200).send({ error: 'Clave de unidad no valida. ' });
        }

        var validaUnidad = await pool.query('SELECT * FROM unidades WHERE nombre = ?', [req.body.nombre]);
        if (validaUnidad.length > 0) {
            return res.status(200).send({ error: 'Ya existe una unidad con ese nombre. ' });
        }
        validaUnidad = await pool.query('SELECT * FROM unidades WHERE clvUnidad = ?', [req.body.clvUnidad]);
        if (validaUnidad.length > 0) {
            return res.status(200).send({ error: 'Ya existe una unidad con esa clave de unidad. ' });
        }
        var updateUnidad = await pool.query('UPDATE unidades set ? WHERE idUnidad = ?', [req.body, id]);
        if (updateUnidad.affectedRows <= 0) {
            res.json({ error: "No se pudo localizar la unidad" });
        } else {
            res.json({ message: "La unidad fue actualizada" });
        }

    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        req.body.activo = false;
        const oldUnidad = req.body;
        var updateUnidad = await pool.query('UPDATE unidades set ? WHERE idUnidad = ?', [req.body, id]);
        if (updateUnidad.affectedRows <= 0) {
            res.json({ error: "No se pudo localizar la unidad" });
        } else {
            res.json({ message: "la unidad fue actualizada" });
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

const unidadesController = new UnidadesController;
export default unidadesController; 