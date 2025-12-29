import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useDates } from '@/hooks/useDates';

interface CategoryData {
  id: string;
  title: string;
  ageRange: string;
  theme: string;
  description: string;
  skills: string[];
  color: string;
  bgGradient: string;
}

const Categories: React.FC = () => {
  const { submissionDeadlineFull } = useDates();

  const categories: CategoryData[] = [
    {
      id: 'junior',
      title: 'Junior Designers',
      ageRange: '8-11 years',
      theme: 'My Dream Playground',
      description: 'Design a website about your perfect playground! Show us swings, slides, and all the fun things you would include.',
      skills: ['Basic HTML', 'Simple CSS', 'Creativity', 'Color usage'],
      color: 'text-pink-600',
      bgGradient: 'from-pink-100 to-purple-100'
    },
    {
      id: 'intermediate',
      title: 'Intermediate Creators',
      ageRange: '12-14 years',
      theme: 'Eco-Friendly Future',
      description: 'Create a website promoting environmental awareness and sustainability. Show how we can make our planet greener!',
      skills: ['HTML & CSS', 'Basic JavaScript', 'Responsive design', 'User experience'],
      color: 'text-green-600',
      bgGradient: 'from-green-100 to-blue-100'
    },
    {
      id: 'senior',
      title: 'Senior Developers',
      ageRange: '15-17 years',
      theme: 'Technology for Good',
      description: 'Build a website showcasing how technology can solve real-world problems and help communities.',
      skills: ['Advanced HTML/CSS', 'JavaScript frameworks', 'API integration', 'Advanced UX/UI'],
      color: 'text-blue-600',
      bgGradient: 'from-blue-100 to-indigo-100'
    }
  ];

  return (
    <section id="categories" className="py-12 px-4 md:py-16 md:px-6 lg:py-20 lg:px-8 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Competition Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose your category based on your age and skill level. Each category has its own exciting theme to explore!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Card
              key={category.id}
              className={cn(
                "relative overflow-hidden bg-white border hover:shadow-lg transition-all duration-200 hover:-translate-y-1",
                "border-l-4",
                category.id === "junior" && "border-l-junior",
                category.id === "intermediate" && "border-l-builder",
                category.id === "advanced" && "border-l-developer"
              )}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={cn("text-2xl font-bold", category.color)}>
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-700">
                    {category.ageRange}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {category.title}
                </h3>
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-white/50">
                  <p className="text-sm font-semibold text-gray-600 mb-1">Theme:</p>
                  <p className={cn("text-lg font-bold", category.color)}>
                    {category.theme}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  {category.description}
                </p>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Required Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700 border border-white/50"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 border border-white/50">
                    <p className="text-sm text-gray-600 text-center">
                      <span className="font-semibold">Submission Deadline:</span> {submissionDeadlineFull}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Not sure which category fits you?
            </h3>
            <p className="text-gray-600 mb-4">
              Choose the category that matches your age group. Don't worry about your current skill level - 
              we encourage creativity and learning at every stage!
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
                <span>Beginner friendly</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span>Intermediate challenges</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span>Advanced projects</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;