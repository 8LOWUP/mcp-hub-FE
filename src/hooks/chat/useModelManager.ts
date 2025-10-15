import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLLMs } from './useLLM';

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  description: string;
  isAvailable: boolean;
}


const STORAGE_KEYS = {
  MODELS: 'available-models',
  SELECTED_MODEL: 'selected-model',
} as const;

export const useModelManager = (enabled: boolean = true) => {
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // API에서 모델 리스트 가져오기 (조건부 호출)
  const shouldFetchModels = enabled && !hasInitialized;
  const { data: apiModels, isLoading: apiLoading, error } = useLLMs(shouldFetchModels);

  // API 모델을 UI 모델 형식으로 변환
  const convertApiModels = useCallback((apiModels: any[]): ModelInfo[] => {
    return apiModels.map(apiModel => ({
      id: apiModel.llmId,
      name: apiModel.modelName,
      provider: apiModel.llmProvider || "Unknown",
      description: `${apiModel.modelName} 모델`,
      isAvailable: true,
    }));
  }, []);

  // 모델 선택
  const selectModel = useCallback((modelId: string) => {
    const model = availableModels.find(m => m.id === modelId) || null;
    setSelectedModel(model || null);
    if (model) {
      console.log("[useModelManager] selectedModel set:", {
        id: model.id,
        name: model.name,
        provider: model.provider,
      });
    } else {
      console.warn("[useModelManager] selectModel: model not found for id", modelId);
    }
  }, [availableModels]);

  // API에서 모델 리스트 업데이트 (API만 신뢰, 임시/로컬 저장소 미사용)
  useEffect(() => {
    if (apiModels && Array.isArray(apiModels) && apiModels.length > 0) {
      const convertedModels = convertApiModels(apiModels);
      setAvailableModels(convertedModels);
      // API가 도착했고 아직 선택이 없다면 첫 번째 모델 자동 선택
      if (!selectedModel) {
        setSelectedModel(convertedModels[0] ?? null);
      }
      setHasInitialized(true);
    } else if (!apiLoading) {
      // API가 비었거나 실패한 경우: 빈 목록 유지, 선택 없음
      setAvailableModels([]);
      setSelectedModel(null);
      setHasInitialized(true);
    }
  }, [apiModels, apiLoading, convertApiModels]);

  // 모델 새로고침 함수 (API 재호출 트리거용 placeholder)
  const refreshModels = useCallback(() => {
    setIsLoading(true);
    // useLLMs의 enabled/키가 변해야 재요청되므로 별도 제어가 필요하다면 개선
    setTimeout(() => setIsLoading(false), 300);
  }, []);

  return useMemo(() => ({
    availableModels,
    selectedModel,
    isLoading: isLoading || apiLoading,
    error,
    selectModel,
    refreshModels,
  }), [availableModels, selectedModel, isLoading, apiLoading, error, selectModel, refreshModels]);
};
