import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '../ui/badge';

interface AssessmentSeries {
  id: number;
  name: string;
  year: string;
  status: string;
  update: (id: number) => string;
}

interface AssessmentSeriesShowModalProps {
  open: boolean;
  onClose: () => void;
  assessmentSeries: AssessmentSeries;
}

export default function AssessmentSeriesShowModal({
  open,
  onClose,
  assessmentSeries,
}: AssessmentSeriesShowModalProps) {
  if (!assessmentSeries) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center justify-between pt-3">
            <span>Assessment Series Details</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm text-muted-foreground">Assessment Series</h4>
              <p className="text-lg font-semibold">
                {assessmentSeries.name}
              </p>
              <h4 className="text-sm text-muted-foreground">Year</h4>
              <p className="text-lg font-semibold">{assessmentSeries.year}</p>

              <h4 className="text-sm text-muted-foreground">Status</h4>
              <Badge>{assessmentSeries.status}</Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}