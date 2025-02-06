// importo las bibliotecas, archivos

import { Router } from "express";
import {
  postRegister,
  postLogin,
  postLogout,
} from "../controllers/postRoutsControlls.js";
import {
  getIndex,
  getLogin,
  getRegister,
  getLogout,
} from "../controllers/getControlls.js";

//defino Router
const router = Router();

// defino todas las rutas
router.get("/", getIndex);

router.get("/login", getLogin);

router.get("/register", getRegister);

router.get("/logout", getLogout);

router.post("/login", postLogin);

router.post("/register", postRegister);

router.post("/logout", postLogout);

//exporto router con las rutas
export default router;
