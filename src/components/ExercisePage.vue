<template>
  <div class="space-y-6 lg:space-y-8">
    <!-- Header Halaman -->
    <div>
      <h1 class="text-3xl lg:text-4xl font-bold text-gray-800">Program Latihan Mingguan</h1>
      <p class="mt-2 text-gray-600">Pilih hari untuk melihat program latihan yang telah disiapkan untuk Anda.</p>
    </div>

    <!-- Pemilih Hari (Day Selector) yang Baru -->
    <div class="relative">
      <div class="flex space-x-2 overflow-x-auto pb-3 -mb-3 scrollbar-hide">
        <button
          v-for="day in days"
          :key="day.number"
          @click="selectDay(day.number)"
          class="px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgba(0,119,137,0.5)] whitespace-nowrap"
          :class="day.number === selectedDay ? 'bg-[rgba(0,119,137,1)] text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 shadow-sm'"
        >
          {{ day.name }}
        </button>
      </div>
    </div>

    <!-- State Loading -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="loader"></div>
    </div>
    
    <!-- State Error -->
    <div v-else-if="error" class="text-center py-20 bg-white p-10 rounded-2xl shadow-lg">
      <i class="fas fa-exclamation-triangle text-red-400 text-5xl mb-4"></i>
      <p class="font-semibold text-lg text-red-700">Gagal Memuat Latihan</p>
      <p class="text-sm text-gray-500 mt-1">{{ error }}</p>
    </div>

    <!-- Layout Utama dengan 2 Kolom -->
    <div v-else-if="currentPlan" class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <!-- Kolom Kiri: Detail Rencana (Sticky di Desktop) -->
      <div class="lg:col-span-1 lg:sticky lg:top-24">
        <div class="bg-white p-6 rounded-2xl shadow-lg">
            <h2 class="text-2xl font-bold text-gray-800">{{ currentPlan.name }}</h2>
            <p class="mt-2 text-slate-600 leading-relaxed">{{ currentPlan.description }}</p>
            <div class="mt-6 pt-4 border-t border-slate-200 space-y-3 text-sm">
                <div class="flex justify-between items-center text-slate-700">
                    <span class="font-medium">Total Latihan:</span>
                    <span class="font-bold text-[rgba(0,119,137,1)]">{{ currentPlan.workout_plan_items.length }} Jenis</span>
                </div>
                <div class="flex justify-between items-center text-slate-700">
                    <span class="font-medium">Fokus Hari Ini:</span>
                    <span class="font-bold px-2 py-1 bg-cyan-100 text-cyan-800 rounded">{{ getFocusOfTheDay() }}</span>
                </div>
            </div>
        </div>
      </div>

      <!-- Kolom Kanan: Daftar Latihan -->
      <div class="lg:col-span-2 space-y-4">
        <!-- Mengubah <div> menjadi <router-link> -->
        <router-link 
          v-for="(item, index) in currentPlan.workout_plan_items" 
          :key="item.id"
          :to="{ name: 'ExerciseDetail', params: { id: item.exercises.id } }"
          class="bg-white rounded-2xl shadow-lg flex items-start gap-5 p-5 border-l-4 border-transparent hover:border-[rgba(0,119,137,1)] hover:shadow-xl transition-all duration-200"
        >
          <!-- Gambar -->
          <img :src="item.exercises.image_url" :alt="item.exercises.name" class="w-24 h-24 md:w-28 md:h-28 object-cover rounded-lg">

          <!-- Detail & Target -->
          <div class="flex-grow flex flex-col sm:flex-row justify-between gap-4">
              <div>
                  <span class="text-xs font-semibold text-gray-500">{{ item.exercises.difficulty }}</span>
                  <h3 class="font-bold text-lg text-gray-800 leading-tight">{{ item.exercises.name }}</h3>
                  <p class="text-sm text-gray-500 mt-1 hidden sm:block">{{ item.exercises.category }}</p>
              </div>
              <div class="bg-slate-100 p-3 rounded-lg text-center flex-shrink-0">
                <div class="font-bold text-lg text-[rgba(0,119,137,1)]">{{ item.sets }}</div>
                <div class="font-semibold text-sm text-slate-600">{{ item.reps }}</div>
              </div>
          </div>
        </router-link>
      </div>
    </div>
    
    <!-- State Kosong (Hari Istirahat) -->
    <div v-else class="text-center py-20 bg-white p-10 rounded-2xl shadow-lg">
        <i class="fas fa-bed text-gray-300 text-6xl mb-4"></i>
        <p class="font-semibold text-xl text-gray-700">Hari Istirahat!</p>
        <p class="text-gray-500 mt-2">Tidak ada program latihan yang dijadwalkan untuk hari ini. Nikmati waktu istirahat Anda.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { supabase } from '../supabaseClient';

const currentPlan = ref(null);
const loading = ref(true);
const error = ref(null);
const selectedDay = ref(null);

const days = ref([
    { name: 'Senin', number: 1 },
    { name: 'Selasa', number: 2 },
    { name: 'Rabu', number: 3 },
    { name: 'Kamis', number: 4 },
    { name: 'Jumat', number: 5 },
    { name: 'Sabtu', number: 6 },
    { name: 'Minggu', number: 7 },
]);

onMounted(() => {
  const d = new Date();
  let dayOfWeek = d.getDay();
  if (dayOfWeek === 0) {
    dayOfWeek = 7;
  }
  selectDay(dayOfWeek);
});

function selectDay(dayNumber) {
    selectedDay.value = dayNumber;
    fetchWorkoutPlan(dayNumber);
}

async function fetchWorkoutPlan(dayOfWeek) {
  loading.value = true;
  error.value = null;
  currentPlan.value = null;
  try {
    const { data, error: fetchError } = await supabase
      .from('workout_plans')
      .select(`
        *,
        workout_plan_items (
          *,
          exercises (*)
        )
      `)
      .eq('day_of_week', dayOfWeek)
      .order('order', { referencedTable: 'workout_plan_items', ascending: true })
      .single();

    if (fetchError) {
      if (fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
    }
    currentPlan.value = data;

  } catch (err) {
    console.error("Error fetching workout plan:", err.message);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

// Fungsi helper untuk menentukan fokus latihan hari itu secara dinamis
const getFocusOfTheDay = () => {
    if (!currentPlan.value || !currentPlan.value.workout_plan_items) return 'Campuran';
    const categories = currentPlan.value.workout_plan_items.map(item => item.exercises.category);
    const categoryCounts = categories.reduce((acc, curr) => (acc[curr] = (acc[curr] || 0) + 1, acc), {});
    // Mengembalikan kategori yang paling sering muncul
    return Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b, 'Campuran');
};
</script>

<style scoped>
.loader {
  border: 6px solid #f3f3f3;
  border-top: 6px solid rgba(0,119,137,1);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

/* Helper untuk menyembunyikan scrollbar pada day selector */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
