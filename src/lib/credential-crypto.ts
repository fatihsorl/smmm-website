import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getKey() {
  const hex = process.env.CREDENTIALS_ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error("CREDENTIALS_ENCRYPTION_KEY tanımlı değil veya 64 karakter (32 byte hex) değil.");
  }
  return Buffer.from(hex, "hex");
}

/** Boş metni şifrelemeden boş döndürür; dolu metni base64 "iv.authTag.ciphertext" olarak şifreler. */
export function encryptSecret(plain: string): string {
  if (!plain) {
    return "";
  }
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv, authTag, ciphertext].map((buf) => buf.toString("base64")).join(".");
}

/** encryptSecret ile şifrelenmiş metni çözer; boş veya bozuk girişte boş döner. */
export function decryptSecret(encoded: string): string {
  if (!encoded) {
    return "";
  }
  const parts = encoded.split(".");
  if (parts.length !== 3) {
    return "";
  }
  try {
    const [ivB64, authTagB64, ciphertextB64] = parts;
    const key = getKey();
    const iv = Buffer.from(ivB64, "base64");
    const authTag = Buffer.from(authTagB64, "base64");
    const ciphertext = Buffer.from(ciphertextB64, "base64");
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return plain.toString("utf8");
  } catch {
    return "";
  }
}
