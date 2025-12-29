import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const faqs = [
    {
      question: 'How do I create a resume?',
      answer: 'Creating a resume is easy! Simply click on "Create resume" button, fill in your personal information, work experience, education, and skills. Choose from our professional templates and download your resume in PDF format.'
    },
    {
      question: 'Can I edit my resume after creating it?',
      answer: 'Yes! Your resume is automatically saved in your browser. You can come back anytime to edit and update your information. With a premium account, your resumes are also saved in the cloud.'
    },
    {
      question: 'How many resumes can I create?',
      answer: 'You can create unlimited resumes with both free and premium plans. This allows you to tailor different resumes for different job applications.'
    },
    {
      question: 'What formats can I download my resume in?',
      answer: 'Premium users can download their resumes in PDF format, which is the most widely accepted format by employers. Free users can preview their resumes but need to upgrade to download.'
    },
    {
      question: 'Are the templates ATS-friendly?',
      answer: 'Yes! All our templates are designed to be ATS (Applicant Tracking System) friendly, ensuring your resume gets past automated screening systems used by many companies.'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your premium subscription at any time. Your premium features will remain active until the end of your billing period.'
    },
    {
      question: 'Do you offer a free trial?',
      answer: 'Yes! We offer a 14-day free trial for our premium plan. You can try all premium features without any commitment. No credit card required for the trial.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely! We take data security seriously. All your information is encrypted and stored securely. We never share your personal information with third parties.'
    },
    {
      question: 'Can I import my existing resume?',
      answer: 'Premium users can upload their existing PDF or Word resumes, and our system will automatically extract and fill in the information. Please review the extracted data for accuracy.'
    },
    {
      question: 'Do you offer cover letter templates?',
      answer: 'Yes! Premium users have access to matching cover letter templates that complement their resume design, creating a cohesive application package.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about CV Wizard
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link to="/builder">Get Started Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;