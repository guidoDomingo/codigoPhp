<?php

 class serviciosController{

 	static public function ctrCrearServicio(){

		if(isset($_POST["nuevoServicio"])){

			if(preg_match('/^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ ]+$/', $_POST["nuevoServicio"]) &&
			   preg_match('/^[0-9]+$/', $_POST["precioServicio"])){

			   	$tabla = "servicios";

				$datos = array("descripcion" => $_POST["nuevoServicio"],
								"precio" => $_POST["precioServicio"]);

				$respuesta = ModeloServicios::mdlCrearServicio($tabla, $datos);

				if($respuesta == "ok"){

					echo'<script>

					swal({
						  type: "success",
						  title: "El servicio ha sido guardado correctamente",
						  showConfirmButton: true,
						  confirmButtonText: "Cerrar"
						  }).then(function(result){
									if (result.value) {

									window.location = "servicios";

									}
								})

					</script>';

				}else{

					echo'<script>

						swal({
							  type: "error",
							  title: "¡El servicio no puede ir vacía o llevar caracteres especiales!",
							  showConfirmButton: true,
							  confirmButtonText: "Cerrar"
							  }).then(function(result){
								if (result.value) {

								window.location = "servicios";

								}
							})

				  	</script>';

				}



			}	


	    }
	

	}

	/*=============================================
	MOSTRAR Servicios
	=============================================*/

	static public function ctrMostrarServicios($item, $valor){

		$tabla = "servicios";

		$respuesta = ModeloServicios::mdlMostrarServicio($tabla, $item, $valor);

		return $respuesta;
	
	}	


}	   
 