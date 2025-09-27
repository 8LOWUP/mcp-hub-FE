// chat/components/ActiveMCPListContainer.tsx
"use client";

import { useChatStore } from "@/store/chat/chat-store";
import ActiveMCPCard from "./ActiveMCPCard";

const ActiveMCPListContainer = () => {
  const currentId = useChatStore((s) => s.currentWorkspaceId);
  const detail = useChatStore((s) =>
    currentId ? s.workspaceCache[currentId] : undefined
  );
  const mcps = detail?.mcps ?? [];
  const selectedMcpId = (detail as any)?.selectedMcpId ?? null;

  const setSelectedMcp = (mcpId: string) => {
    if (!currentId) return;
    useChatStore.setState((prev) => {
      const d = prev.workspaceCache[currentId];
      if (!d) return prev;
      return {
        workspaceCache: {
          ...prev.workspaceCache,
          [currentId]: { ...d, selectedMcpId: mcpId },
        },
      };
    });
  };

  const toggleMcpActive = (mcpId: string, next: boolean) => {
    if (!currentId) return;
    useChatStore.setState((prev) => {
      const d = prev.workspaceCache[currentId];
      if (!d) return prev;
      const updated = (d.mcps ?? []).map((m) =>
        m.id === mcpId ? { ...m, active: next } : m
      );
      return {
        workspaceCache: {
          ...prev.workspaceCache,
          [currentId]: { ...d, mcps: updated },
        },
      };
    });
  };

  return (
    <>
      <h2 className="text-2xl font-bold p-3">Active MCP</h2>
      <ul className="flex flex-col w-full rounded-2xl h-fit overflow-y-auto bg-surface-2 p-2">
        {mcps.length === 0 && (
          <li className="text-sm text-foreground/60 p-3">No MCPs available</li>
        )}
        {mcps.map((mcp) => (
          <li key={mcp.id} className="mb-2 last:mb-0">
            <ActiveMCPCard
              id={mcp.id}
              name={(mcp as any).name ?? `MCP-${mcp.id}`}
              active={mcp.active}
              selected={selectedMcpId === mcp.id}
              onSelect={setSelectedMcp}
              onToggle={(next) => toggleMcpActive(mcp.id, next)}
            />
          </li>
        ))}
      </ul>
    </>
  );
};

export default ActiveMCPListContainer;