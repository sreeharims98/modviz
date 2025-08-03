import { useAppContext } from "@/context/AppContext";
import { useEffect, useMemo } from "react";
import { MeshPhysicalMaterial, MeshStandardMaterial } from "three";

export const useMaterial = () => {
  const { selectedMaterial, materialSettings } = useAppContext();

  // Memoize color parsing to avoid expensive operations on every render
  const colorHex = useMemo(() => {
    if (!materialSettings.color) return 0x000000;
    return parseInt(materialSettings.color.replace("#", ""), 16);
  }, [materialSettings.color]);

  const emissiveHex = useMemo(() => {
    if (!materialSettings.emissive) return 0x000000;
    return parseInt(materialSettings.emissive.replace("#", ""), 16);
  }, [materialSettings.emissive]);

  // Update color when it changes
  useEffect(() => {
    if (!selectedMaterial) return;

    if (
      selectedMaterial instanceof MeshStandardMaterial ||
      selectedMaterial instanceof MeshPhysicalMaterial
    ) {
      selectedMaterial.color.setHex(colorHex);
      selectedMaterial.needsUpdate = true;
    }
  }, [selectedMaterial, colorHex]);

  // Update metalness when it changes
  useEffect(() => {
    if (!selectedMaterial) return;

    if (
      selectedMaterial instanceof MeshStandardMaterial ||
      selectedMaterial instanceof MeshPhysicalMaterial
    ) {
      selectedMaterial.metalness = materialSettings.metalness;
      selectedMaterial.needsUpdate = true;
    }
  }, [selectedMaterial, materialSettings.metalness]);

  // Update roughness when it changes
  useEffect(() => {
    if (!selectedMaterial) return;

    if (
      selectedMaterial instanceof MeshStandardMaterial ||
      selectedMaterial instanceof MeshPhysicalMaterial
    ) {
      selectedMaterial.roughness = materialSettings.roughness;
      selectedMaterial.needsUpdate = true;
    }
  }, [selectedMaterial, materialSettings.roughness]);

  // Update emissive color when it changes
  useEffect(() => {
    if (!selectedMaterial) return;

    if (
      selectedMaterial instanceof MeshStandardMaterial ||
      selectedMaterial instanceof MeshPhysicalMaterial
    ) {
      selectedMaterial.emissive.setHex(emissiveHex);
      selectedMaterial.needsUpdate = true;
    }
  }, [selectedMaterial, emissiveHex]);

  // Update emissive intensity when it changes
  useEffect(() => {
    if (!selectedMaterial) return;

    if (
      selectedMaterial instanceof MeshStandardMaterial ||
      selectedMaterial instanceof MeshPhysicalMaterial
    ) {
      selectedMaterial.emissiveIntensity = materialSettings.emissiveIntensity;
      selectedMaterial.needsUpdate = true;
    }
  }, [selectedMaterial, materialSettings.emissiveIntensity]);
};
