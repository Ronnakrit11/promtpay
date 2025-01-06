import { QRCodeDisplay } from '@/components/ui/qr-code-display';
import { Card } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

export default function Home() {
  // Set your fixed amount here
  const PAYMENT_AMOUNT = 100;

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Wallet className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">
              PromptPay Payment
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Complete your payment securely using PromptPay. Simply scan the QR code
            below with your banking application to proceed with the payment.
          </p>
        </div>

        <QRCodeDisplay amount={PAYMENT_AMOUNT} />

        <Card className="p-6 max-w-md mx-auto bg-primary/5">
          <h3 className="font-medium mb-2">Payment Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Open your banking application</li>
            <li>Select the QR code scanning option</li>
            <li>Scan the QR code displayed above</li>
            <li>Verify the amount and recipient details</li>
            <li>Confirm the payment</li>
          </ol>
        </Card>
      </div>
    </main>
  );
}