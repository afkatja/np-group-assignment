# NP Group Assignment - Asset Library

A Next.js 16 application for browsing, managing, and visualizing business assets (KPIs, Layouts, Storyboards).

## Table of Contents

- [Architecture](#architecture)
- [Assumptions](#assumptions)
- [Terminology](#terminology)
- [Functionality](#functionality)
- [User Stories Covered](#user-stories-covered)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)

## Architecture

### Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API (ModalProvider)
- **UI Components**: Custom compound components (Modal, Tabs, Card, Button, Input)

### State Management Pattern

The application uses a **centralized ModalProvider** (React Context) as the single source of truth for all modal-related state:

```
ModalProvider (Context)
├── Selected Asset (umbrella state)
├── Favorites (Set<string>)
├── Layout Builder State
│   ├── Selected KPIs for Layout
│   ├── Layout Name/Description
│   └── Available Visuals
├── Visual Selector State
│   ├── Current Visual Asset
│   ├── Selected Visual Type
│   ├── Annotations
│   └── Applied Visual
└── Request Access State
    ├── Request Asset
    ├── Reason
    └── Submit Status
```

### Component Architecture

**Primitive Components** (`/components`):

- `Card` - Clickable wrapper with hover effects and keyboard accessibility
- `Button` - Variants: primary, secondary, outline, ghost
- `Modal` - Compound component with sizes (default, lg, xl, full, side)
- `Tabs` - Compound component (Root, List, Trigger, Content)
- `Input` / `SearchInput` - Form inputs with recent searches
- `Icons` - 17 reusable SVG icons
- `Detail` - DetailSection, DetailItem, DetailFacts

**Feature Components** (`/app`):

- `MainAssetModal` - Asset detail view with type-specific sections
- `LayoutBuilderModal` - Side-panel for building layouts from KPIs
- `VisualSelectorModal` - Grid-based visualization picker with annotations
- `RequestAccessModal` - Permission request workflow

### Data Flow

1. User clicks asset card → `setSelectedAsset(asset)` via ModalContext
2. `MainAssetModal` opens with asset details
3. User actions (Add to Layout, Visualize, Request Access) → Context handlers
4. Child modals (LayoutBuilder, VisualSelector, RequestAccess) read/write shared state

## Assumptions

1. **Single User Session**: Current user is randomly selected from mock users on each render
2. **Mock Permissions**: Role-based access control with 4 roles (admin, analyst, manager, viewer)
3. **Client-Side Only**: No backend API - all state is in-memory
4. **Static Data**: Assets loaded from `data/assets.json` at build time
5. **Single Tab Active**: Only one asset detail modal open at a time
6. **Favorites Persist**: Favorites stored in context (lost on refresh)
7. **Layout Building**: Layouts are ephemeral: created layouts show alert only
8. **Visual Annotations**: Saved per visualization type per asset
9. **Access Requests**: mock approval with 1s simulated latency

## Terminology

| Term               | Definition                                                                                               |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| **Asset**          | Any business resource: KPI, Layout, or Storyboard                                                        |
| **KPI**            | Key Performance Indicator - a measurable metric with calculation, visualizations, and business questions |
| **Layout**         | A dashboard/report/scorecard composition using multiple KPIs                                             |
| **Storyboard**     | A presentation/slide deck combining multiple KPIs with filters                                           |
| **Visualization**  | Chart type (Line Chart, Bar Chart, Waterfall, etc.) applicable to a KPI                                  |
| **Annotation**     | User notes attached to a specific visualization of a KPI                                                 |
| **Layout Type**    | Category of layout: dashboard, report, or scorecard                                                      |
| **Affiliate**      | Geographic/organizational unit (Global, North America, Europe, APAC, LATAM)                              |
| **Featured**       | Promoted assets shown in "Featured" tab                                                                  |
| **Access Request** | Workflow for users to request permission to restricted assets                                            |

## Functionality

### Core Features

#### Asset Library Browsing

- **Tabs**: Featured, KPI, Layout, Storyboard
- **Search**: Real-time filtering by name, description, category, date
- **Recent Searches**: Clickable history (max 5)
- **Pagination**: "Show more assets" loads 4 additional items
- **Grid View**: 2-column responsive grid with asset cards

#### Asset Detail Modal

- **Header**: Name, type badge (KPI/Layout/Storyboard)
- **Metadata**: Category tags, last updated date
- **Description**: Full asset description
- **Type-Specific Sections**:
  - **KPI**: Business Questions, Metric IDs, Calculation, Available Visualizations, Affiliate Applicability
  - **Layout**: Pages count, KPIs Used, Preview, Business Questions
  - **Storyboard**: Coupled KPIs/Filters, Applicable Affiliates, Access Requirements
- **Footer Actions**: Favorite, Add to Layout (KPI only), Visualize (KPI only), Request Access (Storyboard only)

#### Layout Builder Modal

- **KPI Selection**: Click "Add to Layout" from any KPI detail
- **Visual Preview**: Shows available visualizations per KPI
- **Layout Metadata**: Name (required), Description
- **Validation**: Cannot build without name and at least 1 KPI

#### Visual Selector Modal

- **Visualization Grid**: 2-3 column grid of available chart types
- **Selection**: Radio-button style single selection
- **Annotations**: Free-text notes per visualization
- **Persistence**: Annotations saved per visual type per asset
- **Apply**: Sets `appliedVisual` in context, closes modal

#### Request Access Modal

- **Permission Check**: Shows current role vs. required roles
- **Access Status**: Already has access / Access Required
- **Reason Form**: Minimum 10 characters, textarea
- **Mock Submission**: 1s delay
- **Success State**: Confirmation screen with "Done" button

#### Favorites

- **Toggle**: Favorite button on each asset card and in detail modal
- **Persistence**: In-memory Set, survives modal open/close

### UI/UX Details

- **Responsive**: Mobile-first, breakpoints at sm (640px)
- **Animations**: Fade-in, slide-up transitions via Tailwind
- **Loading States**: Button spinners, disabled states

## User Stories Covered

| ID    | User Story                                                           | Status | Implementation                                      |
| ----- | -------------------------------------------------------------------- | ------ | --------------------------------------------------- |
| US-1  | As a user, I want to browse assets by type (KPI, Layout, Storyboard) | ✅     | Tabs with type filtering                            |
| US-2  | As a user, I want to search assets by name/description/category      | ✅     | SearchInput with real-time filtering                |
| US-3  | As a user, I want to see featured assets prominently                 | ✅     | Featured tab + featured flag                        |
| US-4  | As a user, I want to view asset details in a modal                   | ✅     | MainAssetModal with type-specific sections          |
| US-5  | As a user, I want to mark assets as favorites                        | ✅     | Favorite toggle button on cards and modal           |
| US-6  | As a user, I want to add KPIs to a layout                            | ✅     | "Add to Layout" → LayoutBuilderModal                |
| US-7  | As a user, I want to build a layout with name/description            | ✅     | LayoutBuilderModal side panel                       |
| US-8  | As a user, I want to select visualizations for a KPI                 | ✅     | VisualSelectorModal with grid                       |
| US-9  | As a user, I want to annotate visualizations                         | ✅     | Textarea per visual, saved in context               |
| US-10 | As a user, I want to request access to restricted assets             | ✅     | RequestAccessModal with role check                  |
| US-11 | As a user, I want to see my recent searches                          | ✅     | Recent searches dropdown in SearchInput             |
| US-13 | As a user, I want to see which KPIs are used in a layout             | ✅     | "KPIs used in this layout" section in LayoutDetails |

## Key Design Decisions

1. **Compound Components**: Modal, Tabs follow Radix-style compound pattern for flexibility
2. **Context for Modal State**: Avoids prop drilling, enables cross-modal communication
3. **Asset as Umbrella State**: Selected asset drives all dependent modals
4. **Primitive components**: No logic within the component, content rendered by parent
