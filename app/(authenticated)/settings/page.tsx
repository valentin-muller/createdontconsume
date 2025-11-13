import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import SettingsForm from '@/components/SettingsForm'

export default async function SettingsPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  })

  if (!user) {
    redirect('/login')
  }

  let settings = {
    disciplineMode: false,
    connectedX: true,
    connectedInstagram: true,
    connectedYouTube: true,
  }

  if (user.settings) {
    try {
      settings = JSON.parse(user.settings)
    } catch (e) {
      console.error('Error parsing settings:', e)
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your account and platform connections.
          </p>
        </div>
      </div>

      <div className="mt-8 max-w-3xl">
        <SettingsForm
          email={user.email}
          settings={settings}
        />
      </div>
    </div>
  )
}
