import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Check, X, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-sky-950 mb-4">
            Simple Pricing for Seafarers
          </h1>
          <p className="text-xl text-gray-600">
            Create your CV for free - Pay only when you need to download
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Single Pricing Card */}
          <Card className="p-8 border-2 border-sky-600 hover:shadow-2xl transition-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-400 to-sky-600 transform rotate-45 translate-x-16 -translate-y-16"></div>
            <div className="relative">
              <div className="text-center mb-8">
                <div className="inline-block mb-4">
                  <Download className="w-16 h-16 text-sky-700" />
                </div>
                <h2 className="text-3xl font-bold text-sky-950 mb-2">Free to Create</h2>
                <div className="text-5xl font-bold text-sky-900 mb-2">
                  Rp 15,000
                  <span className="text-xl font-normal text-gray-600">/download</span>
                </div>
                <p className="text-gray-600">Pay only when you need your PDF</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold text-sky-950 mb-4 text-lg">Free Features:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Create unlimited maritime CVs</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Edit anytime, anywhere</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Preview your seaman CV</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Access all maritime templates</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Auto-save your progress</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Multiple vessel experience sections</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-sky-950 mb-4 text-lg">When You Download ($4.99):</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-sky-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">High-quality PDF format</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-sky-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">ATS-optimized for shipping companies</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-sky-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Professional maritime formatting</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-sky-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Ready to send to manning agencies</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-sky-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Instant download</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-sky-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Unlimited updates after purchase</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-sky-50 rounded-lg p-6 mb-6">
                <p className="text-center text-sky-900 font-medium">
                  🏆 No subscription. No hidden fees. Pay once per CV download.
                </p>
              </div>

              <Button asChild className="w-full bg-gradient-to-r from-sky-700 to-sky-900 hover:from-sky-800 hover:to-sky-950 text-lg py-6">
                <Link to="/builder">Start Creating Free</Link>
              </Button>
            </div>
          </Card>

          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold text-sky-950 mb-6">
              Why Seafarers Choose Us
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="text-3xl font-bold text-sky-700 mb-2">8,500+</div>
                <p className="text-gray-600">Maritime CVs Created</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="text-3xl font-bold text-sky-700 mb-2">4.8/5</div>
                <p className="text-gray-600">Average Rating</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="text-3xl font-bold text-sky-700 mb-2">100%</div>
                <p className="text-gray-600">Maritime Industry Focus</p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-sky-950 mb-4">
              Have questions?
            </h3>
            <Button asChild variant="outline" className="border-sky-700 text-sky-900 hover:bg-sky-50">
              <Link to="/faq">View FAQs →</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;