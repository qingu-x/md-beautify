import { t } from "../../i18n";

/**
 * Image Uploader Interface / 图床上传接口
 */

export interface ImageUploader {
  /** Uploader Name / 图床名称 */
  name: string;

  /** Upload Image / 上传图片 */
  upload(file: File): Promise<string>;

  /** Configure Uploader (Optional) / 配置图床（可选） */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  configure?(config: any): void;

  /** Validate Configuration (Optional) / 验证配置（可选） */
  validate?(): Promise<boolean>;
}

/**
 * Image Host Configuration / 图床配置
 */
export interface ImageHostConfig {
  type: "official" | "qiniu" | "aliyun" | "tencent" | "s3";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config?: any;
}

/**
 * Image Host Manager / 图床管理器
 * Use dynamic import for lazy loading to reduce initial bundle size / 使用动态导入实现按需加载，减少首屏加载体积
 */
export class ImageHostManager {
  private uploaderPromise: Promise<ImageUploader>;
  private config: ImageHostConfig;

  constructor(config: ImageHostConfig) {
    this.config = config;
    this.uploaderPromise = this.createUploader(config);
  }

  /**
   * Dynamically load the corresponding image uploader / 动态加载对应的图床上传器
   * Load SDK only when user selects a specific image host / 只有在用户选择特定图床时才会加载对应的 SDK
   */
  private async createUploader(
    config: ImageHostConfig,
  ): Promise<ImageUploader> {
    switch (config.type) {
      case "official": {
        const { OfficialUploader } =
          await import("./uploaders/OfficialUploader");
        return new OfficialUploader(config.config);
      }
      case "qiniu": {
        const { QiniuUploader } = await import("./uploaders/QiniuUploader");
        return new QiniuUploader(config.config);
      }
      case "aliyun": {
        const { AliyunUploader } = await import("./uploaders/AliyunUploader");
        return new AliyunUploader(config.config);
      }
      case "tencent": {
        const { TencentUploader } = await import("./uploaders/TencentUploader");
        return new TencentUploader(config.config);
      }
      case "s3": {
        const { S3Uploader } = await import("./uploaders/S3Uploader");
        return new S3Uploader(config.config);
      }
      default: {
        const { OfficialUploader } =
          await import("./uploaders/OfficialUploader");
        return new OfficialUploader(config.config);
      }
    }
  }

  async upload(file: File): Promise<string> {
    // Unified check for file size (max 10MB) / 统一检查文件大小（最大 10MB）
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new Error(
        t("editor.imageUpload.maxSizeExceeded", { size: "10MB" }),
      );
    }
    const uploader = await this.uploaderPromise;
    return await uploader.upload(file);
  }

  async validate(): Promise<boolean> {
    const uploader = await this.uploaderPromise;
    if (uploader.validate) {
      return await uploader.validate();
    }
    return true;
  }
}
