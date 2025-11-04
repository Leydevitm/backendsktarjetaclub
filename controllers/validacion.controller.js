import twilio from "twilio";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import { error } from "console";
import { twilioErrorsEspañol } from "../codigo.errortwilio.js";

export const buscarTarjeta = async (req, res) => {
  const numeroTarjeta = req.body.tarjeta;
  const rutaBuscarTarjeta =
    process.env.BASE_URL_CONSULTA_TARJETA + numeroTarjeta;
  try {
    const response = await axios({
      method: "get",
      url: rutaBuscarTarjeta,
    });
    const tarjeta = response.data.saldo[0].tarjeta;
    const datosTarjeta = response.data.saldo[0];

    if (tarjeta == "Tarjeta no encontrada") {
      return res
        .status(404)
        .json({ errors: [{ msg: "Tarjeta no encontrada" }] });
    }

    res.status(200).json({ data: datosTarjeta });
  } catch (error) {
    return res.status(500).json({
      errors: [
        {
          msg: "Error consulta api SK. Intentelo más tarde.",
          code: "Error SKE-103",
        },
      ],
    });
  }
};

export const enviarCodigoCorreo = async (req, res) => {
  try {
    
    const { correo, nombre, template, correoSender, nombreSender, titulo } =
      req.body;
    const rutaEnviarCodigoCorreo =
      process.env.BASE_URL_PRODUCCION + process.env.HOOK_ENVIAR_CODIGO_CORREO;
    const response = await axios({
      method: "post",
      url: rutaEnviarCodigoCorreo,
      data: {
        toEmail: correo,
        toName: nombre,
        templateID: template,
        senderEmail: correoSender,
        senderName: nombreSender,
        subject: titulo,
      },
    });
    
    
    if (response.data.reponse == "Error al enviar el código de verificación") {
      return res.status(404).json({
        errors: [
          {
            msg: "Error de mailjet, el servicio presenta fallos.",
            code: "Error SKE-102-1",
          },
        ],
      });
    }
    res.status(200).json({ data: response.data });
  } catch (error) {
    
    return res.status(500).json({
      errors: [
        {
          msg: "Error al hacer la peticion a mailjet desde el servidor.",
          code: "Error SKE-102-2",
        },
      ],
    });
  }
};

export const validarCodigoCorreo = async (req, res) => {
  try {
    const { dbIdentificador, correo, codigo } = req.body;
    const rutaValidarCorreo =
      process.env.BASE_URL_PRODUCCION + process.env.HOOK_VALIDAR_CODIGO_CORREO;
    const response = await axios({
      method: "post",
      url: rutaValidarCorreo,
      data: {
        databaseIdentifier: dbIdentificador,
        code: codigo,
        email: correo,
      },
    });
    
    if (response.data.status != 200) {
      return res
        .status(404)
        .json({ errors: [{ msg: response.data.response }] });
    }
    res.status(200).json({ data: response.data });
  } catch (error) {
    
    return res.status(500).json({
      errors: [
        {
          msg: "Error al verificar codigo de verificacion de correo Webhook Firebase",
          code: "Error SKE-104",
        },
      ],
    });
  }
};

export const enviarCodigoTelefono = async (req, res) => {
  try {
    let { telefono, metodo } = req.body;
    telefono = "+52" + telefono;
    const rutaenviarCodigo =
      process.env.BASE_URL_PRODUCCION + process.env.HOOK_ENVIAR_CODIGO_TELEFONO;
    const response = await axios({
      method: "post",
      url: rutaenviarCodigo,
      data: {
        phone: telefono,
        channel: metodo,
        // channel: "sms",
      },
    });
    
    if (response.data.response == "Error in Twilio sending verification") {
      return res.status(404).json({
        errors: [
          {
            msg: "Error de twilio, el servicio de twilio presenta fallos",
            code: "Error SKE-101-1",
          },
        ],
      });
    }
    res.status(200).json({ data: response.data });
  } catch (error) {
    
    return res.status(500).json({
      errors: [
        {
          msg: "Error al hacer la peticion a twilio desde el servidor",
          code: "Error SKE-101-2",
        },
      ],
    });
  }
};

export const validarCodigoTelefono = async (req, res) => {
  try {
    let { telefono, codigo } = req.body;
    
    telefono = "+52" + telefono;
    const rutaValidarTelefono =
      process.env.BASE_URL_PRODUCCION +
      process.env.HOOK_VALIDAR_CODIGO_TELEFONO;
    const response = await axios({
      method: "post",
      url: rutaValidarTelefono,
      data: {
        phone: telefono,
        code: codigo,
      },
    });
    
    if (!response.data.approved) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Código de confirmación incorrecto" }] });
    }
    res.status(200).json({ data: response.data });
  } catch (error) {
    
    return res.status(500).json({
      errors: [
        {
          msg: "Error al verificar codigo de verificacion de telefono Twilio",
          code: "Error SKE-105",
        },
      ],
    });
  }
};

export const guardarTarjetahabiente = async (req, res) => {
  try {
    let { dataTarjetahabiente } = req.body;
    const rutaGuardarTarjetahabiente =
      process.env.BASE_URL_PRODUCCION +
      process.env.HOOK_GUARDAR_TARJETAHABIENTE_VALIDADO;
    const response = await axios({
      method: "post",
      url: rutaGuardarTarjetahabiente,
      data: {
        dataTarjetahabiente: dataTarjetahabiente,
      },
    });
    

    if (response.data.status != 200) {
      return res.status(404).json({
        errors: [
          {
            msg: "Error al guardar tarjetahabiente",
            code: "Error SKE-106-1",
          },
        ],
      });
    }
    res.status(200).json({ data: response.data });
  } catch (error) {
    
    return res.status(500).json({
      errors: [
        { msg: "Error al guardar tarjetahabiente", code: "Error SKE-106-2" },
      ],
    });
  }
};

export const guardarTarjetahabienteHasura = async (req, res) => {
  try {
    let {
      Record_Id,
      apellidoM,
      apellidoP,
      dioalta,
      division,
      email,
      fechaalta,
      fechanacim,
      fechaverfi,
      nombre,
      promotor,
      saldoc,
      sexo,
      tarjeta,
      telefono,
      verificoemail,
      cp,
      actcte,
      id_cli,
    } = req.body;
    const rutaGuardarTarjetahabienteHasura =
      process.env.BASE_URL_HASURA +
      process.env.URL_GUARDAR_TARJETAHABIENTE_HASURA;
    const response = await axios({
      method: "post",
      url: rutaGuardarTarjetahabienteHasura,
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
      },
      data: {
        Record_Id,
        apellidoM,
        apellidoP,
        dioalta,
        division,
        email,
        fechaalta,
        fechanacim,
        fechaverfi,
        nombre,
        promotor,
        saldoc,
        sexo,
        tarjeta,
        telefono,
        verificoemail,
        cp,
        actcte,
        id_cli,
      },
    });
    

    if (response.status != 200) {
      return res.status(404).json({
        errors: [
          {
            msg: "Error al guardar tarjetahabiente hasura",
            code: "Error SKE-107-1",
          },
        ],
      });
    }
    res.status(200).json({ data: response.data });
  } catch (error) {
    
    return res.status(500).json({
      errors: [
        {
          msg: "Error al guardar tarjetahabiente hasura",
          code: "Error SKE-107-2",
        },
      ],
    });
  }
};

export const actualizarTarjetahabienteHasura = async (req, res) => {
  try {
    let {
      Record_Id,
      apellidoM,
      apellidoP,
      dioalta,
      division,
      email,
      fechaalta,
      fechanacim,
      fechaverfi,
      nombre,
      promotor,
      saldoc,
      sexo,
      tarjeta,
      telefono,
      verificoemail,
      cp,
      actcte,
      id_cli,
    } = req.body;
    const rutaActualizarTarjetahabienteHasura =
      process.env.BASE_URL_HASURA +
      process.env.URL_ACTUALIZAR_TARJETAHABIENTE_HASURA;
    const response = await axios({
      method: "post",
      url: rutaActualizarTarjetahabienteHasura,
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
      },
      data: {
        Record_Id,
        apellidoM,
        apellidoP,
        dioalta,
        division,
        email,
        fechaalta,
        fechanacim,
        fechaverfi,
        nombre,
        promotor,
        saldoc,
        sexo,
        tarjeta,
        telefono,
        verificoemail,
        cp,
        actcte,
        id_cli,
      },
    });
    

    if (response.status != 200) {
      return res.status(404).json({
        errors: [
          {
            msg: "Error al actualizar tarjetahabiente hasura",
            code: "Error SKE-108-1",
          },
        ],
      });
    }
    res.status(200).json({ data: response.data });
  } catch (error) {
    
    // 
    return res.status(500).json({
      errors: [
        {
          msg: "Error al actualizar tarjetahabiente hasura",
          code: "Error SKE-108-2",
        },
      ],
    });
  }
};

export const obtenerTarjetahabientesHasura = async (req, res) => {
  try {
    const rutaObtenerTarjetahabientesHasura =
      process.env.BASE_URL_HASURA +
      process.env.URL_OBTENER_TARJETAHABIENTES_HASURA;
    const response = await axios({
      method: "get",
      url: rutaObtenerTarjetahabientesHasura,
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
      },
    });
    

    if (response.status != 200) {
      return res.status(404).json({
        errors: [
          {
            msg: "Error al obtener tarjetahabientes",
            code: "Error SKE-112-1",
          },
        ],
      });
    }
    res.status(200).json({ data: response.data });
  } catch (error) {
    
    return res.status(500).json({
      errors: [
        { msg: "Error al obtener tarjetahabientes", code: "Error SKE-112-2" },
      ],
    });
  }
};

export const obtenerConteoCli = async (req, res) => {
  try {
    const rutaObtenerConteoCliHasura =
      process.env.BASE_URL_HASURA + process.env.URL_CONTEO_CLI_HASURA;
    const response = await axios({
      method: "get",
      url: rutaObtenerConteoCliHasura,
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
      },
    });
    

    if (response.status != 200) {
      return res.status(404).json({
        errors: [
          { msg: "Error al obtener conteo de Cli", code: "Error SKE-109-1" },
        ],
      });
    }
    res.status(200).json({ data: response.data });
  } catch (error) {
    
    return res.status(500).json({
      errors: [
        { msg: "Error al obtener conteo de Cli", code: "Error SKE-109-2" },
      ],
    });
  }
};

export const obtenerIdCli = async (req, res) => {
  try {
    let { nombre, apellidoPaterno, apellidoMaterno } = req.body;
    const rutaObtenerIdCliHasura =
      process.env.BASE_URL_HASURA + process.env.URL_ID_CLI_HASURA;
    const response = await axios({
      method: "post",
      url: rutaObtenerIdCliHasura,
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
      },
      data: {
        _eq: nombre,
        _eq1: apellidoPaterno,
        _eq2: apellidoMaterno,
      },
    });
    

    if (response.status != 200) {
      return res.status(404).json({
        errors: [{ msg: "Error al obtener id_cli", code: "Error SKE-111-1" }],
      });
    }
    res.status(200).json({ data: response.data });
  } catch (error) {
    
    return res.status(500).json({
      errors: [{ msg: "Error al obtener id_cli", code: "Error SKE-111-2" }],
    });
  }
};

export const obtenerUnTarjetahabienteHasura = async (req, res) => {
  try {
    let { Record_Id } = req.body;
    const rutaObtenerTarjetahabiente =
      process.env.BASE_URL_HASURA +
      process.env.URL_OBTENER_UN_TARJETAHABIENTE_HASURA;
    const response = await axios({
      method: "post",
      url: rutaObtenerTarjetahabiente,
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
      },
      data: {
        Record_Id,
      },
    });
    

    if (response.status != 200) {
      return res.status(404).json({
        errors: [
          {
            msg: "Error al obtener tarjetahabiente hasura",
            code: "Error SKE-110-1",
          },
        ],
      });
    }
    res.status(200).json({ data: response.data });
  } catch (error) {
    
    return res.status(500).json({
      errors: [
        {
          msg: "Error al obtener tarjetahabiente hasura",
          code: "Error SKE-110-2",
        },
      ],
    });
  }
};

export const enviarFolioPreregistro = async (req, res) => {
  try {
    
    const { templateID, email, name, folio, senderName } = req.body;
    const rutaEnviarFolioPreregistro =
      process.env.BASE_URL_PRODUCCION +
      process.env.HOOK_ENVIAR_FOLIO_PREREGISTRO;
    const response = await axios({
      method: "post",
      url: rutaEnviarFolioPreregistro,
      data: {
        templateID,
        email,
        name,
        folio,
        senderName,
      },
    });
    
    
    if (response.data.reponse == "Error al enviar email API Mailjet") {
      return res.status(404).json({
        errors: [
          {
            msg: "Error al enviar el folio de preregistro. Intentelo más tarde.",
            code: "Error SKE-113-1",
          },
        ],
      });
    }
    res.status(200).json({ data: response.data });
  } catch (error) {
    
    return res.status(500).json({
      errors: [
        {
          msg: "Error al enviar el folio de preregistro. Intentelo más tarde.",
          code: "Error SKE-113-2",
        },
      ],
    });
  }
};

export const obtenerEmpleadosSucursal = async (req, res) => {
  try {
    const { sucursal } = req.body;
    const rutaObtenerEmpleadosSucursal =
      process.env.BASE_URL_HASURA + process.env.URL_CONSULTA_EMPLEADOS_SUCURSAL;
    const response = await axios({
      method: "post",
      url: rutaObtenerEmpleadosSucursal,
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
      },
      data: {
        sucursal: `${sucursal}`,
      },
    });
    

    if (response.status != 200) {
      return res.status(404).json({
        errors: [
          {
            msg: "Error al obtener lista de empleados",
            code: "Error SKE-117-1",
          },
        ],
      });
    }
    res.status(200).json({ data: response.data });
  } catch (error) {
    
    return res.status(500).json({
      errors: [
        { msg: "Error al obtener lista de empleados", code: "Error SKE-117-2" },
      ],
    });
  }
};

export const obtenerEmpleadosUsuarioSucursal = async (req, res) => {
  try {
    const { sucursal } = req.body;
    const rutaObtenerEmpleadosUsuarioSucursal =
      process.env.BASE_URL_HASURA +
      process.env.URL_CONSULTA_EMPLEADOS_USUARIO_SUCURSAL;
    const response = await axios({
      method: "post",
      url: rutaObtenerEmpleadosUsuarioSucursal,
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
      },
      data: {
        sucursal: sucursal,
      },
    });
    

    if (response.status != 200) {
      return res.status(404).json({
        errors: [
          {
            msg: "Error al consultar empleados y sus usuarios",
            code: "Error SKE-122-1",
          },
        ],
      });
    }
    res.status(200).json({ data: response.data });
  } catch (error) {
    
    return res.status(500).json({
      errors: [
        {
          msg: "Error al consultar empleados y sus usuarios",
          code: "Error SKE-122-2",
        },
      ],
    });
  }
};

export const obtenerCajeras = async (req, res) => {
  try {
    const { sucursal } = req.body;
    const rutaObtenerCajeras =
      process.env.BASE_URL_HASURA + process.env.URL_CONSULTA_CAJERAS;
    const response = await axios({
      method: "post",
      url: rutaObtenerCajeras,
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
      },
      data: {
        sucursal: sucursal,
      },
    });
    

    if (response.status != 200) {
      return res.status(404).json({
        errors: [
          {
            msg: "Error al obtener lista de cajeras",
            code: "Error SKE-117-1",
          },
        ],
      });
    }
    res.status(200).json({ data: response.data });
  } catch (error) {
    
    return res.status(500).json({
      errors: [
        { msg: "Error al obtener lista de cajeras", code: "Error SKE-117-2" },
      ],
    });
  }
};

export const guardarTarjetahabienteHasuraV2 = async (req, res) => {
  try {
    let {
      Record_Id,
      apellidoM,
      apellidoP,
      dioalta,
      division,
      email,
      fechaalta,
      fechanacim,
      fechaverfi,
      nombre,
      promotor,
      saldoc,
      sexo,
      tarjeta,
      telefono,
      verificoemail,
      cp,
      actcte,
      id_cli,
      preregistro,
      recomendo,
    } = req.body;
    const rutaGuardarTarjetahabienteHasura =
      process.env.BASE_URL_HASURA +
      process.env.URL_GUARDAR_TARJETAHABIENTE_HASURA_V2;
    const response = await axios({
      method: "post",
      url: rutaGuardarTarjetahabienteHasura,
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
      },
      data: {
        Record_Id,
        apellidoM,
        apellidoP,
        dioalta,
        division,
        email,
        fechaalta,
        fechanacim,
        fechaverfi,
        nombre,
        promotor,
        saldoc,
        sexo,
        tarjeta,
        telefono,
        verificoemail,
        cp,
        actcte,
        id_cli,
        preregistro,
        recomendo,
      },
    });
    

    if (response.status != 200) {
      return res.status(404).json({
        errors: [
          {
            msg: "Error al guardar tarjetahabiente hasura",
            code: "Error SKE-107-1",
          },
        ],
      });
    }
    res.status(200).json({ data: response.data });
  } catch (error) {
    
    return res.status(500).json({
      errors: [
        {
          msg: "Error al guardar tarjetahabiente hasura",
          code: "Error SKE-107-2",
        },
      ],
    });
  }
};

export const actualizarTarjetahabienteHasuraV2 = async (req, res) => {
  try {
    let {
      Record_Id,
      apellidoM,
      apellidoP,
      dioalta,
      division,
      email,
      fechaalta,
      fechanacim,
      fechaverfi,
      nombre,
      promotor,
      saldoc,
      sexo,
      tarjeta,
      telefono,
      verificoemail,
      cp,
      actcte,
      id_cli,
      preregistro,
      recomendo,
    } = req.body;
    const rutaActualizarTarjetahabienteHasura =
      process.env.BASE_URL_HASURA +
      process.env.URL_ACTUALIZAR_TARJETAHABIENTE_HASURA_V2;
    const response = await axios({
      method: "post",
      url: rutaActualizarTarjetahabienteHasura,
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
      },
      data: {
        Record_Id,
        apellidoM,
        apellidoP,
        dioalta,
        division,
        email,
        fechaalta,
        fechanacim,
        fechaverfi,
        nombre,
        promotor,
        saldoc,
        sexo,
        tarjeta,
        telefono,
        verificoemail,
        cp,
        actcte,
        id_cli,
        preregistro,
        recomendo,
      },
    });
    

    if (response.status != 200) {
      return res.status(404).json({
        errors: [
          {
            msg: "Error al actualizar tarjetahabiente hasura",
            code: "Error SKE-108-1",
          },
        ],
      });
    }
    res.status(200).json({ data: response.data });
  } catch (error) {
    
    // 
    return res.status(500).json({
      errors: [
        {
          msg: "Error al actualizar tarjetahabiente hasura",
          code: "Error SKE-108-2",
        },
      ],
    });
  }
};

export const obtenerTarjetahabientesHasuraV2 = async (req, res) => {
  try {
    const rutaObtenerTarjetahabientesHasura =
      process.env.BASE_URL_HASURA +
      process.env.URL_OBTENER_TARJETAHABIENTES_HASURA_V2;
    const response = await axios({
      method: "get",
      url: rutaObtenerTarjetahabientesHasura,
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
      },
    });
    

    if (response.status != 200) {
      return res.status(404).json({
        errors: [
          {
            msg: "Error al obtener tarjetahabientes",
            code: "Error SKE-112-1",
          },
        ],
      });
    }
    res.status(200).json({ data: response.data });
  } catch (error) {
    
    return res.status(500).json({
      errors: [
        { msg: "Error al obtener tarjetahabientes", code: "Error SKE-112-2" },
      ],
    });
  }
};

export const obtenerUnTarjetahabienteHasuraV2 = async (req, res) => {
  try {
    let { Record_Id } = req.body;
    const rutaObtenerTarjetahabiente =
      process.env.BASE_URL_HASURA +
      process.env.URL_OBTENER_UN_TARJETAHABIENTE_HASURA_V2;
    const response = await axios({
      method: "post",
      url: rutaObtenerTarjetahabiente,
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
      },
      data: {
        Record_Id,
      },
    });
    

    if (response.status != 200) {
      return res.status(404).json({
        errors: [
          {
            msg: "Error al obtener tarjetahabiente hasura",
            code: "Error SKE-110-1",
          },
        ],
      });
    }
    res.status(200).json({ data: response.data });
  } catch (error) {
    
    return res.status(500).json({
      errors: [
        {
          msg: "Error al obtener tarjetahabiente hasura",
          code: "Error SKE-110-2",
        },
      ],
    });
  }
};

export const obtenerTarjetaActivacion = async (req, res) => {
  try {
    const { tarjeta, fechaActual } = req.body;
    const rutaObtenerTarjetaActivacionHasura =
      process.env.BASE_URL_HASURA +
      process.env.URL_OBTENER_TARJETA_ACTIVACION_HASURA;
    const response = await axios({
      method: "post",
      url: rutaObtenerTarjetaActivacionHasura,
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
      },
      data: {
        tarjeta: tarjeta,
        fechaActual: fechaActual,
      },
    });
    

    if (response.status != 200) {
      return res.status(404).json({
        errors: [
          {
            msg: "Error al consultar tarjeta para activación",
            code: "Error SKE-120-1",
          },
        ],
      });
    }
    res.status(200).json({ data: response.data });
  } catch (error) {
    
    return res.status(500).json({
      errors: [
        {
          msg: "Error al consultar tarjeta para activación",
          code: "Error SKE-120-2",
        },
      ],
    });
  }
};

export const obtenerTarjetahabientesFecha = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.body;
    const rutaObtenerTarjetahbientesFechaHasura =
      process.env.BASE_URL_HASURA +
      process.env.URL_OBTENER_VERIFIACIONES_FECHA_HASURA;
    const response = await axios({
      method: "post",
      url: rutaObtenerTarjetahbientesFechaHasura,
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
      },
      data: {
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
      },
    });
    

    if (response.status != 200) {
      return res.status(404).json({
        errors: [
          {
            msg: "Error al consultar tarjethabientes por fecha",
            code: "Error SKE-119-1",
          },
        ],
      });
    }
    res.status(200).json({ data: response.data });
  } catch (error) {
    
    return res.status(500).json({
      errors: [
        {
          msg: "Error al consultar tarjethabientes por fecha",
          code: "Error SKE-119-2",
        },
      ],
    });
  }
};

export const activarTarjetaHasura = async (req, res) => {
  try {
    const { fecha_activacion, tarjeta } = req.body;
    const rutaActivarTarjetaHasura =
      process.env.BASE_URL_HASURA + process.env.URL_ACTIVAR_TARJETA_HASURA;
    const response = await axios({
      method: "post",
      url: rutaActivarTarjetaHasura,
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
      },
      data: {
        fecha_activacion: fecha_activacion,
        tarjeta: tarjeta,
      },
    });
    

    if (response.status != 200) {
      return res.status(404).json({
        errors: [
          {
            msg: "Error al actualizar tarjeta activada",
            code: "Error SKE-121-1",
          },
        ],
      });
    }
    res.status(200).json({ data: response.data });
  } catch (error) {
    
    return res.status(500).json({
      errors: [
        {
          msg: "Error al actualizar tarjeta activada",
          code: "Error SKE-121-2",
        },
      ],
    });
  }
};
export const obtenerTarjetasPreactivacion = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.body;
    
    
    const rutaObtenerTarjetasPreactivacion =
      process.env.BASE_URL_HASURA +
      process.env.URL_OBTENER_TARJETAS_PREACTIVACION;
    const response = await axios({
      method: "post",
      url: rutaObtenerTarjetasPreactivacion,
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
      },
      data: {
        fechaInicio,
        fechaFin,
      },
    });
    

    if (response.status != 200) {
      return res.status(404).json({
        errors: [
          {
            msg: "Error al obtener tarjetas preactivadas",
            code: "Error SKE-123-1",
          },
        ],
      });
    }
    res.status(200).json({ data: response.data });
  } catch (error) {
    
    return res.status(500).json({
      errors: [
        {
          msg: "Error al obtener tarjetas preactivadas",
          code: "Error SKE-123-2",
        },
      ],
    });
  }
};

export const enviarFormatoSk = (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const filePath = path.join(__dirname, "../pdfs/formatoSK.pdf");
  res.sendFile(filePath);
};

export const enviarCorreoMailjet = async (req, res) => {
  try {

    
    // tarjetClub, link
    const {
      destinatario,
      nombreDestinatario,
      asunto,
      nombreRemitente,
      remitente,
      template,
      variables,
      token
    } = req.body;


    const captchaObject = {
      event: {
        token: token,
        expectedAction: process.env.ACTION_MAILJET_SEND,
        siteKey: process.env.RECAPTCHA_API_KEY,
      },
    };

    
    const captchaResponse = await axios({
      method: "post",
      url: `${process.env.RECAPTCHA_BASE_URL}?key=${process.env.FIREBASE_API_KEY}`,
      data: captchaObject,
    });

    if(captchaResponse.status != 200 || !captchaResponse.data.tokenProperties.valid){
      return res.status(400).json({
        errors: [
          {
            msg: "La validación de reCAPTCHA falló.",
            code: "RECAPTCHA_ERROR_400",
          },
        ],
      });    
    }


    const mailjetApiKey = process.env.MAILJET_API_Key;
    const mailjetApiSecret = process.env.MAILJET_Secret_Key;
    const emailData = {
      Messages: [
        {
          From: {
            Email: remitente,
            Name: nombreRemitente,
          },
          To: [
            {
              Email: destinatario,
              Name: nombreDestinatario,
            },
          ],
          TemplateID: template,
          TemplateLanguage: true,
          Subject: asunto,
          Variables: variables,
        },
      ],
    };
    const response = await axios.post(
      "https://api.mailjet.com/v3.1/send",
      emailData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username: mailjetApiKey,
          password: mailjetApiSecret,
        },
      }
    );

    if (response.status != 200) {
      return res.status(404).json({
        errors: [
          {
            msg: "Error al enviar correo electrónico",
            code: "Error SKE-125-1",
          },
        ],
      });
    }

    
    res.status(200).json(response.data);
  } catch (error) {
    // console.error("Error al enviar el correo electrónico:", error);
    
    const errorMessage = "Error al enviar correo electrónico";
    const errorCode = "SKE-125-2";

    res.status(500).json({
      errors: [
        {
          msg: errorMessage,
          code: errorCode,
        },
      ],
    });
  }
};

export const enviarCodigoTwilio = async (req, res) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  let { phoneNumber, channel, token } = req.body;
  
  try {
    const captchaObject = {
      event: {
        token: token,
        expectedAction: process.env.ACTION_TWILIO_SEND,
        siteKey: process.env.RECAPTCHA_API_KEY,
      },
    };

    const captchaResponse = await axios({
      method: "post",
      url: `${process.env.RECAPTCHA_BASE_URL}?key=${process.env.FIREBASE_API_KEY}`,
      data: captchaObject,
    });

    if(captchaResponse.status != 200 || !captchaResponse.data.tokenProperties.valid){
      
      return res.status(400).json({
        errors: [
          {
            msg: "La validación de reCAPTCHA falló.",
            code: "RECAPTCHA_ERROR_400",
          },
        ],
      });    
    }

    phoneNumber = "+52" + phoneNumber;
    const client = twilio(accountSid, authToken);
    const verificationCode = await client.verify.v2
      .services(process.env.TWILIO_SERVICE)
      .verifications.create({ to: phoneNumber, channel: channel });

    
    

    if (verificationCode.status != "pending") {
      return res.status(404).json({
        errors: [
          {
            msg: error.message,
            code: error.code,
          },
        ],
      });
    }

    res.status(200).json({ verificationCode });
  } catch (error) {
    
    const errorMessage = twilioErrorsEspañol[error.code] || error.message;

    res.status(500).json({
      error: [
        "STATUS:" + error.status,
        "CODIGO:" + error.code,
        "MENSAJE:" + errorMessage,
      ],
      errors: [
        {
          msg: errorMessage,
          code: `Error SKE-${error.code}`,
        },
      ],
    });
  }
};

export const validarCodigoTwilio = async (req, res) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  let { phoneNumber, codenumber, token } = req.body;

  try {

    const captchaObject = {
      event: {
        token: token,
        expectedAction: process.env.ACTION_TWILIO_CONF,
        siteKey: process.env.RECAPTCHA_API_KEY,
      },
    };

    const captchaResponse = await axios({
      method: "post",
      url: `${process.env.RECAPTCHA_BASE_URL}?key=${process.env.FIREBASE_API_KEY}`,
      data: captchaObject,
    });

    if(captchaResponse.status != 200 || !captchaResponse.data.tokenProperties.valid){
      return res.status(400).json({
        errors: [
          {
            msg: "La validación de reCAPTCHA falló.",
            code: "RECAPTCHA_ERROR_400",
          },
        ],
      });    
    }


    phoneNumber = "+52" + phoneNumber;
    const client = twilio(accountSid, authToken);
    const verificationCode = await client.verify.v2
      .services(process.env.TWILIO_SERVICE)
      .verificationChecks.create({ to: phoneNumber, code: codenumber });

    
    

    if (
      verificationCode.status != "pending" &&
      verificationCode.status != "approved"
    ) {
      return res.status(404).json({
        errors: [
          {
            msg: "Error al verificar código de teléfono",
            code: "Error SKE-129-1",
          },
        ],
      });
    }

    if (verificationCode.status == "pending") {
      return res.status(404).json({
        errors: [
          {
            msg: "El código ingresado no coincide con el código de verificación",
          },
        ],
      });
    }

    res.status(200).json({ verificationCode });
  } catch (error) {
    const errorMessage = twilioErrorsEspañol[error.code] || error.message;
    
    res.status(500).json({
      errors: [
        {
          msg: errorMessage,
          code: `Error SKE-${error.code}`,
        },
      ],
    });
  }
};

export const editarTarjetahabienteHasura = async (req, res) => {
  try {
    let {
      Record_Id,
      apellidoM,
      apellidoP,
      dioalta,
      division,
      email,
      fechaalta,
      fechanacim,
      fechaverfi,
      nombre,
      promotor,
      sexo,
      telefono,
      verificoemail,
      cp,
    } = req.body;
    const rutaActualizarTarjetahabienteHasura =
      process.env.BASE_URL_HASURA + process.env.URL_EDICION_MANUAL_TARJETAS;
    const response = await axios({
      method: "post",
      url: rutaActualizarTarjetahabienteHasura,
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
      },
      data: {
        Record_Id,
        apellidoM,
        apellidoP,
        dioalta,
        division,
        email,
        fechaalta,
        fechanacim,
        fechaverfi,
        nombre,
        promotor,
        sexo,
        telefono,
        verificoemail,
        cp,
      },
    });
    

    if (response.status != 200) {
      return res.status(404).json({
        errors: [
          {
            msg: "Error al editar tarjetahabiente hasura",
            code: "SKE-131-1",
          },
        ],
      });
    }
    res.status(200).json({ data: response.data });
  } catch (error) {
    
    // 
    return res.status(500).json({
      errors: [
        {
          msg: "Error al editar tarjetahabiente hasura",
          code: "SKE-131-2",
        },
      ],
    });
  }
};

export const obtenerTarjetahabientesId = async (req, res) => {
  try {
    let { tarjeta } = req.body;
    const rutaConsultarTarjetahabienteHasuraId =
      process.env.BASE_URL_HASURA + process.env.URL_OBTENER_TARJETAHABIENTS_ID;
    const response = await axios({
      method: "post",
      url: rutaConsultarTarjetahabienteHasuraId,
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
      },
      data: {
        tarjeta,
      },
    });
    

    if (response.status != 200) {
      return res.status(404).json({
        errors: [
          {
            msg: "Error al consultar tarjetahabientes por tarjeta hasura",
            code: "SKE-133-1",
          },
        ],
      });
    }
    res.status(200).json({ data: response.data });
  } catch (error) {
    
    // 
    return res.status(500).json({
      errors: [
        {
          msg: "Error al consultar tarjetahabientes por tarjeta hasura",
          code: "SKE-133-2",
        },
      ],
    });
  }
};

export const login = (req, res) => {
  res.json({ ok: true });
};

export const register = (req, res) => {
  
  res.json({ ok: true });
};
