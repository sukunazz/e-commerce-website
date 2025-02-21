"use client"
import { Billboard } from "@prisma/client";
import { Trash } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Heading  from "../../../settings/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({
    label: z.string().min(3).max(255),
    imageUrl: z.string().url().max(255)
});

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
    initialData: Billboard | null;
}
export const BillboardForm:React.FC<BillboardFormProps> = ({initialData}) =>{
    
    const title = initialData ? "Edit billboard" : "Create billboard"
    const description = initialData ? "Edit a billboard" : "Add a new billboard"
    const toastMessage = initialData ? "Billboard updated successfully" : "Billboard created successfully"
    const action = initialData ? "Save changes" : "Create billboard"
    
    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: "",
            imageUrl: ""
        },
    })
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const params = useParams()
    const router = useRouter()
    
    const onSubmit = async (data: BillboardFormValues) => {
        try {
            setLoading(true);
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data)
            }
            else {
                await axios.post(`/api/${params.storeId}/billboards`, data)

            }
            router.refresh()
            router.push(`/${params.storeId}/billboards`)
            toast.success(toastMessage);

            
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
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
            router.refresh()
            router.push(`/${params.storeId}/billboards`)
            toast.success("Billboard deleted successfully")
        }
        catch(error)
        {
            toast.error("Make sure your remove all categories using this billboard")

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
                title={title}
                description={description}
            />
            {initialData && (<Button variant="destructive" size="icon" onClick={()=> setOpen(true)} disabled={loading}>
                <Trash className="h-4 w-4" />
            </Button>)}
        </div>
        <Separator />
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 w-full"
            >
                <FormField 
                    name="imageUrl"
                    control={form.control}
                    render={({field}) =>(
                    <FormItem>
                        <FormLabel>Background Image</FormLabel>
                        <FormControl>
                           <ImageUpload 
                            value={field.value ? [field.value] : []}
                            disabled={loading}
                            onChange = {(url) => field.onChange(url)}
                            onRemove = {() => field.onChange("")}
                           />
                            
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <div className="grid grid-cols-3 gap-8">
                    <FormField 
                        name="label"
                        control={form.control}
                        render={({field}) =>(
                        <FormItem>
                            <FormLabel>Label</FormLabel>
                            <FormControl>
                                <Input disabled={loading}
                                placeholder="Billboard label" {...field}/>
                                
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                <Button disabled={loading} type="submit" className="ml-auto">
                    {action}
                </Button>
            </form>
        </Form>
        </>
    )
}