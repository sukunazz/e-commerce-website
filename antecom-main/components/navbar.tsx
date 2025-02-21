import { MainNav } from "@/components/main-nav"
import StoreSwitcher from "@/components/store-switcher"
import prismadb from "@/lib/prismadb"

import { UserButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { ThemeToggle } from "./theme-toggle"

export default async function Navbar() {
  const { userId } = auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  })
  return (
    <div className='border-b'>
      <div className='flex h-16 items-center px-4'>
        <div>
          <StoreSwitcher items={stores} />
        </div>
        <div>
          <MainNav className='mx-6' />
        </div>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeToggle />
          <UserButton afterSignOutUrl='/' />
        </div>
      </div>
    </div>
  )
}
