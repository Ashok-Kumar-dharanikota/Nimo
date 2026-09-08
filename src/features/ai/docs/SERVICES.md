# AI Feature Services

Documentation for service layer within `src/features/ai/services`.

---

## `aiService`

- **File**: [`src/features/ai/services/aiService.ts`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/ai/services/aiService.ts)
- **Role**: Helper service to list and look up local ExecuTorch models.

### Methods

| Method | Parameters | Returns | Description |
| :--- | :--- | :--- | :--- |
| `getDefaultModel()` | - | `AvailableModel` | Returns the primary Nimo model config |
| `getModelById(id)` | `string` | `AvailableModel \| null` | Finds a model config by identifier |
| `listModels()` | - | `AvailableModel[]` | Returns all available model configs |
