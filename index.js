"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
// import indexRoutes from './routes/indexRoutes';
const empleadosRoutes_1 = __importDefault(require("./routes/empleadosRoutes"));
const rolesRoutes_1 = __importDefault(require("./routes/rolesRoutes"));
const unidadesRoutes_1 = __importDefault(require("./routes/unidadesRoutes"));
const sitiosRoutes_1 = __importDefault(require("./routes/sitiosRoutes"));
const loginEmpleadosRoutes_1 = __importDefault(require("./routes/loginEmpleadosRoutes"));
const datosEmpleadoRoutes_1 = __importDefault(require("./routes/datosEmpleadoRoutes"));
const contactoRoutes_1 = __importDefault(require("./routes/contactoRoutes"));
class Server {
    constructor() {
        this.app = express_1.default();
        this.config();
        this.routes();
    }
    config() {
        this.app.set('port', process.env.PORT || 3200);
        this.app.use(morgan_1.default('dev'));
        this.app.use(cors_1.default());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        this.app.use('/', express_1.default.static('client', { redirect: false }));
        this.app.use('/api/empleados', empleadosRoutes_1.default);
        this.app.use('/api/roles', rolesRoutes_1.default);
        this.app.use('/api/unidades', unidadesRoutes_1.default);
        this.app.use('/api/sitios', sitiosRoutes_1.default);
        this.app.use('/api/login', loginEmpleadosRoutes_1.default);
        this.app.use('/api/datos-empleado', datosEmpleadoRoutes_1.default);
        this.app.use('/api/send-contacto', contactoRoutes_1.default);
        this.app.get('*', function (req, res, next) { res.sendFile('client/index.html'); });
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();
