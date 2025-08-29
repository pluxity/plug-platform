import { useEffect, useState, useCallback } from 'react'
import { FacilityService, getFeaturesByFacility, FacilityType, FeatureResponse, FacilityResponse } from '@plug/common-services'
import type { Floor } from '@/global/types'
import { convertFloors } from '@/global/utils/floorUtils'

interface UseIndoorFacilityDataParams {
  facilityId: number
  facilityType: FacilityType
  onGoOutdoor?: () => void
}

interface UseIndoorFacilityDataReturn {
  features: FeatureResponse[]
  floors: Floor[]
  has3DDrawing: boolean | null
  isLoading: boolean
  countdown: number
  modelUrl: string
  handleOutdoor: () => void
}

export function useIndoorFacilityData(
  { facilityId, facilityType, onGoOutdoor }: UseIndoorFacilityDataParams
): UseIndoorFacilityDataReturn {
  const [facilityData, setFacilityData] = useState<FacilityResponse | null>(null)
  const [features, setFeatures] = useState<FeatureResponse[]>([])
  const [floors, setFloors] = useState<Floor[]>([])
  const [has3DDrawing, setHas3DDrawing] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [countdown, setCountdown] = useState(3)

  const handleOutdoor = useCallback(() => {
    if (onGoOutdoor) {
      onGoOutdoor()
    } else {
      window.dispatchEvent(new Event('indoor:goOutdoor'))
    }
  }, [onGoOutdoor])

  const loadFeatures = useCallback(async (facilityIdParam: number) => {
    try {
      const featureList = await getFeaturesByFacility(facilityIdParam)
      setFeatures(featureList || [])
    } catch {
      setFeatures([])
    }
  }, [])

  useEffect(() => {
  let countdownTimer: number | undefined

    const load = async () => {
      try {
        setIsLoading(true)
  const response = await FacilityService.getById(facilityType, facilityId)
  setFacilityData(response.data?.facility as FacilityResponse)
  interface RawFacilityBundle { facility?: FacilityResponse & { drawing?: { url?: string } }; floors?: { name: string; floorId: string }[] }
  const bundle = response.data as unknown as RawFacilityBundle
  const drawingUrl = bundle?.facility?.drawing?.url?.trim() || ''
  const hasDrawing = drawingUrl !== ''
  setHas3DDrawing(hasDrawing)

  if (bundle?.floors) setFloors(convertFloors(bundle.floors))

        if (!hasDrawing) {
          countdownTimer = window.setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                if (countdownTimer) window.clearInterval(countdownTimer)
                handleOutdoor()
                return 0
              }
              return prev - 1
            })
          }, 1000)
        }
      } catch {
        setHas3DDrawing(false)
      } finally {
        setIsLoading(false)
      }
    }

    load()

  return () => { if (countdownTimer) window.clearInterval(countdownTimer) }
  }, [facilityType, facilityId, handleOutdoor])

  useEffect(() => {
    loadFeatures(facilityId)
  }, [facilityId, loadFeatures])

  const modelUrl = facilityData?.drawing?.url || ''

  return {
    features,
    floors,
    has3DDrawing,
    isLoading,
    countdown,
    modelUrl,
    handleOutdoor
  }
}
