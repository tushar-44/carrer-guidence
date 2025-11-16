import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { assessmentCategories, type AssessmentCategory } from '@/constants/index';
import { Check } from 'lucide-react';

interface CategorySelectorProps {
  selectedCategories: AssessmentCategory[];
  onCategoryToggle: (category: AssessmentCategory) => void;
  onContinue: () => void;
}

export function CategorySelector({
  selectedCategories,
  onCategoryToggle,
  onContinue
}: CategorySelectorProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Choose Assessment Categories
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Select the areas you'd like to assess. We recommend all categories for best results.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {assessmentCategories.map((category, index) => {
          const isSelected = selectedCategories.includes(category.value);

          return (
            <motion.div
              key={category.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                  isSelected
                    ? 'ring-2 ring-blue-500 shadow-lg scale-105'
                    : 'hover:scale-102'
                }`}
                onClick={() => onCategoryToggle(category.value)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{category.icon}</div>
                    {isSelected && (
                      <div className="p-1 bg-blue-500 rounded-full">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {category.label}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => {
            // Select all categories
            assessmentCategories.forEach(cat => {
              if (!selectedCategories.includes(cat.value)) {
                onCategoryToggle(cat.value);
              }
            });
          }}
          className="px-6 py-3 text-blue-600 hover:text-blue-700 font-medium"
        >
          Select All
        </button>
        <button
          onClick={onContinue}
          disabled={selectedCategories.length === 0}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Continue ({selectedCategories.length} selected)
        </button>
      </div>
    </div>
  );
}