import { programmaticallyComponent, type ProgrammaticallyOptions } from '@/utils/programmatically-component'
import { sidebars } from '@/router'

export type SidebarRecordRaw = {
    name: string
} & ProgrammaticallyOptions

export type PushOptions = Omit<SidebarRecordRaw, 'component'>

export function useSidebar() {
    function push(options: PushOptions) {
        const { name } = options
        const sidebar = sidebars.find(sidebar => sidebar.name === name)

        if (!sidebar) {
            throw new Error(`Sidebar ${name} not found`)
        }

        open({
            component: sidebar.component,
            props: {
                ...sidebar.props,
                ...options.props,
            },
            listeners: {
                ...sidebar.listeners,
                ...options.listeners,
            },
            rootProps: {
                ...sidebar.rootProps,
                ...options.rootProps,
            }
        })
    }

    function open(sidebar: ProgrammaticallyOptions) {
        const { open } = programmaticallyComponent({
            component: import('@ui/SkSidebar.vue'),
            params: sidebar
        })

        open({})
    }

    return {
        push,
        open
    }
}