import { PortraitGallery } from "@/components/PortraitGallery";
import { SalonCopy } from "@/components/page-copy/SalonCopy";

export default function SalonPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <SalonCopy />
      <PortraitGallery />
    </div>
  );
}
