"use client"
import { Billboard, Category } from "@prisma/client";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const formSchema = z.object({
    name: z.string().min(3).max(255),
    billboardId: z.string().min(2).max(255)
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
    initialData: Category | null;
    billboards: Billboard[]
}
export const CategoryForm:React.FC<CategoryFormProps> = ({billboards, initialData}) =>{
    
    const title = initialData ? "Edit Category" : "Create Category"
    const description = initialData ? "Edit a Category" : "Add a new Category"
    const toastMessage = initialData ? "Category updated successfully" : "Category created successfully"
    const action = initialData ? "Save changes" : "Create Category"
    
    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            billboardId: ""
        },
    })
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const params = useParams()
    const router = useRouter()
    
    const onSubmit = async (data: CategoryFormValues) => {
        try {
            setLoading(true);
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data)
            }
            else {
                await axios.post(`/api/${params.storeId}/categories`, data)

            }
            router.refresh()
            router.push(`/${params.storeId}/categories`)
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
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
            router.refresh()
            router.push(`/${params.storeId}/categories`)
            toast.success("Category deleted successfully")
        }
        catch(error)
        {
            toast.error("Make sure your remove all products using this category first.")

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
                                placeholder="Category name" {...field}/>
                                
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField 
                        name="billboardId"
                        control={form.control}
                        render={({field}) =>(
                        <FormItem>
                            <FormLabel>Billboard</FormLabel>
                                <Select disabled={loading} 
                                onValueChange={field.onChange} 
                                value={field.value}
                                defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue 
                                            defaultValue={field.value}
                                            placeholder="Select a billboard"/> .
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                           {billboards.map((billboards)=> (
                                            <SelectItem
                                                key={billboards.id}
                                                value={billboards.id}
                                            >
                                                {billboards.label}
                                            </SelectItem>
                                           ))} 
                                    </SelectContent>
                                </Select>
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