<?php

require_once "conexion.php";

class ModeloServicios{

	/*=============================================
	CREAR Servicios
	=============================================*/

	static public function mdlCrearServicio($tabla, $datos){

		$stmt = Conexion::conectar()->prepare("INSERT INTO $tabla (descripcion,precio) VALUES (:descripcion,:precio)");

		$stmt->bindParam(":descripcion", $datos["descripcion"], PDO::PARAM_STR);
		$stmt->bindParam(":precio", $datos["precio"], PDO::PARAM_INT);

		if($stmt->execute()){

			return "ok";

		}else{

			return "error";
		
		}

		$stmt->close();
		$stmt = null;

	}

	static public function mdlMostrarServicio($tabla, $item , $valor){
		if($item != null){

			$stmt = Conexion::conectar()->prepare("SELECT * FROM $tabla WHERE $item = :$item");

			$stmt -> bindParam(":".$item, $valor, PDO::PARAM_STR);

			$stmt -> execute();

			return $stmt -> fetch();

		}else{

			$stmt = Conexion::conectar()->prepare("SELECT * FROM $tabla");

			$stmt -> execute();

			return $stmt -> fetchAll();

		}

		$stmt -> close();

		$stmt = null;
	}

}
