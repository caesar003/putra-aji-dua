<?php
class Login_model extends CI_Model{

  public function validate($username, $password){

    $this->db->where('name', $username);
    $this->db->where('password', $password);
    $query = $this->db->get('tbl_usrs', 1);
    return $query;
  }

  public function resetPassword(){
    $this->db->where('id', $id);
    $this->db->set('name', $name);
    $this->db->set('password', $hash);
    $query = $this->db->update('tbl_usrs');
    return $query;
  }
}
