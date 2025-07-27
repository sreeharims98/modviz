import { useAppContext } from "@/context/AppContext";
import { EmptyMessage } from "../EmptyMessage";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Lighting } from "../accordions/Lighting";
import { Animation } from "../accordions/Animation";

export const ScenePanel = () => {
  const { isModelLoaded, clipsRef } = useAppContext();

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
          <AccordionItem
            value="animations"
            disabled={clipsRef.current.length === 0}
          >
            <AccordionTrigger>Animations</AccordionTrigger>
            {clipsRef.current.length > 0 && (
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
