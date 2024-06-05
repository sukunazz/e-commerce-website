"use client"

import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon} from "lucide-react"
import { PopoverTrigger } from "@/components/ui/popover"
import { useStoreModal } from "@/hooks/use-store-modal"

import { useState } from "react"
import {Store} from "@prisma/client"
import { useParams, useRouter } from "next/navigation"
import { Popover, PopoverContent } from "@radix-ui/react-popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Command,CommandSeparator, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>
interface StoreSwitcherProps extends PopoverTriggerProps {
    items: Store[]
}

export default function StoreSwitcher({
    className,
    items = []
}: StoreSwitcherProps)
{
    const storeModal = useStoreModal()
    const router = useRouter()
    const params = useParams()

    const formattedItems = items.map((item)=>({
        label: item.name,
        value: item.id,
    }))
    const currentStore = formattedItems.find(item => item.value === params.storeId)
    const [open, setOpen] = useState(false)

    const onStoreSelect = (store: {
        value: string, label: string
    }) => {
        setOpen(false)
        router.push(`/${store.value}`)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size= "sm"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Select a store"
                    className={cn("w-[200px] justify-between", className)}
                >
                    <StoreIcon className="mr-2 w-4"/>
                    {currentStore?.label}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Search store..."/>
                        <CommandEmpty>No store found</CommandEmpty>
                        <CommandGroup heading="Store">
                            {formattedItems.map((item)=>(
                                <CommandItem key={item.value}
                                    onSelect={()=> onStoreSelect(item)}
                                    className="text-sm"
                                >
                                    <StoreIcon className="mr-2 h-4 w-4"/>
                                    {item.label}
                                    <Check 
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            currentStore?.value === item.value ?
                                            "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator/>
                    <CommandList>
                        <CommandGroup>
                            <CommandItem
                                onSelect={()=>{
                                    setOpen(false)
                                    storeModal.onOpen()
                                }}
                            >
                            <PlusCircle className="mr-2 h-4 w-4"/>
                            Create Store
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>

            </PopoverContent>
        </Popover>
    )
}