<template>
  <div class="min-h-screen grid grid-cols-1 lg:grid-cols-2">
    <!-- Kolom Kiri: Branding & Visual -->
    <div class="hidden lg:flex flex-col justify-center items-center p-12 bg-cover bg-center relative" style="background-image: url('https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z3ltfGVufDB8fDB8fHww');">
      <div class="absolute inset-0 bg-gradient-to-br from-[rgba(0,119,137,1)] to-[rgba(0,80,95,1)] opacity-90"></div>
      <div class="relative text-white text-center z-10 animate-on-load">
        <h1 class="text-4xl font-bold mb-4">Mulai Perjalanan Anda</h1>
        <p class="text-xl max-w-sm">Buat akun untuk mendapatkan akses penuh ke semua fitur HealthHub.</p>
      </div>
    </div>

    <!-- Kolom Kanan: Form Register -->
    <div class="bg-slate-50 flex flex-col justify-center items-center p-6 sm:p-8">
      <div class="max-w-md w-full mx-auto animate-on-load">
        <!-- Logo untuk tampilan mobile -->
        <h1 class="text-3xl font-bold text-center text-[rgba(0,119,137,1)] mb-8 lg:hidden">
          Daftar HealthHub
        </h1>

        <div class="bg-white p-8 rounded-2xl shadow-xl">
          <h2 class="text-2xl font-bold text-gray-800 mb-2 text-center">Buat Akun Baru</h2>
          <p class="text-center text-sm text-gray-500 mb-8">Hanya butuh beberapa detik untuk memulai.</p>
          
          <form @submit.prevent="handleRegister" class="space-y-5">
            <div>
              <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
              <input v-model="fullName" id="fullName" type="text" required autocomplete="name" placeholder="Nama Lengkap Anda" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgba(0,119,137,0.3)] focus:border-[rgba(0,119,137,1)] transition-all duration-200">
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1.5">Alamat Email</label>
              <input v-model="email" id="email" type="email" required autocomplete="email" placeholder="contoh@email.com" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgba(0,119,137,0.3)] focus:border-[rgba(0,119,137,1)] transition-all duration-200">
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1.5">Buat Password</label>
              <input v-model="password" id="password" type="password" required autocomplete="new-password" placeholder="Minimal 6 karakter" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgba(0,119,137,0.3)] focus:border-[rgba(0,119,137,1)] transition-all duration-200">
            </div>

            <div v-if="errorMessage" class="bg-red-50 text-red-700 p-3 rounded-lg text-sm text-center transition-all duration-300">
              {{ errorMessage }}
            </div>
            
            <div v-if="successMessage" class="bg-green-50 text-green-700 p-3 rounded-lg text-sm text-center transition-all duration-300">
              {{ successMessage }}
            </div>

            <button type="submit" :disabled="loading" class="w-full bg-[rgba(0,119,137,1)] hover:bg-[rgba(0,90,105,1)] text-white font-semibold py-3.5 rounded-lg text-base transition-all duration-200 hover:shadow-md disabled:opacity-75 disabled:cursor-wait">
              <span v-if="!loading">Buat Akun</span>
              <span v-else class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
              </span>
            </button>
          </form>

          <p class="text-center text-sm text-gray-600 mt-8">
            Sudah punya akun?
            <router-link to="/login" class="font-semibold text-[rgba(0,119,137,1)] hover:underline">
              Login di sini
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../supabaseClient'

const fullName = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref(null)
const successMessage = ref(null)

const handleRegister = async () => {
  try {
    loading.value = true
    errorMessage.value = null
    successMessage.value = null

    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          full_name: fullName.value,
        }
      }
    })

    if (error) throw error
    
    successMessage.value = 'Registrasi berhasil! Silakan cek email Anda untuk verifikasi.'
    
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Animasi sederhana untuk memuat halaman */
.animate-on-load {
    animation: fade-in-up 0.8s ease-out forwards;
    opacity: 0;
}

@keyframes fade-in-up {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
