import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/store/useAppStore";
import {
  Material,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
} from "three";

export function SelectMaterial() {
  const materials = useAppStore((state) => state.materials);
  const selectedMaterial = useAppStore((state) => state.selectedMaterial);
  const handleMaterialSelect = useAppStore(
    (state) => state.handleMaterialSelect
  );

  const getMaterialName = (material: Material, index: number): string => {
    return material.name || `Material ${index + 1}`;
  };

  const getMaterialType = (material: Material): string => {
    if (material instanceof MeshStandardMaterial) return "Standard";
    if (material instanceof MeshPhysicalMaterial) return "Physical";
    if (material instanceof MeshBasicMaterial) return "Basic";
    if (material instanceof MeshLambertMaterial) return "Lambert";
    if (material instanceof MeshPhongMaterial) return "Phong";
    return "Unknown";
  };

  return (
    <Select
      value={selectedMaterial?.uuid}
      onValueChange={(value) =>
        handleMaterialSelect(
          materials.find((material) => material.uuid === value)!
        )
      }
    >
      <SelectTrigger className="w-full" style={{ height: "52px" }}>
        <SelectValue placeholder="Select Material" />
      </SelectTrigger>
      <SelectContent>
        {materials.map((material, index) => (
          <SelectItem value={material.uuid} key={material.uuid}>
            <div className="flex items-center justify-between gap-2 w-full">
              <div
                className="w-6 h-6 rounded border border-border flex-shrink-0"
                style={{
                  backgroundColor:
                    material instanceof MeshStandardMaterial ||
                    material instanceof MeshPhysicalMaterial
                      ? `#${material.color.getHexString()}`
                      : "#666666",
                }}
              />
              <div className="flex-1 flex flex-col items-start">
                <div className="font-medium text-sm">
                  {getMaterialName(material, index)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {getMaterialType(material)}
                </div>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
