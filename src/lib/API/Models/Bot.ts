interface Command {
    name: string;
    category: string;
    description: string[];
    aliases: string[];
    usage: string;
    usage_examples: string[];
    arguments: Record<string, string>;
    channel_cooldown: number;
    user_cooldown: number;
    required_global_power: number | null;
    required_channel_power: number | null;
}