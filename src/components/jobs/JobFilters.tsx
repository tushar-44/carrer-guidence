import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter, X, MapPin, DollarSign, Briefcase } from 'lucide-react';
import { jobs, getJobDomains } from '@/data/jobs';

interface JobFiltersProps {
  onFiltersChange: (filters: {
    search: string;
    domain: string[];
    type: string[];
    location: string;
    salaryRange: [number, number];
    experience: string;
    remote: boolean;
  }) => void;
}

export function JobFilters({ onFiltersChange }: JobFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [location, setLocation] = useState('all');
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 300000]);
  const [experience, setExperience] = useState('all');
  const [remote, setRemote] = useState(false);

  // Get unique values from jobs data
  const allDomains = getJobDomains();
  const jobTypes = ['full-time', 'part-time', 'contract', 'internship', 'freelance'];
  const locations = ['Remote', 'On-site', 'Hybrid'];

  const handleDomainToggle = (domain: string) => {
    setSelectedDomains(prev =>
      prev.includes(domain)
        ? prev.filter(d => d !== domain)
        : [...prev, domain]
    );
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const applyFilters = () => {
    onFiltersChange({
      search,
      domain: selectedDomains,
      type: selectedTypes,
      location,
      salaryRange,
      experience,
      remote,
    });
    setIsOpen(false);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedDomains([]);
    setSelectedTypes([]);
    setLocation('all');
    setSalaryRange([0, 300000]);
    setExperience('all');
    setRemote(false);
    onFiltersChange({
      search: '',
      domain: [],
      type: [],
      location: 'all',
      salaryRange: [0, 300000],
      experience: 'all',
      remote: false,
    });
  };

  const activeFiltersCount =
    (search ? 1 : 0) +
    selectedDomains.length +
    selectedTypes.length +
    (location !== 'all' ? 1 : 0) +
    (salaryRange[0] > 0 || salaryRange[1] < 300000 ? 1 : 0) +
    (experience !== 'all' ? 1 : 0) +
    (remote ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Search jobs by title, company, or keywords..."
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
            <CardTitle className="text-lg">Filter Jobs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Job Domains */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Job Domains</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {allDomains.map((domain) => (
                  <div key={domain} className="flex items-center space-x-2">
                    <Checkbox
                      id={`domain-${domain}`}
                      checked={selectedDomains.includes(domain)}
                      onCheckedChange={() => handleDomainToggle(domain)}
                    />
                    <Label
                      htmlFor={`domain-${domain}`}
                      className="text-sm cursor-pointer"
                    >
                      {domain}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Types */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Job Types</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {jobTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={selectedTypes.includes(type)}
                      onCheckedChange={() => handleTypeToggle(type)}
                    />
                    <Label
                      htmlFor={`type-${type}`}
                      className="text-sm cursor-pointer capitalize"
                    >
                      {type.replace('-', ' ')}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Location Type</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc.toLowerCase()}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                  <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
                  <SelectItem value="senior">Senior Level (5-10 years)</SelectItem>
                  <SelectItem value="executive">Executive Level (10+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Salary Range */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Salary Range: ${salaryRange[0].toLocaleString()} - ${salaryRange[1].toLocaleString()}
              </Label>
              <Slider
                value={salaryRange}
                onValueChange={(value: number[]) => setSalaryRange(value as [number, number])}
                max={300000}
                min={0}
                step={5000}
                className="mb-2"
              />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                <span>Annual salary</span>
              </div>
            </div>

            {/* Remote Work */}
            <div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remote"
                  checked={remote}
                  onCheckedChange={(checked) => setRemote(checked as boolean)}
                />
                <Label htmlFor="remote" className="text-sm cursor-pointer">
                  Remote work only
                </Label>
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
          {selectedDomains.map((domain) => (
            <Badge key={domain} variant="secondary" className="flex items-center gap-1">
              {domain}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => {
                  setSelectedDomains(prev => prev.filter(d => d !== domain));
                  applyFilters();
                }}
              />
            </Badge>
          ))}
          {selectedTypes.map((type) => (
            <Badge key={type} variant="secondary" className="flex items-center gap-1">
              {type.replace('-', ' ')}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => {
                  setSelectedTypes(prev => prev.filter(t => t !== type));
                  applyFilters();
                }}
              />
            </Badge>
          ))}
          {location !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {location}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => {
                  setLocation('all');
                  applyFilters();
                }}
              />
            </Badge>
          )}
          {experience !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {experience} level
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => {
                  setExperience('all');
                  applyFilters();
                }}
              />
            </Badge>
          )}
          {(salaryRange[0] > 0 || salaryRange[1] < 300000) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              ${salaryRange[0].toLocaleString()}-${salaryRange[1].toLocaleString()}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => {
                  setSalaryRange([0, 300000]);
                  applyFilters();
                }}
              />
            </Badge>
          )}
          {remote && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Remote only
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => {
                  setRemote(false);
                  applyFilters();
                }}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
