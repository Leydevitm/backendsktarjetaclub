import "dotenv/config";
import express from "express";
import validacionRouter from "./routes/validacion.route.js";
import usuariosRouter from "./routes/usuarios.route.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
const whitelist = [
  process.env.ORIGIN1,
  process.env.ORIGIN2,
  process.env.ORIGIN3,
  process.env.ORIGIN4,
  process.env.ORIGIN5,
  process.env.ORIGIN6,
  process.env.ORIGIN7,
  process.env.ORIGIN8,
  process.env.ORIGIN9,
  process.env.ORIGIN10,
  process.env.ORIGIN11,
  process.env.ORIGIN12,
  process.env.ORIGIN13,
  process.env.ORIGIN14,
  process.env.ORIGIN15,
  process.env.ORIGIN16,
  process.env.ORIGIN17,
  process.env.ORIGIN18,
  process.env.ORIGIN19,
  process.env.ORIGIN20,
  process.env.ORIGIN21,
];
console.log(process.env.ORIGIN1);

app.use(
  cors({
    origin: function (origin, callback) {
      console.log(origin);
      if (!origin || whitelist.includes(origin)) {
        console.log("autorizado");
        return callback(null, origin);
      }
      return callback("Error de CORS origin: " + origin + ", no autorizado");
    },
  })
);

app.use(express.json());
app.use("/api/v1/validacion", validacionRouter);
app.use("/api/v1/usuarios", usuariosRouter);

app.get("/", (req, res) => {
  res.status(200).send("Hello World! From Back Validacion Tarjeta Club\n");
});

app.listen(PORT, () =>
  console.log("Servidor activo: http://localhost:" + PORT)
);
