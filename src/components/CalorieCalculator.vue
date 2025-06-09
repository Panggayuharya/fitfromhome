<template>
  <div class="space-y-6 lg:space-y-8">
    <!-- Header Halaman -->
    <div>
      <h1 class="text-3xl lg:text-4xl font-bold text-gray-800">Kalkulator Kalori Harian</h1>
      <p class="mt-2 text-gray-600">Perkirakan kebutuhan kalori harian Anda berdasarkan tingkat aktivitas dan data tubuh Anda.</p>
    </div>

    <!-- Layout Utama: Kalkulator & Hasil -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      <!-- Kolom Kalkulator -->
      <div class="lg:col-span-2 bg-white p-6 lg:p-8 rounded-2xl shadow-lg">
        <h2 class="text-xl font-semibold text-gray-800 mb-6">Lengkapi Data Diri Anda</h2>
        <form @submit.prevent="calculateCalories" class="space-y-5">
          <!-- Input Usia & Jenis Kelamin -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label for="age" class="block text-sm font-medium text-gray-700 mb-1.5">Usia</label>
              <input id="age" type="number" v-model.number="age" placeholder="Tahun" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgba(0,119,137,0.3)] focus:border-[rgba(0,119,137,1)] transition-colors"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Jenis Kelamin</label>
              <div class="grid grid-cols-2 gap-2">
                  <button type="button" @click="gender = 'Pria'" :class="gender === 'Pria' ? 'bg-[rgba(0,119,137,1)] text-white' : 'bg-slate-100 hover:bg-slate-200'" class="py-3 font-medium rounded-lg transition-colors">Pria</button>
                  <button type="button" @click="gender = 'Wanita'" :class="gender === 'Wanita' ? 'bg-[rgba(0,119,137,1)] text-white' : 'bg-slate-100 hover:bg-slate-200'" class="py-3 font-medium rounded-lg transition-colors">Wanita</button>
              </div>
            </div>
          </div>
          <!-- Input Berat & Tinggi -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label for="weight" class="block text-sm font-medium text-gray-700 mb-1.5">Berat Badan (kg)</label>
              <input id="weight" type="number" step="0.1" v-model.number="weight" placeholder="Contoh: 70" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgba(0,119,137,0.3)] focus:border-[rgba(0,119,137,1)] transition-colors"/>
            </div>
            <div>
              <label for="height" class="block text-sm font-medium text-gray-700 mb-1.5">Tinggi Badan (cm)</label>
              <input id="height" type="number" step="0.1" v-model.number="height" placeholder="Contoh: 175" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgba(0,119,137,0.3)] focus:border-[rgba(0,119,137,1)] transition-colors"/>
            </div>
          </div>
          <!-- Tingkat Aktivitas -->
          <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Tingkat Aktivitas</label>
              <select v-model="activityLevel" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgba(0,119,137,0.3)] focus:border-[rgba(0,119,137,1)] transition-colors">
                  <option disabled value="">Pilih tingkat aktivitas Anda</option>
                  <option v-for="level in activityOptions" :key="level.value" :value="level.value">{{ level.text }}</option>
              </select>
          </div>
          <div class="pt-2">
            <button type="submit" :disabled="loading" class="w-full bg-[rgba(0,119,137,1)] hover:bg-[rgba(0,90,105,1)] text-white px-6 py-3.5 rounded-lg font-semibold text-base transition-all duration-200 hover:shadow-lg disabled:opacity-60 disabled:cursor-wait">
              <span v-if="loading">Menghitung...</span>
              <span v-else>Hitung Kebutuhan Kalori</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Kolom Hasil -->
      <div class="bg-white p-6 lg:p-8 rounded-2xl shadow-lg flex flex-col justify-center items-center text-center">
        <transition name="fade-slide" mode="out-in">
          <div v-if="calorieResult" :key="calorieResult.tdee">
            <p class="text-gray-600 mb-2">Kebutuhan Kalori Harian Anda (TDEE)</p>
            <p class="text-5xl font-bold text-[rgba(0,119,137,1)] mb-4">{{ calorieResult.tdee.toFixed(0) }} <span class="text-2xl text-gray-500">kkal/hari</span></p>
            <div class="bg-slate-100 p-3 rounded-lg text-sm">
                <p class="text-gray-600">Metabolisme Basal (BMR): <strong class="text-gray-800">{{ calorieResult.bmr.toFixed(0) }}</strong> kkal</p>
            </div>
          </div>
          <div v-else class="text-gray-400">
            <i class="fas fa-fire-alt text-4xl mb-3"></i>
            <p>Hasil perhitungan kalori akan muncul di sini.</p>
          </div>
        </transition>
      </div>
    </div>
    
    <!-- Riwayat Perhitungan -->
    <div class="bg-white p-6 lg:p-8 rounded-2xl shadow-lg">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Riwayat Perhitungan Kalori</h2>
        <div v-if="historyLoading" class="text-center text-gray-500 py-5"><p>Memuat riwayat...</p></div>
        <div v-else-if="history.length === 0" class="text-center text-gray-400 py-5"><p>Anda belum memiliki riwayat perhitungan kalori.</p></div>
        <div v-else class="space-y-3">
          <div v-for="item in history" :key="item.id" class="grid grid-cols-2 md:grid-cols-4 gap-4 items-center p-3 rounded-lg hover:bg-slate-50">
            <div class="font-semibold text-gray-800">{{ new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) }}</div>
            <div class="text-gray-600 text-center"><strong class="text-gray-800">{{ item.bmr.toFixed(0) }}</strong> kkal <span class="hidden sm:inline">(BMR)</span></div>
            <div class="text-gray-600 text-center"><strong class="text-[rgba(0,119,137,1)]">{{ item.tdee.toFixed(0) }}</strong> kkal <span class="hidden sm:inline">(TDEE)</span></div>
            <div class="text-gray-500 text-sm text-right hidden md:block">{{ item.activity_level }}</div>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabaseClient'

// --- State Reaktif ---
const age = ref(null);
const gender = ref('Pria');
const weight = ref(null);
const height = ref(null);
const activityLevel = ref('');
const loading = ref(false);
const calorieResult = ref(null);
const history = ref([]);
const historyLoading = ref(true);
const user = ref(null);

const activityOptions = ref([
    { text: 'Sangat jarang olahraga', value: 1.2 },
    { text: 'Jarang (1-3 kali/minggu)', value: 1.375 },
    { text: 'Normal (3-5 kali/minggu)', value: 1.55 },
    { text: 'Sering (6-7 kali/minggu)', value: 1.725 },
    { text: 'Sangat sering (atlet/pekerja fisik)', value: 1.9 },
]);

// --- Lifecycle Hook ---
onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    user.value = session.user;
    fetchHistory();
  } else {
    historyLoading.value = false;
  }
});

// --- Logika Kalkulator ---
async function calculateCalories() {
    if (!age.value || !gender.value || !weight.value || !height.value || !activityLevel.value) {
        alert("Mohon lengkapi semua data.");
        return;
    }
    loading.value = true;
    
    // Rumus BMR (Mifflin-St Jeor)
    let bmr = (10 * weight.value) + (6.25 * height.value) - (5 * age.value);
    if (gender.value === 'Pria') {
        bmr += 5;
    } else {
        bmr -= 161;
    }

    // Rumus TDEE (BMR * Tingkat Aktivitas)
    const tdee = bmr * activityLevel.value;

    const result = { bmr, tdee };
    calorieResult.value = result;

    await saveCalculation(result);

    loading.value = false;
}

// --- Logika Riwayat ---
async function saveCalculation(result) {
    if (!user.value) return;
    try {
        const activityText = activityOptions.value.find(opt => opt.value === activityLevel.value)?.text || 'Tidak diketahui';
        const { error } = await supabase.from('calorie_history').insert([{
            user_id: user.value.id,
            age: age.value,
            gender: gender.value,
            weight_kg: weight.value,
            height_cm: height.value,
            activity_level: activityText,
            bmr: result.bmr,
            tdee: result.tdee,
        }]);
        if (error) throw error;
        await fetchHistory();
    } catch (error) {
        console.error("Error saving calorie data:", error);
        alert("Gagal menyimpan riwayat: " + error.message);
    }
}

async function fetchHistory() {
  if (!user.value) return;
  historyLoading.value = true;
  try {
    const { data, error } = await supabase
      .from('calorie_history')
      .select('*')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })
      .limit(10);
    if (error) throw error;
    history.value = data;
  } catch (error) {
    console.error("Error fetching calorie history:", error.message);
  } finally {
    historyLoading.value = false;
  }
}
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
