// importo las bibliotecas, archivos
import jwt from "jsonwebtoken";
import { SECRET_KEY_TOKEN } from "../config/config.js";

//creo y exporto un middleware refreshCookie
export const refreshCookie = (req, res, next) => {
  // defino la vida maxima de la cookie (1h)
  const COOKIE_MAX_AGE = 1000 * 60 * 60;

  //se obtiene el token
  const token = req.cookies.access_token;

  //se valida el token
  if (token) {
    try {
      // se decodifica el token
      const decoded = jwt.verify(token, SECRET_KEY_TOKEN);

      //se calcula el tiempo que le falya al token para expirar
      const timeleft = decoded.exp * 1000 - Date.now();

      // si al token le queda menos de 1 min de vida se hace otro
      if (timeleft < 5 * 60 * 1000) {
        //se almacena el token en access_token
        const token = jwt.sign(
          { username: decoded.username },
          SECRET_KEY_TOKEN,
          { expiresIn: "1h" }
        );
        return res
          .cookie("access_token", token, {
            httpOnly: true, // La cookie solo se puede acceder desde el servidor
            secure: process.env.NODE_ENV !== "production", // La cookie solo se puede acceder en https
            sameSite: "strict", // La cookie solo se puede acceder en el mismo dominio
            maxAge: COOKIE_MAX_AGE, //La cookie solo tiene un tiempo de validez de 1 hora
            path: "/", // La cookie solo se puede acceder en la ruta principal
          })
          .json({ username: decoded.username });
      }
    } catch (e) {
      // en el caso de haber un error
      // elimina la cookie y responde un mensaje de error
      res
        .json({ error: "error al mantener la sesion" })
        .clearCookie("access_token");
      return;
    }
  }
  // next para que siga con las proximas partes del codigo
  next();
};
