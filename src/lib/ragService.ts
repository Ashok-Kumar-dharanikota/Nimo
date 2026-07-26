import { OPSQLiteVectorStore } from '@react-native-rag/op-sqlite';
import { TextEmbeddingsModule, models } from 'react-native-executorch';
import { MemoryVectorStore, type Embeddings, type QueryResult, type VectorStore } from 'react-native-rag';
import { setupExecutorch } from './executorch';

/**
 * Adapter class implementing react-native-rag's `Embeddings` interface
 * powered by react-native-executorch's `TextEmbeddingsModule`.
 */
export class ExecuTorchEmbeddings implements Embeddings {
  private module: TextEmbeddingsModule | null = null;
  private modelConfig: ReturnType<typeof models.text_embedding.all_minilm_l6_v2>;

  constructor(modelConfig = models.text_embedding.all_minilm_l6_v2()) {
    this.modelConfig = modelConfig;
  }

  async load(): Promise<this> {
    if (!this.module) {
      setupExecutorch();
      console.log('[RAG] Loading ExecuTorch embeddings model (all-minilm-l6-v2)...');
      this.module = await TextEmbeddingsModule.fromModelName(this.modelConfig);
      console.log('[RAG] Embeddings model loaded successfully.');
    }
    return this;
  }

  async unload(): Promise<void> {
    if (this.module) {
      console.log('[RAG] Unloading ExecuTorch embeddings model...');
      this.module.delete();
      this.module = null;
    }
  }

  async embed(text: string): Promise<number[]> {
    if (!this.module) {
      await this.load();
    }
    const floatArray = await this.module!.forward(text);
    return Array.from(floatArray);
  }
}

class RAGService {
  private vectorStore: VectorStore | null = null;
  private isInitializing = false;

  /**
   * Lazily initializes and loads the vector store and embeddings model.
   * Tries OPSQLiteVectorStore first; falls back to MemoryVectorStore if native libsql_vector_idx is unavailable.
   */
  async getVectorStore(): Promise<VectorStore> {
    if (this.vectorStore) {
      return this.vectorStore;
    }

    if (this.isInitializing) {
      while (this.isInitializing) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      if (this.vectorStore) return this.vectorStore;
    }

    this.isInitializing = true;
    try {
      console.log('[RAG] Attempting to initialize OPSQLiteVectorStore...');
      const embeddings = new ExecuTorchEmbeddings();
      const store = new OPSQLiteVectorStore({
        name: 'nimo_moments_rag',
        embeddings,
      });
      await store.load();
      this.vectorStore = store;
      console.log('[RAG] OPSQLiteVectorStore initialized successfully.');
      return this.vectorStore;
    } catch (err: any) {
      console.warn(
        '[RAG] OPSQLiteVectorStore unavailable (native libsql rebuild required for libsql_vector_idx). Falling back to MemoryVectorStore:',
        err?.message || err
      );

      try {
        const embeddings = new ExecuTorchEmbeddings();
        const memStore = new MemoryVectorStore({ embeddings });
        await memStore.load();
        this.vectorStore = memStore;
        console.log('[RAG] MemoryVectorStore initialized successfully as fallback.');
        return this.vectorStore;
      } catch (fallbackErr) {
        console.error('[RAG] Failed to initialize MemoryVectorStore fallback:', fallbackErr);
        throw fallbackErr;
      }
    } finally {
      this.isInitializing = false;
    }
  }

  /**
   * Indexes a moment/memory into the RAG vector store.
   */
  async indexMoment(
    momentId: number,
    content: string,
    emotion?: string | null,
    title?: string | null,
    createdAt?: string
  ): Promise<string | null> {
    try {
      if (!content || !content.trim()) return null;

      const store = await this.getVectorStore();
      const docId = `moment_${momentId}`;

      console.log(`[RAG] Indexing moment #${momentId} into vector store...`);
      const id = await store.add({
        id: docId,
        document: content.trim(),
        metadata: {
          momentId,
          emotion: emotion ?? null,
          title: title ?? null,
          createdAt: createdAt ?? new Date().toISOString(),
        },
      });

      console.log(`[RAG] Moment #${momentId} indexed successfully (docId: ${id}).`);
      return id;
    } catch (err) {
      console.warn(`[RAG] Failed to index moment #${momentId}:`, err);
      return null;
    }
  }

  /**
   * Performs semantic query against indexed moments.
   */
  async queryRelevantMoments(
    queryText: string,
    nResults = 4
  ): Promise<QueryResult[]> {
    try {
      if (!queryText || !queryText.trim()) return [];

      const store = await this.getVectorStore();
      console.log(`[RAG] Querying vector store for: "${queryText}"`);

      const results = await store.query({
        queryText: queryText.trim(),
        nResults,
      });

      console.log(`[RAG] Query returned ${results.length} results.`);
      return results;
    } catch (err) {
      console.warn('[RAG] Failed to query vector store:', err);
      return [];
    }
  }
}

export const ragService = new RAGService();
