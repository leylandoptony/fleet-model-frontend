import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { MdInfoOutline } from "react-icons/md";
import { Label } from "../ui/label";

const ControlLabel = ({ text, info }) => {
  return (
    <TooltipProvider className="z-[100]">
      <Tooltip className="z-[100]">
        <Label className="w-full">
          <div className="w-full flex gap-2 relative">
            <TooltipTrigger className="absolute -left-6" asChild>
              <button>
                <MdInfoOutline size={15} />
              </button>
            </TooltipTrigger>
            <p className="inline-block p-0 m-0 text-left whitespace-pre-wrap break-words max-w-[75%]">
              {text}
            </p>
          </div>
        </Label>
        <TooltipContent>
          <p className="z-[100]">{info}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ControlLabel;
