export type BodyPartKey =
  | "upperBack"
  | "midBack"
  | "lowerBack"
  | "buttocks"
  | "head"
  | "neck"
  | "eyes"
  | "leftShoulder"
  | "rightShoulder"
  | "leftUpperArm"
  | "rightUpperArm"
  | "leftElbow"
  | "rightElbow"
  | "leftLowerArm"
  | "rightLowerArm"
  | "leftWrist"
  | "rightWrist"
  | "leftHand"
  | "rightHand"
  | "leftThigh"
  | "rightThigh"
  | "leftKnee"
  | "rightKnee"
  | "leftLowerLeg"
  | "rightLowerLeg"
  | "leftFootOrAnkle"
  | "rightFootOrAnkle";

export type BodyPartGroupKey =
  | "head"
  | "eyes"
  | "neck"
  | "shoulders"
  | "upperArms"
  | "elbows"
  | "lowerArms"
  | "wrists"
  | "hands"
  | "upperBack"
  | "midBack"
  | "lowerBack"
  | "buttocks"
  | "thighs"
  | "knees"
  | "lowerLegs"
  | "feetOrAnkles";

export type Severity = number;

export interface BodyPartInfo {
  label: string;
  severity: Severity;
}

export interface AffectedArea {
  bodyPart: BodyPartKey;
  label: string;
  severity: Severity;
}

export interface BodyDiagram {
  allParts: Partial<Record<BodyPartKey, BodyPartInfo>>;
  affectedAreas: AffectedArea[];
  hasDiscomfort: boolean;
  totalSeverity: number;
  maxSeverity: number;
  affectedCount: number;
}


export interface Demographic {
  age?: string;
  heightRaw?: string;
  heightInches?: number | null;
  handedness?: "left" | "right";
  wearsBifocals: boolean;
  visualIssue?: string;
  computerTime?: string;
  dualMonitors: boolean;
  usesLaptop: boolean;
  sitToStand?: string;
  chairAdjustable?: boolean;
}


export interface Discomfort {
  area: string;
  severity: number | null;
}


export interface Issues {
  recommendations: string[];
  actionItems: string[];
  suggestions: string[];
  result?: string | null;
  raw?: string | null;
  other?: string[];
}


export type TrainingStatus =
  | "pass"
  | "action"
  | "assessment"
  | "pending"
  | "started"
  | "finished"
  | string;

export interface BaseTraining {
  course: string;
  status: TrainingStatus;
  startedDate: string | null;
  completedDate: string | null;
}

export interface SelfAssessmentTraining extends BaseTraining {
  course: "Self Assessment";
  demographic: Demographic | null;
  discomforts: Discomfort[];
  actions: string[];
  equipment: string[];
  issues: Issues;
  result: string | null;
  bodyDiagram?: BodyDiagram | null;
}

export interface OtherTraining extends BaseTraining {
  course: "Office Ergonomics" | string;
}

export type Training = SelfAssessmentTraining | OtherTraining;


export interface Employee {
  name: string;
  email: string;
  oldProfileUrl: string;
  trainings: Training[];
  bodyDiagram?: BodyDiagram | null;
}

export function isSelfAssessment(
  training: Training,
): training is SelfAssessmentTraining {
  return training.course === "Self Assessment";
}

export function hasBodyDiagram(
  training: Training,
): training is SelfAssessmentTraining & { bodyDiagram: BodyDiagram } {
  return (
    isSelfAssessment(training) &&
    training.bodyDiagram != null &&
    training.bodyDiagram.affectedCount >= 0
  );
}

export function hasDiscomfort(diagram: BodyDiagram): boolean {
  return diagram.hasDiscomfort && diagram.affectedCount > 0;
}


export const BODY_PART_LABELS: Record<BodyPartKey, string> = {
  upperBack: "Upper Back",
  midBack: "Mid Back",
  lowerBack: "Lower Back",
  buttocks: "Buttocks",
  head: "Head",
  neck: "Neck",
  eyes: "Eyes",
  leftShoulder: "Left Shoulder",
  rightShoulder: "Right Shoulder",
  leftUpperArm: "Left Upper Arm",
  rightUpperArm: "Right Upper Arm",
  leftElbow: "Left Elbow",
  rightElbow: "Right Elbow",
  leftLowerArm: "Left Lower Arm",
  rightLowerArm: "Right Lower Arm",
  leftWrist: "Left Wrist",
  rightWrist: "Right Wrist",
  leftHand: "Left Hand",
  rightHand: "Right Hand",
  leftThigh: "Left Thigh",
  rightThigh: "Right Thigh",
  leftKnee: "Left Knee",
  rightKnee: "Right Knee",
  leftLowerLeg: "Left Lower Leg",
  rightLowerLeg: "Right Lower Leg",
  leftFootOrAnkle: "Left Foot/Ankle",
  rightFootOrAnkle: "Right Foot/Ankle",
};

export const BODY_PART_GROUPS: Record<BodyPartGroupKey, BodyPartKey[]> = {
  head: ["head"],
  eyes: ["eyes"],
  neck: ["neck"],
  shoulders: ["leftShoulder", "rightShoulder"],
  upperArms: ["leftUpperArm", "rightUpperArm"],
  elbows: ["leftElbow", "rightElbow"],
  lowerArms: ["leftLowerArm", "rightLowerArm"],
  wrists: ["leftWrist", "rightWrist"],
  hands: ["leftHand", "rightHand"],
  upperBack: ["upperBack"],
  midBack: ["midBack"],
  lowerBack: ["lowerBack"],
  buttocks: ["buttocks"],
  thighs: ["leftThigh", "rightThigh"],
  knees: ["leftKnee", "rightKnee"],
  lowerLegs: ["leftLowerLeg", "rightLowerLeg"],
  feetOrAnkles: ["leftFootOrAnkle", "rightFootOrAnkle"],
};
