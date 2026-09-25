 const SHEETDB_URL = "https://sheetdb.io/api/v1/km86h3j51men0";

    let currentTab = "siswa";

    const tabSiswaBtn = document.getElementById("tabSiswaBtn");
    const tabUmumBtn = document.getElementById("tabUmumBtn");
    const kelasWrapper = document.getElementById("kelasWrapper");
    const kelasSelect = document.getElementById("kelas");
    const labelNama = document.getElementById("labelNama");
    const namaLengkapInput = document.getElementById("namaLengkap");
    const form = document.getElementById("bannerForm");
    const submitBtn = document.getElementById("submitBtn");

    const customModal = document.getElementById("customModal");
    const modalContainer = document.getElementById("modalContainer");
    const modalIconContainer = document.getElementById("modalIconContainer");
    const modalTitle = document.getElementById("modalTitle");
    const modalMessage = document.getElementById("modalMessage");

    function showModal(type, title, message) {
      modalTitle.textContent = title;
      modalMessage.textContent = message;

      if (type === "success") {
        modalIconContainer.className = "w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-xl mb-4 mx-auto text-emerald-700";
        modalIconContainer.innerHTML = "✅";
      } else {
        modalIconContainer.className = "w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-xl mb-4 mx-auto text-rose-700";
        modalIconContainer.innerHTML = "⚠️";
      }

      customModal.classList.remove("opacity-0", "pointer-events-none");
      modalContainer.classList.remove("scale-95");
      modalContainer.classList.add("scale-100");
    }

    function closeModal() {
      customModal.classList.add("opacity-0", "pointer-events-none");
      modalContainer.classList.remove("scale-100");
      modalContainer.classList.add("scale-95");
    }

    const activeTabClass = ["bg-emerald-900", "text-amber-400", "shadow-sm"];
    const inactiveTabClass = ["text-stone-500", "hover:text-stone-700"];

    function switchTab(tab) {
      currentTab = tab;
      if (tab === "siswa") {
        tabSiswaBtn.classList.remove(...inactiveTabClass);
        tabSiswaBtn.classList.add(...activeTabClass);
        tabUmumBtn.classList.remove(...activeTabClass);
        tabUmumBtn.classList.add(...inactiveTabClass);

        kelasWrapper.classList.remove("hidden");
        kelasSelect.setAttribute("required", "true");
        labelNama.textContent = "Nama Lengkap Siswa *";
      } else {
        tabUmumBtn.classList.remove(...inactiveTabClass);
        tabUmumBtn.classList.add(...activeTabClass);
        tabSiswaBtn.classList.remove(...activeTabClass);
        tabSiswaBtn.classList.add(...inactiveTabClass);

        kelasWrapper.classList.add("hidden");
        kelasSelect.removeAttribute("required");
        kelasSelect.value = "";
        labelNama.textContent = "Nama Lengkap Pemesan (Umum) *";
      }
    }

    switchTab("siswa");

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const nilaiKelas = currentTab === "siswa" ? kelasSelect.value : "UMUM";

      const payload = {
        data: {
          "NAMA_PEMOHON": namaLengkapInput.value.trim(),
          "KELAS": nilaiKelas,
          "NAMA_TOKO": document.getElementById("namaToko").value.trim(),
          "NOMER_HP": document.getElementById("nomorHp").value.trim(),
          "ALAMAT_LENGKAP": document.getElementById("alamat").value.trim(),
          "PANJANG": document.getElementById("panjang").value.trim(),
          "LEBAR": document.getElementById("lebar").value.trim(),
          "KETERANGAN": document.getElementById("keterangan").value.trim(),
          "JENIS_TOKO": document.getElementById("jenisToko").value.trim(),
          "ALAMAT_TOKO": document.getElementById("alamatToko").value.trim()
        }
      };

      submitBtn.disabled = true;
      const teksAsli = submitBtn.textContent;
      submitBtn.textContent = "Mengirim...";

      try {
        const response = await fetch(SHEETDB_URL, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || `Gagal dari server (Kode: ${response.status})`);
        }

        showModal(
          "success", 
          "Berhasil Terkirim!", 
          "Permintaan cetak banner berhasil dikirim ke database. Pesanan Anda akan diproses dan didistribusikan pada bulan Januari."
        );
        
        form.reset();
        switchTab("siswa");

      } catch (error) {
        console.error("Error Detail:", error);
        showModal(
          "error", 
          "Gagal Mengirim", 
          "Terjadi kesalahan koneksi ke database SheetDB. Periksa kembali jaringan atau konfigurasi Anda.\nPesan: " + error.message
        );
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = teksAsli;
      }
    });