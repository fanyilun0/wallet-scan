<script lang="ts" setup>
// import {
//   NDialogProvider,
//   NNotificationProvider,
//   NMessageProvider,
//   NLoadingBarProvider
// } from 'naive-ui'

// import { MessageContent } from '@/components/Plugins/MessageContent'
// import { DialogContent } from '@/components/Plugins/DialogContent'
// import { LoadingContent } from '@/components/Plugins/LoadingContent'
</script>

<template>
  <n-loading-bar-provider>
    <n-dialog-provider>
      <!-- <dialog-content /> -->
      <!-- <loading-content /> -->
      <n-notification-provider>
        <n-message-provider>
          <!-- <message-content /> -->
          <slot />
        </n-message-provider>
      </n-notification-provider>
    </n-dialog-provider>
  </n-loading-bar-provider>
</template>
