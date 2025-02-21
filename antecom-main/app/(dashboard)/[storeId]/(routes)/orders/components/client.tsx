"use client"

import Heading  from "../../settings/components/heading"
import { Separator } from "@/components/ui/separator"

import { useParams, useRouter } from "next/navigation"
import { OrderColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"

interface OrderClientProps{
    data: OrderColumn[]
}

export const OrderClient:React.FC<OrderClientProps> = ({
    data
}) =>{
    const router = useRouter()
    const params = useParams()
    return(
        <>
                <Heading 
                    title={`Orders (${data.length})`}
                    description="Manage Orders for your store"
                />
            <Separator />
            <DataTable 
                columns={columns}
                data={data}
                searchKey="products"
            />
        </>
    )
}