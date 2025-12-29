export const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and professional design',
    color: '#991B1B',
    thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=500&fit=crop'
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional and elegant',
    color: '#1E40AF',
    thumbnail: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=400&h=500&fit=crop'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold and distinctive',
    color: '#065F46',
    thumbnail: 'https://images.unsplash.com/photo-1586281380384-7a2e3d5c1b00?w=400&h=500&fit=crop'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and refined',
    color: '#374151',
    thumbnail: 'https://images.unsplash.com/photo-1586281380614-e159c7ff3a6f?w=400&h=500&fit=crop'
  }
];

export const reviews = [
  {
    id: 1,
    name: 'Arie Hylkema',
    text: 'Simple to use. The user interface is really nice, I didn\'t feel burdened by the formats offered. The end product looks great.',
    rating: 5
  },
  {
    id: 2,
    name: 'Mark',
    text: 'Great site for quickly building a good looking resume. I\'ve been using it for years and I\'ve gotten 3 jobs over the last 7 years or so using resumes generated here.',
    rating: 5
  },
  {
    id: 3,
    name: 'Matt F.',
    text: 'Great and easy way to generate a good looking CV/Resume',
    rating: 5
  },
  {
    id: 4,
    name: 'Alex Mascarenhas',
    text: 'Great, Easy, Efficient! Highly recommend for anyone looking to create a professional resume quickly.',
    rating: 5
  },
  {
    id: 5,
    name: 'Sarah Johnson',
    text: 'The templates are beautiful and the editor is intuitive. Got my dream job thanks to this!',
    rating: 5
  }
];

export const sampleCV = {
  personalInfo: {
    fullName: 'Austin Clark',
    email: 'austin.clark@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    title: 'Product Manager',
    summary: 'Dynamic and result-oriented Chief Product Officer with over 8 years of experience in tech companies. Proven track record in product development, team leadership, and strategic planning. Skilled in Agile methodologies, user experience design, and cross-functional collaboration. Passionate about creating innovative products that solve real-world problems.'
  },
  experience: [
    {
      id: 1,
      position: 'Vice President of Product Development',
      employer: 'Tech Innovations Inc.',
      location: 'San Francisco, CA',
      startDate: 'Jan 2020',
      endDate: 'Present',
      current: true,
      description: [
        'Spearheaded the launch of 3 groundbreaking products, resulting in a 45% increase in annual revenue',
        'Led a team of 25 product managers and designers, fostering a culture of innovation and collaboration',
        'Implemented data-driven decision-making processes, improving product-market fit by 60%',
        'Established and maintained strategic partnerships with key industry players'
      ]
    },
    {
      id: 2,
      position: 'Chief Product Officer (CPO)',
      employer: 'Digital Solutions Ltd.',
      location: 'New York, NY',
      startDate: 'Mar 2017',
      endDate: 'Dec 2019',
      current: false,
      description: [
        'Spearheaded the launch of two industry-leading products, increasing market share by 35%',
        'Led a cross-functional team of 30+ product managers, designers, and engineers',
        'Implemented Agile and Lean methodologies, reducing time-to-market by 40%',
        'Collaborated closely with C-suite executives to align product strategy with business goals'
      ]
    }
  ],
  education: [
    {
      id: 1,
      degree: 'Bachelor of Business Administration (BBA)',
      institution: 'University of California',
      location: 'Berkeley, CA',
      graduationDate: 'May 2015',
      description: 'Major in Marketing, Minor in Computer Science'
    }
  ],
  skills: [
    { name: 'Product Strategy', level: 5 },
    { name: 'Agile/Scrum', level: 5 },
    { name: 'User Experience Design', level: 4 },
    { name: 'Data Analysis', level: 4 },
    { name: 'Team Leadership', level: 5 },
    { name: 'Strategic Planning', level: 5 }
  ],
  languages: [
    { name: 'English', level: 'Native' },
    { name: 'Spanish', level: 'Professional' }
  ]
};

export const howItWorksSteps = [
  {
    step: 1,
    title: 'Fill in your details',
    description: 'Enter your personal information, work experience, education, and skills in our easy-to-use form.'
  },
  {
    step: 2,
    title: 'Choose a template',
    description: 'Select from our collection of professional templates designed to make you stand out.'
  },
  {
    step: 3,
    title: 'Download your resume',
    description: 'Preview and download your polished resume in PDF format, ready to send to employers.'
  }
];