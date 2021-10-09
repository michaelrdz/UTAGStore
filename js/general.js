$(document).ready(function(){ 
    if(valida_sesion()){
      document.getElementById("btn_sesionAct").innerHTML = "Cerrar sesión";
      cargaCarrito(); 
    }
    else{
      document.getElementById("btn_sesionAct").innerHTML = "Iniciar sesión";
    }
    var nombre = localStorage.getItem("nombre_usuario");
    document.getElementById("usr_name").innerHTML = nombre;
    $('#btn_sesionAct').click(function(event){
      event.preventDefault();
      if (localStorage.getItem("sesion_id") === null){              
        window.location.href = "login.html";
      } 
      else {
        cerrar_sesion();
        document.getElementById("btn_sesionAct").innerHTML = "Iniciar sesión";
        document.getElementById("usr_name").innerHTML = "";
      }
    });
});

function cerrar_sesion(){
    localStorage.removeItem("sesion_id");
    localStorage.removeItem("sesion_expirate");
    localStorage.removeItem("nombre_usuario");
    localStorage.removeItem("UTpassword");
    window.location.href = "login.html";
}

function valida_sesion() {
    if(localStorage.getItem("sesion_id") === null){
      return false;
    }
    else {
        return true;
    }
  }

function getvarlocal(varLocal) {
  varLocal = varLocal.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + varLocal + "=([^&#]*)"),
  results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function busquedaExterna() {
  //alert("envia: "+$("#txt_busqueda").val())
  window.location.href = "index.html?busquedaExterna="+$("#txt_busqueda").val();
}

function cargaCarrito(){
  //alert("carga carrito");
  var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({"session_id": localStorage.getItem("sesion_id")});
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch("http://35.167.62.109/storeutags/cart/get_details", requestOptions)
      .then(response => response.json())
      .then(datos => {
        if(datos.status == "success" && datos.data.items_quantity > 0){
          document.querySelector('#btn_carrito').innerHTML = datos.data.items_quantity;
          $('#urlCarrito').attr('href', "carrito.html");
        }
        else if(datos.error_message == "SessionExpired") {
          alert("Su sesión exipiró. Inicie sesión nuevamente");
          cerrar_sesion();
          document.querySelector('#btn_carrito').innerHTML = "?";
          $('#urlCarrito').attr('href', "login.html");
        }
        else {
          document.querySelector('#btn_carrito').innerHTML = "0";
        }
      })
      .catch(error => console.log('error', error));
}

var input = document.getElementById("txt_busqueda");
input.addEventListener("keyup", function(event) {
if (event.keyCode === 13) {
event.preventDefault();
document.getElementById("btn_buscar").click();
}
});

function redirHistorial() {
  location.href = "ordenes.html";
}

const formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2
});
  
/*const formatoMXN = (number) => {
    const exp = /(\d)(?=(\d{3})+(?!\d))/g;
    const rep = '$1,';
    let arr = number.toString().split('.');
    arr[0] = arr[0].replace(exp,rep);
    return arr[1] ? arr.join('.'): arr[0];
}*/