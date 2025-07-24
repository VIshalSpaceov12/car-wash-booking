import { HeroSection } from '@/components/landing/HeroSection'
import { RoleSelector } from '@/components/landing/RoleSelector'
import { FeatureShowcase } from '@/components/landing/FeatureShowcase'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main>
        <HeroSection />
        <RoleSelector />
        <FeatureShowcase />
      </main>
    </div>
  )
}