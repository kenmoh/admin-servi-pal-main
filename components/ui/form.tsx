import * as React from "react"
import { useFormContext, Controller, FormProvider } from "react-hook-form"
import { Label } from "@/components/ui/label"

export function Form({ children, ...props }: React.ComponentProps<"form"> & { children: React.ReactNode }) {
    const methods = useFormContext() || {};
    return <form {...props}>{children}</form>
}

export function FormField({ name, control, render }: any) {
    return <Controller name={name} control={control} render={render} />
}

export function FormItem({ children, ...props }: React.ComponentProps<"div">) {
    return <div className="grid gap-3" {...props}>{children}</div>
}

export function FormLabel({ children, ...props }: React.ComponentProps<typeof Label>) {
    return <Label {...props}>{children}</Label>
}

export function FormControl({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>
}

export function FormMessage({ children }: { children?: React.ReactNode }) {
    return children ? <div className="text-red-500 text-xs mt-1">{children}</div> : null
} 