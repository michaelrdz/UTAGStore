function cargaCategorias() {
  var urlAPI = "http://35.167.62.109/storeutags/catalogs/categories";
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };  
  fetch(urlAPI, requestOptions)
    .then(response => response.json())
    .then(midata => {
      CategoriasTemplate(midata)
    })
    .catch(error => console.log('error', error));
}

function cargaCategorias2(filtro) {
    var urlAPI = "http://35.167.62.109/storeutags/catalogs/items/by_category/"+filtro;
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

function cargaProductos() {
  var urlAPI = "http://35.167.62.109/storeutags/catalogs/items/by_text/"+$("#txt_busqueda").val();
  var requestOptions = {
  method: 'GET',
  redirect: 'follow'};
fetch(urlAPI, requestOptions)
  .then(response => response.json())
  .then(midata => {
    useTemplate(midata)
  })
  .catch(error => console.log('error', error));
}

function CategoriasTemplate(datos) {
   $("#div_categoria").empty();
   $.each(datos.data.categories, function (i, category) {
   var contCheckbox = '' +
                ' <div class="form-check">' +
                '   <input class="form-check-input almacenCategoria" type="checkbox" onchange="buscaCategoria();" name="categoria" value="' + category.description + '" id="categoria' + i + '">' +
                '   <label class="form-check-label" for="categoria' + i + '"> ' +
                '     ' + category.description + 
                '   </label>' + 
                ' </div>';
  $("#div_categoria").append(contCheckbox);
   });
}

function buscaCategoria() {
  var categoriasChecadas = '';
  $(".almacenCategoria").each(function(element, index, set){
    if ($(this).prop("checked")) {
      categoriasChecadas = categoriasChecadas + this.value + ';';
    }
  });
  cargaCategorias2(categoriasChecadas);       
}

function useTemplate(datos){
    $("#div_productos").empty();
    if(datos.hasOwnProperty('data')) {
      var countItems = Object.keys(datos.data.items).length;
      $("#informeBusqueda").text(countItems+" productos encontrados");
      $.each(datos.data.items, function(i, dato) {
        var html_producto = $("#templateProductos").html();
        html_producto = html_producto.replace('pasaId', dato.product_id);
        html_producto = html_producto.replace('renderTitulo', dato.short_description);
        html_producto = html_producto.replace('renderImagen', dato.images_small);
        html_producto = html_producto.replace('renderDescripcion', dato.long_description);
        html_producto = html_producto.replace('renderPrecio', formatter.format(dato.price));
        $("#div_productos").append(html_producto);
    });
    }
    else {
      $("#informeBusqueda").text("No se encontró coincidencia");
    }
}