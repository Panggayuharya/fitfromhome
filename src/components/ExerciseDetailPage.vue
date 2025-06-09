<template>
  <div class="space-y-6 lg:space-y-8">
    <!-- State Loading -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="loader"></div>
    </div>

    <!-- State Error -->
    <div v-else-if="error" class="text-center py-20 bg-white p-10 rounded-2xl shadow-lg">
      <i class="fas fa-exclamation-triangle text-red-500 text-5xl mb-4"></i>
      <h2 class="text-2xl font-semibold text-red-700">Gagal Memuat Latihan</h2>
      <p class="text-gray-600 mt-2">{{ error }}</p>
      <button @click="goBack" class="mt-6 bg-slate-700 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors">Kembali</button>
    </div>
    
    <!-- Konten Utama -->
    <div v-else-if="exercise" class="max-w-4xl mx-auto">
      <!-- Tombol Kembali -->
      <div class="mb-6">
          <button @click="goBack" class="cursor-pointer inline-flex items-center text-sm font-medium text-[rgba(0,119,137,1)] hover:text-[rgba(0,90,105,1)] transition-colors duration-200">
            <i class="fas fa-arrow-left mr-2"></i>
            Kembali ke Semua Latihan
          </button>
      </div>

      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <img :src="exercise.image_url" :alt="exercise.name" class="w-full h-64 lg:h-96 object-cover">
        <div class="p-6 lg:p-8">
          <!-- Header Detail -->
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
            <div>
              <span class="px-3 py-1.5 text-sm font-semibold rounded-full" :class="getCategoryClass(exercise.category)">{{ exercise.category }}</span>
              <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 mt-3">{{ exercise.name }}</h1>
            </div>
            <button @click.stop.prevent="toggleFavorite(exercise)" class="cursor-pointer flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-200 border w-full sm:w-auto" :class="exercise.is_favorited ? 'bg-red-50 text-red-600 border-red-200' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'">
              <i class="fa-heart text-lg" :class="exercise.is_favorited ? 'fas' : 'far'"></i>
              <span class="font-semibold text-sm">{{ exercise.is_favorited ? 'Favorit' : 'Tambahkan ke Favorit' }}</span>
            </button>
          </div>

          <!-- Info Cepat -->
          <div class="flex flex-wrap gap-x-6 gap-y-2 text-gray-600 border-y py-4 mb-6">
            <div class="flex items-center space-x-2">
                <i class="fas fa-tachometer-alt text-gray-500"></i>
                <span>Tingkat: <span class="font-semibold">{{ exercise.difficulty }}</span></span>
            </div>
            <div class="flex items-center space-x-2">
              <i class="far fa-clock text-gray-500"></i>
              <span>Durasi: <span class="font-semibold">{{ exercise.duration_minutes }}</span> menit</span>
            </div>
          </div>
          
          <div class="prose prose-lg max-w-none text-gray-700">
            <h2 class="text-2xl font-semibold text-gray-800 mb-3">Deskripsi</h2>
            <p>{{ exercise.description }}</p>
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

const exercise = ref(null);
const loading = ref(true);
const error = ref(null);
const currentUser = ref(null);

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    currentUser.value = user;
    await fetchExerciseDetail();
  } else {
    loading.value = false;
    error.value = "Anda harus login untuk melihat halaman ini.";
  }
});

async function fetchExerciseDetail() {
  loading.value = true;
  error.value = null;
  try {
    const { data, error: fetchError } = await supabase
      .from('exercises')
      .select('*')
      .eq('id', props.id)
      .single();

    if (fetchError) throw fetchError;

    const { data: favData, error: favError } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', currentUser.value.id)
      .eq('exercise_id', props.id)
      .single();

    if (favError && favError.code !== 'PGRST116') {
      throw favError;
    }

    exercise.value = {
      ...data,
      is_favorited: !!favData,
      favorite_id: favData?.id
    };

  } catch (err) {
    console.error("Error fetching exercise detail:", err.message);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

async function toggleFavorite(exercise) {
  if (!currentUser.value) return;

  const isFavorited = exercise.is_favorited;
  exercise.is_favorited = !isFavorited;

  if (!isFavorited) {
    const { data, error: insertError } = await supabase
      .from('user_favorites')
      .insert({ user_id: currentUser.value.id, exercise_id: exercise.id })
      .select('id')
      .single();
    if (insertError) {
      console.error("Error adding favorite:", insertError.message);
      exercise.is_favorited = false;
    } else {
      exercise.favorite_id = data.id;
    }
  } else {
    const { error: deleteError } = await supabase
      .from('user_favorites')
      .delete()
      .eq('id', exercise.favorite_id);
    if (deleteError) {
      console.error("Error removing favorite:", deleteError.message);
      exercise.is_favorited = true;
    } else {
      exercise.favorite_id = null;
    }
  }
}

const goBack = () => {
  router.push({ name: 'Latihan' });
};

const getCategoryClass = (category) => {
    switch (category) {
        case 'Kekuatan': return 'bg-red-100 text-red-800';
        case 'Kardio': return 'bg-blue-100 text-blue-800';
        case 'Fleksibilitas': return 'bg-green-100 text-green-800';
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
