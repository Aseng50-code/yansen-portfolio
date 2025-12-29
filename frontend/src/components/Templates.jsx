import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { templates } from '../mock/mockData';
import { ArrowRight, Anchor } from 'lucide-react';

const Templates = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-700 to-sky-900 rounded-full mb-4">
            <Anchor className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-sky-950 mb-4">
            Maritime CV Templates
          </h1>
          <p className="text-xl text-gray-600">
            Professional templates designed specifically for seafarers and maritime professionals
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="overflow-hidden hover:shadow-2xl transition-all duration-300 group border-2 hover:border-sky-400"
            >
              <div className="relative aspect-[3/4] bg-gradient-to-br from-sky-50 to-white overflow-hidden">
                <div
                  className="absolute inset-0 flex items-center justify-center p-4"
                >
                  <div className="bg-white w-full h-full rounded shadow-xl p-4 border-2" style={{ borderColor: template.color }}>
                    <div
                      className="h-20 rounded mb-3 flex items-center justify-center"
                      style={{ backgroundColor: template.color }}
                    >
                      <Anchor className="w-8 h-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-2 bg-gray-200 rounded w-full mt-4"></div>
                      <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-2 bg-gray-200 rounded w-4/5 mt-4"></div>
                      <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-2 bg-gray-200 rounded w-full mt-4"></div>
                      <div className="h-2 bg-gray-200 rounded w-4/5"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white">
                <h3 className="text-xl font-bold text-sky-950 mb-2">
                  {template.name}
                </h3>
                <p className="text-gray-600 mb-4">{template.description}</p>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-sky-700 to-sky-900 hover:from-sky-800 hover:to-sky-950 group-hover:translate-x-1 transition-transform"
                >
                  <Link to="/builder">
                    Use this template
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-sky-700 to-sky-900 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Not sure which template to choose?</h3>
          <p className="text-sky-100 mb-6 text-lg">All templates are optimized for maritime industry and shipping companies</p>
          <Button asChild variant="secondary" size="lg" className="bg-white text-sky-900 hover:bg-sky-50">
            <Link to="/builder">Start with any template - You can change it later!</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Templates;