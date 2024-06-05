import { Category } from "@/types"

const URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`

const getCategories = async (): Promise<Category[]> => {
  const res = await fetch(URL, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })

  console.log(res)

  return res.json()
}

export default getCategories
