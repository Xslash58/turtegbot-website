export interface Recap {
    user_id: string;
    year: number;
    total_commands: number;
    active_days: number;
    used_channels: number;
    top_channel: string;
    top_channel_commands: number;
    top_commands: { name: string; count: number }[];
    turtles_collected: number;
    turtles_lost: number;
    duels: number;
    bets: number;
    total_7tv_actions: number;
    emote_actions: { action: string; count: number }[];
    presence_updates: number;
    cosmetic_changes: number;
    received_reminders: number;
    sent_reminders: number;
    top_reminder_sender: { userId: number; username: string; count: number } | null;
    top_reminder_target: { userId: number; username: string; count: number } | null;
    monthly_command_usage: Record<string, number>;
    generated_at: Date;
}

export interface RoomRecap {
    room_id: string;
    year: number;
    top_users: { user_id: string; username: string; uses: number }[];
    top_commands: { command: string; uses: number }[];
    commands_executed: number;
    unique_users: number;
    monthly_usage: Record<string, number>;
    reminders_total: number;
    reminders_top_receiver: { user_id: string; username: string; count: number } | null;
    reminders_top_sender: { user_id: string; username: string; count: number } | null;
    total_7tv_actions: number;
    emote_actions: number;
    presence_updates: number;
    cosmetic_changes: number;
    generated_at: Date;
}