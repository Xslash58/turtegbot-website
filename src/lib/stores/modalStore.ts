import { writable } from "svelte/store";

export const loginModalVisible = writable(false);
export const confirmationDialog = writable<{
    visible: boolean;
    text?: string;
    onConfirm?: () => void;
}>({ visible: false });