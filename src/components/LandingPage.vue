<template>
  <div
    class="landing-page font-sans antialiased text-gray-700 bg-white selection:bg-[rgba(0,119,137,0.2)] selection:text-[rgba(0,119,137,1)]"
  >
    <!-- 1. Navigation Bar (Hanya untuk bar atas) -->
    <nav
      class="fixed top-0 left-0 w-full py-4 lg:py-5 z-30 transition-all duration-300 ease-in-out" 
      :class="{
        'bg-white/95 backdrop-blur-lg shadow-md': isScrolled,
        'bg-transparent': !isScrolled,
      }"
    >
      <div class="container mx-auto px-5 lg:px-8 flex justify-between items-center">
        <a
          href="#"
          @click.prevent="handleNavigation('/')"
          class="text-2xl lg:text-3xl font-bold transition-colors duration-300"
          :class="isScrolled ? 'text-[rgba(0,119,137,1)]' : 'text-white'"
          >FitFromHome</a
        >
        <!-- Menu Desktop -->
        <ul class="hidden lg:flex space-x-7 lg:space-x-10 items-center">
          <li>
            <a
              href="#"
              @click.prevent="handleNavigation('/dashboard')"
              class="text-base font-medium hover:text-[rgba(0,119,137,1)] transition-colors duration-200"
              :class="isScrolled ? 'text-gray-600' : 'text-gray-100'"
              >Fitur</a
            >
          </li>
          <li>
            <a
              href="#"
              @click.prevent="handleNavigation('/dashboard/makanan')"
              class="text-base font-medium hover:text-[rgba(0,119,137,1)] transition-colors duration-200"
              :class="isScrolled ? 'text-gray-600' : 'text-gray-100'"
              >Inspirasi</a
            >
          </li>
          <li>
            <a
              href="#"
              @click.prevent="handleNavigation('/dashboard/latihan')"
              class="text-base font-medium hover:text-[rgba(0,119,137,1)] transition-colors duration-200"
              :class="isScrolled ? 'text-gray-600' : 'text-gray-100'"
              >Latihan</a
            >
          </li>
          <li>
            <button
              @click="handleNavigation('/dashboard/bmi')"
              class="bg-[rgba(0,119,137,1)] hover:bg-[rgba(0,90,105,1)] text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[rgba(0,119,137,0.5)] focus:ring-offset-2"
            >
              Mulai Gratis
            </button>
          </li>
        </ul>
        <!-- Tombol Hamburger Mobile -->
        <button
          @click="toggleMobileNav"
          class="lg:hidden text-3xl p-1 -mr-1 rounded-md focus:outline-none focus:ring-2 focus:ring-inset"
          :class="
            isScrolled
              ? 'text-[rgba(0,119,137,1)] focus:ring-[rgba(0,119,137,0.5)]'
              : 'text-white focus:ring-white/70'
          "
        >
          <span v-if="!isMobileNavOpen" class="block h-7 w-7"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              /></svg
          ></span>
          <span v-else class="block h-7 w-7"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              /></svg
          ></span>
        </button>
      </div>
    </nav>

    <!-- Mobile Sidebar & Overlay (Dipindahkan keluar dari <nav> utama) -->
    <transition
      enter-active-class="transition-opacity ease-linear duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity ease-linear duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-show="isMobileNavOpen" class="fixed inset-0 bg-black/50 z-40 lg:hidden" @click="isMobileNavOpen = false"></div>
    </transition>
    
    <transition
      enter-active-class="transition ease-in-out duration-300 transform"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition ease-in-out duration-300 transform"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <aside v-show="isMobileNavOpen" class="fixed top-0 left-0 h-full w-64 bg-slate-800 text-gray-100 shadow-xl z-50 flex flex-col p-6 lg:hidden">
        <!-- Header Sidebar Mobile -->
        <div class="flex justify-between items-center mb-8">
          <span class="text-xl font-bold text-white">Menu</span>
          <button @click="isMobileNavOpen = false" class="text-gray-300 hover:text-white text-2xl">&times;</button>
        </div>
        
        <!-- Menu Link Mobile -->
        <ul class="flex flex-col space-y-3">
          <li>
            <a
              href="#"
              @click.prevent="handleMobileNav('/dashboard')"
              class="block py-2.5 px-3 rounded-md hover:bg-slate-700 transition-colors duration-200 font-medium"
              >Fitur</a
            >
          </li>
          <li>
            <a
              href="#"
              @click.prevent="handleMobileNav('/dashboard/makanan')"
              class="block py-2.5 px-3 rounded-md hover:bg-slate-700 transition-colors duration-200 font-medium"
              >Inspirasi</a
            >
          </li>
          <li>
            <a
              href="#"
              @click.prevent="handleMobileNav('/dashboard/latihan')"
              class="block py-2.5 px-3 rounded-md hover:bg-slate-700 transition-colors duration-200 font-medium"
              >Latihan</a
            >
          </li>
          <li class="pt-4">
            <button
              @click="handleMobileNav('/dashboard/bmi')"
              class="w-full bg-[rgba(0,119,137,1)] hover:bg-[rgba(0,90,105,1)] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-md text-sm"
            >
              Mulai Gratis
            </button>
          </li>
        </ul>
      </aside>
    </transition>

    <!-- 2. Hero Section -->
    <header
      id="hero-section"
      class="min-h-screen h-[calc(100vh-80px)] lg:h-screen bg-cover bg-center relative flex items-center justify-center text-white text-center"
      style="
        background-image: url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGZpdG5lc3N8ZW58MHx8MHx8fDA%3D');
      "
    >
      <div
        class="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70"
      ></div>
      <div
        class="relative z-10 p-6 max-w-3xl lg:max-w-4xl animate-on-scroll"
        data-animation="fade-in-up"
        data-delay="100"
      >
        <h1
          class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 lg:mb-8 !leading-tight"
          style="text-shadow: 0 3px 6px rgba(0, 0, 0, 0.4)"
        >
          Hidup Sehat,
          <span class="text-[rgba(127,220,214,1)]">Mulai Dari Sini.</span>
        </h1>
        <p
          class="text-lg sm:text-xl lg:text-2xl mb-10 lg:mb-12 opacity-95 max-w-2xl mx-auto"
        >
          Temukan alat, inspirasi, dan dukungan yang Anda butuhkan untuk
          mencapai tujuan kesehatan Anda bersama FitFromHome.
        </p>
        <button
          @click="handleNavigation('/dashboard')"
          class="bg-[rgba(0,119,137,1)] hover:bg-[rgba(0,90,105,1)] cursor-pointer text-white font-semibold py-3.5 px-10 lg:py-4 lg:px-12 rounded-full text-lg lg:text-xl transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[rgba(0,119,137,0.4)]"
        >
          Jelajahi Sekarang
        </button>
      </div>
    </header>

    <!-- 3. Features Teaser Section -->
    <section id="features-teaser" class="py-20 lg:py-28 bg-slate-50">
      <div class="container mx-auto px-6 lg:px-8">
        <div
          class="text-center mb-12 lg:mb-16 animate-on-scroll"
          data-animation="fade-in-up"
        >
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-800">
            Kenapa Memilih FitFromHome?
          </h2>
          <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Kami menyediakan fitur komprehensif untuk mendukung perjalanan
            kesehatan Anda secara menyeluruh.
          </p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          <div
            v-for="(feature, index) in teaserFeatures"
            :key="feature.title"
            class="bg-white p-7 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 animate-on-scroll flex flex-col items-center text-center hover:-translate-y-1.5"
            data-animation="fade-in-up"
            :data-delay="100 + index * 150"
          >
            <div
              class="p-4 bg-[rgba(0,119,137,0.1)] rounded-full mb-6 inline-block"
            >
              <i
                :class="feature.icon"
                class="text-3xl lg:text-4xl text-[rgba(0,119,137,1)]"
              ></i>
            </div>
            <h3 class="text-xl lg:text-2xl font-semibold mb-3 text-gray-800">
              {{ feature.title }}
            </h3>
            <p class="text-gray-600 text-sm leading-relaxed flex-grow">
              {{ feature.description }}
            </p>
            <span
              class="mt-6 text-xs font-semibold text-[rgba(0,119,137,0.8)] uppercase tracking-wider py-1 px-3 bg-[rgba(0,119,137,0.05)] rounded-full"
              >Fitur Member</span
            >
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Food Section -->
    <section id="food-section" class="py-20 lg:py-28">
      <div class="container mx-auto px-6 lg:px-8">
        <div
          class="text-center mb-12 lg:mb-16 animate-on-scroll"
          data-animation="fade-in-up"
        >
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-800">
            Resep Sehat & Lezat Pilihan
          </h2>
          <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Temukan inspirasi hidangan bergizi yang mudah dibuat dan memanjakan
            lidah.
          </p>
        </div>
        <div class="grid lg:grid-cols-12 gap-8 lg:gap-10">
          <div
            v-if="foods.length > 0"
            class="lg:col-span-8 bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl animate-on-scroll group"
            data-animation="fade-in-up"
          >
            <div class="md:flex h-full">
              <div class="md:w-1/2 lg:w-3/5 overflow-hidden h-64 md:h-full">
                <img
                  :src="foods[0].image"
                  :alt="'Gambar ' + foods[0].name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div
                class="p-6 lg:p-8 flex flex-col justify-center md:w-1/2 lg:w-2/5"
              >
                <span
                  class="text-xs font-semibold text-[rgba(0,119,137,1)] uppercase tracking-wider mb-2"
                  >Resep Unggulan</span
                >
                <h3
                  class="text-2xl lg:text-3xl font-semibold mb-3 text-gray-800"
                >
                  {{ foods[0].name }}
                </h3>
                <p
                  class="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-3"
                >
                  {{ foods[0].description }}
                </p>
                <button
                  @click="handleNavigation('/dashboard/makanan')"
                  class="inline-flex items-center text-sm font-semibold text-white bg-[rgba(0,119,137,1)] hover:bg-[rgba(0,90,105,1)] py-2.5 px-5 rounded-lg transition-colors duration-200 self-start group"
                >
                  Lihat Detail
                  <span
                    class="opacity-0 group-hover:opacity-100 group-hover:ml-1.5 transition-all duration-300"
                    >&rarr;</span
                  >
                </button>
              </div>
            </div>
          </div>
          <div
            v-for="(food, index) in foods.slice(1)"
            :key="food.name"
            class="lg:col-span-4 bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-on-scroll group"
            data-animation="fade-in-up"
            :data-delay="100 + index * 100"
          >
            <div class="overflow-hidden h-52">
              <img
                :src="food.image"
                :alt="'Gambar ' + food.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2 text-gray-800 line-clamp-2">
                {{ food.name }}
              </h3>
              <p
                class="text-gray-600 text-xs mb-4 leading-relaxed line-clamp-2"
              >
                {{ food.description }}
              </p>
              <button
                @click="handleNavigation('/dashboard/makanan')"
                class="inline-flex items-center text-xs font-semibold text-[rgba(0,119,137,1)] hover:text-[rgba(0,90,105,1)] transition-colors duration-200 group"
              >
                Selengkapnya
                <span
                  class="opacity-0 group-hover:opacity-100 group-hover:ml-1 transition-all duration-300"
                  >&rarr;</span
                >
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. Exercise Section -->
    <section id="exercise-section" class="py-20 lg:py-28 bg-slate-50">
      <div class="container mx-auto px-6 lg:px-8">
        <div
          class="text-center mb-12 lg:mb-16 animate-on-scroll"
          data-animation="fade-in-up"
        >
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-800">
            Rutinitas Latihan Efektif
          </h2>
          <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Capai target kebugaran Anda dengan panduan latihan yang dirancang
            oleh para ahli.
          </p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          <div
            v-for="(exercise, index) in exercises"
            :key="exercise.name"
            class="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 animate-on-scroll group"
            data-animation="fade-in-up"
            :data-delay="index * 150"
          >
            <div class="overflow-hidden h-60">
              <img
                :src="exercise.image"
                :alt="'Gambar ' + exercise.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div class="p-6 lg:p-7">
              <h3 class="text-xl lg:text-2xl font-semibold mb-3 text-gray-800">
                {{ exercise.name }}
              </h3>
              <p
                class="text-gray-600 text-sm mb-5 leading-relaxed line-clamp-3"
              >
                {{ exercise.description }}
              </p>
              <button
                @click="handleNavigation('/dashboard/latihan')"
                class="inline-flex items-center text-sm font-semibold text-[rgba(0,119,137,1)] hover:text-[rgba(0,90,105,1)] transition-colors duration-200 group"
              >
                {{ exercise.linkText }}
                <span
                  class="opacity-0 group-hover:opacity-100 group-hover:ml-1 transition-all duration-300"
                  >&rarr;</span
                >
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. Call to Action Section -->
    <section
      id="cta-section"
      class="py-20 lg:py-28 bg-gradient-to-br from-[rgba(0,119,137,1)] to-[rgba(0,80,95,1)] text-white text-center"
    >
      <div class="container mx-auto px-6 lg:px-8">
        <h2
          class="text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 animate-on-scroll"
          data-animation="fade-in-up"
        >
          Siap Mengubah Hidup Anda?
        </h2>
        <p
          class="text-lg lg:text-xl mb-10 opacity-90 max-w-2xl mx-auto animate-on-scroll"
          data-animation="fade-in-up"
          data-delay="150"
        >
          Bergabunglah dengan HealthHub hari ini dan dapatkan akses penuh ke
          semua fitur, konten eksklusif, dan dukungan komunitas.
        </p>
        <div
          class="animate-on-scroll"
          data-animation="fade-in-up"
          data-delay="300"
        >
          <button
            @click="handleNavigation('/dashboard/bmi')"
            class="block mx-auto max-w-xs cursor-pointer bg-white hover:bg-gray-200 text-[rgba(0,119,137,1)] font-semibold py-3.5 px-7 rounded-lg transition-all duration-200 text-base hover:shadow-md shadow-sm focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-inset focus:ring-offset-[rgba(0,119,137,1)]"
          >
            Daftar & Mulai
          </button>
        </div>
      </div>
    </section>

    <!-- 7. Footer -->
    <footer class="bg-gray-900 text-gray-400 py-16 text-center sm:text-left">
      <div class="container mx-auto px-6 lg:px-8">
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h4 class="text-xl font-semibold text-white mb-4">HealthHub</h4>
            <p class="text-sm leading-relaxed">
              Membantu Anda mencapai versi terbaik diri Anda melalui kesehatan
              dan kebugaran yang berkelanjutan.
            </p>
          </div>
          <div>
            <h5 class="text-lg font-semibold text-white mb-4">Navigasi</h5>
            <ul class="space-y-2">
              <li>
                <a
                  href="#"
                  @click.prevent="handleNavigation('/dashboard')"
                  class="hover:text-[rgba(0,119,137,1)] transition-colors text-sm"
                  >Fitur</a
                >
              </li>
              <li>
                <a
                  href="#"
                  @click.prevent="handleNavigation('/dashboard/makanan')"
                  class="hover:text-[rgba(0,119,137,1)] transition-colors text-sm"
                  >Inspirasi</a
                >
              </li>
              <li>
                <a
                  href="#"
                  @click.prevent="handleNavigation('/dashboard/latihan')"
                  class="hover:text-[rgba(0,119,137,1)] transition-colors text-sm"
                  >Latihan</a
                >
              </li>
              <li>
                <button
                  @click="handleNavigation('/dashboard/bmi')"
                  class="hover:text-[rgba(0,119,137,1)] transition-colors text-sm text-left w-full"
                >
                  Gabung
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h5 class="text-lg font-semibold text-white mb-4">Legal</h5>
            <ul class="space-y-2">
              <li>
                <a
                  href="#"
                  class="hover:text-[rgba(0,119,137,1)] transition-colors text-sm"
                  >Kebijakan Privasi</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="hover:text-[rgba(0,119,137,1)] transition-colors text-sm"
                  >Syarat & Ketentuan</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="hover:text-[rgba(0,119,137,1)] transition-colors text-sm"
                  >Hubungi Kami</a
                >
              </li>
            </ul>
          </div>
          <div>
            <h5 class="text-lg font-semibold text-white mb-4">Ikuti Kami</h5>
            <div class="flex space-x-4 sm:justify-start justify-center">
              <a
                href="#"
                aria-label="Facebook"
                class="text-xl hover:text-[rgba(0,119,137,1)] transition-colors"
                ><i class="fab fa-facebook-f"></i
              ></a>
              <a
                href="#"
                aria-label="Instagram"
                class="text-xl hover:text-[rgba(0,119,137,1)] transition-colors"
                ><i class="fab fa-instagram"></i
              ></a>
              <a
                href="#"
                aria-label="Twitter"
                class="text-xl hover:text-[rgba(0,119,137,1)] transition-colors"
                ><i class="fab fa-twitter"></i
              ></a>
            </div>
          </div>
        </div>
        <hr class="my-10 border-gray-700" />
        <p class="text-xs text-gray-500 text-center">
          &copy; {{ new Date().getFullYear() }} HealthHub. Semua Hak Dilindungi.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../supabaseClient"; // Pastikan path ini benar

const router = useRouter();

const isScrolled = ref(false);
const isMobileNavOpen = ref(false);
let observer = null;

// --- Logika Navigasi Cerdas ---
async function handleNavigation(targetPath) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    // Jika sudah login, langsung ke tujuan
    router.push(targetPath);
  } else {
    // Jika belum login, arahkan ke halaman login dengan query redirect
    router.push({ path: "/login", query: { redirect: targetPath } });
  }
}

function handleMobileNav(targetPath) {
  isMobileNavOpen.value = false;
  handleNavigation(targetPath);
}

// --- Logika UI untuk Navbar Scroll ---
const handleNavbarScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

const toggleMobileNav = () => {
  isMobileNavOpen.value = !isMobileNavOpen.value;
};

// --- Data Statis untuk Tampilan ---
const teaserFeatures = ref([
  {
    title: "Analisis Kebugaran Personal",
    description:
      "Ketahui status gizi dan kebugaran Anda dengan alat analisis komprehensif kami.",
    icon: "fas fa-chart-line",
  },
  {
    title: "Rencana Nutrisi Cerdas",
    description:
      "Dapatkan rekomendasi menu harian yang disesuaikan dengan kebutuhan kalori dan target kesehatan Anda.",
    icon: "fas fa-apple-alt",
  },
  {
    title: "Program Latihan Dinamis",
    description:
      "Akses beragam program latihan interaktif, dari pemula hingga mahir, dengan panduan video.",
    icon: "fas fa-running",
  },
]);

const foods = ref([
  {
    name: "Smoothie Bowl Buah Naga & Berry",
    description:
      "Energi pagi dengan smoothie bowl kaya antioksidan, topping granola, biji chia, dan irisan buah segar.",
    image:
      "https://images.unsplash.com/photo-1507120366498-4656eaece7fa?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGp1aWNlfGVufDB8fDB8fHww",
    link: "#",
  },
  {
    name: "Salmon Panggang Asparagus Lemon",
    description:
      "Hidangan utama lezat kaya protein dan omega-3, salmon fillet dipanggang dengan asparagus segar dan saus lemon dill.",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80&h=1000",
    link: "#",
  },
  {
    name: "Salad Chickpea & Alpukat Segar",
    description:
      "Salad ringan namun mengenyangkan, paduan chickpea, alpukat, tomat ceri, dan dressing madu mustard.",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80&h=1000",
    link: "#",
  },
  {
    name: "Salad Sayuran Mediterania Segar",
    description:
      "Kombinasi sayuran renyah, zaitun, keju feta, dan dressing lemon herb. Sempurna untuk makan siang ringan dan sehat.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    // 'link' tidak lagi digunakan untuk navigasi langsung jika Anda menggunakan handleNavigation
    link: "#",
  },
  {
    name: "Smoothie Mangga & Bayam Penuh Energi",
    description:
      "Boost energi pagi Anda dengan smoothie hijau kaya nutrisi, paduan mangga manis dan bayam segar. Nikmat dan menyehatkan!",
    image:
      "https://images.unsplash.com/photo-1619898804188-e7bad4bd2127?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWFuZ28lMjBzbW9vdGhpZXxlbnwwfHwwfHx8MA%3D%3D",
    link: "#",
  },
]);

const exercises = ref([
  {
    name: "Yoga Flow Pagi Hari",
    description:
      "Awali hari dengan sesi yoga vinyasa untuk meningkatkan fleksibilitas, keseimbangan, dan ketenangan pikiran.",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80&h=1080",
    link: "#",
    linkText: "Mulai Yoga",
  },
  {
    name: "Latihan Kekuatan Tubuh Bagian Atas",
    description:
      "Program 30 menit untuk memperkuat otot dada, punggung, dan lengan dengan dumbbell dan resistance band.",
    image:
      "https://images.unsplash.com/photo-1674834726923-3ba828d37846?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8TGF0aWhhbiUyMEtla3VhdGFuJTIwVHVidWglMjBCYWdpYW4lMjBBdGFzfGVufDB8fDB8fHww",
    link: "#",
    linkText: "Coba Latihan",
  },
  {
    name: "Latihan Kardio HIIT 20 Menit",
    description:
      "Sesi HIIT singkat namun intens untuk membakar kalori maksimal dan meningkatkan daya tahan jantung.",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80&h=1080",
    link: "#",
    linkText: "Coba HIIT",
  },
]);

// --- Lifecycle Hooks ---
onMounted(() => {
  window.addEventListener("scroll", handleNavbarScroll);

  // --- Logika Animasi Scroll dengan Intersection Observer (Lebih Performa) ---
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Ketika elemen masuk ke viewport
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay) || 0;

          setTimeout(() => {
            el.classList.remove("opacity-0");
            if (el.dataset.animation === "fade-in-up") {
              el.classList.remove("translate-y-10");
            }
          }, delay);

          // Hentikan observasi setelah animasi berjalan sekali agar lebih efisien
          observer.unobserve(el);
        }
      });
    },
    {
      threshold: 0.1, // Trigger saat 10% elemen terlihat
    }
  );

  // Amati semua elemen yang memiliki kelas .animate-on-scroll
  const elementsToAnimate = document.querySelectorAll(".animate-on-scroll");
  elementsToAnimate.forEach((el) => {
    // Set state awal animasi
    el.classList.add(
      "opacity-0",
      "transition-all",
      "duration-1000",
      "ease-out"
    );
    if (el.dataset.animation === "fade-in-up") {
      el.classList.add("translate-y-10", "transform");
    }
    observer.observe(el);
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleNavbarScroll);
  // Hentikan observer untuk mencegah memory leak saat komponen dihancurkan
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style>
/* @import harus paling atas */
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap");

.font-sans {
  font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

/* Helper class untuk line-clamp */
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}
.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
}
</style>
