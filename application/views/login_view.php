<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="<?php echo base_url('assets/css/bootstrap.min.css') ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/fontawesome-5.12.0/css/all.min.css') ?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/css/login.css') ?>">
    <title>Masuk</title>
  </head>
  <body>

    <form class="d-flex justify-content-center p-4" id="loginForm" method="post" action="<?php echo site_url('login/auth')?>">

      <div class="card w-25" id="main">
        <div class="card-body">
          <h4>Silahkan masuk untuk melanjutkan</h4>
          <div class="mb-3">
            <label for="name">Nama</label>
            <div class="input-group">
              <span class="input-group-text"><i class="fas fa-user"></i></span>
              <input name="name" id="name" type="text" class="form-control form-control-sm">
            </div>
          </div>

          <div class="mb-3">
            <label for="password">Sandi</label>
            <div class="input-group">
              <span class="input-group-text"><i class="fas fa-key"></i></span>
              <input name="password" id="password" type="password" class="form-control form-control-sm">
            </div>
          </div>
        </div>
        <div class="card-footer d-flex justify-content-between">
          <div class="">
            <span id="loginFeedback">
              <?php echo $this->session->flashdata('msg')?>
            </span>
          </div>
          <button class="btn btn-info" type="submit"><i class="fas fa-sign-in-alt"></i> Masuk</button>
        </div>
      </div>
    </form>
  </body>
</html>
