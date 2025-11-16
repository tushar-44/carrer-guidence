import type { CaseStudyContent } from './types';
import { technologiesContent } from './technologies';
import { challengeContent } from './challenge';
import { solutionContent } from './solution';
import { technicalImplementationContent } from './technical-implementation';
import { processContent } from './process';
import { reflectionContent } from './reflection';
import { nextStepsContent } from './next-steps';

export const designPlatformContent: CaseStudyContent = {
  sections: [
    technologiesContent,
    challengeContent,
    solutionContent,
    technicalImplementationContent,
    processContent,
    reflectionContent,
    nextStepsContent
  ]
};

// Re-export types for convenience
export type { ContentSection, ContentSubsection, CaseStudyContent } from './types';