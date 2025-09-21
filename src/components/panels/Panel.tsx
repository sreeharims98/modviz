import { MaterialPanel } from "./MaterialPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TABS } from "@/constants";
import { ScenePanel } from "./ScenePanel";
import { useAppStore } from "@/store/useAppStore";
import { SharePanel } from "./SharePanel";

export const Panel = () => {
  const isModelLoaded = useAppStore((state) => state.isModelLoaded);

  return (
    <div className="w-[300px] flex flex-col p-2 bg-panel border-l border-panel-border">
      <Tabs defaultValue={TABS.SHARE} className="w-full flex-1">
        <TabsList>
          {Object.values(TABS).map((tab) => (
            <TabsTrigger key={tab} value={tab} disabled={!isModelLoaded}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={TABS.MATERIALS}>
          <MaterialPanel />
        </TabsContent>
        <TabsContent value={TABS.SCENE}>
          <ScenePanel />
        </TabsContent>
        <TabsContent value={TABS.SHARE}>
          <SharePanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};
