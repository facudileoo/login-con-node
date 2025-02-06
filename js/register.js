const $ = (el) => document.getElementById(el);

// defino el form y el result
const form = $("form");
const resultForm = $("result");

// creo una funcion updateErrors para mostar los errores que pasan en cada campo
const updateErrors = (divErrId, msgError) => {
  const divErr = $(`${divErrId}-error`);
  if (msgError) {
    divErr.textContent = msgError;
  } else {
    divErr.textContent = "";
  }
};

// hago que cada vez que se escriba en el campo el error se valla
$("email").addEventListener("input", () => {
  updateErrors("email", "");
});
$("password").addEventListener("input", () => {
  updateErrors("password", "");
});
$("checkPassword").addEventListener("input", () => {
  updateErrors("checkPassword", "");
});
$("username").addEventListener("input", () => {
  updateErrors("username", "");
});

// cuando se da submit en el form
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // creo un nuevo objeto form data
  const formData = new FormData(form);

  //hago un objeto data con la info del form
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
    checkPassword: formData.get("checkPassword"),
    username: formData.get("username"),
  };

  // mando por medio de fetch la informacion
  const res = await fetch("/register", {
    // defino el metodo
    method: "POST",
    // defino los headers
    headers: {
      "Content-Type": "application/json",
    },
    // defino el body
    body: JSON.stringify(data),
  });

  // recupero el resultado de la peticion fetch
  const result = await res.json();

  // verifico lo que me dijo el serividor y doy una respuesta adecuada
  if (result.message === "Registrando") {
    resultForm.textContent = "Registrando";
    setTimeout(() => {
      location.href = "/";
    }, 2000);
  } else if (result.errors === "El usuario ya existe") {
    updateErrors("email", "El usuario ya existe");
  } else if (result.errors === "Caracter invalido") {
    updateErrors(result.camp, "Caracter invalido");
  } else if (result.errors === "Las contraseñas no coinciden") {
    updateErrors("checkPassword", "Las contraseñas no coinciden");
  } else {
    const errors = result.errors || {};
    Object.keys(errors).forEach((key) => {
      updateErrors(key, errors[key]);
      return;
    });
  }
});
