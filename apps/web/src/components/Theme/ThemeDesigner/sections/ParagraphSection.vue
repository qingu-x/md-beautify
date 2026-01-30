<script setup lang="ts">
import type { DesignerVariables } from "../types";
import ColorSelector from "../ColorSelector.vue";
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
    <div class="designer-field">
      <label>{{ t('designer.fields.paragraphMargin') }}: {{ variables.paragraphMargin }}px</label>
      <input
        type="range"
        class="designer-slider"
        :min="8"
        :max="32"
        :step="2"
        :value="variables.paragraphMargin"
        @input="
          updateVariable(
            'paragraphMargin',
            Number(($event.target as HTMLInputElement).value)
          )
        "
      />
    </div>

    <div class="designer-field-row">
      <span>{{ t('designer.fields.textIndent') }}</span>
      <label class="designer-switch">
        <input
          type="checkbox"
          :checked="variables.textIndent"
          @change="
            updateVariable('textIndent', ($event.target as HTMLInputElement).checked)
          "
        />
        <span class="switch-slider"></span>
      </label>
    </div>

    <div class="designer-field-row">
      <span>{{ t('designer.fields.textJustify') }}</span>
      <label class="designer-switch">
        <input
          type="checkbox"
          :checked="variables.textJustify"
          @change="
            updateVariable(
              'textJustify',
              ($event.target as HTMLInputElement).checked
            )
          "
        />
        <span class="switch-slider"></span>
      </label>
    </div>

    <div class="designer-group-label mt-4">{{ t('designer.sections.hr') }}</div>
    <div class="designer-field">
      <label>{{ t('designer.fields.style') }}</label>
      <div class="designer-options col-3">
        <button
          v-for="style in [
            { id: 'simple', label: 'Solid' },
            { id: 'dashed', label: 'Dashed' },
            { id: 'dotted', label: 'Dotted' },
            { id: 'double', label: 'Double' },
            { id: 'pill', label: 'Pill' },
          ]"
          :key="style.id"
          class="option-btn"
          :class="{ active: variables.hrStyle === style.id }"
          @click="updateVariable('hrStyle', style.id)"
        >
          {{ t(`designer.options.hrStyle.${style.id}`) }}
        </button>
      </div>
    </div>
    <div class="designer-field">
      <label>{{ t('designer.fields.color') }}</label>
      <ColorSelector
        :value="variables.hrColor"
        :presets="['#eee', '#ddd', '#ccc', variables.primaryColor]"
        @change="updateVariable('hrColor', $event)"
      />
    </div>
    <div class="designer-field">
      <label>{{ t('designer.fields.height') }}: {{ variables.hrHeight }}px</label>
      <input
        type="range"
        class="designer-slider"
        :min="1"
        :max="4"
        :value="variables.hrHeight"
        @input="
          updateVariable('hrHeight', Number(($event.target as HTMLInputElement).value))
        "
      />
    </div>
    <div class="designer-field">
      <label>{{ t('designer.fields.margin') }}: {{ variables.hrMargin }}px</label>
      <input
        type="range"
        class="designer-slider"
        :min="10"
        :max="60"
        :step="5"
        :value="variables.hrMargin"
        @input="
          updateVariable('hrMargin', Number(($event.target as HTMLInputElement).value))
        "
      />
    </div>
  </div>
</template>
