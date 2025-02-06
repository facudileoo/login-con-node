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
$("password").addEventListener("input", (e) => {
  updateErrors("password", "");
});
$("username").addEventListener("input", (e) => {
  updateErrors("username", "");
});

// cuando se da submit en el form
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // creo un nuevo objeto form data
  const formData = new FormData(form);

  //hago un objeto data con la info del form
  const data = {
    password: formData.get("password"),
    username: formData.get("username"),
  };

  // mando por medio de fetch la informacion
  const res = await fetch("/login", {
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
  if (result.message === "Iniciando Sesion") {
    resultForm.textContent = "Iniciando Sesion";
    setTimeout(() => {
      location.href = "/";
    }, 2000);
    return;
  } else if (result.errors === "Contraseña incorrecta") {
    updateErrors("password", "Contraseña incorrecta");
    return;
  } else if (result.errors === "El usuario no existe") {
    updateErrors("username", "El usuario no existe");
    return;
  } else {
    resultForm.textContent = "Error al iniciar sesion";
    return;
  }
});
