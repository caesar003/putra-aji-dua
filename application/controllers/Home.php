<?php
class Home extends CI_Controller{
  function __construct(){
    parent::__construct();
    $this->load->model('home_model');
  }
  public function index(){
    $this->load->view('homepage');
  }

  public function get(){
    // $data = $this->db->select('*');
    // $data = $this->db->get('citizen');
    $data = $this->home_model->get();
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

  public function delete(){
    $data = $this->home_model->delete();
    echo json_encode($data);
  }

}
