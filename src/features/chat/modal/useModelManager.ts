import { useState, useEffect, useCallback } from 'react';
import { useLLMs } from '@/hooks/chat/useLLM';

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
    id: "GPT-5",
    name: "GPT-5",
    provider: "OpenAI",
    description: "가장 강력한 GPT-5 모델",
    isAvailable: true,
  },
  {
    id: "GPT-5-turbo",
    name: "GPT-5 Turbo",
    provider: "OpenAI", 
    description: "빠르고 효율적인 GPT-5 Turbo",
    isAvailable: true,
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    description: "빠르고 경제적인 GPT-3.5",
    isAvailable: true,
  },
];

export const useModelManager = () => {
  console.log('🚀 useModelManager 훅이 호출되었습니다!');
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>(DEFAULT_MODELS);
  const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // API에서 모델 리스트 가져오기
  console.log('🔧 useLLMs 훅을 호출합니다...');
  const { data: apiModels, isLoading: apiLoading, error } = useLLMs();
  console.log('📊 useLLMs 결과:', { apiModels, apiLoading, error });
  
  // API 모델을 UI 모델 형식으로 변환
  const convertApiModels = useCallback((apiModels: any[]): ModelInfo[] => {
    console.log('🔄 API 모델 변환 시작:', apiModels);
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
    console.log('🚫 로컬 스토리지 사용 안함 - API에서만 데이터 가져오기');
    // 로컬 스토리지에서 모델 데이터를 불러오지 않음
  }, []);
  
  // 로컬 스토리지 사용 안함 - API에서만 데이터 가져오기
  const saveModelsToStorage = useCallback((models: ModelInfo[]) => {
    console.log('🚫 로컬 스토리지 사용 안함 - 모델 데이터 저장하지 않음');
    // 로컬 스토리지에 모델 데이터를 저장하지 않음
  }, []);
  
  // 로컬 스토리지 사용 안함 - API에서만 데이터 가져오기
  const loadSelectedModelFromStorage = useCallback(() => {
    console.log('🚫 로컬 스토리지 사용 안함 - 선택된 모델 불러오지 않음');
    // 로컬 스토리지에서 선택된 모델을 불러오지 않음
  }, []);
  
  // 로컬 스토리지 사용 안함 - API에서만 데이터 가져오기
  const saveSelectedModelToStorage = useCallback((model: ModelInfo) => {
    console.log('🚫 로컬 스토리지 사용 안함 - 선택된 모델 저장하지 않음');
    // 로컬 스토리지에 선택된 모델을 저장하지 않음
  }, []);
  
  // 모델 선택 (로컬 스토리지 사용 안함)
  const selectModel = useCallback((modelId: string) => {
    const model = availableModels.find(m => m.id === modelId);
    if (model) {
      setSelectedModel(model);
      console.log('✅ 모델 선택됨:', model);
    }
  }, [availableModels]);
  
  // API에서 모델 리스트 업데이트
  useEffect(() => {
    console.log('🔍 API 모델 상태 확인:', { 
      apiModels, 
      error, 
      apiLoading,
      apiModelsType: typeof apiModels,
      apiModelsLength: apiModels?.llmList?.length || 0,
      apiModelsIsArray: Array.isArray(apiModels?.llmList)
    });
    
    if (apiModels && apiModels.llmList && Array.isArray(apiModels.llmList) && apiModels.llmList.length > 0) {
      console.log('📋 원본 API 모델 데이터:', apiModels.llmList);
      const convertedModels = convertApiModels(apiModels.llmList);
      console.log('🔄 변환된 모델 데이터:', convertedModels);
      setAvailableModels(convertedModels);
      console.log('✅ API에서 모델 리스트 업데이트됨:', convertedModels);
    } else if (error) {
      console.warn('⚠️ API 모델 로딩 실패, 기본 모델 사용:', error);
      // API 실패 시 기본 모델 사용
      setAvailableModels(DEFAULT_MODELS);
    } else if (!apiLoading && (!apiModels || !apiModels.llmList || apiModels.llmList.length === 0)) {
      console.log('📝 API 응답이 비어있거나 빈 배열, 기본 모델 사용');
      setAvailableModels(DEFAULT_MODELS);
    } else {
      console.log('🤔 다른 상황 - apiModels:', apiModels, 'apiLoading:', apiLoading, 'error:', error);
    }
  }, [apiModels, convertApiModels, saveModelsToStorage, error, apiLoading]);
  
  // 초기 로딩 시 저장된 데이터 불러오기 (로컬 스토리지 사용 안함)
  useEffect(() => {
    console.log('🔄 초기 로딩 - 로컬 스토리지 사용 안함');
    loadModelsFromStorage();
    loadSelectedModelFromStorage();
  }, [loadModelsFromStorage, loadSelectedModelFromStorage]);
  
  // 선택된 모델이 없으면 첫 번째 모델 자동 선택 (로컬 스토리지 사용 안함)
  useEffect(() => {
    if (!selectedModel && availableModels.length > 0) {
      const firstModel = availableModels[0];
      setSelectedModel(firstModel);
      console.log('🔄 첫 번째 모델 자동 선택:', firstModel);
    }
  }, [selectedModel, availableModels]);
  
  // 모델 새로고침 함수
  const refreshModels = useCallback(() => {
    setIsLoading(true);
    // API 재호출은 useLLMs에서 자동으로 처리됨
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  return {
    availableModels,
    selectedModel,
    isLoading: isLoading || apiLoading,
    error,
    selectModel,
    refreshModels,
  };
};
