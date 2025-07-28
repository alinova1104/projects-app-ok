"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Plus, Save } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useActionState } from "react"
import { addEvent } from "@/app/calendar/actions" // Server Action import edildi
import { toast } from "sonner" // sonner'dan toast import edildi

export function AddEventDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [state, formAction] = useActionState(addEvent, null)

  // Form gönderildikten sonra toast göstermek ve dialogu kapatmak için
  useState(() => {
    if (state?.success) {
      toast.success(state.message)
      setIsOpen(false) // Dialogu kapat
    } else if (state?.success === false) {
      toast.error(state.message)
    }
  }, [state])

  const [date, setDate] = useState<Date | undefined>(undefined)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Etkinlik
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yeni Etkinlik Ekle</DialogTitle>
          <DialogDescription>Takviminize yeni bir etkinlik eklemek için bilgileri doldurun.</DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Başlık
              </Label>
              <Input id="title" name="title" placeholder="Toplantı Adı" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Açıklama
              </Label>
              <Textarea id="description" name="description" placeholder="Etkinlik açıklaması" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Tarih
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Tarih seçin</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
                <input type="hidden" name="date" value={date ? format(date, "yyyy-MM-dd") : ""} />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Tür
              </Label>
              <Select name="type" required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Etkinlik türü seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Toplantı">Toplantı</SelectItem>
                  <SelectItem value="Deadline">Deadline</SelectItem>
                  <SelectItem value="Etkinlik">Etkinlik</SelectItem>
                  <SelectItem value="Tatil">Tatil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Kaydet
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
