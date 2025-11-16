import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter, X, Star, Clock, DollarSign } from 'lucide-react';
import { mentors } from '@/data/mentors';

interface MentorFiltersProps {
  onFiltersChange: (filters: {
    search: string;
    expertise: string[];
    experience: string;
    rating: number;
    priceRange: [number, number];
    availability: string[];
    languages: string[];
  }) => void;
}

export function MentorFilters({ onFiltersChange }: MentorFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [experience, setExperience] = useState('all');
  const [rating, setRating] = useState(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  // Get unique values from mentors data
  const allExpertise = Array.from(new Set(mentors.flatMap(m => m.expertise)));
  const allLanguages = Array.from(new Set(mentors.flatMap(m => m.languages)));
  const availabilityOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleExpertiseToggle = (expertise: string) => {
    setSelectedExpertise(prev =>
      prev.includes(expertise)
        ? prev.filter(e => e !== expertise)
        : [...prev, expertise]
    );
  };

  const handleAvailabilityToggle = (day: string) => {
    setSelectedAvailability(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleLanguageToggle = (language: string) => {
    setSelectedLanguages(prev =>
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };

  const applyFilters = () => {
    onFiltersChange({
      search,
      expertise: selectedExpertise,
      experience,
      rating,
      priceRange,
      availability: selectedAvailability,
      languages: selectedLanguages,
    });
    setIsOpen(false);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedExpertise([]);
    setExperience('all');
    setRating(0);
    setPriceRange([0, 200]);
    setSelectedAvailability([]);
    setSelectedLanguages([]);
    onFiltersChange({
      search: '',
      expertise: [],
      experience: 'all',
      rating: 0,
      priceRange: [0, 200],
      availability: [],
      languages: [],
    });
  };

  const activeFiltersCount =
    (search ? 1 : 0) +
    selectedExpertise.length +
    (experience !== 'all' ? 1 : 0) +
    (rating > 0 ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 200 ? 1 : 0) +
    selectedAvailability.length +
    selectedLanguages.length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Search mentors by name, expertise, or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
          onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Advanced Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {isOpen && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter Mentors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Expertise */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Expertise Areas</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {allExpertise.map((expertise) => (
                  <div key={expertise} className="flex items-center space-x-2">
                    <Checkbox
                      id={`expertise-${expertise}`}
                      checked={selectedExpertise.includes(expertise)}
                      onCheckedChange={() => handleExpertiseToggle(expertise)}
                    />
                    <Label
                      htmlFor={`expertise-${expertise}`}
                      className="text-sm cursor-pointer"
                    >
                      {expertise}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Experience Level</Label>
              <Select value={experience} onValueChange={setExperience}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="1-3">1-3 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="5-10">5-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Rating */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Minimum Rating: {rating > 0 ? `${rating}+ stars` : 'Any'}
              </Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[rating]}
                  onValueChange={(value) => setRating(value[0])}
                  max={5}
                  min={0}
                  step={0.5}
                  className="flex-1"
                />
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Hourly Rate: ${priceRange[0]} - ${priceRange[1]}
              </Label>
              <Slider
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                max={200}
                min={0}
                step={10}
                className="mb-2"
              />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                <span>Per hour</span>
              </div>
            </div>

            {/* Availability */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Available Days</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {availabilityOptions.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={`availability-${day}`}
                      checked={selectedAvailability.includes(day)}
                      onCheckedChange={() => handleAvailabilityToggle(day)}
                    />
                    <Label
                      htmlFor={`availability-${day}`}
                      className="text-sm cursor-pointer"
                    >
                      {day.slice(0, 3)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Languages</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {allLanguages.map((language) => (
                  <div key={language} className="flex items-center space-x-2">
                    <Checkbox
                      id={`language-${language}`}
                      checked={selectedLanguages.includes(language)}
                      onCheckedChange={() => handleLanguageToggle(language)}
                    />
                    <Label
                      htmlFor={`language-${language}`}
                      className="text-sm cursor-pointer"
                    >
                      {language}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={applyFilters} className="flex-1">
                Apply Filters
              </Button>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {search}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => {
                  setSearch('');
                  applyFilters();
                }}
              />
            </Badge>
          )}
          {selectedExpertise.map((exp) => (
            <Badge key={exp} variant="secondary" className="flex items-center gap-1">
              {exp}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => {
                  setSelectedExpertise(prev => prev.filter(e => e !== exp));
                  applyFilters();
                }}
              />
            </Badge>
          ))}
          {experience !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {experience} years
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => {
                  setExperience('all');
                  applyFilters();
                }}
              />
            </Badge>
          )}
          {rating > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {rating}+ stars
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => {
                  setRating(0);
                  applyFilters();
                }}
              />
            </Badge>
          )}
          {(priceRange[0] > 0 || priceRange[1] < 200) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              ${priceRange[0]}-${priceRange[1]}/hr
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => {
                  setPriceRange([0, 200]);
                  applyFilters();
                }}
              />
            </Badge>
          )}
          {selectedAvailability.map((day) => (
            <Badge key={day} variant="secondary" className="flex items-center gap-1">
              {day.slice(0, 3)}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => {
                  setSelectedAvailability(prev => prev.filter(d => d !== day));
                  applyFilters();
                }}
              />
            </Badge>
          ))}
          {selectedLanguages.map((lang) => (
            <Badge key={lang} variant="secondary" className="flex items-center gap-1">
              {lang}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => {
                  setSelectedLanguages(prev => prev.filter(l => l !== lang));
                  applyFilters();
                }}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
