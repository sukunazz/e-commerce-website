import getBillboards from "@/actions/get-billboard"
import getProducts from "@/actions/get-products"
import Billboard from "@/components/billboard"
import ProductList from "@/components/product-list"
import Container from "@/components/ui/container"

export const revalidate = 0

const HomePage = async () => {
  const data = await getBillboards(
    process.env.NEXT_PUBLIC_BILLBOARD_ID ||
      "0960a6e9-af86-4c1d-a98d-936e41c34203"
  )
  const products = await getProducts({
    isFeatured: true,
  })
  console.log("data", data)
  return (
    <Container>
      <div className='space-y-10 pb-10'>
        <Billboard data={data} />
        <div className='flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8'>
          <ProductList title='Featured Products' items={products} />
        </div>
      </div>
    </Container>
  )
}
export default HomePage
