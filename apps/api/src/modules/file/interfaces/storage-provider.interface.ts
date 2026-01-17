/**
 * Interface for storage providers that can store and retrieve files
 */
export interface StorageProvider {
  /**
   * Uploads a file to the storage backend
   * @param file The file buffer to upload
   * @param key The unique key/path for the file
   * @param mimeType The MIME type of the file
   * @returns Promise that resolves when the upload is complete
   */
  upload(file: Buffer, key: string, mimeType: string): Promise<void>;

  /**
   * Downloads a file from the storage backend
   * @param key The unique key/path of the file
   * @returns Promise that resolves with the file buffer
   */
  download(key: string): Promise<Buffer>;

  /**
   * Deletes a file from the storage backend
   * @param key The unique key/path of the file
   * @returns Promise that resolves when the file is deleted
   */
  delete(key: string): Promise<void>;

  /**
   * Generates a signed URL for temporary access to a file
   * @param key The unique key/path of the file
   * @param expiresIn Expiration time in seconds (default: 3600)
   * @returns Promise that resolves with the signed URL
   */
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;
}

/**
 * Token for injecting StorageProvider
 */
export const STORAGE_PROVIDER_TOKEN = Symbol('StorageProvider');
