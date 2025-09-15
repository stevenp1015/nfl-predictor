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
  npm install framer-motion lucide-react @radix-ui/react-slot class-variance-authority @radix-ui/react-avatar @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-tabs @radix-ui/react-progress clsx tailwind-merge
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
    "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] 
  aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
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
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none 
  focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
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
          "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 
  aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] 
  disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none 
  [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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
            "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 
  data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden 
  overflow-y-auto rounded-md border shadow-md",
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
          "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none 
  data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
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

  ### components/ui/tabs.tsx

  ```tsx
  "use client"

  import * as React from "react"
  import * as TabsPrimitive from "@radix-ui/react-tabs"

  import { cn } from "@/lib/utils"

  function Tabs({
    className,
    ...props
  }: React.ComponentProps<typeof TabsPrimitive.Root>) {
    return (
      <TabsPrimitive.Root
        data-slot="tabs"
        className={cn("flex flex-col gap-2", className)}
        {...props}
      />
    )
  }

  function TabsList({
    className,
    ...props
  }: React.ComponentProps<typeof TabsPrimitive.List>) {
    return (
      <TabsPrimitive.List
        data-slot="tabs-list"
        className={cn(
          "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
          className
        )}
        {...props}
      />
    )
  }

  function TabsTrigger({
    className,
    ...props
  }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
    return (
      <TabsPrimitive.Trigger
        data-slot="tabs-trigger"
        className={cn(
          "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground 
  dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 
  disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className
        )}
        {...props}
      />
    )
  }

  function TabsContent({
    className,
    ...props
  }: React.ComponentProps<typeof TabsPrimitive.Content>) {
    return (
      <TabsPrimitive.Content
        data-slot="tabs-content"
        className={cn("flex-1 outline-none", className)}
        {...props}
      />
    )
  }

  export { Tabs, TabsList, TabsTrigger, TabsContent }

  ```

  ### components/ui/progress.tsx

  ```tsx
  import * as React from "react"
  import * as ProgressPrimitive from "@radix-ui/react-progress"

  import { cn } from "@/lib/utils"

  function Progress({
    className,
    value,
    ...props
  }: React.ComponentProps<typeof ProgressPrimitive.Root>) {
    return (
      <ProgressPrimitive.Root
        data-slot="progress"
        className={cn(
          "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className="bg-primary h-full w-full flex-1 transition-all"
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
    )
  }

  export { Progress }

  ```

  ### App.tsx

  ```tsx
  'use client'

  import React, { useState, useRef, useEffect } from "react";
  import { motion, useReducedMotion } from "framer-motion";
  import { Badge } from '@/components/ui/badge';
  import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
  import { Button } from '@/components/ui/button';
  import { Card, CardContent, CardHeader } from '@/components/ui/card';
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
  import { Separator } from '@/components/ui/separator';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
  import { Progress } from '@/components/ui/progress';
  import { TrendingUp, TrendingDown, Users, Clock, Target, BarChart3, Trophy, Zap, Calendar, MapPin } from 'lucide-react';

  interface Team {
    id: string;
    name: string;
    logo: string;
    record: string;
    color: string;
    stats: {
      offense: number;
      defense: number;
      recent: string;
    };
  }

  interface GamePrediction {
    id: string;
    homeTeam: Team;
    awayTeam: Team;
    gameTime: string;
    venue: string;
    spread: number;
    overUnder: number;
    confidence: number;
    prediction: 'home' | 'away';
    aiAnalysis: string;
  }

  interface PredictionCardProps {
    game?: GamePrediction;
    onTeamSelect?: (team: Team) => void;
    onPredictionSubmit?: (prediction: any) => void;
  }

  const defaultTeams: Team[] = [
    {
      id: 'chiefs',
      name: 'Kansas City Chiefs',
      logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/KC',
      record: '11-1',
      color: '#E31837',
      stats: { offense: 92, defense: 78, recent: 'W5' }
    },
    {
      id: 'bills',
      name: 'Buffalo Bills', 
      logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/BUF',
      record: '10-2',
      color: '#00338D',
      stats: { offense: 88, defense: 85, recent: 'W4' }
    }
  ];

  const defaultGame: GamePrediction = {
    id: 'game1',
    homeTeam: defaultTeams[0],
    awayTeam: defaultTeams[1],
    gameTime: 'Sunday 4:25 PM EST',
    venue: 'Arrowhead Stadium',
    spread: -2.5,
    overUnder: 54.5,
    confidence: 78,
    prediction: 'home',
    aiAnalysis: 'Chiefs favored at home with strong offensive metrics and recent momentum'
  };

  function GlowingCard({ children, className = "", glowColor = "#3b82f6", isActive = false }: {
    children: React.ReactNode;
    className?: string;
    glowColor?: string;
    isActive?: boolean;
  }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const shouldReduceMotion = useReducedMotion();

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (cardRef.current && !shouldReduceMotion) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        setMousePosition({ x, y });
        const rotateX = -(y / rect.height) * 3;
        const rotateY = (x / rect.width) * 3;
        setRotation({ x: rotateX, y: rotateY });
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setRotation({ x: 0, y: 0 });
    };

    return (
      <motion.div
        ref={cardRef}
        className={`relative rounded-xl overflow-hidden bg-card border border-border ${className}`}
        style={{
          boxShadow: isActive || isHovered 
            ? `0 0 30px ${glowColor}40, 0 0 60px ${glowColor}20, 0 10px 30px rgba(0,0,0,0.1)`
            : '0 4px 20px rgba(0,0,0,0.1)'
        }}
        animate={{
          y: isHovered ? -5 : 0,
          rotateX: rotation.x,
          rotateY: rotation.y,
          scale: isHovered ? 1.02 : 1
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {(isActive || isHovered) && (
          <motion.div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x + 50}% ${mousePosition.y + 50}%, ${glowColor}15 0%, transparent 70%)`
            }}
            animate={{ opacity: isHovered ? 0.8 : 0.5 }}
          />
        )}
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    );
  }

  function TeamSelector({ teams = defaultTeams, selectedTeam, onTeamSelect }: {
    teams?: Team[];
    selectedTeam?: Team;
    onTeamSelect?: (team: Team) => void;
  }) {
    return (
      <GlowingCard className="p-6" glowColor={selectedTeam?.color || "#3b82f6"} isActive={!!selectedTeam}>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Select Team</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {teams.map((team) => (
              <motion.div
                key={team.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedTeam?.id === team.id 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onTeamSelect?.(team)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={team.logo} alt={team.name} />
                    <AvatarFallback style={{ backgroundColor: team.color }}>
                      {team.name.split(' ').map(w => w[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold">{team.name}</h4>
                    <p className="text-sm text-muted-foreground">{team.record}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {team.stats.recent}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </GlowingCard>
    );
  }

  function PredictionCard({ game = defaultGame, onPredictionSubmit }: PredictionCardProps) {
    const [selectedPrediction, setSelectedPrediction] = useState<'home' | 'away' | null>(null);
    const [confidence, setConfidence] = useState(75);

    return (
      <GlowingCard 
        className="p-6" 
        glowColor={selectedPrediction === 'home' ? game.homeTeam.color : selectedPrediction === 'away' ? game.awayTeam.color : "#3b82f6"}
        isActive={!!selectedPrediction}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Game Prediction</h3>
            </div>
            <Badge className="bg-orange-500 text-white">
              <Clock className="w-3 h-3 mr-1" />
              LIVE
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {game.gameTime}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {game.venue}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedPrediction === 'away' 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedPrediction('away')}
              >
                <div className="text-center space-y-2">
                  <Avatar className="w-16 h-16 mx-auto">
                    <AvatarImage src={game.awayTeam.logo} alt={game.awayTeam.name} />
                    <AvatarFallback style={{ backgroundColor: game.awayTeam.color }}>
                      {game.awayTeam.name.split(' ').map(w => w[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-sm">{game.awayTeam.name}</h4>
                    <p className="text-xs text-muted-foreground">{game.awayTeam.record}</p>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>OFF:</span>
                      <span>{game.awayTeam.stats.offense}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>DEF:</span>
                      <span>{game.awayTeam.stats.defense}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedPrediction === 'home' 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedPrediction('home')}
              >
                <div className="text-center space-y-2">
                  <Avatar className="w-16 h-16 mx-auto">
                    <AvatarImage src={game.homeTeam.logo} alt={game.homeTeam.name} />
                    <AvatarFallback style={{ backgroundColor: game.homeTeam.color }}>
                      {game.homeTeam.name.split(' ').map(w => w[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-sm">{game.homeTeam.name}</h4>
                    <p className="text-xs text-muted-foreground">{game.homeTeam.record}</p>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>OFF:</span>
                      <span>{game.homeTeam.stats.offense}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>DEF:</span>
                      <span>{game.homeTeam.stats.defense}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Spread:</span>
                <span className="font-mono">{game.homeTeam.name} {game.spread}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Over/Under:</span>
                <span className="font-mono">{game.overUnder}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>AI Confidence:</span>
                <div className="flex items-center gap-2">
                  <Progress value={game.confidence} className="w-16 h-2" />
                  <span className="font-mono text-xs">{game.confidence}%</span>
                </div>
              </div>
            </div>

            {selectedPrediction && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3 p-4 bg-muted/50 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Your Confidence:</span>
                  <span className="text-sm font-mono">{confidence}%</span>
                </div>
                <Progress value={confidence} className="h-2" />
                <div className="flex gap-2">
                  {[50, 65, 80, 95].map((val) => (
                    <Button
                      key={val}
                      variant="outline"
                      size="sm"
                      onClick={() => setConfidence(val)}
                      className="text-xs"
                    >
                      {val}%
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}

            <Button 
              className="w-full" 
              disabled={!selectedPrediction}
              onClick={() => onPredictionSubmit?.({ 
                team: selectedPrediction, 
                confidence,
                game: game.id 
              })}
            >
              <Zap className="w-4 h-4 mr-2" />
              Submit Prediction
            </Button>
          </div>
        </div>
      </GlowingCard>
    );
  }

  function StatsCard() {
    const stats = [
      { label: 'Win Rate', value: '73%', trend: 'up', color: 'text-green-500' },
      { label: 'Total Predictions', value: '247', trend: 'up', color: 'text-blue-500' },
      { label: 'Streak', value: '8W', trend: 'up', color: 'text-purple-500' },
      { label: 'ROI', value: '+12.4%', trend: 'up', color: 'text-emerald-500' }
    ];

    return (
      <GlowingCard className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Your Stats</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-3 rounded-lg bg-muted/50"
              >
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </GlowingCard>
    );
  }

  function RecentPredictions() {
    const predictions = [
      { game: 'Chiefs vs Bills', prediction: 'Chiefs -2.5', result: 'W', confidence: 78 },
      { game: 'Cowboys vs Eagles', prediction: 'Eagles +3', result: 'W', confidence: 65 },
      { game: 'Packers vs Lions', prediction: 'Over 48.5', result: 'L', confidence: 82 },
    ];

    return (
      <GlowingCard className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Recent Predictions</h3>
          </div>
          <div className="space-y-3">
            {predictions.map((pred, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="space-y-1">
                  <div className="text-sm font-medium">{pred.game}</div>
                  <div className="text-xs text-muted-foreground">{pred.prediction}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={pred.result === 'W' ? 'default' : 'destructive'}>
                    {pred.result}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{pred.confidence}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </GlowingCard>
    );
  }

  export function SportsPredictionDashboard() {
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [activeTab, setActiveTab] = useState('predictions');

    const handlePredictionSubmit = (prediction: any) => {
      console.log('Prediction submitted:', prediction);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              NFL Prediction Dashboard
            </h1>
            <p className="text-muted-foreground">
              AI-powered sports predictions with real-time analytics
            </p>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
            </TabsList>

            <TabsContent value="predictions" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <PredictionCard onPredictionSubmit={handlePredictionSubmit} />
                </div>
                <div className="space-y-6">
                  <StatsCard />
                  <RecentPredictions />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatsCard />
                <RecentPredictions />
                <GlowingCard className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Performance Trends</h3>
                    <div className="h-32 bg-muted/50 rounded-lg flex items-center justify-center">
                      <span className="text-muted-foreground">Chart Placeholder</span>
                    </div>
                  </div>
                </GlowingCard>
              </div>
            </TabsContent>

            <TabsContent value="teams" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TeamSelector 
                  selectedTeam={selectedTeam} 
                  onTeamSelect={setSelectedTeam} 
                />
                {selectedTeam && (
                  <GlowingCard className="p-6" glowColor={selectedTeam.color} isActive>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={selectedTeam.logo} alt={selectedTeam.name} />
                          <AvatarFallback style={{ backgroundColor: selectedTeam.color }}>
                            {selectedTeam.name.split(' ').map(w => w[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-xl font-bold">{selectedTeam.name}</h3>
                          <p className="text-muted-foreground">Record: {selectedTeam.record}</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Offense Rating</span>
                            <span>{selectedTeam.stats.offense}/100</span>
                          </div>
                          <Progress value={selectedTeam.stats.offense} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Defense Rating</span>
                            <span>{selectedTeam.stats.defense}/100</span>
                          </div>
                          <Progress value={selectedTeam.stats.defense} className="h-2" />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Recent Form:</span>
                          <Badge variant="outline">{selectedTeam.stats.recent}</Badge>
                        </div>
                      </div>
                    </div>
                  </GlowingCard>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  export default function Demo() {
    return <SportsPredictionDashboard />;
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

  Custom colors detected: muted-foreground, gradient-to-br, gradient-to-r, clip-text, primary-foreground, secondary-foreground, accent-foreground, card-foreground, popover-foreground
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