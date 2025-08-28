// Authentication types
export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    user: User;
    tokens: AuthTokens;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

// Sales and Product types
export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    created_at: string;
    updated_at: string;
}

export interface Sale {
    id: number;
    product: number;
    product_name: string;
    quantity: number;
    price: number;
    total: number;
    sold_at: string;
    created_at: string;
}

export interface DailyAggregate {
    date: string;
    total_revenue: number;
    total_orders: number;
    total_units: number;
    created_at: string;
    updated_at: string;
}

// Dashboard metrics types
export interface KPIs {
    total_revenue: number;
    total_orders: number;
    total_units: number;
}

export interface DailyRevenue {
    date: string;
    revenue: number;
    orders: number;
    units: number;
}

export interface TopProduct {
    name: string;
    category: string;
    total_sales: number;
    units_sold: number;
    orders_count: number;
}

export interface DateRange {
    from: string | null;
    to: string | null;
}

export interface DashboardMetrics {
    kpis: KPIs;
    daily_revenue: DailyRevenue[];
    top_products: TopProduct[];
    date_range: DateRange;
}

export interface MetricsResponse {
    success: boolean;
    data: DashboardMetrics;
}

// Upload types
export interface UploadResponse {
    success: boolean;
    message: string;
    data: {
        processed_count: number;
        skipped_count: number;
        errors: string[];
    };
}

// API Error types
export interface ApiError {
    success: false;
    message: string;
    errors?: Record<string, string[]> | string[];
}