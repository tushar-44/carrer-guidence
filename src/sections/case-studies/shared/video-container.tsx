import { DesignPlatformVideo } from "../content/design-platform-video";
import { AdvertisingPlatformVideo } from "../content/advertising-platform-video";

interface VideoContainerProps {
  activeVideo: 'design' | 'advertising';
}

export function VideoContainer({ activeVideo }: VideoContainerProps) {
  return (
    <div className="w-full h-full relative">
      {/* For now, just render the active video */}
      {activeVideo === 'design' && <DesignPlatformVideo />}
      {activeVideo === 'advertising' && <AdvertisingPlatformVideo />}
    </div>
  );
}