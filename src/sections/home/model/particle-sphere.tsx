import { useEffect, useState, lazy, Suspense } from 'react'
import type { Application } from '@splinetool/runtime'

// Lazy load Spline to reduce initial bundle size
const Spline = lazy(() => import('@splinetool/react-spline'))

export function ParticleSphere() {
  const [splineApp, setSplineApp] = useState<Application | null>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  // Only load Spline after initial page render
  useEffect(() => {
    const timer = setTimeout(() => setShouldLoad(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (!shouldLoad) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading 3D scene...</div>
      </div>
    )
  }

  // Function to get appropriate zoom level based on screen size
  const getZoomLevel = () => {
    const width = window.innerWidth
    if (width < 1024) { // Tablet (md to lg breakpoint)
      return 1.2
    } else { // Desktop
      return 1.6
    }
  }

  function onLoad(spline: Application) {
    console.log('Spline loaded, trying setZoom...')
    setSplineApp(spline)
    
    // Set initial zoom based on current screen size
    const zoomLevel = getZoomLevel()
    spline.setZoom(zoomLevel)
    console.log(`setZoom(${zoomLevel}) called for screen width: ${window.innerWidth}px`)
  }

  // Handle resize for zoom adjustments
  useEffect(() => {
    const handleResize = () => {
      // Adjust zoom if we have a spline app
      if (splineApp) {
        const zoomLevel = getZoomLevel()
        splineApp.setZoom(zoomLevel)
        console.log(`Zoom adjusted to ${zoomLevel} for screen width: ${window.innerWidth}px`)
      }
    }

    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [splineApp])

  return (
    <Suspense fallback={
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading 3D scene...</div>
      </div>
    }>
      <Spline 
        scene="/scene-f0f0f0.splinecode"
        onLoad={onLoad}
        style={{ width: '100%', height: '100%' }}
      />
    </Suspense>
  )
}
