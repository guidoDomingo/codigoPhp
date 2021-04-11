<?php

class Conexion{

	static public function conectar(){

		$link = new PDO("mysql:host=localhost;dbname=posfactura",
			            "root",
			            "root");

		$link->exec("set names utf8");

		return $link;

	}

}