<script lang="ts" setup>
import { ref } from 'vue';
import { useClipboard } from '@vueuse/core'
import QRCode from 'qrcode.vue';

const coffeAddress = '0x88888e673E5BdC0B55a225D3B836449e270df6b1';
const source = ref(coffeAddress)
const { text, copy, copied, isSupported } = useClipboard({ source })
</script>
<template>
  <main
    font-sans
    p="4"
    w="500px"
    mx-auto
    text="center gray-700 dark:gray-200 lg"
  >
    <p>
      If you feel that this tool has been helpful to you, would you consider buying the author a cup of coffee to help
      them stay energized? 😄
    </p>
    <p>
      EVM Address：{{ coffeAddress }}
      <span
        inline-block
        w="16px"
        align="text-top"
        ml="2"
        cursor="pointer"
        :class="{ copied: copied }"
        i-carbon-copy
        @click="copy(source)"
      />
    </p>
    <p>
      <QRCode :value="coffeAddress" />
    </p>
  </main>
</template>

<style>
.copied {
  color: #18a058;
}
</style>
