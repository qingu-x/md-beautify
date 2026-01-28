import COS from 'cos-nodejs-sdk-v5';

export interface COSConfig {
  secretId: string;
  secretKey: string;
  bucket: string;
  region: string;
  customDomain?: string;
}

export class COSService {
  private cos: COS;
  private bucket: string;
  private region: string;
  private customDomain?: string;

  constructor(config: COSConfig) {
    this.cos = new COS({
      SecretId: config.secretId,
      SecretKey: config.secretKey,
    });
    this.bucket = config.bucket;
    this.region = config.region;
    this.customDomain = config.customDomain;
  }

  async uploadFile(
    file: Buffer,
    filename: string,
  ): Promise<{ url: string; key: string }> {
    const key = `images/${filename}`;

    return new Promise((resolve, reject) => {
      this.cos.putObject(
        {
          Bucket: this.bucket,
          Region: this.region,
          Key: key,
          Body: file,
        },
        (err: COS.CosError) => {
          if (err) {
            const message =
              typeof err === 'string'
                ? err
                : err.error || err.message || 'Upload failed';
            reject(
              new Error(
                typeof message === 'string' ? message : JSON.stringify(message),
              ),
            );
          } else {
            const url = this.customDomain
              ? `${this.customDomain}/${key}`
              : `https://${this.bucket}.cos.${this.region}.myqcloud.com/${key}`;
            resolve({ url, key });
          }
        },
      );
    });
  }
}
