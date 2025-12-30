import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { CreditCard, Building2, Smartphone, CheckCircle2, Anchor } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handlePayment = (e) => {
    e.preventDefault();
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      toast({
        title: "Payment Successful!",
        description: "Your CV is ready to download.",
      });
      // In real app, would download the PDF here
      navigate('/builder');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-700 to-sky-900 rounded-full mb-4">
            <Anchor className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-sky-950 mb-2">
            Complete Your Payment
          </h1>
          <p className="text-gray-600">Download your professional Seaman CV</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-1">
            <Card className="p-6 bg-gradient-to-br from-sky-50 to-white border-2 border-sky-200 sticky top-24">
              <h3 className="text-xl font-bold text-sky-950 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-700">CV PDF Download</span>
                  <span className="font-semibold">Rp 15,000</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Processing Fee</span>
                  <span>Rp 0</span>
                </div>
                <div className="border-t border-sky-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-sky-950">Total</span>
                    <span className="text-2xl font-bold text-sky-900">Rp 15,000</span>
                  </div>
                </div>
              </div>

              <div className="bg-sky-100 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-sky-700 mt-0.5" />
                  <div className="text-sm text-sky-900">
                    <p className="font-semibold mb-1">What you'll get:</p>
                    <ul className="space-y-1 text-sm">
                      <li>• High-quality PDF format</li>
                      <li>• ATS-optimized for shipping companies</li>
                      <li>• Instant download</li>
                      <li>• Unlimited updates</li>
                    </ul>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-600 text-center">
                🔒 Secure payment powered by Indonesian payment gateways
              </p>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="md:col-span-2">
            <Card className="p-8 shadow-xl border-2 border-sky-200">
              <h3 className="text-2xl font-bold text-sky-950 mb-6">Select Payment Method</h3>

              <form onSubmit={handlePayment} className="space-y-6">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  {/* Bank Transfer */}
                  <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === 'bank' ? 'border-sky-600 bg-sky-50' : 'border-gray-200 hover:border-sky-300'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="bank" id="bank" />
                      <Label htmlFor="bank" className="flex items-center space-x-3 cursor-pointer flex-1">
                        <Building2 className="w-6 h-6 text-sky-700" />
                        <div>
                          <p className="font-semibold text-sky-950">Bank Transfer</p>
                          <p className="text-sm text-gray-600">BCA, BNI, Mandiri, BRI</p>
                        </div>
                      </Label>
                    </div>
                  </div>

                  {/* E-Wallet */}
                  <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === 'ewallet' ? 'border-sky-600 bg-sky-50' : 'border-gray-200 hover:border-sky-300'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="ewallet" id="ewallet" />
                      <Label htmlFor="ewallet" className="flex items-center space-x-3 cursor-pointer flex-1">
                        <Smartphone className="w-6 h-6 text-sky-700" />
                        <div>
                          <p className="font-semibold text-sky-950">E-Wallet</p>
                          <p className="text-sm text-gray-600">GoPay, OVO, Dana, LinkAja</p>
                        </div>
                      </Label>
                    </div>
                  </div>

                  {/* Credit/Debit Card */}
                  <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === 'card' ? 'border-sky-600 bg-sky-50' : 'border-gray-200 hover:border-sky-300'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center space-x-3 cursor-pointer flex-1">
                        <CreditCard className="w-6 h-6 text-sky-700" />
                        <div>
                          <p className="font-semibold text-sky-950">Credit/Debit Card</p>
                          <p className="text-sm text-gray-600">Visa, Mastercard, JCB</p>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>

                {/* Payment Details */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4 p-4 bg-sky-50 rounded-lg">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        className="mt-2"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          type="password"
                          maxLength="3"
                          className="mt-2"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        placeholder="JOHN DOE"
                        className="mt-2"
                      />
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-sky-950">Contact Information</h4>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      className="mt-2"
                      required
                    />
                    <p className="text-xs text-gray-600 mt-1">Receipt will be sent to this email</p>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+62 812 3456 7890"
                      className="mt-2"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-sky-700 to-sky-900 hover:from-sky-800 hover:to-sky-950 text-lg py-6"
                  disabled={processing}
                >
                  {processing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing Payment...
                    </span>
                  ) : (
                    `Pay Rp 15,000`
                  )}
                </Button>

                <p className="text-xs text-center text-gray-600">
                  By completing this purchase, you agree to our Terms of Service
                </p>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;