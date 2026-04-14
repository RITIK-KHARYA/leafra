# File Structure Flow

## Component Organization

### 📁 `components/shared/`

**Purpose:** Reusable components used across multiple features/pages

**Contents:**

- `Header.tsx` - Landing page header
- `Footer.tsx` - Site footer
- `ChatCard.tsx` - Chat card component (used in dashboard)

**Usage:**

```tsx
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import ChatCard from "@/components/shared/ChatCard";
```

---

### 📁 `components/layout/`

**Purpose:** Layout-related components (navigation, headers, sidebars)

**Contents:**

- `AppHeader.tsx` - Application header
- `Navigation.tsx` - Navigation exports
- `NavMain.tsx` - Main navigation
- `NavProjects.tsx` - Projects navigation
- `NavSecondary.tsx` - Secondary navigation
- `NavUser.tsx` - User menu

**Usage:**

```tsx
import { NavMain, NavUser } from "@/components/layout/Navigation";
import AppHeader from "@/components/layout/AppHeader";
```

---

### 📁 `components/features/`

**Purpose:** Feature-specific components grouped by domain

**Structure:**

```
features/
├── chat/
│   ├── MessageList.tsx
│   ├── NewChatBtn.tsx
│   └── ChatInput.tsx
├── pdf/
│   ├── PdfViewer.tsx
│   └── PdfUpload.tsx
└── auth/
    ├── SignIn.tsx
    └── SignUp.tsx
```

**Usage:**

```tsx
import MessageList from "@/components/features/chat/MessageList";
import PdfUpload from "@/components/features/pdf/PdfUpload";
```

---

### 📁 `components/marketing/`

**Purpose:** Landing page and marketing components

**Contents:**

- `Hero.tsx` - Hero section
- `LandingGrid.tsx` - Features grid
- `Spiral.tsx` - 3D animations

**Usage:**

```tsx
import Hero from "@/components/marketing/Hero";
import LandingGrid from "@/components/marketing/LandingGrid";
```

---

### 📁 `components/ui/`

**Purpose:** Base UI primitives (shadcn/ui components)

**Contents:**

- All shadcn/ui components (button, card, input, etc.)
- Base design system components

**Usage:**

```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
```

---

## Import Flow

### 1. **Shared Components** (Cross-feature)

```tsx
// Used in multiple features/pages
import Header from "@/components/shared/Header";
```

### 2. **Layout Components** (Structure)

```tsx
// Used for page structure
import { NavMain } from "@/components/layout/Navigation";
```

### 3. **Feature Components** (Domain-specific)

```tsx
// Used within specific features
import MessageList from "@/components/features/chat/MessageList";
```

### 4. **Marketing Components** (Landing pages)

```tsx
// Used on marketing/landing pages
import Hero from "@/components/marketing/Hero";
```

### 5. **UI Primitives** (Base components)

```tsx
// Used everywhere as building blocks
import { Button } from "@/components/ui/button";
```

---

## Constants & Utilities

### 📁 `lib/constants.ts`

**Purpose:** Shared constants used across the application

**Contents:**

- `priorityEmojis` - Priority level emojis
- `workSections` - Work section options

**Usage:**

```tsx
import { priorityEmojis, workSections } from "@/lib/constants";
```

---

## Decision Tree

**Where should a component go?**

1. **Is it a base UI primitive?** → `components/ui/`
2. **Is it used in layout/navigation?** → `components/layout/`
3. **Is it used across multiple features?** → `components/shared/`
4. **Is it specific to one feature?** → `components/features/{feature}/`
5. **Is it for marketing/landing?** → `components/marketing/`

**Where should a constant go?**

1. **Is it shared across features?** → `lib/constants.ts`
2. **Is it feature-specific?** → `components/features/{feature}/constants.ts`

---

## Complete Structure

```
components/
├── shared/          # Cross-feature reusable components
├── layout/          # Layout & navigation components
├── features/        # Feature-specific components
│   ├── chat/
│   ├── pdf/
│   └── auth/
├── marketing/       # Landing page components
└── ui/              # Base UI primitives (shadcn)

lib/
├── constants.ts     # Shared constants
├── db/              # Database schema
├── integrations/    # External services
└── services/        # Business logic
```

---

## Benefits

✅ **Clear separation** - Easy to find components  
✅ **Reusability** - Shared components are obvious  
✅ **Scalability** - Easy to add new features  
✅ **Maintainability** - Related components grouped together  
✅ **Type safety** - Clear import paths  
✅ **Constants management** - Centralized shared values
