/* ========================================================= */
/* ===== LGT PEMESAN SCRIPT – LINK UNDANGAN OTOMATIS ===== */
/* ========================================================= */

const sheetURL = "https://script.google.com/macros/s/AKfycbxN4xsOjnYwO0TTTWJ_HLv9JIlrdKAou7bbJaoWLIP4I-PDy3v5Jh4dzq-LlWoGy52_/exec";

// Ambil parameter proyek dari URL
const urlParams = new URLSearchParams(window.location.search);
const proyek = urlParams.get('proyek');

// Elemen halaman
const namaInput = document.getElementById('namaTamu');
const generateBtn = document.getElementById('generateBtn');
const linkContainer = document.getElementById('link-container');
const generatedLink = document.getElementById('generatedLink');
const copyBtn = document.getElementById('copyBtn');
const shareBtn = document.getElementById('shareBtn');

/**
 * Ambil URL undangan utama proyek dari Google Sheet
 * @param {string} proyekId 
 * @returns {string|null} URL undangan utama atau null jika tidak ditemukan
 */
async function getProjectUrl(proyekId) {
  try {
    const res = await fetch(`${sheetURL}?action=get`);
    const data = await res.json();
    const project = data.find(p => p.id === proyekId);
    return project ? project.url : null;
  } catch(err) {
    console.error("❌ Gagal mengambil data proyek:", err);
    return null;
  }
}

// Event tombol buat link
generateBtn.addEventListener('click', async () => {
  const nama = namaInput.value.trim();
  if (!nama) {
    alert("Silakan masukkan nama Anda");
    return;
  }

  // Ambil URL undangan utama dari spreadsheet
  const projectUrl = await getProjectUrl(proyek);
  if (!projectUrl) {
    alert("❌ URL undangan proyek tidak ditemukan. Periksa nomor proyek.");
    return;
  }

  // Buat link undangan untuk tamu
  const linkTamu = `${projectUrl}?to=${encodeURIComponent(nama)}`;

  // Tampilkan hasil di halaman
  generatedLink.value = linkTamu;
  linkContainer.style.display = 'block';
});

// Tombol salin link
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(generatedLink.value);
    alert("✅ Link berhasil disalin!");
  } catch(err) {
    console.error(err);
    alert("❌ Gagal menyalin link.");
  }
});

// Tombol bagikan (Web Share API)
shareBtn.addEventListener('click', async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Undangan Pernikahan",
        text: "Berikut link undangan Anda:",
        url: generatedLink.value
      });
    } catch(err) {
      console.warn("Batal membagikan:", err);
    }
  } else {
    alert("Web Share API tidak didukung di perangkat ini.");
  }
});

