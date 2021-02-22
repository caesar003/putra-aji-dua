<?php
class Citizen extends CI_Controller{
  function __construct(){
    parent::__construct();
    $this->load->model('citizen_model');
  }
  function add () {
    $data = $this->citizen_model->add();
    echo json_encode($data);
  }
}
