// PromptPay QR Code generation utility
export interface PromptPayConfig {
  phoneNumber: string;
  amount: number;
}

// EMVCo QR Code format for PromptPay
export const generatePromptPayPayload = ({ phoneNumber, amount }: PromptPayConfig): string => {
  try {
    // Remove any non-numeric characters from phone number
    const sanitizedNumber = phoneNumber.replace(/\D/g, '');
    
    // Validate phone number format (must be 10 digits for Thai numbers)
    if (sanitizedNumber.length !== 10) {
      throw new Error('Invalid phone number format');
    }

    const pointOfInitiation = '000201'; // Fixed for QR
    const payloadFormatIndicator = '010211';
    const merchantAccountInfo = `2937${sanitizedNumber.length.toString().padStart(2, '0')}${sanitizedNumber}`;
    const countryCode = '5802TH';
    const currencyCode = '5303764'; // THB (764)
    const amountStr = amount ? `54${String(amount.toFixed(2)).length.toString().padStart(2, '0')}${amount.toFixed(2)}` : '';

    const payload = `${pointOfInitiation}${payloadFormatIndicator}${merchantAccountInfo}${countryCode}${currencyCode}${amountStr}`;
    
    // Add CRC16 checksum
    const crc = calculateCRC16(payload);
    return `${payload}6304${crc}`;
  } catch (error) {
    console.error('Error generating PromptPay payload:', error);
    throw new Error('Failed to generate PromptPay QR code');
  }
};

// CRC16 calculation for PromptPay
function calculateCRC16(str: string): string {
  const crcTable = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    crcTable[i] = c;
  }

  let crc = -1;
  for (let i = 0; i < str.length; i++) {
    const byte = str.charCodeAt(i);
    crc = (crc >>> 8) ^ crcTable[(crc ^ byte) & 0xFF];
  }
  return ((crc ^ (-1)) >>> 0).toString(16).toUpperCase().padStart(4, '0');
}