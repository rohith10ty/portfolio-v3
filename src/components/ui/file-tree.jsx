import React, { createContext, useContext, useEffect, useState } from "react";
import { ChevronRight, File as FileIcon, Folder as FolderIcon, FolderOpen as FolderOpenIcon } from "lucide-react";
import { cn } from "../../lib/utils";


const TreeContext = createContext({
  selectedId: null,
  selectItem: () => {},
  expandedItems: new Set(),
  toggleExpanded: () => {},
});

export const Tree = ({
  className,
  elements = [],
  initialSelectedId = null,
  initialExpandedItems = [],
  onSelect,
  children,
  ...props
}) => {
  const [selectedId, setSelectedId] = useState(initialSelectedId);
  const [expandedItems, setExpandedItems] = useState(
    () => new Set(initialExpandedItems)
  );

  useEffect(() => {
    setSelectedId(initialSelectedId);
  }, [initialSelectedId]);

  const selectItem = (id, element) => {
    const nextId = selectedId === id ? null : id;
    setSelectedId(nextId);
    onSelect?.(nextId, nextId ? element : null);
  };

  const toggleExpanded = (id) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <TreeContext.Provider
      value={{ selectedId, selectItem, expandedItems, toggleExpanded }}
    >
      <div
        className={cn(
          "w-full select-none font-mono text-[12.5px] text-[#e1dcc9]/90",
          className
        )}
        {...props}
      >
        {elements && elements.length > 0
          ? elements.map((element) => (
              <TreeItem key={element.id} element={element} />
            ))
          : children}
      </div>
    </TreeContext.Provider>
  );
};

const TreeItem = ({ element }) => {
  if (element.children && element.children.length > 0) {
    return (
      <Folder element={element}>
        {element.children.map((child) => (
          <TreeItem key={child.id} element={child} />
        ))}
      </Folder>
    );
  }

  return <File element={element} />;
};

export const Folder = ({ element, children, className }) => {
  const { expandedItems, toggleExpanded } = useContext(TreeContext);
  const isExpanded = expandedItems.has(element.id);

  return (
    <div className={cn("flex flex-col", className)}>
      <div
        onClick={() => toggleExpanded(element.id)}
        className={cn(
          "group flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors duration-150 hover:bg-white/5",
          isExpanded ? "text-[#f0cd9b]" : "text-[#e1dcc9]/75"
        )}
      >
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-[#9a6a35] transition-transform duration-200",
            isExpanded && "rotate-90 text-[#f0cd9b]"
          )}
        />
        {isExpanded ? (
          <FolderOpenIcon className="h-4 w-4 shrink-0 text-[#d8a05e]" />
        ) : (
          <FolderIcon className="h-4 w-4 shrink-0 text-[#9a6a35]" />
        )}
        <span className="truncate font-medium text-[#e1dcc9]/90 group-hover:text-white">
          {element.name}
        </span>
      </div>

      {isExpanded && (
        <div className="relative ml-3.5 flex flex-col border-l border-[rgba(225,188,120,0.18)] pl-2">
          {children}
        </div>
      )}
    </div>
  );
};

export const File = ({ element, className }) => {
  const { selectedId, selectItem } = useContext(TreeContext);
  const isSelected = selectedId === element.id;

  return (
    <div
      onClick={() => selectItem(element.id, element)}
      className={cn(
        "group relative flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 transition-all duration-150",
        isSelected
          ? "border border-[rgba(225,188,120,0.35)] bg-[rgba(216,160,94,0.16)] text-[#f0cd9b] shadow-[0_0_12px_rgba(216,160,94,0.12)]"
          : "text-[#e1dcc9]/70 hover:bg-white/5 hover:text-[#e1dcc9]",
        className
      )}
    >
      <FileIcon
        className={cn(
          "h-3.5 w-3.5 shrink-0 transition-colors",
          isSelected ? "text-[#f0cd9b]" : "text-[#8d877d] group-hover:text-[#d8a05e]"
        )}
      />
      <span className="truncate font-normal tracking-wide">{element.name}</span>
    </div>
  );
};
