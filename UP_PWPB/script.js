 // Fungsi untuk filter kategori
        function filterKategori(kategori) {
            // Hapus class active dari semua tombol
            const tombols = document.querySelectorAll('.kategori-tombol button');
            tombols.forEach(btn => btn.classList.remove('active'));
            
            // Tambah class active ke tombol yang diklik
            event.target.classList.add('active');
            
            // Sembunyikan semua kategori
            const kategoris = document.querySelectorAll('.kategori');
            kategoris.forEach(kat => kat.style.display = 'none');
            
            // Tampilkan kategori yang dipilih
            if (kategori === 'semua') {
                kategoris.forEach(kat => kat.style.display = 'block');
            } else {
                document.getElementById(kategori).style.display = 'block';
            }
        }
        
        // Fungsi untuk menampilkan detail pembayaran
        function tampilkanPembayaran(namaKamar, hargaKamar) {
            document.getElementById('nama-kamar').textContent = namaKamar;
            document.getElementById('harga-kamar').textContent = hargaKamar;
            document.getElementById('pembayaran-detail').style.display = 'block';
            document.getElementById('pembayaran-detail').scrollIntoView({ behavior: 'smooth' });
        }
        
        // Fungsi untuk menyembunyikan detail pembayaran
        function sembunyikanPembayaran() {
            document.getElementById('pembayaran-detail').style.display = 'none';
        }
        
        // Script sederhana untuk scroll smooth pada nav
        document.querySelectorAll('nav a').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

//  pengisian formulir bagian tipe kamar
// Data kamar yang dipilih disimpan di sini (Global)
let kamarDipilih = {}; 

function tampilkanPembayaran(namaKamar, hargaKamarString) {
    // 1. Simpan data kamar
    kamarDipilih.nama = namaKamar;
    kamarDipilih.hargaString = hargaKamarString;
    // Ubah harga string (misal: "Rp 700.000") menjadi angka
    kamarDipilih.hargaNominal = parseInt(hargaKamarString.replace(/[^0-9]/g, ''));

    // 2. Isi ringkasan produk (product-summary)
    const productSummary = document.getElementById('product-summary');
    productSummary.innerHTML = `
        <p><strong>Kamar Dipilih:</strong> ${kamarDipilih.nama}</p>
        <p><strong>Harga Awal:</strong> ${kamarDipilih.hargaString}/bulan</p>
    `;

    // 3. Isi input di Form Pembayaran
    document.getElementById('tipe-kamar').value = kamarDipilih.nama;
    document.getElementById('hidden-nama-kamar').value = kamarDipilih.nama;
    document.getElementById('hidden-harga-kamar').value = kamarDipilih.hargaNominal;
    
    // Asumsi Tipe Booking adalah kategori (Standar/Premium/VIP)
    let tipeBooking = namaKamar.split(' ')[1] ? namaKamar.split(' ')[1].toUpperCase() : 'STANDAR';
    document.getElementById('hidden-tipe-kamar-booking').value = tipeBooking;

    // 4. Tampilkan Form Pembayaran
    const paymentSection = document.getElementById('payment-section');
    paymentSection.style.display = 'block'; 
    paymentSection.scrollIntoView({ behavior: 'smooth' });
}

// Tambahkan fungsi kembali
function goBack() {
    document.getElementById('payment-section').style.display = 'none';
    window.scrollTo({ top: document.getElementById('harga').offsetTop, behavior: 'smooth' });
}

//  formulir pengisian bagian Perhitungan Tanggal Keluar berdasarkan Tanggal Masuk dan Lama Sewa

function hitungTanggalKeluar() {
    const tanggalMasukInput = document.getElementById('tanggal-masuk');
    const lamaSewaSelect = document.getElementById('lama-sewa');
    const tanggalKeluarInput = document.getElementById('tanggal-keluar');

    const tanggalMasuk = tanggalMasukInput.value;
    const lamaSewa = lamaSewaSelect.value;

    if (!tanggalMasuk || !lamaSewa || lamaSewa === "") {
        tanggalKeluarInput.value = '';
        return;
    }

    const dateMasuk = new Date(tanggalMasuk);
    const dateKeluar = new Date(tanggalMasuk);
    let bulanTambahan = 0;

    // Tentukan jumlah bulan berdasarkan Lama Sewa
    switch (lamaSewa) {
        case 'Bulanan':
            bulanTambahan = 1;
            break;
        case '3 Bulanan':
            bulanTambahan = 3;
            break;
        case '6 Bulanan':
            bulanTambahan = 6;
            break;
        case 'Tahunan':
            bulanTambahan = 12;
            break;
        default:
            bulanTambahan = 0;
    }

    // Hitung tanggal keluar
    if (bulanTambahan > 0) {
        // Pindah ke bulan berikutnya, lalu mundur 1 hari
        dateKeluar.setMonth(dateKeluar.getMonth() + bulanTambahan);
        dateKeluar.setDate(dateKeluar.getDate() - 1); 
    } else {
         tanggalKeluarInput.value = '';
         return;
    }

    // Format tanggal ke YYYY-MM-DD
    const formattedDate = dateKeluar.toISOString().split('T')[0];
    tanggalKeluarInput.value = formattedDate;
}

// Pasang Event Listener saat dokumen siap
document.addEventListener('DOMContentLoaded', function() {
    const tanggalMasukInput = document.getElementById('tanggal-masuk');
    const lamaSewaSelect = document.getElementById('lama-sewa');
    const paymentSection = document.getElementById('payment-section');
    
    // Sembunyikan form pembayaran saat halaman dimuat
    paymentSection.style.display = 'none';

    // Event listener untuk perhitungan tanggal
    tanggalMasukInput.addEventListener('change', hitungTanggalKeluar);
    lamaSewaSelect.addEventListener('change', hitungTanggalKeluar);
    
    // Inisialisasi filter kategori
    filterKategori('semua');
});

// js untuk bagian pembayaran
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('payment-form');
    const paymentMethodSelect = document.getElementById('payment-method');
    const transferInstructionsDiv = document.getElementById('transfer-instructions');
    const confirmationMessageP = document.getElementById('confirmation-message');

    // Sembunyikan instruksi transfer dan pesan konfirmasi saat inisialisasi
    transferInstructionsDiv.style.display = 'none';
    confirmationMessageP.style.display = 'none';

    // --- LOGIKA UTAMA SAAT FORM DI-SUBMIT ---
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Mencegah form dari reload halaman

        // Pastikan form sudah tervalidasi oleh browser (required fields)
        if (!form.checkValidity()) {
            // Jika validasi HTML gagal, biarkan browser menampilkan pesan error default
            return;
        }

        const namaLengkap = document.getElementById('nama-lengkap').value;
        const hargaKamarString = document.getElementById('hidden-harga-kamar').value;
        const selectedPaymentMethod = paymentMethodSelect.value;
        
        // Asumsi harga kamar adalah harga sewa bulanan. Kita simulasikan ini adalah harga yang harus ditransfer.
        const hargaNumerik = parseInt(hargaKamarString) || 0; 
        
        // Format harga ke mata uang Rupiah
        const hargaFormatted = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(hargaNumerik);

        // Hanya tampilkan instruksi transfer jika metode yang dipilih adalah 'transfer' atau 'ewallet'
        if (selectedPaymentMethod === 'transfer' || selectedPaymentMethod === 'ewallet') {
            
            // --- DATA SIMULASI TRANSFER ---
            const bankName = "Mandiri";
            const accountNumber = "1234567890";
            // Ganti nama atas nama (gunakan nama Kos Anda)
            const atasNama = "Kost Sederhana Management"; 
            const contactWA = "081234567893"; 
            // Ambil nama depan user untuk pesan konfirmasi
            const namaDepan = namaLengkap.split(' ')[0];

            // --- GENERASI INTRUKSI HTML ---
            transferInstructionsDiv.innerHTML = `
                <h3>Instruksi Pembayaran ${selectedPaymentMethod === 'transfer' ? 'Transfer Bank' : 'E-Wallet'}</h3>
                <div class="transfer-box">
                    <p>Silakan transfer sebesar <strong>${hargaFormatted}</strong> ke rekening berikut:</p>
                    <p><strong>Bank/E-Wallet:</strong> ${bankName}</p>
                    <p><strong>Nomor Rekening:</strong> ${accountNumber}</p>
                    <p><strong>Atas Nama:</strong> ${atasNama}</p>
                    <br>
                    <p>Setelah transfer, kirim bukti ke WhatsApp kami di <strong>${contactWA}</strong> untuk konfirmasi.</p>
                </div>
            `;
            
            // Tampilkan pesan konfirmasi (disesuaikan dengan gambar)
            confirmationMessageP.textContent = `Pesanan dikonfirmasi! Terima kasih ${namaDepan}. Silakan lakukan transfer sesuai instruksi di atas.`;

            transferInstructionsDiv.style.display = 'block';
            confirmationMessageP.style.display = 'block';
            
            // Scroll ke bagian notifikasi
            transferInstructionsDiv.scrollIntoView({ behavior: 'smooth' });

        } else if (selectedPaymentMethod === 'cod') {
            // Jika memilih COD (Bayar di Tempat)
             const namaDepan = namaLengkap.split(' ')[0];
             transferInstructionsDiv.innerHTML = `
                <h3>Konfirmasi Pembayaran COD</h3>
                <div class="transfer-box" style="border-left: 5px solid #007bff; background-color: #e9f7ff;">
                    <p>Pemesanan Anda telah dikonfirmasi!</p>
                    <p>Anda telah memilih **Bayar di Tempat (COD)**. Pembayaran sebesar <strong>${hargaFormatted}</strong> akan dilakukan saat Anda *check-in* di kos.</p>
                </div>
             `;
             confirmationMessageP.textContent = `Pesanan dikonfirmasi! Terima kasih ${namaDepan}. Kami tunggu kedatangan Anda!`;
             transferInstructionsDiv.style.display = 'block';
             confirmationMessageP.style.display = 'block';
             transferInstructionsDiv.scrollIntoView({ behavior: 'smooth' });
             
        } else {
            alert("Mohon pilih metode pembayaran yang valid.");
        }
        
        // Opsional: Nonaktifkan form agar tidak bisa di-submit ulang
        // form.querySelectorAll('input, select, button').forEach(el => el.disabled = true);
    });

    // Anda bisa tambahkan atau gabungkan kode-kode JS lain (perhitungan tanggal, dll.) di sini
    // ...
});