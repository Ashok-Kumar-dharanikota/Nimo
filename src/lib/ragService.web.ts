export class ExecuTorchEmbeddings {
  constructor(modelConfig?: any) {}
  async load(): Promise<this> { return this; }
  async unload(): Promise<void> {}
  async embed(text: string): Promise<number[]> { return []; }
}

class RAGService {
  async getVectorStore(): Promise<any> { return null; }
  async indexMoment(
    momentId: number,
    content: string,
    emotion?: string | null,
    title?: string | null,
    createdAt?: string
  ): Promise<string | null> {
    return null;
  }
  async queryRelevantMoments(
    queryText: string,
    nResults = 4
  ): Promise<any[]> {
    return [];
  }
}

export const ragService = new RAGService();
