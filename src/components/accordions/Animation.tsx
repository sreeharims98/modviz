import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";

export const Animation = () => {
  const { clipsRef, currentAction, setCurrentAction, mixerRef } =
    useAppContext();

  const animClips = useMemo(
    () => clipsRef.current.map((clip) => clip.name),
    [clipsRef]
  );

  const handleAnimationChange = (selectedName: string) => {
    // Stop current action
    if (currentAction) {
      currentAction.stop();
    }
    const clip = clipsRef.current.find((c) => c.name === selectedName);

    if (clip && mixerRef.current) {
      const newAction = mixerRef.current.clipAction(clip);
      if (newAction) {
        newAction.reset().play();
        setCurrentAction(newAction);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Animations */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <Select
            value={currentAction?.getClip().name}
            onValueChange={(value) => handleAnimationChange(value)}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select Animation" />
            </SelectTrigger>
            <SelectContent>
              {animClips.map((anim) => (
                <SelectItem value={anim} key={anim}>
                  {anim}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
