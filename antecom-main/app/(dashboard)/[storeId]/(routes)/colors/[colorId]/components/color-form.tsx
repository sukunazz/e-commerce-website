"use client"
import { Color } from "@prisma/client";
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

const formSchema = z.object({
    name: z.string().min(2).max(255),
    value: z.string().min(4).regex(/^#/, {
        message:`String must be a valid hex code`
    })
});

type ColorFormValues = z.infer<typeof formSchema>;

interface ColorFormProps {
    initialData: Color | null;
}
export const ColorForm:React.FC<ColorFormProps> = ({initialData}) =>{
    
    const title = initialData ? "Edit Color" : "Create Color"
    const description = initialData ? "Edit a Color" : "Add a new Color"
    const toastMessage = initialData ? "Color updated successfully" : "Color created successfully"
    const action = initialData ? "Save changes" : "Create Color"
    
    const form = useForm<ColorFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            value: ""
        },
    })
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const params = useParams()
    const router = useRouter()
    
    const onSubmit = async (data: ColorFormValues) => {
        try {
            setLoading(true);
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data)
            }
            else {
                await axios.post(`/api/${params.storeId}/colors`, data)

            }
            router.refresh()
            router.push(`/${params.storeId}/colors`)
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
            await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)
            router.refresh()
            router.push(`/${params.storeId}/colors`)
            toast.success("Color deleted successfully")
        }
        catch(error)
        {
            toast.error("Make sure your remove all Products using this Color")

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

                <div className="grid grid-cols-3 gap-8">
                    <FormField 
                        name="name"
                        control={form.control}
                        render={({field}) =>(
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input disabled={loading}
                                placeholder="Color name" {...field}/>
                                
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField 
                        name="value"
                        control={form.control}
                        render={({field}) =>(
                        <FormItem>
                            <FormLabel>Value</FormLabel>
                            <FormControl>
                                <div className="flex items-center gap-x-4">
                                    
                                <Input disabled={loading}
                                placeholder="Color value" {...field}/>
                                <div 
                                    className="border p-4 rounded-full"
                                    style={{backgroundColor: field.value}}
                                />
                                </div>
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