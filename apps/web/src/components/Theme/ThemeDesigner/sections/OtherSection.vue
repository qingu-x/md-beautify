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
    <!-- Link / 链接 -->
    <div class="designer-group-label">{{ t('designer.sections.link') }}</div>
    <div class="designer-field">
      <label>{{ t('designer.fields.linkColor') }}</label>
      <ColorSelector
        :value="variables.linkColor || variables.primaryColor"
        :presets="[variables.primaryColor, '#0070f3', '#0366d6', '#40a9ff']"
        @change="updateVariable('linkColor', $event)"
      />
    </div>
    <div class="designer-field-row">
      <span>{{ t('designer.fields.showUnderline') }}</span>
      <label class="designer-switch">
        <input
          type="checkbox"
          :checked="variables.linkUnderline"
          @change="
            updateVariable(
              'linkUnderline',
              ($event.target as HTMLInputElement).checked
            )
          "
        />
        <span class="switch-slider"></span>
      </label>
    </div>

    <!-- Text Style / 文本样式 -->
    <div class="designer-group-label mt-4">{{ t('designer.sections.textStyle') }}</div>
    <div class="designer-field">
      <label>{{ t('designer.fields.italicColor') }}</label>
      <ColorSelector
        :value="variables.italicColor"
        :presets="['inherit', variables.primaryColor, '#666', '#999']"
        @change="updateVariable('italicColor', $event)"
      />
    </div>
    <div class="designer-field">
      <label>{{ t('designer.fields.delColor') }}</label>
      <ColorSelector
        :value="variables.delColor"
        :presets="['#999', '#ccc', '#666', variables.primaryColor]"
        @change="updateVariable('delColor', $event)"
      />
    </div>
    <div class="designer-field">
      <label>{{ t('designer.fields.strongColor') }}</label>
      <ColorSelector
        :value="variables.strongColor || 'inherit'"
        :presets="['inherit', variables.primaryColor, '#333']"
        @change="updateVariable('strongColor', $event)"
      />
    </div>
    <div class="designer-row">
      <div class="designer-field half">
        <label>{{ t('designer.fields.markBackground') }}</label>
        <ColorSelector
          :value="variables.markBackground"
          :presets="['#fff5b1', '#ffe4e1', '#e6f7ff', '#f6ffed']"
          @change="updateVariable('markBackground', $event)"
        />
      </div>
      <div class="designer-field half">
        <label>{{ t('designer.fields.markColor') }}</label>
        <ColorSelector
          :value="variables.markColor"
          :presets="['inherit', '#333', variables.primaryColor]"
          @change="updateVariable('markColor', $event)"
        />
      </div>
    </div>

    <!-- Footnote / 脚注 -->
    <div class="designer-group-label mt-4">{{ t('designer.sections.footnote') }}</div>
    <div class="designer-field">
      <label>{{ t('designer.fields.footnoteColor') }}</label>
      <ColorSelector
        :value="variables.footnoteColor || variables.primaryColor"
        :presets="[
          {
            label: t('designer.options.color.followTheme'),
            value: '',
            displayColor: variables.primaryColor,
          },
          { label: t('designer.options.color.darkGray'), value: '#333333' },
          { label: t('designer.options.color.gray'), value: '#666666' },
          { label: t('designer.options.color.lightGray'), value: '#999999' },
        ]"
        @change="updateVariable('footnoteColor', $event)"
      />
    </div>
    <div class="designer-field">
      <label>{{ t('designer.fields.fontSize') }}</label>
      <div class="designer-options col-4">
        <button
          v-for="size in [11, 12, 13, 14]"
          :key="size"
          class="option-btn"
          :class="{ active: variables.footnoteFontSize === size }"
          @click="updateVariable('footnoteFontSize', size)"
        >
          {{ size }}
        </button>
      </div>
    </div>
    <div class="designer-field">
      <label>{{ t('designer.fields.footnoteHeader') }}</label>
      <input
        type="text"
        class="designer-input"
        :value="variables.footnoteHeader"
        @input="
          updateVariable(
            'footnoteHeader',
            ($event.target as HTMLInputElement).value
          )
        "
        :placeholder="t('designer.placeholders.footnoteHeader')"
      />
    </div>
    <div class="designer-field">
      <label>{{ t('designer.fields.headerColor') }}</label>
      <ColorSelector
        :value="variables.footnoteHeaderColor || variables.primaryColor"
        :presets="[variables.primaryColor]"
        @change="updateVariable('footnoteHeaderColor', $event)"
      />
    </div>
    <div class="designer-field">
      <label>{{ t('designer.fields.headerStyle') }}</label>
      <div class="designer-options col-5">
        <button
          v-for="style in [
            { id: 'simple', label: 'Simple' },
            { id: 'left-border', label: 'Vertical Line' },
            { id: 'bottom-border', label: 'Underline' },
            { id: 'background', label: 'Background' },
            { id: 'pill', label: 'Pill' },
          ]"
          :key="style.id"
          class="option-btn"
          :class="{ active: variables.footnoteHeaderStyle === style.id }"
          @click="updateVariable('footnoteHeaderStyle', style.id)"
        >
          {{ t(`designer.options.footnoteHeaderStyle.${style.id}`) }}
        </button>
      </div>
    </div>
  </div>
</template>
