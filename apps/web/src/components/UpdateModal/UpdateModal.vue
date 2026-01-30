<template>
  <div class="update-modal-overlay" @click="$emit('close')">
    <div class="update-modal" @click.stop>
      <button class="update-modal-close" @click="$emit('close')">
        <X :size="18" />
      </button>

      <div class="update-modal-icon">
        <img src="/favicon-dark.svg" alt="MD Beautify" width="64" height="64" />
      </div>

      <h2 class="update-modal-title">{{ t('update.newVersion') }}</h2>
      <p class="update-modal-version">{{ t('update.versionInfo', { version: latestVersion }) }}</p>

      <button
        v-if="releaseNotes"
        class="update-modal-notes-toggle"
        @click="showNotes = !showNotes"
      >
        <ChevronUp v-if="showNotes" :size="16" />
        <ChevronDown v-else :size="16" />
        {{ showNotes ? t('update.hideNotes') : t('update.showNotes') }}
      </button>

      <div v-if="showNotes && releaseNotes" class="update-modal-notes">
        <pre>{{ formattedReleaseNotes }}</pre>
      </div>

      <div class="update-modal-actions">
        <button class="update-modal-btn secondary" @click="$emit('close')">
          {{ t('update.remindLater') }}
        </button>
        <button class="update-modal-btn primary" @click="$emit('download')">
          <Download :size="16" />
          {{ t('update.download') }}
        </button>
      </div>

      <button class="update-modal-skip" @click="$emit('skip-version')">
        {{ t('update.skipVersion') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { X, Download, ChevronDown, ChevronUp } from 'lucide-vue-next';
import { useI18n } from '../../i18n';
import './UpdateModal.css';

const { t } = useI18n();

const props = defineProps<{
  latestVersion: string;
  currentVersion: string;
  releaseNotes?: string;
}>();

defineEmits<{
  (e: 'close'): void;
  (e: 'download'): void;
  (e: 'skip-version'): void;
}>();

const showNotes = ref(false);

const formattedReleaseNotes = computed(() => {
  if (!props.releaseNotes) return '';
  return props.releaseNotes
    .replace(/^### /gm, "◆ ")
    .replace(/^## /gm, "▸ ")
    .replace(/^# /gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/^- /gm, "• ")
    .trim();
});
</script>
