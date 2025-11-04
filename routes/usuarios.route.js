import { Router } from "express";
import { login, register } from "../controllers/validacion.controller.js";
import { consultarAccesosUsuario, crearCuentaUsuario } from "../controllers/usuarios.controller.js";
import { basicAuth } from "../middlewares/basicAuth.js"
import { limitadorIPsCliente } from "../middlewares/rateLimiter.js";



const router = Router();

router.get("/login", limitadorIPsCliente, basicAuth, login);

router.post("/register", basicAuth, register);

router.post("/crear-usuario", basicAuth, crearCuentaUsuario);

router.post("/consultar-accesos-usuario", basicAuth, consultarAccesosUsuario);

export default router;