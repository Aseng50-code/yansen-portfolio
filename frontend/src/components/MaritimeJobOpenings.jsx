import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { 
  Briefcase, MapPin, Ship, DollarSign, Calendar, Search, Heart, MessageCircle, 
  Share2, Send, Plus, Trash2, Edit, Image, X, Copy, Check, 
  Facebook, Linkedin, Twitter, MessageSquare, ExternalLink
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../hooks/use-toast';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const MaritimeJobOpenings = () => {
  const { user, token } = useAuth();
  const isAdmin = user?.role === 'admin';

  // State
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [showShareDialog, setShowShareDialog] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Comment states
  const [expandedComments, setExpandedComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [commentLoading, setCommentLoading] = useState({});
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    coverImage: '',
    body: '',
    positions: [],
    contactInfo: '',
    tags: '',
    status: 'published'
  });

  // Fetch announcements
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/announcements`);
      setAnnouncements(response.data.announcements || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      // Use mock data if API fails
      setAnnouncements(getMockAnnouncements());
    } finally {
      setLoading(false);
    }
  };

  const getMockAnnouncements = () => [
    {
      id: '1',
      title: 'NMDC Group – Career Opportunities in the UAE',
      coverImage: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800',
      body: `NMDC Group, one of the leading marine and dredging companies in the Middle East, is currently seeking qualified maritime professionals to join our expanding fleet operations.

We offer competitive salaries, excellent benefits, and opportunities for career advancement within our global network.

Our company values safety, professionalism, and continuous development of our crew members.`,
      positions: [
        { title: 'Master Mariner', description: 'Unlimited license required, 5+ years experience on DP vessels' },
        { title: 'Chief Officer', description: 'Valid COC, experience with dredging operations preferred' },
        { title: 'Second Officer', description: 'STCW certified, radar/ARPA qualified' },
        { title: 'Chief Engineer', description: 'Class I certificate, experience with CAT engines' },
        { title: 'Electrical Officer', description: 'HV certified, PMS experience required' }
      ],
      contactInfo: 'Send your updated CV to: recruitment@nmdc-group.com\nSubject: [Position] - Your Name\nWhatsApp: +971 50 123 4567',
      tags: ['UAE', 'Offshore', 'DP Vessels', 'Dredging', 'Urgent'],
      authorName: 'NMDC HR Team',
      createdAt: new Date().toISOString(),
      likes: 45,
      likedBy: [],
      commentsCount: 12
    },
    {
      id: '2',
      title: 'Maersk Line – Container Vessel Officers Needed',
      coverImage: 'https://images.unsplash.com/photo-1577993132227-66550458c8ce?w=800',
      body: `Maersk Line, the world's largest container shipping company, is recruiting experienced deck and engine officers for our modern fleet.

Join us for worldwide trading routes and excellent career progression opportunities.`,
      positions: [
        { title: 'Chief Officer', description: 'Container vessel experience, 3+ years as C/O' },
        { title: 'Second Engineer', description: 'Experience with MAN B&W engines' }
      ],
      contactInfo: 'Apply at: careers.maersk.com\nEmail: seafarer.recruitment@maersk.com',
      tags: ['Container', 'Worldwide', 'Maersk', 'Career Growth'],
      authorName: 'Maersk Recruitment',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      likes: 89,
      likedBy: [],
      commentsCount: 23
    }
  ];

  // Handle like
  const handleLike = async (announcementId) => {
    if (!user) {
      toast({ title: "Login Required", description: "Please login to like posts", variant: "destructive" });
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/announcements/${announcementId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setAnnouncements(prev => prev.map(a => 
        a.id === announcementId 
          ? { ...a, likes: response.data.likes, likedBy: response.data.liked ? [...(a.likedBy || []), user.id] : (a.likedBy || []).filter(id => id !== user.id) }
          : a
      ));
    } catch (error) {
      // Fallback for mock data
      setAnnouncements(prev => prev.map(a => {
        if (a.id === announcementId) {
          const isLiked = (a.likedBy || []).includes(user?.id);
          return {
            ...a,
            likes: isLiked ? a.likes - 1 : a.likes + 1,
            likedBy: isLiked ? (a.likedBy || []).filter(id => id !== user?.id) : [...(a.likedBy || []), user?.id]
          };
        }
        return a;
      }));
    }
  };

  // Handle comment
  const handleComment = async (announcementId) => {
    if (!user) {
      toast({ title: "Login Required", description: "Please login to comment", variant: "destructive" });
      return;
    }

    const content = newComment[announcementId]?.trim();
    if (!content) return;

    setCommentLoading(prev => ({ ...prev, [announcementId]: true }));

    try {
      await axios.post(
        `${API_URL}/api/announcements/${announcementId}/comment`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNewComment(prev => ({ ...prev, [announcementId]: '' }));
      toast({ title: "Comment added", description: "Your comment has been posted" });
      
      // Refresh to get updated comments
      fetchAnnouncements();
    } catch (error) {
      toast({ 
        title: "Error", 
        description: error.response?.data?.detail || "Failed to add comment", 
        variant: "destructive" 
      });
    } finally {
      setCommentLoading(prev => ({ ...prev, [announcementId]: false }));
    }
  };

  // Handle share
  const handleShare = (platform, announcement) => {
    const url = `${window.location.origin}/jobs/${announcement.id}`;
    const text = `${announcement.title} - Maritime Career Opportunity`;
    
    const shareUrls = {
      copy: () => {
        navigator.clipboard.writeText(url);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
        toast({ title: "Link copied!", description: "Share link copied to clipboard" });
      },
      whatsapp: () => window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`, '_blank'),
      facebook: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank'),
      linkedin: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank'),
      twitter: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
    };
    
    if (shareUrls[platform]) {
      shareUrls[platform]();
    }
    setShowShareDialog(null);
  };

  // Admin: Create/Update announcement
  const handleSaveAnnouncement = async () => {
    if (!formData.title.trim() || !formData.body.trim()) {
      toast({ title: "Error", description: "Title and body are required", variant: "destructive" });
      return;
    }

    const data = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      positions: formData.positions
    };

    try {
      if (editingAnnouncement) {
        await axios.put(
          `${API_URL}/api/announcements/${editingAnnouncement.id}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast({ title: "Success", description: "Announcement updated" });
      } else {
        await axios.post(
          `${API_URL}/api/announcements`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast({ title: "Success", description: "Announcement created" });
      }
      
      setShowCreateDialog(false);
      setEditingAnnouncement(null);
      resetForm();
      fetchAnnouncements();
    } catch (error) {
      toast({ 
        title: "Error", 
        description: error.response?.data?.detail || "Failed to save announcement", 
        variant: "destructive" 
      });
    }
  };

  // Admin: Delete announcement
  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;

    try {
      await axios.delete(
        `${API_URL}/api/announcements/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({ title: "Success", description: "Announcement deleted" });
      fetchAnnouncements();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete announcement", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      coverImage: '',
      body: '',
      positions: [],
      contactInfo: '',
      tags: '',
      status: 'published'
    });
  };

  const openEditDialog = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      coverImage: announcement.coverImage || '',
      body: announcement.body,
      positions: announcement.positions || [],
      contactInfo: announcement.contactInfo || '',
      tags: (announcement.tags || []).join(', '),
      status: announcement.status || 'published'
    });
    setShowCreateDialog(true);
  };

  const addPosition = () => {
    setFormData(prev => ({
      ...prev,
      positions: [...prev.positions, { title: '', description: '' }]
    }));
  };

  const updatePosition = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      positions: prev.positions.map((p, i) => i === index ? { ...p, [field]: value } : p)
    }));
  };

  const removePosition = (index) => {
    setFormData(prev => ({
      ...prev,
      positions: prev.positions.filter((_, i) => i !== index)
    }));
  };

  // Filter announcements
  const filteredAnnouncements = announcements.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.tags || []).some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-sky-700 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-700 to-sky-900 rounded-full mb-4">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-sky-950 mb-2">
            Maritime Job Openings
          </h1>
          <p className="text-lg text-gray-600">
            Career opportunities and announcements for seafarers
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Admin: Create Button */}
        {isAdmin && (
          <div className="mb-6">
            <Button 
              onClick={() => { resetForm(); setEditingAnnouncement(null); setShowCreateDialog(true); }}
              className="bg-gradient-to-r from-sky-700 to-sky-900"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Announcement
            </Button>
          </div>
        )}

        {/* Announcements Feed */}
        <div className="space-y-6">
          {filteredAnnouncements.map((announcement) => (
            <Card key={announcement.id} className="overflow-hidden shadow-lg">
              {/* Cover Image */}
              {announcement.coverImage && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={announcement.coverImage} 
                    alt={announcement.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                {/* Admin Actions */}
                {isAdmin && (
                  <div className="flex justify-end gap-2 mb-4">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(announcement)}>
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteAnnouncement(announcement.id)}>
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                )}

                {/* Title */}
                <h2 className="text-2xl font-bold text-sky-950 mb-2">
                  {announcement.title}
                </h2>

                {/* Meta */}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span>Posted by {announcement.authorName}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(announcement.createdAt)}</span>
                </div>

                {/* Body - Preserve formatting */}
                <div className="prose prose-sm max-w-none text-gray-700 mb-6 whitespace-pre-line">
                  {announcement.body}
                </div>

                {/* Positions List */}
                {announcement.positions && announcement.positions.length > 0 && (
                  <div className="bg-sky-50 rounded-lg p-4 mb-6">
                    <h3 className="font-bold text-sky-900 mb-3 flex items-center">
                      <Ship className="w-5 h-5 mr-2" />
                      Open Positions
                    </h3>
                    <ol className="list-decimal list-inside space-y-2">
                      {announcement.positions.map((pos, idx) => (
                        <li key={idx} className="text-gray-700">
                          <span className="font-semibold">{pos.title}</span>
                          {pos.description && (
                            <span className="text-gray-600"> – {pos.description}</span>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Contact Info */}
                {announcement.contactInfo && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <h3 className="font-bold text-green-800 mb-2 flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      How to Apply
                    </h3>
                    <p className="text-green-700 whitespace-pre-line text-sm">
                      {announcement.contactInfo}
                    </p>
                  </div>
                )}

                {/* Tags */}
                {announcement.tags && announcement.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {announcement.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-sky-100 text-sky-800">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Social Bar */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Like */}
                      <button
                        onClick={() => handleLike(announcement.id)}
                        className={`flex items-center space-x-1 transition-colors ${
                          (announcement.likedBy || []).includes(user?.id)
                            ? 'text-red-600'
                            : 'text-gray-600 hover:text-red-600'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${(announcement.likedBy || []).includes(user?.id) ? 'fill-current' : ''}`} />
                        <span className="text-sm font-medium">{announcement.likes || 0}</span>
                      </button>

                      {/* Comments */}
                      <button
                        onClick={() => setExpandedComments(prev => ({ ...prev, [announcement.id]: !prev[announcement.id] }))}
                        className="flex items-center space-x-1 text-gray-600 hover:text-sky-700 transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">{announcement.commentsCount || 0}</span>
                      </button>

                      {/* Share */}
                      <button
                        onClick={() => setShowShareDialog(announcement.id)}
                        className="flex items-center space-x-1 text-gray-600 hover:text-sky-700 transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                        <span className="text-sm font-medium">Share</span>
                      </button>
                    </div>
                  </div>

                  {/* Share Dialog */}
                  {showShareDialog === announcement.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">Share this opportunity</h4>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleShare('copy', announcement)}>
                          {copiedLink ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                          Copy Link
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleShare('whatsapp', announcement)} className="text-green-600 border-green-600 hover:bg-green-50">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          WhatsApp
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleShare('facebook', announcement)} className="text-blue-600 border-blue-600 hover:bg-blue-50">
                          <Facebook className="w-4 h-4 mr-1" />
                          Facebook
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleShare('linkedin', announcement)} className="text-blue-700 border-blue-700 hover:bg-blue-50">
                          <Linkedin className="w-4 h-4 mr-1" />
                          LinkedIn
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleShare('twitter', announcement)} className="text-gray-900 border-gray-900 hover:bg-gray-50">
                          <Twitter className="w-4 h-4 mr-1" />
                          X
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setShowShareDialog(null)} className="mt-2">
                        Close
                      </Button>
                    </div>
                  )}

                  {/* Comments Section */}
                  {expandedComments[announcement.id] && (
                    <div className="mt-4 pt-4 border-t">
                      {/* Add Comment */}
                      {user ? (
                        <div className="flex gap-2 mb-4">
                          <div className="w-8 h-8 rounded-full bg-sky-200 flex items-center justify-center flex-shrink-0">
                            <span className="text-sky-800 font-semibold text-sm">{user.fullName?.[0] || 'U'}</span>
                          </div>
                          <div className="flex-1 flex gap-2">
                            <Input
                              placeholder="Write a comment..."
                              value={newComment[announcement.id] || ''}
                              onChange={(e) => setNewComment(prev => ({ ...prev, [announcement.id]: e.target.value }))}
                              onKeyPress={(e) => e.key === 'Enter' && handleComment(announcement.id)}
                              maxLength={1000}
                            />
                            <Button 
                              size="sm" 
                              onClick={() => handleComment(announcement.id)}
                              disabled={commentLoading[announcement.id]}
                              className="bg-sky-700 hover:bg-sky-800"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 mb-4">
                          <a href="/login" className="text-sky-700 hover:underline">Login</a> to add a comment
                        </p>
                      )}

                      {/* Comments List */}
                      <div className="space-y-3">
                        {(announcement.comments || []).length === 0 ? (
                          <p className="text-sm text-gray-500 text-center py-4">
                            No comments yet. Be the first to comment!
                          </p>
                        ) : (
                          (announcement.comments || []).map((comment) => (
                            <div key={comment.id} className="flex gap-2">
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                <span className="text-gray-700 font-semibold text-sm">
                                  {comment.displayName?.[0] || 'U'}
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className="bg-gray-100 rounded-lg p-3">
                                  <p className="font-semibold text-sm text-gray-900">{comment.displayName}</p>
                                  <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatDate(comment.createdAt)}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No announcements found</h3>
            <p className="text-gray-600">Check back later for new job opportunities</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-sky-700 to-sky-900 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Apply?</h3>
          <p className="text-sky-100 mb-6 text-lg">
            Create your professional Seaman CV and stand out to recruiters!
          </p>
          <Button asChild size="lg" className="bg-white text-sky-900 hover:bg-sky-50">
            <a href="/builder">Create Your CV Now</a>
          </Button>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., NMDC Group – Career Opportunities in the UAE"
              />
            </div>

            <div>
              <Label>Cover Image URL (optional)</Label>
              <Input
                value={formData.coverImage}
                onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <Label>Body Content *</Label>
              <Textarea
                value={formData.body}
                onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                placeholder="Write your announcement content here. Use line breaks for paragraphs."
                rows={6}
              />
            </div>

            <div>
              <Label className="flex items-center justify-between">
                <span>Positions</span>
                <Button type="button" variant="outline" size="sm" onClick={addPosition}>
                  <Plus className="w-4 h-4 mr-1" /> Add Position
                </Button>
              </Label>
              <div className="space-y-2 mt-2">
                {formData.positions.map((pos, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <div className="flex-1 space-y-2">
                      <Input
                        value={pos.title}
                        onChange={(e) => updatePosition(idx, 'title', e.target.value)}
                        placeholder="Position title"
                      />
                      <Input
                        value={pos.description}
                        onChange={(e) => updatePosition(idx, 'description', e.target.value)}
                        placeholder="Requirements/description"
                      />
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removePosition(idx)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Contact Information</Label>
              <Textarea
                value={formData.contactInfo}
                onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: e.target.value }))}
                placeholder="Email, phone, or application instructions"
                rows={3}
              />
            </div>

            <div>
              <Label>Tags (comma-separated)</Label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="UAE, Offshore, Urgent, Container"
              />
            </div>

            <div>
              <Label>Status</Label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAnnouncement} className="bg-sky-700 hover:bg-sky-800">
              {editingAnnouncement ? 'Update' : 'Publish'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaritimeJobOpenings;
