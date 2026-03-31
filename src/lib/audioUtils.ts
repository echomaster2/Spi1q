
export function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  try {
    // Ensure we are reading 16-bit PCM data correctly
    // Byte length must be even for Int16Array
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
        // Normalize 16-bit PCM to float [-1.0, 1.0]
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  } catch (err) {
    console.error("Error in decodeAudioData:", err);
    throw err;
  }
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
