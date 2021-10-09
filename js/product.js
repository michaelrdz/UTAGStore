var idProducto = getvarlocal('idProd');
$(document).ready(function(){  
  cargaProducto();
});

function cargaProducto() {
  var urlAPI = "http://35.167.62.109/storeutags/catalogs/item_details/"+idProducto;
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  fetch(urlAPI, requestOptions)
    .then(response => response.json())
    .then(midata => {
      useTemplate(midata)
    })
    .catch(error => console.log('error', error));
}

function useTemplate(datos){
  $("#div_producto").empty();
  if(datos.hasOwnProperty('data')) {
    $.each(datos.data.items, function(i, dato) {
      var html_producto = $("#templateProducto").html();
      html_producto = html_producto.replace('renderTitulo', dato.short_description);
      html_producto = html_producto.replace('renderDescripcion', dato.long_description);
      html_producto = html_producto.replace('renderDetalle', dato.html_details);
      html_producto = html_producto.replace('renderPrecio', formatter.format(dato.price));
      html_producto = html_producto.replace('valIdProd', dato.product_id);
      $("#div_producto").append(html_producto);
    });
    sliderImgsTemplate(datos);
  }
  else {
    $("#informeBusqueda").text("No se encontró coincidencia");
  }
}

function sliderImgsTemplate(datos) {
  $("#div_slide").empty();
  $.each(datos.data.items[0].images_gallery, function (i, imgs) {
  var contsldier = '' +
               ' <img class="img-fluid slideImagen" alt="imagen '+ (i+1) +' del producto" onclick="sliderImgs(this);" src="'+ datos.data.items[0].images_gallery[i].image +'" id="smimg_'+ i +'">';
 $("#div_slide").append(contsldier);
  });
  $("#smimg_0").click();
}

function sliderImgs(imgs) {
  var expandImg = document.getElementById("expandedImg");
  var imgText = document.getElementById("imgtext");
  expandImg.src = imgs.src;
  imgText.innerHTML = imgs.alt;
  expandImg.parentElement.style.display = "block";
}

function addcarrito() {
  if(valida_sesion()){
    localStorage.removeItem("obj_carrito");
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({"session_id": localStorage.getItem("sesion_id"),"item_id":$('#txt_IdProd').val(),"item_quantity":$("#num_cant").val()});
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
  
    fetch("http://35.167.62.109/storeutags/cart/add_item", requestOptions)
      .then(response => response.json())
      .then(result => {
        if(result.status == "success") {
          //alert("Producto agregado exitosamente");
          cargaCarrito();
          mimensaje("", 2800);
        }
        else if(result.error_message == "SessionExpired") {
          alert("Su sesión a expirado, favor de iniciar sesión de nuevo");
          cerrar_sesion();
          localStorage.setItem("urlProd", document.URL);          
        }
        else {
          alert("Error al cargar a carrito, intentelo más tarde :(");
        }
      })
      .catch(error => console.log('error', error)); 
  }
  else {
    alert("Necesitas inicar sesión");
      localStorage.setItem("urlProd", document.URL);
      window.location.href = "login.html";
  }
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
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
  cargaCarrito();
}

function mimensaje(msg,duration)
{
 var alt = document.createElement("div");
     alt.setAttribute("style","background-color: white;width: 780px;height: 600px;position: absolute;top:0;bottom:0;left:0;right:0;margin:auto;border: 2px solid black; background-image: url(img/msj_carrito.gif); background-repeat: no-repeat; background-size: cover;");
     alt.innerHTML = msg;
     setTimeout(function(){
      alt.parentNode.removeChild(alt);
     },duration);
     document.body.appendChild(alt);
}
