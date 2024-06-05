import zustand, {create} from "zustand"
import {persist, createJSONStorage} from "zustand/middleware"

import { Product } from "@/types"
import toast from "react-hot-toast"

interface CartStore {
    items: Product[]
    addItem: (data: Product) => void
    removeItem: (id: string) => void
    removeAll: ()=> void
}

const useCardModal = create(
    persist<CartStore>((set, get)=> ({
        items: [],
        addItem: (data: Product) =>{
            const currentItems = get().items
            const existingItems = currentItems.find((item)=> item.id === data.id)

            if(existingItems){
                return toast("Item already added to cart")
            }
            set({
                items: [...currentItems, data]
            })
            toast.success("Item added to cart")
        } ,
        removeItem: (id: string) =>{
            set({items: [...get().items.filter((item)=> item.id !== id)]})
            toast.success("Item removed from cart")
        },
        removeAll: () =>{
            set({items: []})
            toast.success("All items removed from cart")
        }
    }), {
        name: "cart-storage",
        storage: createJSONStorage(()=> localStorage)
    })
)

export default useCardModal