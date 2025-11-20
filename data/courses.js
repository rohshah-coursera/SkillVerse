// Course data structure mapping courses to skills
export const courses = {
  "Data Science": [
    {
      id: "ds-fundamentals",
      title: "Data Science Fundamentals",
      description: "Master the core concepts of data science including Python, statistics, and data analysis.",
      instructor: "Dr. Sarah Johnson",
      duration: "8 weeks",
      level: "Beginner",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop",
      lessons: [
        {
          id: "lesson-1",
          title: "Introduction to Python",
          modules: [
            { id: "module-1", skillName: "Python", completed: false }
          ]
        },
        {
          id: "lesson-2",
          title: "Data Manipulation",
          modules: [
            { id: "module-2", skillName: "Pandas", completed: false }
          ]
        }
      ]
    },
    {
      id: "ml-mastery",
      title: "Machine Learning Mastery",
      description: "Deep dive into machine learning algorithms and techniques.",
      instructor: "Prof. Michael Chen",
      duration: "12 weeks",
      level: "Intermediate",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=450&fit=crop",
      lessons: [
        {
          id: "lesson-1",
          title: "Introduction to Machine Learning",
          modules: [
            { id: "module-1", skillName: "Machine Learning", completed: false }
          ]
        },
        {
          id: "lesson-2",
          title: "Supervised Learning",
          modules: [
            { id: "module-2", skillName: "Scikit-learn", completed: false }
          ]
        }
      ]
    },
    // Demo Course 1: Quick Python Intro (2 modules, 1-2 videos each)
    {
      id: "demo-python-quickstart",
      title: "Python Quick Start",
      description: "A quick introduction to Python programming basics. Perfect for beginners!",
      instructor: "LearnQuest Team",
      duration: "1 week",
      level: "Beginner",
      image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=450&fit=crop",
      lessons: [
        {
          id: "lesson-1",
          title: "Python Basics",
          modules: [
            { id: "module-1", skillName: "Python Syntax", completed: false }
          ]
        },
        {
          id: "lesson-2",
          title: "Control Flow",
          modules: [
            { id: "module-2", skillName: "Variables and Data Types", completed: false }
          ]
        }
      ]
    }
  ],
  "IT": [
    {
      id: "cloud-computing",
      title: "Cloud Computing Essentials",
      description: "Learn cloud platforms and infrastructure management.",
      instructor: "Alex Rodriguez",
      duration: "10 weeks",
      level: "Beginner",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop",
      lessons: [
        {
          id: "lesson-1",
          title: "Cloud Fundamentals",
          modules: [
            { id: "module-1", skillName: "Cloud Computing", completed: false }
          ]
        },
        {
          id: "lesson-2",
          title: "Infrastructure as Code",
          modules: [
            { id: "module-2", skillName: "AWS", completed: false }
          ]
        }
      ]
    },
    // Demo Course 2: Web Development Basics (2 modules, 1-2 videos each)
    {
      id: "demo-web-basics",
      title: "Web Development Basics",
      description: "Learn the fundamentals of web development in this quick demo course.",
      instructor: "LearnQuest Team",
      duration: "1 week",
      level: "Beginner",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop",
      lessons: [
        {
          id: "lesson-1",
          title: "HTML Fundamentals",
          modules: [
            { id: "module-1", skillName: "HTML", completed: false }
          ]
        },
        {
          id: "lesson-2",
          title: "JavaScript Introduction",
          modules: [
            { id: "module-2", skillName: "CSS Basics", completed: false }
          ]
        }
      ]
    }
  ],
  "Cybersecurity": [
    {
      id: "cyber-fundamentals",
      title: "Cybersecurity Fundamentals",
      description: "Essential cybersecurity skills and practices.",
      instructor: "Dr. Emily Watson",
      duration: "10 weeks",
      level: "Beginner",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=450&fit=crop",
      lessons: [
        {
          id: "lesson-1",
          title: "Network Security",
          modules: [
            { id: "module-1", skillName: "Network Security", completed: false }
          ]
        },
        {
          id: "lesson-2",
          title: "Penetration Testing",
          modules: [
            { id: "module-2", skillName: "Firewall Management", completed: false }
          ]
        }
      ]
    }
  ],
  "Healthcare": [
    {
      id: "healthcare-basics",
      title: "Healthcare Basics",
      description: "Introduction to healthcare practices and patient care.",
      instructor: "Dr. James Wilson",
      duration: "8 weeks",
      level: "Beginner",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=450&fit=crop",
      lessons: [
        {
          id: "lesson-1",
          title: "Patient Care",
          modules: [
            { id: "module-1", skillName: "Patient Care", completed: false }
          ]
        },
        {
          id: "lesson-2",
          title: "Healthcare Practices",
          modules: [
            { id: "module-2", skillName: "Medical Terminology", completed: false }
          ]
        }
      ]
    }
  ],
  "Sales": [
    {
      id: "sales-mastery",
      title: "Sales Mastery",
      description: "Master the art of sales and customer relationships.",
      instructor: "Lisa Anderson",
      duration: "6 weeks",
      level: "Beginner",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop",
      lessons: [
        {
          id: "lesson-1",
          title: "Sales Fundamentals",
          modules: [
            { id: "module-1", skillName: "CRM", completed: false }
          ]
        },
        {
          id: "lesson-2",
          title: "Sales Techniques",
          modules: [
            { id: "module-2", skillName: "Lead Generation", completed: false }
          ]
        }
      ]
    }
  ]
}

// Skills definitions by domain (for SkillGraph)
export const skills = {
  "Data Science": [
    { name: "Python", description: "Programming language for data science", level: 1 },
    { name: "Jupyter Notebooks", description: "Interactive computing environment", level: 1 },
    { name: "Pandas", description: "Data manipulation and analysis library", level: 2 },
    { name: "NumPy", description: "Numerical computing library", level: 2 },
    { name: "Data Cleaning", description: "Preparing data for analysis", level: 2 },
    { name: "Statistics", description: "Statistical analysis and methods", level: 3 },
    { name: "Hypothesis Testing", description: "Statistical hypothesis testing", level: 3 },
    { name: "Exploratory Data Analysis", description: "EDA techniques and visualization", level: 3 },
    { name: "Data Visualization", description: "Creating visual representations of data", level: 4 },
    { name: "Matplotlib", description: "Python plotting library", level: 4 },
    { name: "Seaborn", description: "Statistical data visualization", level: 4 },
    { name: "Machine Learning", description: "ML algorithms and techniques", level: 5 },
    { name: "Scikit-learn", description: "Machine learning library", level: 5 },
    { name: "Classification", description: "Classification algorithms", level: 6 },
    { name: "Regression Analysis", description: "Regression modeling techniques", level: 6 },
    { name: "Model Evaluation", description: "Evaluating ML model performance", level: 6 },
    { name: "Clustering", description: "Unsupervised clustering algorithms", level: 7 },
    { name: "Dimensionality Reduction", description: "Feature reduction techniques", level: 7 },
    { name: "Deep Learning", description: "Deep neural networks", level: 8 },
    { name: "Neural Networks", description: "Artificial neural networks", level: 8 },
    { name: "TensorFlow", description: "Deep learning framework", level: 8 },
    { name: "Python Syntax", description: "Basic Python programming syntax", level: 1 },
    { name: "Variables and Data Types", description: "Understanding Python variables", level: 1 },
    { name: "Conditional Statements", description: "If/else and control flow", level: 2 }
  ],
  "IT": [
    { name: "Cloud Computing", description: "Cloud platforms and services", level: 1 },
    { name: "AWS", description: "Amazon Web Services", level: 2 },
    { name: "Infrastructure as Code", description: "IaC principles and tools", level: 3 },
    { name: "Docker", description: "Containerization platform", level: 3 },
    { name: "Kubernetes", description: "Container orchestration", level: 4 },
    { name: "HTML", description: "HyperText Markup Language", level: 1 },
    { name: "CSS Basics", description: "Cascading Style Sheets fundamentals", level: 1 },
    { name: "JavaScript", description: "JavaScript programming language", level: 2 }
  ],
  "Cybersecurity": [
    { name: "Network Security", description: "Securing network infrastructure", level: 1 },
    { name: "Firewall Management", description: "Configuring and managing firewalls", level: 2 },
    { name: "Penetration Testing", description: "Security testing methodologies", level: 3 },
    { name: "Ethical Hacking", description: "Authorized security testing", level: 4 }
  ],
  "Healthcare": [
    { name: "Patient Care", description: "Fundamentals of patient care", level: 1 },
    { name: "Medical Terminology", description: "Medical terms and vocabulary", level: 1 }
  ],
  "Sales": [
    { name: "CRM", description: "Customer Relationship Management", level: 1 },
    { name: "Lead Generation", description: "Finding and attracting customers", level: 2 },
    { name: "Negotiation", description: "Sales negotiation techniques", level: 3 }
  ]
}

// Badge definitions - includes mid-course and end-course badges
export const badges = {
  // Data Science Fundamentals badges
  "ds-fundamentals": {
    name: "Data Science Fundamentals",
    icon: "📊",
    description: "Completed Data Science Fundamentals course",
    midCourse: {
      id: "ds-fundamentals-mid",
      name: "Data Analyst",
      icon: "📈",
      description: "Completed 50% of Data Science Fundamentals",
      milestone: 0.5 // Awarded at 50% completion
    },
    endCourse: {
      id: "ds-fundamentals-end",
      name: "Data Science Expert",
      icon: "📊",
      description: "Completed Data Science Fundamentals course"
    }
  },
  // Machine Learning Mastery badges
  "ml-mastery": {
    name: "Machine Learning Master",
    icon: "🤖",
    description: "Completed Machine Learning Mastery course",
    midCourse: {
      id: "ml-mastery-mid",
      name: "ML Practitioner",
      icon: "🧠",
      description: "Completed 50% of Machine Learning Mastery",
      milestone: 0.5
    },
    endCourse: {
      id: "ml-mastery-end",
      name: "Machine Learning Master",
      icon: "🤖",
      description: "Completed Machine Learning Mastery course"
    }
  },
  // Cloud Computing badges
  "cloud-computing": {
    name: "Cloud Expert",
    icon: "☁️",
    description: "Completed Cloud Computing Essentials course",
    midCourse: {
      id: "cloud-computing-mid",
      name: "Cloud Enthusiast",
      icon: "☁️",
      description: "Completed 50% of Cloud Computing Essentials",
      milestone: 0.5
    },
    endCourse: {
      id: "cloud-computing-end",
      name: "Cloud Expert",
      icon: "☁️",
      description: "Completed Cloud Computing Essentials course"
    }
  },
  // Cybersecurity badges
  "cyber-fundamentals": {
    name: "Cybersecurity Specialist",
    icon: "🔒",
    description: "Completed Cybersecurity Fundamentals course",
    midCourse: {
      id: "cyber-fundamentals-mid",
      name: "Security Analyst",
      icon: "🛡️",
      description: "Completed 50% of Cybersecurity Fundamentals",
      milestone: 0.5
    },
    endCourse: {
      id: "cyber-fundamentals-end",
      name: "Cybersecurity Specialist",
      icon: "🔒",
      description: "Completed Cybersecurity Fundamentals course"
    }
  },
  // Healthcare badges
  "healthcare-basics": {
    name: "Healthcare Professional",
    icon: "🏥",
    description: "Completed Healthcare Basics course",
    midCourse: {
      id: "healthcare-basics-mid",
      name: "Care Provider",
      icon: "💊",
      description: "Completed 50% of Healthcare Basics",
      milestone: 0.5
    },
    endCourse: {
      id: "healthcare-basics-end",
      name: "Healthcare Professional",
      icon: "🏥",
      description: "Completed Healthcare Basics course"
    }
  },
  // Sales badges
  "sales-mastery": {
    name: "Sales Champion",
    icon: "💼",
    description: "Completed Sales Mastery course",
    midCourse: {
      id: "sales-mastery-mid",
      name: "Sales Pro",
      icon: "📞",
      description: "Completed 50% of Sales Mastery",
      milestone: 0.5
    },
    endCourse: {
      id: "sales-mastery-end",
      name: "Sales Champion",
      icon: "💼",
      description: "Completed Sales Mastery course"
    }
  },
  // Demo Python Quick Start badges
  "demo-python-quickstart": {
    name: "Python Quick Starter",
    icon: "🐍",
    description: "Completed Python Quick Start course",
    midCourse: {
      id: "demo-python-quickstart-mid",
      name: "Python Beginner",
      icon: "🐍",
      description: "Completed 50% of Python Quick Start",
      milestone: 0.5
    },
    endCourse: {
      id: "demo-python-quickstart-end",
      name: "Python Quick Starter",
      icon: "🐍",
      description: "Completed Python Quick Start course"
    }
  },
  // Demo Web Development Basics badges
  "demo-web-basics": {
    name: "Web Developer",
    icon: "🌐",
    description: "Completed Web Development Basics course",
    midCourse: {
      id: "demo-web-basics-mid",
      name: "Web Enthusiast",
      icon: "💻",
      description: "Completed 50% of Web Development Basics",
      milestone: 0.5
    },
    endCourse: {
      id: "demo-web-basics-end",
      name: "Web Developer",
      icon: "🌐",
      description: "Completed Web Development Basics course"
    }
  }
}
