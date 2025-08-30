import { writable } from 'svelte/store';
import type { User } from '$lib/API/Models/Users';

export const myUser = writable<User | null>(null);
export const profileUser = writable<User | null>(null);