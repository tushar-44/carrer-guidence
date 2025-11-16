import { AccuracastIcon } from '../../../components/icons/companies/accuracast-icon';

export function TrustIndicator() {
  return (
    <div className="bento-no-min flex flex-col justify-between items-center text-center h-full">
      <AccuracastIcon className="h-8 w-auto" />
      <span className="font-body text-sm text-muted-foreground font-light">
        Trusted by
      </span>
    </div>
  );
}