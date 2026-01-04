"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { redirect, useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { subjects } from "@/constants"
import { createCompanion } from "@/lib/actions/companion.actions" // ← should be a Server Action

const formSchema = z.object({
  name: z.string().min(1, "Companion name is required."),
  subject: z.string().min(1, "Subject is required."),
  topic: z.string().min(1, "Topic is required."),
  voice: z.enum(["male", "female"]),
  style: z.enum(["formal", "casual"]),
  duration: z.number().min(1, "Duration must be at least 1 minute."),
})

type FormValues = z.infer<typeof formSchema>

export default function CompanionForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      subject: "",
      topic: "",
      voice: "female",
      style: "casual",
      duration: 15,
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {

      const companion = await createCompanion(values)

      if (companion) {
        redirect(`/companion/${companion.id}`)
      } else {
        console.log("Failed to create a companions");
        redirect("/")
        
      }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Companion name</FormLabel>
            <FormControl>
              <Input placeholder="Enter companion name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Subject */}
        <FormField control={form.control} name="subject" render={({ field }) => (
          <FormItem>
            <FormLabel>Subject</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        {/* Topic */}
        <FormField control={form.control} name="topic" render={({ field }) => (
          <FormItem>
            <FormLabel>What should the companion help with?</FormLabel>
            <FormControl>
              <Textarea placeholder="Ex. Derivatives & Integrals..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Voice + Style in one row (optional improvement) */}
        <div className="grid grid-cols-2 gap-6">
          <FormField control={form.control} name="voice" render={({ field }) => (
            <FormItem>
              <FormLabel>Voice</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="style" render={({ field }) => (
            <FormItem>
              <FormLabel>Style</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        {/* Duration */}
        <FormField control={form.control} name="duration" render={({ field }) => (
          <FormItem>
            <FormLabel>Estimated session duration (minutes)</FormLabel>
            <FormControl>
              <Input type="number" min={1} {...field} onChange={(e) => field.onChange(+e.target.value)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {error && (
          <div className="text-destructive text-sm">{error}</div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Building..." : "Build Your Companion"}
        </Button>
      </form>
    </Form>
  )
}