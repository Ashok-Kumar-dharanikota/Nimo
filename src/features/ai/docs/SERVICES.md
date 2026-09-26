# AI Feature Services

Documentation for service layer within `src/features/ai/services`.

---

## `aiService`

- **File**: [`src/features/ai/services/aiService.ts`](file:///c:/Users/ASUS/OneDrive/Documents/Ashok%20Kumar/startups/Nimo/src/features/ai/services/aiService.ts)
- **Role**: Helper service to list and look up local ExecuTorch models.

### Methods

| Method | Parameters | Returns | Description |
| :--- | :--- | :--- | :--- |
| `getDefaultModel()` | - | `AvailableModel` | Returns the primary Nimo model config (`llama3_2_1b`) |
| `getModelById(id)` | `string` | `AvailableModel \| null` | Finds a model config by identifier |
| `listModels()` | - | `AvailableModel[]` | Returns all available model configs (4-tier lineup) |

### Supported On-Device Models

1. **`llama3_2_1b` (Nimo — Universal Default Companion)**
   - Role: Everyday active writing, quick check-ins, and reflective nudges.
   - Footprint: ~750 MB download, ~1.0–1.2 GB RAM (4 GB+ devices).
2. **`lfm2_5_1_2b_instruct` (Nimo Flow — Instant RAG)**
   - Role: High-efficiency RAG alternative using hybrid recurrence for fast prefill and multi-entry synthesis.
   - Footprint: ~780 MB download, ~1.2 GB RAM (4 GB+ devices).
3. **`gemma4_e2b` (Nimo Spark — Google Reasoning)**
   - Role: Structured cognitive clarity, multilingual depth, and prompt mindfulness exercises.
   - Footprint: ~1.4 GB download, ~1.6 GB RAM (4 GB+ devices).
4. **`llama3_2_3b` (Nimo Sage — The Sage)**
   - Role: Flagship deep introspections, weekly recap syntheses, and complex multi-week pattern recognition.
   - Footprint: ~1.8 GB download, ~2.4–2.8 GB RAM (6 GB to 8 GB+ devices).
