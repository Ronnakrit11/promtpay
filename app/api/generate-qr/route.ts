import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { generatePromptPayPayload } from '@/lib/promptpay';

// Configure your PromptPay ID here (e.g., phone number)
const MERCHANT_ID = '0994569591';

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();

    // Generate PromptPay payload
    const payload = generatePromptPayPayload({
      phoneNumber: MERCHANT_ID,
      amount: Number(amount),
    });

    // Generate QR code as data URL
    const qrCode = await QRCode.toDataURL(payload, {
      type: 'image/png',
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    return NextResponse.json({ qrCode });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}