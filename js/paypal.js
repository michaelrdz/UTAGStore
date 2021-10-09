paypal.Buttons({
		
    locale: 'en_MX',	
    style: {
        size: 'responsive',
        color: 'gold',
        shape: 'rect',
        label: 'pay'
    },

    createOrder: function(data, actions) {								
        return actions.order.create({					
            purchase_units: [{
                amount: {
                    value: String($("#pintaTotal").html()).replace(/[$]/g,'')
                },
                description: 'Compra en Store UTAGS México',
                item: {
                    name: 'Compra en Store UTAGS México',
                    unit_amount: String($("#pintaTotal").html()).replace(/[$]/g,''),
                    quantity: '1'
                }
            }] 
            , application_context: { 
                shipping_preference: 'NO_SHIPPING',
                brand_name: 'Store UTAGS México' 
            } 
        }); 
    }, 

    onApprove: function(data, actions) {		
        mimensaje("", 3200);			
        return actions.order.capture().then(function(details) {						
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({"session_id": localStorage.getItem("sesion_id"), "paypal_payment_details": details });
            var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            };
            fetch("http://35.167.62.109/storeutags/order/create", requestOptions)
            .then(response => response.json())
            .then(datos => {
                //ocultar carrito
                $("#div_carrito").css('display', 'none');
                //mostrar vista pago aceptado
                $("#fechPago").html(datos.original_request.paypal_payment_details.create_time);
                $("#noPedido").html(datos.original_request.paypal_payment_details.id);
                $("#montoPago").html($("#pintaTotal").html());
                $("#vistaPagoAceptado").css('display', 'block');
                document.querySelector('#btn_carrito').innerHTML = "0";
            })
            .catch(error => {
                alert("Ocurrio un error al conectar a la API :(")
                console.log('error', error)
            });

        });
    }, 

    onError: function (err) {					
        alert("Ocurrió un errror en PayPal :( Intenta nuevamente.");	
    }, 

    onCancel: function (data, actions) {					
        alert("Operación cancelada :(");					
    }
    
}).render('#paypal-button-container');

function mimensaje(msg,duration)
{
 var alt = document.createElement("div");
     alt.setAttribute("style","background-color: white;width: 700px;height: 500px;position: absolute;top:0;bottom:0;left:0;right:0;margin:auto; background-image: url(img/cargando.gif); background-repeat: no-repeat; background-size: auto; background-position:center center;");
     alt.innerHTML = msg;
     setTimeout(function(){
      alt.parentNode.removeChild(alt);
     },duration);
     document.body.appendChild(alt);
}