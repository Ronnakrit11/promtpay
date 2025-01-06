import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { generatePromptPayPayload } from '@/lib/promptpay';
import { headers } from 'next/headers';

// Configure your PromptPay ID here
const MERCHANT_ID = '0891234567';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    // Force dynamic rendering
    headers();
    
    const { amount } = await request.json();

    // Generate PromptPay payload using our Edge-compatible implementation
    const payload = generatePromptPayPayload({
      phoneNumber: MERCHANT_ID,
      amount: Number(amount),
    });

    // Generate QR code
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