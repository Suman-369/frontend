import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      console.log('PWA install prompt ready', e)
    }

    window.addEventListener('beforeinstallprompt', handler)

    window.addEventListener('appinstalled', () => {
      setInstalled(true)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      setInstalled(true)
    }
  }

  if (installed || !deferredPrompt) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-pulse">
      <Button aria-label="Install HMS App" 
        onClick={handleInstall} 
        className="shadow-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-4 rounded-full"
        size="icon"
      >
        <Download className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>
    </div>
  )
}

