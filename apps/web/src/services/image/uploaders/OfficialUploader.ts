import { t } from "../../../i18n";
import type { ImageUploader } from "../ImageUploader";

interface OfficialConfig {
  serverUrl?: string;
}

/**
 * Official Image Host (Upload to R2 via Cloudflare Worker) / 官方图床（通过 Cloudflare Worker 上传到 R2）
 */
export class OfficialUploader implements ImageUploader {
  get name() {
    return t("imageHost.tabs.official");
  }
  private serverUrl: string;

  constructor(config?: OfficialConfig) {
    // Use Cloudflare Worker API by default / 默认使用 Cloudflare Worker API
    this.serverUrl = config?.serverUrl || "https://api.wemd.app";
  }

  configure(config: OfficialConfig) {
    if (config.serverUrl) {
      this.serverUrl = config.serverUrl;
    }
  }

  async upload(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${this.serverUrl}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          t("editor.imageUpload.error", { message: response.statusText }),
      );
    }

    if (!data.url) {
      throw new Error(t("editor.imageUpload.noUrl"));
    }

    return data.url;
  }
}
