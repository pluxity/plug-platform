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

  const loadFeatures = useCallback(async (id: number) => {
    try {
      const list = await getFeaturesByFacility(id)
      setFeatures(list || [])
    } catch {
      setFeatures([])
    }
  }, [])

  useEffect(() => {
    let timer: number | undefined

    const load = async () => {
      try {
        setIsLoading(true)
        const response = await FacilityService.getById(facilityType, facilityId)
  setFacilityData(response.data?.facility as FacilityResponse)

  interface RawFacilityBundle { facility?: FacilityResponse & { drawing?: { url?: string } }; floors?: { name: string; floorId: string }[] }
  const bundle = response.data as unknown as RawFacilityBundle
  const drawingUrl = bundle?.facility?.drawing?.url?.trim() || ''
        const has = drawingUrl !== ''
        setHas3DDrawing(has)

        if (bundle?.floors) {
          setFloors(convertFloors(bundle.floors))
        }

        if (!has) {
          timer = window.setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                if (timer) {
                  window.clearInterval(timer)
                }
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

    return () => {
      if (timer) {
        window.clearInterval(timer)
      }
    }
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
