import { SketchPicker, ColorResult } from "react-color";  
import { ColorPickerProps } from "./ColorPicker.types";

function ColorPicker ({ 
  color, 
  onChange, 
  className,
  ...props
}: ColorPickerProps) {

  const handleChange = (colorResult: ColorResult) => {
    onChange(colorResult.hex)
  }

  return (
    <div className={className} {...props}>
      <SketchPicker color={color} onChange={handleChange} />
    </div>
  )
}

ColorPicker.displayName = "ColorPicker";

export { ColorPicker } 
