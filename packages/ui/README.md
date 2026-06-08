# @pequiplan/ui

**MeriHari Design System** — Biblioteca de componentes React inspirada na estética Hobonichi de papel e escrita manual.

<br>

## ✨ Destaques

- 🎨 **Design System completo** com 200+ CSS custom properties (light + dark mode)
- 📦 **14 componentes React** prontos para uso
- 🎭 **2 temas visuais**: Kawaii (colorido) e Classic (minimalista)
- 📐 **Tailwind Preset** para configuração automática
- 🌙 **Dark mode** nativo
- 🖌️ **Estética papel** com sombras quentes, fontes manuscritas e padrões de grid

<br>

## 📦 Instalação

```bash
npm install @pequiplan/ui
```

### Peer Dependencies

```bash
npm install react react-dom tailwindcss
```

<br>

## 🔧 Setup

### 1. Importar os estilos

No seu arquivo de entrada (ex: `main.tsx` ou `layout.tsx`):

```tsx
import "@pequiplan/ui/styles";
```

Ou importe módulos individuais:

```tsx
import "@pequiplan/ui/styles/tokens";     // Apenas design tokens
import "@pequiplan/ui/styles/utilities";   // Apenas utilitários CSS
import "@pequiplan/ui/styles/patterns";    // Apenas padrões de fundo
import "@pequiplan/ui/styles/themes";      // Apenas estilos temáticos
```

### 2. Configurar Tailwind CSS

```js
// tailwind.config.js
import pequiPreset from "@pequiplan/ui/tailwind";

export default {
  presets: [pequiPreset],
  content: [
    "./src/**/*.{tsx,ts,jsx,js}",
    "./node_modules/@pequiplan/ui/**/*.{js,ts,tsx}",
  ],
};
```

<br>

## 🧩 Componentes

### Button

```tsx
import { Button } from "@pequiplan/ui";

<Button variant="default">Salvar</Button>
<Button variant="destructive">Apagar</Button>
<Button variant="outline">Cancelar</Button>
<Button variant="secondary">Secundário</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button size="sm">Pequeno</Button>
<Button size="lg">Grande</Button>
<Button size="icon">🔍</Button>
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@pequiplan/ui";

<Card>
  <CardHeader>
    <CardTitle>Meu Caderno</CardTitle>
    <CardDescription>Notas do dia</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Conteúdo aqui...</p>
  </CardContent>
  <CardFooter>
    <Button>Salvar</Button>
  </CardFooter>
</Card>
```

### Divider

```tsx
import { Divider } from "@pequiplan/ui";

<Divider type="dashed" />
<Divider type="dotted" />
<Divider type="dots" />
<Divider type="hairline" />
<Divider type="hanko" />    {/* Selo japonês */}
<Divider type="spacing" />
<Divider type="dashed" size="large" />
```

### PageNavigator

```tsx
import { PageNavigator } from "@pequiplan/ui";

<PageNavigator
  currentPage={3}
  totalPages={12}
  onPageChange={(page) => console.log(page)}
/>
```

### StatsCard

```tsx
import { StatsCard } from "@pequiplan/ui";

<StatsCard title="Páginas" value={42} highlighted />
<StatsCard title="Hábitos" value="85%" subtext="esta semana" />
```

### HandDrawnTracker

```tsx
import { HandDrawnTracker } from "@pequiplan/ui";

<HandDrawnTracker
  habits={[
    { name: "Exercício", important: true, history: [true, true, false, true, true, false, true] },
    { name: "Leitura", important: false, history: [true, false, true, true, false, true, true] },
  ]}
/>
```

### FloatingBackground

```tsx
import { FloatingBackground } from "@pequiplan/ui";

<FloatingBackground theme="kawaii" />
<FloatingBackground theme="earthy" />
<FloatingBackground theme="celestial" />
<FloatingBackground theme="minimal" />
<FloatingBackground theme="springtime" />
```

### DateBadge

```tsx
import { DateBadge } from "@pequiplan/ui";

<DateBadge
  date={new Date()}
  onDateSelect={(date) => console.log(date)}
/>
```

### Input & Progress

```tsx
import { Input, Progress } from "@pequiplan/ui";

<Input placeholder="Digite algo..." />
<Progress value={65} max={100} />
```

### AppTopbar

```tsx
import { AppTopbar } from "@pequiplan/ui";

<AppTopbar
  plannerTitle="Meu Planner"
  pageTitle="Semana 42"
  activeContext="page"
  viewMode="double"
  onViewModeChange={(mode) => console.log(mode)}
/>
```

### MeriHari Buttons

```tsx
import {
  Button,
  ButtonGroup,
  IconButton,
  RadioButton,
  SelectionButton,
  ToggleButton,
  useButtonGroup,
  useToggle,
} from "@pequiplan/ui";

<Button variant="primary" size="md" loading={false}>
  Adicionar item
</Button>

<SelectionButton
  checked={done}
  label="Estudar TypeScript"
  onChange={setDone}
/>

<ButtonGroup label="Prioridade" orientation="horizontal">
  <RadioButton
    name="priority"
    value="high"
    checked={priority === "high"}
    onChange={(value) => setPriority(value as string)}
    label="Alta"
  />
  <RadioButton
    name="priority"
    value="medium"
    checked={priority === "medium"}
    onChange={(value) => setPriority(value as string)}
    label="Media"
  />
</ButtonGroup>

<ToggleButton checked={enabled} onChange={setEnabled} label="Ativo" />

<IconButton icon={<MenuIcon />} aria-label="Abrir menu" tooltip="Menu" />
```

Os botões seguem a estética MeriHari/Hobonichi: bordas pontilhadas, papel como superfície, tinta como texto, foco visível e estados `light`/`dark` via tokens CSS.

<br>

## 🎨 Classes CSS Utilitárias

Após importar os estilos, as seguintes classes ficam disponíveis:

| Classe | Descrição |
|--------|-----------|
| `.glass` | Efeito glassmorphism iOS |
| `.glass-subtle` | Glass sutil |
| `.shadow-paper-sm/md/float` | Sombras quentes de papel |
| `.btn-stamp` | Botão estilo carimbo |
| `.btn-ghost` | Botão borda tracejada |
| `.input-paper` | Input estilo papel |
| `.card-paper` | Card estilo papel |
| `.hanko-divider` | Divisor selo Hanko |
| `.hover-lift` | Elevação no hover |
| `.pressed` | Animação ao pressionar |
| `.merihari-title/heading/body/caption` | Tipografia MeriHari |
| `.sticker-zone` | Zona de stickers |
| `.pattern-grid/dot/lines/bars` | Padrões de fundo |
| `.paper-grid-hobonichi` | Grid 14px Hobonichi |

<br>

## 🌓 Dark Mode

Adicione a classe `dark` ao `<html>` ou `<body>`:

```html
<html class="dark">
```

Todos os componentes e variáveis CSS se adaptam automaticamente.

<br>

## 🎭 Temas

Adicione `theme-kawaii` ou `theme-classic` para estilos condicionais:

```html
<body class="theme-kawaii">  <!-- Colorido, washi tape -->
<body class="theme-classic"> <!-- Minimalista, hanko -->
```

<br>

## 📄 Licença

MIT © PequiPlan
