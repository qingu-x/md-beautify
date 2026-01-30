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
    <div class="designer-field">
      <label>{{ t('designer.fields.margin') }}: {{ variables.imageMargin }}px</label>
      <input
        type="range"
        class="designer-slider"
        :min="0"
        :max="40"
        :step="4"
        :value="variables.imageMargin"
        @input="
          updateVariable(
            'imageMargin',
            Number(($event.target as HTMLInputElement).value)
          )
        "
      />
    </div>

    <div class="designer-field">
      <label>{{ t('designer.fields.borderRadius') }}: {{ variables.imageBorderRadius }}px</label>
      <input
        type="range"
        class="designer-slider"
        :min="0"
        :max="16"
        :value="variables.imageBorderRadius"
        @input="
          updateVariable(
            'imageBorderRadius',
            Number(($event.target as HTMLInputElement).value)
          )
        "
      />
    </div>

    <div class="designer-group-label mt-4">{{ t('designer.sections.imageCaption') }}</div>
    <div class="designer-field">
      <label>{{ t('designer.fields.textColor') }}</label>
      <ColorSelector
        :value="variables.imageCaptionColor"
        :presets="['#999', '#666', '#333', variables.primaryColor]"
        @change="updateVariable('imageCaptionColor', $event)"
      />
    </div>

    <div class="designer-field">
      <label>{{ t('designer.fields.fontSize') }}</label>
      <div class="designer-options col-4">
        <button
          v-for="size in [12, 13, 14, 15]"
          :key="size"
          class="option-btn"
          :class="{ active: variables.imageCaptionFontSize === size }"
          @click="updateVariable('imageCaptionFontSize', size)"
        >
          {{ size }}
        </button>
      </div>
    </div>

    <div class="designer-field">
      <label>{{ t('designer.fields.textAlign') }}</label>
      <div class="designer-options col-3">
        <button
          v-for="opt in [
            { id: 'left', label: 'Left' },
            { id: 'center', label: 'Center' },
            { id: 'right', label: 'Right' },
          ]"
          :key="opt.id"
          class="option-btn"
          :class="{ active: variables.imageCaptionTextAlign === opt.id }"
          @click="updateVariable('imageCaptionTextAlign', opt.id)"
        >
          {{ t(`common.align.${opt.id}`) }}
        </button>
      </div>
    </div>
  </div>
</template>
