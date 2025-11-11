/* ========================================================= */
/* ===== LGT PEMESAN FINAL SCRIPT – LINK TAMU + TEKS ====== */
/* ========================================================= */

// URL Google Apps Script Anda
const sheetURL = "https://script.google.com/macros/s/AKfycbxN4xsOjnYwO0TTTWJ_HLv9JIlrdKAou7bbJaoWLIP4I-PDy3v5Jh4dzq-LlWoGy52_/exec";

const urlParams = new URLSearchParams(window.location.search);
const proyek = urlParams.get('proyek'); // Mengambil ID Proyek dari URL

const namaInput = document.getElementById('namaTamu');
const generateBtn = document.getElementById('generateBtn');
const linkContainer = document.getElementById('link-container');
const generatedLink = document.getElementById('generatedLink');
const shareBtn = document.getElementById('shareBtn');
const copyBtn = document.getElementById('copyBtn');
const invitationTextEl = document.getElementById('invitationText'); 

// ⚠️ Variabel Global untuk menyimpan data proyek setelah diambil
let projectData = null;

// Template Teks Undangan Penuh (Ini adalah *Template_Full* yang harus Anda simpan di Spreadsheet)
const FULL_INVITATION_TEMPLATE = `Assalamualaikum warahmatullahi wabarakatuh

[AWALTEMPLATE]
Yang akan diselenggarakan pada:

Hari/Tanggal: [HARI_TANGGAL]

Waktu: [WAKTU_ACARA]

Lokasi: [LOKASI]

Untuk informasi lebih lanjut, silahkan akses tautan berikut:
[LINK_UNDANGAN]

Kehadiran anda adalah suatu kehormatan dan kebahagiaan bagi kami.
Waalaikumussalam warahmatullahi wabarakatuh

Kami yang berbahagia,
[NAMA_MEMPELAI]`;


// 1. Fungsi Diperluas: Mengambil SEMUA data proyek yang diperlukan
async function getProjectData(proyekId) {
    // Fungsi ini diasumsikan endpoint sheetURL Anda bisa mengembalikan
    // data lengkap proyek: {id, url, namaMempelai, hariTanggal, waktuAcara, lokasi, awaltemplate, ...}
    try {
        const res = await fetch(`${sheetURL}?action=get`);
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await res.json();
        const project = data.find(p => Number(p.id) === Number(proyekId));
        return project; // Mengembalikan objek penuh
    } catch (err) {
        console.error("❌ Gagal mengambil data proyek:", err);
        return null;
    }
}

// 2. Load data saat halaman pertama dimuat
document.addEventListener('DOMContentLoaded', async () => {
    if (proyek) {
        // Ambil dan simpan data proyek ke variabel global
        projectData = await getProjectData(proyek);
        if (!projectData) {
            // Tampilkan error jika data proyek tidak ditemukan
            document.querySelector('.container').innerHTML = `<p style="color: red;">❌ Proyek dengan ID ${proyek} tidak ditemukan atau gagal dimuat.</p>`;
        }
    } else {
        document.querySelector('.container').innerHTML = `<p style="color: orange;">⚠️ Silakan tentukan ID proyek di URL (contoh: ?proyek=1).</p>`;
    }
});


// 3. Event Listener Utama: Membuat Link dan Teks Undangan
generateBtn.addEventListener('click', () => {
    const nama = namaInput.value.trim();
    if (!nama) {
        alert("Silakan masukkan nama Tamu.");
        return;
    }

    if (!projectData || !projectData.url) {
        alert("❌ Data proyek belum berhasil dimuat. Coba refresh halaman.");
        return;
    }

    // A. Buat Link Undangan Personal
    const linkTamu = `${projectData.url}?to=${encodeURIComponent(nama)}`;
    generatedLink.value = linkTamu;
    
    // B. Buat Teks Undangan Menggunakan Template Literals
    const finalSentence = FULL_INVITATION_TEMPLATE
        .replace('[AWALTEMPLATE]', projectData.awaltemplate)
        .replace('[HARI_TANGGAL]', projectData.hariTanggal)
        .replace('[WAKTU_ACARA]', projectData.waktuAcara)
        .replace('[LOKASI]', projectData.lokasi)
        .replace('[NAMA_MEMPELAI]', projectData.namaMempelai)
        .replace('[LINK_UNDANGAN]', linkTamu); // Link Tamu disisipkan di sini

    // C. Tampilkan dan Siapkan untuk dibagikan
    invitationTextEl.textContent = finalSentence;
    linkContainer.style.display = 'block';
});

// 4. Tombol salin Teks Undangan (Diubah fungsinya agar lebih powerful)
// Lebih baik menyalin Teks Undangan LENGKAP daripada hanya link
copyBtn.addEventListener('click', async () => {
    const textToCopy = invitationTextEl.textContent;
    if (!textToCopy || textToCopy.includes('[LINK_UNDANGAN]')) {
        alert("⚠️ Silakan buat link undangan terlebih dahulu.");
        return;
    }

    try {
        await navigator.clipboard.writeText(textToCopy);
        alert("✅ Teks undangan LENGKAP berhasil disalin!");
    } catch (err) {
        console.error(err);
        alert("❌ Gagal menyalin teks.");
    }
});

// 5. Tombol bagikan link + teks undangan
shareBtn.addEventListener('click', async () => {
    const textToShare = invitationTextEl.textContent;
    if (!textToShare || textToShare.includes('[LINK_UNDANGAN]')) {
        alert("⚠️ Silakan buat link undangan terlebih dahulu.");
        return;
    }

    if (navigator.share) {
        try {
            await navigator.share({
                title: `Undangan ${projectData.namaMempelai}`,
                text: textToShare
            });
        } catch (err) {
            console.warn("Batal membagikan:", err);
        }
    } else {
        alert("Web Share API tidak didukung di perangkat ini. Silakan gunakan tombol salin.");
    }
});