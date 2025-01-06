import QRCode from 'qrcode';

interface QROptions {
  width?: number;
  margin?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  color?: {
    dark?: string;
    light?: string;
  };
  logoWidth?: number;
  logoHeight?: number;
}

export async function generateQRWithLogo(
  data: string,
  logoUrl: string,
  options: QROptions = {
    width: 400,
    margin: 1,
    errorCorrectionLevel: 'H',
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
    logoWidth: 80,
    logoHeight: 80,
  }
): Promise<string> {
  // Generate QR code as data URL
  const qrDataUrl = await QRCode.toDataURL(data, {
    width: options.width,
    margin: options.margin,
    errorCorrectionLevel: options.errorCorrectionLevel,
    color: options.color,
  });

  // Create canvas in memory
  const canvas = document.createElement('canvas');
  canvas.width = options.width!;
  canvas.height = options.width!;
  const ctx = canvas.getContext('2d')!;

  // Load QR code onto canvas
  const qrImage = new Image();
  await new Promise((resolve) => {
    qrImage.onload = resolve;
    qrImage.src = qrDataUrl;
  });
  ctx.drawImage(qrImage, 0, 0);

  // Load and draw logo
  const logo = new Image();
  await new Promise((resolve) => {
    logo.onload = resolve;
    logo.src = logoUrl;
  });

  const logoX = (options.width! - options.logoWidth!) / 2;
  const logoY = (options.width! - options.logoHeight!) / 2;

  // Create white background for logo
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(logoX - 5, logoY - 5, options.logoWidth! + 10, options.logoHeight! + 10);

  // Draw the logo
  ctx.drawImage(logo, logoX, logoY, options.logoWidth!, options.logoHeight!);

  // Return final image as data URL
  return canvas.toDataURL('image/png');
}