import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Upload, FileText, Calendar, AlertCircle } from "lucide-react";
import { useDates } from '@/hooks/useDates';

const Submission: React.FC = () => {
  const { submissionDeadlineWithTime } = useDates();
  const navigate = useNavigate();
  const submissionRequirements = [
    {
      title: "Website Files",
      description: "Complete HTML, CSS, and JavaScript files (if applicable)",
      icon: <FileText className="w-5 h-5" />
    },
    {
      title: "Project Description",
      description: "Brief explanation of your website concept and design choices",
      icon: <FileText className="w-5 h-5" />
    },
    {
      title: "Screenshots",
      description: "High-quality screenshots of your website on different devices",
      icon: <Upload className="w-5 h-5" />
    },
    {
      title: "Source Code",
      description: "Well-commented code that demonstrates your understanding",
      icon: <FileText className="w-5 h-5" />
    }
  ];

  const technicalSpecs = [
    "File size limit: 50MB total",
    "Supported formats: HTML, CSS, JS, PNG, JPG, PDF",
    "Must be responsive and work on mobile devices",
    "Include a README file with setup instructions",
    "All images must be optimized for web",
    "Code must be original work (no templates)"
  ];

  const checklistItems = [
    "Website loads properly in major browsers",
    "All links and buttons work correctly",
    "Images display properly and load quickly",
    "Text is readable and well-formatted",
    "Website is mobile-friendly",
    "Code is clean and well-commented",
    "Project description is complete",
    "All required files are included",
    "Submission follows competition guidelines",
    "Contact information is provided"
  ];

  return (
    <section id="submission" className="py-12 px-4 md:py-16 md:px-6 lg:py-20 lg:px-8 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Submission Guidelines
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about submitting your amazing website to our competition
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Submission Requirements */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Upload className="w-6 h-6" />
                What to Submit
              </h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {submissionRequirements.map((req, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                    <div className="text-blue-600 mt-1">
                      {req.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">
                        {req.title}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {req.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-lg">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <AlertCircle className="w-6 h-6" />
                Technical Requirements
              </h3>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3">
                {technicalSpecs.map((spec, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{spec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Submission Process */}
        <Card className="shadow-lg border-0 bg-white mb-12">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              How to Submit
            </h3>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600">1</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Prepare Your Files</h4>
                <p className="text-gray-600 text-sm">
                  Organize all your website files, images, and documentation in a single folder
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600">2</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Create ZIP File</h4>
                <p className="text-gray-600 text-sm">
                  Compress your project folder into a ZIP file with your name and category
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600">3</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Submit Online</h4>
                <p className="text-gray-600 text-sm">
                  Upload your ZIP file through our online submission portal before the deadline
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Final Checklist */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-t-lg">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              Final Checklist
            </h3>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-600 mb-6">
              Before submitting, make sure you've completed all these items:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {checklistItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-pink-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Important Dates */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-lg shadow-lg inline-block">
            <h3 className="text-2xl font-bold mb-2">Important Deadline</h3>
            <p className="text-lg mb-4">Submissions close on {submissionDeadlineWithTime}</p>
            <Button
              onClick={() => navigate('/register')}
              className="bg-white text-orange-600 hover:bg-gray-100 font-semibold"
            >
              Submit Your Project
            </Button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 text-center">
          <Card className="shadow-lg border-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
              <p className="text-lg mb-6">
                Our team is here to help you with any questions about the submission process
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => window.location.href = 'mailto:contact@websitedesigningcompetition.com'}
                  className="bg-white text-indigo-600 hover:bg-gray-100"
                >
                  Email Support
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/faq')}
                  className="bg-white text-indigo-600 hover:bg-gray-100"
                >
                  FAQ
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}
                  className="bg-white text-indigo-600 hover:bg-gray-100"
                >
                  Video Tutorial
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Submission;