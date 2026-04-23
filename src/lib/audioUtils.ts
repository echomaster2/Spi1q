
export function decodeBase64(base64: string): Uint8Array {
  if (!base64 || typeof base64 !== 'string' || base64.trim() === '') {
    console.warn("Attempted to decode an empty or undefined base64 string.");
    return new Uint8Array(0);
  }

  // Sanitize the string: remove data URL prefix and any whitespace/newlines
  let cleanBase64 = base64
    .replace(/^data:.*?;base64,/, '')
    .replace(/\s/g, ''); // Remove all whitespace

  // Convert URL-safe base64 to standard base64
  cleanBase64 = cleanBase64.replace(/-/g, '+').replace(/_/g, '/');

  // Add padding if missing
  const paddingNeeded = (4 - (cleanBase64.length % 4)) % 4;
  if (paddingNeeded > 0) {
    cleanBase64 += '='.repeat(paddingNeeded);
  }

  // Final check for valid characters
  cleanBase64 = cleanBase64.replace(/[^A-Za-z0-9+/=]/g, '');
    
  try {
    // For very large strings, we could use a different approach, but this is usually fine for short audio
    const binaryString = atob(cleanBase64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  } catch (err) {
    console.error("Critical Base64 Decoding Failure. Payload Length:", cleanBase64.length);
    console.log("Start of payload:", cleanBase64.substring(0, 100));
    // If it's a "The string to be decoded is not correctly encoded" error, 
    // it usually means the length is not a multiple of 4 even after cleaning.
    throw new Error(`Base64 decoding failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  try {
    // 1. Try native decoding first (works for MP3, WAV, AAC, etc.)
    try {
      // Use slice to get a fresh ArrayBuffer if needed, though data.buffer should work
      const buffer = await ctx.decodeAudioData(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength));
      return buffer;
    } catch (nativeErr) {
      // If native decoding fails, it might be raw PCM
      console.warn("Native audio decoding failed, attempting raw PCM fallback:", nativeErr);
    }

    // 2. Fallback: Manual 16-bit PCM parsing
    const safeByteLength = data.byteLength - (data.byteLength % 2);
    const dataInt16 = new Int16Array(data.buffer, data.byteOffset, safeByteLength / 2);
    const frameCount = dataInt16.length / numChannels;
    
    if (frameCount <= 0) {
      throw new Error("Invalid audio data: frame count is zero or negative");
    }

    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  } catch (err) {
    console.error("Critical Error in decodeAudioData:", err);
    throw err;
  }
}

/**
 * Wraps raw PCM base64 data into a WAV file and returns the base64 of the WAV.
 */
export function wrapPcmInWav(pcmBase64: string, sampleRate: number = 24000): string {
  const pcmData = decodeBase64(pcmBase64);
  const header = createWavHeader(pcmData.length, sampleRate, 1);
  const wavData = new Uint8Array(header.length + pcmData.length);
  wavData.set(header);
  wavData.set(pcmData, header.length);

  // Convert Uint8Array to base64 safely
  let binary = "";
  const len = wavData.length;
  // Use chunks for memory efficiency and speed
  const chunkSize = 8192;
  for (let i = 0; i < len; i += chunkSize) {
    binary += String.fromCharCode(...wavData.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

export function createWavHeader(dataLength: number, sampleRate: number = 24000, numChannels: number = 1): Uint8Array {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);

  /* RIFF identifier */
  view.setUint32(0, 0x52494646, false); // "RIFF"
  /* file length */
  view.setUint32(4, 36 + dataLength, true);
  /* RIFF type */
  view.setUint32(8, 0x57415645, false); // "WAVE"
  /* format chunk identifier */
  view.setUint32(12, 0x666d7420, false); // "fmt "
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, 1, true); // PCM
  /* channel count */
  view.setUint16(22, numChannels, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * numChannels * 2, true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, numChannels * 2, true);
  /* bits per sample */
  view.setUint16(34, 16, true);
  /* data chunk identifier */
  view.setUint32(36, 0x64617461, false); // "data"
  /* data chunk length */
  view.setUint32(40, dataLength, true);

  return new Uint8Array(header);
}

export function pcmToWav(pcmData: Uint8Array, sampleRate: number = 24000, numChannels: number = 1): Blob {
  const header = createWavHeader(pcmData.length, sampleRate, numChannels);
  const wavData = new Uint8Array(header.length + pcmData.length);
  wavData.set(header);
  wavData.set(pcmData, header.length);
  return new Blob([wavData], { type: 'audio/wav' });
}
