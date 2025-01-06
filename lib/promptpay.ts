// PromptPay QR Code generation utility
export interface PromptPayConfig {
  phoneNumber: string;
  amount: number;
}

export const generatePromptPayPayload = ({ phoneNumber, amount }: PromptPayConfig): string => {
  try {
    // Remove any non-numeric characters from phone number
    const sanitizedNumber = phoneNumber.replace(/\D/g, '');
    
    // Validate phone number format (must be 10 digits for Thai numbers)
    if (sanitizedNumber.length !== 10) {
      throw new Error('Invalid phone number format');
    }

    // Format phone number for PromptPay (remove first 0)
    const formattedNumber = `0066${sanitizedNumber.substring(1)}`;

    const fields = [
      // ID + Payload Format Indicator + "01"
      "000201",
      // ID + POI Method + Static
      "010212",
      // Merchant Account Information
      "2937",
      // ID + Domestic Merchant
      "0016A000000677010111",
      // Phone Number Length + Phone Number
      `01${formattedNumber.length.toString().padStart(2, '0')}${formattedNumber}`,
      // Country Code + "TH"
      "5802TH",
      // Currency Code + "764" (THB)
      "5303764",
      // Amount
      amount ? `54${amount.toFixed(2).length.toString().padStart(2, '0')}${amount.toFixed(2)}` : "",
      // Country Code (TH)
      "5802TH",
      // CRC placeholder
      "6304"
    ].join("");

    // Calculate CRC16
    const crc = calculateCRC16(fields);
    return fields + crc;
  } catch (error) {
    console.error('Error generating PromptPay payload:', error);
    throw new Error('Failed to generate PromptPay QR code');
  }
};

// CRC16 CCITT-FALSE calculation
function calculateCRC16(str: string): string {
  let crc = 0xFFFF;
  const polynomial = 0x1021;

  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    crc ^= (c << 8);
    
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = ((crc << 1) ^ polynomial) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0');
}