import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, Users, Code, Trophy, Shield } from "lucide-react";
import { useDates } from '@/hooks/useDates';

const Guidelines: React.FC = () => {
  const { submissionDeadlineFull } = useDates();
  return (
    <section id="guidelines" className="py-12 px-4 md:py-16 md:px-6 lg:py-20 lg:px-8 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Competition Guidelines
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know to participate successfully in our web design competition
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Competition Rules */}
          <Card className="border border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-blue-100">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-blue-600" />
                <h3 className="text-2xl font-bold text-blue-800">Competition Rules</h3>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Open to participants aged 8-17 years old</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Individual or team submissions (max 3 members per team)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Original work only - no copying or plagiarism</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Must include source code and documentation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Submission deadline: {submissionDeadlineFull}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Website must be functional and accessible</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Development Guidelines */}
          <Card className="border border-green-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-green-100">
              <div className="flex items-center gap-3">
                <Code className="h-8 w-8 text-green-600" />
                <h3 className="text-2xl font-bold text-green-800">Development Guidelines</h3>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Use HTML, CSS, and JavaScript (frameworks allowed)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Responsive design for mobile and desktop</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Clean, well-commented code structure</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Include a README file with setup instructions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Follow web accessibility standards (WCAG)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Optimize images and assets for web performance</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* AI Usage Policy */}
          <Card className="border border-orange-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-orange-100">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-orange-600" />
                <h3 className="text-2xl font-bold text-orange-800">AI Usage Policy</h3>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-2">AI Tools Allowed</h4>
                      <p className="text-yellow-700 text-sm">
                        AI assistance is permitted for learning and debugging, but the core design and code must be your own work.
                      </p>
                    </div>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Use AI for code suggestions and debugging help</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">AI-generated images are allowed with proper attribution</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Must disclose AI usage in your submission documentation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Cannot submit entirely AI-generated websites</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Team Collaboration */}
          <Card className="border border-purple-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-purple-100">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-purple-600" />
                <h3 className="text-2xl font-bold text-purple-800">Team Collaboration</h3>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Teams can have up to 3 members maximum</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">All team members must be within the age range</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Clearly define each member's contributions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Use version control (Git) for team projects</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Include team member information in submission</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">All members share equally in prizes and recognition</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Need Help or Have Questions?</h3>
          <p className="text-lg mb-6 opacity-90">
            Our mentors are here to support you throughout the competition!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-white/20 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Discord Community</h4>
              <p className="text-sm opacity-90">Join our Discord for real-time help and discussions</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Email Support</h4>
              <p className="text-sm opacity-90">Send us your questions at help@kidswebcomp.com</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Weekly Office Hours</h4>
              <p className="text-sm opacity-90">Live Q&A sessions every Saturday at 2 PM EST</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Guidelines;