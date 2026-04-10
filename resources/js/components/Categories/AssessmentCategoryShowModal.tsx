import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';


interface AssessmentCategoryShowModalProps {
  open: boolean;
  onClose: () => void;
  assessment_category: any;
}

export default function AssessmentCategoryShowModal({
  open,
  onClose,
  assessment_category,
}: AssessmentCategoryShowModalProps) {
  if (!assessment_category) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center justify-between pt-3">
            <span>Assessment Category Details</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm text-muted-foreground">Assessment Category Name</h4>
              <p className="text-lg font-semibold">
                {assessment_category.name}
              </p>
            </div>

            <div>
              <h4 className="text-sm text-muted-foreground">Code</h4>
              <p className="text-lg font-semibold">{assessment_category.code}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}