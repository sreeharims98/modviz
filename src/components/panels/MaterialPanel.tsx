import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Material, MeshPhysicalMaterial, MeshStandardMaterial } from "three";
import { SelectMaterial } from "../SelectMaterial";
import { EmptyMessage } from "../EmptyMessage";
import { useAppStore } from "@/store/useAppStore";

export const MaterialPanel = () => {
  const materials = useAppStore((state) => state.materials);
  const selectedMaterial = useAppStore((state) => state.selectedMaterial);
  const materialSettings = useAppStore((state) => state.materialSettings);
  const handleMaterialSettingsChange = useAppStore(
    (state) => state.handleMaterialSettingsChange
  );
  const resetMaterialSettings = useAppStore(
    (state) => state.resetMaterialSettings
  );

  const canEditMaterial = (material: Material): boolean => {
    return (
      material instanceof MeshStandardMaterial ||
      material instanceof MeshPhysicalMaterial
    );
  };

  return (
    <div className="w-full h-full overflow-y-auto">
      {materials.length === 0 ? (
        <EmptyMessage icon="🎨" title="Load a 3D model to edit its materials" />
      ) : (
        <>
          {/* Material List */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wide">
              Materials ({materials.length})
            </h3>
            <SelectMaterial />
          </div>

          {/* Material Settings */}
          {selectedMaterial && canEditMaterial(selectedMaterial) && (
            <div className="space-y-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Settings
              </h3>

              {/* Base Color */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Base Color</Label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={materialSettings.color}
                    onChange={(e) =>
                      handleMaterialSettingsChange("color", e.target.value)
                    }
                    className="w-12 h-8 rounded border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={materialSettings.color}
                    onChange={(e) =>
                      handleMaterialSettingsChange("color", e.target.value)
                    }
                    className="flex-1 px-3 py-1 text-sm bg-input border border-border rounded"
                  />
                </div>
              </div>

              {/* Metalness */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Metalness</Label>
                  <span className="text-sm text-muted-foreground">
                    {materialSettings.metalness.toFixed(2)}
                  </span>
                </div>
                <Slider
                  value={[materialSettings.metalness]}
                  onValueChange={([value]) =>
                    handleMaterialSettingsChange("metalness", value)
                  }
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Roughness */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Roughness</Label>
                  <span className="text-sm text-muted-foreground">
                    {materialSettings.roughness.toFixed(2)}
                  </span>
                </div>
                <Slider
                  value={[materialSettings.roughness]}
                  onValueChange={([value]) =>
                    handleMaterialSettingsChange("roughness", value)
                  }
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Emissive Color */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Emissive Color</Label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={materialSettings.emissive}
                    onChange={(e) =>
                      handleMaterialSettingsChange("emissive", e.target.value)
                    }
                    className="w-12 h-8 rounded border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={materialSettings.emissive}
                    onChange={(e) =>
                      handleMaterialSettingsChange("emissive", e.target.value)
                    }
                    className="flex-1 px-3 py-1 text-sm bg-input border border-border rounded"
                  />
                </div>
              </div>

              {/* Emissive Intensity */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">
                    Emissive Intensity
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {materialSettings.emissiveIntensity.toFixed(2)}
                  </span>
                </div>
                <Slider
                  value={[materialSettings.emissiveIntensity]}
                  onValueChange={([value]) =>
                    handleMaterialSettingsChange("emissiveIntensity", value)
                  }
                  min={0}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Reset Button */}
              <div className="border-t pt-4 space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetMaterialSettings}
                  className="w-full"
                >
                  Reset this Material
                </Button>
              </div>
            </div>
          )}

          {selectedMaterial && !canEditMaterial(selectedMaterial) && (
            <div className="text-center text-muted-foreground py-8">
              <div className="text-4xl mb-4 opacity-50">🔒</div>
              <p className="text-sm">
                This material type is not editable.
                <br />
                Try selecting a Standard or Physical material.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
