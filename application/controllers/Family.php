<?php
class Family extends CI_Controller{
  function __construct(){
    parent::__construct();
    $this->load->model('family_model');
  }
  function updateRelation(){
    $data = $this->family_model->updateRelation();
    echo json_encode($data);
  }
}
