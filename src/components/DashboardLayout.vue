<template>
  <div class="min-h-screen bg-slate-100 flex font-sans antialiased">
    <!-- Sidebar untuk Desktop -->
    <aside
      class="fixed top-0 left-0 h-full bg-slate-900 text-slate-300 flex-col justify-between hidden lg:flex transition-all duration-300 ease-in-out z-30"
      :class="{ 'w-64': !isSidebarCollapsed, 'w-20': isSidebarCollapsed }"
    >
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div
          class="flex items-center justify-center h-20 border-b border-slate-800 px-4"
        >
          <router-link to="/dashboard" class="transition-opacity duration-200">
            <!-- Logo Penuh (saat sidebar terbuka) -->
            <div
              v-show="!isSidebarCollapsed"
              class="flex items-center space-x-3"
            >
              <i class="fas fa-dumbbell text-2xl text-cyan-400"></i>
              <span class="text-xl font-bold text-white">FitFromHome</span>
            </div>
            <!-- Logo Ringkas (saat sidebar diciutkan) -->
            <div v-show="isSidebarCollapsed">
              <i class="fas fa-dumbbell text-2xl text-white"></i>
            </div>
          </router-link>
        </div>

        <!-- Menu Navigasi -->
        <nav class="mt-4 flex-grow">
          <ul class="space-y-2 px-4">
            <li v-for="item in menuItems" :key="item.name">
              <router-link
                :to="item.path"
                class="flex items-center py-2.5 px-4 rounded-lg hover:bg-slate-700/80 transition-colors duration-200 group relative"
                active-class="bg-[rgba(0,119,137,1)] text-white shadow-md"
              >
                <!-- Indikator Aktif -->
                <div
                  class="absolute left-0 top-0 h-full w-1 bg-cyan-400 rounded-r-full transition-all duration-200 scale-y-0 group-[.router-link-active]:scale-y-100"
                ></div>
                <i
                  class="text-xl w-5 text-center text-slate-400 group-hover:text-white transition-colors duration-200"
                  :class="[
                    item.icon,
                    { 'group-[.router-link-active]:text-white': true },
                  ]"
                ></i>
                <span
                  class="ml-4 font-medium transition-all duration-200 ease-in-out whitespace-nowrap"
                  :class="{
                    'opacity-0 ml-0': isSidebarCollapsed,
                    'opacity-100': !isSidebarCollapsed,
                  }"
                  >{{ item.name }}</span
                >
                <!-- Tooltip saat sidebar diciutkan -->
                <span
                  v-if="isSidebarCollapsed"
                  class="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-50"
                >
                  {{ item.name }}
                </span>
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>

    <!-- Sidebar untuk Mobile (Overlay) -->
    <transition name="fade">
      <div
        v-show="isMobileSidebarOpen"
        class="fixed inset-0 bg-black/60 z-40 lg:hidden"
        @click="isMobileSidebarOpen = false"
      ></div>
    </transition>
    <transition name="slide-in">
      <aside
        v-show="isMobileSidebarOpen"
        class="fixed top-0 left-0 h-full w-64 bg-slate-900 text-slate-300 z-50 flex flex-col lg:hidden"
      >
        <!-- Logo & Tombol Tutup Mobile -->
        <div
          class="flex items-center justify-between h-20 border-b border-slate-800 px-6"
        >
           <router-link to="/dashboard" @click="isMobileSidebarOpen = false" class="flex items-center space-x-3">
              <i class="fas fa-dumbbell text-2xl text-cyan-400"></i>
              <span class="text-xl font-bold text-white">FitFromHome</span>
          </router-link>
          <button
            @click="isMobileSidebarOpen = false"
            class="text-slate-400 hover:text-white text-3xl"
          >
            &times;
          </button>
        </div>
        <!-- Menu Navigasi Mobile -->
        <nav class="mt-4">
          <ul class="space-y-2 px-4">
            <li v-for="item in menuItems" :key="item.name">
              <router-link
                :to="item.path"
                @click="isMobileSidebarOpen = false"
                class="flex items-center py-2.5 px-4 rounded-lg hover:bg-slate-700/80 transition-colors duration-200 group"
                active-class="bg-[rgba(0,119,137,1)] text-white shadow-md"
              >
                <i
                  class="text-xl w-5 text-center text-slate-400 group-hover:text-white"
                  :class="[
                    item.icon,
                    { 'group-[.router-link-active]:text-white': true },
                  ]"
                ></i>
                <span class="ml-4 font-medium">{{ item.name }}</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </aside>
    </transition>

    <!--Konten Utama (Dengan margin-left dinamis)-->
    <div
      class="flex-1 flex flex-col transition-all duration-300 ease-in-out"
      :class="{
        'lg:ml-64': !isSidebarCollapsed,
        'lg:ml-20': isSidebarCollapsed,
      }"
    >
      <!-- Header Atas (Top Bar) -->
      <header
        class="bg-white/80 backdrop-blur-lg shadow-sm p-4 flex items-center justify-between z-10 sticky top-0"
      >
        <!-- Tombol Kontrol Sidebar (Desktop & Mobile) -->
        <button
          @click="toggleSidebar"
          class="text-gray-600 hover:text-[rgba(0,119,137,1)] focus:outline-none rounded-md p-1"
        >
          <i class="fas fa-bars text-xl"></i>
        </button>

        <!-- Judul Halaman Dinamis -->
        <h2
          class="text-lg font-semibold text-gray-800 ml-4 hidden sm:block truncate"
        >
          {{ currentRouteName }}
        </h2>

        <!-- Menu User di Kanan -->
        <div class="relative ml-auto">
          <button
            @click="isUserMenuOpen = !isUserMenuOpen"
            class="flex items-center space-x-2 p-1 rounded-md hover:bg-slate-100"
          >
            <img
              class="h-9 w-9 rounded-full object-cover border-2 border-slate-200"
              :src="
                user.avatar_url ||
                `https://ui-avatars.com/api/?name=${
                  user.full_name || 'U'
                }&background=0D8ABC&color=fff`
              "
              alt="User Avatar"
            />
            <span class="hidden md:block font-semibold text-sm text-gray-700">{{
              user.full_name || "User"
            }}</span>
            <i
              class="fas fa-chevron-down text-xs text-gray-500 hidden md:block transition-transform duration-200"
              :class="{ 'rotate-180': isUserMenuOpen }"
            ></i>
          </button>
          <!-- Dropdown Menu User -->
          <transition name="fade-down">
            <div
              v-if="isUserMenuOpen"
              class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-20 py-2 border border-slate-100"
            >
              <div class="px-4 py-2 border-b border-slate-100">
                <p class="font-semibold text-sm text-gray-800 truncate">
                  {{ user.full_name || "User" }}
                </p>
                <p class="text-xs text-gray-500 truncate">
                  {{ user.email || "user@email.com" }}
                </p>
              </div>
              <router-link
                to="/dashboard/pengaturan"
                @click="isUserMenuOpen = false"
                class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-slate-100"
              >
                <i class="fas fa-cog w-5 text-center mr-2 text-gray-500"></i
                >Pengaturan Akun
              </router-link>
              <a
                href="#"
                @click.prevent="handleLogout"
                class="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <i
                  class="fas fa-sign-out-alt w-5 text-center mr-2 text-red-500"
                ></i
                >Logout
              </a>
            </div>
          </transition>
        </div>
      </header>

      <!-- Area Router View -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <router-view v-slot="{ Component }">
          <transition name="fade-slide" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { supabase } from "../supabaseClient";

const router = useRouter();
const route = useRoute();

// --- State Management ---
const isSidebarCollapsed = ref(false);
const isMobileSidebarOpen = ref(false);
const isUserMenuOpen = ref(false);
const user = ref({});
const screenWidth = ref(window.innerWidth);

// --- Menu Items (Sumber data tunggal untuk kedua sidebar) ---
const menuItems = ref([
  { name: "Kalkulator BMI", path: "/dashboard/bmi", icon: "fas fa-calculator" },
  { name: "Kalkulator Kalori", path: "/dashboard/kalori", icon: "fas fa-fire-alt" }, // <-- Ditambahkan
  { name: "Latihan", path: "/dashboard/latihan", icon: "fas fa-dumbbell" },
  { name: "Makanan", path: "/dashboard/makanan", icon: "fas fa-utensils" },
  { name: "Favorit", path: "/dashboard/favorit", icon: "fas fa-heart" },
  { name: "Pengaturan", path: "/dashboard/pengaturan", icon: "fas fa-cog" },
]);

// --- Computed Properties ---
const currentRouteName = computed(() => route.name || "Dashboard");

// --- Methods ---
const toggleSidebar = () => {
  if (screenWidth.value >= 1024) {
    isSidebarCollapsed.value = !isSidebarCollapsed.value;
  } else {
    isMobileSidebarOpen.value = true;
  }
};

const handleLogout = async () => {
  isUserMenuOpen.value = false;
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    router.push("/");
  } catch (error) {
    console.error("Error logging out:", error.message);
  }
};

const closeUserMenu = (e) => {
  if (!e.target.closest(".relative")) {
    isUserMenuOpen.value = false;
  }
};

const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth;
};

// --- Lifecycle Hooks ---
onMounted(async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) {
    user.value = {
      email: session.user.email,
      full_name: session.user.user_metadata?.full_name,
      avatar_url: session.user.user_metadata?.avatar_url,
    };
  }
  document.addEventListener("click", closeUserMenu);
  window.addEventListener("resize", updateScreenWidth);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closeUserMenu);
  window.removeEventListener("resize", updateScreenWidth);
});

watch(screenWidth, (newWidth) => {
  if (newWidth >= 1024) {
    isMobileSidebarOpen.value = false;
  }
});
</script>

<style scoped>
/* Transisi umum untuk fade in/out */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Transisi untuk konten utama saat berganti halaman */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Transisi untuk dropdown menu user */
.fade-down-enter-active,
.fade-down-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease-out;
}
.fade-down-enter-from,
.fade-down-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

/* Transisi untuk sidebar mobile */
.slide-in-enter-active,
.slide-in-leave-active {
  transition: transform 0.3s ease-in-out;
}
.slide-in-enter-from,
.slide-in-leave-to {
  transform: translateX(-100%);
}

aside::-webkit-scrollbar {
    display: none;
}
aside {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
