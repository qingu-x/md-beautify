<template>
  <button
    :class="classNames"
    @click="$emit('click', $event)"
    :aria-label="label"
    :title="label"
    :data-tooltip="label"
  >
    <span class="floating-btn-icon">
      <slot name="icon">
        <component :is="icon" v-if="icon" />
      </slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue';

const props = defineProps<{
  /** Button icon / 按钮图标 */
  icon?: Component;
  /** Accessibility label and tooltip text / 无障碍标签和 tooltip 文本 */
  label: string;
  /** Whether it is a primary action button (green gradient background) / 是否为主操作按钮（绿色渐变背景） */
  primary?: boolean;
  /** Whether to show as highlighted style (theme color border) / 是否显示为强调样式（主题色边框） */
  highlight?: boolean;
}>();

defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const classNames = computed(() => {
  return [
    "floating-btn",
    props.primary && "floating-btn-primary",
    props.highlight && "floating-btn-show",
  ].filter(Boolean).join(" ");
});
</script>
