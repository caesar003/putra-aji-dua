<?php
class Family_model extends CI_Model{
  public function updateRelation(){
    $id = $this->input->post('id');
    $rel = $this->input->post('rel');
    $this->db->where('id', $id);
    $this->db->set('family', $rel);
    $query = $this->db->update('citizen');
    return $query;
  }
}
