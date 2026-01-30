<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { Cloud, Zap, ShieldCheck, Image as ImageIcon } from 'lucide-vue-next';
import type { ImageHostConfig } from '../../services/image/ImageUploader';
import { useI18n } from '../../i18n';

const { t } = useI18n();


interface AllConfigs {
  currentType: ImageHostConfig['type'];
  configs: {
    official?: any;
    qiniu?: any;
    aliyun?: any;
    tencent?: any;
    s3?: any;
  };
}

const allConfigs = reactive<AllConfigs>((() => {
  const saved = localStorage.getItem('imageHostConfigs');
  return saved ? JSON.parse(saved) : { currentType: 'official', configs: {} };
})());

// Currently viewed tab (not necessarily active host) / 当前查看的标签页（不等于激活的图床）
const viewingType = ref<ImageHostConfig['type']>(allConfigs.currentType);
const testResult = ref<string | null>(null);
const isValidating = ref(false);

// Currently active image host type / 当前激活的图床类型
const activeType = computed(() => allConfigs.currentType);

// Currently viewed configuration / 当前查看的配置
const viewingConfig = computed((): ImageHostConfig => ({
  type: viewingType.value,
  config: allConfigs.configs[viewingType.value] || {}
}));

watch(() => allConfigs, (newConfigs) => {
  // Save all configurations / 保存所有配置
  localStorage.setItem('imageHostConfigs', JSON.stringify(newConfigs));
  // Also save current config to old key for compatibility / 同时保存当前配置到旧的 key，保持兼容性
  const currentConfig = { 
    type: newConfigs.currentType, 
    config: newConfigs.configs[newConfigs.currentType] 
  };
  localStorage.setItem('imageHostConfig', JSON.stringify(currentConfig));
}, { deep: true });

// Switch viewed tab (does not change active status) / 切换查看的标签页（不改变激活状态）
const handleTabChange = (type: ImageHostConfig['type']) => {
  viewingType.value = type;
  testResult.value = null;
};

// Activate an image host / 激活某个图床
const handleActivate = async (type: ImageHostConfig['type']) => {
  // Official host needs no validation, activate directly / 官方图床无需验证，直接激活
  if (type === 'official') {
    allConfigs.currentType = type;
    return;
  }

  isValidating.value = true;
  testResult.value = t('imageHost.status.validating');

  // Call ImageHostManager to validate configuration / 调用 ImageHostManager 验证配置
  try {
    const { ImageHostManager } = await import('../../services/image/ImageUploader');
    // Construct temporary config object for validation / 构造临时的配置对象用于验证
    const configToTest: ImageHostConfig = {
      type: type,
      config: allConfigs.configs[type]
    };

    const manager = new ImageHostManager(configToTest);
    const valid = await manager.validate();

    if (valid) {
      allConfigs.currentType = type;
      testResult.value = null; // Clear previous error message on successful switch / 成功切换清除之前的错误信息
    } else {
      testResult.value = t('imageHost.status.connectFailed');
      // Automatically trigger detailed test to show specific error / 自动触发一次详细测试以显示具体错误
      await testConnection();
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    testResult.value = t('imageHost.status.error').replace('{message}', message);
  } finally {
    isValidating.value = false;
  }
};

const handleConfigChange = (key: string, value: any) => {
  if (!allConfigs.configs[viewingType.value]) {
    allConfigs.configs[viewingType.value] = {};
  }
  allConfigs.configs[viewingType.value][key] = value;
};

const testConnection = async () => {
  testResult.value = t('imageHost.status.testing');
  try {
    const { ImageHostManager } = await import('../../services/image/ImageUploader');
    const manager = new ImageHostManager(viewingConfig.value);
    const valid = await manager.validate();
    testResult.value = valid ? t('imageHost.status.testPassed') : t('imageHost.status.testFailed');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    testResult.value = `❌ ${message}`;
  }
};

const getDisplayName = (type: ImageHostConfig['type']) => {
  return t(`imageHost.tabs.${type}`);
};
</script>

<template>
  <div class="image-host-settings">
    <!-- Top Tabs / 顶部选项卡 -->
    <div class="host-tabs">
      <button
        v-for="type in (['official', 'qiniu', 'aliyun', 'tencent', 's3'] as const)"
        :key="type"
        :class="['host-tab', viewingType === type ? 'active' : '']"
        @click="handleTabChange(type)"
      >
        {{ getDisplayName(type).replace(t('modal.imageHost'), '') }}
        <span v-if="activeType === type" class="tab-active-badge">{{ t('imageHost.status.using') }}</span>
      </button>
    </div>

    <!-- Config Form / 配置表单 -->
    <div class="host-config-panel">
      <!-- Official Host / 官方图床 -->
      <div v-if="viewingType === 'official'" class="official-host-intro">
        <div class="intro-header">
          <div class="intro-icon-wrapper">
            <Cloud :size="48" :stroke-width="1.5" class="primary-icon" />
          </div>
          <h3>{{ t('imageHost.official.title') }}</h3>
          <p>{{ t('imageHost.official.desc') }}</p>
        </div>

        <div class="feature-grid">
          <div class="feature-item">
            <div class="feature-icon"><Zap :size="20" /></div>
            <div class="feature-text">
              <strong>{{ t('imageHost.official.feature1Title') }}</strong>
              <span>{{ t('imageHost.official.feature1Desc') }}</span>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon"><ShieldCheck :size="20" /></div>
            <div class="feature-text">
              <strong>{{ t('imageHost.official.feature2Title') }}</strong>
              <span>{{ t('imageHost.official.feature2Desc') }}</span>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon"><ImageIcon :size="20" /></div>
            <div class="feature-text">
              <strong>{{ t('imageHost.official.feature3Title') }}</strong>
              <span>{{ t('imageHost.official.feature3Desc') }}</span>
            </div>
          </div>
        </div>

        <div v-if="activeType === 'official'" class="active-status">
          <span class="pulsing-dot"></span>
          <span>{{ t('imageHost.status.activeStatus') }}</span>
        </div>
        <button v-else class="btn-activate" @click="handleActivate('official')">
          {{ t('imageHost.status.activate', { name: t('imageHost.tabs.official') }) }}
        </button>
      </div>

      <!-- Qiniu Cloud / 七牛云 -->
      <div v-else-if="viewingType === 'qiniu'" class="host-config">
        <div v-if="activeType === 'qiniu'" class="active-status">
          <span class="pulsing-dot"></span>
          <span>{{ t('imageHost.status.using') }}</span>
        </div>
        <div class="config-field">
          <label>{{ t('imageHost.qiniu.accessKey') }}</label>
          <input
            type="text"
            :placeholder="t('imageHost.qiniu.placeholder')"
            :value="allConfigs.configs.qiniu?.accessKey || ''"
            @input="handleConfigChange('accessKey', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <div class="config-field">
          <label>{{ t('imageHost.qiniu.secretKey') }}</label>
          <input
            type="password"
            :placeholder="t('imageHost.qiniu.placeholder')"
            :value="allConfigs.configs.qiniu?.secretKey || ''"
            @input="handleConfigChange('secretKey', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <div class="config-field">
          <label>{{ t('imageHost.qiniu.bucket') }}</label>
          <input
            type="text"
            placeholder="your-bucket"
            :value="allConfigs.configs.qiniu?.bucket || ''"
            @input="handleConfigChange('bucket', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <div class="config-field">
          <label>{{ t('imageHost.qiniu.region') }}</label>
          <select
            :value="allConfigs.configs.qiniu?.region || 'z0'"
            @change="handleConfigChange('region', ($event.target as HTMLSelectElement).value)"
            class="config-select"
          >
            <option value="z0">{{ t('imageHost.qiniu.regionOptions.z0') }}</option>
            <option value="cn-east-2">{{ t('imageHost.qiniu.regionOptions.cn_east_2') }}</option>
            <option value="z1">{{ t('imageHost.qiniu.regionOptions.z1') }}</option>
            <option value="z2">{{ t('imageHost.qiniu.regionOptions.z2') }}</option>
            <option value="na0">{{ t('imageHost.qiniu.regionOptions.na0') }}</option>
            <option value="as0">{{ t('imageHost.qiniu.regionOptions.as0') }}</option>
            <option value="ap-northeast-1">{{ t('imageHost.qiniu.regionOptions.ap_northeast_1') }}</option>
          </select>
        </div>
        <div class="config-field">
          <label>{{ t('imageHost.qiniu.domain') }}</label>
          <input
            type="text"
            :placeholder="t('imageHost.qiniu.domainPlaceholder')"
            :value="allConfigs.configs.qiniu?.domain || ''"
            @input="handleConfigChange('domain', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <div class="config-footer">
          <small>
            <a href="https://portal.qiniu.com/kodo/bucket" target="_blank">{{ t('imageHost.common.console', { name: t('imageHost.tabs.qiniu') }) }}</a>
          </small>
          <div v-if="testResult" class="test-result">{{ testResult }}</div>
          <button @click="testConnection">{{ t('imageHost.common.testConnection') }}</button>
        </div>
        <button v-if="activeType !== 'qiniu'" class="btn-activate" :disabled="isValidating" @click="handleActivate('qiniu')">
          {{ isValidating ? t('imageHost.status.validating') : t('imageHost.status.activate', { name: t('imageHost.tabs.qiniu') }) }}
        </button>
      </div>

      <!-- Aliyun OSS / 阿里云 OSS -->
      <div v-else-if="viewingType === 'aliyun'" class="host-config">
        <div v-if="activeType === 'aliyun'" class="active-status">
          <span class="pulsing-dot"></span>
          <span>{{ t('imageHost.status.using') }}</span>
        </div>
        <div class="config-field">
          <label>{{ t('imageHost.aliyun.accessKeyId') }}</label>
          <input
            type="text"
            :placeholder="t('imageHost.aliyun.placeholder')"
            :value="allConfigs.configs.aliyun?.accessKeyId || ''"
            @input="handleConfigChange('accessKeyId', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <div class="config-field">
          <label>{{ t('imageHost.aliyun.accessKeySecret') }}</label>
          <input
            type="password"
            :placeholder="t('imageHost.aliyun.placeholder')"
            :value="allConfigs.configs.aliyun?.accessKeySecret || ''"
            @input="handleConfigChange('accessKeySecret', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <div class="config-field">
          <label>{{ t('imageHost.aliyun.bucket') }}</label>
          <input
            type="text"
            placeholder="your-bucket"
            :value="allConfigs.configs.aliyun?.bucket || ''"
            @input="handleConfigChange('bucket', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <div class="config-field">
          <label>{{ t('imageHost.aliyun.region') }}</label>
          <input
            type="text"
            placeholder="oss-cn-hangzhou"
            :value="allConfigs.configs.aliyun?.region || ''"
            @input="handleConfigChange('region', ($event.target as HTMLInputElement).value)"
          />
          <small>{{ t('imageHost.aliyun.regionHint') }}</small>
        </div>
        <div class="config-field">
          <label>{{ t('imageHost.aliyun.endpoint') }}</label>
          <input
            type="text"
            placeholder="https://cdn.example.com"
            :value="allConfigs.configs.aliyun?.endpoint || ''"
            @input="handleConfigChange('endpoint', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <div class="config-footer">
          <small>
            <a href="https://oss.console.aliyun.com/bucket" target="_blank">{{ t('imageHost.common.console', { name: t('imageHost.tabs.aliyun') }) }}</a>
          </small>
          <div v-if="testResult" class="test-result">{{ testResult }}</div>
          <button @click="testConnection">{{ t('imageHost.common.testConnection') }}</button>
        </div>
        <button v-if="activeType !== 'aliyun'" class="btn-activate" :disabled="isValidating" @click="handleActivate('aliyun')">
          {{ isValidating ? t('imageHost.status.validating') : t('imageHost.status.activate', { name: t('imageHost.tabs.aliyun') }) }}
        </button>
      </div>

      <!-- Tencent Cloud COS / 腾讯云 COS -->
      <div v-else-if="viewingType === 'tencent'" class="host-config">
        <div v-if="activeType === 'tencent'" class="active-status">
          <span class="pulsing-dot"></span>
          <span>{{ t('imageHost.status.using') }}</span>
        </div>
        <div class="config-field">
          <label>{{ t('imageHost.tencent.secretId') }}</label>
          <input
            type="text"
            :placeholder="t('imageHost.tencent.placeholder')"
            :value="allConfigs.configs.tencent?.secretId || ''"
            @input="handleConfigChange('secretId', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <div class="config-field">
          <label>{{ t('imageHost.tencent.secretKey') }}</label>
          <input
            type="password"
            :placeholder="t('imageHost.tencent.placeholder')"
            :value="allConfigs.configs.tencent?.secretKey || ''"
            @input="handleConfigChange('secretKey', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <div class="config-field">
          <label>{{ t('imageHost.tencent.bucket') }}</label>
          <input
            type="text"
            placeholder="your-bucket-1234567890"
            :value="allConfigs.configs.tencent?.bucket || ''"
            @input="handleConfigChange('bucket', ($event.target as HTMLInputElement).value)"
          />
          <small>{{ t('imageHost.tencent.bucketHint') }}</small>
        </div>
        <div class="config-field">
          <label>{{ t('imageHost.tencent.region') }}</label>
          <input
            type="text"
            placeholder="ap-guangzhou"
            :value="allConfigs.configs.tencent?.region || ''"
            @input="handleConfigChange('region', ($event.target as HTMLInputElement).value)"
          />
          <small>{{ t('imageHost.tencent.regionHint') }}</small>
        </div>
        <div class="config-footer">
          <small>
            <a href="https://console.cloud.tencent.com/cos/bucket" target="_blank">{{ t('imageHost.common.console', { name: t('imageHost.tabs.tencent') }) }}</a>
          </small>
          <div v-if="testResult" class="test-result">{{ testResult }}</div>
          <button @click="testConnection">{{ t('imageHost.common.testConnection') }}</button>
        </div>
        <button v-if="activeType !== 'tencent'" class="btn-activate" :disabled="isValidating" @click="handleActivate('tencent')">
          {{ isValidating ? t('imageHost.status.validating') : t('imageHost.status.activate', { name: t('imageHost.tabs.tencent') }) }}
        </button>
      </div>

      <!-- S3 Compatible / S3 兼容 -->
      <div v-else-if="viewingType === 's3'" class="host-config">
        <div v-if="activeType === 's3'" class="active-status">
          <span class="pulsing-dot"></span>
          <span>{{ t('imageHost.status.using') }}</span>
        </div>
        <div class="config-field">
          <label>{{ t('imageHost.s3.endpoint') }}</label>
          <input
            type="text"
            placeholder="https://s3.amazonaws.com"
            :value="allConfigs.configs.s3?.endpoint || ''"
            @input="handleConfigChange('endpoint', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <div class="config-field">
          <label>{{ t('imageHost.s3.region') }}</label>
          <input
            type="text"
            placeholder="us-east-1"
            :value="allConfigs.configs.s3?.region || ''"
            @input="handleConfigChange('region', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <div class="config-field">
          <label>{{ t('imageHost.s3.accessKeyId') }}</label>
          <input
            type="text"
            :placeholder="t('imageHost.s3.accessKeyId')"
            :value="allConfigs.configs.s3?.accessKeyId || ''"
            @input="handleConfigChange('accessKeyId', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <div class="config-field">
          <label>{{ t('imageHost.s3.secretAccessKey') }}</label>
          <input
            type="password"
            :placeholder="t('imageHost.s3.secretAccessKey')"
            :value="allConfigs.configs.s3?.secretAccessKey || ''"
            @input="handleConfigChange('secretAccessKey', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <div class="config-field">
          <label>{{ t('imageHost.s3.bucket') }}</label>
          <input
            type="text"
            placeholder="your-bucket"
            :value="allConfigs.configs.s3?.bucket || ''"
            @input="handleConfigChange('bucket', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <div class="config-field">
          <label>{{ t('imageHost.s3.customDomain') }}</label>
          <input
            type="text"
            placeholder="https://cdn.example.com"
            :value="allConfigs.configs.s3?.customDomain || ''"
            @input="handleConfigChange('customDomain', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <div class="config-footer">
          <div v-if="testResult" class="test-result">{{ testResult }}</div>
          <button @click="testConnection">{{ t('imageHost.common.testConnection') }}</button>
        </div>
        <button v-if="activeType !== 's3'" class="btn-activate" :disabled="isValidating" @click="handleActivate('s3')">
          {{ isValidating ? t('imageHost.status.validating') : t('imageHost.status.activate', { name: t('imageHost.tabs.s3') }) }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @import './ImageHostSettings.css';
.config-select {
  width: 100%;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid var(--border-light);
  font-size: 14px;
  color: var(--text-primary);
  background-color: var(--bg-primary);
}
</style>
