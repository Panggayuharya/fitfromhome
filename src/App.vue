<template>
  <div id="app">
    <!-- 
      Router-view akan merender komponen yang sesuai dengan rute URL saat ini.
      Misalnya, jika URL adalah '/login', maka komponen LoginPage.vue akan ditampilkan di sini.
    -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
// Tidak ada logika khusus yang diperlukan di sini untuk sekarang.
</script>

<style>
/* Style global dari App.vue lama Anda dipindahkan ke sini
  agar diterapkan ke seluruh aplikasi. 
*/
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

body {
  margin: 0;
  /* Gunakan Poppins sebagai font utama untuk konsistensi */
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  background-color: #f8fafc; /* bg-slate-50 */
}

/* Transisi fade sederhana antar halaman/rute */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
