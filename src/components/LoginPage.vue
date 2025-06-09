<template>
  <div class="min-h-screen grid grid-cols-1 lg:grid-cols-2">
    <!-- Kolom Kiri: Branding & Visual -->
    <div
      class="hidden lg:flex flex-col justify-center items-center p-12 bg-cover bg-center relative"
      style="
        background-image: url('/public/ftr.jpg');
      "
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-[rgba(0,119,137,1)] to-[rgba(0,80,95,1)] opacity-90"
      ></div>
      <div class="relative text-white text-center z-10 animate-on-load">
        <h1 class="text-4xl font-bold mb-4">FitFromHome</h1>
        <p class="text-xl max-w-sm">
          Selamat datang kembali! Lanjutkan perjalanan kesehatan Anda bersama
          kami.
        </p>
      </div>
    </div>

    <!-- Kolom Kanan: Form Login -->
    <div
      class="bg-slate-50 flex flex-col justify-center items-center p-6 sm:p-8"
    >
      <div class="max-w-md w-full mx-auto animate-on-load">
        <!-- Logo untuk tampilan mobile -->
        <h1
          class="text-3xl font-bold text-center text-[rgba(0,119,137,1)] mb-8 lg:hidden"
        >
          FitFromHome Login
        </h1>

        <div class="bg-white p-8 rounded-2xl shadow-xl">
          <h2 class="text-2xl font-bold text-gray-800 mb-2 text-center">
            Masuk ke Akun Anda
          </h2>
          <p class="text-center text-sm text-gray-500 mb-8">
            Gunakan detail akun Anda untuk login.
          </p>

          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Social Login -->
            <button
              @click.prevent="loginWithGoogle"
              type="button"
              class="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgba(0,119,137,0.5)]"
            >
              <!-- FIX: SVG code corrected for valid syntax -->
              <svg
                class="w-5 h-5"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,36.218,44,30.561,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              <span class="text-sm font-medium text-gray-700"
                >Lanjutkan dengan Google</span
              >
            </button>

            <div class="flex items-center text-center">
              <hr class="flex-grow border-gray-200" />
              <span class="mx-4 text-xs text-gray-400 font-medium uppercase"
                >Atau</span
              >
              <hr class="flex-grow border-gray-200" />
            </div>

            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 mb-1.5"
                >Alamat Email</label
              >
              <input
                v-model="email"
                id="email"
                type="email"
                required
                autocomplete="email"
                placeholder="contoh@email.com"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgba(0,119,137,0.3)] focus:border-[rgba(0,119,137,1)] transition-all duration-200"
              />
            </div>

            <div>
              <div class="flex justify-between items-center mb-1.5">
                <label
                  for="password"
                  class="block text-sm font-medium text-gray-700"
                  >Password</label
                >
                <a
                  href="#"
                  class="text-xs font-medium text-[rgba(0,119,137,1)] hover:underline"
                  >Lupa Password?</a
                >
              </div>
              <input
                v-model="password"
                id="password"
                type="password"
                required
                autocomplete="current-password"
                placeholder="••••••••"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgba(0,119,137,0.3)] focus:border-[rgba(0,119,137,1)] transition-all duration-200"
              />
            </div>

            <div
              v-if="errorMessage"
              class="bg-red-50 text-red-700 p-3 rounded-lg text-sm text-center transition-all duration-300"
            >
              {{ errorMessage }}
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-[rgba(0,119,137,1)] hover:bg-[rgba(0,90,105,1)] text-white font-semibold py-3.5 rounded-lg text-base transition-all duration-200 hover:shadow-md disabled:opacity-75 disabled:cursor-wait"
            >
              <span v-if="!loading">Login</span>
              <span v-else class="flex items-center justify-center">
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Memproses...
              </span>
            </button>
          </form>
        </div>

        <p class="text-center text-sm text-gray-600 mt-8">
          Belum punya akun?
          <router-link
            to="/register"
            class="font-semibold text-[rgba(0,119,137,1)] hover:underline"
          >
            Daftar di sini
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { supabase } from "../supabaseClient";
import { useRouter, useRoute } from "vue-router"; 

const router = useRouter();
const route = useRoute(); 
const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref(null);

const handleLogin = async () => {
  try {
    loading.value = true;
    errorMessage.value = null;
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (error) throw error;
    
    // --- Logika Redirect Cerdas ---
    // Cek apakah ada query 'redirect' di URL
    const redirectPath = route.query.redirect || "/dashboard"; 
    router.push(redirectPath); // Arahkan ke tujuan atau ke dashboard sebagai default

  } catch (error) {
    errorMessage.value = error.message || "Email atau password salah.";
  } finally {
    loading.value = false;
  }
};

const loginWithGoogle = async () => {
  try {
    // Ambil redirect path dari URL saat ini, atau default ke /dashboard
    const redirectPathAfterLogin = `${window.location.origin}${route.query.redirect || '/dashboard'}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectPathAfterLogin, // Arahkan ke tujuan setelah login Google
      },
    });
    if (error) throw error;
  } catch (error) {
    errorMessage.value = error.message;
  }
};
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
