// mando por medio de fetch la informacion
fetch("/logout", {
  // defino el metodo
  method: "POST",
  // defino los headers
  headers: {
    "Content-Type": "application/json",
  },
});
// terminado el proceso devuelvo despues de 2s al usuario a la pagina principal sin la sesion
setTimeout(() => {
  window.location.href = "/";
}, 2000);
