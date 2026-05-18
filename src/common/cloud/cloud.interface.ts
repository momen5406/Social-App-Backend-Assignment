export interface ICloudProvider {
  uploadFile(file: Express.Multer.File, path: string): Promise<{ url: string; key: string }>;

  deleteFile(key: string): Promise<boolean>;

  getFile(key: string): Promise<NodeJS.ReadableStream | undefined>;
}
