import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { t } from "../../../i18n";
import type { ImageUploader } from "../ImageUploader";

interface S3Config {
  endpoint: string; // Required, e.g. https://s3.amazonaws.com / 必填，如 https://s3.amazonaws.com
  region: string; // Required, e.g. us-east-1 / 必填，如 us-east-1
  accessKeyId: string; // Required / 必填
  secretAccessKey: string; // Required / 必填
  bucket: string; // Required / 必填
  pathPrefix?: string; // Optional, path prefix / 可选，路径前缀
  customDomain?: string; // Optional, custom domain / 可选，自定义域名
  forcePathStyle?: boolean | string; // Optional, set true for MinIO etc. / 可选，MinIO 等需要设为 true
}

// Helper function: Convert possible string to boolean / 辅助函数：将可能的字符串转为布尔值
const toBoolean = (value: boolean | string | undefined): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value === "true";
  return false;
};

/**
 * S3 Compatible Image Host / S3 兼容图床
 * Supports AWS S3, Cloudflare R2, MinIO, DigitalOcean Spaces, etc. / 支持 AWS S3、Cloudflare R2、MinIO、DigitalOcean Spaces 等
 */
export class S3Uploader implements ImageUploader {
  get name() {
    return t("imageHost.tabs.s3");
  }
  private config: S3Config;
  private client: S3Client | null = null;

  constructor(config: S3Config) {
    this.config = config;
  }

  configure(config: S3Config) {
    this.config = config;
    this.client = null; // Reset client on config change / 配置变更时重置 client
  }

  /** Get or create S3Client instance (reuse) / 获取或创建 S3Client 实例（复用） */
  private getClient(): S3Client {
    if (!this.client) {
      let endpoint = this.config.endpoint;
      // Auto complete protocol header / 自动补全协议头
      if (endpoint && !endpoint.startsWith("http")) {
        endpoint = `https://${endpoint}`;
      }

      this.client = new S3Client({
        endpoint,
        region: this.config.region,
        credentials: {
          accessKeyId: this.config.accessKeyId,
          secretAccessKey: this.config.secretAccessKey,
        },
        forcePathStyle: toBoolean(this.config.forcePathStyle),
      });
    }
    return this.client;
  }

  async validate(): Promise<boolean> {
    try {
      const { endpoint, region, accessKeyId, secretAccessKey, bucket } =
        this.config;
      if (!endpoint || !region || !accessKeyId || !secretAccessKey || !bucket) {
        return false;
      }

      const client = this.getClient();

      // Upload test file to validate config / 上传测试文件验证配置
      const testKey = `_test_${Date.now()}.txt`;
      await client.send(
        new PutObjectCommand({
          Bucket: this.config.bucket,
          Key: testKey,
          Body: new TextEncoder().encode("test"),
          ContentType: "text/plain",
        }),
      );

      // Clean up test file / 清理测试文件
      await client.send(
        new DeleteObjectCommand({
          Bucket: this.config.bucket,
          Key: testKey,
        }),
      );

      return true;
    } catch (e) {
      console.error("S3 connection test failed / S3 连接测试失败:", e);
      return false;
    }
  }

  async upload(file: File): Promise<string> {
    const client = this.getClient();

    const filename = `${Date.now()}_${file.name}`;
    const key = this.config.pathPrefix
      ? `${this.config.pathPrefix.replace(/\/$/, "")}/${filename}`
      : filename;

    const arrayBuffer = await file.arrayBuffer();

    try {
      await client.send(
        new PutObjectCommand({
          Bucket: this.config.bucket,
          Key: key,
          Body: new Uint8Array(arrayBuffer),
          ContentType: file.type || "application/octet-stream",
        }),
      );

      // Build access URL / 构建访问 URL
      if (this.config.customDomain) {
        const domain = this.config.customDomain.replace(/\/$/, "");
        return `${domain}/${key}`;
      }

      // Default S3 URL format / 默认 S3 URL 格式
      const url = new URL(this.config.endpoint);
      if (toBoolean(this.config.forcePathStyle)) {
        return `${url.origin}/${this.config.bucket}/${key}`;
      }
      return `${url.protocol}//${this.config.bucket}.${url.host}/${key}`;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      throw new Error(t("editor.imageUpload.error", { message }));
    }
  }
}
