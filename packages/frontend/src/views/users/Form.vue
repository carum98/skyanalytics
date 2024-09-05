<script setup lang="ts">
import type { IUser } from '@/types'
import { $fetch } from '@/utils/fetch'
import SkSelect from '@/components/ui/SkSelect.vue'

const props = defineProps<{
    item?: IUser
}>()

const emits = defineEmits<{
    close: []
    refresh: []
}>()

async function send(event: Event) {
    const data = Array
        .from(new FormData(event.target as HTMLFormElement))
        .filter(([k, v]) => v);

    const formData = new FormData()
    data.forEach(([k, v]) => formData.append(k, v))

    if (props.item) {
        await $fetch(`/api/user-accounts/${props.item.code}`, {
            method: 'PUT',
            body: formData,
        })
    } else {
        await $fetch('/api/user-accounts', {
            method: 'POST',
            body: formData,
        })
    }

    emits('refresh')
    emits('close')
}
</script>

<template>
    <form class="sk-form" @submit.prevent="send">
        <label required>Name</label>
        <input 
            type="text" 
            class="sk-input"
            placeholder="Name"
            autofocus
            required
            minlength="3"
            maxlength="50"
            name="name"
            :value="props.item?.name"
        />

        <label>Email</label>
        <input 
            type="email" 
            class="sk-input"
            placeholder="Email"
            name="email"
			autocomplete="off"
            :value="props.item?.email"
        />

		<label>Password</label>
		<input 
			type="password" 
			class="sk-input"
			placeholder="Password"
			autocomplete="new-password"
			name="password"
		/>

		<label>Role</label>
        <SkSelect
            name="role"
            placeholder="Role"
            :value="props.item?.role"
            :options="[
				{ value: 'admin', name: 'Admin' },
				{ value: 'user', name: 'User' },
				{ value: 'guest', name: 'Guest' }
            ]"
        ></SkSelect>

        <button type="submit" class="sk-button">Save</button>
    </form>
</template>