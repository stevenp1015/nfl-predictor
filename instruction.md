You are tasked with integrating an existing React component bundle into the codebase.

The codebase should support:
- React with TypeScript
- Tailwind CSS (v3 or v4)
- Modern build tools (Vite/Next.js)

If your project doesn't support these, provide instructions on how to set them up.

IMPORTANT: The App.tsx file is a showcase/example demonstrating the component usage. You should:
1. Analyze the App component to understand how all the pieces work together
2. Review the supporting components and utilities 
3. Integrate the relevant parts into your project structure
4. Adapt the implementation to match your project's patterns and requirements

## Installation

```bash
npm install framer-motion lucide-react @radix-ui/react-slot class-variance-authority @radix-ui/react-avatar @radix-ui/react-separator @radix-ui/react-select clsx tailwind-merge
```

## Styles

### index.css

```css
/* This is Tailwind 4 CSS file */
/* Extending Tailwind configuration */
/* Use shadcn/ui format to extend the configuration */
/* Add only the styles that your component needs */

/* Base imports */
@import "tailwindcss";
@import "tw-animate-css";

/* Custom dark variant for targeting dark mode elements */
@custom-variant dark (&:is(.dark *));

/* CSS variables and theme definitions */
@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

/* Light theme variables */
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

/* Dark theme variables */
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
}

/* Tailwind base styles */
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}

```


## Component Files

### lib/utils.ts

```tsx
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

```

### components/ui/badge.tsx

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

```

### components/ui/avatar.tsx

```tsx
"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }

```

### components/ui/button.tsx

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

```

### components/ui/card.tsx

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}

```

### components/ui/separator.tsx

```tsx
"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator-root"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  )
}

export { Separator }

```

### components/ui/select.tsx

```tsx
import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}

```

### App.tsx

```tsx
'use client'

import React, { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Flame, MessageCircle, TrendingUp, Users, Clock, Target, Trophy, Calendar } from 'lucide-react';
import { cn } from "@/lib/utils";

interface Team {
  id: string;
  name: string;
  logo: string;
  record: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
}

interface GamePrediction {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  gameTime: string;
  spread: number;
  overUnder: number;
  homeWinProbability: number;
  awayWinProbability: number;
  confidence: number;
  totalBank: number;
  homeBank: number;
  awayBank: number;
  homePlayers: number;
  awayPlayers: number;
}

interface PredictionCardProps {
  prediction: GamePrediction;
  onBetHome?: () => void;
  onBetAway?: () => void;
  className?: string;
}

const defaultTeams: Team[] = [
  {
    id: "chiefs",
    name: "Kansas City Chiefs",
    logo: "https://static.www.nfl.com/image/private/t_headshot_desktop/league/u9fltoslqdsyao8cpm85",
    record: "11-1",
    color: "#E31837",
    gradientFrom: "#E31837",
    gradientTo: "#FFB81C"
  },
  {
    id: "bills",
    name: "Buffalo Bills", 
    logo: "https://static.www.nfl.com/image/private/t_headshot_desktop/league/giphcy6ie9mxmyviib85",
    record: "10-2",
    color: "#00338D",
    gradientFrom: "#00338D",
    gradientTo: "#C60C30"
  },
  {
    id: "ravens",
    name: "Baltimore Ravens",
    logo: "https://static.www.nfl.com/image/private/t_headshot_desktop/league/uchjqgrljgoalkfurmvn",
    record: "8-4",
    color: "#241773",
    gradientFrom: "#241773",
    gradientTo: "#000000"
  },
  {
    id: "dolphins",
    name: "Miami Dolphins",
    logo: "https://static.www.nfl.com/image/private/t_headshot_desktop/league/lits6p8ycth9o4bkdxj2",
    record: "5-7",
    color: "#008E97",
    gradientFrom: "#008E97",
    gradientTo: "#FC4C02"
  }
];

const defaultPredictions: GamePrediction[] = [
  {
    id: "game1",
    homeTeam: defaultTeams[0],
    awayTeam: defaultTeams[1],
    gameTime: "Sunday 4:25 PM EST",
    spread: -3.5,
    overUnder: 47.5,
    homeWinProbability: 65,
    awayWinProbability: 35,
    confidence: 87,
    totalBank: 245680,
    homeBank: 159692,
    awayBank: 85988,
    homePlayers: 2847,
    awayPlayers: 1523
  },
  {
    id: "game2", 
    homeTeam: defaultTeams[2],
    awayTeam: defaultTeams[3],
    gameTime: "Sunday 1:00 PM EST",
    spread: -7,
    overUnder: 44,
    homeWinProbability: 78,
    awayWinProbability: 22,
    confidence: 92,
    totalBank: 189450,
    homeBank: 147771,
    awayBank: 41679,
    homePlayers: 3156,
    awayPlayers: 892
  }
];

function PredictionCard({ prediction, onBetHome, onBetAway, className }: PredictionCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current && !shouldReduceMotion) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      setMousePosition({ x, y });
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  const homeWinPercentage = (prediction.homeBank / prediction.totalBank) * 100;

  return (
    <motion.div
      ref={cardRef}
      className={cn("relative rounded-2xl overflow-hidden bg-card border border-border", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      {/* Glowing background effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: `radial-gradient(circle at ${mousePosition.x + 200}px ${mousePosition.y + 200}px, ${prediction.homeTeam.color}15 0%, ${prediction.awayTeam.color}10 30%, transparent 70%)`,
          }}
        />
      )}

      <CardContent className="p-6 relative z-10">
        {/* Header with badges */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
              <Flame className="w-3 h-3 mr-1" />
              HOT PICK
            </Badge>
            <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
              <Trophy className="w-3 h-3 mr-1" />
              NFL
            </Badge>
          </div>
          <Badge className="bg-green-500 hover:bg-green-600 text-white">
            <Target className="w-3 h-3 mr-1" />
            {prediction.confidence}% Confidence
          </Badge>
        </div>

        {/* Teams matchup */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={prediction.awayTeam.logo} alt={prediction.awayTeam.name} />
              <AvatarFallback style={{ backgroundColor: prediction.awayTeam.color }}>
                {prediction.awayTeam.name.split(' ').map(word => word[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">{prediction.awayTeam.name}</h3>
              <p className="text-sm text-muted-foreground">{prediction.awayTeam.record}</p>
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">VS</div>
            <div className="text-xs text-muted-foreground">
              <Calendar className="w-3 h-3 inline mr-1" />
              {prediction.gameTime}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <h3 className="font-semibold text-foreground">{prediction.homeTeam.name}</h3>
              <p className="text-sm text-muted-foreground">{prediction.homeTeam.record}</p>
            </div>
            <Avatar className="w-12 h-12">
              <AvatarImage src={prediction.homeTeam.logo} alt={prediction.homeTeam.name} />
              <AvatarFallback style={{ backgroundColor: prediction.homeTeam.color }}>
                {prediction.homeTeam.name.split(' ').map(word => word[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <Separator className="mb-4" />

        {/* Betting lines */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Spread</p>
            <p className="text-lg font-bold" style={{ color: prediction.homeTeam.color }}>
              {prediction.spread > 0 ? '+' : ''}{prediction.spread}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Over/Under</p>
            <p className="text-lg font-bold text-foreground">{prediction.overUnder}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Bank</p>
            <p className="text-lg font-bold text-yellow-500">{formatCurrency(prediction.totalBank)}</p>
          </div>
        </div>

        <Separator className="mb-4" />

        {/* Win probabilities */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <div className="text-left">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {prediction.awayTeam.name} Win
              </p>
              <p className="text-xl font-bold" style={{ color: prediction.awayTeam.color }}>
                {prediction.awayWinProbability}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {prediction.homeTeam.name} Win
              </p>
              <p className="text-xl font-bold" style={{ color: prediction.homeTeam.color }}>
                {prediction.homeWinProbability}%
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{ 
                background: `linear-gradient(to right, ${prediction.awayTeam.color}, ${prediction.homeTeam.color})`,
                width: `${homeWinPercentage}%`
              }}
              initial={{ width: 0 }}
              animate={{ width: `${homeWinPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>

          {/* Player counts */}
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              <Users className="w-4 h-4 inline mr-1" />
              {prediction.awayPlayers.toLocaleString()} players
            </span>
            <span>
              <Users className="w-4 h-4 inline mr-1" />
              {prediction.homePlayers.toLocaleString()} players
            </span>
          </div>
        </div>

        {/* Betting buttons */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={onBetAway}
              className="w-full relative overflow-hidden font-semibold py-3 rounded-xl border transition-all duration-300 group"
              style={{ 
                backgroundColor: prediction.awayTeam.color,
                borderColor: `${prediction.awayTeam.color}50`
              }}
            >
              <span className="relative z-10">
                BET {prediction.awayTeam.name.split(' ').pop()?.toUpperCase()} ↗
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={onBetHome}
              className="w-full relative overflow-hidden font-semibold py-3 rounded-xl border transition-all duration-300 group"
              style={{ 
                backgroundColor: prediction.homeTeam.color,
                borderColor: `${prediction.homeTeam.color}50`
              }}
            >
              <span className="relative z-10">
                BET {prediction.homeTeam.name.split(' ').pop()?.toUpperCase()} ↘
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </motion.div>
  );
}

interface TeamSelectorProps {
  teams?: Team[];
  selectedTeam?: string;
  onTeamSelect?: (teamId: string) => void;
  className?: string;
}

function TeamSelector({ teams = defaultTeams, selectedTeam, onTeamSelect, className }: TeamSelectorProps) {
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-foreground">Select Your Team</h3>
      </div>
      
      <Select value={selectedTeam} onValueChange={onTeamSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a team to follow" />
        </SelectTrigger>
        <SelectContent>
          {teams.map((team) => (
            <SelectItem key={team.id} value={team.id}>
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: team.color }}
                />
                <span>{team.name}</span>
                <span className="text-muted-foreground">({team.record})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Card>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
  className?: string;
}

function StatsCard({ title, value, change, icon, trend, className }: StatsCardProps) {
  return (
    <motion.div
      className={cn("relative", className)}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="text-muted-foreground">{icon}</div>
            <div className={cn("text-xs font-medium", trend === 'up' ? 'text-green-500' : 'text-red-500')}>
              {change}
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
          <div className="text-sm text-muted-foreground">{title}</div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function SportsPredictionDashboard() {
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [predictions] = useState<GamePrediction[]>(defaultPredictions);

  const handleBetHome = (gameId: string) => {
    console.log(`Betting on home team for game ${gameId}`);
  };

  const handleBetAway = (gameId: string) => {
    console.log(`Betting on away team for game ${gameId}`);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">
            NFL Prediction Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            AI-powered predictions and live betting markets
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        >
          <StatsCard
            title="Total Predictions"
            value="1,247"
            change="+12%"
            icon={<Target className="w-5 h-5" />}
            trend="up"
          />
          <StatsCard
            title="Accuracy Rate"
            value="87.3%"
            change="+2.1%"
            icon={<TrendingUp className="w-5 h-5" />}
            trend="up"
          />
          <StatsCard
            title="Active Users"
            value="24.8K"
            change="+8.4%"
            icon={<Users className="w-5 h-5" />}
            trend="up"
          />
          <StatsCard
            title="Live Games"
            value="16"
            change="-2"
            icon={<Clock className="w-5 h-5" />}
            trend="down"
          />
        </motion.div>

        {/* Team Selector */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TeamSelector
            teams={defaultTeams}
            selectedTeam={selectedTeam}
            onTeamSelect={setSelectedTeam}
            className="max-w-md"
          />
        </motion.div>

        {/* Prediction Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {predictions.map((prediction, index) => (
            <motion.div
              key={prediction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              <PredictionCard
                prediction={prediction}
                onBetHome={() => handleBetHome(prediction.id)}
                onBetAway={() => handleBetAway(prediction.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

```


## Tailwind Configuration

Add the following global styles:

```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
```

Custom colors detected: muted-foreground, gradient-to-r, gradient-to-br, primary-foreground, secondary-foreground, accent-foreground, card-foreground, popover-foreground
Make sure these are defined in your Tailwind configuration.


## Integration Instructions

1. Review the App.tsx component to understand the complete implementation
2. Identify which components and utilities you need for your use case
3. Analyze the Tailwind v4 styles in index.css - integrate custom styles that differ from integrating Codebase
4. Install the required NPM dependencies listed above
5. Integrate the components into your project, adapting them to fit your architecture

Focus on:
- Understanding projects structure, adding above components into it
- Understanding the component composition
- Identifying reusable utilities and helpers
- Adapting the styling to match your design system