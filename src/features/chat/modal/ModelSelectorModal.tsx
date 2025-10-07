"use client";

import { useState } from "react";
import BaseModal from "./BaseModal";
import clsx from "clsx";

type ModelSelectorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentModel: string;
  onModelSelect: (modelId: string) => void;
  anchorRect?: DOMRect | null;
  availableModels?: Array<{ id: string; name: string; provider: string; description: string; isAvailable: boolean }>;
  isLoading?: boolean;
  error?: any;
};

export default function ModelSelectorModal({
  isOpen,
  onClose,
  currentModel,
  onModelSelect,
  anchorRect,
  availableModels = [],
  isLoading = false,
  error = null,
}: ModelSelectorModalProps) {
  const [selectedModel, setSelectedModel] = useState(currentModel);

  const handleDirectSelect = (modelId: string) => {
    onModelSelect(modelId);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} anchorRect={anchorRect ?? null} placement="top">
      <div className="bg-surface-2 rounded-2xl z-50 p-2">
        {isLoading ? (
          <div className="p-4 text-center text-sm text-foreground/70">
            모델 목록을 불러오는 중...
          </div>
        ) : error ? (
          <div className="p-4 text-center text-sm text-red-500">
            모델 목록을 불러올 수 없습니다.
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {availableModels.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                if (!model.isAvailable) return;
                // 즉시 반영: setState 비동기 반영을 기다리지 않고 직접 전달
                setSelectedModel(model.id);
                handleDirectSelect(model.id);
              }}
              disabled={!model.isAvailable}
              className={clsx(
                "w-full text-left p-1 rounded-sm transition-all",
                "flex items-center justify-between",
                "hover:bg-surface-3",
                selectedModel === model.id
                  ? "text-accent bg-accent/10"
                  : "border-surface-3 hover:border-surface-4",
                !model.isAvailable
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              )}
            >
              <div className="flex-1">
                <div className="flex justify-between items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{model.name}</span>
                </div>
              </div>
            </button>
            ))}
          </div>
        )}
      </div>
    </BaseModal>
  );
}
