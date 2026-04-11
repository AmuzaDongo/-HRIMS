import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useConfirm } from '@/components/ui/confirm-provider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// interface MarkingCenter {
//   id: number;
//   status: string;
//   name: string;
//   code: string;
//   type: string;
//   region?: string;
//   district?: string;
//   address?: string;
//   update: (id: number) => string;
// }

interface MarkingCenterShowModalProps {
  open: boolean;
  onClose: () => void;
  marking_center: any;
}

export default function MarkingCenterShowModal({
  open,
  onClose,
  marking_center,
}: MarkingCenterShowModalProps) {
  const { confirm } = useConfirm();

  if (!marking_center) return null;

  const status = marking_center.status?.toLowerCase();

  const getStatusVariant = () => {
    if (status === 'open') return 'default';
    if (status === 'postponed' || status === 'postponed') return 'default';
    if (status === 'closed') return 'destructive';
    if (status === 'cancelled') return 'destructive';
    return 'secondary';
  };

  const updateStatus = (newStatus: string) => {
    confirm({
      title: `Mark as ${newStatus.replace('_', ' ')}`,
      description: `Are you sure you want to mark this marking center as ${newStatus}?`,
      onConfirm: async () => {
        const promise = new Promise((resolve, reject) => {
          router.put(
            marking_center.update(marking_center.id),
            { status: newStatus },
            {
              onSuccess: (page) => {
                onClose(); // Auto-close modal
                resolve(page);
              },
              onError: reject,
            }
          );
        });

        toast.promise(promise, {
          loading: 'Updating status...',
          success: `Status updated to ${newStatus} ✅`,
          error: 'Failed to update status ❌',
        });

        await promise;
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center justify-between pt-3">
            <span>Marking Center Details</span>

            <motion.div
              key={status} // triggers animation when status changes
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Badge variant={getStatusVariant()} className="capitalize">
                {marking_center.status}
              </Badge>
            </motion.div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm text-muted-foreground">Marking Center Name</h4>
              <p className="text-lg font-semibold">
                {marking_center.name}
              </p>
            </div>

            <div>
              <h4 className="text-sm text-muted-foreground">Code</h4>
              <p className="text-lg font-semibold">{marking_center.code}</p>
            </div>

            <div>
              <h4 className="text-sm text-muted-foreground">Type</h4>
              <p className="text-lg font-semibold">{marking_center.type}</p>
            </div>

            {marking_center.region && (
              <div>
                <h4 className="text-sm text-muted-foreground">Region</h4>
                <p className="text-lg font-semibold">{marking_center.region}</p>
              </div>
            )}

            {marking_center.district && (
              <div>
                <h4 className="text-sm text-muted-foreground">District</h4>
                <p className="text-lg font-semibold">{marking_center.district}</p>
              </div>
            )}

            {marking_center.address && (
              <div>
                <h4 className="text-sm text-muted-foreground">Address</h4>
                <p className="text-lg font-semibold">{marking_center.address}</p>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            {status === 'approved' && (
              <Button onClick={() => updateStatus('in_progress')}>Start Service</Button>
            )}

            {status === 'in_progress' && (
              <Button
                variant="default"
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={() => updateStatus('completed')}
              >
                Mark as Completed
              </Button>
            )}

            {status === 'pending' && (
              <Button
                variant="destructive"
                onClick={() => updateStatus('rejected')}
              >
                Reject
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}