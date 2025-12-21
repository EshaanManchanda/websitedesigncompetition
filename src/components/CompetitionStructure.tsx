import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Clock, Users, Trophy, Calendar } from "lucide-react";

interface StructurePhase {
  phase: string;
  duration: string;
  description: string;
  requirements: string[];
  icon: React.ReactNode;
}

const CompetitionStructure: React.FC = () => {
  const phases: StructurePhase[] = [
    {
      phase: "Registration Phase",
      duration: "2 weeks",
      description: "Open registration for all participants",
      requirements: [
        "Complete online registration form",
        "Parental consent for participants under 16",
        "Select competition category",
        "Submit basic participant information"
      ],
      icon: <Users className="w-6 h-6" />
    },
    {
      phase: "Design Phase",
      duration: "4 weeks",
      description: "Main competition period for creating websites",
      requirements: [
        "Create original website design",
        "Follow category-specific guidelines",
        "Ensure mobile responsiveness",
        "Include required accessibility features",
        "Test website functionality"
      ],
      icon: <Clock className="w-6 h-6" />
    },
    {
      phase: "Submission Phase",
      duration: "1 week",
      description: "Final submission and documentation period",
      requirements: [
        "Submit complete website files",
        "Provide project documentation",
        "Include design rationale",
        "Submit demo video (optional)",
        "Complete submission checklist"
      ],
      icon: <Calendar className="w-6 h-6" />
    },
    {
      phase: "Judging Phase",
      duration: "2 weeks",
      description: "Expert panel reviews and evaluates submissions",
      requirements: [
        "Technical evaluation by experts",
        "Design assessment",
        "Creativity and innovation scoring",
        "User experience evaluation",
        "Final scoring compilation"
      ],
      icon: <Trophy className="w-6 h-6" />
    }
  ];

  const timeLimits = [
    {
      category: "Beginner (Ages 8-11)",
      timeLimit: "No strict time limit",
      recommendation: "Work at your own pace with adult supervision"
    },
    {
      category: "Intermediate (Ages 12-14)",
      timeLimit: "40 hours maximum",
      recommendation: "Spread work across the 4-week design phase"
    },
    {
      category: "Advanced (Ages 15-17)",
      timeLimit: "60 hours maximum",
      recommendation: "Professional development approach encouraged"
    }
  ];

  return (
    <section id="structure" className="py-12 px-4 md:py-16 md:px-6 lg:py-20 lg:px-8 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Competition Structure
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our competition is designed to be fair, educational, and fun for all participants. 
            Here's how the competition is structured and what you need to know about timing and requirements.
          </p>
        </div>

        {/* Competition Phases */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Competition Phases
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {phases.map((phase, index) => (
              <Card key={index} className="relative overflow-hidden border border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    {phase.icon}
                    <h4 className="font-bold text-lg">{phase.phase}</h4>
                  </div>
                  <div className="bg-white/20 rounded-full px-3 py-1 text-sm font-medium">
                    {phase.duration}
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-600 mb-4 text-sm">
                    {phase.description}
                  </p>
                  <div className="space-y-2">
                    <h5 className="font-semibold text-gray-800 text-sm">Requirements:</h5>
                    <ul className="space-y-1">
                      {phase.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="text-xs text-gray-600 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 flex-shrink-0"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Time Limits by Category */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Time Limits by Age Category
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {timeLimits.map((limit, index) => (
              <Card key={index} className="border border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                  <h4 className="font-bold text-lg">{limit.category}</h4>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {limit.timeLimit}
                    </div>
                    <p className="text-gray-600 text-sm">
                      {limit.recommendation}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Important Notes */}
        <Card className="border border-yellow-200 bg-yellow-50">
          <CardHeader className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <Clock className="w-6 h-6" />
              Important Timeline Notes
            </h3>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-800 mb-3">Key Deadlines</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                    Registration closes at 11:59 PM on the final registration day
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                    Final submissions must be uploaded before the deadline
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                    Late submissions will not be accepted under any circumstances
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                    Winners will be announced within 48 hours of judging completion
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-3">Support & Resources</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                    Technical support available during business hours
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                    Online tutorials and resources provided
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                    Mentorship program available for all participants
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                    FAQ section updated regularly with common questions
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CompetitionStructure;