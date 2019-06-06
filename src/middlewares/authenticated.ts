
var jwt = require ('jwt-simple');
var moment = require('moment');
var secret = 'ambulancias_Humanas2019;'

exports.ensureAuth  = function (req:any,res:any,next:any) {
    if (!req.headers.authorization) {
        return res.status(403).send({error: 'La petición no tiene la cabecera de autentificación'});
    }
    var token = req.headers.authorization.replace(/['"]+/g,'');
    try {
        var payload = jwt.decode(token, secret);

        if (payload.exp <= moment.unix()){
            return res.status(401).send({
                error: 'El token ha expirado'
            });
        }
    }catch(ex) {
        return res.status(404).send({
            error: 'El token no es valido'
        });

    }

    req.empleado = payload;
    
    next();
}