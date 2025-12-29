import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { templates } from '../mock/mockData';
import { ArrowRight } from 'lucide-react';

const Templates = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Template
          </h1>
          <p className="text-xl text-gray-600">
            Select from our professionally designed templates to make your resume stand out
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ backgroundColor: template.color }}
                >
                  <div className="bg-white w-4/5 h-[90%] rounded shadow-lg p-4">
                    <div
                      className="h-16 rounded mb-3"
                      style={{ backgroundColor: template.color }}
                    ></div>
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-2 bg-gray-200 rounded w-full mt-4"></div>
                      <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-2 bg-gray-200 rounded w-4/5 mt-4"></div>
                      <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {template.name}
                </h3>
                <p className="text-gray-600 mb-4">{template.description}</p>
                <Button
                  asChild
                  className="w-full bg-blue-600 hover:bg-blue-700 group-hover:translate-x-1 transition-transform"
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

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">Not sure which template to choose?</p>
          <Button asChild variant="outline" size="lg">
            <Link to="/builder">Start with a blank resume</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Templates;