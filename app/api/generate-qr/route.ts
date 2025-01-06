import { NextResponse } from 'next/server';
import { generatePromptPayPayload } from '@/lib/promptpay';
import { generateQRWithLogo } from '@/lib/qr-generator';
const MERCHANT_ID = '0994569591';

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();

    const payload = generatePromptPayPayload({
      phoneNumber: MERCHANT_ID,
      amount: Number(amount),
    });

    const qrCode = await generateQRWithLogo(payload, '/logo.png', {
      width: 400,
      margin: 1,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    return NextResponse.json({ qrCode });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 });
  }
}