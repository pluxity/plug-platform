import { SketchPicker, ColorResult } from "react-color"

type ColorPickerProps = {
  color: string
  onChange: (color: string) => void
  className?: string
}

function ColorPicker ({ 
    color, 
    onChange, 
    className, 
}: ColorPickerProps) {

  const handleChange = (colorResult: ColorResult) => {
    onChange(colorResult.hex)
  }

  return (
    <div className={className}>
      <SketchPicker color={color} onChange={handleChange} />
    </div>
  )
}

export { ColorPicker } 
