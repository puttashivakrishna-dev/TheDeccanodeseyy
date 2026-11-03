import { Image } from '@/components/ui/image';

/**
 * Wraps every destination photograph so sizing, cropping and the
 * fallback surface stay consistent across cards, heroes and galleries.
 */
export default function DestinationImage({
  src,
  alt,
  className = '',
  imageClassName = '',
  fittingType = 'fill',
  priority = false,
}) {
  return (
    <div className={`relative overflow-hidden bg-secondary ${className}`}>
      <Image
        src={src}
        alt={alt}
        fittingType={fittingType}
        loading={priority ? 'eager' : 'lazy'}
        className={`h-full w-full object-cover ${imageClassName}`}
      />
    </div>
  );
}