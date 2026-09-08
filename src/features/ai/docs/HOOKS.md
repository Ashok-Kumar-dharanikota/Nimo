# AI Feature Hooks

Documentation for hooks within `src/features/ai/hooks`.

---

## `useModelStore`

- **File**: [`src/features/ai/hooks/useModelStore.ts`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/ai/hooks/useModelStore.ts)
- **Role**: Coordinates on-device model selection, activation state, and MMKV synchronization.

### Signature

```ts
function useModelStore(): {
  selectedModelId: string | null;
  selectedModel: AvailableModel | null;
  isModelActivated: boolean;
  selectModel: (modelId: string) => void;
  activateModel: (modelId?: string) => void;
  clearModel: () => void;
};
```
