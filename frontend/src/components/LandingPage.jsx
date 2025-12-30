import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Star, ChevronLeft, ChevronRight, Ship, Compass, Award } from 'lucide-react';
import { reviews, howItWorksSteps } from '../mock/mockData';

const LandingPage = () => {
  const [currentReview, setCurrentReview] = React.useState(0);

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const visibleReviews = [
    reviews[currentReview],
    reviews[(currentReview + 1) % reviews.length],
    reviews[(currentReview + 2) % reviews.length],
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* CV Preview */}
            <div className="relative">
              <div className="bg-white rounded-lg shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
                <div className="border-2 border-sky-200 rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-sky-800 to-sky-950 text-white p-6">
                    <h3 className="text-2xl font-bold mb-2">Captain James Anderson</h3>
                    <p className="text-sm opacity-90">Master Mariner | Chief Officer</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h4 className="font-semibold text-sky-900 mb-2 flex items-center">
                        <Ship className="w-4 h-4 mr-2" />
                        Profile
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Experienced Master Mariner with over 12 years of sea service on various vessel types.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sky-900 mb-2 flex items-center">
                        <Compass className="w-4 h-4 mr-2" />
                        Sea Service
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-gray-900">Second Officer</p>
                          <p className="text-xs text-gray-600">Maersk Line • Container Vessels • 2020 - Present</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-900">Third Officer</p>
                          <p className="text-xs text-gray-600">Pacific Shipping • Bulk Carriers • 2017 - 2019</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sky-900 mb-2 flex items-center">
                        <Award className="w-4 h-4 mr-2" />
                        Certificates
                      </h4>
                      <p className="text-xs text-gray-600">Master Mariner Certificate (Unlimited)</p>
                      <p className="text-xs text-gray-600">US Merchant Marine Academy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Content */}
            <div>
              <h1 className="text-5xl font-bold text-sky-950 mb-6 leading-tight">
                Professional CV Builder for Seafarers
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Create your professional maritime CV in minutes. Free to use, pay only when you download your PDF.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <Ship className="w-4 h-4 text-sky-700" />
                  </div>
                  <p className="text-gray-700">Designed specifically for maritime professionals</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <Compass className="w-4 h-4 text-sky-700" />
                  </div>
                  <p className="text-gray-700">Templates optimized for shipping companies</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <Award className="w-4 h-4 text-sky-700" />
                  </div>
                  <p className="text-gray-700">Free to create - Pay only Rp 15,000 to download PDF</p>
                </div>
              </div>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-sky-700 to-sky-900 hover:from-sky-800 hover:to-sky-950 text-lg px-8 py-6 rounded-full shadow-lg"
              >
                <Link to="/builder">Start Building Your CV</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-sky-950 mb-16">
            How does it work?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorksSteps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-sky-700 to-sky-900 text-white text-2xl font-bold mb-6 shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-sky-950 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-sky-950 via-sky-900 to-sky-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">What Seafarers Say</h2>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-4xl font-bold text-white">4.8</span>
              <span className="text-2xl text-sky-200">/ 5</span>
              <div className="flex ml-2">
                {[1, 2, 3, 4].map((star) => (
                  <Star key={star} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                ))}
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              </div>
            </div>
            <p className="text-sky-200 mt-2">Based on 8,500+ maritime professionals</p>
          </div>

          <div className="relative">
            <div className="grid md:grid-cols-3 gap-6">
              {visibleReviews.map((review, index) => (
                <Card
                  key={review.id}
                  className="bg-white/10 backdrop-blur-sm border-sky-700 p-6 transform transition-all duration-300 hover:scale-105 hover:bg-white/15"
                >
                  <h4 className="text-white font-semibold mb-3">{review.name}</h4>
                  <p className="text-sky-100 text-sm mb-4">{review.text}</p>
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            <button
              onClick={prevReview}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white rounded-full p-3 shadow-lg hover:bg-sky-50 transition-colors"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-6 h-6 text-sky-900" />
            </button>
            <button
              onClick={nextReview}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white rounded-full p-3 shadow-lg hover:bg-sky-50 transition-colors"
              aria-label="Next review"
            >
              <ChevronRight className="w-6 h-6 text-sky-900" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-sky-700 to-sky-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to build your Seaman CV?
          </h2>
          <p className="text-xl text-sky-100 mb-8">
            Join thousands of maritime professionals who have landed their dream vessels
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-sky-900 hover:bg-sky-50 text-lg px-8 py-6 rounded-full shadow-xl"
          >
            <Link to="/builder">Create Your Maritime CV Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;