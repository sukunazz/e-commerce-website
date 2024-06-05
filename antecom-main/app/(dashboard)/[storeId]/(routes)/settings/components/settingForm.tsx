"use client"
import { Store } from "@prisma/client";
import { Trash } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Heading  from "./heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { on } from "events";
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface SettingFormProps {
    initialData: Store;
}
const formSchema = z.object({
    name: z.string().min(3).max(255),
});
type SettingFormValues = z.infer<typeof formSchema>;

export const SettingForm:React.FC<SettingFormProps> = ({initialData}) =>{
    const form = useForm<SettingFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    })
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const params = useParams()
    const router = useRouter()
    const origin = useOrigin()
    
    const onSubmit = async (data: SettingFormValues) => {
        try {
            setLoading(true);
            await axios.patch(`/api/stores/${params.storeId}`, data)
            router.refresh()
            toast.success("Store updated successfully");

            
        }catch(error)
        {
            toast.error("Something went wrong")
        }finally{
            setLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/stores/${params.storeId}`)
            router.refresh()
            router.push("/")
            toast.success("Store deleted successfully")
        }
        catch(error)
        {
            toast.error("Make sure your remove all products and categories at firts")

        }finally{
            setLoading(false);
        }
    }
    return (
        <>
        <AlertModal 
            isOpen={open}
            onClose={()=> setOpen(false)}
            onConfirm = {onDelete}
            loading={loading}
        />
        <div className="flex items-center justify-between">
            <Heading
                title="Settings"
                description="Manage your store settings"
            />
            <Button variant="destructive" size="icon" onClick={()=> setOpen(true)} disabled={loading}>
                <Trash className="h-4 w-4" />
            </Button>
        </div>
        <Separator />
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 w-full"
            >
                <div className="grid grid-cols-3 gap-8">
                    <FormField 
                        name="name"
                        control={form.control}
                        render={({field}) =>(
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input disabled={loading}
                                placeholder="Store name" {...field}/>
                                
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                <Button disabled={loading} type="submit" className="ml-auto">
                    Save changes
                </Button>
            </form>
        </Form>
        <Separator />
        <ApiAlert title="NEXT_PUBLIC_API_URL" 
            description={`${origin}/api/${params.storeId}`}
            variant="public"/>
        </>
    )
}