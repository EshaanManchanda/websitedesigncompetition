import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useDates } from '@/hooks/useDates';

const Hero: React.FC = () => {
  const { competitionYear, submissionDeadlineShort, resultsAnnouncementShort } = useDates();
  const scrollToSubmission = () => {
    const submissionSection = document.getElementById('submission');
    if (submissionSection) {
      submissionSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  const scrollToCategories = () => {
    const categoriesSection = document.getElementById('categories');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-purple-200/30 rounded-full animate-pulse"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Main title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg">
            <span className="block mb-2 pt-[15px] pb-[15px]">Kids Web Design</span>
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Competition {competitionYear}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl md:text-3xl text-white/90 font-medium max-w-4xl mx-auto leading-relaxed">
            Unleash your creativity and build amazing websites!
          </p>

          {/* Description */}
          <div className="max-w-3xl mx-auto space-y-4">
            <p className="text-lg sm:text-xl text-white/80 leading-relaxed">
              Join thousands of young creators aged 8-17 in the ultimate web design challenge. 
              Show off your coding skills, creativity, and innovation to win amazing prizes!
            </p>
            <p className="text-base sm:text-lg text-white/70">
              Whether you're a beginner or an experienced coder, there's a category perfect for you.
            </p>
          </div>

          {/* Key highlights */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-white/90 text-sm sm:text-base font-medium">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="w-2 h-2 bg-yellow-300 rounded-full"></span>
              <span>Ages 8-17</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="w-2 h-2 bg-green-300 rounded-full"></span>
              <span>3 Categories</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="w-2 h-2 bg-blue-300 rounded-full"></span>
              <span>Amazing Prizes</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="w-2 h-2 bg-pink-300 rounded-full"></span>
              <span>Free to Enter</span>
            </div>
          </div>

          {/* Call-to-action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button onClick={scrollToSubmission} size="lg" className="bg-white text-primary hover:bg-gray-100 font-bold rounded-full shadow-lg hover:shadow-xl">
              Submit Your Entry
            </Button>
            <Button onClick={scrollToCategories} variant="outline" size="lg" className="border-2 border-primary text-primary hover:bg-primary/10 font-bold rounded-full shadow-lg hover:shadow-xl">
              View Categories
            </Button>
          </div>

          {/* Competition timeline */}
          <div className="pt-12">
            <div className="bg-white shadow-md rounded-2xl p-6 max-w-2xl mx-auto">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Competition Timeline</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <div className="text-primary font-bold text-lg">Registration</div>
                  <div className="text-gray-600 text-sm">Now Open</div>
                </div>
                <div className="space-y-2">
                  <div className="text-primary font-bold text-lg">Submission</div>
                  <div className="text-gray-600 text-sm">Until {submissionDeadlineShort}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-primary font-bold text-lg">Results</div>
                  <div className="text-gray-600 text-sm">{resultsAnnouncementShort}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>;
};
export default Hero;