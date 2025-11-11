// Ambil parameter proyek dari URL
const urlParams = new URLSearchParams(window.location.search);
const proyek = urlParams.get('proyek');

const namaInput = document.getElementById('namaTamu');
const generateBtn = document.getElementById('generateBtn');
const linkContainer = document.getElementById('link-container');
const generatedLink = document.getElementById('generatedLink');
const copyBtn = document.getElementById('copyBtn');
const shareBtn = document.getElementById('shareBtn');

generateBtn.addEventListener('click', () => {
  const nama = namaInput.value.trim();
  if(!nama) {
    alert("Silakan masukkan nama Anda");
    return;
  }

  // Buat link undangan
  const linkTamu = `${window.location.origin}${window.location.pathname}?proyek=${proyek}&nama=${encodeURIComponent(nama)}`;
  generatedLink.value = linkTamu;
  linkContainer.style.display = 'block';
});

// Salin link
copyBtn.addEventListener('click', () => {
  generatedLink.select();
  navigator.clipboard.writeText(generatedLink.value)
    .then(() => alert("Link berhasil disalin"))
    .catch(err => alert("Gagal menyalin link"));
});

// Bagikan link (Web Share API)
shareBtn.addEventListener('click', async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Undangan Pernikahan",
        url: generatedLink.value
      });
    } catch(err) {
      console.error(err);
    }
  } else {
    alert("Fitur bagikan tidak didukung di browser ini");
  }
});
