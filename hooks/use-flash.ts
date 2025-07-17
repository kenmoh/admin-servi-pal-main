import { useEffect, useRef, useState } from "react";

export const useDataFlash = (
  data: any,
  keyField = "id",
  flashDuration = 2000,
  style = "default"
) => {
  const previousData = useRef(new Map());
  const [flashingItems, setFlashingItems] = useState(new Map());
  const timeoutRef = useRef(new Map());
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!data || !Array.isArray(data)) return;

    if (isFirstRender.current) {
      // On first render, just set previousData and skip flashing
      previousData.current = new Map(
        data.map((item) => [item[keyField], item])
      );
      isFirstRender.current = false;
      return;
    }

    const newFlashingItems = new Map();
    const currentDataMap = new Map(data.map((item) => [item[keyField], item]));

    // Check for new items and updated items
    data.forEach((item) => {
      const itemId = item[keyField];
      const previousItem = previousData.current.get(itemId);

      if (!previousItem) {
        // New item
        newFlashingItems.set(itemId, "new");
      } else if (JSON.stringify(previousItem) !== JSON.stringify(item)) {
        // Updated item
        newFlashingItems.set(itemId, "updated");
      }
    });

    // Update flashing items
    if (newFlashingItems.size > 0) {
      setFlashingItems((prev) => {
        const updated = new Map(prev);
        newFlashingItems.forEach((type, id) => {
          updated.set(id, type);

          // Clear any existing timeout for this item
          if (timeoutRef.current.has(id)) {
            clearTimeout(timeoutRef.current.get(id));
          }

          // Set new timeout
          const timeout = setTimeout(() => {
            setFlashingItems((current) => {
              const newMap = new Map(current);
              newMap.delete(id);
              return newMap;
            });
            timeoutRef.current.delete(id);
          }, flashDuration);

          timeoutRef.current.set(id, timeout);
        });
        return updated;
      });
    }

    // Update previous data reference
    previousData.current = currentDataMap;

    // Cleanup timeouts on unmount
    return () => {
      timeoutRef.current.forEach((timeout) => clearTimeout(timeout));
    };
  }, [data, keyField, flashDuration, style]);

  // Helper function to get flash class
  const getFlashClass = (itemId: string) => {
    const flashType = flashingItems.get(itemId);
    if (!flashType) return "";

    const styleType = {
      default: flashType === "new" ? "flash-new" : "flash-updated",
      pulse: flashType === "new" ? "flash-new-pulse" : "flash-updated-pulse",
      glow: flashType === "new" ? "flash-new-glow" : "flash-updated-glow",
    };
    // return flashType === "new" ? "flash-new" : "flash-updated";
    return styleType.default;
  };

  // Helper function to check if item is flashing
  const isFlashing = (itemId: string) => flashingItems.has(itemId);

  return {
    getFlashClass,
    isFlashing,
    flashingItems,
  };
};
