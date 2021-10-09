const formClave = document.getElementById('formValidaClave');
const formNuevoPass = document.getElementById('formNuevoPass');
document.getElementById('correo').value = getvarlocal('email');
formClave.addEventListener('submit', function (e) {
	e.preventDefault();
	const formData = new FormData(this);
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	var raw = JSON.stringify({"email":formData.get("correo").toString(),"recovery_code":formData.get("clave").toString()});
	var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	};

	fetch("http://35.167.62.109/storeutags/security/validate_recovery_code", requestOptions)
	.then(response => response.json())
	.then(midata => {
		var rule = "";
		document.getElementById('rep_errores_cont').innerHTML = "";
		if(midata.status == "error"){
			rule = midata.error_message+"<br>";
			for(i in midata.violated_rules) {
				rule += midata.violated_rules[i].message+"<br>";
			}
			document.getElementById('rep_errores_cont').innerHTML = rule;
			if(rule == "") {
				var rule = "El correo o la clave son incorrectas";
				document.getElementById('rep_errores_cont').innerHTML = rule;
			}
		}
		else {
			document.getElementById("txt_clave").disabled = true;
			document.getElementById("btn_clave").style.display = "none";
			document.getElementById('div_nuevoPass').style.display = "block";
		}
	})
	.catch(error => console.log('error', error));
});

formNuevoPass.addEventListener('submit', function (e) {
	e.preventDefault();
	const formData = new FormData(this);
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	var raw = JSON.stringify({"email":document.getElementById("correo").value,"recovery_code":document.getElementById("txt_clave").value,"password":formData.get("password").toString(),"password_confirmation":formData.get("password_confirmation").toString()});
	var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	};

	fetch("http://35.167.62.109/storeutags/security/update_password", requestOptions)
	.then(response => response.json())
	.then(midata2 => {
		var rule = "";
		document.getElementById('rep_errores_cont2').innerHTML = "";
		if(midata2.status == "error"){
			//rule = midata2.error_message+"<br>";
			for(i in midata2.violated_rules) {
				rule += midata2.violated_rules[i].message+"<br>";
			}
			document.getElementById('rep_errores_cont2').innerHTML = rule;
		}
		else {
			alert('Contraseña cambiada exitosamente');
			document.getElementById('rep_errores_cont2').innerHTML = "";
			window.location = "login.html";
		}
	})
	.catch(error => console.log('error', error));
});