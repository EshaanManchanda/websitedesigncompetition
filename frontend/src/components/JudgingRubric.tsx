import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RubricCriteria {
  name: string;
  weight: number;
  levels: {
    score: number;
    title: string;
    description: string;
  }[];
}

interface CategoryRubric {
  category: string;
  description: string;
  criteria: RubricCriteria[];
}

const JudgingRubric: React.FC = () => {
  const rubrics: CategoryRubric[] = [
    {
      category: "Creative Design (Ages 8-11)",
      description: "Judging criteria for elementary school participants",
      criteria: [
        {
          name: "Creativity & Originality",
          weight: 30,
          levels: [
            {
              score: 4,
              title: "Exceptional",
              description: "Highly original and creative design with unique elements that stand out"
            },
            {
              score: 3,
              title: "Good",
              description: "Shows creativity with some original elements and good visual appeal"
            },
            {
              score: 2,
              title: "Fair",
              description: "Basic creativity with limited original elements"
            },
            {
              score: 1,
              title: "Needs Improvement",
              description: "Little to no creativity or original thinking evident"
            }
          ]
        },
        {
          name: "Visual Appeal",
          weight: 25,
          levels: [
            {
              score: 4,
              title: "Exceptional",
              description: "Excellent use of colors, images, and layout that creates strong visual impact"
            },
            {
              score: 3,
              title: "Good",
              description: "Good visual design with appropriate color choices and layout"
            },
            {
              score: 2,
              title: "Fair",
              description: "Basic visual appeal with some design elements working well"
            },
            {
              score: 1,
              title: "Needs Improvement",
              description: "Poor visual design with clashing colors or confusing layout"
            }
          ]
        },
        {
          name: "Content Quality",
          weight: 25,
          levels: [
            {
              score: 4,
              title: "Exceptional",
              description: "Clear, engaging content that is well-organized and age-appropriate"
            },
            {
              score: 3,
              title: "Good",
              description: "Good content that is mostly clear and well-organized"
            },
            {
              score: 2,
              title: "Fair",
              description: "Basic content with some organization and clarity"
            },
            {
              score: 1,
              title: "Needs Improvement",
              description: "Unclear or poorly organized content"
            }
          ]
        },
        {
          name: "Effort & Completion",
          weight: 20,
          levels: [
            {
              score: 4,
              title: "Exceptional",
              description: "Website is complete with all sections finished and shows excellent effort"
            },
            {
              score: 3,
              title: "Good",
              description: "Website is mostly complete with good effort shown"
            },
            {
              score: 2,
              title: "Fair",
              description: "Website has some incomplete sections but shows basic effort"
            },
            {
              score: 1,
              title: "Needs Improvement",
              description: "Website appears rushed or incomplete with minimal effort"
            }
          ]
        }
      ]
    },
    {
      category: "Technical Innovation (Ages 12-14)",
      description: "Judging criteria for middle school participants",
      criteria: [
        {
          name: "Technical Skills",
          weight: 35,
          levels: [
            {
              score: 4,
              title: "Exceptional",
              description: "Advanced use of HTML, CSS, and JavaScript with complex features"
            },
            {
              score: 3,
              title: "Good",
              description: "Good technical implementation with some advanced features"
            },
            {
              score: 2,
              title: "Fair",
              description: "Basic technical skills with standard HTML/CSS implementation"
            },
            {
              score: 1,
              title: "Needs Improvement",
              description: "Limited technical skills with basic or broken implementation"
            }
          ]
        },
        {
          name: "Innovation & Features",
          weight: 25,
          levels: [
            {
              score: 4,
              title: "Exceptional",
              description: "Innovative features and creative use of technology"
            },
            {
              score: 3,
              title: "Good",
              description: "Some innovative elements and good feature implementation"
            },
            {
              score: 2,
              title: "Fair",
              description: "Basic features with limited innovation"
            },
            {
              score: 1,
              title: "Needs Improvement",
              description: "No innovative features or poor implementation"
            }
          ]
        },
        {
          name: "User Experience",
          weight: 25,
          levels: [
            {
              score: 4,
              title: "Exceptional",
              description: "Excellent navigation, usability, and overall user experience"
            },
            {
              score: 3,
              title: "Good",
              description: "Good user experience with intuitive navigation"
            },
            {
              score: 2,
              title: "Fair",
              description: "Basic usability with some navigation issues"
            },
            {
              score: 1,
              title: "Needs Improvement",
              description: "Poor user experience with confusing navigation"
            }
          ]
        },
        {
          name: "Code Quality",
          weight: 15,
          levels: [
            {
              score: 4,
              title: "Exceptional",
              description: "Clean, well-organized, and properly commented code"
            },
            {
              score: 3,
              title: "Good",
              description: "Generally well-organized code with some comments"
            },
            {
              score: 2,
              title: "Fair",
              description: "Basic code organization with minimal comments"
            },
            {
              score: 1,
              title: "Needs Improvement",
              description: "Poorly organized or messy code structure"
            }
          ]
        }
      ]
    },
    {
      category: "Professional Portfolio (Ages 15-17)",
      description: "Judging criteria for high school participants",
      criteria: [
        {
          name: "Professional Quality",
          weight: 30,
          levels: [
            {
              score: 4,
              title: "Exceptional",
              description: "Professional-grade design and implementation suitable for real-world use"
            },
            {
              score: 3,
              title: "Good",
              description: "High-quality design with professional appearance"
            },
            {
              score: 2,
              title: "Fair",
              description: "Good quality with some professional elements"
            },
            {
              score: 1,
              title: "Needs Improvement",
              description: "Basic quality lacking professional polish"
            }
          ]
        },
        {
          name: "Technical Complexity",
          weight: 25,
          levels: [
            {
              score: 4,
              title: "Exceptional",
              description: "Advanced technical implementation with complex features and frameworks"
            },
            {
              score: 3,
              title: "Good",
              description: "Good technical complexity with multiple advanced features"
            },
            {
              score: 2,
              title: "Fair",
              description: "Moderate technical complexity with some advanced elements"
            },
            {
              score: 1,
              title: "Needs Improvement",
              description: "Basic technical implementation with limited complexity"
            }
          ]
        },
        {
          name: "Responsive Design",
          weight: 20,
          levels: [
            {
              score: 4,
              title: "Exceptional",
              description: "Excellent responsive design that works perfectly on all devices"
            },
            {
              score: 3,
              title: "Good",
              description: "Good responsive design with minor issues on some devices"
            },
            {
              score: 2,
              title: "Fair",
              description: "Basic responsive design with some layout issues"
            },
            {
              score: 1,
              title: "Needs Improvement",
              description: "Poor or no responsive design implementation"
            }
          ]
        },
        {
          name: "Performance & Optimization",
          weight: 15,
          levels: [
            {
              score: 4,
              title: "Exceptional",
              description: "Excellent performance with optimized images, code, and loading times"
            },
            {
              score: 3,
              title: "Good",
              description: "Good performance with some optimization efforts"
            },
            {
              score: 2,
              title: "Fair",
              description: "Acceptable performance with basic optimization"
            },
            {
              score: 1,
              title: "Needs Improvement",
              description: "Poor performance with no optimization efforts"
            }
          ]
        },
        {
          name: "Innovation & Creativity",
          weight: 10,
          levels: [
            {
              score: 4,
              title: "Exceptional",
              description: "Highly innovative and creative approach with unique solutions"
            },
            {
              score: 3,
              title: "Good",
              description: "Good innovation with creative problem-solving"
            },
            {
              score: 2,
              title: "Fair",
              description: "Some innovative elements and creativity"
            },
            {
              score: 1,
              title: "Needs Improvement",
              description: "Limited innovation or creative thinking"
            }
          ]
        }
      ]
    }
  ];

  const getScoreColor = (score: number): string => {
    switch (score) {
      case 4: return "text-green-600 bg-green-50";
      case 3: return "text-blue-600 bg-blue-50";
      case 2: return "text-yellow-600 bg-yellow-50";
      case 1: return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <section id="judging" className="py-12 px-4 md:py-16 md:px-6 lg:py-20 lg:px-8 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Judging Rubric
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Detailed scoring criteria for each competition category. All submissions will be evaluated fairly using these standardized rubrics.
          </p>
        </div>

        <div className="space-y-12">
          {rubrics.map((rubric, rubricIndex) => (
            <Card key={rubricIndex} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                <h3 className="text-2xl font-bold">{rubric.category}</h3>
                <p className="text-purple-100">{rubric.description}</p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-8">
                  {rubric.criteria.map((criteria, criteriaIndex) => (
                    <div key={criteriaIndex} className="border-l-4 border-purple-400 pl-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-semibold text-gray-800">
                          {criteria.name}
                        </h4>
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                          {criteria.weight}% Weight
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {criteria.levels.map((level, levelIndex) => (
                          <div
                            key={levelIndex}
                            className={cn(
                              "p-4 rounded-lg border transition-all duration-200 hover:shadow-md",
                              getScoreColor(level.score)
                            )}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-lg">
                                {level.score}/4
                              </span>
                              <span className="font-semibold">
                                {level.title}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed">
                              {level.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-semibold text-gray-800 mb-2">Scoring Information:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Each criterion is scored from 1-4 points</li>
                    <li>• Final scores are calculated using the weighted percentages</li>
                    <li>• Maximum possible score: 4.0 points</li>
                    <li>• Winners are determined by highest overall scores in each category</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Additional Judging Notes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Fair Evaluation:</h4>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• All submissions judged anonymously</li>
                    <li>• Multiple judges review each entry</li>
                    <li>• Scores are averaged for final results</li>
                    <li>• Age-appropriate expectations applied</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Feedback Provided:</h4>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Detailed scoring breakdown</li>
                    <li>• Constructive comments from judges</li>
                    <li>• Suggestions for improvement</li>
                    <li>• Recognition of strengths</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default JudgingRubric;