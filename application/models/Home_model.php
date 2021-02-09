<?php

class Home_model extends CI_Model{
  function get(){
    $query = $this->db->get('citizen');
    return $query->result();
  }

  public function add(){
    
  }
  public function update(){

  }

  public function delete(){

  }
}
