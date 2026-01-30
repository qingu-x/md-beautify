<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { StorageType } from '../../storage/types';
import { useStorageStore } from '../../store/storageStore';
import { useI18n } from '../../i18n';

const { t } = useI18n();
const storageStore = useStorageStore();
const loading = ref(false);

const OPTIONS = computed(() => [
  {
    type: 'filesystem' as StorageType,
    label: t('storage.filesystem.label'),
    description: t('storage.filesystem.description'),
    notice: t('storage.filesystem.notice'),
  },
  {
    type: 'indexeddb' as StorageType,
    label: t('storage.indexeddb.label'),
    description: t('storage.indexeddb.description'),
    notice: t('storage.indexeddb.notice'),
  },
]);

const handleSelect = async (nextType: StorageType) => {
  loading.value = true;
  await storageStore.select(nextType);
  loading.value = false;
};

watch(() => storageStore.ready, (ready) => {
  if (ready) loading.value = false;
});
</script>

<template>
  <div class="storage-mode-selector">
    <p class="storage-mode-tip">{{ t('storage.tip') }}</p>
    <div class="storage-mode-options">
      <button
        v-for="option in OPTIONS"
        :key="option.type"
        :class="['storage-mode-option', storageStore.type === option.type ? 'active' : '']"
        :disabled="(option.type === 'filesystem' && !storageStore.isFileSystemSupported) || loading"
        @click="handleSelect(option.type)"
      >
        <div class="storage-mode-option__label">
          <span>{{ option.label }}</span>
          <small v-if="storageStore.type === option.type">{{ t('storage.current') }}</small>
        </div>
        <p>{{ (option.type === 'filesystem' && !storageStore.isFileSystemSupported) ? t('storage.notSupported') : option.description }}</p>
        <p class="storage-mode-notice">{{ option.notice }}</p>
      </button>
    </div>
    <div v-if="storageStore.message" class="storage-mode-status">{{ storageStore.message }}</div>
  </div>
</template>

<style scoped>
@import "./StorageModeSelector.css";
</style>
