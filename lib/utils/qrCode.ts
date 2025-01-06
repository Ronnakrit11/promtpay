import QRCode from 'qrcode';

interface QRCodeOptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

const DEFAULT_OPTIONS: QRCodeOptions = {
  width: 200,
  margin: 2,
  errorCorrectionLevel: 'M',
  color: {
    dark: '#000000',
    light: '#ffffff'
  }
};

export async function generateQRCode(
  data: string, 
  options: QRCodeOptions = {}
): Promise<string> {
  try {
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
    
    // Add retry logic
    let attempts = 3;
    let lastError: Error | null = null;

    while (attempts > 0) {
      try {
        const qrCode = await QRCode.toDataURL(data, mergedOptions);
        return qrCode;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('QR code generation failed');
        attempts--;
        if (attempts > 0) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    throw lastError || new Error('Failed to generate QR code after retries');
  } catch (error) {
    console.error('QR code generation error:', error);
    throw new Error('Failed to generate QR code. Please try again later.');
  }
}