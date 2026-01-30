<script setup lang="ts">
import ColorSelector from "../ColorSelector.vue";
import {
  fontFamilyOptions,
  fontSizeOptions,
  lineHeightOptions,
  primaryColorOptions,
  boldStyleOptions,
} from "@/config/styleOptions";
import type { DesignerVariables } from "../types";
import { useI18n } from "../../../../i18n";

const { t } = useI18n();

const props = defineProps<{
  variables: DesignerVariables;
}>();

const emit = defineEmits<{
  (e: "change", updates: Partial<DesignerVariables>): void;
  (e: "primary-color-change", color: string): void;
}>();

const updateVariable = <K extends keyof DesignerVariables>(
  key: K,
  value: DesignerVariables[K]
) => {
  emit("change", { [key]: value });
};

const handlePrimaryColorChange = (color: string) => {
  emit("primary-color-change", color);
};
</script>

<template>
  <div class="designer-section">
    <div class="designer-field">
      <label>{{ t('designer.fields.fontFamily') }}</label>
      <div class="designer-options">
        <button
          v-for="opt in fontFamilyOptions"
          :key="opt.value"
          class="option-btn"
          :class="{ active: variables.fontFamily === opt.value }"
          @click="updateVariable('fontFamily', opt.value)"
          :title="opt.id ? t(`designer.options.fontFamily.${opt.id}Desc`) : opt.desc"
        >
          {{ opt.id ? t(`designer.options.fontFamily.${opt.id}`) : opt.label }}
        </button>
      </div>
    </div>

    <div class="designer-field">
      <label>{{ t('designer.fields.fontSize') }}</label>
      <div class="designer-options">
        <button
          v-for="opt in fontSizeOptions"
          :key="opt.value"
          class="option-btn"
          :class="{ active: variables.fontSize === opt.value }"
          @click="updateVariable('fontSize', opt.value)"
          :title="opt.id ? t(`designer.options.fontSize.${opt.id}`) : opt.desc"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <div class="designer-field">
      <label>{{ t('designer.fields.lineHeight') }}</label>
      <div class="designer-options">
        <button
          v-for="opt in lineHeightOptions"
          :key="opt.value"
          class="option-btn"
          :class="{ active: variables.lineHeight === opt.value }"
          @click="updateVariable('lineHeight', opt.value)"
          :title="opt.id ? t(`designer.options.lineHeight.${opt.id}`) : opt.desc"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <div class="designer-field">
      <label>{{ t('designer.fields.paragraphPadding') }}: {{ variables.paragraphPadding ?? 0 }}px</label>
      <input
        type="range"
        class="designer-slider"
        :min="0"
        :max="20"
        :step="0.1"
        :value="variables.paragraphPadding ?? 0"
        @input="updateVariable('paragraphPadding', Number(($event.target as HTMLInputElement).value))"
      />
    </div>

    <div class="designer-field">
      <label>{{ t('designer.fields.pagePadding') }}: {{ variables.pagePadding }}px</label>
      <input
        type="range"
        class="designer-slider"
        :min="0"
        :max="48"
        :step="0.1"
        :value="variables.pagePadding || 0"
        @input="updateVariable('pagePadding', Number(($event.target as HTMLInputElement).value))"
      />
    </div>

    <div class="designer-field">
      <label>{{ t('designer.fields.globalLetterSpacing') }}: {{ variables.globalLetterSpacing ?? 0 }}px</label>
      <input
        type="range"
        class="designer-slider"
        :min="-2"
        :max="5"
        :step="0.1"
        :value="variables.globalLetterSpacing ?? 0"
        @input="updateVariable('globalLetterSpacing', Number(($event.target as HTMLInputElement).value))"
      />
    </div>

    <div class="designer-field">
      <label>{{ t('designer.fields.paragraphColor') }}</label>
      <ColorSelector
        :value="variables.paragraphColor"
        :presets="[
          { id: 'deepGray', label: t('designer.options.colorSelector.deepGray'), value: '#333333' },
          { id: 'pureBlack', label: t('designer.options.colorSelector.pureBlack'), value: '#000000' },
          { id: 'gray', label: t('designer.options.colorSelector.gray'), value: '#666666' },
        ]"
        @change="updateVariable('paragraphColor', $event)"
      />
    </div>

    <div class="designer-field">
      <label>{{ t('designer.fields.primaryColor') }}</label>
      <ColorSelector
        :value="variables.primaryColor"
        :presets="primaryColorOptions.map(opt => ({ ...opt, label: t(`designer.options.primaryColor.${opt.id}`) }))"
        @change="handlePrimaryColorChange"
      />
    </div>

    <div class="designer-field">
      <label>{{ t('designer.fields.strongStyle') }}</label>
      <div class="designer-options">
        <button
          v-for="opt in boldStyleOptions"
          :key="opt.id"
          class="option-btn"
          :class="{ active: variables.strongStyle === opt.id }"
          @click="updateVariable('strongStyle', opt.id)"
        >
          {{ t(`designer.options.boldStyle.${opt.id}`) }}
        </button>
      </div>
    </div>

    <div class="designer-field">
      <label>{{ t('designer.fields.strongColor') }}</label>
      <ColorSelector
        :value="variables.strongColor || 'inherit'"
        :presets="[
          { id: 'followPrimary', label: t('designer.options.colorSelector.followPrimary'), value: 'inherit' },
          { id: 'deepGray', label: t('designer.options.colorSelector.deepGray'), value: '#333333' },
          { id: 'pureBlack', label: t('designer.options.colorSelector.pureBlack'), value: '#000000' },
          variables.primaryColor,
        ]"
        @change="updateVariable('strongColor', $event)"
      />
    </div>
  </div>
</template>
