<?php
class Home extends CI_Controller{
  function __construct(){
    parent::__construct();
    $this->load->model('home_model');
    $this->load->model('citizen_model');
  }
  public function index(){
    $this->load->view('homepage');
    if($this->session->userdata('logged_in') == FALSE) {
      redirect('login');
    }
  }

  public function get(){
    $data = $this->home_model->get();
    echo json_encode($data);
  }

  public function isNikAvailable(){
    $data = $this->home_model->isNikAvailable();
    echo json_encode($data);
  }
  public function add(){
    $data = $this->home_model->add();
    echo json_encode($data);
  }

  public function update(){
    $data = $this->home_model->update();
    echo json_encode($data);
  }

  public function updateRelation(){
    $data = $this->home_model->updateRelation();
    echo json_encode($data);
  }
  public function delete(){
    $data = $this->home_model->delete();
    echo json_encode($data);
  }

}
