import { TextShimmer } from '@/components/ui/text-shimmer';
import { SocialLinks } from './social-links';
import { CometCard } from '@/components/ui/comet-card';

export function ProfileSection() {
  return (
    <div className="bento-no-min col-span-3 row-span-3 flex flex-col items-center gap-8 [@media(min-width:685px)]:flex-row [@media(min-width:685px)]:items-center">
      {/* Profile Image with CometCard - top row on mobile, left side on desktop */}
      <CometCard className="w-64 flex-shrink-0 [@media(min-width:685px)]:ml-4">
        <img
          src="https://plus.unsplash.com/premium_vector-1682306494914-88efc6e38d02?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGdyb3VwfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600"
          alt="CareerPath Student Profile"
          className="w-full h-full object-cover rounded-2xl"
        />
      </CometCard>

      {/* Text - bottom row on mobile, right side on desktop */}
      <div className="flex flex-col text-center [@media(min-width:685px)]:text-left [@media(min-width:685px)]:ml-4">
        <h3 className="font-heading text-2xl text-foreground mb-2">
          <TextShimmer
            as="span"
            className="dark:[--base-color:#f2f2f2] dark:[--base-gradient-color:#B2B2B2]"
            duration={1.5}
            spread={5}
          >
            Your Career Journey
          </TextShimmer>
        </h3>
        <p className="font-body text-sm font-light text-muted-foreground mb-4">
          Track progress, achievements, and milestones on your path to success
        </p>
        <div className="flex justify-center [@media(min-width:685px)]:justify-start">
          <SocialLinks />
        </div>
      </div>
    </div>
  );
}