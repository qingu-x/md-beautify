<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from "vue";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  Minus,
  Loader2,
  ListEnd,
  Activity,
  Calendar,
  Database,
  Route,
  Workflow,
  GitGraph,
  Clock,
  Network,
  Binary,
  PieChart,
  ChevronRight,
  ChevronLeft,
} from "lucide-vue-next";
import { ImageHostManager } from "../../services/image/ImageUploader";
import type { ImageHostConfig } from "../../services/image/ImageUploader";
import { setLinkToFootnoteEnabled } from "./ToolbarState";
import { toast } from "../../hooks/useToast";
import { useI18n } from "../../i18n";

const { t } = useI18n();

const emit = defineEmits<{
  (e: "insert", prefix: string, suffix: string, placeholder: string): void;
}>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const linkToFootnote = ref(localStorage.getItem("mdb-link-to-footnote") === "true");

const showMermaidMenu = ref(false);
const showMermaidMore = ref(false);
const mermaidMenuRef = ref<HTMLElement | null>(null);
const mermaidMoreRef = ref<HTMLElement | null>(null);
const mermaidSubmenuSide = ref<"left" | "right">("right");

const mermaidPrimaryTemplates = computed(() => [
  {
    icon: Workflow,
    label: t("editor.mermaid.flow"),
    code: `graph TD
    A[${t("editor.mermaid.flowTemplate.start")}] --> B{${t("editor.mermaid.flowTemplate.decision")}}
    B -- ${t("editor.mermaid.flowTemplate.yes")} --> C[${t("editor.mermaid.flowTemplate.action")}]
    B -- ${t("editor.mermaid.flowTemplate.no")} --> D[${t("editor.mermaid.flowTemplate.end")}]
    C --> D`,
  },
  {
    icon: Clock,
    label: t("editor.mermaid.sequence"),
    code: `sequenceDiagram
    participant Alice
    participant Bob
    Alice->>Bob: Hello Bob, how are you?
    Bob-->>Alice: I am good thanks!
    Bob->>John: Hello John!`,
  },
  {
    icon: Network,
    label: t("editor.mermaid.class"),
    code: `classDiagram
    class Animal {
        +String name
        +void eat()
    }
    class Duck {
        +void swim()
    }
    Animal <|-- Duck`,
  },
  {
    icon: GitGraph,
    label: t("editor.mermaid.gantt"),
    code: `gantt
    title ${t("editor.mermaid.ganttTemplate.title")}
    dateFormat  YYYY-MM-DD
    section ${t("editor.mermaid.ganttTemplate.design")}
    ${t("editor.mermaid.ganttTemplate.analysis")}       :a1, 2024-01-01, 3d
    ${t("editor.mermaid.ganttTemplate.prototype")}       :after a1, 5d
    section ${t("editor.mermaid.ganttTemplate.dev")}
    ${t("editor.mermaid.ganttTemplate.frontend")}       :2024-01-10, 10d
    ${t("editor.mermaid.ganttTemplate.backend")}       :2024-01-10, 10d`,
  },
  {
    icon: Binary,
    label: t("editor.mermaid.mindmap"),
    code: `mindmap
  root((${t("editor.mermaid.mindmapTemplate.root")}))
    ${t("editor.mermaid.mindmapTemplate.topic1")}
      ${t("editor.mermaid.mindmapTemplate.subA")}
      ${t("editor.mermaid.mindmapTemplate.subB")}
    ${t("editor.mermaid.mindmapTemplate.topic2")}
      ${t("editor.mermaid.mindmapTemplate.subC")}`,
  },
  {
    icon: PieChart,
    label: t("editor.mermaid.pie"),
    code: `pie title ${t("editor.mermaid.pieTemplate.title")}
    "${t("editor.mermaid.pieTemplate.productA")}" : 40
    "${t("editor.mermaid.pieTemplate.productB")}" : 30
    "${t("editor.mermaid.pieTemplate.productC")}" : 20
    "${t("editor.mermaid.pieTemplate.others")}" : 10`,
  },
]);

const mermaidMoreTemplates = computed(() => [
  {
    icon: Activity,
    label: t("editor.mermaid.state"),
    code: `stateDiagram-v2
    [*] --> ${t("editor.mermaid.stateTemplate.idle")}
    ${t("editor.mermaid.stateTemplate.idle")} --> ${t("editor.mermaid.stateTemplate.processing")}: ${t("editor.mermaid.stateTemplate.trigger")}
    ${t("editor.mermaid.stateTemplate.processing")} --> ${t("editor.mermaid.stateTemplate.completed")}: ${t("editor.mermaid.stateTemplate.success")}
    ${t("editor.mermaid.stateTemplate.processing")} --> ${t("editor.mermaid.stateTemplate.failed")}: ${t("editor.mermaid.stateTemplate.exception")}
    ${t("editor.mermaid.stateTemplate.failed")} --> ${t("editor.mermaid.stateTemplate.idle")}
    ${t("editor.mermaid.stateTemplate.completed")} --> [*]`,
  },
  {
    icon: Database,
    label: t("editor.mermaid.er"),
    code: `erDiagram
    USER ||--o{ ORDER : places
    USER {
        int id
        string name
    }
    ORDER {
        int id
        string status
    } `,
  },
  {
    icon: Calendar,
    label: t("editor.mermaid.timeline"),
    code: `timeline
    title ${t("editor.mermaid.timelineTemplate.title")}
    2024-01-01 : ${t("editor.mermaid.timelineTemplate.start")}
    2024-02-15 : ${t("editor.mermaid.timelineTemplate.prototype")}
    2024-03-20 : ${t("editor.mermaid.timelineTemplate.dev")}
    2024-04-01 : ${t("editor.mermaid.timelineTemplate.launch")}`,
  },
  {
    icon: Route,
    label: t("editor.mermaid.journey"),
    code: `journey
    title ${t("editor.mermaid.journeyTemplate.title")}
    section ${t("editor.mermaid.journeyTemplate.awareness")}
      ${t("editor.mermaid.journeyTemplate.learn")}: 5: ${t("editor.mermaid.journeyTemplate.user")}
    section ${t("editor.mermaid.journeyTemplate.conversion")}
      ${t("editor.mermaid.journeyTemplate.trial")}: 4: ${t("editor.mermaid.journeyTemplate.user")}
      ${t("editor.mermaid.journeyTemplate.buy")}: 3: ${t("editor.mermaid.journeyTemplate.user")}`,
  },
]);

// Sync state to global variables and localStorage / 同步状态到全局变量和 localStorage
watch(linkToFootnote, (newVal: boolean) => {
  setLinkToFootnoteEnabled(newVal);
  localStorage.setItem("mdb-link-to-footnote", String(newVal));
}, { immediate: true });

const tools = computed(() => [
  {
    icon: Bold,
    label: t("editor.toolbar.bold"),
    prefix: "**",
    suffix: "**",
    placeholder: t("editor.toolbar.boldPlaceholder"),
  },
  {
    icon: Italic,
    label: t("editor.toolbar.italic"),
    prefix: "*",
    suffix: "*",
    placeholder: t("editor.toolbar.italicPlaceholder"),
  },
  {
    icon: Strikethrough,
    label: t("editor.toolbar.strikethrough"),
    prefix: "~~",
    suffix: "~~",
    placeholder: t("editor.toolbar.strikethroughPlaceholder"),
  },
  {
    icon: Heading1,
    label: t("editor.toolbar.h1"),
    prefix: "# ",
    suffix: "",
    placeholder: t("editor.toolbar.headingPlaceholder"),
  },
  {
    icon: Heading2,
    label: t("editor.toolbar.h2"),
    prefix: "## ",
    suffix: "",
    placeholder: t("editor.toolbar.headingPlaceholder"),
  },
  {
    icon: Heading3,
    label: t("editor.toolbar.h3"),
    prefix: "### ",
    suffix: "",
    placeholder: t("editor.toolbar.headingPlaceholder"),
  },
  {
    icon: List,
    label: t("editor.toolbar.list"),
    prefix: "- ",
    suffix: "",
    placeholder: t("editor.toolbar.listPlaceholder"),
  },
  {
    icon: ListOrdered,
    label: t("editor.toolbar.listOrdered"),
    prefix: "1. ",
    suffix: "",
    placeholder: t("editor.toolbar.listPlaceholder"),
  },
  {
    icon: Quote,
    label: t("editor.toolbar.quote"),
    prefix: "> ",
    suffix: "",
    placeholder: t("editor.toolbar.quotePlaceholder"),
  },
  {
    icon: Code,
    label: t("editor.toolbar.code"),
    prefix: "```\n",
    suffix: "\n```",
    placeholder: t("editor.toolbar.codePlaceholder"),
  },
  {
    icon: Link,
    label: t("editor.toolbar.link"),
    prefix: "[",
    suffix: "](url)",
    placeholder: t("editor.toolbar.linkPlaceholder"),
  },
  {
    icon: Minus,
    label: t("editor.toolbar.divider"),
    prefix: "\n---\n",
    suffix: "",
    placeholder: "",
  },
]);

const handleImageClick = () => {
  fileInputRef.value?.click();
};

const handleFileChange = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  // Verify file type / 验证文件类型
  if (!file.type.startsWith("image/")) {
    toast.error(t("editor.toolbar.imageTypeLimit"));
    return;
  }

  // Verify file size (max 2MB, WeChat Official Account limit) / 验证文件大小（最大 2MB，微信公众号限制）
  if (file.size > 2 * 1024 * 1024) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    toast.error(t("editor.imageUpload.sizeLimit", { size: sizeMB }));
    return;
  }

  uploading.value = true;
  try {
    // Get image host config / 获取图床配置
    const configStr = localStorage.getItem("imageHostConfig");
    const config: ImageHostConfig = configStr
      ? JSON.parse(configStr)
      : { type: "official" };

    // Upload image / 上传图片
    const manager = new ImageHostManager(config);
    const url = await manager.upload(file);

    // Insert Markdown / 插入 Markdown
    emit("insert", "![", `](${url})`, file.name.replace(/\.[^/.]+$/, ""));
    toast.success(t("editor.imageUpload.success"));
  } catch (error: any) {
    console.error("Image upload failed:", error);
    toast.error(
      error instanceof Error
        ? error.message
        : t("editor.imageUpload.error", { message: "" })
    );
  } finally {
    uploading.value = false;
    // Clear input to allow uploading the same file again / 清空 input，允许重复上传同一文件
    if (fileInputRef.value) {
      fileInputRef.value.value = "";
    }
  }
};

const toggleLinkToFootnote = () => {
  const next = !linkToFootnote.value;
  linkToFootnote.value = next;
  toast.success(
    next
      ? t("editor.toolbar.linkToFootnote.enabled")
      : t("editor.toolbar.linkToFootnote.disabled"),
    2000
  );
};

const handleMermaidInsert = (code: string) => {
  emit("insert", "```mermaid\n", "\n```", code);
  showMermaidMenu.value = false;
  showMermaidMore.value = false;
};

const toggleMermaidMenu = () => {
  showMermaidMenu.value = !showMermaidMenu.value;
  if (!showMermaidMenu.value) {
    showMermaidMore.value = false;
  }
};

const handleClickOutside = (event: MouseEvent) => {
  if (
    mermaidMenuRef.value &&
    !mermaidMenuRef.value.contains(event.target as Node)
  ) {
    showMermaidMenu.value = false;
    showMermaidMore.value = false;
  }
};

const updateSubmenuSide = () => {
  const container = mermaidMoreRef.value;
  if (!container) return;
  const rect = container.getBoundingClientRect();
  const spaceRight = window.innerWidth - rect.right;

  const isInRightHalf = rect.left > window.innerWidth / 2;
  const isTightSpace = spaceRight < 300;

  if (isInRightHalf || isTightSpace) {
    mermaidSubmenuSide.value = "left";
  } else {
    mermaidSubmenuSide.value = "right";
  }
};

watch(showMermaidMore, (newVal) => {
  if (newVal) {
    requestAnimationFrame(updateSubmenuSide);
    window.addEventListener("resize", updateSubmenuSide);
  } else {
    window.removeEventListener("resize", updateSubmenuSide);
  }
});

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside);
  window.removeEventListener("resize", updateSubmenuSide);
});
</script>

<template>
  <div class="md-toolbar">
    <button
      v-for="(tool, index) in tools"
      :key="index"
      class="md-toolbar-btn"
      @click="emit('insert', tool.prefix, tool.suffix, tool.placeholder)"
      :data-tooltip="tool.label"
    >
      <component :is="tool.icon" :size="16" />
    </button>

    <!-- Mermaid Dropdown / Mermaid 下拉菜单 -->
    <div class="md-toolbar-dropdown-container" ref="mermaidMenuRef">
      <button
        class="md-toolbar-btn"
        :class="{ active: showMermaidMenu }"
        @click="toggleMermaidMenu"
        :data-tooltip="t('editor.toolbar.insertChart')"
      >
        <Workflow :size="16" />
      </button>

      <div v-if="showMermaidMenu" class="md-toolbar-dropdown-menu">
        <button
          v-for="(template, idx) in mermaidPrimaryTemplates"
          :key="idx"
          class="md-toolbar-dropdown-item"
          @click="handleMermaidInsert(template.code)"
        >
          <component :is="template.icon" :size="14" class="mr-2" />
          <span>{{ template.label }}</span>
        </button>

        <div class="md-toolbar-dropdown-more" ref="mermaidMoreRef">
          <button
            type="button"
            class="md-toolbar-dropdown-item md-toolbar-dropdown-more-btn"
            :class="{ active: showMermaidMore }"
            @click="showMermaidMore = !showMermaidMore"
            :aria-expanded="showMermaidMore"
          >
            <span>{{ t('editor.toolbar.more') }}</span>
            <ChevronLeft
              v-if="mermaidSubmenuSide === 'left'"
              :size="12"
              class="md-toolbar-dropdown-chevron"
            />
            <ChevronRight
              v-else
              :size="12"
              class="md-toolbar-dropdown-chevron"
            />
          </button>


          <div
            v-if="showMermaidMore"
            class="md-toolbar-dropdown-submenu"
            :class="{ 'is-left': mermaidSubmenuSide === 'left' }"
          >
            <button
              v-for="(template, idx) in mermaidMoreTemplates"
              :key="idx"
              class="md-toolbar-dropdown-item"
              @click="handleMermaidInsert(template.code)"
            >
              <component :is="template.icon" :size="14" class="mr-2" />
              <span>{{ template.label }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Upload Button / 图片上传按钮 -->
    <button
      class="md-toolbar-btn"
      @click="handleImageClick"
      :disabled="uploading"
      :data-tooltip="t('editor.toolbar.uploadImage')"
    >
      <Loader2 v-if="uploading" :size="16" class="spinning" />
      <Image v-else :size="16" />
    </button>

    <!-- Divider / 分隔符 -->
    <div class="md-toolbar-divider" />

    <!-- Link to Footnote Toggle / 外链转脚注开关 -->
    <button
      class="md-toolbar-btn md-toolbar-toggle"
      :class="{ active: linkToFootnote }"
      @click="toggleLinkToFootnote"
      :data-tooltip="linkToFootnote ? t('editor.toolbar.linkToFootnote.enable') : t('editor.toolbar.linkToFootnote.disable')"
    >
      <ListEnd :size="16" />
    </button>

    <!-- Hidden File Input / 隐藏的文件输入 -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      @change="handleFileChange"
      style="display: none"
    />
  </div>
</template>

<style scoped>
@import "./Toolbar.css";
</style>
