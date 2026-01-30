<template>
  <div class="welcome-container">
    <div class="welcome-content">
      <img
        src="/favicon-dark.svg"
        alt="MD Beautify Logo"
        class="welcome-logo"
      />
      <h1>{{ t('welcome.title') }}</h1>
      <p>{{ t('welcome.subtitle') }}</p>
      <button class="btn-primary" @click="selectWorkspace">
        <FolderOpen :size="20" />
        {{ t('welcome.selectWorkspace') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FolderOpen } from 'lucide-vue-next';
import { useFileSystem } from '../../hooks/useFileSystem';
import { useI18n } from '../../i18n';
import './Welcome.css';

const { selectWorkspace } = useFileSystem();
const { t } = useI18n();
</script>
