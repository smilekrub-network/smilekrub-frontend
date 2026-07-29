import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

import "./minecraft-menu.css"

function MinecraftMenu({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="minecraft-menu" className={cn("mc-menu", className)} {...props} />
}

function MinecraftMenuDouble({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="minecraft-menu-double" className={cn("double", className)} {...props} />
}

interface MinecraftButtonProps extends React.ComponentProps<"button"> {
  isLang?: boolean
}

function MinecraftButton({ className, isLang, children, ...props }: MinecraftButtonProps) {
  return (
    <button
      type="button"
      data-slot="minecraft-button"
      className={cn("mc-button full", isLang && "lang", className)}
      {...props}
    >
      <span className="title">{children}</span>
    </button>
  )
}

/**
 * Text colors follow the classic Minecraft chat palette (§ codes), defined as
 * `--color-mc-*` theme tokens in styles.css.
 */
const minecraftTagVariants = cva("mc-tag", {
  variants: {
    color: {
      default: "",
      primary: "text-primary",
      muted: "text-muted-foreground",
      green: "text-mc-green",
      "dark-green": "text-mc-dark-green",
      red: "text-mc-red",
      "dark-red": "text-mc-dark-red",
      blue: "text-mc-blue",
      "dark-blue": "text-mc-dark-blue",
      aqua: "text-mc-aqua",
      yellow: "text-mc-yellow",
      gold: "text-mc-gold",
      purple: "text-mc-purple",
      "dark-purple": "text-mc-dark-purple",
      gray: "text-mc-gray",
      "dark-gray": "text-mc-dark-gray",
      white: "text-white",
    },
  },
  defaultVariants: {
    color: "default",
  },
})

function MinecraftTag({
  className,
  color,
  children,
  ...props
}: Omit<React.ComponentProps<"span">, "color"> &
  VariantProps<typeof minecraftTagVariants>) {
  return (
    <span
      data-slot="minecraft-tag"
      data-color={color}
      className={cn(minecraftTagVariants({ color }), className)}
      {...props}
    >
      {children}
    </span>
  )
}

export {
  MinecraftMenu,
  MinecraftMenuDouble,
  MinecraftButton,
  MinecraftTag,
  minecraftTagVariants,
}
