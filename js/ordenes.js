$(document).ready(function(){  
    if(valida_sesion()){
        traeOrdenes();
    }
    else {
      window.location.href = "login.html";
    }    
});

function traeOrdenes() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({"session_id": localStorage.getItem("sesion_id")});
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch("http://35.167.62.109/storeutags/order/get_orders", requestOptions)
      .then(response => response.json())
      .then(datos => {
        if(datos.hasOwnProperty('data')) {
            pintaOrdenes(datos);
          /*if(datos.data.items_quantity > 0) {
            pintaCarrito(datos);
          }
          else {
              window.location.href = "index.html";
          }*/
        }
        else {
          window.location.href = "login.html";
        }
      })
      .catch(error => console.log('error', error));
}

function pintaOrdenes(jsonData) {
    $("#filasordenes").empty();
    if(jsonData.hasOwnProperty('data')) {
        $.each(jsonData.data.orders, function(i, dato) {
        var html_producto = $("#templateOrdenes").html();
        html_producto = html_producto.replace('fechaOrden', dato.date_order);
        html_producto = html_producto.replace('totalOrden',  formatter.format(dato.total));
        html_producto = html_producto.replace('statusOrden', dato.status);
        html_producto = html_producto.replace('pedidoOrden', dato.paypal_order_id);
        html_producto = html_producto.replace('comentariosOrden', dato.comments);
        $("#filasordenes").append(html_producto);
        $("#total_ordenes").html(Object.keys(jsonData.data.orders).length);
    });
  }
  else {
    $("#informeBusqueda").text("No se encontró ningúna orden");
  }
}