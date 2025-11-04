import { body } from "express-validator";
import { validacionErrores } from "./validationResult.js";

export const validacionTarjeta = [
    body("tarjeta", "Número de tarjeta inválido")
    .trim()
    .isNumeric()
    .isLength({min:12, max:13}),
    validacionErrores
];

export const validacionTelefono = [
    body("telefono", "Número de teléfono inválido")
    .trim()
    .isNumeric()
    .isLength({min:10, max:10}),
    validacionErrores
];

export const validacionCodigoTelefono = [
    body("telefono", "Número de teléfono inválido")
    .trim()
    .isNumeric()
    .isLength({min:10, max:10}),
    body("codigo", "Código inválido")
    .trim()
    .isNumeric()
    .isLength({min:6, max:6}),
    validacionErrores
];

export const validacionCorreoNombre = [
    body("correo", "Correo inválido")
    .trim()
    .isEmail(),
    body("nombre", "Nombre inválido")
    .trim()
    .isString()
    .notEmpty(),
    validacionErrores
];

export const validacionCodigoCorreo = [
    body("correo", "Correo inválido")
    .trim()
    .isEmail(),
    body("dbIdentificador", "Identificador inválido")
    .trim()
    .isString()
    .notEmpty(),
    body("codigo", "Código inválido")
    .trim()
    .isNumeric()
    .isLength({min:6, max:6}),
    validacionErrores
];
