/**
 * Gorse recommendation engine client.
 *
 * Wraps the Gorse REST API for personalized wine recommendations.
 * See: https://gorse.io/docs/master/api/
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GorseFeedback {
  FeedbackType: string;
  UserId: string;
  ItemId: string;
  Timestamp: string;
}

export interface GorseItem {
  ItemId: string;
  IsHidden: boolean;
  Categories: string[];
  Timestamp: string;
  Labels: string[];
  Comment: string;
}

export interface GorseScore {
  Id: string;
  Score: number;
}

export interface GorseNeighbor {
  Id: string;
  Score: number;
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

export class GorseClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(baseUrl?: string, apiKey?: string) {
    this.baseUrl =
      baseUrl ?? process.env.GORSE_API_URL ?? "http://localhost:8087";
    this.apiKey = apiKey ?? process.env.GORSE_API_KEY ?? "";
  }

  // -----------------------------------------------------------------------
  // Private helpers
  // -----------------------------------------------------------------------

  private headers(): Record<string, string> {
    const h: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.apiKey) {
      h["X-API-Key"] = this.apiKey;
    }
    return h;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    const response = await fetch(url, {
      method,
      headers: this.headers(),
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Gorse API error ${response.status}: ${text}`);
    }

    return response.json() as Promise<T>;
  }

  // -----------------------------------------------------------------------
  // Items
  // -----------------------------------------------------------------------

  /**
   * Insert or update a single item in Gorse.
   */
  async insertItem(item: GorseItem): Promise<void> {
    await this.request("POST", "/api/item", item);
  }

  /**
   * Insert or update multiple items in bulk.
   */
  async insertItems(items: GorseItem[]): Promise<void> {
    await this.request("POST", "/api/items", items);
  }

  /**
   * Get a single item by ID.
   */
  async getItem(itemId: string): Promise<GorseItem> {
    return this.request<GorseItem>("GET", `/api/item/${itemId}`);
  }

  /**
   * Delete an item by ID.
   */
  async deleteItem(itemId: string): Promise<void> {
    await this.request("DELETE", `/api/item/${itemId}`);
  }

  // -----------------------------------------------------------------------
  // Feedback
  // -----------------------------------------------------------------------

  /**
   * Insert a single feedback event (view, rating, purchase).
   */
  async insertFeedback(feedback: GorseFeedback): Promise<void> {
    await this.request("POST", "/api/feedback", [feedback]);
  }

  /**
   * Insert multiple feedback events in bulk.
   */
  async insertFeedbacks(feedbacks: GorseFeedback[]): Promise<void> {
    await this.request("POST", "/api/feedback", feedbacks);
  }

  // -----------------------------------------------------------------------
  // Recommendations
  // -----------------------------------------------------------------------

  /**
   * Get personalized recommendations for a user.
   *
   * @param userId  - The user ID
   * @param n       - Number of items to return (default: 12)
   * @param offset  - Offset for pagination (default: 0)
   */
  async getRecommendations(
    userId: string,
    n = 12,
    offset = 0,
  ): Promise<GorseScore[]> {
    return this.request<GorseScore[]>(
      "GET",
      `/api/recommend/${userId}?n=${n}&offset=${offset}`,
    );
  }

  /**
   * Get item-based recommendations (similar items).
   *
   * @param itemId - The source item ID
   * @param n      - Number of neighbors to return (default: 12)
   */
  async getItemNeighbors(itemId: string, n = 12): Promise<GorseNeighbor[]> {
    return this.request<GorseNeighbor[]>(
      "GET",
      `/api/item/${itemId}/neighbors?n=${n}`,
    );
  }

  // -----------------------------------------------------------------------
  // Popular & Latest
  // -----------------------------------------------------------------------

  /**
   * Get popular items globally or by category.
   *
   * @param n        - Number of items (default: 12)
   * @param category - Optional category filter (e.g. "red", "Frankrijk")
   */
  async getPopular(n = 12, category?: string): Promise<GorseScore[]> {
    const path = category
      ? `/api/popular/${encodeURIComponent(category)}?n=${n}`
      : `/api/popular?n=${n}`;

    return this.request<GorseScore[]>("GET", path);
  }

  /**
   * Get latest items globally or by category.
   *
   * @param n        - Number of items (default: 12)
   * @param category - Optional category filter
   */
  async getLatest(n = 12, category?: string): Promise<GorseScore[]> {
    const path = category
      ? `/api/latest/${encodeURIComponent(category)}?n=${n}`
      : `/api/latest?n=${n}`;

    return this.request<GorseScore[]>("GET", path);
  }

  // -----------------------------------------------------------------------
  // Health
  // -----------------------------------------------------------------------

  /**
   * Check if Gorse server is healthy.
   */
  async health(): Promise<boolean> {
    try {
      await this.request("GET", "/api/health");
      return true;
    } catch {
      return false;
    }
  }
}

// ---------------------------------------------------------------------------
// Singleton
// ---------------------------------------------------------------------------

let _gorseClient: GorseClient | null = null;

/**
 * Get or create a singleton GorseClient instance.
 */
export function getGorseClient(): GorseClient {
  if (!_gorseClient) {
    _gorseClient = new GorseClient();
  }
  return _gorseClient;
}
