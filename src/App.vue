<template>
  <main
    font-sans
    p="4"
    text=" gray-700 dark:gray-200"
  >
    <Header />
    <router-view v-slot="{ Component }">
      <transition>
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </main>
</template>
