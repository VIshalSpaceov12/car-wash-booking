import { HeroSection } from '@/components/landing/HeroSection'
import { RoleSelector } from '@/components/landing/RoleSelector'
import { FeatureShowcase } from '@/components/landing/FeatureShowcase'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LogIn } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top Navigation */}
      <nav className="absolute top-0 right-0 p-6 z-50">
        <Link href="/auth/signin">
          <Button 
            variant="outline" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        </Link>
      </nav>
      
      <main>
        <HeroSection />
        <RoleSelector />
        <FeatureShowcase />
      </main>
    </div>
  )
}