import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Trash2, Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { sampleCV } from '../mock/mockData';
import { toast } from '../hooks/use-toast';

const CVBuilder = () => {
  const [cvData, setCvData] = useState(() => {
    const saved = localStorage.getItem('cvData');
    return saved ? JSON.parse(saved) : sampleCV;
  });
  const [selectedTemplate, setSelectedTemplate] = useState('modern');

  useEffect(() => {
    localStorage.setItem('cvData', JSON.stringify(cvData));
  }, [cvData]);

  const updatePersonalInfo = (field, value) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const addExperience = () => {
    setCvData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now(),
          position: '',
          employer: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: ['']
        }
      ]
    }));
  };

  const updateExperience = (id, field, value) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const deleteExperience = (id) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    setCvData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now(),
          degree: '',
          institution: '',
          location: '',
          graduationDate: '',
          description: ''
        }
      ]
    }));
  };

  const updateEducation = (id, field, value) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const deleteEducation = (id) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const handleDownload = () => {
    toast({
      title: "Resume downloaded!",
      description: "Your resume has been downloaded as PDF.",
    });
  };

  const templateColors = {
    modern: '#991B1B',
    classic: '#1E40AF',
    creative: '#065F46',
    minimal: '#374151'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-900 text-white py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-semibold">Resume</h1>
          </div>
          <Button
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
              </TabsList>

              {/* Personal Info Tab */}
              <TabsContent value="personal">
                <Card className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={cvData.personalInfo.fullName}
                      onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      value={cvData.personalInfo.title}
                      onChange={(e) => updatePersonalInfo('title', e.target.value)}
                      placeholder="Product Manager"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={cvData.personalInfo.email}
                        onChange={(e) => updatePersonalInfo('email', e.target.value)}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={cvData.personalInfo.phone}
                        onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={cvData.personalInfo.location}
                      onChange={(e) => updatePersonalInfo('location', e.target.value)}
                      placeholder="San Francisco, CA"
                    />
                  </div>
                  <div>
                    <Label htmlFor="summary">Professional Summary</Label>
                    <Textarea
                      id="summary"
                      value={cvData.personalInfo.summary}
                      onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                      placeholder="Brief summary about yourself..."
                      rows={5}
                    />
                  </div>
                </Card>
              </TabsContent>

              {/* Experience Tab */}
              <TabsContent value="experience">
                <div className="space-y-4">
                  {cvData.experience.map((exp) => (
                    <Card key={exp.id} className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg">Employment</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteExperience(exp.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                      <div>
                        <Label>Position</Label>
                        <Input
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                          placeholder="Product Manager"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Employer</Label>
                          <Input
                            value={exp.employer}
                            onChange={(e) => updateExperience(exp.id, 'employer', e.target.value)}
                            placeholder="Company Name"
                          />
                        </div>
                        <div>
                          <Label>City</Label>
                          <Input
                            value={exp.location}
                            onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                            placeholder="San Francisco, CA"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Start Date</Label>
                          <Input
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                            placeholder="Jan 2020"
                          />
                        </div>
                        <div>
                          <Label>End Date</Label>
                          <Input
                            value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                            placeholder="Present"
                            disabled={exp.current}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={exp.description.join('\n')}
                          onChange={(e) => updateExperience(exp.id, 'description', e.target.value.split('\n'))}
                          placeholder="• Achievement 1\n• Achievement 2"
                          rows={4}
                        />
                      </div>
                    </Card>
                  ))}
                  <Button onClick={addExperience} variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                </div>
              </TabsContent>

              {/* Education Tab */}
              <TabsContent value="education">
                <div className="space-y-4">
                  {cvData.education.map((edu) => (
                    <Card key={edu.id} className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg">Education</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteEducation(edu.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                      <div>
                        <Label>Degree</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          placeholder="Bachelor of Science"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Institution</Label>
                          <Input
                            value={edu.institution}
                            onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                            placeholder="University Name"
                          />
                        </div>
                        <div>
                          <Label>Location</Label>
                          <Input
                            value={edu.location}
                            onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                            placeholder="City, State"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Graduation Date</Label>
                        <Input
                          value={edu.graduationDate}
                          onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                          placeholder="May 2020"
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={edu.description}
                          onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                          placeholder="Major, Minor, Honors, etc."
                          rows={2}
                        />
                      </div>
                    </Card>
                  ))}
                  <Button onClick={addEducation} variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Education
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card className="p-8 bg-white shadow-xl">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Header */}
                <div
                  className="text-white p-8"
                  style={{ backgroundColor: templateColors[selectedTemplate] }}
                >
                  <h2 className="text-3xl font-bold mb-2">{cvData.personalInfo.fullName || 'Your Name'}</h2>
                  <p className="text-sm opacity-90">
                    {cvData.personalInfo.title || 'Job Title'} | {cvData.personalInfo.location || 'Location'}
                  </p>
                  <div className="mt-4 text-sm space-y-1 opacity-90">
                    {cvData.personalInfo.email && <p>{cvData.personalInfo.email}</p>}
                    {cvData.personalInfo.phone && <p>{cvData.personalInfo.phone}</p>}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                  {/* Summary */}
                  {cvData.personalInfo.summary && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 border-b-2 border-gray-200 pb-1">
                        Profile
                      </h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {cvData.personalInfo.summary}
                      </p>
                    </div>
                  )}

                  {/* Experience */}
                  {cvData.experience.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-gray-200 pb-1">
                        Experience
                      </h3>
                      <div className="space-y-4">
                        {cvData.experience.map((exp) => (
                          <div key={exp.id}>
                            <div className="flex justify-between items-start mb-1">
                              <div>
                                <p className="text-sm font-bold text-gray-900">{exp.position}</p>
                                <p className="text-sm text-gray-600">
                                  {exp.employer} • {exp.location}
                                </p>
                              </div>
                              <p className="text-xs text-gray-500">
                                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                              </p>
                            </div>
                            {exp.description && exp.description.length > 0 && (
                              <ul className="text-sm text-gray-700 mt-2 space-y-1">
                                {exp.description.map((item, idx) => (
                                  item && <li key={idx} className="leading-relaxed">• {item}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {cvData.education.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-gray-200 pb-1">
                        Education
                      </h3>
                      <div className="space-y-3">
                        {cvData.education.map((edu) => (
                          <div key={edu.id}>
                            <p className="text-sm font-bold text-gray-900">{edu.degree}</p>
                            <p className="text-sm text-gray-600">
                              {edu.institution}, {edu.location}
                            </p>
                            {edu.graduationDate && (
                              <p className="text-xs text-gray-500 mt-1">{edu.graduationDate}</p>
                            )}
                            {edu.description && (
                              <p className="text-sm text-gray-700 mt-1">{edu.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVBuilder;