import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
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
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* CV Preview */}
            <div className="relative">
              <div className="bg-white rounded-lg shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-red-800 text-white p-6">
                    <h3 className="text-2xl font-bold mb-2">Austin Clark</h3>
                    <p className="text-sm opacity-90">Product Manager | San Francisco, CA</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Profile</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Dynamic and result-oriented Chief Product Officer with over 8 years of experience in tech companies.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Experience</h4>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-gray-900">VP of Product Development</p>
                          <p className="text-xs text-gray-600">Tech Innovations Inc. • 2020 - Present</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-900">Chief Product Officer</p>
                          <p className="text-xs text-gray-600">Digital Solutions Ltd. • 2017 - 2019</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Education</h4>
                      <p className="text-xs text-gray-600">Bachelor of Business Administration</p>
                      <p className="text-xs text-gray-600">University of California, Berkeley</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Content */}
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Easily create a professional resume
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Fill in your details, select a winning template and download your resume in no time.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 rounded-full"
              >
                <Link to="/builder">Get started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            How does it work?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorksSteps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Reviews</h2>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-4xl font-bold text-white">4.5</span>
              <span className="text-2xl text-gray-400">/ 5</span>
              <div className="flex ml-2">
                {[1, 2, 3, 4].map((star) => (
                  <Star key={star} className="w-6 h-6 fill-blue-600 text-blue-600" />
                ))}
                <Star className="w-6 h-6 fill-blue-600 text-blue-600" style={{ clipPath: 'inset(0 50% 0 0)' }} />
              </div>
            </div>
            <p className="text-gray-400 mt-2">Based on 47,723 reviews</p>
          </div>

          <div className="relative">
            <div className="grid md:grid-cols-3 gap-6">
              {visibleReviews.map((review, index) => (
                <Card
                  key={review.id}
                  className="bg-gray-800 border-gray-700 p-6 transform transition-all duration-300 hover:scale-105"
                >
                  <h4 className="text-white font-semibold mb-3">{review.name}</h4>
                  <p className="text-gray-300 text-sm mb-4">{review.text}</p>
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-blue-600 text-blue-600" />
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            <button
              onClick={prevReview}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <button
              onClick={nextReview}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Next review"
            >
              <ChevronRight className="w-6 h-6 text-gray-900" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to build your resume?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who have landed their dream jobs
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-full"
          >
            <Link to="/builder">Create your resume now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;