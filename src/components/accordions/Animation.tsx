import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/store/useAppStore";

export const Animation = () => {
  const clips = useAppStore((state) => state.clips);
  const setSelectedAnimation = useAppStore(
    (state) => state.setSelectedAnimation
  );
  const currentAction = useAppStore((state) => state.currentAction);

  const animClips = useMemo(() => clips.map((clip) => clip.name), [clips]);

  const handleAnimationChange = (selectedName: string) => {
    // Stop current action
    if (currentAction) {
      currentAction.stop();
    }
    setSelectedAnimation(selectedName);
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
