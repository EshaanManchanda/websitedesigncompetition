import React, { useState } from 'react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: 'general' | 'competition' | 'technical' | 'prizes';
}

const FAQ: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqData: FAQItem[] = [
    {
      id: 1,
      question: "What is the Kids Web Design Competition?",
      answer: "It's an exciting competition where kids aged 8-17 can showcase their creativity by designing amazing websites! You'll learn coding skills while having fun and competing for awesome prizes.",
      category: 'general'
    },
    {
      id: 2,
      question: "Who can participate in the competition?",
      answer: "Any child between the ages of 8 and 17 can participate! We have different age categories to make sure the competition is fair for everyone.",
      category: 'general'
    },
    {
      id: 3,
      question: "Do I need to know how to code already?",
      answer: "Not at all! We provide beginner-friendly tutorials and resources to help you get started. Whether you're a complete beginner or already know some coding, there's a place for you!",
      category: 'general'
    },
    {
      id: 4,
      question: "When does the competition start and end?",
      answer: "The competition runs from March 1st to May 31st each year. Registration opens in February, so make sure to sign up early!",
      category: 'competition'
    },
    {
      id: 5,
      question: "How are the winners chosen?",
      answer: "Our panel of expert judges evaluates websites based on creativity, functionality, design, and age-appropriate complexity. We also have a People's Choice Award voted by the community!",
      category: 'competition'
    },
    {
      id: 6,
      question: "Can I work in a team?",
      answer: "Yes! You can participate individually or in teams of up to 3 people. Team members must all be within the same age category.",
      category: 'competition'
    },
    {
      id: 7,
      question: "What tools can I use to build my website?",
      answer: "You can use any web development tools you like! We recommend starting with HTML, CSS, and JavaScript. Popular tools include Scratch for Kids, CodePen, or even advanced frameworks if you're experienced.",
      category: 'technical'
    },
    {
      id: 8,
      question: "Where do I host my website?",
      answer: "We provide free hosting for all competition entries! You can also use platforms like GitHub Pages, Netlify, or any other hosting service you prefer.",
      category: 'technical'
    },
    {
      id: 9,
      question: "Are there any restrictions on website content?",
      answer: "Yes, all content must be family-friendly and appropriate for all ages. No violence, inappropriate language, or copyrighted material without permission.",
      category: 'technical'
    },
    {
      id: 10,
      question: "What prizes can I win?",
      answer: "Amazing prizes including tablets, coding books, online course subscriptions, certificates, and even scholarships for coding camps! Every participant gets a digital certificate of participation.",
      category: 'prizes'
    },
    {
      id: 11,
      question: "Is there an entry fee?",
      answer: "No! The competition is completely free to enter. We believe every child should have the opportunity to learn and compete regardless of their family's financial situation.",
      category: 'prizes'
    },
    {
      id: 12,
      question: "How will I know if I win?",
      answer: "Winners will be announced on our website and contacted via email. We'll also host a virtual awards ceremony where winners can showcase their projects!",
      category: 'prizes'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Questions', icon: '🌟' },
    { id: 'general', name: 'General Info', icon: '📚' },
    { id: 'competition', name: 'Competition Rules', icon: '🏆' },
    { id: 'technical', name: 'Technical Help', icon: '💻' },
    { id: 'prizes', name: 'Prizes & Awards', icon: '🎁' }
  ];

  const filteredFAQs = activeCategory === 'all' 
    ? faqData 
    : faqData.filter(item => item.category === activeCategory);

  const toggleItem = (id: number): void => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const openAll = (): void => {
    setOpenItems(filteredFAQs.map(item => item.id));
  };

  const closeAll = (): void => {
    setOpenItems([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400">
      {/* Header Section */}
      <div className="bg-white/10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Got questions? We've got answers! Find everything you need to know about our awesome web design competition.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={openAll}
            className="px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-colors duration-300 shadow-lg"
          >
            Open All
          </button>
          <button
            onClick={closeAll}
            className="px-6 py-3 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-colors duration-300 shadow-lg"
          >
            Close All
          </button>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-800 pr-4">
                  {item.question}
                </h3>
                <div className={`transform transition-transform duration-300 ${
                  openItems.includes(item.id) ? 'rotate-180' : ''
                }`}>
                  <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${
                openItems.includes(item.id) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-6 pb-5">
                  <div className="h-px bg-gradient-to-r from-purple-200 to-pink-200 mb-4"></div>
                  <p className="text-gray-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Still Have Questions?
          </h2>
          <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our friendly team is here to help! 
            Reach out to us and we'll get back to you super fast.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="px-8 py-4 bg-white text-purple-600 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg transform hover:scale-105"
            >
              Contact Us
            </a>
            <a
              href="mailto:help@kidswebcomp.com"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              Email Support
            </a>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="font-bold text-gray-800 mb-2">Pro Tip</h3>
            <p className="text-gray-600 text-sm">
              Start with simple HTML and CSS, then add cool features as you learn more!
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="font-bold text-gray-800 mb-2">Get Started</h3>
            <p className="text-gray-600 text-sm">
              Check out our Resources page for tutorials and tools to begin your coding journey!
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="font-bold text-gray-800 mb-2">Stay Updated</h3>
            <p className="text-gray-600 text-sm">
              Follow us on social media for the latest competition news and coding tips!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;