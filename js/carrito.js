$(document).ready(function(){  
    if(valida_sesion()){
        traeCarrito();
    }
    else {
      window.location.href = "login.html";
    }    
});

function traeCarrito() {
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

function pintaCarrito(datos) {
  $("#filasproductos").empty();
  if(datos.hasOwnProperty('data')) {
    $.each(datos.data.items, function(i, dato) {
      var html_producto = $("#templateCarrito").html();
      html_producto = html_producto.replace('idUnicoProd', dato.product_id);
      html_producto = html_producto.replace('url_prod', dato.images_small);
      html_producto = html_producto.replace('pasaId', dato.product_id);
      html_producto = html_producto.replace('titulo_prod', dato.short_description);
      html_producto = html_producto.replace('descripcion_prod', dato.long_description);
      html_producto = html_producto.replace('precioU_prod', formatter.format(dato.price));
      html_producto = html_producto.replace('cantProducto', dato.quantity);
      html_producto = html_producto.replace('idUnicoCant01', dato.product_id);
      html_producto = html_producto.replace('idUnicoCant02', dato.product_id);
      html_producto = html_producto.replace('subtotal_prod',  formatter.format(dato.sub_total));
      $("#filasproductos").append(html_producto);
    });
    $("#subtotal_carrito").html(formatter.format(datos.data.sub_total));
    $("#iva_carrito").html(formatter.format(datos.data.taxes));
    $("#total_carrito").html(formatter.format(datos.data.total));
  }
  else {
    $("#informeBusqueda").text("No se encontró ningún producto");
  }
}

function eliminaproducto(idProd) {
    var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var raw = JSON.stringify({"session_id":localStorage.getItem("sesion_id"), "item_id":idProd});
  var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  fetch("http://35.167.62.109/storeutags/cart/remove_item", requestOptions)
  .then(response => response.json())
  .then(result => {
    traeCarrito();
    cargaCarrito(); 
  })
  .catch(error => console.log('error', error));
}

function cambiaCantidad(idprod, cant) {
    //alert("Voa cambiar"+idprod+"cantidad: "+cant);
    var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	var raw = JSON.stringify({"session_id":localStorage.getItem("sesion_id"), "item_id":idprod, "item_quantity":cant});
	var requestOptions = {
		method: 'PUT',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	};
	fetch("http://35.167.62.109/storeutags/cart/update_item", requestOptions)
	.then(response => response.json())
	.then(midata => {
		traeCarrito();
    cargaCarrito(); 
	})
	.catch(error => {
		//Si la petición falla o no responde el servidor
		alert('Ocurrió un problema insperado :(');
	});
}
function borraCarrito() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({"session_id":localStorage.getItem("sesion_id")});
    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch("http://35.167.62.109/storeutags/cart/remove_all", requestOptions)
    .then(response => response.json())
    .then(result => {
        cargaCarrito();
        traeCarrito();
    })
    .catch(error => console.log('error', error));
  }

function redirInicio() {
    location.href = "index.html";
}

function redirCheckout() {
    location.href = "checkout.html";
}