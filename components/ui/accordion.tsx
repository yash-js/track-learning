"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccordionContextValue {
  value: string[]
  onValueChange: (value: string[]) => void
}

const AccordionContext = React.createContext<AccordionContextValue>({
  value: [],
  onValueChange: () => {},
})

const Accordion = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    type?: "single" | "multiple"
    defaultValue?: string[]
    value?: string[]
    onValueChange?: (value: string[]) => void
  }
>(({ className, type = "single", defaultValue, value, onValueChange, children, ...props }, ref) => {
  const [internalValue, setInternalValue] = React.useState<string[]>(defaultValue || [])
  const currentValue = value ?? internalValue
  const handleValueChange = onValueChange ?? setInternalValue

  const toggleItem = (itemValue: string) => {
    if (type === "single") {
      handleValueChange(currentValue.includes(itemValue) ? [] : [itemValue])
    } else {
      handleValueChange(
        currentValue.includes(itemValue)
          ? currentValue.filter((v) => v !== itemValue)
          : [...currentValue, itemValue]
      )
    }
  }

  return (
    <AccordionContext.Provider value={{ value: currentValue, onValueChange: toggleItem }}>
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
})
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: string
  }
>(({ className, value, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("border-b border-border/50", className)} {...props}>
      {children}
    </div>
  )
})
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    value: string
  }
>(({ className, value, children, ...props }, ref) => {
  const { value: selectedValue, onValueChange } = React.useContext(AccordionContext)
  const isOpen = selectedValue.includes(value)

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex flex-1 items-center justify-between py-4 px-1 font-semibold text-lg transition-all hover:text-primary group [&[data-state=open]>svg]:rotate-180",
        className
      )}
      onClick={() => onValueChange(value)}
      data-state={isOpen ? "open" : "closed"}
      {...props}
    >
      {children}
      <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200 text-muted-foreground group-hover:text-primary" />
    </button>
  )
})
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: string
  }
>(({ className, value, children, ...props }, ref) => {
  const { value: selectedValue } = React.useContext(AccordionContext)
  const isOpen = selectedValue.includes(value)

  if (!isOpen) {
    return (
      <div
        ref={ref}
        className={cn("overflow-hidden text-sm max-h-0", className)}
        {...props}
      />
    )
  }

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden text-sm animate-accordion-down",
        className
      )}
      {...props}
    >
      <div className="pb-4 pt-0">{children}</div>
    </div>
  )
})
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

