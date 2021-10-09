$(document).ready(function(){  
    if(valida_sesion()){
        traeCheckout();
    }
    else {
      window.location.href = "login.html";
    }    
});

function traeCheckout() {
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
        if(datos.hasOwnProperty('data')) {
          if(datos.data.items_quantity > 0) {
            pintaCheckout(datos);
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

function pintaCheckout(datos) {
    $("#filasCheckout").empty();
    if(datos.hasOwnProperty('data')) {
      $.each(datos.data.items, function(i, dato) {
        var html_producto = $("#templateCarrito").html();
        html_producto = html_producto.replace('CantidadProducto', dato.quantity);
        html_producto = html_producto.replace('NombreProducto', dato.short_description);
        $("#filasCheckout").append(html_producto);
      });
      $("#pintaSubtotal").html(formatter.format(datos.data.sub_total));
      $("#pintaIVA").html(formatter.format(datos.data.taxes));
      $("#pintaTotal").html(formatter.format(datos.data.total));
    }
    else {
      $("#informeBusqueda").text("No se encontró ningún producto");
    }
  }

function redirInicio() {
    location.href = "index.html";
}

function animamsj() {
    mimensaje("", 3200);
}