
export type Position = 'top' | 'right' | 'bottom' | 'left' | 'bottom span-left' | 'bottom span-right'
export type PopoverMode = 'auto' | 'manual'

export function useLinkPopover({ position, popoverMode = 'auto' }: { position: Position, popoverMode?: PopoverMode }) {
    const positioned = anchorPosition({ position })
    const id = Math.random().toString(36).substr(2, 9) + '__popover'

    const anchor = {
        popovertarget: id,
        ...positioned.anchor,
    }

    const positionedElement = {
        id: id,
        popover: popoverMode,
        ...positioned.element
    }

    function show() {
        const popover = document.getElementById(id)
        popover?.showPopover()
    }

    function close() {
        const popover = document.getElementById(id)
        popover?.hidePopover()
    }

    return {
        anchor,
        positionedElement,
        close,
        show
    }
}

function anchorPosition({ position }: { position: Position }) {
    const id = `anchor-${Math.random().toString(36).substr(2, 9)}`

    const anchor = {
        style: {
            'anchor-name': `--${id}`,
        }
    }

    const element = {
        style: {
            'position-anchor': `--${id}`,
            'position-area': position,
            'position-try-options': 'flip-block flip-inline'
        }
    }

    return {
        anchor,
        element
    }
}