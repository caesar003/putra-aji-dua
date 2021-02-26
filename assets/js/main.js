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
        const { person, rel } = arr2[y];
        if( arr.find(item => item.person.nik === person.nik && item.rel !== rel)){
          toUpdate.push( arr2[y] );
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
    getAge(b,c){
      const birthDate = new Date(b);
      const currentDate = c !== undefined ? new Date(c) : new Date();

      const yOb = birthDate.getFullYear();
      const mOb = birthDate.getMonth();
      const dOb = birthDate.getDate();

      const thisYear = currentDate.getFullYear();
      const thisMonth = currentDate.getMonth();
      const today = currentDate.getDate();

      let yearDiff = thisYear - yOb;
        /*
          if month of birth is less than this month => month has not come yet;
          month of birth equals to this month AND date of birth is less than today;
        */
      if(mOb>thisMonth||((mOb===thisMonth)&&(dOb>today))) yearDiff--;

      return yearDiff;
    }
    getString(obj){
      let str = '';
      for(let i = 0; i < obj.length; i++){
        str += `${obj[i].person.nik}${this.relations.findIndex(item => item === obj[i].rel)}`;
      }
      return str;
    }
    getDetailedInfo(obj){
      let el = `<li><strong>NIK</strong>: ${obj.nik}</li>
      <li><strong>No KK</strong>: ${obj.nikk}</li>
      <li><strong>Nama</strong>: ${obj.name}</li>
      <li><strong>Lahir</strong>: ${$.format.date(obj.dob, "dd/MM/yyyy")} (${this.getAge(obj.dob)} tahun)</li>
      <li><strong>Jenis Kelamin</strong>: ${obj.gender === 'm'? 'P' : 'L'}</li>
      <li><strong>Status tinggal</strong>: ${Number(obj.status) ? 'Menetap' : 'Merantau'}</li>`;
      return el;
    }
    getFamilyList(obj){
      let el = "";
      const familyMembers = this.getObj(obj.family);
      const spouse = familyMembers.find(item => item.rel === 'Suami/Istri');
      const kids = familyMembers.filter(items => items.rel === 'Anak');
      const parents = familyMembers.filter(items => items.rel === 'Ayah/Ibu');
      const siblings = familyMembers.filter(items => items.rel === 'Saudara');

      const htmlEls = {
        father: '<li><strong>Ayah</strong>: ',
        mother: '<li><strong>Ibu</strong>: ',
        spouse: `<li><strong>${obj.gender === 'm' ? 'Istri' : 'Suami'}</strong>: `,
        kids: '<li><strong>Anak</strong>: ',
        siblings: '<li><strong>Saudara</strong>: '
      };

      if(parents.length){
        const father = parents.find(item => item.person.gender === 'm');
        const mother = parents.find(item => item.person.gender === 'f');
        htmlEls.father += `${father.person.name}`;
        htmlEls.mother += `${mother.person.name}`;
      } else {
        htmlEls.mother += ' - ';
        htmlEls.father += ' - ';
      }
      if(spouse){
        htmlEls.spouse += `${spouse.person.name}`;
      } else {
        htmlEls.spouse += ' - ';
      }

      if(kids.length){
        for(let i = 0; i< kids.length ; i ++)
          htmlEls.kids += `${kids[i].person.name}${i !== kids.length - 1 ? ', ': ''}`;
      } else {
        htmlEls.kids += ' - ';
      }
      if(siblings.length){
        for(let i = 0; i< siblings.length ; i ++)
          htmlEls.siblings += `${siblings[i].person.name}${i !== siblings.length - 1 ? ', ': ''}`;
      } else {
        htmlEls.siblings += ' - ';
      }

      htmlEls.father += '</li>';
      htmlEls.mother += '</li>';
      htmlEls.spouse += '</li>';
      htmlEls.kids += '</li>';
      htmlEls.siblings += '</li>';

      // let el = '';
      for( let item in htmlEls ) {
        el += htmlEls[item];
      }
      // console.log(el);return
      return el;
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
    parseForm(m, rels){
      let str = '';
      if(m.length && (m[0].value && rels[0].value)){
        for(let i = 0; i < m.length; i++)
          str += `${m[i].value}${rels[i].value}`
      }
      return str;
    }
    parseNames(str){
      let el = '';
      if ( str || str !== '' || str !== undefined ) {
        const obj = this.getObj(str);
        for( let i = 0; i < obj.length; i ++ ) {

          let relationTitle = '';

          if( obj[i].rel === 'Suami/Istri'){
            if( obj[i].person.gender === 'm'){
              relationTitle = 'Suami';
            } else {
              relationTitle = 'Istri';
            }
          } else if ( obj[i].rel === 'Ayah/Ibu' ){
            if( obj[i].person.gender === 'm' ){
              relationTitle = 'Ayah';
            } else {
              relationTitle = 'Ibu';
            }
          } else {
            relationTitle = obj[i].rel;
          }

          el += `<span class="" title="${relationTitle}">${obj[i].person.name}</span>${i !== obj.length - 1 ? ', ' : ''}`;
        }
      }
      return el;
    }
    generateSelections(nik, rel, arr){
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
      return el;
    }
    getPersonHtmlEl(obj){
      const el = `<div data-nik="${obj.nik}" class="person-icon ${obj.gender} ${String(obj.h) === String(obj.nik) ? 'highlighted' : ''}" style="--x:${obj.x}%;--y:${obj.y}%;">
          <i class="fas fa-user-alt"></i> <br>
          ${obj.name}
        </div>`
      return el;
    }
    getMaritalLine(obj){
      const el = `<div class="marital-line" style="--x:${obj.x}%; --y:${obj.y}%;"></div>`;
      return el;
    }
    getKidsVLine(obj){
      const el = `<div class="kids-v-line" style="--x:${obj.x}%;--y:${obj.y}%;"></div>`;
      return el;
    }
    getKidsHLine(obj){
      const el = `<div class="kids-h-line" style="--x: ${obj.x}%;--y: ${obj.y}%;--w:${obj.w}%;"></div>`;
      return el;
    }
    getHeadLine(obj){
      const el = `<div class="head-line" style="--x: ${obj.x}%;--y:${obj.y}%;"></div>`;
      return el;
    }
    generateFamilyTreeHtml(obj){
      let el = '';
      const treeParams = {
        leftMostPerson: 2,
        topLevelPerson: 5,
        xInterval: 12,
        yIntervalLevel: 15,
        mLineXDiff: 9,
        mLineYDiff: 2,
        vLineXDiff: 10.20,
        vLineYDiff: 2,
        hLineYDiff: 15,
        headLineXDiff: 4,
        headLineYDiff: -3
      };
      const {
        leftMostPerson: J, topLevelPerson: I, xInterval: X, yIntervalLevel: Y,
        mLineXDiff: mX, mLineYDiff: mY, vLineXDiff: vX, vLineYDiff: vY,
        headLineXDiff: hX, headLineYDiff: hY
      } = treeParams;
      if(obj.gender === 'man'){
        el += this.getPersonHtmlEl({ h: obj.highlighted,name: obj.name, nik: obj.nik, gender: obj.gender, x: J, y: I});
        el += this.getPersonHtmlEl({ h: obj.highlighted,name: obj.spouse.name, nik: obj.spouse.nik, gender: obj.spouse.gender, x: J + X, y: I});
      } else {
        el += this.getPersonHtmlEl({ h: obj.highlighted,name: obj.spouse.name, nik: obj.spouse.nik, gender: obj.spouse.gender, x: J, y: I});
        el += this.getPersonHtmlEl({ h: obj.highlighted,name: obj.name, nik: obj.nik, gender: obj.gender, x: J + X, y: I});
      }


      el += this.getMaritalLine({x: J + mX, y: I + mY });
      if(obj.children && obj.children.length) el += this.getKidsVLine({x: J + vX, y: I + vY});
      const kidsVLineXAx = J + vX;

      let tracker = 0;
      let bottomLevelIdx = 0;

      let firstKidsXpos = 0;
      let lastKidsXpos = 0;

      if(obj.children && obj.children.length) {
        for(let i = 0 ; i < obj.children.length ; i++){
          if(obj.children[i].spouse !== undefined){
            /*
             * the order would always put man on the left, as women always right,
             */
            if(obj.children[i].gender === 'man'){
              el += this.getPersonHtmlEl({ h: obj.highlighted,
                name: obj.children[i].name,
                gender: obj.children[i].gender,
                nik: obj.children[i].nik,
                x: J + (tracker * X),
                y: I + Y,
              });
              el += this.getHeadLine({x: J + (tracker * X) + hX, y: I + Y + hY});
              el += this.getPersonHtmlEl({ h: obj.highlighted,
                name: obj.children[i].spouse.name,
                gender: obj.children[i].spouse.gender,
                nik: obj.children[i].spouse.nik,
                x: J + ((tracker + 1) * X),
                y: I + Y,
              });
              if( i === 0 ) firstKidsXpos = J + (tracker * X) + hX;
              if( i === obj.children.length - 1 ) lastKidsXpos = J + (tracker * X) + hX;
            } else {
              el += this.getPersonHtmlEl({ h: obj.highlighted,
                name: obj.children[i].spouse.name,
                gender: obj.children[i].spouse.gender,
                nik: obj.children[i].spouse.nik,
                x: J + (tracker * X),
                y: I + Y,
              });
              el += this.getPersonHtmlEl({ h: obj.highlighted,
                name: obj.children[i].name,
                gender: obj.children[i].gender,
                nik: obj.children[i].nik,
                x: J + ((tracker + 1) * X),
                y: I + Y,
              });
              el += this.getHeadLine({x: J + ((tracker + 1) * X) + hX, y: I + Y + hY});
              if( i === 0 ) firstKidsXpos = J + ((tracker + 1) * X) + hX;
              if( i === obj.children.length - 1 ) lastKidsXpos = J + ((tracker + 1) * X) + hX;
            }

            // now see if the couple has any kids
            if(obj.children[i].children && obj.children[i].children.length){
              let fX = 0;
              let lX = 0;
              for(let j = 0; j < obj.children[i].children.length ; j++){
                el += this.getPersonHtmlEl({ h: obj.highlighted,
                  name: obj.children[i].children[j].name,
                  gender: obj.children[i].children[j].gender,
                  nik: obj.children[i].children[j].nik,
                  x: J + (bottomLevelIdx * X),
                  y: I + (Y * 2)
                });

                el += this.getHeadLine({x: J + (bottomLevelIdx * X) + hX, y: I + (Y * 2) + hY });
                if(j === 0) fX = J + (bottomLevelIdx * X) + hX;
                if(j === obj.children[i].children.length - 1) lX = J + (bottomLevelIdx * X) + hX;
                bottomLevelIdx ++;
              }

              el += this.getKidsVLine({x: J + (X * tracker) + vX, y: Y + I + vY});

              const vLX = J + (X * tracker) + vX;
              const fI = fX < vLX ? fX : vLX;
              const lI = lX > vLX ? lX : vLX;

              el += this.getKidsHLine({
                x: fI,
                y: 31,
                w: (lI - fI) + 0.9,
              });

            }

            el += this.getMaritalLine({x: J + (X * tracker) + mX, y: Y + I + mY});
            tracker += 2;

          } else {
            el += this.getPersonHtmlEl({ h: obj.highlighted,
              name: obj.children[i].name,
              gender: obj.children[i].gender,
              nik: obj.children[i].nik,
              x: J + (tracker * X),
              y: I + Y,
            });

            el += this.getHeadLine({
              x: J + (tracker * X) + hX, y: I + Y + hY,
            });

            if( i === 0 ) firstKidsXpos = J + (tracker * X) + hX;
            if( i === obj.children.length - 1 ) lastKidsXpos = J + (tracker * X) + hX;

            tracker ++;
          }
        }

        const hLineStart = firstKidsXpos < kidsVLineXAx ? firstKidsXpos : kidsVLineXAx;
        const hLineEnd = lastKidsXpos > kidsVLineXAx ? lastKidsXpos : kidsVLineXAx;

        el += this.getKidsHLine({
          x: hLineStart,
          y: 16,
          w: (hLineEnd - hLineStart) + 0.9,
        });
      }

      return el;
    }
    constructChildrenObj(obj){
      const newObj = {
        name: obj.person.name,
        nik: obj.person.nik,
        gender: obj.person.gender === 'm' ? 'man' : 'woman'
      };
      return newObj;
    }
    constructFamilyTree(str){
      const person = State.data.find(item => String(item.nik) === String(str));
      const detail = this.getDetailedInfo(person);
      const list = this.getFamilyList(person);
      const familyTree = {
        highlighted: str,
        name: null,
        nik: null,
        gender: "man",
        spouse: {
          name: null,
          gender: "woman",
          nik: null,
        },
        children: [],
      };

      const familyMembers = this.getObj(person.family);
      const parents = familyMembers.filter(item => item.rel === 'Ayah/Ibu');
      const spouse = familyMembers.find(item => item.rel === 'Suami/Istri');
      const kids = familyMembers.filter(item => item.rel === 'Anak');
      const siblings = familyMembers.filter(item => item.rel === 'Saudara').sort((a,b) => new Date(a.person.dob).getTime() - new Date(b.person.dob).getTime());

      const olderSiblings = siblings.filter(items => new Date(items.person.dob).getTime() < new Date(person.dob).getTime());
      const youngerSiblings = siblings.filter(items => new Date(items.person.dob).getTime() > new Date(person.dob).getTime());

      const self = {
        name: person.name,
        nik: person.nik,
        gender: person.gender === 'm' ? 'man' : 'woman'
      };

      if(spouse || spouse !== undefined)
        self.spouse = this.constructChildrenObj(spouse);

      if(kids.length){
        self.children = [];
        for(let y = 0; y < kids.length; y++){
          self.children.push(this.constructChildrenObj(kids[y]));
        }
      }

      if(parents.length){
        const father = parents.find(item => item.person.gender === 'm');
        const mother = parents.find(item => item.person.gender === 'f');

        familyTree.name = father.person.name;
        familyTree.nik = father.person.nik;
        familyTree.gender = 'man';
        familyTree.spouse = this.constructChildrenObj(mother);
        familyTree.children = [];

        if(olderSiblings.length){
          for( let i = 0 ; i < olderSiblings.length; i++){
            const olderSiblingsFamilyMembers = this.getObj(olderSiblings[i].person.family);
            const olderSiblingsSpouse = olderSiblingsFamilyMembers.find(item => item.rel === 'Suami/Istri');
            const olderSiblingsKids = olderSiblingsFamilyMembers.filter(items => items.rel === 'Anak');
            const obj = this.constructChildrenObj(olderSiblings[i]);

            if(olderSiblingsSpouse || olderSiblingsSpouse !== undefined)
              obj.spouse = this.constructChildrenObj(olderSiblingsSpouse);
            if(olderSiblingsKids.length) {
              obj.children = [];
              for(let x = 0 ; x < olderSiblingsKids.length; x ++)
                obj.children.push(this.constructChildrenObj(olderSiblingsKids[x]));
            }
            familyTree.children.push(obj);
          }
        }

        familyTree.children.push(self);

        if(youngerSiblings.length){
          for(let x = 0; x < youngerSiblings.length ; x ++){
            const youngerSiblingsFamilyMembers = this.getObj(youngerSiblings[x].person.family);
            const youngerSiblingsSpouse = youngerSiblingsFamilyMembers.find(item => item.rel === 'Suami/Istri');
            const youngerSiblingsKids = youngerSiblingsFamilyMembers.filter(items => items.rel === 'Anak');
            const obj = this.constructChildrenObj(youngerSiblings[x]);

            if(youngerSiblingsSpouse || youngerSiblingsSpouse !== undefined)
              obj.spouse = this.constructChildrenObj(youngerSiblingsSpouse);

            if(youngerSiblingsKids.length){
              obj.children = [];
              for(let x = 0; x < youngerSiblingsKids.length; x ++)
                obj.children.push(this.constructChildrenObj(youngerSiblingsKids[x]));
            }
            familyTree.children.push(obj);
          }
        }
      } else if(!parents.length && kids.length) {
        familyTree.name = self.name;
        familyTree.nik = self.nik;
        familyTree.gender = self.gender;
        familyTree.spouse = self.spouse;
        familyTree.children = self.children;
      } else if(!parents.length && !kids.length){
        familyTree.name = self.name;
        familyTree.nik = self.nik;
        familyTree.gender = self.gender;
        familyTree.spouse = self.spouse;
      }

      const htmlEl = this.generateFamilyTreeHtml(familyTree);
      console.log(familyTree);

      $('#personInfo').removeClass('isHidden');
      $('#stats').addClass('isHidden');
      $('#familyTree').html(htmlEl);

      $('#personalInfo').html(detail);
      $('#familyList').html(list);
    }
    formatDate(d){
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      const date = d.slice(0,2);
      const month = d.slice(3,5);
      const year = d.slice(6,11);
      return (`${date}-${months[month-1]}-${year}`);
    }
    groupKK(){
      const {data} = State;
      const kk = [];
      for(let i = 0; i < State.data.length; i ++){
        kk.push(data[i].nikk);
      }

      const filteredKK = [... new Set(kk)];
      // console.log(kk);
      // console.log([... new Set(kk)]);
      for(let x = 0; x < filteredKK.length; x ++){
        console.log()
      }
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
    makeGenderChart(){
      // console.log(State.data);
      const data = State.data;
      const n = data.length;
      const man = data.filter(items => items.gender === 'm').length;
      const woman = data.filter(items => items.gender === 'f').length;

      const list = {
        man: `${man} (${((man/n) * 100).toFixed(2)}%)`,
        // mDeg: `${(360 * ((man/n) * 100)) / 100}`,
        mDeg: `${(man/n) * 360}`,
        woman: `${woman} (${((woman/n) * 100).toFixed(2)}%)`,
        wDeg: `${(woman/n) * 360}`
      };

      /*
        360 * ( sample / population ) * 100
      */
      /*
        sample / population * 360;
      */

      const lEl = `<li><i style="color:pink;" class="fas fa-user-alt"></i> <strong>P</strong>: ${list.woman} </li>
      <li><i style="color:navy;" class="fas fa-user-alt"></i> <strong>L</strong>: ${list.man}</li>`;
      const genderChart =  `<div class="pie-chart" style="--g:navy ${list.mDeg}deg, pink 0;"></div>`;
      $('#genderList').html(lEl);
      $('#genderChart').html(genderChart);
    }
    makeAgeGroupChart(){
      const data = State.data;

      const n = data.length;
      const twenties = data.filter(items => family.getAge(items.dob) <= 20).length;
      const twentiesdeg = (twenties/n) * 360;
      const underFifty = data.filter(items => family.getAge(items.dob) > 20 && family.getAge(items.dob) < 50).length;
      const fiftiesdeg = (underFifty/n) * 360;
      const aboveFifty = data.filter(items => family.getAge(items.dob) > 50).length;
      const abovefifDeg = (aboveFifty/n) * 360;
      let el = `<li><i style="color:#dd4b39;" class="fas fa-user-alt"></i> <strong>&lt;20 tahun</strong>: ${twenties} (${((twenties/n) * 100).toFixed(2)}%)</li>
      <li><i style="color:#9cb443;" class="fas fa-user-alt"></i> <strong>21-50 tahun</strong>: ${underFifty} (${((underFifty/n) * 100).toFixed(2)}%)</li>
      <li><i style="color:#007bb6;" class="fas fa-user-alt"></i> <strong>&gt;50 tahun</strong>: ${aboveFifty} (${((aboveFifty/n) * 100).toFixed(2)}%)</li>`;
      let pieChart = `<div class="pie-chart" style="--g:#dd4b39 ${twentiesdeg}deg, #9cb443 0 ${fiftiesdeg+twentiesdeg}deg, #007bb6 0;"></div>`;
      $('#ageGroup').html(el);
      $('#ageChart').html(pieChart);
    }
  }
  const citizen = new Citizen();
  $('#citizenList').DataTable({
    ajax: {
      url: `${U}/home/get`,
      dataSrc: ""
    },
    columns: [{
      data: "nik"
    }, {
      data: {"nik":"nik", "nikk":"nikk"},
      render: (data, meta, row) => `<a href="javascript:void(0);" class="person-item" data-nik="${data.nik}">${data.nikk}</a>`
    }, {
      data: "name"
    }, {
      data: "nikk",
      render: (data, meta, row) => `${family.getChief(Number(data))}`
    }, {
      data: "rw"
    }, {
      data: "rt"
    }, {
      data: "dob",
      render: (data, meta, row) => family.formatDate($.format.date(data, "dd-MM-yyyy"))
    }, {
      data: "dob",
      render: (data, meta, row) => family.getAge(data)
    }, {
      data: "gender",
      render: (data, meta, row) => data === 'm' ? 'L' : 'P'
    }, {
      data: "status",
      render: (data, meta, row) => Number(data) === 1 ? 'Menetap' : 'Merantau'
    }, {
      data: "family",
      render: (data, meta, row) => `${family.parseNames(data)}`
    }, {
      data: "id",
      render: (data, meta, row) => `<a href="javascript:void(0);" class="edit-citizen" data-id="${data}"><i class="fas fa-pencil-alt"></i></a> <a href="javascript:void(0);" class="delete-citizen" data-id="${data}"><i class="fas fa-trash"></i></a>`
    }]
  });
  family.groupKK();

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
  });
  $('#citizenList').on('click', '.person-item', function(e){
    const nik = $(this).data('nik');
    family.constructFamilyTree(nik);
  });

  $('#personInfo').on('click', '.btn-close', function(){
    // console.log('clicked');
    $('#personInfo').addClass('isHidden');
    $('#stats').removeClass('isHidden');
  });


  $('#familyTree').on('click', '.person-icon', function(){
    const nik = $(this).data('nik');
    // console.log(nik);
    family.constructFamilyTree(nik);
  });
  citizen.makeGenderChart();
  citizen.makeAgeGroupChart();
});
