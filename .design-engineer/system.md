# Design System - FinanGest Dashboard

## Product Context
**Type:** Dashboard/Admin - Financial Analytics  
**Users:** Internal team (gestores, vendedores, financeiro)  
**Purpose:** Real-time sales analysis and business intelligence  
**Brand:** Autopeças Bezerra - Automotive parts wholesale/retail

## Design Direction

**Primary Direction:** Data & Analysis + Sophistication & Trust  
- Chart-optimized, technical but accessible
- Numbers as first-class citizens
- Professional, trustworthy presentation
- Information density with clear hierarchy

## Color Foundation

### Brand Colors (Autopeças Bezerra)
```css
--primary: 42 100% 48%;           /* #F5AD00 - Amarelo/Dourado */
--primary-foreground: 0 0% 10%;   /* #1A1A1A - Preto */
--accent: 42 100% 50%;            /* #FFAA00 - Amarelo vibrante */
```

### Neutrals
```css
--background: 0 0% 96%;           /* #F5F5F5 - Cinza claro */
--foreground: 0 0% 15%;           /* #262626 - Cinza escuro */
--border: 0 0% 88%;               /* #E0E0E0 - Borda sutil */
--muted: 0 0% 95%;                /* #F2F2F2 - Fundo muted */
--muted-foreground: 0 0% 45%;     /* #737373 - Texto secundário */
```

### Sidebar (Dark Theme)
```css
--sidebar-bg: 0 0% 12%;           /* #1F1F1F - Preto profissional */
--sidebar-foreground: 0 0% 100%;  /* #FFFFFF - Branco */
--sidebar-muted: 0 0% 60%;        /* #999999 - Cinza médio */
```

## Typography

**Font Stack:** System fonts (fast, native, invisible)
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
             'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
             'Helvetica Neue', sans-serif;
```

**Hierarchy:**
- Page Title: `text-2xl font-semibold` (24px)
- Card Title: `text-sm font-medium` (14px)
- Metric Value: `text-3xl font-bold` (30px)
- Body: `text-sm` (14px)
- Caption: `text-xs` (12px)

## Spacing System (4px Grid)

```css
--spacing-1: 4px;   /* micro spacing */
--spacing-2: 8px;   /* tight spacing */
--spacing-3: 12px;  /* standard spacing */
--spacing-4: 16px;  /* comfortable spacing */
--spacing-6: 24px;  /* generous spacing */
--spacing-8: 32px;  /* major separation */
```

## Border Radius

**System:** Soft (8px base)
```css
--radius: 8px;
--radius-md: 6px;  /* calc(var(--radius) - 2px) */
--radius-sm: 4px;  /* calc(var(--radius) - 4px) */
```

## Depth Strategy

**Approach:** Borders-only + Subtle shadows on hover

**Cards:**
```css
border: 1px solid hsl(var(--border));
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

/* Hover state */
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
border-color: hsl(var(--primary) / 0.3);
```

**Sidebar:**
```css
background: hsl(var(--sidebar-bg));
border-right: 1px solid rgba(255, 255, 255, 0.1);
```

## Component Patterns

### FilialCard (compacto, geral)
```tsx
<div className="w-full max-w-[280px] rounded-lg border border-border bg-white p-2 shadow-sm">
  <div className="flex items-center justify-between border-b border-border pb-1.5">
    <h3 className="text-xs font-semibold text-foreground">Faturamento por Filial</h3>
    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10">
      <Building2 className="h-3 w-3 text-primary" />
    </div>
  </div>
  <div className="mt-1.5 space-y-1">
    {filiais.map(filial => (
      <div className="flex items-center justify-between rounded bg-muted/50 px-2 py-1">
        <span className="text-xs font-medium text-foreground">{filial.nome}</span>
        <span className="text-xs font-bold text-foreground">{formatCurrency(filial.total)}</span>
      </div>
    ))}
  </div>
  <p className="mt-1.5 text-[9px] text-muted-foreground">Atualizado às {hora}</p>
</div>
```

**Specs:**
- Largura: `max-w-[280px]`, `w-full`
- Padding: 8px (p-2)
- Título: 12px bold
- Itens: 12px, padding interno 8px/4px
- Timestamp: 9px

### FilialPeriodCard (toggle dia/mês)
```tsx
<div className="w-full max-w-[280px] rounded-lg border border-border bg-white p-2 shadow-sm">
  <div className="flex items-start justify-between border-b border-border pb-1.5">
    <div className="flex flex-col">
      <h3 className="text-xs font-semibold">Faturamento por Filial</h3>
      <span className="text-[10px] font-medium text-muted-foreground">{periodLabel}</span>
    </div>
    <div className="flex items-center gap-1">
      <button className={periodo === 'day' ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-white text-foreground hover:bg-muted'}>Dia</button>
      <button className={periodo === 'month' ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-white text-foreground hover:bg-muted'}>Mês</button>
      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10">
        <Building2 className="h-3 w-3 text-primary" />
      </div>
    </div>
  </div>
  <div className="mt-1.5 space-y-1">
    {filiais.map(filial => (
      <div className="flex items-center justify-between rounded bg-muted/50 px-2 py-1">
        <span className="text-xs font-medium text-foreground">{filial.nome}</span>
        <span className="text-xs font-bold text-foreground">{formatCurrency(filial.total)}</span>
      </div>
    ))}
  </div>
  <p className="mt-1.5 text-[9px] text-muted-foreground">Atualizado às {hora}</p>
</div>
```

**Specs:**
- Mesmo sizing do FilialCard
- Toggle: botões 10px, borda fina, highlight em amarelo quando ativo
- Legenda período: 10px

### MetricCard
```tsx
<div className="rounded-lg border border-border bg-white p-6 
                shadow-sm transition-all hover:shadow-md 
                hover:border-primary/30">
  <div className="flex items-center justify-between">
    <h3 className="text-sm font-medium text-muted-foreground">
      {title}
    </h3>
    <div className="flex h-10 w-10 items-center justify-center 
                    rounded-lg bg-primary/10">
      <Icon className="h-5 w-5 text-primary" />
    </div>
  </div>
  <div className="mt-4">
    <p className="text-3xl font-bold text-foreground">
      {value}
    </p>
    <p className="mt-2 text-xs text-muted-foreground">
      {timestamp}
    </p>
  </div>
</div>
```

**Specs:**
- Padding: 24px (p-6)
- Border radius: 8px (rounded-lg)
- Icon container: 40x40px, bg-primary/10
- Value: 30px bold
- Hover: shadow-md + border-primary/30

### Sidebar Navigation Item
```tsx
<a className={`flex items-center gap-3 rounded-lg px-3 py-2.5 
                text-sm font-medium transition-colors ${
  active 
    ? 'bg-primary text-primary-foreground'
    : 'text-sidebar-muted hover:bg-white/5 hover:text-sidebar-foreground'
}`}>
  <Icon className="h-5 w-5" />
  {label}
</a>
```

**Specs:**
- Padding: 10px 12px (py-2.5 px-3)
- Border radius: 8px (rounded-lg)
- Icon: 20x20px
- Active: bg-primary (amarelo)
- Hover: bg-white/5

### Layout
```tsx
<div className="min-h-screen bg-background">
  <Sidebar /> {/* Fixed, w-64 (256px) */}
  <main className="ml-64">
    <header className="border-b border-border bg-white">
      {/* Page header */}
    </header>
    <div className="px-8 py-8">
      {/* Content */}
    </div>
  </main>
</div>
```

**Specs:**
- Sidebar width: 256px (w-64)
- Content padding: 32px (px-8 py-8)
- Header: border-bottom, bg-white

## Interaction States

### Hover
- Cards: `hover:shadow-md hover:border-primary/30`
- Sidebar items: `hover:bg-white/5 hover:text-sidebar-foreground`
- Transitions: `transition-all` or `transition-colors`

### Active
- Sidebar nav: `bg-primary text-primary-foreground`
- Bold yellow background with dark text

### Loading
- Skeleton: `animate-pulse rounded bg-muted`
- Preserve layout dimensions

## Grid System

**Dashboard Cards (compactos):**
```tsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
  {/* Cards compactos (~280px) */}
</div>
```

- Gap: 16px (gap-4)
- Colunas: 1 → 2 (sm) → 4 (lg)
- Largura card: `max-w-[280px]`, `w-full`

## Brand Integration

**Logo Treatment:**
```tsx
<div className="flex items-center gap-3">
  <div className="flex h-9 w-9 items-center justify-center 
                  rounded-lg bg-primary">
    <TrendingUp className="h-5 w-5 text-primary-foreground" />
  </div>
  <div className="flex flex-col">
    <span className="text-base font-bold text-sidebar-foreground">
      BEZERRA
    </span>
    <span className="text-[10px] font-medium tracking-wider 
                     text-sidebar-muted">
      AUTOPEÇAS
    </span>
  </div>
</div>
```

## Accessibility

- Color contrast: WCAG AA compliant
- Focus states: Default browser focus rings
- Semantic HTML: `<nav>`, `<header>`, `<main>`
- ARIA labels: To be added as needed

## Performance

- System fonts: Zero font loading time
- Minimal shadows: Better rendering performance
- CSS variables: Easy theming

---

**Last Updated:** 2026-02-03  
**Version:** 1.0.0
