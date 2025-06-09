<template>
  <div class="space-y-6 lg:space-y-8">
    <!-- Header Halaman -->
    <div>
      <h1 class="text-3xl lg:text-4xl font-bold text-gray-800">Kalkulator BMI</h1>
      <p class="mt-2 text-gray-600">Hitung Indeks Massa Tubuh Anda untuk mengetahui status berat badan Anda.</p>
    </div>

    <!-- Layout Utama: Kalkulator & Hasil -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      <!-- Kolom Kalkulator -->
      <div class="lg:col-span-2 bg-white p-6 lg:p-8 rounded-2xl shadow-lg">
        <h2 class="text-xl font-semibold text-gray-800 mb-6">Masukkan Data Anda</h2>
        <form @submit.prevent="calculateBMI" class="space-y-5">
          <div>
            <label for="weight" class="block text-sm font-medium text-gray-700 mb-1.5">Berat Badan (kg)</label>
            <input 
              id="weight"
              type="number"
              step="0.1"
              v-model.number="weight"
              placeholder="Contoh: 70.5"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgba(0,119,137,0.3)] focus:border-[rgba(0,119,137,1)] transition-colors"
            />
          </div>
          <div>
            <label for="height" class="block text-sm font-medium text-gray-700 mb-1.5">Tinggi Badan (cm)</label>
            <input
              id="height"
              type="number"
              step="0.1"
              v-model.number="height"
              placeholder="Contoh: 175"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgba(0,119,137,0.3)] focus:border-[rgba(0,119,137,1)] transition-colors"
            />
          </div>
          <div v-if="errorMessage" class="bg-red-50 text-red-700 p-3 rounded-lg text-sm text-center">
            {{ errorMessage }}
          </div>
          <div class="pt-2">
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-[rgba(0,119,137,1)] hover:bg-[rgba(0,90,105,1)] text-white px-6 py-3.5 rounded-lg font-semibold text-base transition-all duration-200 hover:shadow-lg disabled:opacity-60 disabled:cursor-wait"
            >
              <span v-if="loading">Menghitung...</span>
              <span v-else>Hitung BMI & Simpan</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Kolom Hasil -->
      <div class="bg-white p-6 lg:p-8 rounded-2xl shadow-lg flex flex-col justify-center items-center text-center">
        <transition name="fade-slide" mode="out-in">
          <div v-if="bmiResult" :key="bmiResult.value">
            <p class="text-gray-600 mb-1">Hasil BMI Anda</p>
            <p class="text-5xl font-bold" :style="{ color: bmiResult.color }">{{ bmiResult.value.toFixed(1) }}</p>
            <p class="font-semibold text-lg mt-2" :style="{ color: bmiResult.color }">{{ bmiResult.category }}</p>
            <div class="w-full bg-gray-200 rounded-full h-3.5 my-4 overflow-hidden">
              <div class="h-full rounded-full transition-all duration-700 ease-out" :style="{ width: bmiResult.percentage + '%', backgroundColor: bmiResult.color }"></div>
            </div>
            <p class="text-xs text-gray-500 text-center">{{ bmiResult.interpretation }}</p>
          </div>
          <div v-else class="text-gray-400">
            <i class="fas fa-calculator text-4xl mb-3"></i>
            <p>Hasil Anda akan ditampilkan di sini.</p>
          </div>
        </transition>
      </div>
    </div>
    
    <!-- Riwayat Perhitungan -->
    <div class="bg-white p-6 lg:p-8 rounded-2xl shadow-lg">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Riwayat Perhitungan Anda</h2>
        <div v-if="historyLoading" class="text-center text-gray-500 py-5">
            <p>Memuat riwayat...</p>
        </div>
        <div v-else-if="history.length === 0" class="text-center text-gray-400 py-5">
            <p>Anda belum memiliki riwayat perhitungan.</p>
        </div>
        <div v-else class="space-y-3">
          <!-- Tampilan riwayat yang lebih modern -->
          <div v-for="item in history" :key="item.id" class="grid grid-cols-4 md:grid-cols-5 gap-4 items-center p-3 rounded-lg hover:bg-slate-50">
            <div class="font-semibold text-gray-800 col-span-2 md:col-span-1">{{ new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) }}</div>
            <div class="text-gray-600"><span class="font-medium">{{ item.bmi_value.toFixed(1) }}</span> <span class="hidden sm:inline">BMI</span></div>
            <div class="text-gray-600 text-center"><span class="px-2.5 py-1 text-xs leading-5 font-semibold rounded-full" :class="getCategoryClass(item.category)">{{ item.category }}</span></div>
            <div class="text-gray-600 text-right"><span class="hidden sm:inline">W:</span> {{ item.weight }}kg / <span class="hidden sm:inline">H:</span> {{ item.height }}cm</div>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabaseClient'

// State reaktif dari kode Anda
const weight = ref(null);
const height = ref(null);
const loading = ref(false);
const errorMessage = ref(null);
const bmiResult = ref(null);
const history = ref([]);
const historyLoading = ref(true);
const user = ref(null);

// Mengambil sesi & data user saat komponen dimuat
onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    user.value = session.user;
    fetchHistory();
  } else {
    historyLoading.value = false;
  }
});

// Mengambil riwayat BMI dari Supabase
const fetchHistory = async () => {
  if (!user.value) return;
  try {
    historyLoading.value = true;
    const { data, error } = await supabase
      .from('bmi_history')
      .select('*')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })
      .limit(10); // Ambil 10 riwayat terbaru

    if (error) throw error;
    history.value = data;
  } catch (error) {
    console.error("Error fetching BMI history:", error.message);
  } finally {
    historyLoading.value = false;
  }
};

// Menghitung BMI
const calculateBMI = async () => {
  errorMessage.value = null;
  if (!weight.value || !height.value || weight.value <= 0 || height.value <= 0) {
    errorMessage.value = "Mohon masukkan berat dan tinggi badan yang valid.";
    return;
  }
  loading.value = true;

  const heightInMeters = height.value / 100;
  const bmi = weight.value / (heightInMeters * heightInMeters);
  
  let category = '';
  let color = '';
  let interpretation = '';
  let percentage = 0;

  if (bmi < 18.5) {
    category = 'Berat Badan Kurang';
    color = 'rgb(52, 152, 219)'; // Biru
    interpretation = 'Anda mungkin perlu menambah asupan nutrisi.';
    percentage = (bmi / 18.5) * 25;
  } else if (bmi >= 18.5 && bmi < 24.9) {
    category = 'Berat Badan Ideal';
    color = 'rgb(46, 204, 113)'; // Hijau
    interpretation = 'Selamat! Berat badan Anda termasuk dalam kategori ideal.';
    percentage = 25 + ((bmi - 18.5) / (24.9 - 18.5)) * 25;
  } else if (bmi >= 25 && bmi < 29.9) {
    category = 'Berat Badan Berlebih';
    color = 'rgb(243, 156, 18)'; // Oranye
    interpretation = 'Anda memiliki risiko lebih tinggi terhadap penyakit tertentu.';
    percentage = 50 + ((bmi - 25) / (29.9 - 25)) * 25;
  } else {
    category = 'Obesitas';
    color = 'rgb(231, 76, 60)'; // Merah
    interpretation = 'Risiko kesehatan Anda meningkat signifikan. Disarankan untuk berkonsultasi dengan dokter.';
    percentage = 75 + Math.min(((bmi - 30) / (40 - 30)) * 25, 25);
  }
  percentage = Math.min(Math.max(percentage, 0), 100);

  const result = { value: bmi, category, color, interpretation, percentage };
  bmiResult.value = result;

  // Simpan hasil ke database
  await saveCalculation(result);

  loading.value = false;
};

// Menyimpan hasil ke Supabase
const saveCalculation = async (result) => {
  if (!user.value) return;
  try {
    const { error } = await supabase.from('bmi_history').insert([
      {
        user_id: user.value.id,
        weight: weight.value,
        height: height.value,
        bmi_value: result.value,
        category: result.category,
      },
    ]);
    if (error) throw error;

    // Refresh data riwayat setelah berhasil menyimpan
    await fetchHistory();
  } catch (error) {
    console.error("Error saving BMI data:", error.message);
  }
};

// Fungsi helper untuk styling kategori di tabel
const getCategoryClass = (category) => {
    switch (category) {
        case 'Berat Badan Kurang': return 'bg-blue-100 text-blue-800';
        case 'Berat Badan Ideal': return 'bg-green-100 text-green-800';
        case 'Berat Badan Berlebih': return 'bg-yellow-100 text-yellow-800';
        case 'Obesitas': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};
</script>

<style scoped>
.loader {
  border: 6px solid #f3f3f3;
  border-top: 6px solid rgba(0,119,137,1);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(15px);
}
</style>
