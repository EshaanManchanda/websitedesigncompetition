import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Resource {
  id: number;
  title: string;
  description: string;
  type: 'tutorial' | 'tool' | 'inspiration' | 'guide';
  url: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: string;
}

interface ResourceCategory {
  title: string;
  description: string;
  resources: Resource[];
  color: string;
}

const Resources: React.FC = () => {
  const navigate = useNavigate();

  const resourceCategories: ResourceCategory[] = [
    {
      title: "Web Design Tutorials",
      description: "Learn the basics of web design with these fun and easy tutorials",
      color: "bg-purple-500",
      resources: [
        {
          id: 1,
          title: "HTML Basics for Kids",
          description: "Learn how to create your first webpage with simple HTML tags",
          type: "tutorial",
          url: "#",
          difficulty: "beginner",
          icon: "🏗️"
        },
        {
          id: 2,
          title: "CSS Colors and Styling",
          description: "Make your websites colorful and beautiful with CSS",
          type: "tutorial",
          url: "#",
          difficulty: "beginner",
          icon: "🎨"
        },
        {
          id: 3,
          title: "Creating Interactive Elements",
          description: "Add buttons, forms, and interactive features to your site",
          type: "tutorial",
          url: "#",
          difficulty: "intermediate",
          icon: "⚡"
        }
      ]
    },
    {
      title: "Design Tools",
      description: "Free and kid-friendly tools to help you create amazing websites",
      color: "bg-blue-500",
      resources: [
        {
          id: 4,
          title: "Canva for Kids",
          description: "Create graphics, logos, and images for your website",
          type: "tool",
          url: "#",
          difficulty: "beginner",
          icon: "🖼️"
        },
        {
          id: 5,
          title: "Scratch for Web",
          description: "Learn programming concepts with visual blocks",
          type: "tool",
          url: "#",
          difficulty: "beginner",
          icon: "🧩"
        },
        {
          id: 6,
          title: "CodePen Playground",
          description: "Experiment with HTML, CSS, and JavaScript online",
          type: "tool",
          url: "#",
          difficulty: "intermediate",
          icon: "💻"
        }
      ]
    },
    {
      title: "Inspiration Gallery",
      description: "Get inspired by amazing websites created by other young designers",
      color: "bg-green-500",
      resources: [
        {
          id: 7,
          title: "Award-Winning Kid Sites",
          description: "Browse through previous competition winners for inspiration",
          type: "inspiration",
          url: "#",
          difficulty: "beginner",
          icon: "🏆"
        },
        {
          id: 8,
          title: "Creative Design Ideas",
          description: "Unique themes and concepts for your next web project",
          type: "inspiration",
          url: "#",
          difficulty: "beginner",
          icon: "💡"
        },
        {
          id: 9,
          title: "Color Palette Generator",
          description: "Find the perfect color combinations for your website",
          type: "tool",
          url: "#",
          difficulty: "beginner",
          icon: "🌈"
        }
      ]
    },
    {
      title: "Learning Guides",
      description: "Step-by-step guides to help you master web design skills",
      color: "bg-orange-500",
      resources: [
        {
          id: 10,
          title: "Web Design Principles",
          description: "Learn about layout, typography, and visual hierarchy",
          type: "guide",
          url: "#",
          difficulty: "intermediate",
          icon: "📚"
        },
        {
          id: 11,
          title: "Mobile-Friendly Design",
          description: "Make sure your website looks great on phones and tablets",
          type: "guide",
          url: "#",
          difficulty: "advanced",
          icon: "📱"
        },
        {
          id: 12,
          title: "Accessibility for Everyone",
          description: "Create websites that everyone can use and enjoy",
          type: "guide",
          url: "#",
          difficulty: "intermediate",
          icon: "♿"
        }
      ]
    }
  ];

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'tutorial':
        return '📖';
      case 'tool':
        return '🛠️';
      case 'inspiration':
        return '✨';
      case 'guide':
        return '📋';
      default:
        return '📄';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Learning Resources 📚
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Everything you need to create amazing websites! From beginner tutorials to advanced guides.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-lg">
            <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              🎯 Step-by-step tutorials
            </span>
            <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              🛠️ Free design tools
            </span>
            <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              💡 Creative inspiration
            </span>
          </div>
        </div>
      </div>

      {/* Quick Tips Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 mb-12 text-white">
          <h2 className="text-3xl font-bold mb-4">💡 Quick Tips for Success</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🎯</div>
              <h3 className="font-bold mb-2">Start Simple</h3>
              <p>Begin with basic HTML and CSS before moving to advanced features</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🎨</div>
              <h3 className="font-bold mb-2">Be Creative</h3>
              <p>Don't be afraid to experiment with colors, fonts, and layouts</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🚀</div>
              <h3 className="font-bold mb-2">Practice Daily</h3>
              <p>The more you code, the better you'll become at web design</p>
            </div>
          </div>
        </div>

        {/* Resource Categories */}
        <div className="space-y-16">
          {resourceCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className={`${category.color} text-white p-8`}>
                <h2 className="text-3xl font-bold mb-2">{category.title}</h2>
                <p className="text-xl opacity-90">{category.description}</p>
              </div>
              
              <div className="p-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.resources.map((resource) => (
                    <div
                      key={resource.id}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-transparent hover:border-purple-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-3xl">{resource.icon}</div>
                        <div className="flex gap-2">
                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {getTypeIcon(resource.type)} {resource.type}
                          </span>
                          <span className={`text-sm px-2 py-1 rounded-full ${getDifficultyColor(resource.difficulty)}`}>
                            {resource.difficulty}
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 text-gray-800">
                        {resource.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {resource.description}
                      </p>
                      
                      {resource.url !== "#" ? (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 block text-center"
                        >
                          Explore Resource →
                        </a>
                      ) : (
                        <button
                          disabled
                          className="w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white py-2 px-4 rounded-lg font-semibold cursor-not-allowed opacity-60"
                          title="Coming soon"
                        >
                          Coming Soon
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Help Section */}
        <div className="mt-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Need More Help? 🤝</h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Our community is here to support you! Join our forums, ask questions, and share your creations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              disabled
              className="bg-white/50 text-indigo-400 px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
              title="Coming soon"
            >
              Join Community Forum
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
            >
              Contact Mentors
            </button>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            🎯 Track Your Learning Progress
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-3xl mb-2">✅</div>
              <h3 className="font-bold text-green-800">Beginner</h3>
              <p className="text-sm text-green-600">HTML & CSS Basics</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-xl">
              <div className="text-3xl mb-2">🔄</div>
              <h3 className="font-bold text-yellow-800">Intermediate</h3>
              <p className="text-sm text-yellow-600">Interactive Elements</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-3xl mb-2">⏳</div>
              <h3 className="font-bold text-blue-800">Advanced</h3>
              <p className="text-sm text-blue-600">Responsive Design</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-3xl mb-2">🏆</div>
              <h3 className="font-bold text-purple-800">Expert</h3>
              <p className="text-sm text-purple-600">Competition Ready</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;