export interface BadgeDefinition {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirement_type: string;
  requirement_value: number;
  points_reward: number;
  is_active: boolean;
}

export interface CustomerBadge {
  id: string;
  customer_id: string;
  badge_id: string;
  earned_at: string;
  badge?: BadgeDefinition;
}

export interface PointsEntry {
  id: string;
  customer_id: string;
  points: number;
  reason: string;
  reference_type: string | null;
  reference_id: string | null;
  created_at: string;
}

export interface LeaderboardEntry {
  customer_id: string;
  first_name: string | null;
  total_points: number;
  badge_count: number;
  review_count: number;
}

export interface SocialProofData {
  recent_viewers: number;
  recent_purchases: number;
  average_rating: number;
  total_reviews: number;
}
