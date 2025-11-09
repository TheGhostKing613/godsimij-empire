import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Trash2, 
  Download, 
  FileText, 
  Image as ImageIcon, 
  Film,
  Music,
  File,
  Loader2
} from 'lucide-react';

interface StorageFile {
  id: string;
  name: string;
  bucket_id: string;
  created_at: string;
  updated_at: string;
  metadata: {
    size?: number;
    mimetype?: string;
  };
}

export default function FilesManagement() {
  const [files, setFiles] = useState<Record<string, StorageFile[]>>({
    scrolls: [],
    projects: [],
    media: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('scrolls');
  const { toast } = useToast();

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const buckets = ['scrolls', 'projects', 'media'];
      const filesData: Record<string, StorageFile[]> = {
        scrolls: [],
        projects: [],
        media: [],
      };

      for (const bucket of buckets) {
        const { data, error } = await supabase.storage.from(bucket).list();
        
        if (error) throw error;
        
        // Filter out folders and get file details
        const fileList = data?.filter(item => !item.id?.endsWith('/')) || [];
        
        // Get full file objects with metadata
        filesData[bucket] = fileList.map(file => ({
          id: file.id || file.name,
          name: file.name,
          bucket_id: bucket,
          created_at: file.created_at || new Date().toISOString(),
          updated_at: file.updated_at || new Date().toISOString(),
          metadata: file.metadata || {},
        }));
      }

      setFiles(filesData);
    } catch (error: any) {
      console.error('Error loading files:', error);
      toast({
        variant: "destructive",
        title: "Error loading files",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFileSelection = (bucket: string, fileName: string) => {
    const fileKey = `${bucket}/${fileName}`;
    const newSelected = new Set(selectedFiles);
    
    if (newSelected.has(fileKey)) {
      newSelected.delete(fileKey);
    } else {
      newSelected.add(fileKey);
    }
    
    setSelectedFiles(newSelected);
  };

  const selectAll = (bucket: string) => {
    const newSelected = new Set(selectedFiles);
    files[bucket].forEach(file => {
      newSelected.add(`${bucket}/${file.name}`);
    });
    setSelectedFiles(newSelected);
  };

  const deselectAll = (bucket: string) => {
    const newSelected = new Set(selectedFiles);
    files[bucket].forEach(file => {
      newSelected.delete(`${bucket}/${file.name}`);
    });
    setSelectedFiles(newSelected);
  };

  const handleBulkDelete = async () => {
    try {
      const filesToDelete: Record<string, string[]> = {
        scrolls: [],
        projects: [],
        media: [],
      };

      selectedFiles.forEach(fileKey => {
        const [bucket, ...nameParts] = fileKey.split('/');
        const fileName = nameParts.join('/');
        if (filesToDelete[bucket]) {
          filesToDelete[bucket].push(fileName);
        }
      });

      for (const [bucket, fileNames] of Object.entries(filesToDelete)) {
        if (fileNames.length > 0) {
          const { error } = await supabase.storage.from(bucket).remove(fileNames);
          if (error) throw error;
        }
      }

      toast({
        title: "Files deleted",
        description: `Successfully deleted ${selectedFiles.size} file(s).`,
      });

      setSelectedFiles(new Set());
      setShowDeleteDialog(false);
      loadFiles();
    } catch (error: any) {
      console.error('Error deleting files:', error);
      toast({
        variant: "destructive",
        title: "Error deleting files",
        description: error.message,
      });
    }
  };

  const handleDownload = async (bucket: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage.from(bucket).download(fileName);
      
      if (error) throw error;
      
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName.split('/').pop() || fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error downloading file:', error);
      toast({
        variant: "destructive",
        title: "Error downloading file",
        description: error.message,
      });
    }
  };

  const getFileIcon = (mimetype?: string) => {
    if (!mimetype) return <File className="w-5 h-5" />;
    
    if (mimetype.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-blue-500" />;
    if (mimetype.startsWith('video/')) return <Film className="w-5 h-5 text-purple-500" />;
    if (mimetype.startsWith('audio/')) return <Music className="w-5 h-5 text-green-500" />;
    if (mimetype.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    
    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getPublicUrl = (bucket: string, fileName: string) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  };

  const renderFileList = (bucket: string) => {
    const bucketFiles = files[bucket] || [];
    const selectedInBucket = bucketFiles.filter(file => 
      selectedFiles.has(`${bucket}/${file.name}`)
    ).length;

    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      );
    }

    if (bucketFiles.length === 0) {
      return (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No files in this bucket yet.
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => selectAll(bucket)}
              disabled={selectedInBucket === bucketFiles.length}
            >
              Select All
            </Button>
            {selectedInBucket > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => deselectAll(bucket)}
              >
                Deselect All ({selectedInBucket})
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {bucketFiles.length} file(s)
          </p>
        </div>

        <div className="grid gap-4">
          {bucketFiles.map((file) => {
            const fileKey = `${bucket}/${file.name}`;
            const isSelected = selectedFiles.has(fileKey);
            const isImage = file.metadata.mimetype?.startsWith('image/');
            const publicUrl = getPublicUrl(bucket, file.name);

            return (
              <Card key={file.id} className={isSelected ? 'border-primary' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleFileSelection(bucket, file.name)}
                    />
                    
                    {isImage ? (
                      <img
                        src={publicUrl}
                        alt={file.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center bg-muted rounded">
                        {getFileIcon(file.metadata.mimetype)}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name.split('/').pop()}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">{formatFileSize(file.metadata.size)}</Badge>
                        {file.metadata.mimetype && (
                          <Badge variant="secondary">{file.metadata.mimetype.split('/')[0]}</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Uploaded {new Date(file.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDownload(bucket, file.name)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedFiles(new Set([fileKey]));
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const totalFiles = Object.values(files).reduce((sum, bucket) => sum + bucket.length, 0);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-glow-ember mb-2">File Management</h1>
          <p className="text-muted-foreground">
            Manage uploaded files across all storage buckets • {totalFiles} total files
          </p>
        </div>
        {selectedFiles.size > 0 && (
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected ({selectedFiles.size})
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scrolls">
            Scrolls ({files.scrolls.length})
          </TabsTrigger>
          <TabsTrigger value="projects">
            Projects ({files.projects.length})
          </TabsTrigger>
          <TabsTrigger value="media">
            Media ({files.media.length})
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="scrolls">
            {renderFileList('scrolls')}
          </TabsContent>

          <TabsContent value="projects">
            {renderFileList('projects')}
          </TabsContent>

          <TabsContent value="media">
            {renderFileList('media')}
          </TabsContent>
        </div>
      </Tabs>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedFiles.size} file(s)?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected files from storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
