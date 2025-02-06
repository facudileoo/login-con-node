// importo el modelo de db
import mysql from "mysql2/promise";

// creo un objeto con la configuracion de la db
const configuracion = {
  host: "localhost", // o la dirección IP de tu servidor MySQL
  user: "root", // tu usuario de MySQL
  port: 3306, // puerto de la base de datos
  password: "", // tu contraseña de MySQL
  database: "formdb", // el nombre de tu base de datos
};

// Configura y exporta la conexión a la base de datos
export const connection = await mysql.createConnection(configuracion);
