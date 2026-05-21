/**
 * Encryption Utility
 * أداة التشفير والفك - منصة الرباطاب
 */

import crypto from 'crypto';
import config from '../config/environment';

class EncryptionService {
  private algorithm: string;
  private key: string;
  private iv: string;

  constructor() {
    this.algorithm = config.encryption.algorithm;
    this.key = config.encryption.key;
    this.iv = config.encryption.iv || crypto.randomBytes(16).toString('hex');
  }

  /**
   * تشفير النص
   */
  encrypt(plaintext: string): string {
    try {
      const iv = Buffer.from(this.iv, 'hex');
      const keyBuffer = crypto
        .createHash('sha256')
        .update(String(this.key))
        .digest();

      const cipher = crypto.createCipheriv(this.algorithm, keyBuffer, iv);
      let encrypted = cipher.update(plaintext, 'utf-8', 'hex');
      encrypted += cipher.final('hex');

      return `${this.iv}:${encrypted}`;
    } catch (error) {
      throw new Error(`Encryption failed: ${error}`);
    }
  }

  /**
   * فك التشفير
   */
  decrypt(ciphertext: string): string {
    try {
      const parts = ciphertext.split(':');
      if (parts.length !== 2) {
        throw new Error('Invalid cipher format');
      }

      const [ivHex, encryptedHex] = parts;
      const iv = Buffer.from(ivHex, 'hex');
      const keyBuffer = crypto
        .createHash('sha256')
        .update(String(this.key))
        .digest();

      const decipher = crypto.createDecipheriv(this.algorithm, keyBuffer, iv);
      let decrypted = decipher.update(encryptedHex, 'hex', 'utf-8');
      decrypted += decipher.final('utf-8');

      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error}`);
    }
  }

  /**
   * إنشاء hash
   */
  hash(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex');
  }

  /**
   * توليد random string
   */
  generateRandomString(length: number = 32): string {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
  }
}

export default new EncryptionService();