import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Paper {
  id: number;
  name: string;
  code: string;
  file_path: string;
  update: (id: number) => string;
}

interface PaperShowModalProps {
  open: boolean;
  onClose: () => void;
  paper: Paper;
}

export default function PaperShowModal({
  open,
  onClose,
  paper,
}: PaperShowModalProps) {
  if (!paper) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center justify-between pt-3">
            <span>Paper Details</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm text-muted-foreground">Paper Name</h4>
              <p className="text-lg font-semibold">
                {paper.name}
              </p>
              <h4 className="text-sm text-muted-foreground">Paper Code</h4>
              <p className="text-lg font-semibold">{paper.code}</p>
            </div>
          </div>

          {/* Message */}
          <div>
            {paper.file_path ? (
              <div className="space-y-3">
                <a
                  href={`/storage/${paper.file_path}`}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  Open PDF
                </a>

                {/* Embedded Preview */}
                <div className="border rounded-lg overflow-hidden">
                  <iframe
                    src={`/storage/${paper.file_path}`}
                    className="w-full h-125"
                  />
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No file uploaded</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}