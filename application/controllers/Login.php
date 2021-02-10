<?php
class Login extends CI_Controller{

  function __construct(){
    parent::__construct();
    $this->load->model('login_model');
  }
  public function index (){
    $this->load->view('login_view');
    if( $this->session->userdata('logged_in') == TRUE ) {
      redirect('home');
    }
  }

  public function auth(){
    $username = $this->input->post('name', TRUE);
    $password = md5($this->input->post('password', TRUE));
    $validate = $this->login_model->validate($username, $password);

    if( $validate->num_rows() > 0 ){
      $data = $validate->row_array();
      $id = $data['id'];
      $name = $data['name'];
      $sesdata = array(
        'id' => $id,
        'name' => $name,
        'logged_in' => TRUE
      );
      $this->session->set_userdata($sesdata);
      redirect('home');
    } else {
      echo $this->session->set_flashdata('msg', 'Nama pengguna atau password tidak benar!');
      redirect('login');
    }
  }

  /*
  public function auth(){
    $name = $this->input->post('name');
  }
  */


  public function logout(){
    $this->session->sess_destroy();
    redirect('login');
  }

}
