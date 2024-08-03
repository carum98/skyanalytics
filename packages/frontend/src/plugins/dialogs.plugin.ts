import { useDialog } from '@/composables/useDialog'
import { type App, type DirectiveBinding } from 'vue'

type HTMLElementWithRemoveListener = HTMLElement & { $removeListener: Function }

export const dialogPlugin = {
    install(app: App) {
        // Directives
        app.directive('dialog', {
            created: (el: HTMLElementWithRemoveListener, binding: DirectiveBinding<{ name: string, props?: object, listeners?: object }>) => {
                async function send(event: MouseEvent) {
                    event.preventDefault()
                    event.stopPropagation()

                    const dialog = useDialog()

                    dialog.push({
                        name: binding.value.name,
                        props: binding.value.props,
                        listeners: binding.value.listeners
                    })
                }

                el.addEventListener('click', send)
                el.$removeListener = () => {
                    el.removeEventListener('click', send)
                }
            },
            unmounted: (el: HTMLElementWithRemoveListener) => {
                el.$removeListener()
            }
        })
    }
}
