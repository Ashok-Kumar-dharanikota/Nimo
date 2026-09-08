# Home Feature Interaction Flows

Detailed interaction flows for timeline navigation, quick capture, and pull-to-refresh.

---

## 1. Timeline Refresh & Query Flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant View as HomeScreenView
    participant Hook as useHomeData
    participant Service as homeService
    participant DB as SQLite DB

    User->>View: Opens Home Tab or Pulls to Refresh
    View->>Hook: refetch()
    Hook->>Service: getTodaysFlow(selectedDate)
    Hook->>Service: getWeeklyStreaks()
    Hook->>Service: getGardenSummary()
    Service->>DB: Execute indexed queries
    DB-->>Service: Return rows
    Service-->>Hook: Formatted MomentItem[] & GardenSummary
    Hook-->>View: Re-render timeline with fresh data
```

---

## 2. Quick Moment Capture Flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Card as InlineDraftCard
    participant Hook as useHomeData
    participant Svc as homeService
    participant DB as SQLite DB

    User->>Card: Enters text, picks emotion & taps "Plant Moment"
    Card->>Hook: addQuickMoment({ content, emotion })
    Hook->>Svc: addMoment(...)
    Svc->>DB: Insert into moment table
    DB-->>Svc: Success
    Hook->>Hook: Invalidate queries
    Hook-->>Card: Reset draft & play haptic feedback
```
