import * as React from 'react'
import { SlashCommandItem } from './slash-command-extension'

interface SlashCommandListProps {
    items: SlashCommandItem[]
    command: (item: SlashCommandItem | undefined) => void
}

export const SlashCommandList: React.FC<SlashCommandListProps> = ({
    items,
    command,
}) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const [searchTerm, setSearchTerm] = React.useState('')
    const [filteredItems, setFilteredItems] = React.useState(items)
    const [isDarkMode, setIsDarkMode] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const commandListRef = React.useRef<HTMLDivElement>(null)
    const selectedItemRef = React.useRef<HTMLButtonElement>(null)

    // Detect dark mode
    React.useEffect(() => {
        const checkDarkMode = () => {
            const isDark = document.documentElement.classList.contains('dark') ||
                document.body.classList.contains('dark') ||
                window.matchMedia('(prefers-color-scheme: dark)').matches
            setIsDarkMode(isDark)
        }

        checkDarkMode()

        // Check for changes
        const observer = new MutationObserver(checkDarkMode)
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })

        // Check for media query changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleChange = () => checkDarkMode()
        mediaQuery.addEventListener('change', handleChange)

        return () => {
            observer.disconnect()
            mediaQuery.removeEventListener('change', handleChange)
        }
    }, [])

    // Filter items based on search term
    React.useEffect(() => {
        if (!searchTerm) {
            setFilteredItems(items)
        } else {
            const filtered = items.filter(item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setFilteredItems(filtered)
        }
        // Reset selected index when filtered items change
        setSelectedIndex(0)
    }, [searchTerm, items])

    // Focus search input on mount
    React.useEffect(() => {
        if (inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus()
            }, 50)
        }
    }, [])

    // Scroll selected item into view when selected index changes
    React.useEffect(() => {
        if (selectedItemRef.current && commandListRef.current) {
            const container = commandListRef.current
            const item = selectedItemRef.current

            const containerRect = container.getBoundingClientRect()
            const itemRect = item.getBoundingClientRect()

            // Check if the item is outside the visible area
            const isItemAboveContainer = itemRect.top < containerRect.top
            const isItemBelowContainer = itemRect.bottom > containerRect.bottom

            if (isItemAboveContainer) {
                // Scroll so the item is at the top
                item.scrollIntoView({ block: 'start', behavior: 'smooth' })
            } else if (isItemBelowContainer) {
                // Scroll so the item is at the bottom
                item.scrollIntoView({ block: 'end', behavior: 'smooth' })
            }
        }
    }, [selectedIndex])

    const selectItem = React.useCallback(
        (index: number) => {
            const item = filteredItems[index]
            if (item) {
                command(item)
            }
        },
        [command, filteredItems]
    )

    const handleButtonClick = React.useCallback(
        (event: React.MouseEvent, index: number) => {
            // Stop propagation to prevent editor blur and other issues
            event.preventDefault();
            event.stopPropagation();
            selectItem(index);
        },
        [selectItem]
    )

    const upHandler = React.useCallback(() => {
        setSelectedIndex((index) => (index + filteredItems.length - 1) % filteredItems.length)
    }, [filteredItems.length])

    const downHandler = React.useCallback(() => {
        setSelectedIndex((index) => (index + 1) % filteredItems.length)
    }, [filteredItems.length])

    const enterHandler = React.useCallback(() => {
        selectItem(selectedIndex)
    }, [selectItem, selectedIndex])

    const handleSearchChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }, [])

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Prevent handling if already selecting a command
            if (event.defaultPrevented) {
                return false;
            }

            // Skip handling if the focused element is the search input and 
            // the key is not one we specifically want to handle
            const isSearchInputFocused = document.activeElement === inputRef.current
            if (isSearchInputFocused &&
                !['ArrowUp', 'ArrowDown', 'Enter', 'Escape'].includes(event.key)) {
                return false
            }

            if (event.key === 'ArrowUp') {
                event.preventDefault()
                upHandler()
                return true
            }

            if (event.key === 'ArrowDown') {
                event.preventDefault()
                downHandler()
                return true
            }

            if (event.key === 'Enter') {
                event.preventDefault()
                enterHandler()
                return true
            }

            if (event.key === 'Escape') {
                event.preventDefault()
                // Call command with undefined to trigger cleanup
                command(undefined);
                return true
            }

            return false
        }

        document.addEventListener('keydown', handleKeyDown, { capture: true })
        return () => {
            document.removeEventListener('keydown', handleKeyDown, { capture: true })
        }
    }, [upHandler, downHandler, enterHandler, command])

    if (!items || items.length === 0) {
        return <div className="slash-command-list-empty">No commands available</div>
    }

    // Dark mode styles
    const darkStyles = {
        container: {
            background: isDarkMode ? '#1a202c' : 'white',
            borderColor: isDarkMode ? '#2d3748' : '#e2e8f0',
            boxShadow: isDarkMode ? '0 4px 8px rgba(0, 0, 0, 0.4)' : '0 4px 8px rgba(0, 0, 0, 0.1)',
            color: isDarkMode ? '#e2e8f0' : '#000',
        },
        header: {
            color: isDarkMode ? '#e2e8f0' : '#1a202c',
            borderBottomColor: isDarkMode ? '#2d3748' : '#e2e8f0',
        },
        search: {
            background: isDarkMode ? '#2d3748' : 'white',
            borderColor: isDarkMode ? '#4a5568' : '#e2e8f0',
            color: isDarkMode ? '#e2e8f0' : '#000',
        },
        noResults: {
            color: isDarkMode ? '#a0aec0' : '#718096',
        },
        item: {
            background: isDarkMode ? '#2d3748' : '#edf2f7',
            color: isDarkMode ? '#e2e8f0' : '#000',
        },
        itemHover: {
            background: isDarkMode ? '#4a5568' : '#f7fafc',
        },
        title: {
            color: isDarkMode ? '#e2e8f0' : '#2d3748',
        },
        description: {
            color: isDarkMode ? '#a0aec0' : '#718096',
        },
        icon: {
            color: isDarkMode ? '#a0aec0' : '#4a5568',
        },
    }

    return (
        <div
            className="slash-command-list"
            data-testid="slash-command-list"
            style={{
                background: darkStyles.container.background,
                border: `1px solid ${darkStyles.container.borderColor}`,
                borderRadius: '8px',
                boxShadow: darkStyles.container.boxShadow,
                maxHeight: '300px',
                overflowY: 'auto',
                padding: '8px',
                width: '300px',
                zIndex: 9999,
                position: 'relative',
                display: 'block',
                visibility: 'visible',
                opacity: 1,
                color: darkStyles.container.color,
                fontSize: '14px'
            }}
        >
            <div
                className="slash-command-header"
                style={{
                    fontWeight: 600,
                    color: darkStyles.header.color,
                    padding: '4px 8px',
                    marginBottom: '8px',
                    borderBottom: `1px solid ${darkStyles.header.borderBottomColor}`
                }}
            >
                Available Commands
            </div>
            <div
                className="slash-command-search"
                style={{
                    padding: '0 8px 8px 8px',
                    marginBottom: '8px',
                    borderBottom: `1px solid ${darkStyles.header.borderBottomColor}`
                }}
            >
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search commands..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{
                        width: '100%',
                        padding: '6px 8px',
                        border: `1px solid ${darkStyles.search.borderColor}`,
                        borderRadius: '4px',
                        fontSize: '14px',
                        outline: 'none',
                        background: darkStyles.search.background,
                        color: darkStyles.search.color,
                    }}
                />
            </div>
            <div
                ref={commandListRef}
                className="slash-command-items"
                style={{
                    maxHeight: '200px',
                    overflowY: 'auto',
                    padding: '0 4px'
                }}
            >
                {filteredItems.length === 0 ? (
                    <div
                        style={{
                            padding: '8px',
                            color: darkStyles.noResults.color,
                            textAlign: 'center'
                        }}
                    >
                        No matching commands
                    </div>
                ) : (
                    filteredItems.map((item, index) => {
                        const Icon = item.icon
                        const isSelected = index === selectedIndex;
                        return (
                            <button
                                key={index}
                                ref={isSelected ? selectedItemRef : null}
                                className={`slash-command-item ${isSelected ? 'is-selected' : ''}`}
                                onClick={(e) => handleButtonClick(e, index)}
                                data-testid={`slash-command-item-${index}`}
                                style={{
                                    alignItems: 'center',
                                    background: isSelected ? darkStyles.item.background : 'transparent',
                                    border: 'none',
                                    borderRadius: '4px',
                                    color: darkStyles.container.color,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    gap: '8px',
                                    padding: '8px',
                                    textAlign: 'left',
                                    width: '100%',
                                    marginBottom: '4px'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.background = darkStyles.itemHover.background;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.background = 'transparent';
                                    }
                                }}
                            >
                                {Icon && (
                                    <span style={{ color: darkStyles.icon.color, height: '20px', width: '20px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Icon className="slash-command-icon" />
                                    </span>
                                )}
                                <div className="slash-command-content" style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden' }}>
                                    <div className="slash-command-title" style={{ fontWeight: 500, color: darkStyles.title.color }}>{item.title}</div>
                                    <div className="slash-command-description" style={{ color: darkStyles.description.color, fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</div>
                                </div>
                            </button>
                        )
                    })
                )}
            </div>
        </div>
    )
} 