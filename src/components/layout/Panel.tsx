import { MaterialPanel } from "./MaterialPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TABS } from "@/constants";

export const Panel = () => {
  return (
    <div className="p-2 bg-panel border-l border-panel-border">
      <Tabs defaultValue={TABS.MATERIALS} className="w-[400px]">
        <TabsList>
          {Object.values(TABS).map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={TABS.MATERIALS}>
          <MaterialPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};
