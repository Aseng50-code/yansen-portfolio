import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, Trash2, Download, ArrowLeft, Ship, Anchor, Upload, X, Eye, Mail, Phone, MapPin, Calendar, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { sampleCV } from '../mock/mockData';

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

  const handleDownload = () => {
    window.location.href = '/payment';
  };

  const CVPreviewContent = () => (
    <div className="bg-white p-12 max-w-4xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header Section */}
      <div className="border-b-4 border-sky-800 pb-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-sky-900 mb-2">{cvData.personalInfo.fullName || 'YOUR NAME'}</h1>
            <h2 className="text-xl text-gray-700 mb-4">{cvData.personalInfo.title || 'Professional Title'}</h2>
            
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              {cvData.personalInfo.email && (
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-sky-700" />
                  <span>{cvData.personalInfo.email}</span>
                </div>
              )}
              {cvData.personalInfo.phone && (
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-sky-700" />
                  <span>{cvData.personalInfo.phone}</span>
                </div>
              )}
              {cvData.personalInfo.location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-sky-700" />
                  <span>{cvData.personalInfo.location}</span>
                </div>
              )}
              {cvData.personalInfo.nationality && (
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-sky-700" />
                  <span>{cvData.personalInfo.nationality}</span>
                </div>
              )}
              {cvData.personalInfo.dateOfBirth && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-sky-700" />
                  <span>{cvData.personalInfo.dateOfBirth}</span>
                </div>
              )}
            </div>
          </div>
          
          {profilePhoto && (
            <div className="ml-6">
              <img
                src={profilePhoto}
                alt="Profile"
                className="w-32 h-32 object-cover border-4 border-sky-700 rounded"
              />
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {cvData.personalInfo.summary && (
        <div className="mb-6">
          <h3 className="text-xl font-bold text-sky-900 mb-3 uppercase border-b-2 border-sky-300 pb-1">
            Professional Summary
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed text-justify">
            {cvData.personalInfo.summary}
          </p>
        </div>
      )}

      {/* Professional Experience */}
      {cvData.experience && cvData.experience.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-bold text-sky-900 mb-3 uppercase border-b-2 border-sky-300 pb-1">
            Sea Service / Professional Experience
          </h3>
          {cvData.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h4 className="text-base font-bold text-gray-900">{exp.position}</h4>
                  <p className="text-sm text-gray-700">{exp.employer} | {exp.location}</p>
                </div>
                <p className="text-sm text-gray-600 font-semibold">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </p>
              </div>
              {exp.description && exp.description.length > 0 && (
                <ul className="text-sm text-gray-700 mt-2 space-y-1 ml-4">
                  {exp.description.map((item, idx) => (
                    item && <li key={idx} className="leading-relaxed list-disc">{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {cvData.education && cvData.education.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-bold text-sky-900 mb-3 uppercase border-b-2 border-sky-300 pb-1">
            Education & Training
          </h3>
          {cvData.education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-base font-bold text-gray-900">{edu.degree}</h4>
                  <p className="text-sm text-gray-700">{edu.institution}, {edu.location}</p>
                  {edu.description && (
                    <p className="text-sm text-gray-600 mt-1">{edu.description}</p>
                  )}
                </div>
                {edu.graduationDate && (
                  <p className="text-sm text-gray-600 font-semibold">{edu.graduationDate}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificates */}
      {cvData.certificates && cvData.certificates.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-bold text-sky-900 mb-3 uppercase border-b-2 border-sky-300 pb-1">
            Certificates & Licenses
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {cvData.certificates.map((cert) => (
              <div key={cert.id} className="text-sm">
                <p className="font-semibold text-gray-900">{cert.name}</p>
                <p className="text-gray-600">{cert.issuer} - {cert.date}</p>
                {cert.validity && <p className="text-gray-500 text-xs">Valid: {cert.validity}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {cvData.skills && cvData.skills.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-bold text-sky-900 mb-3 uppercase border-b-2 border-sky-300 pb-1">
            Professional Skills
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {cvData.skills.map((skill, idx) => (
              <div key={idx} className="text-sm text-gray-700">
                • {skill.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {cvData.languages && cvData.languages.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-bold text-sky-900 mb-3 uppercase border-b-2 border-sky-300 pb-1">
            Languages
          </h3>
          <div className="flex space-x-6 text-sm">
            {cvData.languages.map((lang, idx) => (
              <div key={idx}>
                <span className="font-semibold text-gray-900">{lang.name}:</span>
                <span className="text-gray-700 ml-1">{lang.level}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
        <p>CV created with CV Build for Seaman</p>
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
