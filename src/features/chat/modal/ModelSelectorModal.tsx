"use client";

import { useState } from "react";
import BaseModal from "./BaseModal";
import clsx from "clsx";

type Model = {
  id: string;
  name: string;
  provider: string;
  description: string;
  isAvailable: boolean;
};

const MODELS: Model[] = [
  {
    id: "gpt-4",
    name: "GPT-4",
    provider: "OpenAI",
    description: "가장 강력한 GPT-4 모델",
    isAvailable: true,
  },
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    provider: "OpenAI", 
    description: "빠르고 효율적인 GPT-4 Turbo",
    isAvailable: true,
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    description: "빠르고 경제적인 GPT-3.5",
    isAvailable: true,
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    description: "Anthropic의 최고 성능 모델",
    isAvailable: false,
  },
];

type ModelSelectorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentModel: string;
  onModelSelect: (modelId: string) => void;
  anchorRect?: DOMRect | null;
};

export default function ModelSelectorModal({
  isOpen,
  onClose,
  currentModel,
  onModelSelect,
  anchorRect,
}: ModelSelectorModalProps) {
  const [selectedModel, setSelectedModel] = useState(currentModel);

  const handleDirectSelect = (modelId: string) => {
    onModelSelect(modelId);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} anchorRect={anchorRect ?? null} placement="top">
      <div className="bg-surface-2 rounded-2xl z-50 p-2">
        <div className="flex flex-col gap-1">
          {MODELS.map((model) => (
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
      </div>
    </BaseModal>
  );
}
