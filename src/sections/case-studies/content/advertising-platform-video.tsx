import { CustomVideoPlayer } from "@/components/ui/custom-video-player";

export function AdvertisingPlatformVideo() {
  return (
    <CustomVideoPlayer
      publicId="ad-video_djpqvs"
      className="w-full h-full overflow-hidden"
      muted={true}
      onPlay={() => console.log('Advertising platform video started playing')}
      onPause={() => console.log('Advertising platform video paused')}
    />
  );
}