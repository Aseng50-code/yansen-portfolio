import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { Anchor } from 'lucide-react';

const FAQ = () => {
  const faqs = [
    {
      question: 'How do I create a seaman CV?',
      answer: 'Creating your maritime CV is simple! Click "Create Seaman CV" button, fill in your personal information, certificates, sea service experience, vessel types, and maritime skills. Choose from our professional seaman templates and preview your CV instantly. It\'s completely free to create and edit.'
    },
    {
      question: 'Is it really free to use?',
      answer: 'Yes! Creating, editing, and previewing your seaman CV is 100% free. You only pay Rp 15,000 when you want to download your CV as a professional PDF file to send to shipping companies or manning agencies.'
    },
    {
      question: 'Can I edit my CV after downloading?',
      answer: 'Absolutely! Your CV is saved in your browser, so you can come back anytime to edit and update your information. After making changes, you can download the updated version for another Rp 15,000, or use the same download if purchased within 30 days.'
    },
    {
      question: 'How many CVs can I create?',
      answer: 'You can create unlimited seaman CVs completely free! This is perfect for tailoring different CVs for different vessel types, ranks, or shipping companies. You only pay when you download a specific CV as PDF.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and PayPal. Payment is secure and processed through industry-standard encrypted payment gateways.'
    },
    {
      question: 'Are the templates suitable for maritime industry?',
      answer: 'Yes! All our templates are specifically designed for seafarers and maritime professionals. They are optimized to highlight sea service, certificates, vessel types, and maritime skills in a format that shipping companies and manning agencies prefer.'
    },
    {
      question: 'Can I use this for different ranks?',
      answer: 'Absolutely! Our CV builder is suitable for all maritime ranks - from deck cadets, able seamen, officers, engineers, to master mariners and chief engineers. The templates are flexible to showcase experience at any rank level.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes! We take data security very seriously. Your personal information is encrypted and stored securely. We never share your information with third parties. Your CV data is private and only accessible by you.'
    },
    {
      question: 'What format is the downloaded CV?',
      answer: 'Your CV is downloaded as a high-quality PDF file. PDF format is universally accepted by shipping companies, manning agencies, and recruitment platforms. It ensures your CV looks professional on any device.'
    },
    {
      question: 'Can I get a refund?',
      answer: 'Yes! If you\'re not satisfied with your downloaded CV within 24 hours, contact our support team and we\'ll issue a full refund. We want you to be completely happy with your professional seaman CV.'
    },
    {
      question: 'Do you offer bulk discounts for manning agencies?',
      answer: 'Yes! If you\'re a manning agency or shipping company looking to help multiple seafarers create CVs, please contact us for special bulk pricing and white-label solutions.'
    },
    {
      question: 'How long does it take to create a CV?',
      answer: 'Most seafarers complete their CV in 10-15 minutes! Our maritime-focused interface makes it quick and easy to enter your sea service, certificates, and experience. You can save your progress and come back anytime.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-700 to-sky-900 rounded-full mb-4">
            <Anchor className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-sky-950 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Everything you need to know about CV Build for Seaman
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-sky-950 hover:text-sky-700">
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
          <h3 className="text-xl font-semibold text-sky-950 mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-gradient-to-r from-sky-700 to-sky-900 hover:from-sky-800 hover:to-sky-950">
              <Link to="/builder">Start Building Your CV</Link>
            </Button>
            <Button asChild variant="outline" className="border-sky-700 text-sky-900 hover:bg-sky-50">
              <a href="mailto:support@cvbuildforseaman.com">Contact Support</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;