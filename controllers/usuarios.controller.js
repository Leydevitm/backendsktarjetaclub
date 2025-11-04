import axios from "axios";
import { adminApp } from "../firebase.js";
import { getAuth } from "firebase-admin/auth";

export const login = (req, res) => {
  res.json({ ok: true });
};

export const register = (req, res) => {
  console.log(req.body);
  res.json({ ok: true });
};

export const crearCuentaUsuario = async (req, res) => {
  try {
    const { correo, contraseña, nombre } = req.body;
    const usuario = await getAuth(adminApp).createUser({
      email: correo,
      password: contraseña,
      displayName: nombre,
    });

    return res.status(200).json({ data: usuario });

    // if (response.data.reponse == "Error al enviar email API Mailjet") {
    //     return res.status(404).json({ errors: [{ msg: "Error al enviar el folio de preregistro. Intentelo más tarde.", code: "Error SKE-113-1" }] });
    // }
    // res.status(200).json({ data: response.data })
  } catch (error) {
    if (error.errorInfo.code == "auth/email-already-exists") {
      return res.status(500).json({
        errors: [
          {
            msg: "La cuenta proporcionada ya existe.",
            code: "Oops...",
          },
        ],
      });
    }

    return res.status(500).json({
      errors: [
        {
          msg: "Error al crear cuenta de usuario Firebase.",
          code: "Error SKE-114-1",
        },
      ],
    });
  }
};

export const consultarAccesosUsuario = async (req, res) => {
  try {
    const { usuario, contraseña } = req.body;
    const rutaObtenerAccesosUsuario =
      process.env.BASE_URL_HASURA +
      process.env.URL_ID_OBTENER_ACCESOS_USUARIO_HASURA;
    const response = await axios({
      method: "post",
      url: rutaObtenerAccesosUsuario,
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
      },
      data:{
        _usuario: usuario,
        _contrasena: contraseña,
      }
    });
    console.log(response);

    if (response.status != 200) {
      return res
        .status(404)
        .json({
          errors: [
            { msg: "Error al verificar credenciales", code: "Error SKE-116-1" },
          ],
        });
    }
    res.status(200).json({ data: response.data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        errors: [
          { msg: "Error al verificar credenciales", code: "Error SKE-116-2" },
        ],
      });
  }
};
