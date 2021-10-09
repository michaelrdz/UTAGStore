document.getElementById("formularioRegistro").addEventListener('submit', validarFormulario);
var miForm = document.getElementById("formularioRegistro");
var txt_Errores = document.getElementById('rep_errores_cont');	


function validarFormulario(formulario){
	formulario.preventDefault();
	//Obtenemos la respuesta del captcha
	var response = grecaptcha.getResponse();
	//Evaluamos si se lleno el captcha
	if(response.length == 0){
		txt_Errores.innerHTML = txt_Errores.innerHTML+"<br>Captcha no verificado";
	} 
	else {
		//Validamos que todos los campos estén llenados
		if(miForm.checkValidity()){
			//Enviamos petición
			enviaPeticion();
		}
		else {
			//alert('fomulario no completo');
		}
	}	
}

function enviaPeticion() {
	const formData = new FormData(miForm);
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	var raw = JSON.stringify({"first_name":formData.get("first_name").toString(),"middle_name":formData.get("middle_name").toString(),"last_name":formData.get("last_name").toString(),"phone_number":formData.get("phone_number").toString(),"address":{"city":formData.get("city").toString(),"state":formData.get("state").toString()},"email":formData.get("email").toString(),"password":formData.get("password").toString(),"password_confirmation":formData.get("password_confirmation").toString()});
	//var raw = JSON.stringify({"first_name":"prbMichael","middle_name":"prbRod","last_name":"prbMed","phone_number":"4495500008","address":{"city":"ags","state":"ags"},"email":"prb@prb.com","password":"1234","password_confirmation":"1234"});
	var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	};
	fetch("http://35.167.62.109/storeutags/security/create_account", requestOptions)
	.then(response => response.json())
	.then(midata => {
		if(midata.status == "error"){
			if(midata.error_code == "DuplicatedAccount") {
				//Si la cuenta ya está regsitrada
				alert("Cuenta duplicada: Ya existe un usuario con este correo");
				txt_Errores.innerHTML =  txt_Errores.innerHTML +"<br>Cuenta duplicada: Ya existe un usuario con este correo";
			}
			else {
				//Si la API devuelve errores no contemplados
				var rule = "";
				for(i in midata.violated_rules) {
					rule += midata.violated_rules[i].message+"<br>";
					txt_Errores.innerHTML = txt_Errores.innerHTML +"<br>"+rule;
				}
			}
		}
		else {
			//Regitro exitoso
			alert('Registro exitoso, su id de usuario es: '+midata.data.customer_id);
			document.getElementById('rep_errores_cont').innerHTML = "";
			window.location = "login.html";
		}			
	})
	.catch(error => {
		//Si la petición falla o no responde el servidor
		alert('Ocurrió un problema insperado :(');
	});
}