<?php

require_once "../controladores/servicios.controlador.php";
require_once "../modelos/servicios.modelo.php";

class AjaxServicios{

	/*=============================================
	EDITAR Servicio
	=============================================*/	

	public $idServicio;

	public function ajaxEditarServicio(){

		$item = "id";
		$valor = $this->idServicio;

		$respuesta = serviciosController::ctrMostrarServicios($item, $valor);
		//var_dump($respuesta);
		echo json_encode($respuesta);

	}
}

/*=============================================
EDITAR CATEGORÍA
=============================================*/	
if(isset($_POST["idServicio"])){

	$Servicio = new AjaxServicios();
	$Servicio -> idServicio = $_POST["idServicio"];
	$Servicio -> ajaxEditarServicio();
	//var_dump($_POST["idServicio"]);
}
