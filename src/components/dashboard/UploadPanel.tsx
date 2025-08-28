/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { ApiClient } from '@/lib/api';
import { isValidCSVFile, isValidFileSize } from '@/lib/utils';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';

interface UploadPanelProps {
  onUploadSuccess: () => void;
}

export function UploadPanel({ onUploadSuccess }: UploadPanelProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
    processed?: number;
    skipped?: number;
    errors?: string[];
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setUploadResult(null);
    
    if (!isValidCSVFile(file)) {
      setUploadResult({
        success: false,
        message: 'Please select a valid CSV file',
      });
      return;
    }

    if (!isValidFileSize(file)) {
      setUploadResult({
        success: false,
        message: 'File size must be less than 10MB',
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadResult(null);

    try {
      const result = await ApiClient.uploadCSV(selectedFile);
      
      if (result.success) {
        setUploadResult({
          success: true,
          message: result.message,
          processed: result.data.processed_count,
          skipped: result.data.skipped_count,
          errors: result.data.errors,
        });
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onUploadSuccess();
      } else {
        setUploadResult({
          success: false,
          message: result.message,
        });
      }
    } catch (error: any) {
      setUploadResult({
        success: false,
        message: error.message || 'Upload failed',
      });
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Upload Sales Data</span>
        </CardTitle>
        <CardDescription>
          Upload a CSV file with your sales data to update the dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileInputChange}
            className="hidden"
            id="csv-upload"
          />
          
          {selectedFile ? (
            <div className="space-y-2">
              <FileText className="h-8 w-8 mx-auto text-primary" />
              <div className="flex items-center justify-center space-x-2">
                <span className="font-medium">{selectedFile.name}</span>
                <button
                  onClick={clearFile}
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
              <div>
                <p className="font-medium">Drop your CSV file here</p>
                <p className="text-sm text-muted-foreground">
                  or{' '}
                  <label htmlFor="csv-upload" className="text-primary hover:underline cursor-pointer">
                    browse files
                  </label>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Expected Format */}
        <div className="text-xs space-y-1 text-muted-foreground bg-muted/30 p-3 rounded-md">
          <p className="font-medium">Expected CSV format:</p>
          <code className="block">product_name,category,price,quantity,sold_at</code>
          <p>Example: Laptop Pro,Electronics,1299.99,2,2024-01-15</p>
        </div>

        {/* Upload Button */}
        {selectedFile && (
          <Button
            onClick={handleUpload}
            loading={uploading}
            className="w-full"
          >
            {uploading ? 'Uploading...' : 'Upload & Process'}
          </Button>
        )}

        {/* Upload Result */}
        {uploadResult && (
          <div className={`p-4 rounded-md border ${
            uploadResult.success 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-start space-x-2">
              {uploadResult.success ? (
                <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              )}
              <div className="space-y-1">
                <p className="font-medium">{uploadResult.message}</p>
                {uploadResult.success && uploadResult.processed !== undefined && (
                  <div className="text-sm">
                    <p>✓ Processed: {uploadResult.processed} rows</p>
                    {uploadResult.skipped || 0 > 0 && (
                      <p>⚠ Skipped: {uploadResult.skipped} invalid rows</p>
                    )}
                  </div>
                )}
                {uploadResult.errors && uploadResult.errors.length > 0 && (
                  <div className="text-sm space-y-1">
                    <p className="font-medium">Validation errors:</p>
                    <ul className="list-disc list-inside space-y-0.5 max-h-32 overflow-y-auto">
                      {uploadResult.errors.slice(0, 5).map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                      {uploadResult.errors.length > 5 && (
                        <li>... and {uploadResult.errors.length - 5} more errors</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}