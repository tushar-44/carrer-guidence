import { ResultsIcon } from "@/components/icons/focus/results-icon";
import { SecureIcon } from "@/components/icons/focus/secure-icon";
import { FastIcon } from "@/components/icons/focus/fast-icon";

export function Focus() {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* First Row - Single wide box with two centered columns */}
      <div className="bg-black border border-[#353739] rounded-3xl p-4 flex-[1] grid grid-cols-2 transition-all duration-300 hover:border-[#555759] hover:transform hover:-translate-y-1">
        {/* Left Column - Icon centered */}
        <div className="flex items-center justify-center mr-6">
          <ResultsIcon className="w-26 h-26" />
        </div>
        
        {/* Right Column - Text centered */}
        <div className="flex items-center justify-center">
          <div className="flex flex-col text-left mr-7">
            <h4 className="font-heading text-[#f2f2f2] text-xl mb-2">Results</h4>
            <p className="text-[#b3b3b3] font-light text-sm whitespace-nowrap">Enterprise solutions that<br />drive measurable results</p>
          </div>
        </div>
      </div>
      
      {/* Second Row - Two horizontal boxes */}
      <div className="flex flex-row gap-4 flex-[2]">
        {/* Left box - Secure */}
        <div className="bg-black border border-[#353739] rounded-3xl p-4 flex-1 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-[#555759] hover:transform hover:-translate-y-1">
          <SecureIcon className="w-14 h-14 mb-6" />
          <h4 className="font-heading text-[#f2f2f2] text-lg mb-2">Secure</h4>
          <p className="text-[#b3b3b3] font-light text-sm">Enterprise-grade<br />authentication in<br />every integration</p>
        </div>
        
        {/* Right box - Fast */}
        <div className="bg-black border border-[#353739] rounded-3xl p-4 flex-1 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-[#555759] hover:transform hover:-translate-y-1">
          <FastIcon className="w-14 h-14 mb-6" />
          <h4 className="font-heading text-[#f2f2f2] text-lg mb-2">Fast</h4>
          <p className="text-[#b3b3b3] font-light text-sm">6 to 12 week turn<br />around that ship<br />quality solutions</p>
        </div>
      </div>
    </div>
  );
}