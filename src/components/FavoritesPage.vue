<template>
  <div class="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
    <!-- Header Halaman -->
    <header class="mb-8">
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">Item Favorit Anda</h1>
      <p class="mt-2 text-gray-600">Semua latihan dan resep yang Anda sukai ada di sini.</p>
    </header>

    <!-- State Loading -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="loader"></div>
    </div>

    <!-- State Error -->
    <div v-else-if="error" class="text-center py-20 bg-white p-6 sm:p-10 rounded-2xl shadow-lg">
      <i class="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
      <p class="text-xl font-semibold text-red-700">Oops! Terjadi Kesalahan</p>
      <p class="text-gray-600 mt-2">Tidak dapat memuat item favorit Anda saat ini. Silakan coba lagi nanti.</p>
      <pre class="mt-3 text-xs text-left bg-gray-100 p-2 rounded overflow-auto max-w-md mx-auto">{{ error }}</pre>
    </div>

    <!-- State Kosong (Belum ada favorit) -->
    <div v-else-if="favoriteItems.length === 0" class="text-center py-20 bg-white p-6 sm:p-10 rounded-2xl shadow-lg">
      <i class="far fa-heart text-gray-300 text-6xl mb-6"></i>
      <p class="text-xl font-semibold text-gray-700">Anda Belum Memiliki Favorit</p>
      <p class="text-gray-500 mt-2">Mulai jelajahi latihan dan resep, lalu tandai sebagai favorit!</p>
      <div class="mt-6 flex flex-col sm:flex-row justify-center items-center gap-3">
        <router-link :to="{ name: 'Latihan' }" class="w-full sm:w-auto bg-[rgba(0,119,137,1)] hover:bg-[rgba(0,90,105,1)] text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors duration-200">
          Lihat Latihan
        </router-link>
        <router-link :to="{ name: 'Makanan' }" class="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors duration-200">
          Lihat Resep
        </router-link>
      </div>
    </div>

    <!-- Tampilan Daftar Favorit -->
    <div v-else class="space-y-8">
      <!-- Section Latihan Favorit -->
      <div v-if="favoriteExercises.length > 0">
        <h2 class="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">Latihan Favorit</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          <div v-for="item in favoriteExercises" :key="`ex-${item.id}`" class="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl group relative">
            <router-link :to="{ name: 'ExerciseDetail', params: { id: item.id } }" class="h-full flex flex-col cursor-pointer">
              <div class="overflow-hidden h-48 sm:h-52">
                <img :src="item.image_url || 'https://placehold.co/400x250/e2e8f0/94a3b8?text=HealthHub'" :alt="item.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
              </div>
              <div class="p-4 sm:p-5 flex flex-col flex-grow">
                <div class="flex-grow">
                  <span class="text-xs font-medium bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full mb-2 inline-block">{{ item.category }}</span>
                  <h3 class="text-lg font-semibold text-gray-800 group-hover:text-[rgba(0,119,137,1)] transition-colors duration-200 line-clamp-2">{{ item.name }}</h3>
                </div>
                <div class="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
                  <span><i class="far fa-clock mr-1"></i> {{ item.duration_minutes }} min</span>
                  <span>{{ item.difficulty }}</span>
                </div>
              </div>
            </router-link>
            <button @click="removeFavorite(item.favorite_id)" class="absolute top-3 right-3 bg-white/80 hover:bg-red-500 text-red-500 hover:text-white w-10 h-10 rounded-full shadow-md transition-all duration-200 z-10 flex items-center justify-center" title="Hapus dari Favorit">
              <i class="fas fa-trash-alt text-base"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Section Resep Favorit -->
      <div v-if="favoriteRecipes.length > 0">
        <h2 class="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">Resep Favorit</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
           <div v-for="item in favoriteRecipes" :key="`rec-${item.id}`" class="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl group relative">
            <router-link :to="{ name: 'FoodDetail', params: { id: item.id } }" class="h-full flex flex-col cursor-pointer">
              <div class="overflow-hidden h-48 sm:h-52">
                <img :src="item.image_url || 'https://placehold.co/400x250/e2e8f0/94a3b8?text=HealthHub'" :alt="item.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
              </div>
              <div class="p-4 sm:p-5 flex flex-col flex-grow">
                <div class="flex-grow">
                  <span class="text-xs font-medium bg-green-100 text-green-700 px-2.5 py-1 rounded-full mb-2 inline-block">{{ item.category }}</span>
                  <h3 class="text-lg font-semibold text-gray-800 group-hover:text-[rgba(0,119,137,1)] transition-colors duration-200 line-clamp-2">{{ item.name }}</h3>
                </div>
                 <div class="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
                  <span><i class="far fa-clock mr-1"></i> {{ item.prep_time_minutes || 'N/A' }} min</span>
                  <span><i class="fas fa-fire-alt mr-1"></i> {{ item.calories || 'N/A' }} kkal</span>
                </div>
              </div>
            </router-link>
             <button @click="removeFavorite(item.favorite_id)" class="absolute top-3 right-3 bg-white/80 hover:bg-red-500 text-red-500 hover:text-white w-10 h-10 rounded-full shadow-md transition-all duration-200 z-10 flex items-center justify-center" title="Hapus dari Favorit">
              <i class="fas fa-trash-alt text-base"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { supabase } from '../supabaseClient'; // Menggunakan path yang benar
import { useRouter } from 'vue-router';

const router = useRouter();
// State utama untuk semua item favorit gabungan
const favoriteItems = ref([]);
const isLoading = ref(true);
const error = ref(null);
const currentUser = ref(null);

// Fungsi untuk mengambil data pengguna yang sedang login
async function fetchCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  currentUser.value = user;
}

// Fungsi utama untuk mengambil semua data favorit
async function fetchFavorites() {
  if (!currentUser.value) {
    isLoading.value = false;
    error.value = "Pengguna tidak terautentikasi.";
    return;
  }

  isLoading.value = true;
  error.value = null;
  try {
    const { data: favoriteEntries, error: favError } = await supabase
      .from('user_favorites')
      .select('id, exercise_id, recipe_id')
      .eq('user_id', currentUser.value.id);

    if (favError) throw favError;

    const exerciseIds = favoriteEntries.filter(f => f.exercise_id).map(f => f.exercise_id);
    const recipeIds = favoriteEntries.filter(f => f.recipe_id).map(f => f.recipe_id);

    const combinedFavorites = [];

    if (exerciseIds.length > 0) {
      const { data: exercises, error: exError } = await supabase
        .from('exercises')
        .select('*')
        .in('id', exerciseIds);
      if (exError) throw exError;
      
      exercises.forEach(ex => {
        const favEntry = favoriteEntries.find(f => f.exercise_id === ex.id);
        combinedFavorites.push({ ...ex, type: 'exercise', favorite_id: favEntry?.id });
      });
    }

    if (recipeIds.length > 0) {
      const { data: recipes, error: recError } = await supabase
        .from('recipes')
        .select('*')
        .in('id', recipeIds);
      if (recError) throw recError;

      recipes.forEach(rec => {
        const favEntry = favoriteEntries.find(f => f.recipe_id === rec.id);
        combinedFavorites.push({ ...rec, type: 'recipe', favorite_id: favEntry?.id });
      });
    }
    
    favoriteItems.value = combinedFavorites;

  } catch (err) {
    console.error('Error fetching favorites:', err);
    error.value = err.message || 'Terjadi kesalahan saat memuat favorit.';
  } finally {
    isLoading.value = false;
  }
}

// Computed property untuk memfilter latihan favorit dari state utama
const favoriteExercises = computed(() => {
  return favoriteItems.value.filter(item => item.type === 'exercise');
});

// Computed property untuk memfilter resep favorit dari state utama
const favoriteRecipes = computed(() => {
  return favoriteItems.value.filter(item => item.type === 'recipe');
});

// Fungsi untuk menghapus item dari favorit
async function removeFavorite(favoriteEntryId) {
  if (!favoriteEntryId) {
    console.error('Favorite entry ID is missing');
    alert('Gagal menghapus favorit: ID tidak ditemukan.');
    return;
  }

  const confirmed = confirm(`Anda yakin ingin menghapus item ini dari daftar favorit?`);
  if (!confirmed) return;

  try {
    const { error: deleteError } = await supabase
      .from('user_favorites')
      .delete()
      .eq('id', favoriteEntryId);

    if (deleteError) throw deleteError;

    favoriteItems.value = favoriteItems.value.filter(item => item.favorite_id !== favoriteEntryId);
    alert('Item berhasil dihapus dari favorit!');

  } catch (err) {
    console.error('Error removing favorite:', err);
    alert(`Gagal menghapus favorit: ${err.message}`);
  }
}

// Hook onMounted untuk menjalankan fetch data saat komponen dimuat
onMounted(async () => {
  await fetchCurrentUser();
  if (currentUser.value) {
    await fetchFavorites();
  } else {
    error.value = "Sesi pengguna tidak ditemukan, silakan login kembali.";
    isLoading.value = false;
  }
});
</script>

<style scoped>
.loader {
  border: 6px solid #f3f3f3; /* Abu-abu terang */
  border-top: 6px solid rgba(0,119,137,1); /* Warna aksen */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Helper class untuk membatasi jumlah baris teks */
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}
</style>
