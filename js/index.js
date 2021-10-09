$(document).ready(function(){  
    cargaCategorias();
    var busquedaExterna = getvarlocal('busquedaExterna');
    if(busquedaExterna != "undefined" ) {
        $("#txt_busqueda").val(busquedaExterna);
    }
    else {
        
    }
    cargaProductos(); 
});