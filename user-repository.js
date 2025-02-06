// importo las bibliotecas, archivos
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { SALT_ROUNDS } from "./config/config.js";
import { connection } from "./db/db.js";

// exporto una clase UserRepository
export class UserRepository {
  //creo una funcion estatica llamada register con el prop data que va a manejar una parte del registro de sesion
  static async register(data) {
    // hasheo la contraseña
    const hashPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    if (!hashPassword) {
      return { errors: "error con la contraseña" };
    }
    // creo un id random
    const id = crypto.randomUUID();
    //cre e objeto user con el id, email, contraseña hasheada y el username
    const user = {
      _id: id,
      email: data.email,
      password: hashPassword,
      username: data.username,
    };
    // retorno el user
    return user;
  }

  //creo una funcion estatica llamada login con el prop data que va a manejar una parte del inicio de sesion
  static async login(data) {
    // hago una consulta sql para revisar si el username existe en la base de datos
    const [user] = await connection.query(
      "SELECT * FROM users WHERE username = ?",
      [data.username]
    );

    // selecciono la contrasea del username que dijo el usuario
    const password = user[0].password;
    // comparo la contraseña hasheada con la que escribio el user
    const verificacionPassword = await bcrypt.compare(data.password, password);
    if (verificacionPassword) {
      // si son iguales
      return { message: "Iniciando Sesion", data };
    } else {
      //si son distintas
      return { errors: "Contraseña incorrecta" };
    }
  }
}
