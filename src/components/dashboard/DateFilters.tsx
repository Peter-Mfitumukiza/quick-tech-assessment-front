'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { getDateRanges, formatDateForInput } from '@/lib/utils';
import { Calendar, Filter } from 'lucide-react';

interface DateFiltersProps {
  onFilterChange: (dateFrom?: string, dateTo?: string) => void;
  loading?: boolean;
}

export function DateFilters({ onFilterChange, loading }: DateFiltersProps) {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [isFilterActive, setIsFilterActive] = useState(false);

  const dateRanges = getDateRanges();

  const handlePresetClick = (preset: keyof typeof dateRanges) => {
    const range = dateRanges[preset];
    setDateFrom(range.from);
    setDateTo(range.to);
    setActivePreset(preset);
    setIsFilterActive(true);
    onFilterChange(range.from, range.to);
  };

  const handleCustomFilter = () => {
    if (dateFrom || dateTo) {
      setActivePreset(null);
      setIsFilterActive(true);
      onFilterChange(dateFrom || undefined, dateTo || undefined);
    }
  };

  const handleClearFilter = () => {
    setDateFrom('');
    setDateTo('');
    setActivePreset(null);
    setIsFilterActive(false);
    onFilterChange();
  };

  const hasActiveFilter = isFilterActive;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Filter className="h-5 w-5" />
          <span>Filter by Date</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Presets */}
        <div>
          <p className="text-sm font-medium mb-2">Quick filters:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(dateRanges).map(([key, range]) => {
              const isActive = activePreset === key;
              return (
                <Button
                  key={key}
                  variant={isActive ? "default" : "secondary"}
                  size="sm"
                  onClick={() => handlePresetClick(key as keyof typeof dateRanges)}
                  disabled={loading}
                  className={isActive ? "ring-2 ring-offset-2 ring-primary" : ""}
                >
                  {range.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Custom Date Range */}
        <div>
          <p className="text-sm font-medium mb-2">Custom range:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Input
              type="date"
              label="From"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                // Only clear activePreset if the value differs from the preset range
                const currentPreset = activePreset ? dateRanges[activePreset as keyof typeof dateRanges] : null;
                if (currentPreset && e.target.value !== currentPreset.from) {
                  setActivePreset(null);
                }
              }}
              max={formatDateForInput(new Date())}
            />
            <Input
              type="date"
              label="To"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                // Only clear activePreset if the value differs from the preset range
                const currentPreset = activePreset ? dateRanges[activePreset as keyof typeof dateRanges] : null;
                if (currentPreset && e.target.value !== currentPreset.to) {
                  setActivePreset(null);
                }
              }}
              max={formatDateForInput(new Date())}
              min={dateFrom}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            onClick={handleCustomFilter}
            disabled={loading || (!dateFrom && !dateTo)}
            className="flex-1"
          >
            Apply Filter
          </Button>
          {hasActiveFilter && (
            <Button
              variant="secondary"
              onClick={handleClearFilter}
              disabled={loading}
            >
              Clear
            </Button>
          )}
        </div>

        {/* Active Filter Display */}
        {hasActiveFilter && (
          <div className="text-sm text-muted-foreground bg-muted/30 p-2 rounded-md">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>
                {activePreset ? (
                  <>Active: {dateRanges[activePreset as keyof typeof dateRanges].label}</>
                ) : (
                  <>
                    {dateFrom && `From: ${dateFrom}`}
                    {dateFrom && dateTo && ' • '}
                    {dateTo && `To: ${dateTo}`}
                  </>
                )}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}