// importo las bibliotecas, archivos
import { SECRET_KEY_TOKEN } from "../config/config.js";
import jwt from "jsonwebtoken";

// exporto una funcion getIndex que va a manejar la solicitudes get del archivo index
export const getIndex = (req, res) => {
  //  pide el token
  const token = req.cookies.access_token;
  // si el token no existe, manda que no hay una sesion iniciada
  if (!token) {
    return res.render("index", {
      username: "undefined",
      message: "acceso no autorizado",
    });
  }
  try {
    // manda al usuario que hay una sesion iniciada
    const user = jwt.verify(token, SECRET_KEY_TOKEN);
    return res.render("index", user);
  } catch (e) {
    // se manejan los errores
    return res.render("index", { username: "undefined" });
  }
};

// exporto una funcion getLogin que va a manejar la solicitudes get del archivo login
export const getLogin = (req, res) => {
  //  pide el token
  const token = req.cookies.access_token;
  // si el token no existe, manda que no hay una sesion iniciada
  if (!token) {
    return res.render("login", {
      username: "undefined",
      errors: "acceso no autorizado",
    });
  }
  try {
    // manda al usuario que hay una sesion iniciada
    const user = jwt.verify(token, SECRET_KEY_TOKEN);
    return res.render("login", user, { errors: null });
  } catch (e) {
    // se manejan los errores
    return res.render("login", { errors: "Error al inicar sesion" });
  }
};

// exporto una funcion getRegister que va a manejar la solicitudes get del archivo register
export const getRegister = (req, res) => {
  // manda que no hay errores en el registro
  res.render("register", { errors: null });
};

// exporto una funcion getLogout que va a manejar la solicitudes get del archivo logout
export const getLogout = (req, res) => {
  // solo renderiza la pagina
  res.render("logout");
};
