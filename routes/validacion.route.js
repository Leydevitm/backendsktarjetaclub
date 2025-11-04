import { Router } from "express";
import { buscarTarjeta, login, register, enviarCodigoCorreo, enviarCodigoTelefono, validarCodigoTelefono, validarCodigoCorreo, guardarTarjetahabiente, guardarTarjetahabienteHasura, actualizarTarjetahabienteHasura, obtenerConteoCli, obtenerTarjetahabientesHasura, obtenerUnTarjetahabienteHasura, obtenerIdCli, enviarFolioPreregistro, obtenerCajeras, guardarTarjetahabienteHasuraV2, actualizarTarjetahabienteHasuraV2, obtenerTarjetahabientesHasuraV2, obtenerUnTarjetahabienteHasuraV2, obtenerTarjetahabientesFecha, obtenerEmpleadosSucursal, obtenerTarjetaActivacion, activarTarjetaHasura, obtenerEmpleadosUsuarioSucursal, obtenerTarjetasPreactivacion, enviarFormatoSk, enviarCorreoMailjet, enviarCodigoTwilio, validarCodigoTwilio, editarTarjetahabienteHasura, obtenerTarjetahabientesId } from "../controllers/validacion.controller.js";
import { validacionCodigoTelefono, validacionTarjeta, validacionTelefono, validacionCorreoNombre, validacionCodigoCorreo } from "../middlewares/validationManager.js";
import { limitadorIPsCliente } from "../middlewares/rateLimiter.js";
import { basicAuth } from "../middlewares/basicAuth.js"


const router = Router();

router.get("/login", basicAuth, login);

router.post("/register", basicAuth, register);

router.get("/formato", basicAuth, enviarFormatoSk);

router.post("/buscar", basicAuth, validacionTarjeta, buscarTarjeta);

router.post("/cliente/buscar", basicAuth,  validacionTarjeta, limitadorIPsCliente, buscarTarjeta);

router.post("/enviar-codigo-correo", basicAuth, validacionCorreoNombre, enviarCodigoCorreo);

router.post("/validar-codigo-correo", basicAuth, validacionCodigoCorreo, validarCodigoCorreo);

router.post("/enviar-codigo-telefono", basicAuth, validacionTelefono, enviarCodigoTelefono);

router.post("/validar-codigo-telefono", basicAuth, validacionCodigoTelefono, validarCodigoTelefono);

router.post("/guardar-tarjetahabiente-verificado", basicAuth, guardarTarjetahabiente);

router.post("/guardar-tarjetahabiente-verificado-hasura", basicAuth, guardarTarjetahabienteHasura);

router.post("/actualizar-tarjetahabiente-verificado-hasura", basicAuth, actualizarTarjetahabienteHasura);

router.get("/obtener-tarjetahabientes-hasura", basicAuth, obtenerTarjetahabientesHasura);

router.post("/obtener-un-tarjetahabiente-hasura", basicAuth, obtenerUnTarjetahabienteHasura);

router.get("/obtener-conteo-cli-hasura", basicAuth, obtenerConteoCli);

router.post("/obtener-id-cli-hasura", basicAuth, obtenerIdCli);

router.post("/enviar-folio-preregistro", basicAuth, enviarFolioPreregistro);

router.post("/obtener-cajeras", basicAuth, obtenerCajeras);

router.post("/obtener-empleados-sucursal", basicAuth, obtenerEmpleadosSucursal);

router.post("/obtener-empleados-usuario-sucursal", basicAuth, obtenerEmpleadosUsuarioSucursal);

router.post("/guardar-tarjetahabiente-verificado-hasura-v2", basicAuth, guardarTarjetahabienteHasuraV2);

router.post("/actualizar-tarjetahabiente-verificado-hasura-v2", basicAuth, actualizarTarjetahabienteHasuraV2);

router.get("/obtener-tarjetahabientes-hasura-v2", basicAuth, obtenerTarjetahabientesHasuraV2);

router.post("/obtener-un-tarjetahabiente-hasura-v2", basicAuth, obtenerUnTarjetahabienteHasuraV2);

router.post("/obtener-tarjetahabientes-fecha", basicAuth, obtenerTarjetahabientesFecha);

router.post("/obtener-tarjeta-activacion", basicAuth, obtenerTarjetaActivacion);

router.post("/activar-tarjeta", basicAuth, activarTarjetaHasura);

router.post("/obtener-tarjetas-preactivacion", basicAuth, obtenerTarjetasPreactivacion);

router.post("/enviar-correo-mailjet", basicAuth, enviarCorreoMailjet);

router.post("/enviar-codigo-twilio", basicAuth, enviarCodigoTwilio);

router.post("/validar-codigo-twilio", basicAuth, validarCodigoTwilio);

router.post("/editar-tarjetahabiente", basicAuth, editarTarjetahabienteHasura);

router.post("/obtener-tarjetahabientes-id", basicAuth, obtenerTarjetahabientesId);

export default router;