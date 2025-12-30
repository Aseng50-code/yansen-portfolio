import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { CheckCircle2, Anchor, Upload, Copy, Check, Clock, AlertCircle, Download } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Payment = () => {
  const [paymentProof, setPaymentProof] = useState(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch payment info and check status on mount
  useEffect(() => {
    fetchPaymentInfo();
    if (token) {
      checkPaymentStatus();
    }
  }, [token]);

  const fetchPaymentInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/settings/payment-info`);
      setPaymentInfo(response.data.paymentInfo);
    } catch (error) {
      console.error('Error fetching payment info:', error);
      // Use default values if API fails
      setPaymentInfo({
        bankName: 'BNI',
        accountNumber: '3334433003',
        accountName: 'CV Jesse Energi Sejahtera',
        instructions: 'Transfer Rp 15,000 to the account above. After transfer, upload your payment proof.'
      });
    }
    setLoading(false);
  };

  const checkPaymentStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/payments/check-status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPaymentStatus(response.data);
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  const handleProofUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProof(reader.result);
        setPaymentProofPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyAccountNumber = () => {
    if (paymentInfo?.accountNumber) {
      navigator.clipboard.writeText(paymentInfo.accountNumber);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Account number copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    
    if (!user || !token) {
      toast({
        title: "Login Required",
        description: "Please login to submit payment",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (!paymentProof) {
      toast({
        title: "Payment Proof Required",
        description: "Please upload your payment proof (screenshot/photo of transfer receipt)",
        variant: "destructive"
      });
      return;
    }

    if (!email || !phone) {
      toast({
        title: "Contact Information Required",
        description: "Please fill in your email and phone number",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    
    try {
      const response = await axios.post(
        `${API_URL}/api/payments`,
        {
          amount: 15000,
          paymentMethod: 'bank',
          email: email,
          phone: phone,
          paymentProof: paymentProof
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      toast({
        title: "Payment Submitted!",
        description: "Your payment is being verified. We'll notify you once confirmed.",
      });
      
      // Refresh payment status
      await checkPaymentStatus();
      
    } catch (error) {
      console.error('Payment submission error:', error);
      toast({
        title: "Submission Failed",
        description: error.response?.data?.detail || "Failed to submit payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadCV = async () => {
    // Get CV data from localStorage
    const cvDataString = localStorage.getItem('cvData');
    const profilePhoto = localStorage.getItem('profilePhoto');
    
    if (!cvDataString) {
      toast({
        title: "No CV Data",
        description: "Please create your CV first before downloading",
        variant: "destructive"
      });
      navigate('/builder');
      return;
    }

    setProcessing(true);

    try {
      const cvData = JSON.parse(cvDataString);
      cvData.profilePhoto = profilePhoto;

      const response = await axios.post(
        `${API_URL}/api/cv/download`,
        cvData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          responseType: 'blob'
        }
      );
      
      // Create download link
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cvData.personalInfo?.fullName || 'CV'}_Seaman_CV.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download Started!",
        description: "Your CV PDF is being downloaded.",
      });

    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: error.response?.data?.detail || "Failed to download CV. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-sky-700 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // If payment is confirmed, show download section
  if (paymentStatus?.canDownload) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-sky-950 mb-4">
              Payment Confirmed!
            </h1>
            <p className="text-gray-600 mb-8">
              Your payment has been verified. You can now download your professional Seaman CV.
            </p>
            <Button
              onClick={handleDownloadCV}
              disabled={processing}
              className="bg-gradient-to-r from-sky-700 to-sky-900 hover:from-sky-800 hover:to-sky-950 text-lg py-6 px-8"
            >
              {processing ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating PDF...
                </span>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Download CV PDF
                </>
              )}
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              Need to update your CV? <a href="/builder" className="text-sky-700 hover:underline">Go to CV Builder</a>
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // If payment is pending, show waiting message
  if (paymentStatus?.payment?.status === 'pending') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-6">
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold text-sky-950 mb-4">
              Payment Under Verification
            </h1>
            <p className="text-gray-600 mb-4">
              Your payment proof has been submitted and is being verified by our team.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              This usually takes 1-24 hours. You will receive a notification once your payment is confirmed.
            </p>
            <div className="bg-sky-50 rounded-lg p-4 text-left">
              <p className="text-sm text-sky-900">
                <strong>Payment ID:</strong> {paymentStatus.payment.id}
              </p>
            </div>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="mt-6"
            >
              Refresh Status
            </Button>
          </Card>
        </div>
      </div>
    );
  }

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

        {!user && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-yellow-800 font-medium">Login Required</p>
              <p className="text-yellow-700 text-sm">Please <a href="/login" className="underline font-medium">login</a> or register to submit your payment.</p>
            </div>
          </div>
        )}

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
                      <li>• Professional maritime layout</li>
                      <li>• Unlimited re-downloads</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="md:col-span-2">
            <Card className="p-8 shadow-xl border-2 border-sky-200">
              <h3 className="text-2xl font-bold text-sky-950 mb-6">Bank Transfer Payment</h3>

              {/* Bank Account Details */}
              <div className="bg-sky-50 rounded-lg p-6 mb-6 border-2 border-sky-200">
                <h4 className="font-semibold text-sky-950 mb-4">Transfer to this account:</h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Bank</span>
                    <span className="font-bold text-sky-900 text-lg">{paymentInfo?.bankName || 'BNI'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Account Name</span>
                    <span className="font-semibold text-gray-800">{paymentInfo?.accountName || 'CV Jesse Energi Sejahtera'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Account Number</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sky-900 text-xl tracking-wider">{paymentInfo?.accountNumber || '3334433003'}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={copyAccountNumber}
                        className="text-sky-700 hover:text-sky-900"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-sky-200">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-bold text-green-600 text-xl">Rp 15,000</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmitPayment} className="space-y-6">
                {/* Payment Proof Upload */}
                <div>
                  <Label className="text-sky-950 font-semibold mb-3 block">
                    Upload Payment Proof <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-gray-600 mb-3">
                    Upload screenshot or photo of your transfer receipt
                  </p>
                  
                  <div className="border-2 border-dashed border-sky-300 rounded-lg p-6 bg-sky-50 hover:bg-sky-100 transition-colors">
                    {paymentProofPreview ? (
                      <div className="space-y-4">
                        <img
                          src={paymentProofPreview}
                          alt="Payment proof"
                          className="max-h-48 mx-auto rounded-lg shadow"
                        />
                        <label className="block text-center">
                          <span className="text-sm text-sky-700 hover:text-sky-900 underline cursor-pointer">
                            Change image
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProofUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center cursor-pointer">
                        <Upload className="w-12 h-12 text-sky-600 mb-2" />
                        <span className="text-sm text-gray-700 mb-1">Click to upload payment proof</span>
                        <span className="text-xs text-gray-500">PNG, JPG up to 5MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProofUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-sky-950">Contact Information</h4>
                  <div>
                    <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="mt-2"
                      required
                    />
                    <p className="text-xs text-gray-600 mt-1">Notification will be sent to this email</p>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number (WhatsApp) <span className="text-red-500">*</span></Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+62 812 3456 7890"
                      className="mt-2"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-sky-700 to-sky-900 hover:from-sky-800 hover:to-sky-950 text-lg py-6"
                  disabled={processing || !user}
                >
                  {processing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting Payment...
                    </span>
                  ) : (
                    'Submit Payment Proof'
                  )}
                </Button>

                <p className="text-xs text-center text-gray-600">
                  By submitting, you confirm that you have transferred Rp 15,000 to the account above.
                  Your payment will be verified within 1-24 hours.
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
