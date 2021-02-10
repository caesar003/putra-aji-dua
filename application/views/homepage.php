<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Basis Data Penduduk Desa Putra Aji Dua</title>
    <link rel="stylesheet" href="<?php echo base_url('assets/css/bootstrap.min.css')?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/fontawesome-5.12.0/css/all.min.css')?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/css/style.css') ?>">
  </head>
  <body>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark">
      <div class="container-fluid">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a title="Tambah Baru" class="nav-link" data-bs-toggle="modal" aria-current="page" href="#newCitizenModal"><i class="fas fa-file fa-fw"></i></a>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" id="infoDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" href="#">
              <i class="fas fa-info-circle fa-fw"></i>
            </a>
            <ul class="dropdown-menu" aria-labelledby="infoDropdown">
              <li><a class="dropdown-item">Bantuan</a></li>
              <li><a class="dropdown-item">Tentang </a></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" id="accountDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" href="#">
              <i class="fas fa-user fa-fw"></i> Akun
            </a>
            <ul class="dropdown-menu" aria-labelledby="accountDropdown">
              <li><a class="dropdown-item">Ubah Sandi</a></li>
              <li><a class="dropdown-item" href="<?php echo site_url('login/logout')?>">Keluar</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>

    <div class="container">
      <div class="row">
        <div class="col-3"></div>
        <div class="col-9">
          <div class="container">
            <table class="table table-striped table-bordered">
              <thead>
                <th>#</th>
                <th>NIK</th>
                <th>No KK</th>
                <th>Nama</th>
                <th>KK</th>
                <th>Tanggal lahir</th>
                <th>Jenis Kelamin</th>
                <th>Status tinggal</th>
                <th>Anggota keluarga</th>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <script type="text/javascript" src="<?php echo base_url('assets/js/jquery-3.4.1.min.js')?>"></script>
    <script type="text/javascript" src="<?php echo base_url('assets/js/popper.min.js')?>"></script>
    <script type="text/javascript" src="<?php echo base_url('assets/js/bootstrap.min.js')?>"></script>
    <script type="text/javascript" src="<?php echo base_url('assets/js/script.js')?>"> </script>
  </body>
</html>
