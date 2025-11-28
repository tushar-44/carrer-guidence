import { useState, useRef } from 'react';
import { Camera, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ProfilePhotoUploadProps {
  currentPhoto?: string | null;
  onUpload: (file: File) => Promise<void>;
  userId: string;
}

export function ProfilePhotoUpload({ currentPhoto, onUpload }: ProfilePhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentPhoto || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file',
        variant: 'destructive'
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Image must be less than 5MB',
        variant: 'destructive'
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setIsUploading(true);
    try {
      await onUpload(file);
      toast({
        title: 'Success',
        description: 'Profile photo updated successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload photo',
        variant: 'destructive'
      });
      setPreview(currentPhoto || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`relative w-32 h-32 rounded-full overflow-hidden border-4 transition-all duration-300 ${
          isDragging
            ? 'border-purple-500 scale-105 shadow-lg shadow-purple-500/50'
            : 'border-gray-300 dark:border-gray-700'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {preview ? (
          <img
            src={preview}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
            <Camera className="w-12 h-12 text-white" />
          </div>
        )}
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="gap-2"
        >
          <Upload className="w-4 h-4" />
          {preview ? 'Change Photo' : 'Upload Photo'}
        </Button>
        {preview && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setPreview(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            disabled={isUploading}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Remove
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
      />

      <p className="text-xs text-muted-foreground text-center max-w-xs">
        Drag and drop an image here, or click to select. Max 5MB
      </p>
    </div>
  );
}

