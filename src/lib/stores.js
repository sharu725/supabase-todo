import { writable } from "svelte/store";
import supabase from "$lib/db";

export const user = writable(supabase.auth.user() || false);
