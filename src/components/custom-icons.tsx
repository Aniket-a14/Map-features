export const DrawIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path
            d="M3 7L9 17L15 7L21 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle cx="3" cy="7" r="1.5" fill="currentColor" />
        <circle cx="9" cy="17" r="1.5" fill="currentColor" />
        <circle cx="15" cy="7" r="1.5" fill="currentColor" />
        <circle cx="21" cy="17" r="1.5" fill="currentColor" />
    </svg>
)

export const EditIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path
            d="M4 16C8 6 16 6 20 16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle cx="4" cy="16" r="1.5" fill="currentColor" />
        <circle cx="12" cy="8" r="1.5" fill="currentColor" />
        <circle cx="20" cy="16" r="1.5" fill="currentColor" />
    </svg>
)

export const EraseIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path
            d="M7 6L17 6L20 18H4L7 6Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="3 3"
        />
        <path
            d="M16 15L20 19M20 15L16 19"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

export const SelectIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path
            d="M5 4L12 20L15 13L22 10L5 4Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

export const MarqueeIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <rect
            x="4"
            y="4"
            width="16"
            height="16"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="4 4"
        />
        <path
            d="M13 13L19 19L16 19M19 19L19 16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M13 13L19 19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

export const HomeIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path
            d="M10.42 2.62a2.5 2.5 0 0 1 3.16 0l7.2 5.6a2.5 2.5 0 0 1 .97 1.98v9.3a2.5 2.5 0 0 1-2.5 2.5h-3.5a1 1 0 0 1-1-1v-5a1 1 0 0 0-1-1h-3.5a1 1 0 0 0-1 1v5a1 1 0 0 1-1 1H4.75a2.5 2.5 0 0 1-2.5-2.5v-9.3a2.5 2.5 0 0 1 .97-1.98l7.2-5.6Z"
        />
    </svg>
)

/**
 * Code Explanation:
 * Exports a set of custom SVG icon components used throughout the application.
 * Icons include Draw, Edit, Erase, Select, Marquee, and Home.
 *
 * What is Happening:
 * - Each component returns an SVG element with specific paths and styles.
 * - Accepts a `className` prop for styling customization.
 *
 * What to do Next:
 * - Add more icons as needed.
 * - Consider using an icon library if the number of custom icons grows significantly.
 */
