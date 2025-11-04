export const basicAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Protected Area"');
    return res
      .status(401)
      .json({ errors: [{ code: 401, msg: "Se necesita autenticación" }] });
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  const [username, password] = credentials.split(":");

  if (
    username === process.env.VALID_USER &&
    password === process.env.VALID_PASS
  ) {
    next();
  } else {
    res.setHeader("WWW-Authenticate", 'Basic realm="Protected Area"');
    return res
      .status(401)
      .json({ errors: [{ code: 401, msg: "Credenciales inválidas" }] });
  }
};
