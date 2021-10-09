$(document).ready(function(){ 
	if(localStorage.getItem("UTemail") === null || localStorage.getItem("UTpassword") === null) {
	  document.getElementById("emial").value = localStorage.getItem("UTemail");
	  $("#general").show();
	}
	else{
	  document.getElementById("emial").value = localStorage.getItem("UTemail");
	  document.getElementById("password").value = localStorage.getItem("UTpassword");
	  $("#recuerdame").attr('checked', true);
	  $( "#btn_enviaForm" ).click();
	}
  });
const formularioLogin = document.getElementById('formLogin');
formularioLogin.addEventListener('submit', function (e) {
	e.preventDefault();
	const formData = new FormData(this);
	var myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		
		var raw = JSON.stringify({"email":formData.get("email").toString(),"password":formData.get("password").toString()});
		//var raw = JSON.stringify({"first_name":"prbMichael","middle_name":"prbRod","last_name":"prbMed","phone_number":"4495500008","address":{"city":"ags","state":"ags"},"email":"prb@prb.com","password":"1234","password_confirmation":"1234"});
		var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
		};

		fetch("http://35.167.62.109/storeutags/security/login", requestOptions)
		//.then(response => response.text())
		.then(response => response.json())
		.then(midata => {
			if(midata.status == "error"){
                document.getElementById('rep_errores_cont').innerHTML = "El correo o la contraseña es incorrecta";
			}
			else {
				document.getElementById('rep_errores_cont').innerHTML = "";
				if ($('#recuerdame').is(":checked")){
					localStorage.setItem("UTemail", formData.get("email"));
					localStorage.setItem("UTpassword", formData.get("password"));
				 } else {
					localStorage.removeItem("UTemail");
					localStorage.removeItem("UTpassword");
				 }
                localStorage.setItem("sesion_id", midata.data.session_id);
                localStorage.setItem("sesion_expirate", midata.data.session_expiration_date);
                localStorage.setItem("nombre_usuario", midata.data.customer.first_name +" "+midata.data.customer.last_name);
				//alert('Usuario existente, se puede iniciar sesión '+localStorage.getItem('nombre_usuario'));
                
				if(localStorage.getItem("urlProd") === null){
					window.location = "index.html";
				}
				else{
					var url = localStorage.getItem("urlProd");
					localStorage.removeItem("urlProd");
					window.location = url;
				}
				
			}
			
		})
		//.then(result => console.log(result))
		.catch(error => console.log('error', error));
});