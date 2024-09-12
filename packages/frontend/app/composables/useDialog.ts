import { programmaticallyComponent, type ProgrammaticallyOptions } from '@/utils/programmatically-component'
import { dialogs } from '@/router'

export type DialogRecordRaw = {
    name: string
} & ProgrammaticallyOptions

export type PushOptions = Omit<DialogRecordRaw, 'component'>

export function useDialog() {
    function push(options: PushOptions) {
        const { name } = options
        const dialog = dialogs.find(dialog => dialog.name === name)

        if (!dialog) {
            throw new Error(`Dialog ${name} not found`)
        }

        const { open } = programmaticallyComponent({
            component: import('@ui/SkDialog.vue'),
            params: {
                component: dialog.component,
                props: {
                    ...dialog.props,
                    ...options.props,
                },
                listeners: {
                    ...dialog.listeners,
                    ...options.listeners,
                },
                rootProps: {
                    ...dialog.rootProps,
                    ...options.rootProps,
                }
            }
        })

        open({})
    }

    return {
        push
    }
}