/**
 * Clinical Triage Calculator according to WHO & National Health Mission (NHM) primary care standards.
 * Computes risk level: 'normal', 'followup', or 'urgent' based on biometric readings.
 */

function calculateTriageStatus({
  systolic_bp,
  diastolic_bp,
  blood_glucose,
  glucose_type = 'random',
  heart_rate,
  spo2,
  temperature_f,
}) {
  const flags = [];

  // 1. Blood Pressure Triage
  if (systolic_bp || diastolic_bp) {
    const sys = Number(systolic_bp) || 0;
    const dia = Number(diastolic_bp) || 0;

    if (sys >= 160 || dia >= 100) {
      flags.push({ level: 'urgent', reason: `High Blood Pressure Stage 2 (${sys}/${dia} mmHg)` });
    } else if (sys >= 135 || dia >= 85) {
      flags.push({ level: 'followup', reason: `Borderline Elevated Blood Pressure (${sys}/${dia} mmHg)` });
    } else if (sys < 90 || (dia > 0 && dia < 55)) {
      flags.push({ level: 'urgent', reason: `Hypotension / Low Blood Pressure (${sys}/${dia} mmHg)` });
    }
  }

  // 2. Blood Glucose Triage
  if (blood_glucose) {
    const bg = Number(blood_glucose);
    if (bg < 60) {
      flags.push({ level: 'urgent', reason: `Severe Hypoglycemia (${bg} mg/dL) - Risk of shock` });
    } else if (glucose_type === 'fasting') {
      if (bg >= 160) {
        flags.push({ level: 'urgent', reason: `Very high fasting blood sugar (${bg} mg/dL)` });
      } else if (bg > 115) {
        flags.push({ level: 'followup', reason: `Elevated fasting blood sugar (${bg} mg/dL)` });
      }
    } else {
      // Random or postprandial
      if (bg >= 220) {
        flags.push({ level: 'urgent', reason: `Very high random blood sugar (${bg} mg/dL)` });
      } else if (bg > 150) {
        flags.push({ level: 'followup', reason: `Elevated blood sugar (${bg} mg/dL)` });
      }
    }
  }

  // 3. Oxygen Saturation (SpO2)
  if (spo2) {
    const o2 = Number(spo2);
    if (o2 <= 90) {
      flags.push({ level: 'urgent', reason: `Critical Hypoxemia (SpO2 ${o2}%) - Requires immediate oxygen` });
    } else if (o2 <= 94) {
      flags.push({ level: 'followup', reason: `Mild Hypoxemia (SpO2 ${o2}%)` });
    }
  }

  // 4. Heart Rate
  if (heart_rate) {
    const hr = Number(heart_rate);
    if (hr > 120) {
      flags.push({ level: 'urgent', reason: `Severe Tachycardia (${hr} bpm)` });
    } else if (hr < 50) {
      flags.push({ level: 'urgent', reason: `Severe Bradycardia (${hr} bpm)` });
    } else if (hr > 100 || hr < 55) {
      flags.push({ level: 'followup', reason: `Abnormal pulse (${hr} bpm)` });
    }
  }

  // 5. Temperature
  if (temperature_f) {
    const temp = Number(temperature_f);
    if (temp >= 102.5) {
      flags.push({ level: 'urgent', reason: `High Fever (${temp} °F)` });
    } else if (temp >= 99.8) {
      flags.push({ level: 'followup', reason: `Mild Fever (${temp} °F)` });
    } else if (temp < 95.0) {
      flags.push({ level: 'urgent', reason: `Hypothermia (${temp} °F)` });
    }
  }

  // Determine overall status
  const hasUrgent = flags.some((f) => f.level === 'urgent');
  if (hasUrgent) {
    return {
      status: 'urgent',
      flags,
      badgeText: 'Urgent Attention Needed',
      badgeClass: 'bg-error-container text-on-error-container',
    };
  }

  const hasFollowup = flags.some((f) => f.level === 'followup');
  if (hasFollowup) {
    return {
      status: 'followup',
      flags,
      badgeText: 'Follow-up Recommended',
      badgeClass: 'bg-amber-100 text-amber-900 border border-amber-300',
    };
  }

  return {
    status: 'normal',
    flags: [],
    badgeText: 'Normal Parameters',
    badgeClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
  };
}

module.exports = {
  calculateTriageStatus,
};

