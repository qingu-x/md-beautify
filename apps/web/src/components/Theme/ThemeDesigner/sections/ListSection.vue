<script setup lang="ts">
import { computed } from "vue";
import ColorSelector from "../ColorSelector.vue";
import {
  ulStyleOptions,
  olStyleOptions,
  fontSizeOptions,
} from "@/config/styleOptions";
import type { DesignerVariables } from "../types";
import { useI18n } from "../../../../i18n";

const { t } = useI18n();

const props = defineProps<{
  variables: DesignerVariables;
}>();

const emit = defineEmits<{
  (e: "change", updates: Partial<DesignerVariables>): void;
}>();

const listFontSizeOptions = computed(() => [
  { id: "inherit", label: t("designer.options.fontSize.inherit"), value: "inherit" },
  ...fontSizeOptions.map((opt) => ({
    id: opt.id,
    label: opt.id ? t(`designer.options.fontSize.${opt.id}`) : opt.label,
    value: opt.value,
  })),
]);

const updateVariable = <K extends keyof DesignerVariables>(
  key: K,
  value: DesignerVariables[K]
) => {
  emit("change", { [key]: value });
};
</script>

<template>
  <div class="designer-section">
    <div class="designer-row">
      <div class="designer-field half">
        <label>{{ t('designer.fields.listMarkerColorL1') }}</label>
        <ColorSelector
          :value="variables.listMarkerColor"
          :presets="[variables.primaryColor]"
          @change="updateVariable('listMarkerColor', $event)"
        />
      </div>
      <div class="designer-field half">
        <label>{{ t('designer.fields.listMarkerColorL2') }}</label>
        <ColorSelector
          :value="variables.listMarkerColorL2"
          :presets="[variables.primaryColor]"
          @change="updateVariable('listMarkerColorL2', $event)"
        />
      </div>
    </div>

    <div class="designer-field">
      <label>{{ t('designer.fields.listSpacing') }}: {{ variables.listSpacing }}px</label>
      <input
        type="range"
        class="designer-slider"
        :min="0"
        :max="20"
        :step="2"
        :value="variables.listSpacing"
        @input="
          updateVariable(
            'listSpacing',
            Number(($event.target as HTMLInputElement).value)
          )
        "
      />
    </div>

    <div class="designer-field mt-2">
      <label>{{ t('designer.fields.ulFontSize') }}</label>
      <div class="designer-options">
        <button
          v-for="opt in listFontSizeOptions"
          :key="opt.value"
          class="option-btn"
          :class="{ active: (variables.ulFontSize ?? 'inherit') === opt.value }"
          @click="updateVariable('ulFontSize', opt.value)"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>
    <div class="designer-field">
      <label>{{ t('designer.fields.olFontSize') }}</label>
      <div class="designer-options">
        <button
          v-for="opt in listFontSizeOptions"
          :key="opt.value"
          class="option-btn"
          :class="{ active: (variables.olFontSize ?? 'inherit') === opt.value }"
          @click="updateVariable('olFontSize', opt.value)"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <div class="designer-field">
      <label>{{ t('designer.fields.ulStyle') }}</label>
      <div class="level-group">
        <span class="level-tag">{{ t('common.level1') }}</span>
        <div class="designer-options">
          <button
            v-for="opt in ulStyleOptions"
            :key="opt.value"
            class="option-btn"
            :class="{ active: variables.ulStyle === opt.value }"
            @click="updateVariable('ulStyle', opt.value)"
          >
            {{ opt.id ? t(`designer.options.ulStyle.${opt.id}`) : opt.label }}
          </button>
        </div>
      </div>
      <div class="level-group mt-2">
        <span class="level-tag">{{ t('common.level2') }}</span>
        <div class="designer-options">
          <button
            v-for="opt in ulStyleOptions"
            :key="opt.value + 'L2'"
            class="option-btn"
            :class="{ active: variables.ulStyleL2 === opt.value }"
            @click="updateVariable('ulStyleL2', opt.value)"
          >
            {{ opt.id ? t(`designer.options.ulStyle.${opt.id}`) : opt.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="designer-field">
      <label>{{ t('designer.fields.olStyle') }}</label>
      <div class="level-group">
        <span class="level-tag">{{ t('common.level1') }}</span>
        <div class="designer-options">
          <button
            v-for="opt in olStyleOptions"
            :key="opt.value"
            class="option-btn"
            :class="{ active: variables.olStyle === opt.value }"
            @click="updateVariable('olStyle', opt.value)"
          >
            {{ opt.id ? t(`designer.options.olStyle.${opt.id}`) : opt.label.split(' ')[0] }}
          </button>
        </div>
      </div>
      <div class="level-group mt-2">
        <span class="level-tag">{{ t('common.level2') }}</span>
        <div class="designer-options">
          <button
            v-for="opt in olStyleOptions"
            :key="opt.value + 'L2'"
            class="option-btn"
            :class="{ active: variables.olStyleL2 === opt.value }"
            @click="updateVariable('olStyleL2', opt.value)"
          >
            {{ opt.id ? t(`designer.options.olStyle.${opt.id}`) : opt.label.split(' ')[0] }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
