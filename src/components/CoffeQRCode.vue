<script lang="ts" setup>
import QRCode from 'qrcode.vue';

const coffeAddress = '0x88888e673E5BdC0B55a225D3B836449e270df6b1';
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
    </p>
    <p>
      <QRCode :value="coffeAddress" />
    </p>
  </main>
</template>
