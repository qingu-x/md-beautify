type DefaultMarkdownLocale = "zh" | "en";

const DEFAULT_MARKDOWN_MAP: Record<DefaultMarkdownLocale, string> = {
  zh: `# ✅ Markdown 全语法示例
本示例覆盖 **基础语法 + 扩展语法 + Mermaid 绘图**

---
## 一、基础文本样式
- \`**加粗文本**\` → **加粗文本**
- \`*斜体文本*\` → *斜体文本*
- \`***加粗斜体文本***\` → ***加粗斜体文本***
- \`~~删除线文本~~\` → ~~删除线文本~~
- \`==高亮文本==\` → ==高亮文本==
- \`H~2~O\` → H~2~O
- \`E=mc^2^\` → E=mc^2^
- \`<u>下划线文本</u>\` → <u>下划线文本</u>
- \`const a = 10;\` → \`const a = 10;\`

---
## 二、六级标题规范写法
规则：\`#\` 数量对应标题级别，**# 与文字之间需留空格**
# 一级标题（1 个 #）
## 二级标题（2 个 #）
### 三级标题（3 个 #）
#### 四级标题（4 个 #）
##### 五级标题（5 个 #）
###### 六级标题（6 个 #）

---
## 三、列表系列
### ✔ 无序列表
支持 \`-\` \`+\` \`*\` 三种符号，可自由嵌套，**符号与文字之间加空格**
- 无序列表项 1
- 无序列表项 2
  - 二级子列表项 2.1
    - 三级子列表项 2.1.1
+ 无序列表项 3（+ 号版）
* 无序列表项 4（* 号版）

### ✔ 有序列表
数字 + 英文句点，序号自动排序，支持嵌套，**句点与文字之间加空格**
1. 有序列表一级项 第一步
2. 有序列表一级项 第二步
    1. 二级子项 2.1
    2. 二级子项 2.2
3. 有序列表一级项 第三步

### ✔ 任务列表
核心语法：\`- [ ] 未完成\` / \`- [x] 已完成\`，空格不可省略
- [ ] 学习 Markdown 全语法
- [x] 掌握 Mermaid 绘图基础
- [ ] 整理语法速查表
- [x] 完成笔记编写

---
## 四、链接与图片
### ✔ 超链接 3 种写法
1. 行内式链接（最常用）：\`[链接文字](链接地址 "链接备注")\`
   [MD Beautify](https://github.com/qingu-x/md-beautify "Markdown 排版工具")
2. 参考式链接（适合多次引用同一链接）：先写 \`[链接文字][标记名]\`，文末定义标记
   [掘金][juejin] 、 [语雀][yuque]
3. 锚点链接（跳转本文档内指定位置）：\`[跳转文字](#标题锚点名)\`
   [快速跳转到 Mermaid 绘图章节](#十-mermaid-流程图-时序图-甘特图-等全示例)

[juejin]: https://juejin.cn
[yuque]: https://www.yuque.com

### ✔ 图片
语法：\`![图片描述](图片地址 "图片标题")\`，图片描述为必写（SEO/加载失败显示），标题鼠标悬浮显示
![Markdown 图标|200](https://cdn.jsdelivr.net/npm/simple-icons@9/icons/markdown.svg "Markdown Logo")

---
## 五、引用与提示块（全部类型，含多级嵌套）
### ✔ 多级嵌套引用
基础语法：\`>\` 开头，多一个 \`>\` 就是下一级引用，可无限嵌套，换行续写空行即可
> 一级引用 - Markdown 是轻量级标记语言，易读易写易转换
> > 二级引用 - 1994 年由 John Gruber 设计
> > > 三级引用 - 纯文本编写，兼容所有文本编辑器
> 回到一级引用

### ✔ 特殊提示块（扩展语法，全类型）
适配 Obsidian、VS Code、语雀、GitBook，语法统一：\`> [!类型] 标题\`

> [!TIP]
> 推荐用 Markdown 写技术文档/笔记，格式统一，跨平台兼容。

> [!NOTE] 普通备注
> 所有语法符号与内容之间加空格，是通用规范，避免格式失效。

> [!IMPORTANT] 重要信息
> 扩展语法在不同编辑器中支持度略有差异，优先用标准语法保证兼容性。

> [!WARNING] 警告提醒
> 不要混用中英文标点，所有语法符号均为英文标点。

> [!CAUTION] 注意事项
> 图片路径建议用相对路径，便于文档迁移和分享。

---
## 六、表格
### ✔ 基础表格
核心：表头与内容之间必须有分隔行 \`|----|----|\`，竖线可不完全对齐

| 姓名 | 岗位 | 工作年限 |
|------|------|----------|
| 张三 | 前端开发 | 5 年 |
| 李四 | 后端开发 | 8 年 |
| 王五 | UI 设计 | 3 年 |

### ✔ 带对齐方式的表格（重点）
语法：在分隔行用 \`:\` 控制对齐，**:\`左对齐\` / :\`居中对齐\`: / \`右对齐\`:**

| 左对齐文本 | 居中对齐文本 | 右对齐文本 |
| :---- | :----: | ----: |
| 内容 1 | 内容 2 | 内容 3 |
| 测试文本 A | 测试文本 B | 测试文本 C |

---
## 七、代码块
### ✔ 行内代码
语法：一对反引号包裹 \`\` \`代码内容\` \`\`
示例：调用 \`add(10, 20)\` 可得到两数之和

### ✔ 多行代码块
语法：**三个反引号 \`\`\`** 包裹，第一行可指定语言

\`\`\`javascript
function add(a, b) {
  return a + b;
}
console.log(add(2, 3));
\`\`\`

\`\`\`python
items = ["苹果", "香蕉", "橙子"]
for item in items:
    print(f"我喜欢吃：{item}")
\`\`\`

\`\`\`java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello Markdown");
    }
}
\`\`\`

---
## 八、分隔线 & 脚注
### ✔ 分隔线（3 种写法，效果一致）
单独一行书写，不与其他内容同行

---
***
___

### ✔ 脚注（扩展语法）
正文写 \`[^标记名]\`，文末写 \`[^标记名]: 脚注内容\`
Markdown 语法简洁易懂，适合快速编写技术文档[^1]，Mermaid 绘图语法可无缝嵌入 Markdown 文档[^2]。

[^1]: Markdown 适合快速记录与分享。
[^2]: Mermaid 可直接嵌入并跨平台渲染。

---
## 九、扩展高级语法（数学公式 + 定义列表）
### ✔ 数学公式（KaTeX/MathJax 支持）
行内公式：一对 \`$\` 包裹 → $a^2 + b^2 = c^2$ 、 $\\sum_{i=1}^n i = \\frac{n(n+1)}{2}$
块级公式：两对 \`$$\` 包裹，单独占行
$$
f(x) = \\frac{1}{\\sqrt{2\\pi}\\sigma} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}
$$

### ✔ 定义列表（扩展语法）
语法：\`名词\` 换行写 \`: 解释内容\`
Markdown
: 轻量级标记语言，专注「易读、易写、易转换」
Mermaid
: 基于文本的绘图工具，可在 Markdown 中直接编写流程图、时序图等

---
## 十、Mermaid 流程图/时序图/甘特图/等全示例
> Mermaid 是 Markdown 的主流扩展语法，用 \`\`\`mermaid 包裹绘图代码即可渲染

\`\`\`mermaid
graph LR
    A[开始] --> G[结束]
\`\`\`
### ✅ 1. Mermaid 基础流程图（横向）
\`\`\`mermaid
graph LR
    A[开始] --> B[输入参数]
    B --> C{参数是否合法?}
    C -- 是 --> D[执行业务逻辑]
    C -- 否 --> E[抛出异常提示]
    D --> F[返回处理结果]
    E --> F
    F --> G[结束]
\`\`\`

### ✅ 2. Mermaid 竖向流程图
\`\`\`mermaid
graph TD
    首页 --> 登录页面
    登录页面 --> 账号验证
    账号验证 -->|验证成功| 个人中心
    账号验证 -->|验证失败| 登录页面
    个人中心 --> 我的订单
    个人中心 --> 我的收藏
    我的订单 --> 订单详情
\`\`\`

### ✅ 3. Mermaid 时序图（接口交互）
展示「对象 - 时间 - 行为」的交互关系，适合接口文档与业务流程
\`\`\`mermaid
sequenceDiagram
    participant 前端页面 as Web
    participant 后端服务 as Server
    participant 数据库 as DB
    Web->>Server: 发送用户登录请求(账号+密码)
    Server->>DB: 查询用户信息
    DB-->>Server: 返回用户加密密码
    Server->>Server: 密码校验/Token 生成
    Server-->>Web: 返回登录结果(成功/失败+Token)
    Web->>Server: 携带 Token 请求个人信息
    Server-->>Web: 返回用户个人信息
\`\`\`

### ✅ 4. Mermaid 甘特图（项目排期）
\`\`\`mermaid
gantt
    title 项目开发甘特图
    dateFormat  YYYY-MM-DD
    section 需求阶段
    需求分析       :done, des1, 2026-01-01, 3d
    需求评审       :done, des2, after des1, 2d
    section 开发阶段
    前端开发       :active, dev1, 2026-01-06, 5d
    后端开发       :active, dev2, 2026-01-06, 6d
    接口联调       :         dev3, after dev1, 3d
    section 测试阶段
    功能测试       :         test1, after dev3, 4d
    上线部署       :         test2, after test1, 2d
\`\`\`

### ✅ 5. Mermaid 饼图（数据占比）
\`\`\`mermaid
pie
  title 网站流量来源占比
    "搜索引擎" : 65
    "直接访问" : 20
    "外链引流" : 10
    "社交媒体" : 5
\`\`\`

### ✅ 6. Mermaid 状态图（生命周期）
\`\`\`mermaid
stateDiagram-v2
    [*] --> 未支付
    未支付 --> 已支付 : 用户付款
    未支付 --> 已取消 : 用户取消订单
    已支付 --> 已发货 : 商家发货
    已发货 --> 已签收 : 用户收货
    已签收 --> [*] : 订单完成
    已支付 --> 退款中 : 用户申请退款
    退款中 --> 已退款 : 审核通过
    已退款 --> [*]
\`\`\`

\`\`\`mermaid
timeline
  title 主题时间线两档循环示例
  section 第一组
    2023 Q1 : 发布预览
    2023 Q2 : 优化性能
  section 第二组
    2023 Q3 : 增强主题变量
    2023 Q4 : 上线暗色模式
  section 第三组
    2024 Q1 : 重构 Mermaid 管线
    2024 Q2 : 增强可视化
  section 第四组
    2025 Q1 : 重构 Mermaid 管线
    2025 Q2 : 增强可视化
\`\`\`
`,
  en: `# ✅ Markdown Full Syntax Example
This sample covers **basic syntax + extensions + Mermaid diagrams**.

---
## 1. Text styles
- \`**Bold text**\` → **Bold text**
- \`*Italic text*\` → *Italic text*
- \`***Bold italic text***\` → ***Bold italic text***
- \`~~Strikethrough~~\` → ~~Strikethrough~~
- \`==Highlight==\` → ==Highlight==
- \`H~2~O\` → H~2~O
- \`E=mc^2^\` → E=mc^2^
- \`<u>Underlined text</u>\` → <u>Underlined text</u>
- \`const a = 10;\` → \`const a = 10;\`

---
## 2. Six heading levels
Rule: the count of \`#\` defines the level, **and there must be a space after \`#\`**.
# Heading 1 (1 #)
## Heading 2 (2 #)
### Heading 3 (3 #)
#### Heading 4 (4 #)
##### Heading 5 (5 #)
###### Heading 6 (6 #)

---
## 3. Lists
### ✔ Unordered list
Supports \`-\` \`+\` \`*\`. Leave a space after the symbol.
- Item 1
- Item 2
  - Nested item 2.1
    - Nested item 2.1.1
+ Item 3 (+)
* Item 4 (*)

### ✔ Ordered list
Numbers are auto-sorted and support nesting.
1. Step one
2. Step two
    1. Sub-step 2.1
    2. Sub-step 2.2
3. Step three

### ✔ Task list
Syntax: \`- [ ]\` or \`- [x]\`.
- [ ] Learn Markdown syntax
- [x] Master Mermaid basics
- [ ] Build a quick reference sheet
- [x] Finish the sample notes

---
## 4. Links and images
### ✔ Three link styles
1. Inline links: \`[text](url "title")\`
   [MD Beautify](https://github.com/qingu-x/md-beautify "Markdown layout tool")
2. Reference links: write \`[text][key]\`, define the key later
   [Juejin][juejin] 、 [Yuque][yuque]
3. Anchor links: \`[Jump](#heading-id)\`
   [Jump to Mermaid section](#10-mermaid-diagrams-flowchart-sequence-gantt-etc)

[juejin]: https://juejin.cn
[yuque]: https://www.yuque.com

### ✔ Image
Syntax: \`![alt text](url "title")\`
![Markdown Logo|200](https://cdn.jsdelivr.net/npm/simple-icons@9/icons/markdown.svg "Markdown Logo")

---
## 5. Blockquotes and callouts
### ✔ Nested blockquotes
Use \`>\` for nesting.
> Level 1 - Markdown is lightweight and portable
> > Level 2 - Designed by John Gruber in 1994
> > > Level 3 - Plain text, editor-friendly
> Back to level 1

### ✔ Callouts
Syntax: \`> [!TYPE] Title\` (Obsidian / VS Code / Yuque / GitBook compatible)

> [!TIP]
> Use Markdown to keep documentation consistent across tools.

> [!NOTE] Note
> Keep a space between symbols and text to avoid formatting issues.

> [!IMPORTANT] Important
> Extensions vary by editor; prefer standard syntax for compatibility.

> [!WARNING] Warning
> Use English punctuation for syntax symbols.

> [!CAUTION] Caution
> Prefer relative image paths for portability.

---
## 6. Tables
### ✔ Basic table
Header and body must be separated with \`|----|\`.

| Name | Role | Experience |
|------|------|-----------|
| Alice | Frontend | 5 yrs |
| Bob | Backend | 8 yrs |
| Carol | UI | 3 yrs |

### ✔ Aligned columns
Use \`:\` in the separator row.

| Left | Center | Right |
| :---- | :----: | ----: |
| Value 1 | Value 2 | Value 3 |
| Sample A | Sample B | Sample C |

---
## 7. Code
### ✔ Inline code
Wrap with backticks: \`\` \`code\` \`\`
Example: \`add(10, 20)\`

### ✔ Fenced code blocks
Use triple backticks, optional language tag.

\`\`\`javascript
function add(a, b) {
  return a + b;
}
console.log(add(2, 3));
\`\`\`

\`\`\`python
items = ["Apple", "Banana", "Orange"]
for item in items:
    print(f"I like {item}")
\`\`\`

\`\`\`java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello Markdown");
    }
}
\`\`\`

---
## 8. Horizontal rules & footnotes
### ✔ Horizontal rules
Write them on their own line.

---
***
___

### ✔ Footnotes
Use \`[^id]\` in text and define it later.
Markdown is concise and readable[^1], and Mermaid diagrams embed cleanly[^2].

[^1]: Markdown is great for quick notes and sharing.
[^2]: Mermaid renders across tools with plain text.

---
## 9. Advanced syntax (math + definition lists)
### ✔ Math formulas (KaTeX/MathJax)
Inline math: \`$\` ... \`$\` → $a^2 + b^2 = c^2$ 、 $\\sum_{i=1}^n i = \\frac{n(n+1)}{2}$
Block math: \`$$\` ... \`$$\`
$$
f(x) = \\frac{1}{\\sqrt{2\\pi}\\sigma} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}
$$

### ✔ Definition lists
Term on one line, description on next line with \`:\`
Markdown
: A lightweight markup language focused on readability.
Mermaid
: A text-based diagramming tool for flowcharts and sequences.

---
## 10. Mermaid diagrams (flowchart, sequence, gantt, etc.)
> Mermaid is a popular Markdown extension. Use \`\`\`mermaid to wrap diagram code.

\`\`\`mermaid
graph LR
    A[Start] --> G[End]
\`\`\`
### ✅ 1. Basic flowchart
\`\`\`mermaid
graph LR
    A[Start] --> B[Input]
    B --> C{Valid?}
    C -- Yes --> D[Process]
    C -- No --> E[Reject]
    D --> F[Return]
    E --> F
    F --> G[End]
\`\`\`

### ✅ 2. Vertical flowchart
\`\`\`mermaid
graph TD
    Home --> Login
    Login --> Auth
    Auth -->|Success| Dashboard
    Auth -->|Fail| Login
    Dashboard --> Orders
    Dashboard --> Favorites
    Orders --> Details
\`\`\`

### ✅ 3. Sequence diagram
Shows the interaction between participants.
\`\`\`mermaid
sequenceDiagram
    participant Client as Web
    participant Server as API
    participant DB as Database
    Client->>Server: Login request
    Server->>DB: Query user
    DB-->>Server: User hash
    Server->>Server: Verify + issue token
    Server-->>Client: Result (token)
    Client->>Server: Fetch profile with token
    Server-->>Client: User profile
\`\`\`

### ✅ 4. Gantt chart
\`\`\`mermaid
gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Planning
    Requirement analysis :done, a1, 2026-01-01, 3d
    Review              :done, a2, after a1, 2d
    section Development
    Frontend            :active, d1, 2026-01-06, 5d
    Backend             :active, d2, 2026-01-06, 6d
    Integration         :       d3, after d1, 3d
    section Testing
    QA                  :       t1, after d3, 4d
    Release             :       t2, after t1, 2d
\`\`\`

### ✅ 5. Pie chart
\`\`\`mermaid
pie
  title Traffic sources
    "Search" : 65
    "Direct" : 20
    "Referral" : 10
    "Social" : 5
\`\`\`

### ✅ 6. State diagram
\`\`\`mermaid
stateDiagram-v2
    [*] --> Pending
    Pending --> Paid : Payment
    Pending --> Cancelled : Cancel
    Paid --> Shipped : Ship
    Shipped --> Delivered : Deliver
    Delivered --> [*]
    Paid --> Refunding : Request refund
    Refunding --> Refunded : Approved
    Refunded --> [*]
\`\`\`

\`\`\`mermaid
timeline
  title Release Timeline
  section Phase 1
    2023 Q1 : Preview
    2023 Q2 : Optimize
  section Phase 2
    2023 Q3 : Theme variables
    2023 Q4 : Dark mode
  section Phase 3
    2024 Q1 : Mermaid pipeline
    2024 Q2 : Visual polish
  section Phase 4
    2025 Q1 : Mermaid pipeline
    2025 Q2 : Visual polish
\`\`\`
`,
};

const normalizeLocale = (locale?: string): DefaultMarkdownLocale => {
  if (!locale) return "en";
  const normalized = locale.toLowerCase();
  return normalized.startsWith("zh") ? "zh" : "en";
};

export const getDefaultMarkdown = (locale?: string): string => {
  return DEFAULT_MARKDOWN_MAP[normalizeLocale(locale)];
};
