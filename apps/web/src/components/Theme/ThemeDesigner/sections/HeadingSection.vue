<script setup lang="ts">
import { ref } from "vue";
import ColorSelector from "../ColorSelector.vue";
import {
  headingSizePresets,
  marginPresets,
  headingStylePresets,
} from "@/config/styleOptions";
import type { DesignerVariables, HeadingLevel, HeadingStyle } from "../types";
import { useI18n } from "../../../../i18n";

const { t } = useI18n();

const props = defineProps<{
  variables: DesignerVariables;
  activeHeading: HeadingLevel;
}>();

const emit = defineEmits<{
  (e: "change", level: HeadingLevel, updates: Partial<HeadingStyle>): void;
  (e: "update:active-heading", level: HeadingLevel): void;
}>();

const headingTabs: { id: HeadingLevel; label: string }[] = [
  { id: "h1", label: "H1" },
  { id: "h2", label: "H2" },
  { id: "h3", label: "H3" },
  { id: "h4", label: "H4" },
];

const updateHeading = (level: HeadingLevel, style: Partial<HeadingStyle>) => {
  emit("change", level, style);
};
</script>

<template>
  <div class="designer-section">
    <div class="designer-subtabs">
      <button
        v-for="tab in headingTabs"
        :key="tab.id"
        class="subtab"
        :class="{ active: activeHeading === tab.id }"
        @click="$emit('update:active-heading', tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="designer-field">
      <div class="designer-field-header">
        <label>{{ t('designer.fields.stylePreset') }}</label>
        <div class="compact-switch">
          <span>{{ t('designer.fields.centered') }}</span>
          <label class="designer-switch">
            <input
              type="checkbox"
              :checked="variables[activeHeading].centered"
              @change="
                updateHeading(activeHeading, {
                  centered: ($event.target as HTMLInputElement).checked,
                })
              "
            />
            <span class="switch-slider"></span>
          </label>
        </div>
      </div>
      <div class="designer-options">
        <button
          class="option-btn"
          :class="{
            active:
              !variables[activeHeading].preset ||
              variables[activeHeading].preset === 'simple',
          }"
          @click="updateHeading(activeHeading, { preset: 'simple' })"
        >
          {{ t('designer.options.headingStyle.simple') }}
        </button>
        <template v-for="preset in headingStylePresets">
          <button
            v-if="preset.id !== 'simple'"
            :key="preset.id"
            class="option-btn"
            :class="{ active: variables[activeHeading].preset === preset.id }"
            @click="updateHeading(activeHeading, { preset: preset.id })"
          >
            {{ t(`designer.options.headingStyle.${preset.id}`) }}
          </button>
        </template>
      </div>
    </div>

    <div class="designer-field">
      <label>{{ t('designer.fields.fontSize') }}: {{ variables[activeHeading].fontSize }}px</label>
      <input
        type="range"
        class="designer-slider"
        :min="headingSizePresets[activeHeading].min"
        :max="headingSizePresets[activeHeading].max"
        :value="variables[activeHeading].fontSize"
        @input="
          updateHeading(activeHeading, {
            fontSize: Number(($event.target as HTMLInputElement).value),
          })
        "
      />
    </div>

    <div class="designer-field">
      <label>{{ t('designer.fields.fontWeight') }}</label>
      <div class="designer-options mini">
        <button
          class="option-btn"
          :class="{ active: variables[activeHeading].fontWeight !== 'normal' }"
          @click="updateHeading(activeHeading, { fontWeight: 'bold' })"
        >
          {{ t('designer.options.fontWeight.bold') }}
        </button>
        <button
          class="option-btn"
          :class="{ active: variables[activeHeading].fontWeight === 'normal' }"
          @click="updateHeading(activeHeading, { fontWeight: 'normal' })"
        >
          {{ t('designer.options.fontWeight.normal') }}
        </button>
      </div>
    </div>

    <div class="designer-field">
      <label>{{ t('designer.fields.letterSpacing') }}: {{ variables[activeHeading].letterSpacing }}px</label>
      <input
        type="range"
        class="designer-slider"
        :min="0"
        :max="10"
        step="0.5"
        :value="variables[activeHeading].letterSpacing"
        @input="
          updateHeading(activeHeading, {
            letterSpacing: Number(($event.target as HTMLInputElement).value),
          })
        "
      />
    </div>

    <div class="designer-field">
      <label>{{ t('designer.fields.textColor') }}</label>
      <ColorSelector
        :value="variables[activeHeading].color"
        :presets="['#000', '#333', '#666', variables.primaryColor]"
        @change="updateHeading(activeHeading, { color: $event })"
      />
    </div>

    <div class="designer-field">
      <label>{{ t('designer.fields.marginTop') }}: {{ variables[activeHeading].marginTop }}px</label>
      <input
        type="range"
        class="designer-slider"
        :min="marginPresets.min"
        :max="marginPresets.max"
        :step="marginPresets.step"
        :value="variables[activeHeading].marginTop"
        @input="
          updateHeading(activeHeading, {
            marginTop: Number(($event.target as HTMLInputElement).value),
          })
        "
      />
    </div>

    <div class="designer-field">
      <label>{{ t('designer.fields.marginBottom') }}: {{ variables[activeHeading].marginBottom }}px</label>
      <input
        type="range"
        class="designer-slider"
        :min="marginPresets.min"
        :max="marginPresets.max"
        :step="marginPresets.step"
        :value="variables[activeHeading].marginBottom"
        @input="
          updateHeading(activeHeading, {
            marginBottom: Number(($event.target as HTMLInputElement).value),
          })
        "
      />
    </div>
  </div>
</template>
