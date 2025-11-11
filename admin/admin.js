// ===== admin.js =====

// URL Web App Google Sheet
const sheetURL = "https://script.google.com/macros/s/AKfycbxN4xsOjnYwO0TTTWJ_HLv9JIlrdKAou7bbJaoWLIP4I-PDy3v5Jh4dzq-LlWoGy52_/exec";

// ===== Login admin sederhana =====
const adminUsername = "admin"; // ganti sesuai keinginan
const adminPassword = "password123"; // ganti sesuai keinginan

const loginForm = document.getElementById("loginForm");
const adminPanel = document.getElementById("adminPanel");

loginForm?.addEventListener("submit", function(e) {
  e.preventDefault();
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if(user === adminUsername && pass === adminPassword){
    loginForm.style.display = "none";
    adminPanel.style.display = "block";
    loadProyek(); // load daftar proyek setelah login
  } else {
    alert("Username / Password salah!");
  }
});

// ===== Ambil daftar proyek dari Web App =====
function loadProyek() {
  fetch(`${sheetURL}?action=get`)
    .then(res => res.json())
    .then(data => {
      if(!Array.isArray(data)){
        alert("Gagal load daftar proyek, cek koneksi ke Web App Google Sheet");
        return;
      }

      const tabel = document.getElementById("tabelProyek");
      tabel.innerHTML = ""; // bersihkan table dulu

      data.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${row.id}</td>
          <td>${row.nama}</td>
          <td><a href="${row.url}" target="_blank">Link Undangan</a></td>
          <td>${row.timestamp || ""}</td>
          <td><a href="${window.location.origin}/LGT/?proyek=${row.id}" target="_blank">Link Pemesan</a></td>
        `;
        tabel.appendChild(tr);
      });
    })
    .catch(err => {
      console.error(err);
      alert("Gagal load daftar proyek, cek koneksi ke Web App Google Sheet");
    });
}

// ===== Tambah proyek baru =====
const addBtn = document.getElementById("addProyekBtn");
addBtn?.addEventListener("click", function() {
  const nomor = document.getElementById("nomorProyek").value.trim();
  const nama = document.getElementById("namaProyek").value.trim();
  const url = document.getElementById("urlAsli").value.trim();

  if(!nomor || !nama || !url){
    alert("Semua field wajib diisi!");
    return;
  }

  // Encode parameter agar aman
  const params = new URLSearchParams({
    add: "1",
    id: nomor,
    nama: nama,
    url: url
  });

  fetch(`${sheetURL}?${params.toString()}`)
    .then(res => res.json())
    .then(data => {
      if(data.status === "success"){
        alert("Proyek berhasil ditambahkan!");
        document.getElementById("nomorProyek").value = "";
        document.getElementById("namaProyek").value = "";
        document.getElementById("urlAsli").value = "";
        loadProyek(); // reload daftar proyek
      } else {
        alert("Gagal menambahkan proyek: " + (data.message || ""));
      }
    })
    .catch(err => {
      console.error(err);
      alert("Gagal koneksi ke Web App Google Sheet");
    });
});
