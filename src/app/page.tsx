/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ApiClient } from '@/lib/api';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { DashboardMetrics } from '@/lib/types';
import { TrendingUp, ShoppingCart, Package, DollarSign, Upload } from 'lucide-react';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { UploadPanel } from '@/components/dashboard/UploadPanel';
import { DateFilters } from '@/components/dashboard/DateFilters';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async (dateFrom?: string, dateTo?: string) => {
    try {
      setLoading(true);
      setError('');
      const response = await ApiClient.getMetrics(dateFrom, dateTo);
      
      if (response.success) {
        setMetrics(response.data);
      } else {
        setError('Failed to load dashboard metrics');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  // Only show full loading screen on initial load
  if (loading && initialLoad) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="h-4 bg-muted animate-pulse rounded" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="space-y-4">
            <p className="text-red-600">{error}</p>
            <Button onClick={() => loadMetrics()}>Retry</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!metrics) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="space-y-4">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">No Data Available</h3>
              <p className="text-muted-foreground">Upload some sales data to get started</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Overview of your sales performance
            </p>
          </div>
          <Button onClick={() => loadMetrics()} variant="secondary" size="sm">
            Refresh Data
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(metrics.kpis.total_revenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                From {metrics.kpis.total_orders} orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(metrics.kpis.total_orders)}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatNumber(metrics.kpis.total_units)} units sold
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Units Sold</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(metrics.kpis.total_units)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all products
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart */}
        <RevenueChart data={metrics.daily_revenue} loading={loading} />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Filters and Upload */}
          <div className="space-y-6">
            <DateFilters 
              onFilterChange={loadMetrics}
              loading={loading}
            />
            <UploadPanel onUploadSuccess={() => loadMetrics()} />
          </div>

          {/* Right Column - Data Tables */}
          <div className="xl:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Daily Performance</CardTitle>
                <CardDescription>
                  Last few days of sales activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.daily_revenue.slice(-5).map((day) => (
                    <div key={day.date} className="flex items-center justify-between">
                      <div className="text-sm font-medium">{day.date}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(day.revenue)} • {day.orders} orders
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>
                  Best performing products by revenue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.top_products.slice(0, 5).map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          #{index + 1}
                        </span>
                        <div>
                          <div className="text-sm font-medium">{product.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {product.category}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {formatCurrency(product.total_sales)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {product.units_sold} units
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}