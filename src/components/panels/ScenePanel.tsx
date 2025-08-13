import { EmptyMessage } from "../EmptyMessage";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Lighting } from "../accordions/Lighting";
import { Animation } from "../accordions/Animation";
import { useAppStore } from "@/store/useAppStore";

export const ScenePanel = () => {
  const isModelLoaded = useAppStore((state) => state.isModelLoaded);
  const clips = useAppStore((state) => state.clips);

  return (
    <div className="w-full h-full overflow-y-auto">
      {!isModelLoaded ? (
        <EmptyMessage icon="🎬" title="Load a 3D model to edit scene" />
      ) : (
        <Accordion type="single" collapsible>
          <AccordionItem value="lighting">
            <AccordionTrigger>Lighting</AccordionTrigger>
            <AccordionContent>
              <Lighting />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="animations" disabled={clips.length === 0}>
            <AccordionTrigger>Animations</AccordionTrigger>
            {clips.length > 0 && (
              <AccordionContent>
                <Animation />
              </AccordionContent>
            )}
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};
