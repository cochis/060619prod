var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'ambulancias_Humanas2019;'
exports.createToken = function(empleado:any){
    
    var payload = {
        sub: empleado.idEmpleado,
        nombre: empleado.nombre,
        apellidoPaterno: empleado.apellidoPaterno,
        apellidoMaterno: empleado.apellidoMaterno,
        clvEmpleado: empleado.clvEmpleado,
        usuario: empleado.usuario,
        password: empleado.password,
        rolEmpleado: empleado.rolEmpleado,
        fechaCreacion: empleado.fechaCreacion,
        activo: empleado.activo,
        fechaSalida: empleado.fechaSalida,
        iat: moment().unix(),
        exp: moment().add(30,'days').unix()
    };
    return jwt.encode(payload, secret);
};