import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Trash2, Download, ArrowLeft, Ship, Anchor, Upload, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { sampleCV } from '../mock/mockData';

const CVBuilder = () => {
  const [cvData, setCvData] = useState(() => {
    const saved = localStorage.getItem('cvData');
    return saved ? JSON.parse(saved) : sampleCV;
  });
  const [selectedTemplate, setSelectedTemplate] = useState('nautical');
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    localStorage.setItem('cvData', JSON.stringify(cvData));
  }, [cvData]);

  useEffect(() => {
    const savedPhoto = localStorage.getItem('profilePhoto');
    if (savedPhoto) setProfilePhoto(savedPhoto);
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
        localStorage.setItem('profilePhoto', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setProfilePhoto(null);
    localStorage.removeItem('profilePhoto');
  };

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
    // Redirect to payment page
    window.location.href = '/payment';
  };

  const templateColors = {
    nautical: '#0C4A6E',
    ocean: '#0369A1',
    maritime: '#075985',
    anchor: '#1E3A8A'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-900 to-sky-950 text-white py-4 px-4 sm:px-6 lg:px-8 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-sky-200 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center space-x-2">
              <Ship className="w-5 h-5" />
              <h1 className="text-xl font-semibold">Seaman CV Builder</h1>
            </div>
          </div>
          <Button
            onClick={handleDownload}
            className="bg-white text-sky-900 hover:bg-sky-50 shadow-md"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF (Rp 15,000)
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
                  {/* Photo Upload Section */}
                  <div className="border-2 border-dashed border-sky-300 rounded-lg p-6 bg-sky-50">
                    <Label className="text-sky-950 font-semibold mb-3 block">Profile Photo</Label>
                    {profilePhoto ? (
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={profilePhoto}
                            alt="Profile"
                            className="w-32 h-32 rounded-lg object-cover border-4 border-sky-200"
                          />
                          <button
                            onClick={removePhoto}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 mb-2">Photo uploaded successfully!</p>
                          <label className="cursor-pointer">
                            <span className="text-sm text-sky-700 hover:text-sky-900 underline">
                              Change photo
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center cursor-pointer">
                        <Upload className="w-12 h-12 text-sky-600 mb-2" />
                        <span className="text-sm text-gray-700 mb-1">Click to upload your photo</span>
                        <span className="text-xs text-gray-500">Recommended: Square image, max 2MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

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
                    <Label htmlFor="title">Rank/Position</Label>
                    <Input
                      id="title"
                      value={cvData.personalInfo.title}
                      onChange={(e) => updatePersonalInfo('title', e.target.value)}
                      placeholder="Chief Officer / Master Mariner"
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
                      placeholder="Brief summary about your sea service, vessel experience, and career objectives..."
                      rows={5}
                    />
                  </div>
                </Card>
              </TabsContent>

              {/* Experience Tab */}
              <TabsContent value="experience">
                <div className="space-y-4">
                  {cvData.experience.map((exp) => (
                    <Card key={exp.id} className="p-6 space-y-4 border-sky-200">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg text-sky-950 flex items-center">
                          <Ship className="w-5 h-5 mr-2 text-sky-700" />
                          Sea Service
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteExperience(exp.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                      <div>
                        <Label>Rank/Position</Label>
                        <Input
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                          placeholder="Chief Officer / Second Engineer"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Shipping Company</Label>
                          <Input
                            value={exp.employer}
                            onChange={(e) => updateExperience(exp.id, 'employer', e.target.value)}
                            placeholder="Maersk Line / MSC"
                          />
                        </div>
                        <div>
                          <Label>Vessel Type / Route</Label>
                          <Input
                            value={exp.location}
                            onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                            placeholder="Container Vessel - Worldwide"
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
                        <Label>Duties & Responsibilities</Label>
                        <Textarea
                          value={exp.description.join('\n')}
                          onChange={(e) => updateExperience(exp.id, 'description', e.target.value.split('\n'))}
                          placeholder="• Navigation watch keeping\n• Cargo operations\n• Safety management"
                          rows={4}
                        />
                      </div>
                    </Card>
                  ))}
                  <Button onClick={addExperience} variant="outline" className="w-full border-sky-700 text-sky-900 hover:bg-sky-50">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Sea Service
                  </Button>
                </div>
              </TabsContent>

              {/* Education Tab */}
              <TabsContent value="education">
                <div className="space-y-4">
                  {cvData.education.map((edu) => (
                    <Card key={edu.id} className="p-6 space-y-4 border-sky-200">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg text-sky-950 flex items-center">
                          <Anchor className="w-5 h-5 mr-2 text-sky-700" />
                          Certificate/Education
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteEducation(edu.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                      <div>
                        <Label>Certificate/Degree</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          placeholder="Master Mariner Certificate / BSc Maritime"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Maritime Academy/Institution</Label>
                          <Input
                            value={edu.institution}
                            onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                            placeholder="Maritime Academy / Training Center"
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
                        <Label>Additional Details</Label>
                        <Textarea
                          value={edu.description}
                          onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                          placeholder="STCW certification, specializations, etc."
                          rows={2}
                        />
                      </div>
                    </Card>
                  ))}
                  <Button onClick={addEducation} variant="outline" className="w-full border-sky-700 text-sky-900 hover:bg-sky-50">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Certificate/Education
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card className="p-8 bg-white shadow-2xl border-2 border-sky-200">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Header */}
                <div
                  className="text-white p-8 relative"
                  style={{ backgroundColor: templateColors[selectedTemplate] }}
                >
                  <div className="flex items-start space-x-6">
                    {profilePhoto && (
                      <img
                        src={profilePhoto}
                        alt="Profile"
                        className="w-24 h-24 rounded-lg object-cover border-4 border-white/30 flex-shrink-0"
                      />
                    )}
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold mb-2">{cvData.personalInfo.fullName || 'Your Name'}</h2>
                      <p className="text-sm opacity-90">
                        {cvData.personalInfo.title || 'Job Title'} | {cvData.personalInfo.location || 'Location'}
                      </p>
                      <div className="mt-4 text-sm space-y-1 opacity-90">
                        {cvData.personalInfo.email && <p>{cvData.personalInfo.email}</p>}
                        {cvData.personalInfo.phone && <p>{cvData.personalInfo.phone}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                  {/* Summary */}
                  {cvData.personalInfo.summary && (
                    <div>
                      <h3 className="text-lg font-bold text-sky-950 mb-2 border-b-2 border-sky-300 pb-1 flex items-center">
                        <Ship className="w-5 h-5 mr-2" />
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
                      <h3 className="text-lg font-bold text-sky-950 mb-3 border-b-2 border-sky-300 pb-1 flex items-center">
                        <Anchor className="w-5 h-5 mr-2" />
                        Sea Service
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
                      <h3 className="text-lg font-bold text-sky-950 mb-3 border-b-2 border-sky-300 pb-1">
                        Certificates & Education
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