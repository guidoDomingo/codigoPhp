<div id="back"></div>

<div class="login-box d-flex ">
  
  <div class="login-logo ">

    <img src="vistas/img/plantilla/logoP.png" class="img-responsive" width="100%"  style="padding:30px 100px 0px 100px, width: 100%">

  </div>

  <div class="login-box-body">

    <p class="login-box-msg">Ingresar al sistema</p>

    <form method="post">

      <div class="form-group has-feedback">

        <input type="text" class="form-control" placeholder="Usuario" name="ingUsuario" required>
        <span class="glyphicon glyphicon-user form-control-feedback"></span>

      </div>

      <div class="form-group has-feedback">

        <input type="password" class="form-control" placeholder="Contraseña" name="ingPassword" required>
        <span class="glyphicon glyphicon-lock form-control-feedback"></span>
      
      </div>

      <div class="row">
       
        <div class="col-xs-4">

          <button type="submit" class="btn btn-primary btn-block btn-flat">Ingresar</button>
        
        </div>

      </div>

      <?php

        $login = new ControladorUsuarios();
        $login -> ctrIngresoUsuario();
        
      ?>

    </form>

  </div>

</div>
