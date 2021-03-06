<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Basis Data Penduduk Desa Putra Aji Dua</title>
    <link rel="stylesheet" href="<?php echo base_url('assets/css/lib/bootstrap.min.css')?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/fontawesome-5.12.0/css/all.min.css')?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/css/lib/datatables.min.css')?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/css/style.min.css') ?>">
  </head>
  <body>
    <nav class="navbar navbar-expand-sm navbar-dark bg-dark">
      <div class="container-fluid">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a title="Tambah Baru" class="nav-link" data-bs-toggle="modal" aria-current="page" href="#newCitizenModal"><i class="fas fa-file fa-fw"></i> </a>
            </li>

            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="accountDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fas fa-user-alt fa-fw"></i>
              </a>
              <ul class="dropdown-menu" aria-labelledby="accountDropdown">
                <li><a class="dropdown-item" href="#"> <i class="fas fa-key"></i> Ubah sandi</a></li>
                <li><a class="dropdown-item" href="<?php echo site_url('login/logout')?>"> <i class="fas fa-sign-out-alt fa-fw"></i> Keluar</a></li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="helpDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false"> <i class="fas fa-question fa-fw"></i></a>
              <ul class="dropdown-menu" aria-labelledby="helpDropdown">
                <li><a class="dropdown-item" href="#"> <i class="fas fa-question fa-fw"></i> Bantuan </a></li>
                <li><a class="dropdown-item" href="#"><i class="fas fa-info-circle fa-fw"></i> Tentang aplikasi ini</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#">Something else here</a></li>
              </ul>
            </li>

          </ul>
        </div>
      </div>
    </nav>

    <div class="bd-example">
      <nav>
        <div class="nav nav-tabs mb-3" id="nav-tab" role="tablist">
          <a class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Beranda</a>
          <a class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">Profil</a>
          <a class="nav-link" id="nav-staff-tab" data-bs-toggle="tab" href="#nav-staff" role="tab" aria-controls="nav-staff" aria-selected="false">Perangkat Desa</a>
          <a class="nav-link" id="nav-citizen-tab" data-bs-toggle="tab" href="#nav-citizen" role="tab" aria-controls="nav-citizen" aria-selected="false">Penduduk</a>
        </div>
      </nav>
      <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane fade active show" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
          <p class="px-3">Beranda.</p>
        </div>
        <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
          <p class="px-3">profil</p>
        </div>
        <div class="tab-pane fade" id="nav-staff" role="tabpanel" aria-labelledby="nav-staff-tab">
          <p class="px-3">perangkat desa.</p>
        </div>
        <div class="tab-pane fade" id="nav-citizen" role="tabpanel" aria-labelledby="nav-citizen-tab">
          <div class="container-fluid p-2">
            <div class="row">
              <div class="col-md-4" id="side">
                <div id="stats">
                  <div class="container">
                    <div class="row">
                      <div class="col-6">
                        <ul class="list-unstyled" id="genderList">
                        </ul>
                      </div>
                      <div class="col-6" id="genderChart">
                      </div>
                    </div>

                    <h4>Kelompok usia</h4>
                    <div class="row">
                      <div class="col-6">
                        <ul class="list-unstyled" id="ageGroup">
                        </ul>
                      </div>
                      <div class="col-6" id="ageChart">

                      </div>
                    </div>
                  </div>
                </div>
                <div id="personInfo" class="isHidden">
                  <h2 class="">
                    <span id="personName"></span>
                    <small>
                    <button type="button" class="btn-close float-end" aria-label="Close"></button></small>
                  </h2>
                  <div class="row">
                    <div class="col-6">
                      <h5>Informasi detil</h5>
                      <ul class="list-unstyled" id="personalInfo">

                      </ul>
                    </div>
                    <div class="col-6">
                      <h5>Keluarga</h5>
                      <ul class="list-unstyled" id="familyList">
                      </ul>
                    </div>
                  </div>
                  <div class="container-fluid">
                    <figure id="familyTree"></figure>
                  </div>
                </div>
              </div>
              <div class="col-md-8" id="main">
                <div class="container">
                  <table id="citizenList" class="table table-striped table-bordered">
                    <thead>
                      <!-- <th>#</th> -->
                      <th>NIK</th>
                      <th>No KK</th>
                      <th>Nama</th>
                      <th>KK</th>
                      <th>RW</th>
                      <th>RT</th>
                      <th>Lahir</th>
                      <th>Usia</th>
                      <th>P/L </th>
                      <th>Status</th>
                      <th>Keluarga</th>
                      <th>Pilihan</th>
                    </thead>
                    <tbody></tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>


    <!-- New Citizen Form -->
    <form id="newCitizenForm">
     <div class="modal fade" id="newCitizenModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="newCitizenModalLabel" aria-hidden="true">
       <div class="modal-dialog">
         <div class="modal-content">
           <div class="modal-header">
             <h5 class="modal-title" id="newCitizenModalLabel">Informasi Penduduk</h5>
             <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
           </div>
           <div class="modal-body">
             <div class="row my-1">
               <label class="col-3" for="nik">NIK</label>
               <div class="col-9">
                 <input type="number" id="nik" class="form-control form-control-sm">
               </div>
             </div>
             <div class="row my-1">
               <label class="col-3">No KK</label>
               <div class="col-9">
                 <input type="number" id="nikk" class="form-control form-control-sm">
               </div>
             </div>
             <div class="row my-1">
               <label class="col-3" for="name">Nama</label>
               <div class="col-9">
                 <input type="text" id="name" class="form-control form-control-sm">
               </div>
             </div>
             <div class="row my-1">
               <label class="col-3" for="rw">RW</label>
               <div class="col-9">
                 <input min="1" type="number" id="rw" class="form-control form-control-sm">
               </div>
             </div>
             <div class="row my-1">
               <label class="col-3" for="rt">RT</label>
               <div class="col-9">
                 <input min="1" type="number" id="rt" class="form-control form-control-sm">
               </div>
             </div>
             <div class="row my-1">
               <label class="col-3" for="dob">Tanggal Lahir</label>
               <div class="col-9">
                 <input type="date" id="dob" class="form-control form-control-sm">
               </div>
             </div>
             <div class="row my-1">
               <label class="col-3" for="status">Status</label>
               <div class="col-9">
                 <select id="status" name="status" class="form-select form-select-sm">
                   <option value="">Pilih</option>
                   <option value="1">Menetap</option>
                   <option value="2">Merantau</option>
                 </select>
               </div>
             </div>
             <div class="row my-1">
               <label class="col-3" for="gender">L/P</label>
               <div class="col-9">
                 <select id="gender" name="gender" class="form-select form-select-sm">
                   <option value="">Pilih</option>
                   <option value="m">Laki-laki</option>
                   <option value="f">Perempuan</option>
                 </select>
               </div>
             </div>
             <div class="form-check mt-1 mb-3">
               <input type="checkbox" class="form-check-input" id="iskk">
               <label class="form-check-label" for="iskk">Kepala Keluarga</label>
             </div>
             <div id="familyMembers">
               <div class="row my-1">
                 <label class="col-3" for="family-member">Keluarga</label>
                 <div class="col-4">
                   <select class="family-member form-select form-select-sm">
                   </select>
                 </div>
                 <div class="col-5">
                   <select class="family-relation form-select form-select-sm">
                     <option value="">Pilih</option>
                     <option value="1">Ayah/Ibu</option>
                     <option value="2">Suami/Istri</option>
                     <option value="3">Anak</option>
                     <option value="4">Saudara</option>
                   </select>
                 </div>
               </div>
             </div>
             <div class="row my-1">
               <div class="col-3 offset-3">
                 <a class="add-family-member" title="Tambah anggota keluarga." href="#"><i class="fas fa-plus fa-fw"></i></a>
               </div>
             </div>
           </div>
           <div class="modal-footer d-flex justify-content-between">
             <div id="newCitizenFeedback" class="form-feedback py-1 px-3"></div>
             <div class="">
               <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times"></i> Tutup</button>
               <button type="submit" class="btn btn-primary"><i class="fas fa-check fa-fw"></i> Simpan</button>
             </div>
           </div>
         </div>
       </div>
     </div>
   </form>
   <!-- New Citizen Form -->

   <!-- Edit Citizen Form -->
   <form id="editCitizenForm">
     <div class="modal fade" id="editCitizenModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="editCitizenModalLabel" aria-hidden="true">
       <div class="modal-dialog">
         <div class="modal-content">
           <div class="modal-header">
             <h5 class="modal-title" id="editCitizenModalLabel">Informasi Penduduk</h5>
             <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
           </div>
           <div class="modal-body">
             <div class="row my-1">
               <label class="col-3" for="nikE">NIK</label>
               <div class="col-9">
                 <input type="number" id="nikE" class="form-control form-control-sm">
               </div>
             </div>
             <div class="row my-1">
               <label class="col-3">No KK</label>
               <div class="col-9">
                 <input type="numberE" id="nikkE" class="form-control form-control-sm">
               </div>
             </div>
             <div class="row my-1">
               <label class="col-3" for="nameE">Nama</label>
               <div class="col-9">
                 <input type="text" id="nameE" class="form-control form-control-sm">
               </div>
             </div>
             <div class="row my-1">
               <label class="col-3" for="rwE">RW</label>
               <div class="col-9">
                 <input type="number" id="rwE" class="form-control form-control-sm">
               </div>
             </div>
             <div class="row my-1">
               <label class="col-3" for="rtE">RT</label>
               <div class="col-9">
                 <input type="number" id="rtE" class="form-control form-control-sm">
               </div>
             </div>
             <div class="row my-1">
               <label class="col-3" for="dobE">Tanggal Lahir</label>
               <div class="col-9">
                 <input type="date" id="dobE" class="form-control form-control-sm">
               </div>
             </div>
             <div class="row my-1">
               <label class="col-3" for="statusE">Status</label>
               <div class="col-9">
                 <select id="statusE" name="statusE" class="form-select form-select-sm">
                   <option value="">Pilih</option>
                   <option value="1">Menetap</option>
                   <option value="2">Merantau</option>
                 </select>
               </div>
             </div>
             <div class="row my-1">
               <label class="col-3" for="genderE">L/P</label>
               <div class="col-9">
                 <select id="genderE" name="genderE" class="form-select form-select-sm">
                   <option value="">Pilih</option>
                   <option value="m">Laki-laki</option>
                   <option value="f">Perempuan</option>
                 </select>
               </div>
             </div>

             <div class="form-check mt-1 mb-3">
               <input type="checkbox" class="form-check-input" id="iskkE">
               <label class="form-check-label" for="iskkE">Kepala Keluarga</label>
             </div>

             <div id="familyMembersE"></div>
             <div class="row my-1">
               <div class="col-3 offset-3">
                 <a class="add-family-memberE" title="Tambah anggota keluarga." href="#"><i class="fas fa-plus fa-fw"></i></a>
               </div>
             </div>
           </div>
           <div class="modal-footer d-flex justify-content-between">
             <div id="editCitizenFeedback" class="form-feedback py-1 px-3"></div>
             <div class="">
               <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times"></i> Tutup</button>
               <button type="submit" class="btn btn-primary"><i class="fas fa-check fa-fw"></i> Simpan</button>
             </div>
           </div>
         </div>
       </div>
     </div>
   </form>
   <!-- Edit Citizen Form -->

   <!-- Delete Citizen Form -->
   <form id="deleteCitizenForm">
       <div class="modal fade" id="deleteCitizenModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="deleteCitizenModalLabel" aria-hidden="true">
         <div class="modal-dialog">
           <div class="modal-content">
             <div class="modal-header">
               <h5 class="modal-title" id="deleteCitizenModalLabel">Hapus?</h5>
               <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
             </div>
             <div class="modal-body">
               <div class="alert alert-danger">
                 <p>Tindakan ini mengakibatkan kehilangan data secara permanen</p>
               </div>
             </div>
             <div class="modal-footer">
               <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times"></i> Batal</button>
               <button type="submit" class="btn btn-danger"><i class="fas fa-trash fa-fw"></i> Hapus</button>
             </div>
           </div>
         </div>
       </div>
   </form>
   <!-- Delete Citizen Form -->

    <script type="text/javascript" src="<?php echo base_url('assets/js/lib/jquery-3.4.1.min.js')?>"></script>
    <script type="text/javascript" src="<?php echo base_url('assets/js/lib/popper.min.js')?>"></script>
    <script type="text/javascript" src="<?php echo base_url('assets/js/lib/bootstrap.min.js')?>"></script>
    <script type="text/javascript" src="<?php echo base_url('assets/js/lib/jquery-dateformat.js')?>"></script>
    <script type="text/javascript" src="<?php echo base_url('assets/js/lib/datatables.min.js')?>"></script>
    <script type="text/javascript">
      const State = {
        data: [],
        familySelectList: null,
        toEdit: {id: null},
        toDelete: {id: null}
      };
      const U = "<?php echo site_url()?>";
      const Validations = {
        showError: (el, msg) => el.addClass('alert alert-danger').html(msg),
        highlightField: el => el.addClass('is-invalid'),
      };
      const {showError, highlightField} = Validations;
      const getOption = (nik, name) => `<option value="${nik}">${name}</option>`;
      const getData = () => {
        $.ajax({
          url: `${U}/home/get`,
          async: false,
          dataType: "json",
          success: function(d){
            let l = '<option value="">Pilih</option>';
            for(let i = 0; i < d.length; i++) l += `${getOption(d[i].nik, d[i].name)}`;
            State.data = d;
            State.familySelectList = l;
            $('.family-member').html(l);
          }
        });
      };
      getData();

    </script>
    <script type="text/javascript" src="<?php echo base_url('assets/js/main.min.js')?>"> </script>
  </body>
</html>
