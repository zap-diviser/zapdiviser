import cn from "../utils/cn"
import { forwardRef } from "react"

type Props = React.HTMLAttributes<HTMLButtonElement>

const Button = forwardRef<HTMLButtonElement, Props>(({ className, children, ...props }, ref) => {
  return (
    <button
      className={cn(
        "text-white rounded-lg bg-gradient-to-r from-green-700 to-green-600 font-medium p-2",
        className
      )}
      {...props}
      ref={ref}
    >
      {children}
    </button>
  )
})

export default Button
