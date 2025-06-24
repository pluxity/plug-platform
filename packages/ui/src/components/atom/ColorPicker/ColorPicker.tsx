import { SketchPicker, ColorResult } from "react-color"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
  className?: string
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, className }) => {

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
