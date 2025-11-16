import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useUserStore } from '@/stores/userStore';
import { userTypes, type UserType } from '@/constants/index';
import { GraduationCap, Briefcase, Users, ChevronRight, Check } from 'lucide-react';

const userTypeIcons: Record<UserType, typeof GraduationCap> = {
  'class-8-9': GraduationCap,
  'class-10-12': GraduationCap,
  'graduates': GraduationCap,
  'job-seeker': Briefcase,
  'mentor': Users
};

export function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const navigate = useNavigate();
  const { setUserType } = useUserStore();

  const totalSteps = 2;
  const progress = (step / totalSteps) * 100;

  const handleTypeSelect = (type: UserType) => {
    setSelectedType(type);
  };

  const handleContinue = () => {
    if (step === 1 && selectedType) {
      setStep(2);
    } else if (step === 2 && selectedType) {
      setUserType(selectedType);
      navigate('/assessment');
    }
  };

  const handleSkip = () => {
    // Set default user type and navigate
    setUserType('graduates');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Welcome to CareerPath
            </h1>
            <Button variant="outline" onClick={handleSkip}>
              Skip
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Step {step} of {totalSteps}
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Tell us about yourself
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    This helps us personalize your experience and provide better recommendations
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userTypes.map((type) => {
                    const Icon = userTypeIcons[type.value];
                    const isSelected = selectedType === type.value;

                    return (
                      <Card
                        key={type.value}
                        className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                          isSelected
                            ? 'ring-2 ring-blue-500 shadow-lg scale-105'
                            : 'hover:scale-102'
                        }`}
                        onClick={() => handleTypeSelect(type.value)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                              <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            {isSelected && (
                              <div className="p-1 bg-blue-500 rounded-full">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {type.label}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {type.description}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <div className="flex justify-end mt-8">
                  <Button
                    size="lg"
                    onClick={handleContinue}
                    disabled={!selectedType}
                    className="min-w-[150px]"
                  >
                    Continue
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && selectedType && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Great choice! Let's get started
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Here's what you can expect from CareerPath
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🎯</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">AI Assessment</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Take our comprehensive assessment to discover your strengths and ideal career paths
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">👥</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Expert Mentors</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Connect with industry professionals who can guide your career journey
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">📚</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Learning Path</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Get a personalized roadmap with courses and resources to achieve your goals
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-4">Ready to discover your path?</h3>
                    <p className="text-lg mb-6 opacity-90">
                      Let's start with a quick assessment to understand your interests, skills, and personality.
                      It takes about 10-15 minutes.
                    </p>
                    <div className="flex gap-4">
                      <Button
                        size="lg"
                        variant="secondary"
                        onClick={() => setStep(1)}
                      >
                        Back
                      </Button>
                      <Button
                        size="lg"
                        onClick={handleContinue}
                        className="bg-white text-blue-600 hover:bg-gray-100"
                      >
                        Start Assessment
                        <ChevronRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}