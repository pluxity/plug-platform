import { useEffect, useState, useCallback } from 'react'
import { FacilityService, FacilityType, FeatureResponse, FacilityResponse } from '@plug/common-services'
import type { Floor } from '@/global/types'
import { convertFloors } from '@/global/utils/floorUtils'
import { useIndoorStore } from '@/app/store/indoorStore'

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
  // 중복 호출 제거: features 는 IndoorStore 에서만 관리
  const features = useIndoorStore(s => s.features)
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

  // 이전에는 여기서 getFeaturesByFacility 로 별도 호출했으나,
  // IndoorStore.loadFacilityData 가 이미 features 를 로드하므로 제거.
  // 필요 시(스토어 비어있을 때 자동 로드) 아래 로직을 활성화할 수 있음:
  // const loadFacilityIfNeeded = useCallback(() => {
  //   if (!useIndoorStore.getState().features.length) {
  //     useIndoorStore.getState().loadFacilityData(facilityId)
  //   }
  // }, [facilityId])

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

  // features 는 store 를 통해 주입되므로 추가 effect 불필요

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
