// importo las bibliotecas, archivos
import { SECRET_KEY_TOKEN } from "../config/config.js";
import { schemaRegister } from "../schemas/schemas-form.js";
import { connection } from "../db/db.js";
import { UserRepository } from "../user-repository.js";
import jwt from "jsonwebtoken";

// exporto una funcion postLogin que va a manejar la solicitudes post del archivo login
export const postLogin = async (req, res) => {
  // recupero la data del form
  const data = req.body;
  // con una consulta sql verifico la existencia del usuario en la base de datos
  const existenciaUsuario = await connection.query(
    "SELECT * FROM users WHERE username = ?",
    [data.username]
  );
  // si no existe mando el error adecuado
  if (existenciaUsuario.length === 0) {
    return res.json({ errors: "El usuario no existe" });
  }

  try {
    // extraigo informacion del userRepository login
    const user = await UserRepository.login(data);

    // si userRepository login dice que la contraseña es incorrecta se lo comunico al usuario
    if (user.errors === "Contraseña incorrecta") {
      return res.json({ errors: "Contraseña incorrecta" });
    }

    // si esta todo bien creo un token para la sesion del usuario
    const token = jwt.sign(
      { user: user._id, username: data.username },
      SECRET_KEY_TOKEN,
      {
        expiresIn: "1h",
      }
    );
    // salio todo bien creo la cookie con el token y le comunico todo al user
    return res
      .cookie("access_token", token, {
        httpOnly: true, // La cookie solo se puede acceder desde el servidor
        secure: process.env.NODE_ENV !== "production", // La cookie solo se puede acceder en https
        sameSite: "strict", // La cookie solo se puede acceder en el mismo dominio
        //maxAge: 1000 * 60 * 60,  La cookie solo tiene un tiempo de validez de 1 hora
        path: "/", // La cookie solo se puede acceder en la ruta principal
      })
      .json({
        username: user.username,
        message: "Iniciando Sesion",
        token: token,
      });
  } catch (e) {
    // si algo sale mal se lo comunico al usuario
    return res.json({ errors: "Error al iniciar Sesion" });
  }
};

// exporto una funcion postRegister que va a manejar la solicitudes post del archivo register
export const postRegister = async (req, res) => {
  // recupero la informacion del formulario
  const data = req.body;

  // paso la informacion por un esquema que revise que esta todo bien
  const { error, value } = schemaRegister.validate(data, { abortEarly: false });

  // si hay algun error en la revision le mando los errores al usuario
  if (error) {
    const errors = {};
    error.details.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    return res.json({ errors });
  }

  // verifico que el usuario no exista
  const [existenciaUsuario] = await connection.query(
    "SELECT * FROM users WHERE email = ? OR username = ?",
    [data.email, data.username]
  );

  // si existe se lo comunico al usuario
  if (existenciaUsuario.length > 0) {
    return res.json({ errors: "El usuario ya existe" });
  }

  // si las contraseñas entre contraseña y check no coincide se lo comunico al usuario
  if (data.password !== data.checkPassword) {
    return res.json({ errors: "Las contraseñas no coinciden" });
  }

  // si hay un caracter invalido se lo comunico al usuario
  const caracterInvalido = /[\W_]/;
  if (caracterInvalido.test(data.password)) {
    return res.json({ errors: "Caracter invalido", camp: "password" });
  }
  if (caracterInvalido.test(data.username)) {
    return res.json({ errors: "Caracter invalido", camp: "username" });
  }

  // extraigo informacion del userRepository register
  const user = await UserRepository.register(data);
  try {
    // inserto el usuario en la base de datos
    await connection.query(
      "INSERT INTO users (id,email,password,username) VALUES (?,?,?,?)",
      [user._id, user.email, user.password, user.username]
    );
    // creo un token para la sesion del usuario
    const token = jwt.sign(
      { user: user._id, username: data.username },
      SECRET_KEY_TOKEN,
      {
        expiresIn: "1h",
      }
    );
    // salio todo bien creo la cookie con el token y le comunico todo al user
    return res
      .cookie("access_token", token, {
        httpOnly: true, // La cookie solo se puede acceder desde el servidor
        secure: process.env.NODE_ENV !== "production", // La cookie solo se puede acceder en https
        sameSite: "strict", // La cookie solo se puede acceder en el mismo dominio
        maxAge: 1000 * 60 * 60, // La cookie solo tiene un tiempo de validez de 1 hora
        path: "/", // La cookie solo se puede acceder en la ruta principal
      })
      .json({
        username: user.username,
        message: "Registrando",
        token: token,
      });
  } catch (e) {
    res.json({ error: "error al registarse" });
  }
};

// exporto una funcion postLogout que va a manejar la solicitudes post del archivo logout
export const postLogout = (req, res) => {
  // elimina la cookie y avisa al usuario que no hay mas sesion
  return res
    .clearCookie("access_token")
    .redirect("/")
    .json({ message: "Sesion cerrada", username: "undefined" });
};
