const loginContainer = document.getElementById('login-container');
const adminContainer = document.getElementById('admin-container');
const loginBtn = document.getElementById('loginBtn');

const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

// Username & password admin
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "12345";

loginBtn.addEventListener('click', () => {
  const u = usernameInput.value.trim();
  const p = passwordInput.value.trim();
  if(u === ADMIN_USERNAME && p === ADMIN_PASSWORD) {
    loginContainer.style.display = 'none';
    adminContainer.style.display = 'block';
    loadProyek();
  } else {
    alert("❌ Username atau password salah");
  }
});

// ===== Tambah proyek =====
const addBtn = document.getElementById('addProyekBtn');
const nomorInput = document.getElementById('nomorProyek');
const namaInput = document.getElementById('namaProyek');
const urlInput = document.getElementById('urlAsli');

// Ganti dengan URL Web App Google Sheet
const sheetURL = "https://script.google.com/macros/s/AKfycbxN4xsOjnYwO0TTTWJ_HLv9JIlrdKAou7bbJaoWLIP4I-PDy3v5Jh4dzq-LlWoGy52_/exec";

addBtn.addEventListener('click', async () => {
  const nomor = nomorInput.value.trim();
  const nama = namaInput.value.trim();
  const url = urlInput.value.trim();

  if(!nomor || !nama || !url) return alert("⚠️ Isi semua data");

  try {
    const res = await fetch(sheetURL, {
      method: "POST",
      body: JSON.stringify({ nomor, nama, url }),
      headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();

    if(data.status === "success") {
      alert("✅ Proyek berhasil ditambahkan");
      nomorInput.value = namaInput.value = urlInput.value = "";
      loadProyek();
    } else {
      alert("❌ Gagal menambahkan proyek: " + (data.message || "Unknown error"));
    }

  } catch(err) {
    console.error(err);
    alert("❌ Error koneksi ke Google Sheet. Pastikan Web App sudah deploy & permission = Anyone");
  }
});

// ===== Load daftar proyek =====
async function loadProyek() {
  try {
    const res = await fetch(sheetURL + "?action=get");
    const data = await res.json();
    const tbody = document.querySelector('#proyekTable tbody');
    tbody.innerHTML = "";

    data.forEach(row => {
      const tr = document.createElement('tr');
      const linkPemesan = `${window.location.origin.replace('/admin','')}/?proyek=${row.nomor}`;
      tr.innerHTML = `
        <td>${row.nomor}</td>
        <td>${row.nama}</td>
        <td><a href="${row.url}" target="_blank">${row.url}</a></td>
        <td><a href="${linkPemesan}" target="_blank">${linkPemesan}</a></td>
      `;
      tbody.appendChild(tr);
    });
  } catch(err) {
    console.error(err);
    alert("❌ Gagal load daftar proyek. Cek koneksi ke Web App Google Sheet");
  }
}
