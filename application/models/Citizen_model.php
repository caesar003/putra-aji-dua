<?php
class Citizen_model extends CI_Model{
  function add () {
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
}
