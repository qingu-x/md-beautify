<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
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

const emit = defineEmits<{
  (e: "insert", prefix: string, suffix: string, placeholder: string): void;
}>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const linkToFootnote = ref(localStorage.getItem("wemd-link-to-footnote") === "true");

const showMermaidMenu = ref(false);
const showMermaidMore = ref(false);
const mermaidMenuRef = ref<HTMLElement | null>(null);
const mermaidMoreRef = ref<HTMLElement | null>(null);
const mermaidSubmenuSide = ref<"left" | "right">("right");

const mermaidPrimaryTemplates = [
  {
    icon: Workflow,
    label: "流程图",
    code: `graph TD
    A[开始] --> B{判断}
    B -- 是 --> C[执行操作]
    B -- 否 --> D[结束]
    C --> D`,
  },
  {
    icon: Clock,
    label: "时序图",
    code: `sequenceDiagram
    participant Alice
    participant Bob
    Alice->>Bob: Hello Bob, how are you?
    Bob-->>Alice: I am good thanks!
    Bob->>John: Hello John!`,
  },
  {
    icon: Network,
    label: "类图",
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
    label: "甘特图",
    code: `gantt
    title 项目开发计划
    dateFormat  YYYY-MM-DD
    section 设计
    需求分析       :a1, 2024-01-01, 3d
    原型设计       :after a1, 5d
    section 开发
    前端开发       :2024-01-10, 10d
    后端开发       :2024-01-10, 10d`,
  },
  {
    icon: Binary,
    label: "思维导图",
    code: `mindmap
  root((思维导图))
    主题一
      子节点 A
      子节点 B
    主题二
      子节点 C`,
  },
  {
    icon: PieChart,
    label: "饼图",
    code: `pie title 市场份额
    "产品 A" : 40
    "产品 B" : 30
    "产品 C" : 20
    "其他" : 10`,
  },
];

const mermaidMoreTemplates = [
  {
    icon: Activity,
    label: "状态图",
    code: `stateDiagram-v2
    [*] --> 空闲
    空闲 --> 处理中: 触发
    处理中 --> 完成: 成功
    处理中 --> 失败: 异常
    失败 --> 空闲
    完成 --> [*]`,
  },
  {
    icon: Database,
    label: "ER 图",
    code: `erDiagram
    USER ||--o{ ORDER : places
    USER {
        int id
        string name
    }
    ORDER {
        int id
        string status
    }`,
  },
  {
    icon: Calendar,
    label: "时间线",
    code: `timeline
    title 项目里程碑
    2024-01-01 : 立项
    2024-02-15 : 原型完成
    2024-03-20 : 开发完成
    2024-04-01 : 上线`,
  },
  {
    icon: Route,
    label: "用户旅程",
    code: `journey
    title 用户旅程
    section 认知
      了解产品: 5: 用户
    section 转化
      试用: 4: 用户
      购买: 3: 用户`,
  },
];

// 同步状态到全局变量和 localStorage
watch(linkToFootnote, (newVal: boolean) => {
  setLinkToFootnoteEnabled(newVal);
  localStorage.setItem("wemd-link-to-footnote", String(newVal));
}, { immediate: true });

const tools = [
  {
    icon: Bold,
    label: "粗体",
    prefix: "**",
    suffix: "**",
    placeholder: "粗体文字",
  },
  {
    icon: Italic,
    label: "斜体",
    prefix: "*",
    suffix: "*",
    placeholder: "斜体文字",
  },
  {
    icon: Strikethrough,
    label: "删除线",
    prefix: "~~",
    suffix: "~~",
    placeholder: "删除文字",
  },
  {
    icon: Heading1,
    label: "一级标题",
    prefix: "# ",
    suffix: "",
    placeholder: "标题",
  },
  {
    icon: Heading2,
    label: "二级标题",
    prefix: "## ",
    suffix: "",
    placeholder: "标题",
  },
  {
    icon: Heading3,
    label: "三级标题",
    prefix: "### ",
    suffix: "",
    placeholder: "标题",
  },
  {
    icon: List,
    label: "无序列表",
    prefix: "- ",
    suffix: "",
    placeholder: "列表项",
  },
  {
    icon: ListOrdered,
    label: "有序列表",
    prefix: "1. ",
    suffix: "",
    placeholder: "列表项",
  },
  {
    icon: Quote,
    label: "引用",
    prefix: "> ",
    suffix: "",
    placeholder: "引用文字",
  },
  {
    icon: Code,
    label: "代码块",
    prefix: "```\n",
    suffix: "\n```",
    placeholder: "代码",
  },
  {
    icon: Link,
    label: "链接",
    prefix: "[",
    suffix: "](url)",
    placeholder: "链接文字",
  },
  {
    icon: Minus,
    label: "分割线",
    prefix: "\n---\n",
    suffix: "",
    placeholder: "",
  },
];

const handleImageClick = () => {
  fileInputRef.value?.click();
};

const handleFileChange = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  // 验证文件类型
  if (!file.type.startsWith("image/")) {
    toast.error("请选择图片文件");
    return;
  }

  // 验证文件大小（最大 2MB，微信公众号限制）
  if (file.size > 2 * 1024 * 1024) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    toast.error(`请压缩图片后再试，公众号不支持超过 2MB 的图片外链(当前 ${sizeMB}MB)`);
    return;
  }

  uploading.value = true;
  try {
    // 获取图床配置
    const configStr = localStorage.getItem("imageHostConfig");
    const config: ImageHostConfig = configStr
      ? JSON.parse(configStr)
      : { type: "official" };

    // 上传图片
    const manager = new ImageHostManager(config);
    const url = await manager.upload(file);

    // 插入 Markdown
    emit("insert", "![", `](${url})`, file.name.replace(/\.[^/.]+$/, ""));
    toast.success("图片上传成功");
  } catch (error: any) {
    console.error("图片上传失败:", error);
    toast.error(error instanceof Error ? error.message : "图片上传失败");
  } finally {
    uploading.value = false;
    // 清空 input，允许重复上传同一文件
    if (fileInputRef.value) {
      fileInputRef.value.value = "";
    }
  }
};

const toggleLinkToFootnote = () => {
  const next = !linkToFootnote.value;
  linkToFootnote.value = next;
  toast.success(next ? "已开启：外链转脚注" : "已关闭：外链转脚注", 2000);
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

    <!-- Mermaid 下拉菜单 -->
    <div class="md-toolbar-dropdown-container" ref="mermaidMenuRef">
      <button
        class="md-toolbar-btn"
        :class="{ active: showMermaidMenu }"
        @click="toggleMermaidMenu"
        data-tooltip="插入图表"
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
            <span>查看更多</span>
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

    <!-- 图片上传按钮 -->
    <button
      class="md-toolbar-btn"
      @click="handleImageClick"
      :disabled="uploading"
      data-tooltip="上传图片"
    >
      <Loader2 v-if="uploading" :size="16" class="spinning" />
      <Image v-else :size="16" />
    </button>

    <!-- 分隔符 -->
    <div class="md-toolbar-divider" />

    <!-- 外链转脚注开关 -->
    <button
      class="md-toolbar-btn md-toolbar-toggle"
      :class="{ active: linkToFootnote }"
      @click="toggleLinkToFootnote"
      :data-tooltip="linkToFootnote ? '外链转脚注：开启' : '外链转脚注：关闭'"
    >
      <ListEnd :size="16" />
    </button>

    <!-- 隐藏的文件输入 -->
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
