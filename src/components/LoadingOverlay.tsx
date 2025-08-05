import { useAppContext } from "@/context/AppContext";
import { Progress } from "@/components/ui/progress";

export const LoadingOverlay = () => {
  const { loadingProgress } = useAppContext();

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background rounded-lg border p-6 shadow-lg">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Loading Model...</span>
          </div>
          <div className="w-64">
            <Progress value={loadingProgress * 100} className="w-full" />
          </div>
          <span className="text-xs text-muted-foreground">
            {Math.round(loadingProgress * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};
