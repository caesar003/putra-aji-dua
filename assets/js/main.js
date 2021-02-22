$(document).ready(function(){
  "use strict";
  class Family{
    constructor(){
      this.relations = ['Ayah/Ibu', 'Suami/Istri', 'Anak', 'Saudara'];
      this.inversed  = ['Anak', 'Suami/Istri', 'Ayah/Ibu', 'Saudara'];
    }
    addRelations(nik, m){
      const obj = this.getInversed(m);
      const responses = [];
      for(let i = 0; i < obj.length; i++){
        $.ajax({
          url: `${U}/home/updateRelation`,
          type: "post",
          dataType: "json",
          async: false,
          data: {
            nik: obj[i].person.nik,
            family: `${obj[i].person.family}${nik}${obj[i].rel}`
          },
          success: function(data){
            responses.push(data);
          }
        });
      }
      const failedAttempt = responses.find(item => !item);
      if(!failedAttempt) return true;
    }
    updateRelation(str, nik){
      let response = false;
      $.ajax({
        url: `${U}/home/updateRelation`,
        type: "post",
        dataType: "json",
        async: false,
        data: {
          nik: nik,
          family: str,
        },
        success: function(data){
          response = data;
        }
      });
      return response;
    }
    getRelationInversed(str){
      return this.inversed[this.relations.findIndex(item => item === str)];
    }
    getRelation(id){

    }
    getRelationId(str){
      return (this.relations.findIndex(item => item === str) + 1);
    }
    getRelationIdInversed(str){
      return (this.inversed.indexOf(str) + 1);
    }
    groupMembers(arr, arr2){ // old, new
      const toRemove = [];
      const toAdd = [];
      const toUpdate = [];

      for(let i = 0; i < arr.length; i++){
        const {nik} = arr[i].person;
        if( arr2.find(item => item.person.nik === nik) === undefined){
          toRemove.push(arr[i]);
        }
      }
      for( let x = 0; x < arr2.length; x ++){
        const {nik} = arr2[x].person;
        if( arr.find(item => item.person.nik === nik ) === undefined ){
          toAdd.push(arr2[x]);
        }
      }
      for( let y = 0; y < arr2.length; y ++){
        const {person, rel} = arr2[y];
        if( arr.find(item => item.person.nik === person.nik && item.rel !== rel)){
          toUpdate.push(arr2[y]);
        }
      }
      return {toRemove, toAdd, toUpdate};
    }
    getChief(nikk){
      let name = '';
      const chief = State.data.find(T => (Number(T.nikk) === nikk) && Number(T.iskk));
      if(chief || chief !== undefined) name =  chief.name;
      return name;
    }
    getObj(str){
      const obj = [];
      for( let i = 0 ; i < str.length; i+= 16){
        const nik = Number( str.slice ( i, i + 15));
        const rId = Number( str.slice( i + 15, i+16));
        const person = State.data.find(item => Number(item.nik) === nik);
        const rel = this.relations[rId-1];
        obj.push({person, rel});
      }
      return obj;
    }
    getString(obj){
      let str = '';
      for(let i = 0; i < obj.length; i++){
        str += `${obj[i].person.nik}${this.relations.findIndex(item => item === obj[i].rel)}`;
      }
      return str;
    }
    getInversed(str){
      const obj = [];
      for(let i = 0; i<str.length; i += 16){
        const nik = Number ( str.slice ( i, i + 15));
        const rId = Number( str.slice( i + 15, i + 16));
        const person = State.data.find(item => Number(item.nik) === nik);
        let rel = null;
        switch (rId) {
          case 1:
            rel = 3;
            break;
          case 2:
            rel = 2;
            break;
          case 3:
            rel = 1;
            break;
          default:
            rel = 4;
        }
        obj.push({person, rel});
      }
      return obj;
    }
    parseForm(m,rels){
      let str = '';
      if(m.length && (m[0].value && rels[0].value)){
        for(let i = 0; i < m.length; i++)
          str += `${m[i].value}${rels[i].value}`
      }
      return str;
    }
    parseNames(str){
      let el = '';
      if( str || str !== '' || str !== undefined){
        const obj = this.getObj(str);
        for(let i = 0; i < obj.length ; i++)
          el += `<span class="" title="${obj[i].rel}">${obj[i].person.name}</span> `;
      }
      return el;
    }
    generateSelections(nik, rel, arr){
      // const relations =
      let relations = '<option value="">Pilih</option>';
      let members = '<option value="">Pilih</option>';
      for(let i = 0; i < this.relations.length; i++){
        relations += `<option value="${i+1}" ${this.relations[i] === rel ? 'selected' : ''}>${this.relations[i]}</option>`
      }
      for(let x = 0; x < arr.length; x ++){
        members += `<option value="${arr[x].nik}" ${Number(nik) === Number(arr[x].nik) ? 'selected' : ''}>${arr[x].name}</option>`;
      }

      return {relations, members};
    }
    generateFamilySelect(str, nik){
      let el = '';
      const label = `<label class="col-3">Keluarga</label>`;
      const rmBtn = `<div class="col-1 p-1">
        <a class="remove-family-memberE" title="Hapus" href="#"><i class="fas fa-times fa-fw"></i></a>
      </div>`;
      const obj = this.getObj(str);
      const people = State.data.filter(item => Number(item.nik) !== Number(nik));

      for(let i = 0; i < obj.length; i++){
        const {relations, members} = this.generateSelections(obj[i].person.nik, obj[i].rel, people);
        el += `<div class="row my-1">
          ${i === 0 ? label : ''}
          <div class="col-4${i !== 0 ? ' offset-3': ''}">
            <select class="family-memberE form-select form-select-sm">
            ${members}
            </select>
          </div>
          <div class="col-${i === 0 ? '5':'4'}">
            <select class="family-relationE form-select form-select-sm">
              ${relations}
            </select>
          </div>
          ${i !== 0 ? rmBtn : ''}
        </div>`;

      }

      // console.log(el);
      return el;
    }
  }
  const family = new Family();
  class Citizen {
    get(){
      $.ajax({
        url: `${U}/home/get`,
        dataType: "json",
        success: function(data){
          console.log(data);
        }
      })
    }
    add(){
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
          familyMembers: family.parseForm($('.family-member'), $('.family-relation'))
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
          iskk: $('iskk')
        },
        fEl: $('#newCitizenFeedback')
      };
      const { vals: v, fields: f, fEl} = fieldsValues;
      const { nik, nikk, name, rw, rt, dob, status, gender, iskk, familyMembers } = v;
      const { nik: k, nikk: K, name: n, rw: w, rt: t, dob: D, status: S, gender: G} = f;

      if(this.validate({
        vals: [nik, nikk, name, rw, rt, dob, status, gender],
        fields: [k, K, n, w, t, D, S, G],
        fEl: fEl
      })){
        if( family.addRelations(nik, familyMembers) ){
          $.ajax({
            type: "post",
            url: `${U}/home/add`,
            dataType: "json",
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
              family: familyMembers,
            },
            success: function(data){
              // reset form,
              $('.remove-family-member').parent().parent().remove();
              $('#nik, #nikk, #name, #rw, #rt, #dob, #status, #gender, .family-member, .family-relation').val("");
              $('#iskk').prop('checked', false);
              // reload the table
              $('#citizenList').DataTable().ajax.reload();
              getData();
              // hide modal
              $('#newCitizenModal').modal('hide');
            }
          });
        }
      } else {
        console.log('an error occured');
      }
    }
    appendMember(p){
      let l = `<div class="row my-1">

        <div class="col-4 offset-3">
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
      p.append(l);
    }
    appendMemberE(p){
      let l = `<div class="row my-1">
        <div class="col-4 offset-3">
          <select class="family-memberE form-select form-select-sm">
            ${State.familySelectList}
          </select>
        </div>
        <div class="col-4">
          <select class="family-relationE form-select form-select-sm">
          <option value="">Pilih</option>
          <option value="1">Ayah/Ibu</option>
          <option value="2">Suami/Istri</option>
          <option value="3">Anak</option>
          <option value="4">Saudara</option>
          </select>
        </div>
        <div class="col-1 p-1">
          <a class="remove-family-memberE" title="Hapus" href="#"><i class="fas fa-times fa-fw"></i></a>
        </div>
      </div>`;
      p.append(l);
    }
    validate({vals, fields, fEl}){
      let response = false;
      const eIdx = [];
      for(let i = 0; i< vals.length; i++){
        if(!vals[i] || vals[i] === undefined) eIdx.push(i);
      }
      const len = eIdx.length;
      if(!len){
        const nik = String(vals[0]);
        if(nik.length !== 15){
          showError(fEl, 'NIK harus berjumlah 15 angka!');
          highlightField(fields[0]);
        } else {
          if(this.isNikAvailable(nik)){
            response = true;
          } else {
            showError(fEl, 'NIK sudah digunakan!');
            highlightField(fields[0]);
          }
        }
      } else {
        for( let x = 0; x < eIdx.length; x++) highlightField(fields[eIdx[x]]);
        showError(fEl, 'Data tidak lengkap!');
      }
      return response;
    }
    validateUpdate({id, vals, fields, fEl}){
      let response = false;
      const eIdx = [];
      for(let i = 0; i < vals.length; i++){
        if(!vals[i] || vals[i] === undefined) eIdx.push(i);
      }

      const len = eIdx.length;
      if(!len){
        const nik = String(vals[0]);
        if(nik.length !== 15){
          showError(fEl, "NIK harus berjumlah 15 angka!");
          highlightField(fields[0]);
        } else {
          if(this.nikOnAnotherUser(id, nik)){
            showError(fEl, "Nik telah digunakan!");
          } else {
            response = true;
          }
        }
      } else {
        for( let x = 0; x < eIdx.length; x++) highlightField.fields[eIdx[x]];
        showError(fEl, 'Data tidak lengkap!');
      }
      return response;
    }
    isNikAvailable( nik ){
      let response = false;
      $.ajax({
        url: `${U}/home/isNikAvailable`,
        dataType: "json",
        async: false,
        data: {
          nik: nik
        },
        success: function(data){
          response = data;
        }
      });
      return response;
    }
    nikOnAnotherUser(id, nik){
      let response = false;
      $.ajax({
        url: `${U}/home/nikOnAnotherUser`,
        async: false,
        dataType: "json",
        data: {nik: nik, id: id},
        success: function(data){
          if(data && data.length) response = true;
        }
      });
      return response;
    }
    updateInit(e){
      const id = e.target.parentNode.dataset.id || e.target.dataset.id;
      State.toEdit.id = id;
      const person = State.data.find(item => Number(item.id) === Number(id));
      const { dob, family:familyMembers, gender, iskk, name, nik, nikk, rt, rw, status } = person;
      const familySelectList = family.generateFamilySelect(familyMembers, nik);

      $("#nikE").val(nik);
      $("#nikkE").val(nikk);
      $("#nameE").val(name);
      $("#rwE").val(rw);
      $("#rtE").val(rt);
      $("#dobE").val($.format.date(dob, "yyyy-MM-dd"));
      $("#statusE").val(status);
      $("#genderE").val(gender);
      $('#iskkE').prop('checked', Number(iskk) || false);
      $('#editCitizenModal').modal('show');
      $('#familyMembersE').html(familySelectList);
    }

    update(){
      const {id} = State.toEdit;
      const fieldsValues = {
        vals: {
          nik: $('#nikE').val(),
          nikk: $('#nikkE').val(),
          name: $('#nameE').val(),
          rw: $('#rwE').val(),
          rt: $('#rtE').val(),
          dob: $('#dobE').val(),
          status: $('select[name="statusE"] option:selected').val(),
          gender: $('select[name="genderE"] option:selected').val(),
          iskk: $('#iskkE').is(':checked') ? 1 : 0,
          familyMembers: family.parseForm($('.family-memberE'), $('.family-relationE'))
        },
        fields: {
          nik: $('#nikE'),
          nikk: $('#nikkE'),
          name: $('#nameE'),
          rw: $('#rwE'),
          rt: $('#rtE'),
          dob: $('#dobE'),
          status: $('#statusE'),
          gender: $('#genderE'),
          iskk: $('iskkE')
        },
        fEl: $('#editCitizenFeedback')
      };
      // console.log(fieldsValues);
      const { vals: v, fields: f, fEl} = fieldsValues;
      const { nik, nikk, name, rw, rt, dob, status, gender, iskk, familyMembers } = v;
      const { nik: k, nikk: K, name: n, rw: w, rt: t, dob: D, status: S, gender: G} = f;

      if(this.validateUpdate({
        id: id,
        vals: [nik, nikk, name, rw, rt, dob, status, gender],
        fields: [k, K, n, w, t, D, S, G],
        fEl: fEl
      })){

        const currentPerson = State.data.find(item => item.id === id);
        if( currentPerson.family !== familyMembers ){
          const oldFamily = currentPerson.family;
          const newFamily = familyMembers;
          if(oldFamily && !newFamily){
            const oldMembers = family.getObj(oldFamily); // list of family members of the one we are deleting;
            for(let i = 0; i < oldMembers.length; i++){
              let str = '';
              const currentMembers = family.getObj(oldMembers[i].person.family);
              const updatedMembers = currentMembers.filter(item => Number(item.person.nik) !== Number(currentPerson.nik));
              for(let x = 0; x < updatedMembers.length; x ++){
                str += `${updatedMembers[x].person.nik}${family.getRelationId(updatedMembers[x].rel)}`
              }
              family.updateRelation(str, oldMembers[i].person.nik);
            }
          } else if (!oldFamily && newFamily){
            const newMembers = family.getInversed(newFamily);
            for( let i = 0; i < newMembers.length; i ++ ){
              family.updateRelation(`${newMembers[i].person.family}${currentPerson.nik}${newMembers[i].rel}`, newMembers[i].person.nik);
            }
          } else if (oldFamily && newFamily){
            const newMembers = family.getObj(newFamily);
            const oldMembers = family.getObj(oldFamily);
            const {toRemove, toAdd, toUpdate} = family.groupMembers(oldMembers, newMembers);
            if(toRemove.length){
              for(let i = 0; i < toRemove.length; i++){
                let str = '';
                const members = family.getObj(toRemove[i].person.family);
                const filtered = members.filter(item => item.person.nik !== currentPerson.nik);
                for(let x = 0; x < filtered.length; x ++){
                  str += `${filtered[x].person.nik}${family.getRelationId(filtered[x].rel)}`;
                }
                family.updateRelation(str, toRemove[i].person.nik);
              }
            }
            if(toUpdate.length){
              for(let i = 0; i < toUpdate.length; i++){
                let str = '';
                const members = family.getObj(toUpdate[i].person.family);
                const thisIndex = members.findIndex(item => item.person.nik === currentPerson.nik);
                members[thisIndex].rel = family.getRelationInversed(toUpdate[i].rel);
                for(let x = 0; x < members.length; x ++){
                  str += `${members[x].person.nik}${family.getRelationId(members[x].rel)}`;
                }
                family.updateRelation(str, toUpdate[i].person.nik);
              }
            }
            if(toAdd.length){
              for(let i = 0; i< toAdd.length; i ++){
                let str = '';
                family.updateRelation(`${toAdd[i].person.family}${currentPerson.nik}${family.getRelationIdInversed(toAdd[i].rel)}`, toAdd[i].person.nik);
              }
            }
          }
        }

        $.ajax({
          type: "post",
          url: `${U}/home/update`,
          dataType: "json",
          data: {
            id: id,
            nik: nik,
            nikk: nikk,
            name: name,
            rw: rw,
            rt: rt,
            dob: dob,
            status: status,
            gender: gender,
            iskk: iskk,
            family: familyMembers,
          },
          success: function(data){
            // reset form,
            // $('.remove-family-member').parent().parent().remove();
            // $('#nik, #nikk, #name, #rw, #rt, #dob, #status, #gender, .family-member, .family-relation').val("");
            // $('#iskk').prop('checked', false);
            // reload the table
            $('#citizenList').DataTable().ajax.reload();
            getData();
            // hide modal
            $('#editCitizenModal').modal('hide');
          }
        });

      } else {
        console.log(false);
      }
    }
    deleteInit(e){
      const id = e.target.dataset.id || e.target.parentNode.dataset.id;
      State.toDelete.id = id;
      $('#deleteCitizenModal').modal('show');
    }
    delete(){
      // define item to delete
      const id = State.toDelete.id;
      const person = State.data.find(item => Number(item.id) === Number(id)); // person to delete,
      // collect family members of the item;
      const fMembers = family.getObj(person.family); // family members of this person;
      // iterate through the array,
      if(fMembers.length){
        for(let i = 0; i < fMembers.length; i++){
          let str = '';
          const filtered = family.getObj(fMembers[i].person.family).filter(item => item.person.nik !== person.nik );
          if(filtered.length){
            for(let f = 0; f<filtered.length; f++){
              str += `${filtered[f].person.nik}${family.getRelationId(filtered[f].rel)}`
            }
          }
          family.updateRelation(str, fMembers[i].person.nik);
        }
      }

      $.ajax({
        url: `${U}/home/delete`,
        type: "post",
        dataType: "json",
        async: false,
        data: {id:id},
        success: function(data){
          $('#citizenList').DataTable().ajax.reload();
          getData();
          $('#deleteCitizenModal').modal('hide');
        }
      });

    }
  }
  const citizen = new Citizen();

  $('#citizenList').DataTable({
    ajax: {
      url: `${U}/home/get`,
      dataSrc: ""
    },
    columns: [/*{
      data: "id"
    }, */{
      data: "nik"
    }, {
      data: "nikk"
    }, {
      data: "name"
    }, {
      data: "nikk",
      render: (data, meta, row) => `${family.getChief(Number(data))}`
    }, {
      data: "dob",
      render: (data, meta, row) => $.format.date(data, "dd/MM/yyyy")
    }, {
      data: "gender",
      render: (data, meta, row) => data === 'm' ? 'L' : 'P'
    }, {
      data: "status",
      render: (data, meta, row) => Number(data) === 1 ? 'Menetap' : 'Merantau'
    }, {
      data: "family",
      // render: (data, meta, row) => `${family.parseNames(data)}`
    }, {
      data: "id",
      render: (data, meta, row) => `<a href="javascript:void(0);" class="edit-citizen" data-id="${data}"><i class="fas fa-pencil-alt"></i></a><a href="javascript:void(0);" class="delete-citizen" data-id="${data}"><i class="fas fa-trash"></i></a>`
    }]
  });

  // Add citizen
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

  $('.add-family-memberE').on('click', function(){
    const p = $('#familyMembersE');
    citizen.appendMemberE(p);
  })

  $('#familyMembersE').on('click', '.remove-family-memberE', function(){
    $(this).parent().parent().remove();
  });
  // edit citizen
  $('#citizenList').on('click', '.edit-citizen', citizen.updateInit);

  $('#editCitizenForm').on('submit', function(e){
    e.preventDefault();
    citizen.update();
  });

  // delete citizen
  $('#citizenList').on('click', '.delete-citizen', citizen.deleteInit);
  $('#deleteCitizenForm').on('submit', function(e){
    e.preventDefault();
    citizen.delete();
  })

});
