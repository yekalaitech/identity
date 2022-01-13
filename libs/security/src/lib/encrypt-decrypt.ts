import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scrypt
} from 'crypto';

const algorithm = 'aes-192-cbc';
const encryptionKey = process.env.PASSWORD_ENCRYPTION_KEY;
const salt = process.env.PASSWORD_ENCRYPTION_SALT;


export class EncryptDecrypt {
  static async encrpt(text: string) {
    const key = await EncryptDecrypt.generateSaltKey();
    const iv = randomBytes(16);
    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted+= cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted;
  }

  static async decrypt(hash: string) {
    const [iv, content] = hash.split(':');
    const key = await EncryptDecrypt.generateSaltKey();

    const decipher = createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));

    let decrypted = decipher.update(content, 'hex', 'utf8')
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  static generateSaltKey() {
    return new Promise<Buffer>((resolve, reject) => {
      scrypt(encryptionKey, salt, 24, (err, key) => {
        if (err) {
          return reject(err);
        }    
        resolve(key);
      });
    });
  }
}