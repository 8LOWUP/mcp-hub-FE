import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLLMs } from './useLLM';

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  description: string;
  isAvailable: boolean;
}

// 기본 모델 (API에서 데이터를 받아오지 못할 때 사용)
const DEFAULT_MODELS: ModelInfo[] = [
  {
    id: "GPT",
    name: "GPT-5",
    provider: "OpenAI",
    description: "가장 강력한 GPT-5 모델",
    isAvailable: true,
  },
  {
    id: "GPT",
    name: "GPT-5 Turbo",
    provider: "OpenAI", 
    description: "빠르고 효율적인 GPT-5 Turbo",
    isAvailable: true,
  },
  {
    id: "GPT",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    description: "빠르고 경제적인 GPT-3.5",
    isAvailable: true,
  },
];

const STORAGE_KEYS = {
  MODELS: 'available-models',
  SELECTED_MODEL: 'selected-model',
} as const;

export const useModelManager = (enabled: boolean = true) => {
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>(DEFAULT_MODELS);
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
  
  // 로컬 스토리지 사용 안함 - API에서만 데이터 가져오기
  const loadModelsFromStorage = useCallback(() => {
    // 로컬 스토리지에서 모델 데이터를 불러오지 않음
  }, []);
  
  // 로컬 스토리지 사용 안함 - API에서만 데이터 가져오기
  const saveModelsToStorage = useCallback((models: ModelInfo[]) => {
    // 로컬 스토리지에 모델 데이터를 저장하지 않음
  }, []);
  
  // 로컬 스토리지 사용 안함 - API에서만 데이터 가져오기
  const loadSelectedModelFromStorage = useCallback(() => {
    // 로컬 스토리지에서 선택된 모델을 불러오지 않음
  }, []);
  
  // 로컬 스토리지 사용 안함 - API에서만 데이터 가져오기
  const saveSelectedModelToStorage = useCallback((model: ModelInfo) => {
    // 로컬 스토리지에 선택된 모델을 저장하지 않음
  }, []);
  
  // 모델 선택 (로컬 스토리지 사용 안함)
  const selectModel = useCallback((modelId: string) => {
    const model = availableModels.find(m => m.id === modelId);
    if (model) {
      setSelectedModel(model);
    }
  }, [availableModels]);
  
  // API에서 모델 리스트 업데이트
  useEffect(() => {
    if (apiModels && Array.isArray(apiModels) && apiModels.length > 0) {
      const convertedModels = convertApiModels(apiModels);
      setAvailableModels(convertedModels);
      setHasInitialized(true);
    } else if (error) {
      setAvailableModels(DEFAULT_MODELS);
      setHasInitialized(true);
    } else if (!apiLoading && (!apiModels || (Array.isArray(apiModels) && apiModels.length === 0))) {
      setAvailableModels(DEFAULT_MODELS);
      setHasInitialized(true);
    }
  }, [apiModels, convertApiModels, error, apiLoading]);
  
  // 초기 로딩 시 저장된 데이터 불러오기 (로컬 스토리지 사용 안함)
  useEffect(() => {
    loadModelsFromStorage();
    loadSelectedModelFromStorage();
  }, [loadModelsFromStorage, loadSelectedModelFromStorage]);
  
  // 선택된 모델이 없으면 첫 번째 모델 자동 선택 (로컬 스토리지 사용 안함)
  useEffect(() => {
    if (!selectedModel && availableModels.length > 0) {
      const firstModel = availableModels[0];
      setSelectedModel(firstModel);
    }
  }, [selectedModel, availableModels]);
  
  // 모델 새로고침 함수
  const refreshModels = useCallback(() => {
    setIsLoading(true);
    // API 재호출은 useLLMs에서 자동으로 처리됨
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  // 반환값을 메모이제이션하여 불필요한 리렌더링 방지
  return useMemo(() => ({
    availableModels,
    selectedModel,
    isLoading: isLoading || apiLoading,
    error,
    selectModel,
    refreshModels,
  }), [availableModels, selectedModel, isLoading, apiLoading, error, selectModel, refreshModels]);
};
