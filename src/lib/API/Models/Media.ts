export interface MediaSettings {
	queue_backup_playlist_id: string | null;
	queue_requests_allowed: boolean;
	queue_requests_blacklist: string;
	queue_youtube_minviews: number;
	queue_youtube_maxduration: number;
}

export interface MediaRequest {
	id: string;
	room_id: string;
	video_id: string;
	duration: number;
	title: string;
	channel_title: string;
	thumbnail_url: string;
	user_id: string;
	requested_by: string;
	is_watched: boolean;
}