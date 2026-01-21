<script setup lang="ts">
import type { DesignerVariables } from "../types";

const props = defineProps<{
  variables: DesignerVariables;
}>();

const emit = defineEmits<{
  (e: "change", updates: Partial<DesignerVariables>): void;
}>();

const themes = [
  { id: "base", label: "基础 (Base)" },
  { id: "default", label: "默认 (Default)" },
  { id: "forest", label: "森林 (Forest)" },
  { id: "neutral", label: "中性 (Neutral)" },
  { id: "dark", label: "深色 (Dark)" },
] as const;

const updateVariable = <K extends keyof DesignerVariables>(
  key: K,
  value: DesignerVariables[K]
) => {
  emit("change", { [key]: value });
};
</script>

<template>
  <div class="designer-section">
    <div class="designer-group-label">Mermaid 设置</div>

    <div class="designer-field">
      <label>基准主题</label>
      <div class="designer-options col-2">
        <button
          v-for="opt in themes"
          :key="opt.id"
          class="option-btn"
          :class="{ active: variables.mermaidTheme === opt.id }"
          @click="updateVariable('mermaidTheme', opt.id)"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>
  </div>
</template>
