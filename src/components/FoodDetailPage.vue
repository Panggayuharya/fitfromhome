<template>
  <div class="space-y-6 lg:space-y-8">
    <!-- State Loading -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="loader"></div>
    </div>

    <!-- State Error -->
    <div v-else-if="error" class="text-center py-20 bg-white p-10 rounded-2xl shadow-lg">
      <i class="fas fa-exclamation-triangle text-red-500 text-5xl mb-4"></i>
      <h2 class="text-2xl font-semibold text-red-700">Gagal Memuat Resep</h2>
      <p class="text-gray-600 mt-2">{{ error }}</p>
      <button @click="goBack" class="mt-6 bg-slate-700 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors">Kembali</button>
    </div>
    
    <!-- Konten Utama -->
    <div v-else-if="recipe" class="max-w-4xl mx-auto">
      <!-- Tombol Kembali -->
      <div class="mb-6">
          <button @click="goBack" class="cursor-pointer inline-flex items-center text-sm font-medium text-[rgba(0,119,137,1)] hover:text-[rgba(0,90,105,1)] transition-colors duration-200">
            <i class="fas fa-arrow-left mr-2"></i>
            Kembali ke Semua Resep
          </button>
      </div>

      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <img :src="recipe.image_url" :alt="recipe.name" class="w-full h-64 lg:h-96 object-cover">
        <div class="p-6 lg:p-8">
          <!-- Header Detail -->
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
            <div>
              <span class="px-3 py-1.5 text-sm font-semibold rounded-full" :class="getCategoryClass(recipe.category)">{{ recipe.category }}</span>
              <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 mt-3">{{ recipe.name }}</h1>
            </div>
            <button @click.stop.prevent="toggleFavorite(recipe)" class="cursor-pointer flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-200 border w-full sm:w-auto" :class="recipe.is_favorited ? 'bg-red-50 text-red-600 border-red-200' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'">
              <i class="fa-heart text-lg" :class="recipe.is_favorited ? 'fas' : 'far'"></i>
              <span class="font-semibold text-sm">{{ recipe.is_favorited ? 'Favorit' : 'Tambahkan ke Favorit' }}</span>
            </button>
          </div>

          <!-- Info Cepat -->
          <div class="flex flex-wrap gap-x-6 gap-y-2 text-gray-600 border-y py-4 mb-6">
            <div v-if="recipe.prep_time_minutes" class="flex items-center space-x-2">
              <i class="far fa-clock text-gray-500"></i>
              <span><span class="font-semibold">{{ recipe.prep_time_minutes }}</span> menit persiapan</span>
            </div>
            <div v-if="recipe.calories" class="flex items-center space-x-2">
              <i class="fas fa-fire-alt text-gray-500"></i>
              <span><span class="font-semibold">{{ recipe.calories }}</span> kkal</span>
            </div>
          </div>
          
          <p class="text-gray-700 leading-relaxed mb-8">{{ recipe.description }}</p>

          <!-- Bahan dan Instruksi -->
          <div class="grid md:grid-cols-12 gap-8 lg:gap-10">
            <div class="md:col-span-4">
              <h2 class="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Bahan-bahan</h2>
              <ul v-if="recipe.ingredients && recipe.ingredients.length" class="list-disc list-inside space-y-2 text-gray-700 pl-1">
                <li v-for="(ingredient, index) in recipe.ingredients" :key="index">{{ ingredient }}</li>
              </ul>
            </div>
            <div class="md:col-span-8">
              <h2 class="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Cara Membuat</h2>
              <ol v-if="recipe.instructions && recipe.instructions.length" class="list-decimal list-inside space-y-4 text-gray-700 pl-1">
                <li v-for="(step, index) in recipe.instructions" :key="index" class="pl-2">{{ step }}</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue';
import { supabase } from '../supabaseClient';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
});

const recipe = ref(null);
const loading = ref(true);
const error = ref(null);
const currentUser = ref(null);

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    currentUser.value = user;
    await fetchRecipeDetail();
  } else {
    loading.value = false;
    error.value = "Anda harus login untuk melihat halaman ini.";
  }
});

async function fetchRecipeDetail() {
  loading.value = true;
  error.value = null;
  try {
    // Ambil detail resep
    const { data, error: fetchError } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', props.id)
      .single();

    if (fetchError) throw fetchError;

    // Cek status favorit
    const { data: favData, error: favError } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', currentUser.value.id)
      .eq('recipe_id', props.id)
      .single();

    if (favError && favError.code !== 'PGRST116') { // Abaikan error 'not found'
      throw favError;
    }

    recipe.value = {
      ...data,
      is_favorited: !!favData, // true jika favData ditemukan
      favorite_id: favData?.id // simpan ID favorit jika ada
    };

  } catch (err) {
    console.error("Error fetching recipe detail:", err.message);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

async function toggleFavorite(recipe) {
  if (!currentUser.value) return;

  const isFavorited = recipe.is_favorited;
  
  // Optimistic UI update
  recipe.is_favorited = !isFavorited;

  if (!isFavorited) {
    // Tambah ke favorit
    const { data, error: insertError } = await supabase
      .from('user_favorites')
      .insert({ 
        user_id: currentUser.value.id, 
        recipe_id: recipe.id 
      })
      .select('id')
      .single();

    if (insertError) {
      console.error("Error adding favorite:", insertError.message);
      recipe.is_favorited = false; // Kembalikan jika error
    } else {
      recipe.favorite_id = data.id; // Simpan ID favorit yang baru
    }
  } else {
    // Hapus dari favorit
    const { error: deleteError } = await supabase
      .from('user_favorites')
      .delete()
      .eq('id', recipe.favorite_id);

    if (deleteError) {
      console.error("Error removing favorite:", deleteError.message);
      recipe.is_favorited = true; // Kembalikan jika error
    } else {
      recipe.favorite_id = null;
    }
  }
}

const goBack = () => {
  router.push({ name: 'Makanan' });
};

const getCategoryClass = (category) => {
    switch (category) {
        case 'Sarapan': return 'bg-yellow-100 text-yellow-800';
        case 'Makan Siang': return 'bg-green-100 text-green-800';
        case 'Makan Malam': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
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
</style>
