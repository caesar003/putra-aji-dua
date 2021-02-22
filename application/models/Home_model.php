<?php

class Home_model extends CI_Model{
  function get(){
    $query = $this->db->get('citizen');
    return $query->result();
  }

  public function isNikAvailable(){
    $nik = $this->input->get('nik');
    $this->db->where('nik', $nik);
    $query = $this->db->get('citizen');
    if($query->num_rows() > 0){
      return false;
    } else {
      return true;
    }
  }

  public function add(){
    $nik = $this->input->post('nik');
    $nikk = $this->input->post('nikk');
    $name = $this->input->post('name');
    $rw = $this->input->post('rw');
    $rt = $this->input->post('rt');
    $dob = $this->input->post('dob');
    $status = $this->input->post('status');
    $gender = $this->input->post('gender');
    $iskk = $this->input->post('iskk');
    $family = $this->input->post('family');

    $data = array(
      'nik' => $nik,
      'nikk' => $nikk,
      'name' => $name,
      'rw' => $rw,
      'rt' => $rt,
      'dob' => $dob,
      'status' => $status,
      'gender' => $gender,
      'iskk' => $iskk,
      'family' => $family
    );

    $query = $this->db->insert('citizen', $data);
    return $query;
  }

  public function updateRelation(){
    $nik = $this->input->post('nik');
    $family = $this->input->post('family');

    $this->db->where('nik', $nik);
    $this->db->set('family', $family);
    $query = $this->db->update('citizen');
    return $query;
  }
  public function update(){

  }

  public function delete(){
    $id = $this->input->post('id');
    $this->db->where('id', $id);
    $query = $this->db->delete('citizen');
    return $query;
  }
}
