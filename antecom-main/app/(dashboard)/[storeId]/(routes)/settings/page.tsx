import prismadb from "@/lib/prismadb"
import { SettingForm } from "./components/settingForm"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

interface SettingsPageProps {
  params: {
    storeId: string
  }
}

const SettingPage: React.FC<SettingsPageProps> = async ({ params }) => {
  const { userId } = auth()
  if (!userId) {
    redirect("/sign-in")
  }
  const store = await prismadb.store.findFirst({
    where: {
      userId,
      id: params.storeId,
    },
  })
  if (!store) {
    redirect("/")
  }
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SettingForm initialData={store} />
      </div>
    </div>
  )
}

export default SettingPage
