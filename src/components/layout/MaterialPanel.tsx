import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Material, MeshPhysicalMaterial, MeshStandardMaterial } from "three";
import { SelectMaterial } from "../common/SelectMaterial";

interface MaterialPanelProps {
  materials: Material[];
  selectedMaterial: Material | null;
  onMaterialSelect: (material: Material) => void;
  materialProperties: {
    color: string;
    metalness: number;
    roughness: number;
    emissive: string;
    emissiveIntensity: number;
  };
  onPropertyChange: (property: string, value: string) => void;
}

export const MaterialPanel = ({
  materials,
  selectedMaterial,
  onMaterialSelect,
  materialProperties,
  onPropertyChange,
}: MaterialPanelProps) => {
  const canEditMaterial = (material: Material): boolean => {
    return (
      material instanceof MeshStandardMaterial ||
      material instanceof MeshPhysicalMaterial
    );
  };

  return (
    <div className="w-80 bg-panel border-l border-panel-border h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-6">Material Editor</h2>

        {materials.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <div className="text-4xl mb-4 opacity-50">🎨</div>
            <p>Load a 3D model to edit its materials</p>
          </div>
        ) : (
          <>
            {/* Material List */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wide">
                Materials ({materials.length})
              </h3>
              <SelectMaterial
                onMaterialSelect={onMaterialSelect}
                selectedMaterial={selectedMaterial}
                materials={materials}
              />
            </div>

            {/* Material Properties */}
            {selectedMaterial && canEditMaterial(selectedMaterial) && (
              <div className="space-y-6">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Properties
                </h3>

                {/* Base Color */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Base Color</Label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={materialProperties.color}
                      onChange={(e) =>
                        onPropertyChange("color", e.target.value)
                      }
                      className="w-12 h-8 rounded border border-border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={materialProperties.color}
                      onChange={(e) =>
                        onPropertyChange("color", e.target.value)
                      }
                      className="flex-1 px-3 py-1 text-sm bg-input border border-border rounded"
                    />
                  </div>
                </div>

                {/* Metalness */}
                {/* <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Metalness</Label>
                    <span className="text-sm text-muted-foreground">
                      {materialProperties.metalness.toFixed(2)}
                    </span>
                  </div>
                  <Slider
                    value={[materialProperties.metalness]}
                    onValueChange={([value]) =>
                      onPropertyChange("metalness", value)
                    }
                    min={0}
                    max={1}
                    step={0.01}
                    className="w-full"
                  />
                </div> */}

                {/* Roughness */}
                {/* <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Roughness</Label>
                    <span className="text-sm text-muted-foreground">
                      {materialProperties.roughness.toFixed(2)}
                    </span>
                  </div>
                  <Slider
                    value={[materialProperties.roughness]}
                    onValueChange={([value]) =>
                      onPropertyChange("roughness", value)
                    }
                    min={0}
                    max={1}
                    step={0.01}
                    className="w-full"
                  />
                </div> */}

                {/* Emissive Color */}
                {/* <div className="space-y-2">
                  <Label className="text-sm font-medium">Emissive Color</Label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={materialProperties.emissive}
                      onChange={(e) =>
                        onPropertyChange("emissive", e.target.value)
                      }
                      className="w-12 h-8 rounded border border-border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={materialProperties.emissive}
                      onChange={(e) =>
                        onPropertyChange("emissive", e.target.value)
                      }
                      className="flex-1 px-3 py-1 text-sm bg-input border border-border rounded"
                    />
                  </div>
                </div> */}

                {/* Emissive Intensity */}
                {/* <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">
                      Emissive Intensity
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {materialProperties.emissiveIntensity.toFixed(2)}
                    </span>
                  </div>
                  <Slider
                    value={[materialProperties.emissiveIntensity]}
                    onValueChange={([value]) =>
                      onPropertyChange("emissiveIntensity", value)
                    }
                    min={0}
                    max={2}
                    step={0.01}
                    className="w-full"
                  />
                </div> */}

                {/* Reset Button */}
                {/* <Button
                  variant="outline"
                  onClick={() => {
                    onPropertyChange("color", "#ffffff");
                    onPropertyChange("metalness", 0);
                    onPropertyChange("roughness", 0.5);
                    onPropertyChange("emissive", "#000000");
                    onPropertyChange("emissiveIntensity", 0);
                  }}
                  className="w-full"
                >
                  Reset Properties
                </Button> */}
              </div>
            )}

            {/* {selectedMaterial && !canEditMaterial(selectedMaterial) && (
              <div className="text-center text-muted-foreground py-8">
                <div className="text-4xl mb-4 opacity-50">🔒</div>
                <p className="text-sm">
                  This material type ({getMaterialType(selectedMaterial)}) is
                  not editable.
                  <br />
                  Try selecting a Standard or Physical material.
                </p>
              </div>
            )} */}
          </>
        )}
      </div>
    </div>
  );
};
