import { useAppStore } from "@/store/useAppStore";
import { RefObject, useEffect } from "react";
import { AnimationMixer } from "three";

export const useAnimation = ({
  mixerRef,
}: {
  mixerRef: RefObject<AnimationMixer | null>;
}) => {
  const clips = useAppStore((state) => state.clips);
  const selectedAnimation = useAppStore((state) => state.selectedAnimation);
  const setCurrentAction = useAppStore((state) => state.setCurrentAction);

  const clip = clips.find((c) => c.name === selectedAnimation);

  useEffect(() => {
    if (clip && mixerRef.current) {
      const newAction = mixerRef.current.clipAction(clip);
      if (newAction) {
        newAction.reset().play();
        setCurrentAction(newAction);
      }
    }
  }, [clip, mixerRef, setCurrentAction]);
};
