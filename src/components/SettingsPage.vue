<template>
  <div class="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
    <!-- Header Halaman -->
    <header class="mb-8">
      <h1 class="text-3xl lg:text-4xl font-bold text-gray-800">Pengaturan Akun</h1>
      <p class="mt-2 text-gray-600">Kelola informasi profil, keamanan, dan preferensi Anda.</p>
    </header>

    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="loader"></div>
    </div>

    <div v-else class="max-w-2xl mx-auto space-y-8">
      <!-- Kartu Informasi Profil -->
      <div class="bg-white p-6 lg:p-8 rounded-2xl shadow-lg">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Informasi Profil</h2>
        <form @submit.prevent="updateProfile" class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
            <input 
              id="email"
              type="email"
              :value="userEmail"
              disabled
              class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
            />
          </div>
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input
              id="fullName"
              type="text"
              v-model="fullName"
              placeholder="Masukkan nama lengkap Anda"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgba(0,119,137,0.3)] focus:border-[rgba(0,119,137,1)]"
            />
          </div>
          <div class="text-right">
            <button
              type="submit"
              :disabled="loadingProfile"
              class="bg-[rgba(0,119,137,1)] hover:bg-[rgba(0,90,105,1)] text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-wait"
            >
              <span v-if="loadingProfile">Menyimpan...</span>
              <span v-else>Simpan Perubahan</span>
            </button>
          </div>
          <p v-if="profileMessage" class="text-sm mt-2" :class="profileMessageType === 'success' ? 'text-green-600' : 'text-red-600'">
            {{ profileMessage }}
          </p>
        </form>
      </div>

      <!-- Kartu Ubah Password -->
      <div class="bg-white p-6 lg:p-8 rounded-2xl shadow-lg">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Ubah Password</h2>
        <form @submit.prevent="updatePassword" class="space-y-4">
          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
            <input 
              id="newPassword"
              type="password"
              v-model="newPassword"
              placeholder="Minimal 6 karakter"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgba(0,119,137,0.3)] focus:border-[rgba(0,119,137,1)]"
            />
          </div>
           <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
            <input 
              id="confirmPassword"
              type="password"
              v-model="confirmPassword"
              placeholder="Ulangi password baru"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgba(0,119,137,0.3)] focus:border-[rgba(0,119,137,1)]"
            />
          </div>
          <div class="text-right">
            <button
              type="submit"
              :disabled="loadingPassword"
              class="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-wait"
            >
              <span v-if="loadingPassword">Mengubah...</span>
              <span v-else>Ubah Password</span>
            </button>
          </div>
           <p v-if="passwordMessage" class="text-sm mt-2" :class="passwordMessageType === 'success' ? 'text-green-600' : 'text-red-600'">
            {{ passwordMessage }}
          </p>
        </form>
      </div>

      <!-- Kartu Logout -->
      <div class="bg-white p-6 lg:p-8 rounded-2xl shadow-lg">
         <h2 class="text-2xl font-semibold text-gray-800 mb-4">Sesi Akun</h2>
         <p class="text-gray-600 mb-5 text-sm">Keluar dari sesi Anda saat ini di perangkat ini.</p>
         <button
            @click="handleLogout"
            class="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 hover:shadow-md"
          >
           Keluar (Logout)
         </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '@/supabaseClient';
import { useRouter } from 'vue-router';

const router = useRouter();

// State untuk data pengguna
const isLoading = ref(true);
const userEmail = ref('');
const fullName = ref('');

// State untuk form profil
const loadingProfile = ref(false);
const profileMessage = ref('');
const profileMessageType = ref(''); // 'success' atau 'error'

// State untuk form password
const loadingPassword = ref(false);
const newPassword = ref('');
const confirmPassword = ref('');
const passwordMessage = ref('');
const passwordMessageType = ref(''); // 'success' atau 'error'


// Mengambil data pengguna saat komponen dimuat
onMounted(async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      userEmail.value = user.email;
      fullName.value = user.user_metadata?.full_name || '';
    } else {
      // Jika tidak ada user, mungkin redirect ke login
      router.push({ name: 'Login' });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  } finally {
    isLoading.value = false;
  }
});

// Fungsi untuk memperbarui profil (nama lengkap)
async function updateProfile() {
  loadingProfile.value = true;
  profileMessage.value = '';

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not found");

    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName.value }
    });

    if (error) throw error;

    profileMessage.value = 'Profil berhasil diperbarui!';
    profileMessageType.value = 'success';
  } catch (error) {
    profileMessage.value = `Gagal memperbarui profil: ${error.message}`;
    profileMessageType.value = 'error';
    console.error("Error updating profile:", error);
  } finally {
    loadingProfile.value = false;
    setTimeout(() => { profileMessage.value = ''; }, 4000);
  }
}

// Fungsi untuk memperbarui password
async function updatePassword() {
  if (newPassword.value !== confirmPassword.value) {
    passwordMessage.value = 'Password baru dan konfirmasi tidak cocok.';
    passwordMessageType.value = 'error';
    return;
  }
  if (newPassword.value.length < 6) {
    passwordMessage.value = 'Password baru harus minimal 6 karakter.';
    passwordMessageType.value = 'error';
    return;
  }

  loadingPassword.value = true;
  passwordMessage.value = '';

  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword.value
    });

    if (error) throw error;
    
    passwordMessage.value = 'Password berhasil diubah!';
    passwordMessageType.value = 'success';
    newPassword.value = '';
    confirmPassword.value = '';
  } catch (error) {
    passwordMessage.value = `Gagal mengubah password: ${error.message}`;
    passwordMessageType.value = 'error';
    console.error("Error updating password:", error);
  } finally {
    loadingPassword.value = false;
    setTimeout(() => { passwordMessage.value = ''; }, 4000);
  }
}

// Fungsi untuk logout
async function handleLogout() {
  const confirmed = confirm('Anda yakin ingin keluar?');
  if (confirmed) {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // Redirect ke halaman login setelah berhasil logout
      router.push({ name: 'Landing' });
    } catch (error) {
      alert(`Gagal logout: ${error.message}`);
      console.error("Error logging out:", error);
    }
  }
}
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
</style>
