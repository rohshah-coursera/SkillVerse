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
      image: "📊",
      lessons: [
        {
          id: "lesson-1",
          title: "Introduction to Python",
          modules: [
            { id: "module-1", skillName: "Python", completed: false },
            { id: "module-2", skillName: "Jupyter Notebooks", completed: false }
          ]
        },
        {
          id: "lesson-2",
          title: "Data Manipulation",
          modules: [
            { id: "module-3", skillName: "Pandas", completed: false },
            { id: "module-4", skillName: "NumPy", completed: false },
            { id: "module-5", skillName: "Data Cleaning", completed: false }
          ]
        },
        {
          id: "lesson-3",
          title: "Statistical Analysis",
          modules: [
            { id: "module-6", skillName: "Statistics", completed: false },
            { id: "module-7", skillName: "Hypothesis Testing", completed: false },
            { id: "module-8", skillName: "Exploratory Data Analysis", completed: false }
          ]
        },
        {
          id: "lesson-4",
          title: "Data Visualization",
          modules: [
            { id: "module-9", skillName: "Data Visualization", completed: false },
            { id: "module-10", skillName: "Matplotlib", completed: false },
            { id: "module-11", skillName: "Seaborn", completed: false }
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
      image: "🤖",
      lessons: [
        {
          id: "lesson-1",
          title: "Introduction to Machine Learning",
          modules: [
            { id: "module-1", skillName: "Machine Learning", completed: false },
            { id: "module-2", skillName: "Scikit-learn", completed: false }
          ]
        },
        {
          id: "lesson-2",
          title: "Supervised Learning",
          modules: [
            { id: "module-3", skillName: "Classification", completed: false },
            { id: "module-4", skillName: "Regression Analysis", completed: false },
            { id: "module-5", skillName: "Model Evaluation", completed: false }
          ]
        },
        {
          id: "lesson-3",
          title: "Unsupervised Learning",
          modules: [
            { id: "module-6", skillName: "Clustering", completed: false },
            { id: "module-7", skillName: "Dimensionality Reduction", completed: false }
          ]
        },
        {
          id: "lesson-4",
          title: "Deep Learning",
          modules: [
            { id: "module-8", skillName: "Deep Learning", completed: false },
            { id: "module-9", skillName: "Neural Networks", completed: false },
            { id: "module-10", skillName: "TensorFlow", completed: false }
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
      image: "☁️",
      lessons: [
        {
          id: "lesson-1",
          title: "Cloud Fundamentals",
          modules: [
            { id: "module-1", skillName: "Cloud Computing", completed: false },
            { id: "module-2", skillName: "AWS", completed: false }
          ]
        },
        {
          id: "lesson-2",
          title: "Infrastructure as Code",
          modules: [
            { id: "module-3", skillName: "Infrastructure as Code", completed: false },
            { id: "module-4", skillName: "Docker", completed: false },
            { id: "module-5", skillName: "Kubernetes", completed: false }
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
      image: "🔒",
      lessons: [
        {
          id: "lesson-1",
          title: "Network Security",
          modules: [
            { id: "module-1", skillName: "Network Security", completed: false },
            { id: "module-2", skillName: "Firewall Management", completed: false }
          ]
        },
        {
          id: "lesson-2",
          title: "Penetration Testing",
          modules: [
            { id: "module-3", skillName: "Penetration Testing", completed: false },
            { id: "module-4", skillName: "Ethical Hacking", completed: false }
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
      image: "🏥",
      lessons: [
        {
          id: "lesson-1",
          title: "Patient Care",
          modules: [
            { id: "module-1", skillName: "Patient Care", completed: false },
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
      image: "💼",
      lessons: [
        {
          id: "lesson-1",
          title: "Sales Fundamentals",
          modules: [
            { id: "module-1", skillName: "CRM", completed: false },
            { id: "module-2", skillName: "Lead Generation", completed: false },
            { id: "module-3", skillName: "Negotiation", completed: false }
          ]
        }
      ]
    }
  ]
}

// Badge definitions
export const badges = {
  "ds-fundamentals": {
    name: "Data Science Fundamentals",
    icon: "📊",
    description: "Completed Data Science Fundamentals course"
  },
  "ml-mastery": {
    name: "Machine Learning Master",
    icon: "🤖",
    description: "Completed Machine Learning Mastery course"
  },
  "cloud-computing": {
    name: "Cloud Expert",
    icon: "☁️",
    description: "Completed Cloud Computing Essentials course"
  },
  "cyber-fundamentals": {
    name: "Cybersecurity Specialist",
    icon: "🔒",
    description: "Completed Cybersecurity Fundamentals course"
  },
  "healthcare-basics": {
    name: "Healthcare Professional",
    icon: "🏥",
    description: "Completed Healthcare Basics course"
  },
  "sales-mastery": {
    name: "Sales Champion",
    icon: "💼",
    description: "Completed Sales Mastery course"
  }
}

