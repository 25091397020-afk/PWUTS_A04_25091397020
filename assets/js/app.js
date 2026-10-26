/* NabungSampah - Portal Layanan Warga (Anggota 1) */
const JENIS={1:{n:'Botol Plastik',bersih:3000,kotor:1500,d:'Botol minuman plastik (PET).',k:'Masih berlabel, tutup menyatu, belum diremukkan.',b:'Label dan tutup dilepas, sudah dibilas dan diremukkan.'},
 2:{n:'Galon Plastik',bersih:2500,kotor:1200,d:'Galon air minum bekas.',k:'Masih kotor dan belum dipilah dari tutupnya.',b:'Sudah dibilas, tutup dipisah, siap setor.'},
 3:{n:'Kardus',bersih:2000,kotor:1000,d:'Kardus kemasan dan dus bekas.',k:'Terkena noda atau lakban, belum dilipat.',b:'Kering, bebas lakban, dilipat rapi.'}}; // Rp/kg contoh
const ICON='<svg viewBox="0 0 48 48" fill="none" stroke="#5D4037" stroke-width="2.5" stroke-linejoin="round">';
const ICONS={1:ICON+'<path d="M20 4h8v6l4 6v26a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2V16l4-6z"/><path d="M16 22h16"/></svg>',
 2:ICON+'<path d="M18 4h12v6l6 8v24a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2V18l6-8z"/><path d="M12 26h24"/></svg>',
 3:ICON+'<path d="M6 16 24 6l18 10v20L24 46 6 36z"/><path d="M6 16l18 10 18-10M24 26v20"/></svg>'};
const TARIF=2000;
const rp=n=>'Rp'+Math.round(n).toLocaleString('id-ID');
const ls={get:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const esc=s=>$('<i>').text(s).html();

function modal(ok,title,msg){$('#mIc').toggleClass('bad',!ok).text(ok?'✓':'!');$('#mTitle').text(title);$('#mMsg').html(msg);$('#modal').addClass('show');$('#mOk').focus()}
function bad($el,msg){$el.addClass('invalid');$el.nextAll('.err').first().text(msg);return false}
function clear($f){$f.find('.invalid').removeClass('invalid');$f.find('.err').text('')}

/* 2.a Ringkasan akun */
function renderAcc(){
  const u=ls.get('ns_user',null),r=ls.get('ns_pickups',[]).filter(x=>u&&x.warga_email===u.email);
  $('#accName').text(u?u.nama:'Belum terdaftar');
  $('#accAddr').text(u?u.alamat:'Daftar untuk mulai menabung');
  $('#accReq').text(r.length);$('#accFee').text(rp(r.length*TARIF));
  $('#accLast').text(r.length?r[r.length-1].status:'-');
  const $b=$('#reqBody').empty();
  if(!r.length)$b.append('<tr><td colspan="4" class="muted">Belum ada request penjemputan.</td></tr>');
  r.slice().reverse().slice(0,5).forEach(x=>$b.append(`<tr><td>${x.tgl_request}</td><td>${esc(x.jenis.join(', '))}</td><td>${rp(x.tarif_jemput)}</td><td><span class="tag">${x.status}</span></td></tr>`));
}

/* 2.b Katalog & kalkulator */
function initKatalog(){
  $('#katalog').html(Object.keys(JENIS).map(k=>{const j=JENIS[k];return `<div class="card">${ICONS[k]}<h3>${j.n}</h3><p class="muted">${j.d}</p>
   <p><span class="tag">Kotor</span> ${rp(j.kotor)}/kg<br><span class="tag">Bersih</span> <b>${rp(j.bersih)}/kg</b></p>
   <p class="muted"><b>Kotor:</b> ${j.k}<br><b>Bersih:</b> ${j.b}</p></div>`}).join(''));
  $('#cJenis').html('<option value="">-- Pilih jenis --</option>'+Object.keys(JENIS).map(k=>`<option value="${k}">${JENIS[k].n}</option>`).join(''));
  function calc(){
    const j=$('#cJenis').val(),raw=$('#cBerat').val().trim().replace(',','.'),b=parseFloat(raw),$e=$('#cErr').text('');
    if(!j||!raw){$('#cOut').hide();return}
    if(!/^\d+(\.\d{1,2})?$/.test(raw)||b<=0||b>500){$e.text('Berat harus angka 0–500 kg.');$('#cOut').hide();return}
    const k=JENIS[j].kotor*b,s=JENIS[j].bersih*b;
    $('#oK').text(rp(k));$('#oB').text(rp(s));
    $('#oD').text('Dengan membersihkan dan memilah dulu, kamu dapat tambahan '+rp(s-k)+' ('+Math.round((s-k)/k*100)+'% lebih tinggi).');
    $('#cOut').show();
  }
  $('#cJenis').on('change',calc);$('#cBerat').on('input',calc);
}

/* 2.c Registrasi & Request */
function initForm(){
  const u=ls.get('ns_user',null);
  $('.tabs button').on('click',function(){
    $('.tabs button').removeClass('on');$(this).addClass('on');
    $('#fReg').toggle($(this).data('t')==='reg');$('#fReq').toggle($(this).data('t')==='req');
    if($(this).data('t')==='req'&&u&&!$('#alamat_jemput').val())$('#alamat_jemput').val(u.alamat);
  });
  $('#jenisChk').html(Object.keys(JENIS).map(k=>`<label><input type="checkbox" name="jenis" value="${JENIS[k].n}">${JENIS[k].n}</label>`).join(''));
  $('#tarifInfo').text(rp(TARIF));

  $('#fReg').on('submit',function(e){
    e.preventDefault();const $f=$(this);clear($f);let ok=true;
    const v=n=>$f.find('[name='+n+']'),val=n=>v(n).val().trim();
    if(val('nama').length<3)ok=bad(v('nama'),'Nama minimal 3 karakter.');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val('email')))ok=bad(v('email'),'Format email tidak valid (contoh: nama@email.com).');
    if(!/^08\d{8,11}$/.test(val('no_hp')))ok=bad(v('no_hp'),'No. HP harus diawali 08 dan 10–13 digit.');
    if(val('alamat').length<8)ok=bad(v('alamat'),'Isi alamat lengkap (blok dan nomor rumah).');
    if(val('password').length<6)ok=bad(v('password'),'Password minimal 6 karakter.');
    if(val('password')!==val('konfirmasi'))ok=bad(v('konfirmasi'),'Konfirmasi password tidak sama.');
    if(!ok)return;
    const data={nama:val('nama'),email:val('email').toLowerCase(),no_hp:val('no_hp'),alamat:val('alamat'),password:val('password'),role:'warga',status:'aktif'};
    delete data.password; // password tidak disimpan di browser; dikirim ke server saja
    const done=()=>{ls.set('ns_user',data);modal(true,'Pendaftaran berhasil','Selamat datang, '+esc(data.nama)+'! Sekarang kamu bisa request penjemputan.');$f[0].reset();renderAcc();$('.tabs button[data-t=req]').trigger('click')};
    $.ajax({url:$f.attr('action'),method:'POST',data:$f.serialize(),timeout:4000,success:done,error:done});
  });

  $('#fReq').on('submit',function(e){
    e.preventDefault();const $f=$(this);clear($f);let ok=true;
    const user=ls.get('ns_user',null);
    if(!user)return modal(false,'Belum punya akun','Daftar dulu di tab Registrasi Warga sebelum request penjemputan.');
    const $a=$('#alamat_jemput'),jenis=$f.find('[name=jenis]:checked').map((_,x)=>x.value).get();
    if($a.val().trim().length<8)ok=bad($a,'Isi alamat penjemputan dengan lengkap.');
    if(!jenis.length){$('#jenisErr').text('Pilih minimal 1 jenis sampah.');ok=false}
    if($('#catatan').val().length>200)ok=bad($('#catatan'),'Catatan maksimal 200 karakter.');
    if(!ok)return;
    const data={warga_email:user.email,alamat_jemput:$a.val().trim(),jenis,catatan:$('#catatan').val().trim(),tarif_jemput:TARIF,status:'Menunggu',tgl_request:new Date().toISOString().slice(0,10)};
    const done=()=>{const r=ls.get('ns_pickups',[]);r.push(data);ls.set('ns_pickups',r);
      modal(true,'Request terkirim','Status: <b>Menunggu</b>.<br>Tarif penjemputan flat <b>'+rp(TARIF)+'</b> akan dipotong dari hasil setoran.');
      $f[0].reset();$('#alamat_jemput').val(user.alamat);renderAcc()};
    $.ajax({url:$f.attr('action'),method:'POST',contentType:'application/json',data:JSON.stringify(data),timeout:4000,success:done,error:done});
  });
}

/* Navigasi Ajax */
function go(url,title){
  $('#home').toggle(!url);$('#content').toggle(!!url);$('#menu').removeClass('open');
  document.title='NabungSampah — '+title;
  if(!url){renderAcc();return}
  $('#content').html('<p class="wrap muted">Memuat…</p>').load(url,function(res,st){
    if(st==='error')return $(this).html('<div class="wrap"><div class="notice">Halaman gagal dimuat. Jalankan lewat web server (mis. Live Server), bukan file://.</div></div>');
    url.includes('katalog')?initKatalog():initForm();
  });
}
$(function(){
  $('#menu a,.go').on('click',function(e){
    e.preventDefault();const h=$(this).data('hash');const $m=$(`#menu a[data-hash="${h}"]`);
    $('#menu a').removeClass('active');$m.addClass('active');
    go($m.data('page')||'',$m.text());history.replaceState(null,'','#'+h);window.scrollTo(0,0);
  });
  $('.burger').on('click',()=>$('#menu').toggleClass('open'));
  $('#mOk').on('click',()=>$('#modal').removeClass('show'));
  $(document).on('keydown',e=>{if(e.key==='Escape')$('#modal').removeClass('show')});
  const $s=$(`#menu a[data-hash="${location.hash.slice(1)}"]`);($s.length?$s:$('#menu a').first()).trigger('click');
});
