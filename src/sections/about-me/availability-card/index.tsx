import { useDrawerStore } from "@/stores/drawerStore";

export function AvailabilityCard() {
  const { open: openDrawer } = useDrawerStore();

  const handleAvailabilityClick = () => {
    console.log('🎯 Opening contact drawer from availability card');
    openDrawer();
  };

  return (
    <button 
      onClick={handleAvailabilityClick}
      className="bento-no-min col-span-3 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
    >
      <h3 className="font-heading text-xl text-foreground text-center">
        Ready to guide 5 new students this month
      </h3>
    </button>
  );
}