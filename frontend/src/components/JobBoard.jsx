import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Briefcase, MapPin, Ship, DollarSign, Calendar, Star, Search } from 'lucide-react';
import { jobOpenings } from '../mock/mockData';

const JobBoard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVesselType, setFilterVesselType] = useState('all');

  const vesselTypes = ['all', 'Container Vessel', 'Bulk Carrier', 'Cruise Ship', 'Oil Tanker', 'LNG Carrier', 'General Cargo'];

  const filteredJobs = jobOpenings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVessel = filterVesselType === 'all' || job.vesselType === filterVesselType;
    return matchesSearch && matchesVessel;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-700 to-sky-900 rounded-full mb-4">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-sky-950 mb-4">
            Maritime Job Openings
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Find your next vessel - Jobs posted for seafarers like you
          </p>
          <p className="text-sm text-sky-700 font-medium">
            {jobOpenings.length} current job openings available
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search by position or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterVesselType}
              onChange={(e) => setFilterVesselType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {vesselTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Vessel Types' : type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card
              key={job.id}
              className={`p-6 hover:shadow-xl transition-all duration-300 border-l-4 ${
                job.featured ? 'border-l-yellow-500 bg-yellow-50/30' : 'border-l-sky-500'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-2xl font-bold text-sky-950">{job.title}</h3>
                        {job.featured && (
                          <Badge className="bg-yellow-500 hover:bg-yellow-600">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <p className="text-lg text-gray-700 font-medium">{job.company}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 mt-4">
                    <div className="flex items-center text-gray-600">
                      <Ship className="w-5 h-5 mr-2 text-sky-700" />
                      <span className="font-medium">{job.vesselType}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-2 text-sky-700" />
                      <span>{job.route}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                      <span className="font-semibold text-green-700">{job.salary}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-5 h-5 mr-2 text-sky-700" />
                      <span>{job.contract}</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-sky-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-sky-900">Requirements: </span>
                      {job.requirements}
                    </p>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs text-gray-500">Posted {job.postedDate}</p>
                  </div>
                </div>

                <div className="lg:ml-6 flex flex-col gap-2">
                  <Button className="bg-gradient-to-r from-sky-700 to-sky-900 hover:from-sky-800 hover:to-sky-950 whitespace-nowrap">
                    Apply Now
                  </Button>
                  <Button variant="outline" className="border-sky-700 text-sky-900 hover:bg-sky-50 whitespace-nowrap">
                    Save Job
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-sky-700 to-sky-900 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Apply?</h3>
          <p className="text-sky-100 mb-6 text-lg">
            Create your professional Seaman CV in minutes and start applying to these opportunities!
          </p>
          <Button asChild size="lg" className="bg-white text-sky-900 hover:bg-sky-50">
            <a href="/builder">Create Your CV Now - Only $1 to Download</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobBoard;