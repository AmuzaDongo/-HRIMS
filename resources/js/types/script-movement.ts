export interface ScriptMovement {
  id: string;

  movement_type: "dispatch" | "receive" | "internal_transfer" | "return";

  assessment_series: {
    id: string;
    name: string;
  };

  script_batch: {
    id: string;
    batch_code: string;
    assessment_series: {
      id: string;
      name: string;
    };
    paper: {
      id: string;
      name: string;
      code: string;
    };
  };

  from_center?: {
    id: string;
    name: string;
  };

  to_center?: {
    id: string;
    name: string;
  };

  from_location?: string;
  to_location: string;

  moved_at: string;
  remarks?: string;
}