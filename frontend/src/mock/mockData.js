export const templates = [
  {
    id: 'nautical',
    name: 'Nautical',
    description: 'Professional maritime design',
    color: '#0C4A6E',
    thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=500&fit=crop'
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Clean and modern seafarer',
    color: '#0369A1',
    thumbnail: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=400&h=500&fit=crop'
  },
  {
    id: 'maritime',
    name: 'Maritime',
    description: 'Bold officer profile',
    color: '#075985',
    thumbnail: 'https://images.unsplash.com/photo-1586281380384-7a2e3d5c1b00?w=400&h=500&fit=crop'
  },
  {
    id: 'anchor',
    name: 'Anchor',
    description: 'Traditional seafarer style',
    color: '#1E3A8A',
    thumbnail: 'https://images.unsplash.com/photo-1586281380614-e159c7ff3a6f?w=400&h=500&fit=crop'
  }
];

export const reviews = [
  {
    id: 1,
    name: 'Captain John Martinez',
    text: 'Perfect for maritime professionals! Created my CV in minutes and got my Chief Officer position. The templates are exactly what shipping companies look for.',
    rating: 5
  },
  {
    id: 2,
    name: 'Engineer Mike Chen',
    text: 'As a marine engineer, I needed a professional CV fast. This tool made it so easy. Already used it for 3 different company applications.',
    rating: 5
  },
  {
    id: 3,
    name: 'Deck Officer Sarah Williams',
    text: 'Great tool for seafarers! The interface is simple and the CV looks very professional. Highly recommend for all maritime crew.',
    rating: 5
  },
  {
    id: 4,
    name: 'AB Seaman Robert Kim',
    text: 'Easy to use even for us able seamen. Made my CV look professional and landed me a contract with a premium cruise line.',
    rating: 5
  },
  {
    id: 5,
    name: 'Chief Engineer David Brown',
    text: 'Excellent CV builder for maritime industry. The seaman-focused templates really help highlight our unique qualifications and sea service.',
    rating: 5
  }
];

export const sampleCV = {
  personalInfo: {
    fullName: 'Captain James Anderson',
    email: 'james.anderson@maritime.com',
    phone: '+1 (555) 789-0123',
    location: 'Miami, Florida, USA',
    title: 'Master Mariner (Chief Officer)',
    summary: 'Experienced Master Mariner with over 12 years of sea service on various vessel types including Container Ships, Bulk Carriers, and Tankers. Hold unlimited Master Certificate and possess excellent navigation, cargo operations, and crew management skills. Strong safety record and commitment to environmental protection. Seeking Chief Officer position with reputable shipping company.'
  },
  experience: [
    {
      id: 1,
      position: 'Second Officer',
      employer: 'Maersk Line',
      location: 'Container Vessels - Worldwide',
      startDate: 'Jan 2020',
      endDate: 'Present',
      current: true,
      description: [
        'Navigation watch keeping on 14,000 TEU container vessels',
        'Cargo operations planning and supervision for containerized cargo',
        'ECDIS, radar navigation and collision avoidance',
        'Port operations and pilot coordination',
        'ISM and ISPS Code compliance',
        'Emergency response team leader'
      ]
    },
    {
      id: 2,
      position: 'Third Officer',
      employer: 'Pacific Shipping Ltd.',
      location: 'Bulk Carriers - Trans-Pacific',
      startDate: 'Mar 2017',
      endDate: 'Dec 2019',
      current: false,
      description: [
        'Bridge watch keeping 4-8 hours daily',
        'Cargo securing and loading plan preparation',
        'Safety officer - fire fighting and life saving equipment',
        'Maintained charts and publications',
        'Assisted in ballast water management',
        'Meteorological observations and reporting'
      ]
    }
  ],
  education: [
    {
      id: 1,
      degree: 'Master Mariner Certificate (Unlimited)',
      institution: 'US Merchant Marine Academy',
      location: 'Kings Point, NY',
      graduationDate: 'May 2016',
      description: 'STCW II/2 Chief Mate Certification | Bachelor of Science in Marine Transportation'
    },
    {
      id: 2,
      degree: 'Officer of the Watch Certificate',
      institution: 'Maritime Training Institute',
      location: 'Houston, TX',
      graduationDate: 'June 2014',
      description: 'STCW II/1 OOW Certification'
    }
  ],
  skills: [
    { name: 'Navigation & Bridge Watchkeeping', level: 5 },
    { name: 'ECDIS & Radar Operations', level: 5 },
    { name: 'Cargo Operations', level: 5 },
    { name: 'Ship Stability & Trim', level: 4 },
    { name: 'ISM/ISPS Compliance', level: 5 },
    { name: 'Crew Management', level: 4 }
  ],
  languages: [
    { name: 'English', level: 'Native' },
    { name: 'Spanish', level: 'Intermediate' }
  ]
};

export const howItWorksSteps = [
  {
    step: 1,
    title: 'Enter your sea service',
    description: 'Fill in your personal details, certificates, sea service experience, vessel types, and maritime skills.'
  },
  {
    step: 2,
    title: 'Choose maritime template',
    description: 'Select from our professional seaman CV templates designed specifically for maritime industry.'
  },
  {
    step: 3,
    title: 'Download your Seaman CV',
    description: 'Preview your professional maritime CV and download in PDF format to apply for your next vessel.'
  }
];