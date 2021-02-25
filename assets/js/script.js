$(document).ready(function(){

  // const State = {};
  // class Handlers{};
  // class Family {};
  // class Citizen {
  //   constructor(data){
  //     this.data = data;
  //     this.state = {};
  //   }
  //   show(){
  //     const { data:d } = this;
  //     let el = '';
  //     for( let i = 0; i < d.length; i++){
  //
  //     }
  //   }
  // };
  // console.log(State);


  class Family {
    constructor(){
      this.relations = ['Ayah/Ibu', 'Suami/Istri', 'Anak', 'Saudara'];
      this.inversed  = ['Anak', 'Suami/Istri', 'Ayah/Ibu', 'Saudara'];
    }
    // addRelations(self, str){
    //   const obj = this.getObj(str);
    //   // const nothing = 'starts '
    //   for(let i = 0; i < obj.length; i ++ ){
    //
    //   }
    // }
    updateRelation(ids, rels){
      const response = [];
      for(let i = 0; i < ids.length; i++){
        $.ajax({
          url: `${U}/family/updateRelation`,
          type: "post",
          dataType: "json",
          async: false,
          data: {
            id: ids[i],
            rel: rels[i]
          },
          success: function(data){
            response.push(data);
          }
        });
      }
      const unsuccessful = response.find(item => !item);
      if(unsuccessful){
        return false;
      } else {
        return false;
      }
    }
    getObj(str){
      const obj = [];
      for( let i = 0; i < str.length; i += 16 ) {
        const nik = Number( str.slice( i, i + 15 ));
        const rId = Number( str.slice( i + 15, i + 16 ));
        const person = State.data.find(item => Number(item.nik) === nik);
        const rel = this.getRelation(rId);
        obj.push({person, rel});
      }
      return obj;
    }
    getStr(){}
    getChief(nikk){
      const chief = State.data.find( T =>
        (Number(T.nikk) === nikk) &&
        Number(T.iskk));
      return chief.name;
    }
    getRelation(r){
      return this.relations[r-1];
    }
    getInverse(r){}
    parseForm(m, rels){
      let str = '';
      if(m.length && ( m[0].value && rels[0].value ) ){
        for(let i=0; i<m.length; i++){
          const id = String(m[i].value);
          const rel = String(rels[i].value);
          str += `${id}${rel}`;
        }
      }
      return str;
    }
    parseNames(str){
      let el = '';
      if( str || str !== '' || str !==  undefined ){
        const obj = this.getObj(str);
        for(let i = 0; i < obj.length; i ++){
          el += `<span class="" title="${obj[i].rel}" data-id="${obj[i].person.id}">${obj[i].person.name}</span>`
        }
      }
      return el;
    }
  }

  const family = new Family();

  class Citizen {
    allAreFilled(v,f,el){
      const eIdx = [];
      const fEl = $('#newCitizenFeedback');
      for(let i = 0; i < v; i ++){
        if(!v[i] || v[i] === undefined) eIdx.push(i);
      }
      const len = eIdx.length;
      if(!len) {
        return true;
      } else {
        showError(fEl, 'Data tidak lengkap!');
        for( let x = 0; x < len; x ++) highlightField(f[eIdx[x]]);
        return false;
      }
    }
    validate({vals, fields, fEl}){
      // return true;
      // return false;
      const eIdx = [];
      for(let i = 0; i < vals.length; i ++){
        if(!vals[i] || vals[i] === undefined){
          eIdx.push(i);
        }
      }
      const len = eIdx.length;
      if(!len){
        return true;
      } else {
        for(let x = 0; x < eIdx.length; x++){
          highlightField(fields[eIdx[x]]);
        }
        showError(fEl, 'Data tidak lengkap!')
        return false;
      }

    }
    add(){
      // e.preventDefault();
      const fieldsValues = {
        vals: {
          nik: $('#nik').val(),
          nikk: $('#nikk').val(),
          name: $('#name').val(),
          rw: $('#rw').val(),
          rt: $('#rt').val(),
          dob: $('#dob').val(),
          status: $('select[name="status"] option:selected').val(),
          gender: $('select[name="gender"] option:selected').val(),
          iskk: $('#iskk').is(':checked') ? 1 : 0,
          family: family.parseForm($('.family-member'), $('.family-relation'))
        },
        fields: {
          nik: $('#nik'),
          nikk: $('#nikk'),
          name: $('#name'),
          rw: $('#rw'),
          rt: $('#rt'),
          dob: $('#dob'),
          status: $('#status'),
          gender: $('#gender'),
          iskk: $('#iskk')
        },
        fEl: $('#newCitizenFeedback'),
      };
      console.log(fieldsValues);
      const { vals:v, fields:f, fEl } = fieldsValues;
      const { nik, nikk, name, rw, rt, dob, status, gender } = v;
      const { nik: k, nikk: K, name: n, rw: w, rt: t, dob: D, status: S, gender: G } = f;

      // console.log($('.family-member'), $('.family-relation'));
      if(this.validate({
        vals: [nik, nikk, name, rw, rt, dob, status, gender],
        fields: [k, K, n, w, t, D, S, G],
        fEl: fEl
      })){
        console.log('submitting');
        $.ajax({
          url: `${U}/citizen/add`,
          type: "post",
          dataType: "json",
          async: false,
          data: {
            nik: nik,
            nikk: nikk,
            name: name,
            rw: rw,
            rt: rt,
            dob: dob,
            status: status,
            gender: gender,
            iskk: iskk,
            family: family,
          },
          success: function(data){
            $('#newCitizenModal').modal('hide');
          }
        })
      } else {
        console.log('an error occured');
      }
      // console.log(this.validate());
      // console.log(this);
    }
    update(){}
    delete(){}
    appendMember(p){
      // const seletList = `<option value="">Pilih</option> ${State.familySelectList}`
      let l = `<div class="row my-1">
        <label class="col-3" for="family-member">Keluarga</label>
        <div class="col-4">
          <select class="family-member form-select form-select-sm">
            ${State.familySelectList}
          </select>
        </div>
        <div class="col-4">
          <select class="family-relation form-select form-select-sm">
            <option value="">Pilih</option>
            <option value="1">Ayah/Ibu</option>
            <option value="2">Suami/Istri</option>
            <option value="3">Anak</option>
            <option value="4">Saudara</option>
          </select>
        </div>
        <div class="col-1 p-1">
          <a class="remove-family-member" title="Hapus" href="#"><i class="fas fa-times fa-fw"></i></a>
        </div>
      </div>`;
      // console.log(p);
      // console.log(l);
      p.append(l);
    }
    removeMember(){

    }
  }
  const citizen = new Citizen();

  $('#citizenList').DataTable({
    ajax: {
      url: `${U}/home/get`,
      dataSrc: ""
    },
    columns: [{
      data: "id",
    }, {
      data: "nik"
    }, {
      data: "nikk"
    }, {
      data: "name"
    }, {
      data: "nikk",
      render: (data, meta, row) => `${family.getChief(Number(data))}`
      // data: {id: "id", iskk: "iskk"},
      // render: ( data, meta, row) => `${family.getChief(data)}`
      // render: (data, meta, row) => `${data.id}`
    }, {
      data: "dob",
      render: ( data, meta, row) => $.format.date(data, "dd/MM/yyyy")
    }, {
      data: "gender",
      render: ( data, meta, row) => data === 'm' ? 'L' : 'P'
    }, {
      data: "status",
      render: ( data, meta, row) => Number(data) === 1 ? 'Menetap' : 'Merantau'
    }, {
      data: "family",
      render: ( data, meta, row) => `${family.parseNames(data)}`,
    }, {
      data: "id",
      render: ( data, meta, row) => `<a href="javascript:void(0);" class="edit-citizen" data-id="${data}"><i class="fas fa-pencil-alt"></i></a> <a href="javascript:void(0);" class="delete-citizen" data-id="${data}"><i class="fas fa-trash"></i></a>`
    }],
  });

  $('#newCitizenForm').on('submit', function(e){
    e.preventDefault();
    citizen.add();
  });

  $('.add-family-member').on('click', function(){
    const p = $('#familyMembers');
    citizen.appendMember(p);
  });

  $('#familyMembers').on('click', '.remove-family-member', function(){
     $(this).parent().parent().remove();
  });
});
