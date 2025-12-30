import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, Trash2, Download, ArrowLeft, Ship, Anchor, Upload, X, Eye, Mail, Phone, MapPin, Calendar, Globe, Star, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { sampleCV, maritimeSkillsOptions, languageLevels } from '../mock/mockData';

const CVBuilderPro = () => {
  const [cvData, setCvData] = useState(() => {
    const saved = localStorage.getItem('cvData');
    return saved ? JSON.parse(saved) : sampleCV;
  });
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

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

  const addCertificate = () => {
    setCvData(prev => ({
      ...prev,
      certificates: [
        ...(prev.certificates || []),
        {
          id: Date.now(),
          name: '',
          issuer: '',
          date: '',
          validity: ''
        }
      ]
    }));
  };

  const updateCertificate = (id, field, value) => {
    setCvData(prev => ({
      ...prev,
      certificates: (prev.certificates || []).map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const deleteCertificate = (id) => {
    setCvData(prev => ({
      ...prev,
      certificates: (prev.certificates || []).filter(cert => cert.id !== id)
    }));
  };

  // Skills management functions
  const addSkill = (skillName) => {
    if (!skillName) return;
    const existingSkill = (cvData.skills || []).find(s => s.name === skillName);
    if (existingSkill) return; // Don't add duplicates
    
    setCvData(prev => ({
      ...prev,
      skills: [
        ...(prev.skills || []),
        { name: skillName, level: 3 }
      ]
    }));
  };

  const updateSkillLevel = (skillName, level) => {
    setCvData(prev => ({
      ...prev,
      skills: (prev.skills || []).map(skill =>
        skill.name === skillName ? { ...skill, level } : skill
      )
    }));
  };

  const deleteSkill = (skillName) => {
    setCvData(prev => ({
      ...prev,
      skills: (prev.skills || []).filter(skill => skill.name !== skillName)
    }));
  };

  // Languages management functions
  const addLanguage = () => {
    setCvData(prev => ({
      ...prev,
      languages: [
        ...(prev.languages || []),
        { name: '', level: 'Intermediate' }
      ]
    }));
  };

  const updateLanguage = (index, field, value) => {
    setCvData(prev => ({
      ...prev,
      languages: (prev.languages || []).map((lang, idx) =>
        idx === index ? { ...lang, [field]: value } : lang
      )
    }));
  };

  const deleteLanguage = (index) => {
    setCvData(prev => ({
      ...prev,
      languages: (prev.languages || []).filter((_, idx) => idx !== index)
    }));
  };

  const handleDownload = () => {
    window.location.href = '/payment';
  };

  const CVPreviewContent = () => (
    <div className="bg-white" style={{ fontFamily: 'Arial, sans-serif', width: '210mm', minHeight: '297mm' }}>
      <div className="flex">
        {/* Left Sidebar - Contains Blue Personal Details + White Skills/Languages */}
        <div className="w-[35%] bg-white">
          {/* Blue Section - Personal Details Only */}
          <div className="bg-gradient-to-b from-sky-800 to-sky-900 text-white p-8">
            {/* Name and Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2 leading-tight">
                {cvData.personalInfo.fullName || 'YOUR NAME'}
              </h1>
              <div className="h-1 w-24 bg-white mx-auto mb-3"></div>
              <h2 className="text-lg font-semibold">
                {cvData.personalInfo.title || 'Professional Title'}
              </h2>
            </div>

            {/* Photo Circle */}
            <div className="flex justify-center mb-8 relative" style={{ marginTop: '-20px' }}>
              {profilePhoto ? (
                <div className="relative">
                  <div className="w-48 h-48 rounded-full border-8 border-white overflow-hidden shadow-2xl bg-gray-200">
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-48 h-48 rounded-full border-8 border-white bg-gray-300 flex items-center justify-center shadow-2xl">
                  <span className="text-gray-500 text-sm text-center px-4">Upload Photo</span>
                </div>
              )}
            </div>

            {/* Personal Details - Last item in Blue Section */}
            <div>
              <h3 className="text-xl font-bold mb-4 uppercase border-b-2 border-white pb-2">
                Personal Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="break-words">{cvData.personalInfo.fullName || 'Your Name'}</p>
                  </div>
                </div>

                {cvData.personalInfo.email && (
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="break-words">{cvData.personalInfo.email}</p>
                    </div>
                  </div>
                )}

                {cvData.personalInfo.phone && (
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="break-words">{cvData.personalInfo.phone}</p>
                    </div>
                  </div>
                )}

                {cvData.personalInfo.location && (
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="break-words">{cvData.personalInfo.location}</p>
                    </div>
                  </div>
                )}

                {cvData.personalInfo.nationality && (
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="break-words">{cvData.personalInfo.nationality}</p>
                    </div>
                  </div>
                )}

                {cvData.personalInfo.dateOfBirth && (
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="break-words">{cvData.personalInfo.dateOfBirth}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* White Section Below Blue - Skills & Languages */}
          <div className="p-8 bg-white">
            {/* Skills Section */}
            {cvData.skills && cvData.skills.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-sky-900 mb-4 uppercase border-b-2 border-sky-800 pb-2">
                  Skills
                </h3>
                <div className="space-y-3">
                  {cvData.skills.map((skill, idx) => (
                    <div key={idx}>
                      <p className="text-sm mb-1 font-medium text-gray-800">{skill.name}</p>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-4 h-4 rounded-full ${
                              level <= (skill.level || 3)
                                ? 'bg-sky-700'
                                : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages Section */}
            {cvData.languages && cvData.languages.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-sky-900 mb-4 uppercase border-b-2 border-sky-800 pb-2">
                  Languages
                </h3>
                <div className="space-y-2 text-sm">
                  {cvData.languages.map((lang, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">{lang.name}</span>
                      <span className="text-gray-600">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Main Content - White Section */}
        <div className="w-[65%] p-8 bg-white border-l-2 border-gray-200">
          {/* Profile Section */}
          {cvData.personalInfo.summary && (
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-sky-900 mb-3 uppercase border-b-4 border-sky-800 pb-2">
                Profile
              </h3>
              <p className="text-sm text-gray-800 leading-relaxed text-justify">
                {cvData.personalInfo.summary}
              </p>
            </div>
          )}

          {/* Education Section */}
          {cvData.education && cvData.education.length > 0 && (
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-sky-900 mb-3 uppercase border-b-4 border-sky-800 pb-2">
                Education
              </h3>
              {cvData.education.map((edu) => (
                <div key={edu.id} className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="text-base font-bold text-gray-900">{edu.degree}</h4>
                      <p className="text-sm text-sky-700 italic">{edu.institution}, {edu.location}</p>
                    </div>
                    {edu.graduationDate && (
                      <p className="text-sm text-gray-600 font-semibold whitespace-nowrap ml-4">
                        {edu.graduationDate}
                      </p>
                    )}
                  </div>
                  {edu.description && (
                    <ul className="text-sm text-gray-700 ml-4">
                      <li className="list-disc">{edu.description}</li>
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Employment Section */}
          {cvData.experience && cvData.experience.length > 0 && (
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-sky-900 mb-3 uppercase border-b-4 border-sky-800 pb-2">
                Employment
              </h3>
              {cvData.experience.map((exp) => (
                <div key={exp.id} className="mb-5">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="text-base font-bold text-gray-900">{exp.position}</h4>
                      <p className="text-sm text-sky-700 italic">{exp.employer}, {exp.location}</p>
                    </div>
                    <p className="text-sm text-gray-600 font-semibold whitespace-nowrap ml-4">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </p>
                  </div>
                  {exp.description && exp.description.length > 0 && (
                    <ul className="text-sm text-gray-800 ml-4 space-y-1">
                      {exp.description.map((item, idx) => (
                        item && <li key={idx} className="list-disc leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Certificates Section */}
          {cvData.certificates && cvData.certificates.length > 0 && (
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-sky-900 mb-3 uppercase border-b-4 border-sky-800 pb-2">
                Certificates & Licenses
              </h3>
              <div className="space-y-2">
                {cvData.certificates.map((cert) => (
                  <div key={cert.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{cert.name}</p>
                      <p className="text-xs text-gray-600">{cert.issuer}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-xs text-gray-600">{cert.date}</p>
                      {cert.validity && <p className="text-xs text-gray-500">Valid: {cert.validity}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills and Languages sections moved to left sidebar */}
        </div>
      </div>
    </div>
  );

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
              <h1 className="text-xl font-semibold">Professional Seaman CV Builder</h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
              <DialogTrigger asChild>
                <Button
                  className="bg-white text-sky-900 hover:bg-sky-50"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview CV
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-sky-900">CV Preview</DialogTitle>
                </DialogHeader>
                <CVPreviewContent />
                <div className="flex justify-end space-x-3 mt-4 pt-4 border-t">
                  <Button variant="outline" onClick={() => setShowPreview(false)}>
                    Close Preview
                  </Button>
                  <Button
                    onClick={handleDownload}
                    className="bg-gradient-to-r from-sky-700 to-sky-900 hover:from-sky-800 hover:to-sky-950"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF (Rp 15,000)
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button
              onClick={handleDownload}
              className="bg-white text-sky-900 hover:bg-sky-50 shadow-md"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF (Rp 15,000)
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="certificates">Certificates</TabsTrigger>
              </TabsList>

              {/* Personal Info Tab */}
              <TabsContent value="personal">
                <Card className="p-6 space-y-4">
                  {/* Photo Upload */}
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
                          <p className="text-sm text-gray-600 mb-2">Photo uploaded!</p>
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
                        <span className="text-xs text-gray-500">Passport-style photo recommended</span>
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
                      placeholder="Captain John Doe"
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
                        placeholder="+62 812 3456 7890"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Address</Label>
                      <Input
                        id="location"
                        value={cvData.personalInfo.location}
                        onChange={(e) => updatePersonalInfo('location', e.target.value)}
                        placeholder="Jakarta, Indonesia"
                      />
                    </div>
                    <div>
                      <Label htmlFor="nationality">Nationality</Label>
                      <Input
                        id="nationality"
                        value={cvData.personalInfo.nationality || ''}
                        onChange={(e) => updatePersonalInfo('nationality', e.target.value)}
                        placeholder="Indonesian"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      value={cvData.personalInfo.dateOfBirth || ''}
                      onChange={(e) => updatePersonalInfo('dateOfBirth', e.target.value)}
                      placeholder="January 15, 1985"
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
                          Education
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
                        <Label>Degree/Qualification</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          placeholder="Master Mariner Certificate / BSc Maritime"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Institution</Label>
                          <Input
                            value={edu.institution}
                            onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                            placeholder="Maritime Academy"
                          />
                        </div>
                        <div>
                          <Label>Location</Label>
                          <Input
                            value={edu.location}
                            onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                            placeholder="City, Country"
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
                    Add Education
                  </Button>
                </div>
              </TabsContent>

              {/* Certificates Tab */}
              <TabsContent value="certificates">
                <div className="space-y-4">
                  {(cvData.certificates || []).map((cert) => (
                    <Card key={cert.id} className="p-6 space-y-4 border-sky-200">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg text-sky-950">Certificate</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteCertificate(cert.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                      <div>
                        <Label>Certificate Name</Label>
                        <Input
                          value={cert.name}
                          onChange={(e) => updateCertificate(cert.id, 'name', e.target.value)}
                          placeholder="STCW Basic Safety Training"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Issuer</Label>
                          <Input
                            value={cert.issuer}
                            onChange={(e) => updateCertificate(cert.id, 'issuer', e.target.value)}
                            placeholder="IMO"
                          />
                        </div>
                        <div>
                          <Label>Issue Date</Label>
                          <Input
                            value={cert.date}
                            onChange={(e) => updateCertificate(cert.id, 'date', e.target.value)}
                            placeholder="2020"
                          />
                        </div>
                        <div>
                          <Label>Validity</Label>
                          <Input
                            value={cert.validity}
                            onChange={(e) => updateCertificate(cert.id, 'validity', e.target.value)}
                            placeholder="5 Years"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button onClick={addCertificate} variant="outline" className="w-full border-sky-700 text-sky-900 hover:bg-sky-50">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Certificate
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Live Preview */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card className="p-8 bg-white shadow-2xl border-2 border-sky-200">
              <h3 className="text-xl font-bold text-sky-950 mb-4">Live Preview</h3>
              <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white" style={{ transform: 'scale(0.6)', transformOrigin: 'top left', width: '166.67%', height: '600px' }}>
                <CVPreviewContent />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVBuilderPro;
