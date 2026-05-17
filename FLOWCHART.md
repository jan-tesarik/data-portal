# Data Portal — Flowcharts & Architecture Diagrams

All diagrams use [Mermaid](https://mermaid.js.org/) syntax. Render in GitHub, VS Code (Mermaid extension), or [mermaid.live](https://mermaid.live).

---

## 1. Full System Architecture

```mermaid
flowchart TB
    %% ===== USER LAYER =====
    subgraph USERS["👤 USER LAYER"]
        direction LR
        CEO["CEO / Executives"]
        BIZ["Business Users"]
        DATA["Data / BI Team"]
        PROD["Product Team"]
    end

    %% ===== PORTAL =====
    subgraph PORTAL["🌐 UNIFIED DATA PORTAL — React / Next.js"]
        direction TB
        subgraph PORTAL_MODULES["Portal Modules"]
            direction LR
            MOD_DASH["Dashboard Hub"]
            MOD_EXEC["Executive Dashboards"]
            MOD_METRICS["Metrics Catalog"]
            MOD_AI["AI Assistant"]
            MOD_CREATE["Create Dashboard"]
            MOD_ALERTS["Alerts / Monitoring"]
        end
        subgraph PORTAL_SERVICES["Portal Services"]
            direction LR
            SVC_AUTH["Auth / SSO"]
            SVC_NAV["Navigation"]
            SVC_SEARCH["Search"]
            SVC_ROLES["Role-Aware Rendering"]
        end
    end

    %% ===== AUTH =====
    subgraph AUTH["🔐 AUTHENTICATION & SECURITY"]
        direction LR
        IDP["SSO / Identity Provider<br/>(Okta, Azure AD)"]
        ROLE_MAP["Role Mapping Service"]
    end

    %% ===== APPLICATION LAYER =====
    subgraph APPS["⚙️ APPLICATION LAYER"]
        direction LR
        SUPERSET["Apache Superset<br/>━━━━━━━━━━━━<br/>Standard BI dashboards<br/>Operational dashboards<br/>Embedded analytics"]
        EXEC_APP["Executive Dashboard App<br/>━━━━━━━━━━━━<br/>Pixel-perfect visuals<br/>Board-level reporting"]
        CLAUDE["Claude API<br/>━━━━━━━━━━━━<br/>Dashboard generation<br/>NL analytics<br/>SQL generation"]
    end

    %% ===== DATA LAYER =====
    subgraph SNOWFLAKE["❄️ SNOWFLAKE — Single Source of Truth"]
        direction TB
        subgraph SF_DATA["Data"]
            direction LR
            RAW["Raw Data"]
            DBT["dbt Models"]
            SEMANTIC["Semantic Layer"]
            METRICS_DEF["Metrics Definitions"]
        end
        subgraph SF_SECURITY["Security (ONLY permission authority)"]
            direction LR
            TABLE_ACCESS["Table Access"]
            SCHEMA_ACCESS["Schema Access"]
            RLS["Row-Level Security"]
            SECURE_VIEWS["Secure Views"]
        end
    end

    %% ===== GOVERNANCE =====
    subgraph GOV["📊 OBSERVABILITY & GOVERNANCE"]
        direction LR
        QUERY_LOG["Query Logging"]
        USAGE["Usage Tracking"]
        DASH_ANALYTICS["Dashboard Analytics"]
        METRIC_MON["Metric Monitoring"]
    end

    %% ===== CONNECTIONS =====
    USERS -->|HTTPS| PORTAL
    PORTAL -->|"1. Authenticate"| IDP
    IDP -->|"identity + groups"| PORTAL
    PORTAL -->|"2. Map role"| ROLE_MAP
    ROLE_MAP -->|"runtime role"| SNOWFLAKE

    MOD_DASH -->|"guest token embed"| SUPERSET
    MOD_EXEC --> EXEC_APP
    MOD_AI --> CLAUDE
    MOD_CREATE --> CLAUDE
    MOD_METRICS -->|"metadata"| SEMANTIC

    SUPERSET -->|"query with role"| SNOWFLAKE
    EXEC_APP -->|"query with role"| SNOWFLAKE
    CLAUDE -->|"semantic context"| SEMANTIC
    CLAUDE -->|"SQL via role"| SNOWFLAKE

    SNOWFLAKE --> GOV

    %% ===== STYLING =====
    classDef userStyle fill:#e8f4fd,stroke:#2196F3,stroke-width:2px,color:#1565C0
    classDef portalStyle fill:#f3e5f5,stroke:#9C27B0,stroke-width:2px,color:#6A1B9A
    classDef authStyle fill:#fff3e0,stroke:#FF9800,stroke-width:2px,color:#E65100
    classDef appStyle fill:#e8f5e9,stroke:#4CAF50,stroke-width:2px,color:#2E7D32
    classDef dataStyle fill:#e3f2fd,stroke:#1976D2,stroke-width:2px,color:#0D47A1
    classDef govStyle fill:#fafafa,stroke:#616161,stroke-width:1px,color:#424242

    class CEO,BIZ,DATA,PROD userStyle
    class MOD_DASH,MOD_EXEC,MOD_METRICS,MOD_AI,MOD_CREATE,MOD_ALERTS,SVC_AUTH,SVC_NAV,SVC_SEARCH,SVC_ROLES portalStyle
    class IDP,ROLE_MAP authStyle
    class SUPERSET,EXEC_APP,CLAUDE appStyle
    class RAW,DBT,SEMANTIC,METRICS_DEF,TABLE_ACCESS,SCHEMA_ACCESS,RLS,SECURE_VIEWS dataStyle
    class QUERY_LOG,USAGE,DASH_ANALYTICS,METRIC_MON govStyle
```

---

## 2. Authentication & Permission Flow

```mermaid
flowchart LR
    subgraph USER["User"]
        U[("User")]
    end

    subgraph SSO["Identity Provider"]
        IDP["SSO<br/>(Okta / Azure AD)"]
    end

    subgraph PORTAL["Data Portal"]
        AUTH["Auth Service"]
        ROLEMAP["Role Mapper"]
    end

    subgraph SF["Snowflake"]
        ROLE["Runtime Role"]
        ENFORCE["Permission<br/>Enforcement"]
    end

    U -->|"1. Login"| IDP
    IDP -->|"2. Token + groups"| AUTH
    AUTH -->|"3. Map to role"| ROLEMAP
    ROLEMAP -->|"4. SET ROLE"| ROLE
    ROLE --> ENFORCE

    ENFORCE -->|"Table access"| D1[("✓")]
    ENFORCE -->|"Schema access"| D2[("✓")]
    ENFORCE -->|"Row-level security"| D3[("✓")]
    ENFORCE -->|"Secure views"| D4[("✓")]

    style SF fill:#e3f2fd,stroke:#1976D2,stroke-width:3px
    style PORTAL fill:#f3e5f5,stroke:#9C27B0,stroke-width:2px
```

### Key Principle: No Permission Duplication

```mermaid
flowchart TB
    subgraph WRONG["❌ Anti-pattern"]
        direction LR
        W1["Portal manages<br/>permissions"] ~~~ W2["Superset manages<br/>permissions"] ~~~ W3["Snowflake manages<br/>permissions"]
    end

    subgraph CORRECT["✅ Correct Architecture"]
        direction LR
        C1["Portal: identity only"] --> C2["Superset: viz only"] --> C3["Snowflake: ALL permissions"]
    end
```

---

## 3. Superset Embedding Flow

```mermaid
sequenceDiagram
    participant User
    participant Portal as Data Portal
    participant Backend as Portal Backend
    participant Superset
    participant SF as Snowflake

    User->>Portal: Navigate to dashboard
    Portal->>Backend: Request embed token (user ID, dashboard ID)
    Backend->>Backend: Determine user's Snowflake role
    Backend->>Superset: POST /api/v1/security/guest_token
    Superset-->>Backend: Guest token (JWT, scoped)
    Backend-->>Portal: Guest token
    Portal->>Portal: Render iframe with token
    Portal->>Superset: Load dashboard (embedded)
    Superset->>SF: Query with runtime role
    SF-->>Superset: Data (filtered by role/RLS)
    Superset-->>Portal: Rendered dashboard

    Note over User,SF: User NEVER logs into Superset directly
```

---

## 4. Top-Level Navigation Flow

```mermaid
flowchart TB
    Entry([User opens portal]) --> Shell[Global Layout: Sidebar + Header]
    Shell --> Home[Home Page]
    Shell --> Dash[Dashboards]
    Shell --> Exec[Executive Dashboards]
    Shell --> Metrics[Metrics Catalog]
    Shell --> AI[AI Assistant]
    Shell --> Settings[Settings]

    Home --> |Quick link| Dash
    Home --> |Quick link| Exec
    Home --> |Quick link| Metrics
    Home --> |Quick link| AI
    Home --> |Recent dashboard| DashDetail[Dashboard Detail]

    Dash --> |BI tab| DashDetail
    Dash --> |Community tab| CommDetail[Community Dashboard Detail]
    Dash --> |"+ New dashboard"| Create[Create Dashboard Wizard]
    Create --> |Save| CommDetail

    Exec --> ExecDetail[Executive Detail]
    Metrics --> MetricDetail[Metric Detail]

    MetricDetail --> |"Used in dashboard"| DashDetail
```

---

## 5. Dashboard Creation Flow (Spreadsheet Upload)

```mermaid
flowchart TD
    Start([User clicks '+ New dashboard']) --> Step1[Step 1: Choose Source]
    Step1 --> |Upload spreadsheet| Upload[Upload CSV / XLSX]
    Upload --> Step2[Step 2: Data Preview]
    Step2 --> |Table shows columns + rows| Confirm{Data correct?}
    Confirm --> |No| Replace[Replace file]
    Replace --> Upload
    Confirm --> |Yes, Continue| Step3[Step 3: Describe]
    Step3 --> Name[Enter dashboard name]
    Name --> Prompt[Describe what dashboard should show]
    Prompt --> |Optional| Chips[Add suggestion chips:<br/>trend line, compare quarters,<br/>highlight outliers, group by region]
    Chips --> Generate["Generate with Claude"]
    Generate --> |Claude API call with data + prompt| Step4[Step 4: Preview]
    Step4 --> |KPI cards + charts rendered| Decide{User decision}
    Decide --> |Accept| Share[Select teams to share with]
    Decide --> |Back| Step3
    Share --> Save["Save & share"]
    Save --> Step5[Step 5: Done]
    Step5 --> |"Back to Dashboards"| Dashboards[Dashboards page]
    Step5 --> |"Request verification"| BIQueue[BI Review Queue]
```

---

## 6. Dashboard Creation Flow (AI Assistant Path)

```mermaid
flowchart TD
    Start([User clicks '+ New dashboard']) --> Step1[Step 1: Choose Source]
    Step1 --> |"Ask the Data Assistant"| Chat[Step 2: Chat Interface]
    Chat --> Ask[User describes data need]
    Ask --> |Query| Search[Assistant searches certified warehouse tables]
    Search --> Response[Returns data slice + preview table]
    Response --> |"Continue"| Step3[Step 3: Describe]
    Step3 --> Name[Name auto-suggested from query]
    Name --> Prompt[Prompt pre-filled from conversation]
    Prompt --> Generate["Generate with Claude"]
    Generate --> Step4[Step 4: Preview]
    Step4 --> Decide{Accept?}
    Decide --> |Yes| Share[Select teams]
    Decide --> |Back| Step3
    Share --> Save["Save & share"]
    Save --> Done[Step 5: Dashboard saved]
```

---

## 7. Dashboard Lifecycle & BI Verification

```mermaid
stateDiagram-v2
    [*] --> Draft: User saves dashboard
    Draft --> Published: User shares with teams
    Published --> PendingReview: User requests verification
    PendingReview --> Verified: BI confirms data accuracy
    PendingReview --> Published: BI requests changes
    Verified --> BIImplementing: BI decides to take over
    Published --> BIImplementing: BI takes over popular dashboard

    BIImplementing --> Production: BI rebuilds in Superset
    Production --> [*]

    note right of Draft
        Gray badge
        Only visible to creator
    end note

    note right of Verified
        Green badge + checkmark
        Shows verifier name + date
    end note

    note right of BIImplementing
        Purple badge
        Shows BI owner + ETA
        Original shows "maintained by BI" banner
    end note
```

---

## 8. BI Review Queue Flow

```mermaid
flowchart TD
    Start([BI user opens Review Queue]) --> List[Dashboard queue sorted by popularity]
    List --> |Views, upvotes, team usage| Select[Select dashboard to review]
    Select --> Inspect[View: rendered dashboard + source data + creator info]
    Inspect --> Action{Action}
    Action --> |"✓ Verify"| Verify[Add Verified badge]
    Action --> |"✎ Request Changes"| Feedback[Send feedback to creator]
    Action --> |"★ Take Over"| Clone[Clone into BI workspace]
    Verify --> Notify1[Notify creator: dashboard verified]
    Feedback --> Notify2[Notify creator: changes requested]
    Clone --> Rebuild[BI rebuilds as production Superset dashboard]
    Rebuild --> Link[Link original → production version]
    Link --> Notify3[Notify creator: dashboard adopted by BI team]
    Notify1 --> End([Done])
    Notify2 --> End
    Notify3 --> End
```

---

## 9. Metrics Catalog Flow

```mermaid
flowchart TD
    subgraph Source["Data Source"]
        DBT[dbt Semantic Layer]
        SF[Snowflake Metadata]
    end

    subgraph Extraction["Metadata Pipeline"]
        EXTRACT[Scheduled extraction job]
    end

    subgraph Portal["Metrics Catalog UI"]
        SEARCH[Search bar]
        FILTER[Domain filters]
        LIST[Metric cards]
        DETAIL[Metric Detail Page]
    end

    DBT --> EXTRACT
    SF --> EXTRACT
    EXTRACT --> LIST

    SEARCH --> LIST
    FILTER --> LIST
    LIST --> |Click metric| DETAIL

    DETAIL --> DESC[Description + Business definition]
    DETAIL --> DIMS[Dimensions]
    DETAIL --> USAGE[Example usage]
    DETAIL --> CERT[Certification status]
    DETAIL --> LINEAGE[Upstream lineage]
    DETAIL --> DASHBOARDS["Used in Dashboards"]
    DASHBOARDS --> |Click| DASH_DETAIL[Open dashboard]
```

---

## 10. AI Assistant Flow

```mermaid
flowchart TD
    Start([User opens AI Assistant]) --> Choose{How to start?}
    Choose --> |Type question| Input[Enter question]
    Choose --> |Suggested question| Input

    Input --> Context[Retrieve semantic layer context:<br/>available metrics, dimensions, definitions]
    Context --> Claude[Claude API]
    Claude --> SQL[Generate SQL]
    SQL --> Execute[Execute against Snowflake<br/>with user's runtime role]
    Execute --> Results[Query results]
    Results --> Answer[Claude generates:<br/>• Natural language answer<br/>• Optional visualization]
    Answer --> Display[Display in chat]
    Display --> Next{User action}
    Next --> |Follow-up question| Input
    Next --> |"Save as Dashboard"| CreateFlow[→ Dashboard Creation Flow]
    Next --> |Done| End([Leave chat])

    style Context fill:#fff3e0,stroke:#FF9800
    style Execute fill:#e3f2fd,stroke:#1976D2
```

---

## 11. Runtime Role Propagation (Concurrent Users)

```mermaid
flowchart LR
    subgraph Users["Concurrent Users"]
        U1["CEO<br/>role: EXEC_READ"]
        U2["Analyst<br/>role: ANALYTICS_FULL"]
        U3["Marketing<br/>role: MARKETING_READ"]
    end

    subgraph Portal["Portal"]
        RM["Role Mapper"]
    end

    subgraph Snowflake["Snowflake"]
        S1["Session 1<br/>SET ROLE EXEC_READ"]
        S2["Session 2<br/>SET ROLE ANALYTICS_FULL"]
        S3["Session 3<br/>SET ROLE MARKETING_READ"]
    end

    subgraph Results["What Each User Sees"]
        R1["All company KPIs<br/>+ salary data"]
        R2["All tables<br/>+ raw data access"]
        R3["Marketing schema only<br/>+ redacted PII"]
    end

    U1 --> RM --> S1 --> R1
    U2 --> RM --> S2 --> R2
    U3 --> RM --> S3 --> R3
```

---

## 12. Complete Site Map

```mermaid
flowchart TB
    Portal([Data Portal]) --> Home
    Portal --> Dashboards
    Portal --> Executive
    Portal --> Metrics
    Portal --> Assistant
    Portal --> Apps
    Portal --> Settings

    subgraph Home["Home Page"]
        H1[KPI Cards]
        H2[Recent Dashboards]
        H3[Favorites]
        H4[Quick Links]
    end

    subgraph Dashboards["Dashboards"]
        D_BI[BI Dashboards tab<br/>by domain]
        D_COMM[Community tab<br/>user-created]
        D_CREATE[+ New Dashboard<br/>5-step wizard]
        D_DETAIL[Dashboard Detail<br/>embedded Superset]
        D_COMM_DETAIL[Community Detail<br/>spec-rendered]
    end

    subgraph Executive["Executive Dashboards"]
        E1[Executive List]
        E2[Fullscreen Detail]
    end

    subgraph Metrics["Metrics Catalog"]
        M1[Search & Filter]
        M2[Metric Cards]
        M3[Metric Detail]
    end

    subgraph Assistant["AI Assistant"]
        A1[Chat Interface]
        A2[Suggested Questions]
        A3[Save as Dashboard]
    end

    subgraph Apps["Data Apps"]
        APP1[App Scout]
        APP2[App Reviews]
        APP3[Scraper Config]
    end

    subgraph Settings["Settings"]
        S1[Preferences]
    end

    D_CREATE --> |generates| D_COMM_DETAIL
    A3 --> |saves viz| D_COMM
    M3 --> |"used in"| D_DETAIL
```
