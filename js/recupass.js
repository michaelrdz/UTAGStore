const formNuevoCorreo = document.getElementById('formNuevoCorreo');
formNuevoCorreo.addEventListener('submit', function (e) {
	e.preventDefault();
	var formCorreo = document.getElementById('inputCorreo').value;
	//const formData = new FormData(this);
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	var raw = JSON.stringify({"email":formCorreo});
	var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
};
	

	fetch("http://35.167.62.109/storeutags/security/request_recovery_code", requestOptions)
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
			alert('Se ha enviado una clave de recuperación a su correo');
			window.location = "codrecupass.html?email="+formCorreo;
		}
	})
	.catch(error => console.log('error', error));
});