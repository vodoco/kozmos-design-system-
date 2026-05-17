import React, { useRef, useState } from 'react';
import { Upload, X, File } from 'lucide-react';
import { cn } from '../../utils';
import { Button } from '../Button';
import { FieldWrapper } from '../FieldWrapper';
import { useKozmosAnalytics } from '../../utils/analytics';

export interface FileUploadProps extends React.HTMLAttributes<HTMLDivElement> {
    onFileSelect?: (file: File) => void;
    accept?: string;
    maxSize?: number; // in bytes
    label?: string;
    error?: string;
    wrapperClassName?: string;
}

const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
    ({ className, wrapperClassName, label, error: externalError, onFileSelect, accept, maxSize, ...props }, ref) => {
        const inputRef = useRef<HTMLInputElement>(null);
        const [dragActive, setDragActive] = useState(false);
        const [selectedFile, setSelectedFile] = useState<File | null>(null);
        const [internalError, setInternalError] = useState<string | null>(null);
        const errorId = React.useId();
        const inputId = props.id || React.useId();
        const { trackEvent } = useKozmosAnalytics();
        
        const finalError = externalError || internalError || undefined;

        const handleFiles = (files: FileList | null) => {
            setInternalError(null);
            if (!files || files.length === 0) return;

            const file = files[0];
            if (maxSize && file.size > maxSize) {
                setInternalError(`File size exceeds ${maxSize / 1024 / 1024}MB`);
                return;
            }

            setSelectedFile(file);
            trackEvent('FileUpload', 'file_selected', { name: file.name, size: file.size, type: file.type });
            onFileSelect?.(file);
        };

        const handleDrag = (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.type === 'dragenter' || e.type === 'dragover') {
                setDragActive(true);
            } else if (e.type === 'dragleave') {
                setDragActive(false);
            }
        };

        const handleDrop = (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
            handleFiles(e.dataTransfer.files);
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            handleFiles(e.target.files);
        };

        const removeFile = () => {
            trackEvent('FileUpload', 'file_removed', { name: selectedFile?.name });
            setSelectedFile(null);
            if (inputRef.current) inputRef.current.value = '';
        };

        return (
            <FieldWrapper error={finalError} errorId={errorId} label={label} inputId={inputId} className={wrapperClassName}>
                <div ref={ref} className={cn('w-full', className)} {...props}>
                    {!selectedFile ? (
                        <div
                            className={cn(
                                'relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-[length:var(--primitives-radius-lg)] cursor-pointer transition-colors',
                                dragActive ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50',
                                finalError ? 'border-destructive' : ''
                            )}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => inputRef.current?.click()}
                        >
                            <input
                                ref={inputRef}
                                type="file"
                                id={inputId}
                                className="hidden"
                                accept={accept}
                                onChange={handleChange}
                                aria-invalid={!!finalError}
                                aria-errormessage={finalError ? errorId : undefined}
                            />
                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            {accept && <p className="text-xs text-muted-foreground mt-1">{accept}</p>}
                        </div>
                    ) : (
                        <div className="flex items-center p-3 border rounded-[length:var(--primitives-radius-lg)] bg-card focus-within:ring-2 focus-within:ring-ring">
                            <input
                                ref={inputRef}
                                type="file"
                                id={inputId}
                                className="hidden"
                                accept={accept}
                                onChange={handleChange}
                            />
                            <File className="w-8 h-8 text-primary mr-3" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {(selectedFile.size / 1024).toFixed(2)} KB
                                </p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={(e) => {
                                e.stopPropagation();
                                removeFile();
                            }}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </FieldWrapper>
        );
    }
);
FileUpload.displayName = 'FileUpload';

export { FileUpload };
