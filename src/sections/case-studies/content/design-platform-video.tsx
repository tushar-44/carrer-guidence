import { CustomVideoPlayer } from "@/components/ui/custom-video-player";

export function DesignPlatformVideo() {
  return (
    <div className="w-full h-full overflow-hidden">
      <CustomVideoPlayer
        publicId="design-video_fvioff"
        className="w-full h-full [&>video]:object-cover [&>video]:object-top [&>video]:w-full [&>video]:h-full [&>video]:scale-112"
        muted={true}
        onPlay={() => console.log('Design platform video started playing')}
        onPause={() => console.log('Design platform video paused')}
      />
    </div>
  );
}