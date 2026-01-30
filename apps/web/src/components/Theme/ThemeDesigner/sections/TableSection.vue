<script setup lang="ts">
import ColorSelector from "../ColorSelector.vue";
import type { DesignerVariables } from "../types";
import { useI18n } from "../../../../i18n";

const { t } = useI18n();

const props = defineProps<{
  variables: DesignerVariables;
}>();

const emit = defineEmits<{
  (e: "change", updates: Partial<DesignerVariables>): void;
}>();

const updateVariable = <K extends keyof DesignerVariables>(
  key: K,
  value: DesignerVariables[K]
) => {
  emit("change", { [key]: value });
};
</script>

<template>
  <div class="designer-section">
    <div class="designer-group-label">{{ t('designer.sections.table') }}</div>
    <div class="designer-row">
      <div class="designer-field half">
        <label>{{ t('designer.fields.tableHeaderBackground') }}</label>
        <ColorSelector
          :value="variables.tableHeaderBackground"
          :presets="['#f8f8f8', '#f0f0f0', '#e8e8e8', variables.primaryColor + '15']"
          @change="updateVariable('tableHeaderBackground', $event)"
        />
      </div>
      <div class="designer-field half">
        <label>{{ t('designer.fields.tableHeaderColor') }}</label>
        <ColorSelector
          :value="variables.tableHeaderColor"
          :presets="['inherit', '#333', '#000', variables.primaryColor]"
          @change="updateVariable('tableHeaderColor', $event)"
        />
      </div>
    </div>
    <div class="designer-field">
      <label>{{ t('designer.fields.borderColor') }}</label>
      <ColorSelector
        :value="variables.tableBorderColor"
        :presets="['#dfe2e5', '#e8e8e8', '#ccc', variables.primaryColor + '50']"
        @change="updateVariable('tableBorderColor', $event)"
      />
    </div>
    <div class="designer-field-row">
      <span>{{ t('designer.fields.tableZebra') }}</span>
      <label class="designer-switch">
        <input
          type="checkbox"
          :checked="variables.tableZebra"
          @change="
            updateVariable('tableZebra', ($event.target as HTMLInputElement).checked)
          "
        />
        <span class="switch-slider"></span>
      </label>
    </div>
  </div>
</template>
