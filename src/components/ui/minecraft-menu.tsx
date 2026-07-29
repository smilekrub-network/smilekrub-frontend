import type * as React from "react"

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

function MinecraftTag({ className, children, ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="minecraft-tag" className={cn("mc-tag", className)} {...props}>
      {children}
    </span>
  )
}

export { MinecraftMenu, MinecraftMenuDouble, MinecraftButton, MinecraftTag }
