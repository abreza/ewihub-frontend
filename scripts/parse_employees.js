const fs = require("fs");

const INPUT = process.argv[2] || "ewihub_employees.json";
const OUTPUT = process.argv[3] || "ewihub_employees_detailed.json";

function attr(attributes, canonical, ...fallbacks) {
  const keys = [canonical, ...fallbacks];
  for (const k of keys) {
    if (attributes[k] != null && attributes[k] !== "" && attributes[k] !== "-")
      return attributes[k];
  }
  return null;
}

function parseDemographic(attributes) {
  const demo = {};

  const age = attr(attributes, "age");
  if (age) demo.age = age;

  const heightRaw = attr(attributes, "height");
  if (heightRaw) {
    demo.heightRaw = heightRaw;
    demo.heightInches = parseHeight(heightRaw);
  }

  const hand = attr(attributes, "dominantHand");
  if (hand) {
    demo.handedness = /left/i.test(hand) ? "left" : "right";
  }

  const bifocals = attr(attributes, "bifocals");
  if (bifocals != null) {
    demo.wearsBifocals = toBool(bifocals);
  }

  const visualIssue = attr(attributes, "visualIssue");
  if (visualIssue != null) demo.visualIssue = visualIssue;

  const computerTime = attr(attributes, "computerTime");
  if (computerTime != null) demo.computerTime = computerTime;

  const dualMon = attr(attributes, "dualMonitor");
  if (dualMon != null) {
    demo.dualMonitors = toBool(dualMon);
  }

  const laptop = attr(attributes, "laptop");
  if (laptop != null) {
    demo.usesLaptop = toBool(laptop);
  }

  const sitToStand = attr(attributes, "sitToStand");
  if (sitToStand != null) demo.sitToStand = sitToStand;

  const compositeRaw = attr(attributes, "demographic");
  if (compositeRaw) {
    const fromComposite = parseDemographicString(compositeRaw);
    for (const [k, v] of Object.entries(fromComposite)) {
      if (demo[k] === undefined) demo[k] = v;
    }
  }

  if (demo.dualMonitors === undefined) demo.dualMonitors = false;
  if (demo.usesLaptop === undefined) demo.usesLaptop = false;
  if (demo.wearsBifocals === undefined) demo.wearsBifocals = false;

  return Object.keys(demo).length > 3 ? demo : null; // return null if only defaults
}

function parseDemographicString(raw) {
  if (!raw || raw === "-") return {};

  const demo = {};
  const parts = raw
    .split(/\s*,\s*/)
    .map((s) => s.trim())
    .filter(Boolean);

  for (const part of parts) {
    const ageMatch = part.match(/^Age:\s*(.+)/i);
    if (ageMatch) {
      demo.age = ageMatch[1].trim();
      continue;
    }

    const heightMatch = part.match(/^Height:\s*(.+)/i);
    if (heightMatch) {
      demo.heightRaw = heightMatch[1].trim();
      demo.heightInches = parseHeight(heightMatch[1].trim());
      continue;
    }

    if (/left.?handed/i.test(part)) {
      demo.handedness = "left";
      continue;
    }
    if (/right.?handed/i.test(part)) {
      demo.handedness = "right";
      continue;
    }

    if (/has dual monitors/i.test(part)) {
      demo.dualMonitors = true;
      continue;
    }
    if (/uses laptop/i.test(part)) {
      demo.usesLaptop = true;
      continue;
    }
    if (/wears bifocals/i.test(part)) {
      demo.wearsBifocals = true;
      continue;
    }

    if (/chair height is adjustable/i.test(part)) {
      demo.chairAdjustable = true;
      continue;
    }
    if (/chair height is not adjustable/i.test(part)) {
      demo.chairAdjustable = false;
      continue;
    }

    const sitStandMatch = part.match(/sit to stand desk:\s*(.+)/i);
    if (sitStandMatch) {
      demo.sitToStand = sitStandMatch[1].trim();
      continue;
    }

    const compTimeMatch = part.match(/computer time:\s*(.+)/i);
    if (compTimeMatch) {
      demo.computerTime = compTimeMatch[1].trim();
      continue;
    }
  }

  return demo;
}

function parseHeight(raw) {
  if (!raw) return null;
  const m = raw.match(/(\d+)'\s*-?\s*(\d+(?:\.\d+)?)/);
  if (!m) return null;
  return parseInt(m[1], 10) * 12 + parseFloat(m[2]);
}

function toBool(val) {
  if (typeof val === "boolean") return val;
  if (typeof val === "number") return val !== 0;
  if (typeof val === "string") {
    const v = val.trim().toLowerCase();
    return ["true", "yes", "1", "on"].includes(v);
  }
  return false;
}

function parseDiscomforts(attributes) {
  const areas = [];
  const seen = new Set();

  const areasRaw = attr(attributes, "discomfortAreas", "Discomforts");
  if (areasRaw) {
    for (const entry of splitList(areasRaw)) {
      const m = entry.match(/^(.+?):\s*(\d+)$/);
      const area = m ? m[1].trim() : entry;
      const severity = m ? parseInt(m[2], 10) : null;
      if (!seen.has(area.toLowerCase())) {
        seen.add(area.toLowerCase());
        areas.push({ area, severity });
      }
    }
  }

  const discomfortRaw = attr(attributes, "discomfort");
  if (discomfortRaw && !seen.has(discomfortRaw.toLowerCase())) {
    areas.push({ area: discomfortRaw, severity: null });
  }

  return areas;
}

function parseEquipment(attributes) {
  const raw = attr(attributes, "equipmentNeeded", "Equipment");
  return splitList(raw);
}

function parseActions(attributes) {
  const raw = attr(attributes, "actionNeeded", "Action");
  return splitList(raw);
}

function parseIssues(attributes) {
  const adjustmentResult = attr(attributes, "adjustmentResult", "Issues");
  const result = attr(attributes, "result", "Result");

  if (!adjustmentResult && !result) {
    return { recommendations: [], actionItems: [], suggestions: [], raw: null };
  }

  const raw = adjustmentResult || "";
  const parsed = {
    recommendations: [],
    actionItems: [],
    suggestions: [],
    result: result || null,
    raw: raw || null,
  };

  if (!raw || raw === "-" || /^no issues$/i.test(raw.trim())) return parsed;

  const equipMatch = raw.match(
    /Recommend Equipment:\s*([^A-Z]*?)(?=Action Items:|Suggestions:|$)/i,
  );
  if (equipMatch) {
    parsed.recommendations = splitList(equipMatch[1]);
  }

  const actionMatch = raw.match(
    /Action Items:\s*(.+?)(?=Recommend Equipment:|Suggestions:|$)/i,
  );
  if (actionMatch) {
    parsed.actionItems = splitList(actionMatch[1]);
  }

  const suggestMatch = raw.match(/Suggestions:\s*(.+)/i);
  if (suggestMatch) {
    parsed.suggestions = [suggestMatch[1].trim()];
  }

  if (
    parsed.recommendations.length === 0 &&
    parsed.actionItems.length === 0 &&
    parsed.suggestions.length === 0
  ) {
    parsed.other = splitList(raw);
  }

  return parsed;
}

const BODY_PART_LABELS = {
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

const BODY_PART_GROUPS = {
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

function parseBodyDiagram(rawDiagram) {
  if (!rawDiagram || typeof rawDiagram !== "object") return null;

  const parts = {};
  let hasDiscomfort = false;

  for (const [key, severity] of Object.entries(rawDiagram)) {
    const sev =
      typeof severity === "number" ? severity : parseInt(severity, 10);
    if (isNaN(sev)) continue;

    parts[key] = {
      label: BODY_PART_LABELS[key] || key,
      severity: sev,
    };

    if (sev > 0) hasDiscomfort = true;
  }

  const affectedAreas = Object.entries(parts)
    .filter(([, v]) => v.severity > 0)
    .sort((a, b) => b[1].severity - a[1].severity)
    .map(([key, v]) => ({
      bodyPart: key,
      label: v.label,
      severity: v.severity,
    }));

  const totalSeverity = Object.values(parts).reduce(
    (sum, v) => sum + v.severity,
    0,
  );

  const maxSeverity = Object.values(parts).reduce(
    (max, v) => Math.max(max, v.severity),
    0,
  );

  return {
    allParts: parts,
    affectedAreas,
    hasDiscomfort,
    totalSeverity,
    maxSeverity,
    affectedCount: affectedAreas.length,
  };
}

function parseTraining(training) {
  const a = training.attributes;

  const parsed = {
    course: training.course,
    status: training.status,
    startedDate: attr(a, "startedOn", "Started") || null,
    completedDate: attr(a, "completedOn", "Completed") || null,
  };

  if (training.course === "Self Assessment" && training.status !== "pending") {
    parsed.demographic = parseDemographic(a);
    parsed.discomforts = parseDiscomforts(a);
    parsed.actions = parseActions(a);
    parsed.equipment = parseEquipment(a);
    parsed.issues = parseIssues(a);
    parsed.result = attr(a, "result", "Result") || null;

    if (training.bodyDiagram) {
      parsed.bodyDiagram = parseBodyDiagram(training.bodyDiagram);
    }
  }

  return parsed;
}

function parseEmployee(emp) {
  const parsed = {
    name: emp.name,
    email: emp.email,
    oldProfileUrl: emp.profileUrl,
    trainings: emp.trainings.map(parseTraining),
  };

  if (emp.bodyDiagram) {
    parsed.bodyDiagram = parseBodyDiagram(emp.bodyDiagram);
  }

  return parsed;
}

function buildSummary(employees) {
  const stats = {
    totalEmployees: employees.length,
    selfAssessment: { pass: 0, action: 0, assessment: 0, pending: 0 },
    officeErgonomics: { completed: 0, pending: 0 },
    discomfortAreas: {},
    equipmentNeeded: {},
    commonIssues: {},
    bodyParts: {
      affectedCounts: {},
      severitySums: {},
      totalWithData: {},
      groupAffectedCounts: {},
      employeesWithDiscomfort: 0,
      employeesWithDiagram: 0,
      averageTotalSeverity: 0,
      averageAffectedAreas: 0,
      maxSeverityDistribution: {},
    },
  };

  const totalSeverities = [];
  const affectedCounts = [];

  for (const emp of employees) {
    for (const t of emp.trainings) {
      if (t.course === "Self Assessment") {
        stats.selfAssessment[t.status] =
          (stats.selfAssessment[t.status] || 0) + 1;

        if (t.discomforts) {
          for (const d of t.discomforts) {
            stats.discomfortAreas[d.area] =
              (stats.discomfortAreas[d.area] || 0) + 1;
          }
        }
        if (t.equipment) {
          for (const e of t.equipment) {
            stats.equipmentNeeded[e] = (stats.equipmentNeeded[e] || 0) + 1;
          }
        }
        if (t.issues?.other) {
          for (const iss of t.issues.other) {
            stats.commonIssues[iss] = (stats.commonIssues[iss] || 0) + 1;
          }
        }

        if (t.bodyDiagram) {
          stats.bodyParts.employeesWithDiagram++;

          if (t.bodyDiagram.hasDiscomfort) {
            stats.bodyParts.employeesWithDiscomfort++;
          }

          totalSeverities.push(t.bodyDiagram.totalSeverity);
          affectedCounts.push(t.bodyDiagram.affectedCount);

          const maxSev = t.bodyDiagram.maxSeverity;
          stats.bodyParts.maxSeverityDistribution[maxSev] =
            (stats.bodyParts.maxSeverityDistribution[maxSev] || 0) + 1;

          for (const [part, info] of Object.entries(t.bodyDiagram.allParts)) {
            stats.bodyParts.totalWithData[part] =
              (stats.bodyParts.totalWithData[part] || 0) + 1;
            stats.bodyParts.severitySums[part] =
              (stats.bodyParts.severitySums[part] || 0) + info.severity;

            if (info.severity > 0) {
              stats.bodyParts.affectedCounts[part] =
                (stats.bodyParts.affectedCounts[part] || 0) + 1;
            }
          }

          for (const [group, parts] of Object.entries(BODY_PART_GROUPS)) {
            const groupMax = Math.max(
              ...parts.map((p) => t.bodyDiagram.allParts[p]?.severity ?? 0),
            );
            if (groupMax > 0) {
              stats.bodyParts.groupAffectedCounts[group] =
                (stats.bodyParts.groupAffectedCounts[group] || 0) + 1;
            }
          }
        }
      }

      if (t.course === "Office Ergonomics") {
        stats.officeErgonomics[t.status] =
          (stats.officeErgonomics[t.status] || 0) + 1;
      }
    }
  }

  if (totalSeverities.length > 0) {
    stats.bodyParts.averageTotalSeverity =
      Math.round(
        (totalSeverities.reduce((a, b) => a + b, 0) / totalSeverities.length) *
          100,
      ) / 100;

    stats.bodyParts.averageAffectedAreas =
      Math.round(
        (affectedCounts.reduce((a, b) => a + b, 0) / affectedCounts.length) *
          100,
      ) / 100;
  }

  stats.bodyParts.averageSeverityByPart = {};
  for (const [part, sum] of Object.entries(stats.bodyParts.severitySums)) {
    const total = stats.bodyParts.totalWithData[part] || 1;
    stats.bodyParts.averageSeverityByPart[part] =
      Math.round((sum / total) * 100) / 100;
  }

  const sortDesc = (obj) =>
    Object.fromEntries(Object.entries(obj).sort(([, a], [, b]) => b - a));

  stats.discomfortAreas = sortDesc(stats.discomfortAreas);
  stats.equipmentNeeded = sortDesc(stats.equipmentNeeded);
  stats.commonIssues = sortDesc(stats.commonIssues);
  stats.bodyParts.affectedCounts = sortDesc(stats.bodyParts.affectedCounts);
  stats.bodyParts.groupAffectedCounts = sortDesc(
    stats.bodyParts.groupAffectedCounts,
  );
  stats.bodyParts.averageSeverityByPart = sortDesc(
    stats.bodyParts.averageSeverityByPart,
  );

  return stats;
}

function splitList(raw) {
  if (!raw || raw === "-") return [];
  return raw
    .split(/\s*,\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
}

try {
  const raw = JSON.parse(fs.readFileSync(INPUT, "utf8"));
  console.log(`Loaded ${raw.length} employees from ${INPUT}`);

  const parsed = raw.map(parseEmployee);
  const summary = buildSummary(parsed);

  const output = { summary, employees: parsed };

  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2));
  console.log(`✅ Wrote detailed JSON → ${OUTPUT}`);
  console.log(`\n📊 Summary:`);
  console.log(`   Employees: ${summary.totalEmployees}`);
  console.log(
    `   Self-Assessment: pass=${summary.selfAssessment.pass}, action=${summary.selfAssessment.action}, assessment=${summary.selfAssessment.assessment}, pending=${summary.selfAssessment.pending}`,
  );
  console.log(
    `   Office Ergonomics: completed=${summary.officeErgonomics.completed}, pending=${summary.officeErgonomics.pending}`,
  );
  console.log(
    `   TMIS Results:`,
    Object.entries(summary.tmisResults)
      .map(([k, v]) => `${k}(${v})`)
      .join(", ") || "none",
  );
  console.log(
    `   Top discomfort areas:`,
    Object.entries(summary.discomfortAreas)
      .slice(0, 5)
      .map(([k, v]) => `${k}(${v})`)
      .join(", "),
  );
  console.log(
    `   Top equipment needs:`,
    Object.entries(summary.equipmentNeeded)
      .slice(0, 5)
      .map(([k, v]) => `${k}(${v})`)
      .join(", "),
  );

  const bp = summary.bodyParts;
  console.log(`\n🦴 Body Diagram Summary:`);
  console.log(`   Employees with diagram data: ${bp.employeesWithDiagram}`);
  console.log(
    `   Employees reporting discomfort: ${bp.employeesWithDiscomfort}`,
  );
  console.log(`   Avg total severity score: ${bp.averageTotalSeverity}`);
  console.log(`   Avg affected areas per person: ${bp.averageAffectedAreas}`);
  console.log(
    `   Max severity distribution:`,
    Object.entries(bp.maxSeverityDistribution)
      .sort(([a], [b]) => b - a)
      .map(([sev, count]) => `level ${sev}(${count})`)
      .join(", ") || "none",
  );
  console.log(
    `   Top affected body parts:`,
    Object.entries(bp.affectedCounts)
      .slice(0, 8)
      .map(([k, v]) => `${BODY_PART_LABELS[k] || k}(${v})`)
      .join(", ") || "none",
  );
  console.log(
    `   Top affected groups:`,
    Object.entries(bp.groupAffectedCounts)
      .slice(0, 5)
      .map(([k, v]) => `${k}(${v})`)
      .join(", ") || "none",
  );
  console.log(
    `   Highest avg severity:`,
    Object.entries(bp.averageSeverityByPart)
      .filter(([, v]) => v > 0)
      .slice(0, 5)
      .map(([k, v]) => `${BODY_PART_LABELS[k] || k}(${v})`)
      .join(", ") || "none",
  );
} catch (err) {
  console.error("❌ Error:", err.message);
  process.exit(1);
}
