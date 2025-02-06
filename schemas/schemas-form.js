import joi from "joi";

//esquema del registro de sesion
export const schemaRegister = joi.object({
  // requisitos del email
  email: joi.string().email().required().messages({
    "string.email": "El email es inválido.",
    "any.required": "Debes completar el email.",
  }),

  // Requisitos del password
  password: joi
    .string()
    .min(8)
    .max(30)
    .required()
    .pattern(/\d/, "número")
    .pattern(/[a-z]/, "letra minúscula")
    .pattern(/[A-Z]/, "letra mayúscula")
    .messages({
      "string.min": "La contraseña debe contener al menos 8 caracteres.",
      "string.max": "La contraseña debe contener un máximo de 30 caracteres.",
      "any.required": "Debes completar la contraseña.",
      "string.pattern.name": "La contraseña debe incluir {#name}.",
    }),

  // Requisitos del checkPassword
  checkPassword: joi.string().min(8).max(30).required().messages({
    "string.min":
      "La confirmación de contraseña debe contener al menos 8 caracteres.",
    "string.max":
      "La confirmación de contraseña debe contener un máximo de 30 caracteres.",
    "any.required": "Debes completar la confirmación de contraseña.",
  }),

  // Requisitos del username
  username: joi.string().min(4).max(50).required().messages({
    "string.min": "El username debe contener al menos 4 caracteres.",
    "string.max": "El username debe contener un máximo de 50 caracteres.",
    "any.required": "Debes completar el username.",
  }),
});
