<script setup lang="ts">
import type { DesignerVariables } from "../types";
import { useI18n } from "../../../../i18n";

const { t } = useI18n();

const props = defineProps<{
  variables: DesignerVariables;
}>();

const emit = defineEmits<{
  (e: "change", updates: Partial<DesignerVariables>): void;
}>();

const themes = [
  { id: "base", label: t("designer.options.mermaidTheme.base") },
  { id: "default", label: t("designer.options.mermaidTheme.default") },
  { id: "forest", label: t("designer.options.mermaidTheme.forest") },
  { id: "neutral", label: t("designer.options.mermaidTheme.neutral") },
  { id: "dark", label: t("designer.options.mermaidTheme.dark") },
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
    <div class="designer-group-label">{{ t('designer.sections.mermaid') }}</div>

    <div class="designer-field">
      <label>{{ t('designer.fields.baseTheme') }}</label>
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
