import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import CompetitionStructure from '@/components/CompetitionStructure';
import JudgingRubric from '@/components/JudgingRubric';
import Guidelines from '@/components/Guidelines';
import Submission from '@/components/Submission';

const Index = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div id="main-content">
        <Hero />
        <Categories />
        <CompetitionStructure />
        <JudgingRubric />
        <Guidelines />
        <Submission />
      </div>
    </div>
  );
};

export default Index;
