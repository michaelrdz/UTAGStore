$(document).ready(function(){  
    if(valida_sesion()){
        traeOreden();
    }
    else {
      window.location.href = "login.html";
    }    
});

function traeOreden() {
    ar myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({"session_id": localStorage.getItem("sesion_id")});
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch("http:// 35.167.62.109/storeutags/order/create", requestOptions)
      .then(response => response.json())
      .then(datos => {
        if(datos.hasOwnProperty('data')) {
          if(datos.data.items_quantity > 0) {
            pintaCarrito(datos);
          }
          else {
              window.location.href = "index.html";
          }
        }
        else {
          window.location.href = "login.html";
        }
      })
      .catch(error => console.log('error', error));
}
