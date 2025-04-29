// hooks/useColumnVisibility.js
import { useEffect, useState } from "react";

export function useColumnVisibility(tableKey, defaultVisible) {
  const [visibleColumns, setVisibleColumns] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(`visible-columns-${tableKey}`);
    if (stored) {
      setVisibleColumns(JSON.parse(stored));
    } else {
      setVisibleColumns(defaultVisible);
    }
  }, [tableKey]);

  useEffect(() => {
    localStorage.setItem(
      `visible-columns-${tableKey}`,
      JSON.stringify(visibleColumns)
    );
  }, [tableKey, visibleColumns]);

  const toggleColumn = (key) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const isVisible = (key) => visibleColumns.includes(key);

  return { visibleColumns, toggleColumn, isVisible };
}
