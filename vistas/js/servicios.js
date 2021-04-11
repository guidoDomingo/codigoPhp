/*=============================================
EDITAR Servicio
=============================================*/
$(".tablas").on("click", ".btnEditarServicio", function(){

	var idServicio = $(this).attr("idServicio");

  console.log(idServicio);

	var datos = new FormData();
	datos.append("idServicio", idServicio);
  console.log(datos);

	$.ajax({
  		url: "ajax/servicios.ajax.php",
  		method: "POST",
    	data: datos,
    	cache: false,
     	contentType: false,
     	processData: false,
     	dataType:"json",
     	success: function(respuesta){

        console.log(respuesta);

     		$("#editarNombreServicio").val(respuesta["descripcion"]);
     		$("#editarPrecioServicio").val(respuesta["precio"]);
        $("#idServicio").val(respuesta["id"]);

     	}

	})


});