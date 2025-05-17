import * as React from "react"

export const RecordIcon = React.forwardRef<
    SVGSVGElement,
    React.SVGProps<SVGSVGElement>
>((props, ref) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        ref={ref}
        {...props}
    >
        <circle cx="12" cy="12" r="6" fill="currentColor" />
    </svg>
))

RecordIcon.displayName = 'RecordIcon' 