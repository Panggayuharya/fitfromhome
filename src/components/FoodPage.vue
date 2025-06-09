<template>
  <div class="space-y-6 lg:space-y-8">
    <!-- Header dan Filter (Telah Diperbarui) -->
    <div class="bg-white p-5 lg:p-6 rounded-2xl shadow-lg">
      <h1 class="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Inspirasi Makanan Sehat</h1>
      <p class="text-gray-500 mb-6">Jelajahi beragam resep lezat dan bergizi untuk mendukung gaya hidup sehat Anda.</p>

      <div class="space-y-6">
        <!-- Filter Pencarian dengan Ikon -->
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <i class="fas fa-search text-gray-400"></i>
          </div>
          <input 
            v-model="searchTerm"
            type="text" 
            placeholder="Cari resep..." 
            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgba(0,119,137,0.3)] focus:border-[rgba(0,119,137,1)] transition-colors duration-150"
          />
        </div>

        <!-- Filter Kategori dengan Tombol -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
          <div class="flex flex-wrap gap-2">
            <button
              @click="selectedCategory = ''"
              :class="selectedCategory === '' ? 'bg-[rgba(0,119,137,1)] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
              class="px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[rgba(0,119,137,0.5)]"
            >
              Semua
            </button>
            <button
              v-for="category in categories"
              :key="category"
              @click="selectedCategory = category"
              :class="selectedCategory === category ? 'bg-[rgba(0,119,137,1)] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
              class="px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[rgba(0,119,137,0.5)]"
            >
              {{ category }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- State Loading -->
    <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="loader"></div>
    </div>
    
    <!-- State Error -->
     <div v-else-if="error" class="text-center bg-white p-10 rounded-2xl shadow-lg">
        <i class="fas fa-exclamation-triangle text-red-400 text-5xl mb-4"></i>
        <p class="font-semibold text-lg text-red-700">Gagal Memuat Data</p>
        <p class="text-sm text-gray-500 mt-1">Terjadi kesalahan saat mengambil data resep. Silakan coba lagi nanti.</p>
        <pre class="mt-4 text-xs text-left bg-gray-100 p-2 rounded text-red-800">{{ error }}</pre>
    </div>

    <!-- State Kosong (Tidak ada hasil) -->
    <div v-else-if="filteredRecipes.length === 0" class="text-center bg-white p-10 rounded-2xl shadow-lg">
        <i class="fas fa-utensils text-gray-300 text-5xl mb-4"></i>
        <p class="font-semibold text-lg text-gray-700">Tidak ada resep yang ditemukan</p>
        <p class="text-sm text-gray-500 mt-1">Coba sesuaikan kata kunci pencarian atau filter Anda.</p>
    </div>

    <!-- Daftar Resep -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
      <div v-for="recipe in filteredRecipes" :key="recipe.id" class="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 group relative">
        <!-- Tombol Favorit -->
        <button @click.stop.prevent="toggleFavorite(recipe)" class="absolute top-4 right-4 bg-white/70 backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgba(0,119,137,1)]" :class="recipe.is_favorited ? 'text-red-500' : 'text-gray-500 hover:text-red-500'">
          <i class="fa-heart text-xl" :class="recipe.is_favorited ? 'fas' : 'far'"></i>
        </button>

        <router-link :to="{ name: 'FoodDetail', params: { id: recipe.id } }" class="cursor-pointer block">
          <div class="h-52 overflow-hidden">
            <img :src="recipe.image_url" :alt="recipe.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
          </div>
          <div class="p-5">
            <div class="flex justify-between items-center mb-2">
              <span class="px-2.5 py-1 text-xs font-semibold rounded-full" :class="getCategoryClass(recipe.category)">{{ recipe.category }}</span>
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-2 truncate group-hover:text-[rgba(0,119,137,1)] transition-colors">{{ recipe.name }}</h3>
            <p class="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">{{ recipe.description }}</p>
            <div class="flex justify-between items-center border-t pt-4">
              <div class="flex items-center text-sm text-gray-700">
                  <i class="far fa-clock mr-2 text-[rgba(0,119,137,1)]"></i>
                  <span>{{ recipe.prep_time_minutes }} menit</span>
              </div>
              <span class="text-sm font-semibold text-[rgba(0,119,137,1)] group-hover:text-[rgba(0,90,105,1)] transition-colors duration-200">
                Lihat Detail <span class="opacity-0 group-hover:opacity-100 group-hover:ml-1 transition-all">&rarr;</span>
              </span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { supabase } from '../supabaseClient';
import { useRouter } from 'vue-router';

const router = useRouter();

// --- State Reaktif ---
const recipes = ref([]);
const favoriteIds = ref(new Set());
const loading = ref(true);
const error = ref(null);
const searchTerm = ref('');
const selectedCategory = ref('');
const currentUser = ref(null);

// --- Daftar Opsi untuk Filter Tombol ---
const categories = ref(['Sarapan', 'Makan Siang', 'Makan Malam', 'Camilan']);

// --- Fetch Data ---
onMounted(async () => {
  loading.value = true;
  error.value = null;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      currentUser.value = user;
      await fetchFavorites();
    }
    await fetchRecipes();
  } catch (err) {
    console.error("Initialization error:", err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});

async function fetchRecipes() {
  try {
    const { data, error: fetchError } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (fetchError) throw fetchError;

    recipes.value = data.map(rec => ({
      ...rec,
      is_favorited: favoriteIds.value.has(rec.id)
    }));

  } catch (err) {
    console.error("Error fetching recipes:", err.message);
    error.value = "Gagal memuat resep: " + err.message;
  }
}

async function fetchFavorites() {
    if (!currentUser.value) return;
    try {
        const { data, error: fetchError } = await supabase
            .from('user_favorites')
            .select('recipe_id')
            .eq('user_id', currentUser.value.id)
            .not('recipe_id', 'is', null);

        if (fetchError) throw fetchError;
        favoriteIds.value = new Set(data.map(fav => fav.recipe_id));
    } catch (err) {
        console.error("Error fetching favorites:", err.message);
        error.value = "Gagal memuat data favorit: " + err.message;
    }
}

// --- Computed Properties & Helpers ---
const filteredRecipes = computed(() => {
  return recipes.value.filter(recipe => {
    const searchMatch = recipe.name.toLowerCase().includes(searchTerm.value.toLowerCase());
    const categoryMatch = selectedCategory.value ? recipe.category === selectedCategory.value : true;
    return searchMatch && categoryMatch;
  });
});

const getCategoryClass = (category) => {
    switch (category) {
        case 'Sarapan': return 'bg-yellow-100 text-yellow-800';
        case 'Makan Siang': return 'bg-green-100 text-green-800';
        case 'Makan Malam': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

// --- Logika Favorit ---
async function toggleFavorite(recipe) {
    if (!currentUser.value) {
        router.push('/login');
        return;
    }

    recipe.is_favorited = !recipe.is_favorited;

    if (recipe.is_favorited) {
        favoriteIds.value.add(recipe.id);
        const { error: insertError } = await supabase
            .from('user_favorites')
            .insert({ user_id: currentUser.value.id, recipe_id: recipe.id });
        if (insertError) {
            console.error("Error adding favorite:", insertError.message);
            alert("Gagal menambahkan favorit.");
            recipe.is_favorited = false; 
            favoriteIds.value.delete(recipe.id);
        }
    } else {
        favoriteIds.value.delete(recipe.id);
        const { error: deleteError } = await supabase
            .from('user_favorites')
            .delete()
            .match({ user_id: currentUser.value.id, recipe_id: recipe.id });
        if (deleteError) {
            console.error("Error removing favorite:", deleteError.message);
            alert("Gagal menghapus favorit.");
            recipe.is_favorited = true; 
            favoriteIds.value.add(recipe.id);
        }
    }
}
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

.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
}
</style>
