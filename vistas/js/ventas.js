/*=============================================
CARGAR LA TABLA DINÁMICA DE VENTAS
=============================================*/

// $.ajax({

// 	url: "ajax/datatable-ventas.ajax.php",
// 	success:function(respuesta){
		
// 		console.log("respuesta", respuesta);

// 	}

// })// 

// @ts-ignore
$('.tablaVentas').DataTable( {
    "ajax": "ajax/datatable-ventas.ajax.php",
    "deferRender": true,
	"retrieve": true,
	"processing": true,
	 "language": {

			"sProcessing":     "Procesando...",
			"sLengthMenu":     "Mostrar _MENU_ registros",
			"sZeroRecords":    "No se encontraron resultados",
			"sEmptyTable":     "Ningún dato disponible en esta tabla",
			"sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_",
			"sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0",
			"sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
			"sInfoPostFix":    "",
			"sSearch":         "Buscar:",
			"sUrl":            "",
			"sInfoThousands":  ",",
			"sLoadingRecords": "Cargando...",
			"oPaginate": {
			"sFirst":    "Primero",
			"sLast":     "Último",
			"sNext":     "Siguiente",
			"sPrevious": "Anterior"
			},
			"oAria": {
				"sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
				"sSortDescending": ": Activar para ordenar la columna de manera descendente"
			}

	}

} );

/*=============================================
AGREGANDO PRODUCTOS A LA VENTA DESDE LA TABLA
=============================================*/

// @ts-ignore
$(".tablaVentas tbody").on("click", "button.agregarProducto", function(){

	// @ts-ignore
	var idProducto = $(this).attr("idProducto");

	// @ts-ignore
	$(this).removeClass("btn-primary agregarProducto");

	// @ts-ignore
	$(this).addClass("btn-default");

	var datos = new FormData();
    datos.append("idProducto", idProducto);

     // @ts-ignore
     $.ajax({

     	url:"ajax/productos.ajax.php",
      	method: "POST",
      	data: datos,
      	cache: false,
      	contentType: false,
      	processData: false,
      	dataType:"json",
      	success:function(respuesta){
      		console.log(respuesta);

      	    var descripcion = respuesta["descripcion"];
          	var stock = respuesta["stock"];
          	var precio = respuesta["precio_venta"];
          	var precio_compra = respuesta["precio_compra"];
          	console.log(precio_compra);

          	/*=============================================
          	EVITAR AGREGAR PRODUTO CUANDO EL STOCK ESTÁ EN CERO
          	=============================================*/

          	if(stock == 0){

      			// @ts-ignore
      			swal({
			      title: "No hay stock disponible",
			      type: "error",
			      confirmButtonText: "¡Cerrar!"
			    });

			    // @ts-ignore
			    $("button[idProducto='"+idProducto+"']").addClass("btn-primary agregarProducto");

			    return;

          	}

          	// @ts-ignore
          	$(".nuevoProducto").append(
			
			`
			<div class="row" style="padding:5px 15px">

			  <!-- Descripción del producto -->
	          
	          <div class="col-xs-6" style="padding-right:0px">
	          
	            <div class="input-group">
	              
	              <span class="input-group-addon"><button type="button" class="btn btn-danger btn-xs quitarProducto" idProducto="${idProducto}"><i class="fa fa-times"></i></button></span>

	              <input type="text" class="form-control nuevaDescripcionProducto" idProducto="${idProducto}" name="agregarProducto" value="${descripcion}" readonly required>

	            </div>

	          </div>

	          <!-- Cantidad del producto -->

	          <div class="col-xs-3">
	            
	             <input type="number" class="form-control nuevaCantidadProducto" name="nuevaCantidadProducto" min="1" value="1" stock="${stock}" nuevoStock="${Number(stock-1)}" required>

	          </div> 

	          <!-- Precio del producto -->

	          <div class="col-xs-3 ingresoPrecio" style="padding-left:0px">

	            <div class="input-group">

	              <span class="input-group-addon"><i class="ion ion-social-usd"></i></span>
	                 
	              <input type="text" class="form-control nuevoPrecioProducto" precioNeto="${precio_compra}" precioReal="${precio}" name="nuevoPrecioProducto" value="${precio}" readonly required>
	 
	            </div>
	             
	          </div>

	        </div>
			
			`
			  )
          	

	        // SUMAR TOTAL DE PRECIOS

	        sumarTotalPrecios()

	        // AGREGAR IMPUESTO

	        agregarImpuesto()

	        // AGRUPAR PRODUCTOS EN FORMATO JSON

	        listarProductos()

	        // PONER FORMATO AL PRECIO DE LOS PRODUCTOS

	        // @ts-ignore
	        $(".nuevoPrecioProducto").number(true, 2);


			localStorage.removeItem("quitarProducto");

      	}

     })

});

/*=============================================
CUANDO CARGUE LA TABLA CADA VEZ QUE NAVEGUE EN ELLA
=============================================*/

// @ts-ignore
$(".tablaVentas").on("draw.dt", function(){

	if(localStorage.getItem("quitarProducto") != null){

		var listaIdProductos = JSON.parse(localStorage.getItem("quitarProducto"));

		for(var i = 0; i < listaIdProductos.length; i++){

			// @ts-ignore
			$("button.recuperarBoton[idProducto='"+listaIdProductos[i]["idProducto"]+"']").removeClass('btn-default');
			// @ts-ignore
			$("button.recuperarBoton[idProducto='"+listaIdProductos[i]["idProducto"]+"']").addClass('btn-primary agregarProducto');

		}


	}


})


/*=============================================
QUITAR PRODUCTOS DE LA VENTA Y RECUPERAR BOTÓN
=============================================*/

var idQuitarProducto = [];

localStorage.removeItem("quitarProducto");

// @ts-ignore
$(".formularioVenta").on("click", "button.quitarProducto", function(){

	// @ts-ignore
	$(this).parent().parent().parent().parent().remove();

	// @ts-ignore
	var idProducto = $(this).attr("idProducto");

	/*=============================================
	ALMACENAR EN EL LOCALSTORAGE EL ID DEL PRODUCTO A QUITAR
	=============================================*/

	if(localStorage.getItem("quitarProducto") == null){

		idQuitarProducto = [];
	
	}else{

		idQuitarProducto.concat(localStorage.getItem("quitarProducto"))

	}

	idQuitarProducto.push({"idProducto":idProducto});

	localStorage.setItem("quitarProducto", JSON.stringify(idQuitarProducto));

	// @ts-ignore
	$("button.recuperarBoton[idProducto='"+idProducto+"']").removeClass('btn-default');

	// @ts-ignore
	$("button.recuperarBoton[idProducto='"+idProducto+"']").addClass('btn-primary agregarProducto');

	// @ts-ignore
	if($(".nuevoProducto").children().length == 0){

		// @ts-ignore
		$("#nuevoImpuestoVenta").val(0);
		// @ts-ignore
		$("#nuevoTotalVenta").val(0);
		// @ts-ignore
		$("#totalVenta").val(0);
		// @ts-ignore
		$("#nuevoTotalVenta").attr("total",0);

	}else{

		// SUMAR TOTAL DE PRECIOS

    	sumarTotalPrecios()

    	// AGREGAR IMPUESTO
	        
        agregarImpuesto()

        // AGRUPAR PRODUCTOS EN FORMATO JSON

        listarProductos()

	}

})

/*=============================================
AGREGANDO PRODUCTOS DESDE EL BOTÓN PARA DISPOSITIVOS
=============================================*/

var numProducto = 0;

// @ts-ignore
$(".btnAgregarProducto").click(function(){

	numProducto ++;

	var datos = new FormData();
	datos.append("traerProductos", "ok");

	// @ts-ignore
	$.ajax({

		url:"ajax/productos.ajax.php",
      	method: "POST",
      	data: datos,
      	cache: false,
      	contentType: false,
      	processData: false,
      	dataType:"json",
      	success:function(respuesta){
      	    
      	    	// @ts-ignore
      	    	$(".nuevoProducto").append(

          	'<div class="row" style="padding:5px 15px">'+

			  '<!-- Descripción del producto -->'+
	          
	          '<div class="col-xs-6" style="padding-right:0px">'+
	          
	            '<div class="input-group">'+
	              
	              '<span class="input-group-addon"><button type="button" class="btn btn-danger btn-xs quitarProducto" idProducto><i class="fa fa-times"></i></button></span>'+

	              '<select class="form-control nuevaDescripcionProducto" id="producto'+numProducto+'" idProducto name="nuevaDescripcionProducto" required>'+

	              '<option>Seleccione el producto</option>'+

	              '</select>'+  

	            '</div>'+

	          '</div>'+

	          '<!-- Cantidad del producto -->'+

	          '<div class="col-xs-3 ingresoCantidad">'+
	            
	             '<input type="number" class="form-control nuevaCantidadProducto" name="nuevaCantidadProducto" min="1" value="0" stock nuevoStock required>'+

	          '</div>' +

	          '<!-- Precio del producto -->'+

	          '<div class="col-xs-3 ingresoPrecio" style="padding-left:0px">'+

	            '<div class="input-group">'+

	              '<span class="input-group-addon"><i class="ion ion-social-usd"></i></span>'+
	                 
	              '<input type="text" class="form-control nuevoPrecioProducto" precioNeto="" precioReal="" name="nuevoPrecioProducto" readonly required>'+
	 
	            '</div>'+
	             
	          '</div>'+

	        '</div>');


	        // AGREGAR LOS PRODUCTOS AL SELECT 

	         respuesta.forEach(funcionForEach);

	         // @ts-ignore
	         function funcionForEach(item, index){

	         	if(item.stock != 0){

		         	// @ts-ignore
		         	$("#producto"+numProducto).append(

						'<option idProducto="'+item.id+'" value="'+item.descripcion+'">'+item.descripcion+'</option>'
		         	)

		         
		         }

		         

	         }

        	 // SUMAR TOTAL DE PRECIOS

    		sumarTotalPrecios()

    		// AGREGAR IMPUESTO
	        
	        agregarImpuesto()

	        // PONER FORMATO AL PRECIO DE LOS PRODUCTOS

	        // @ts-ignore
	        $(".nuevoPrecioProducto").number(true, 2);


      	}

	})

})

/*=============================================
SELECCIONAR PRODUCTO
=============================================*/

// @ts-ignore
$(".formularioVenta").on("change", "select.nuevaDescripcionProducto", function(){

	// @ts-ignore
	var nombreProducto = $(this).val();

	// @ts-ignore
	var nuevaDescripcionProducto = $(this).parent().parent().parent().children().children().children(".nuevaDescripcionProducto");

	// @ts-ignore
	var nuevoPrecioProducto = $(this).parent().parent().parent().children(".ingresoPrecio").children().children(".nuevoPrecioProducto");

	// @ts-ignore
	var nuevaCantidadProducto = $(this).parent().parent().parent().children(".ingresoCantidad").children(".nuevaCantidadProducto");

	var datos = new FormData();
    datos.append("nombreProducto", nombreProducto);


	  // @ts-ignore
	  $.ajax({

     	url:"ajax/productos.ajax.php",
      	method: "POST",
      	data: datos,
      	cache: false,
      	contentType: false,
      	processData: false,
      	dataType:"json",
      	success:function(respuesta){
      	    
      	     // @ts-ignore
      	     $(nuevaDescripcionProducto).attr("idProducto", respuesta["id"]);
      	    // @ts-ignore
      	    $(nuevaCantidadProducto).attr("stock", respuesta["stock"]);
      	    // @ts-ignore
      	    $(nuevaCantidadProducto).attr("nuevoStock", Number(respuesta["stock"])-1);
      	    // @ts-ignore
      	    $(nuevoPrecioProducto).val(respuesta["precio_venta"]);
      	    // @ts-ignore
      	    $(nuevoPrecioProducto).attr("precioReal", respuesta["precio_venta"]);
      	    // @ts-ignore
      	    $(nuevoPrecioProducto).attr("precioNeto", respuesta["precio_compra"]);

  	      // AGRUPAR PRODUCTOS EN FORMATO JSON

	        listarProductos()

      	}

      })
})

/*=============================================
MODIFICAR LA CANTIDAD
=============================================*/

// @ts-ignore
$(".formularioVenta").on("change", "input.nuevaCantidadProducto", function(){

	// @ts-ignore
	var precio = $(this).parent().parent().children(".ingresoPrecio").children().children(".nuevoPrecioProducto");

	// @ts-ignore
	var precioFinal = $(this).val() * precio.attr("precioReal");
	
	precio.val(precioFinal);

	// @ts-ignore
	var nuevoStock = Number($(this).attr("stock")) - $(this).val();

	// @ts-ignore
	$(this).attr("nuevoStock", nuevoStock);

	// @ts-ignore
	if(Number($(this).val()) > Number($(this).attr("stock"))){

		/*=============================================
		SI LA CANTIDAD ES SUPERIOR AL STOCK REGRESAR VALORES INICIALES
		=============================================*/

		// @ts-ignore
		$(this).val(0);

		// @ts-ignore
		$(this).attr("nuevoStock", $(this).attr("stock"));

		// @ts-ignore
		var precioFinal = $(this).val() * precio.attr("precioReal");

		precio.val(precioFinal);

		sumarTotalPrecios();

		// @ts-ignore
		swal({
	      title: "La cantidad supera el Stock",
	      // @ts-ignore
	      text: "¡Sólo hay "+$(this).attr("stock")+" unidades!",
	      type: "error",
	      confirmButtonText: "¡Cerrar!"
	    });

	    return;

	}

	// SUMAR TOTAL DE PRECIOS

	sumarTotalPrecios()

	// AGREGAR IMPUESTO
	        
    agregarImpuesto()

    // AGRUPAR PRODUCTOS EN FORMATO JSON

    listarProductos()

})

/*=============================================
SUMAR TODOS LOS PRECIOS
=============================================*/

function sumarTotalPrecios(){

	// @ts-ignore
	var precioItem = $(".nuevoPrecioProducto");
	
	var arraySumaPrecio = [];  

	for(var i = 0; i < precioItem.length; i++){

		 // @ts-ignore
		 arraySumaPrecio.push(Number($(precioItem[i]).val()));
		
		 
	}

	function sumaArrayPrecios(total, numero){

		return total + numero;

	}

	var sumaTotalPrecio = arraySumaPrecio.reduce(sumaArrayPrecios);
	
	// @ts-ignore
	$("#nuevoTotalVenta").val(sumaTotalPrecio);
	// @ts-ignore
	$("#totalVenta").val(sumaTotalPrecio);
	// @ts-ignore
	$("#nuevoTotalVenta").attr("total",sumaTotalPrecio);


}

/*=============================================
FUNCIÓN AGREGAR IMPUESTO
=============================================*/

function agregarImpuesto(){

	// @ts-ignore
	var impuesto = $("#nuevoImpuestoVenta").val();
	// @ts-ignore
	var precioTotal = $("#nuevoTotalVenta").attr("total");

	var precioImpuesto = Number(precioTotal * impuesto/100);

	var totalConImpuesto = Number(precioImpuesto) + Number(precioTotal);
	
	// @ts-ignore
	$("#nuevoTotalVenta").val(totalConImpuesto);

	// @ts-ignore
	$("#totalVenta").val(totalConImpuesto);

	// @ts-ignore
	$("#nuevoPrecioImpuesto").val(precioImpuesto);

	// @ts-ignore
	$("#nuevoPrecioNeto").val(precioTotal);

}

/*=============================================
CUANDO CAMBIA EL IMPUESTO
=============================================*/

// @ts-ignore
$("#nuevoImpuestoVenta").change(function(){

	agregarImpuesto();

});

/*=============================================
FORMATO AL PRECIO FINAL
=============================================*/

// @ts-ignore
$("#nuevoTotalVenta").number(true, 2);

/*=============================================
SELECCIONAR MÉTODO DE PAGO
=============================================*/

// @ts-ignore
$("#nuevoMetodoPago").change(function(){

	// @ts-ignore
	var metodo = $(this).val();

	if(metodo == "Efectivo"){

		// @ts-ignore
		$(this).parent().parent().removeClass("col-xs-6");

		// @ts-ignore
		$(this).parent().parent().addClass("col-xs-4");

		// @ts-ignore
		$(this).parent().parent().parent().children(".cajasMetodoPago").html(

			 '<div class="col-xs-4">'+ 

			 	'<div class="input-group">'+ 

			 		'<span class="input-group-addon"><i class="ion ion-social-usd"></i></span>'+ 

			 		'<input type="text" class="form-control" id="nuevoValorEfectivo" placeholder="000000" required>'+

			 	'</div>'+

			 '</div>'+

			 '<div class="col-xs-4" id="capturarCambioEfectivo" style="padding-left:0px">'+

			 	'<div class="input-group">'+

			 		'<span class="input-group-addon"><i class="ion ion-social-usd"></i></span>'+

			 		'<input type="text" class="form-control" id="nuevoCambioEfectivo" placeholder="000000" readonly required>'+

			 	'</div>'+

			 '</div>'

		 )

		// Agregar formato al precio

		// @ts-ignore
		$('#nuevoValorEfectivo').number( true, 2);
      	// @ts-ignore
      	$('#nuevoCambioEfectivo').number( true, 2);


      	// Listar método en la entrada
      	listarMetodos()

	}else{

		// @ts-ignore
		$(this).parent().parent().removeClass('col-xs-4');

		// @ts-ignore
		$(this).parent().parent().addClass('col-xs-6');

		 // @ts-ignore
		 $(this).parent().parent().parent().children('.cajasMetodoPago').html(

		 	'<div class="col-xs-6" style="padding-left:0px">'+
                        
                '<div class="input-group">'+
                     
                  '<input type="number" min="0" class="form-control" id="nuevoCodigoTransaccion" placeholder="Código transacción"  required>'+
                       
                  '<span class="input-group-addon"><i class="fa fa-lock"></i></span>'+
                  
                '</div>'+

              '</div>')

	}

	

})

/*=============================================
CAMBIO EN EFECTIVO
=============================================*/
// @ts-ignore
$(".formularioVenta").on("change", "input#nuevoValorEfectivo", function(){

	// @ts-ignore
	var efectivo = $(this).val();

	// @ts-ignore
	var cambio =  Number(efectivo) - Number($('#nuevoTotalVenta').val());

	// @ts-ignore
	var nuevoCambioEfectivo = $(this).parent().parent().parent().children('#capturarCambioEfectivo').children().children('#nuevoCambioEfectivo');

	nuevoCambioEfectivo.val(cambio);

})

/*=============================================
CAMBIO TRANSACCIÓN
=============================================*/
// @ts-ignore
$(".formularioVenta").on("change", "input#nuevoCodigoTransaccion", function(){

	// Listar método en la entrada
     listarMetodos()


})


/*=============================================
LISTAR TODOS LOS PRODUCTOS
=============================================*/

function listarProductos(){

	var listaProductos = [];

	// @ts-ignore
	var descripcion = $(".nuevaDescripcionProducto");

	// @ts-ignore
	var cantidad = $(".nuevaCantidadProducto");

	// @ts-ignore
	var precio = $(".nuevoPrecioProducto");

	for(var i = 0; i < descripcion.length; i++){

		// @ts-ignore
		listaProductos.push({ "id" : $(descripcion[i]).attr("idProducto"), 
							  // @ts-ignore
							  "descripcion" : $(descripcion[i]).val(),
							  // @ts-ignore
							  "cantidad" : $(cantidad[i]).val(),
							  // @ts-ignore
							  "stock" : $(cantidad[i]).attr("nuevoStock"),
							  // @ts-ignore
							  "precio" : $(precio[i]).attr("precioReal"),
							  // @ts-ignore
							  "precioNeto" : $(precio[i]).attr("precioNeto"),
							  // @ts-ignore
							  "total" : $(precio[i]).val()})

	}

	// @ts-ignore
	$("#listaProductos").val(JSON.stringify(listaProductos)); 

}

/*=============================================
LISTAR MÉTODO DE PAGO
=============================================*/

function listarMetodos(){

	// @ts-ignore
	var listaMetodos = "";

	// @ts-ignore
	if($("#nuevoMetodoPago").val() == "Efectivo"){

		// @ts-ignore
		$("#listaMetodoPago").val("Efectivo");

	}else{

		// @ts-ignore
		$("#listaMetodoPago").val($("#nuevoMetodoPago").val()+"-"+$("#nuevoCodigoTransaccion").val());

	}

}

/*=============================================
BOTON EDITAR VENTA
=============================================*/
// @ts-ignore
$(".tablas").on("click", ".btnEditarVenta", function(){

	// @ts-ignore
	var idVenta = $(this).attr("idVenta");

	// @ts-ignore
	window.location = "index.php?ruta=editar-venta&idVenta="+idVenta;


})

/*=============================================
FUNCIÓN PARA DESACTIVAR LOS BOTONES AGREGAR CUANDO EL PRODUCTO YA HABÍA SIDO SELECCIONADO EN LA CARPETA
=============================================*/

function quitarAgregarProducto(){

	//Capturamos todos los id de productos que fueron elegidos en la venta
	// @ts-ignore
	var idProductos = $(".quitarProducto");

	//Capturamos todos los botones de agregar que aparecen en la tabla
	// @ts-ignore
	var botonesTabla = $(".tablaVentas tbody button.agregarProducto");

	//Recorremos en un ciclo para obtener los diferentes idProductos que fueron agregados a la venta
	for(var i = 0; i < idProductos.length; i++){

		//Capturamos los Id de los productos agregados a la venta
		// @ts-ignore
		var boton = $(idProductos[i]).attr("idProducto");
		
		//Hacemos un recorrido por la tabla que aparece para desactivar los botones de agregar
		for(var j = 0; j < botonesTabla.length; j ++){

			// @ts-ignore
			if($(botonesTabla[j]).attr("idProducto") == boton){

				// @ts-ignore
				$(botonesTabla[j]).removeClass("btn-primary agregarProducto");
				// @ts-ignore
				$(botonesTabla[j]).addClass("btn-default");

			}
		}

	}
	
}

/*=============================================
CADA VEZ QUE CARGUE LA TABLA CUANDO NAVEGAMOS EN ELLA EJECUTAR LA FUNCIÓN:
=============================================*/

// @ts-ignore
$('.tablaVentas').on( 'draw.dt', function(){

	quitarAgregarProducto();

})


/*=============================================
BORRAR VENTA
=============================================*/
// @ts-ignore
$(".tablas").on("click", ".btnEliminarVenta", function(){

  // @ts-ignore
  var idVenta = $(this).attr("idVenta");

  // @ts-ignore
  swal({
        title: '¿Está seguro de borrar la venta?',
        text: "¡Si no lo está puede cancelar la accíón!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Si, borrar venta!'
      }).then(function(result){
        if (result.value) {
          
            // @ts-ignore
            window.location = "index.php?ruta=ventas&idVenta="+idVenta;
        }

  })

})

/*=============================================
IMPRIMIR FACTURA
=============================================*/

// @ts-ignore
$(".tablas").on("click", ".btnImprimirFactura", function(){

	// @ts-ignore
	var codigoVenta = $(this).attr("codigoVenta");

	window.open("extensiones/tcpdf/pdf/factura.php?codigo="+codigoVenta, "_blank");

})

/*=============================================
RANGO DE FECHAS
=============================================*/

// @ts-ignore
$('#daterange-btn').daterangepicker(
  {
    ranges   : {
      // @ts-ignore
      'Hoy'    : [moment(), moment()],
      // @ts-ignore
      'Ayer'   : [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      // @ts-ignore
      'Últimos 7 días' : [moment().subtract(6, 'days'), moment()],
      // @ts-ignore
      'Últimos 30 días': [moment().subtract(29, 'days'), moment()],
      // @ts-ignore
      'Este mes'  : [moment().startOf('month'), moment().endOf('month')],
      // @ts-ignore
      'Último mes'  : [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    },
    // @ts-ignore
    startDate: moment(),
    // @ts-ignore
    endDate  : moment()
  },
  function (start, end) {
    // @ts-ignore
    $('#daterange-btn span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));

    var fechaInicial = start.format('YYYY-MM-DD');
    console.log(fechaInicial);

    var fechaFinal = end.format('YYYY-MM-DD');
    console.log(fechaFinal);
    // @ts-ignore
    var day = moment().day(); // 5
	// @ts-ignore
	console.log( moment.weekdays[day] );

    // @ts-ignore
    var capturarRango = $("#daterange-btn span").html();
   
   	localStorage.setItem("capturarRango", capturarRango);

   	// @ts-ignore
   	window.location = "index.php?ruta=ventas&fechaInicial="+fechaInicial+"&fechaFinal="+fechaFinal;

  }

)

/*=============================================
CANCELAR RANGO DE FECHAS
=============================================*/

// @ts-ignore
$(".daterangepicker.opensleft .range_inputs .cancelBtn").on("click", function(){

	localStorage.removeItem("capturarRango");
	localStorage.clear();
	// @ts-ignore
	window.location = "ventas";
})

/*=============================================
CAPTURAR HOY
=============================================*/

// @ts-ignore
$(".daterangepicker.opensleft .ranges li").on("click", function(){

	// @ts-ignore
	var textoHoy = $(this).attr("data-range-key");

	if(textoHoy == "Hoy"){

		var d = new Date();
		
		var dia = d.getDate();
		var mes = d.getMonth()+1;
		var año = d.getFullYear();
		console.log(dia);
		if(mes < 10 && dia < 10){

			var fechaInicial = año+"-0"+mes+"-0"+dia;
			var fechaFinal = año+"-0"+mes+"-0"+dia;	

		}else if(mes < 10){

			var fechaInicial = año+"-0"+mes+"-"+dia;
			var fechaFinal = año+"-0"+mes+"-"+dia;
			console.log("entro acá mes");


		}else if(dia < 10){

			var fechaInicial = año+"-"+mes+"-0"+dia;
			var fechaFinal = año+"-"+mes+"-0"+dia;
			console.log("entro acá dia");

		}else{

			var fechaInicial = año+"-"+mes+"-"+dia;
	    	var fechaFinal = año+"-"+mes+"-"+dia;


		}	

    	localStorage.setItem("capturarRango", "Hoy");

    	console.log(fechaInicial);
    	console.log(fechaFinal);

    	// @ts-ignore
    	window.location = "index.php?ruta=ventas&fechaInicial="+fechaInicial+"&fechaFinal="+fechaFinal;

	}

})




