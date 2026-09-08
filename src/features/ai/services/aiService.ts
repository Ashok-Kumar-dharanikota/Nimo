import { AVAILABLE_MODELS, type AvailableModel } from '../hooks/useModelStore';

class AIService {
  /**
   * Retrieves the default recommended LLM model for the device.
   */
  public getDefaultModel(): AvailableModel {
    return AVAILABLE_MODELS[0];
  }

  /**
   * Finds a model by its identifier.
   */
  public getModelById(modelId: string): AvailableModel | null {
    return AVAILABLE_MODELS.find((m) => m.id === modelId) ?? null;
  }

  /**
   * Returns list of all available on-device models.
   */
  public listModels(): AvailableModel[] {
    return AVAILABLE_MODELS;
  }
}

export const aiService = new AIService();
