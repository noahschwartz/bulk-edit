// Downstream systems that are affected by employee attribute changes

// Rippling's own products - we know exactly when they've processed changes
export const RIPPLING_APPS = [
  {
    id: 'payroll',
    name: 'Payroll',
    icon: 'dollar',
    description: 'Payroll processing and tax calculations',
    triggeredBy: ['salary', 'hourlyRate', 'bonusTarget', 'payFrequency', 'location', 'state', 'taxJurisdictionState'],
    impactDescriptions: {
      salary: 'Recalculation for next pay cycle',
      location: 'Tax jurisdiction update, withholding recalculation',
      state: 'State tax withholding update',
    },
  },
  {
    id: 'benefits',
    name: 'Benefits',
    icon: 'heart',
    description: 'Benefits enrollment and eligibility',
    triggeredBy: ['salary', 'employmentType', 'location', 'state', 'benefitsEligibilityGroup'],
    impactDescriptions: {
      salary: 'Benefit tier eligibility review',
      location: 'State-specific benefits update, potential re-enrollment',
      employmentType: 'Benefits eligibility change',
    },
  },
  {
    id: 'device_management',
    name: 'Device Management',
    icon: 'laptop',
    description: 'Device provisioning and access policies',
    triggeredBy: ['department', 'location', 'team', 'level'],
    impactDescriptions: {
      department: 'App permission review triggered',
      location: 'VPN config update, badge access update',
      team: 'Software license group update',
    },
  },
  {
    id: 'time_attendance',
    name: 'Time & Attendance',
    icon: 'clock',
    description: 'PTO policies and time tracking',
    triggeredBy: ['department', 'location', 'employmentType', 'hoursPerWeek', 'ptoPolicy'],
    impactDescriptions: {
      department: 'PTO policy reassignment',
      location: 'Holiday calendar update',
      employmentType: 'Overtime eligibility update',
    },
  },
]

// Third-party apps connected to Rippling
export const CONNECTED_APPS = [
  {
    id: 'slack',
    name: 'Slack',
    icon: 'message',
    connectionType: 'api_push', // We push and get confirmation
    description: 'Team communication',
    triggeredBy: ['department', 'team', 'location', 'managerId'],
    impactDescriptions: {
      department: 'Channel membership updates',
      location: 'Office channel updates',
      team: 'Team channel updates',
    },
  },
  {
    id: 'google_workspace',
    name: 'Google Workspace',
    icon: 'mail',
    connectionType: 'api_push',
    description: 'Email, calendar, drive',
    triggeredBy: ['department', 'team', 'location', 'email', 'managerId'],
    impactDescriptions: {
      department: 'Group membership updates',
      location: 'Distribution list updates',
      email: 'Account update',
    },
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: 'code',
    connectionType: 'api_push',
    description: 'Code repositories',
    triggeredBy: ['department', 'team', 'githubUsername'],
    impactDescriptions: {
      department: 'Team membership updates',
      team: 'Repository access updates',
    },
  },
  {
    id: 'okta',
    name: 'Okta',
    icon: 'shield',
    connectionType: 'webhook',
    description: 'Identity and access management',
    triggeredBy: ['department', 'team', 'level', 'employmentStatus'],
    impactDescriptions: {
      department: 'Application access review',
      level: 'Permission level update',
      employmentStatus: 'Access status update',
    },
  },
  {
    id: 'workday',
    name: 'Workday',
    icon: 'briefcase',
    connectionType: 'polling', // They pull from us
    description: 'HR information system',
    triggeredBy: ['*'], // Syncs everything
    impactDescriptions: {
      default: 'Data sync on next scheduled pull',
    },
  },
]

// Connection type descriptions for UI
export const CONNECTION_TYPE_DESCRIPTIONS = {
  api_push: {
    confirmed: 'Sent & confirmed',
    confirmedDescription: 'Rippling pushed the update and the app confirmed it received it.',
    pending: 'Sent, awaiting confirmation',
    pendingDescription: 'Rippling sent the update but hasn\'t heard back yet.',
    error: 'Sent, issue(s)',
    errorDescription: 'Rippling tried to send the update but something went wrong. Retrying automatically.',
  },
  webhook: {
    confirmed: 'Sent & confirmed',
    confirmedDescription: 'Rippling fired the webhook, delivery confirmed.',
    pending: 'Sent, awaiting confirmation',
    pendingDescription: 'Webhook fired, processing status unknown.',
    error: 'Delivery failed',
    errorDescription: 'Webhook delivery failed, retrying.',
  },
  polling: {
    confirmed: 'Synced',
    confirmedDescription: 'App pulled the latest data.',
    pending: 'Pending sync',
    pendingDescription: 'This app pulls updates from Rippling on its own schedule. Changes are ready.',
    error: 'Sync pending',
    errorDescription: 'Awaiting next scheduled sync.',
  },
}

// Calculate downstream impact for a set of attribute changes
export const calculateDownstreamImpact = (changedAttributes, employeeCount = 1) => {
  const impact = {
    ripplingApps: [],
    connectedApps: [],
  }

  // Check Rippling apps
  for (const app of RIPPLING_APPS) {
    const triggeredAttrs = changedAttributes.filter(attr => app.triggeredBy.includes(attr))
    if (triggeredAttrs.length > 0) {
      const descriptions = triggeredAttrs
        .map(attr => app.impactDescriptions[attr])
        .filter(Boolean)

      impact.ripplingApps.push({
        ...app,
        triggeredBy: triggeredAttrs,
        descriptions,
        employeeCount,
      })
    }
  }

  // Check connected apps
  for (const app of CONNECTED_APPS) {
    const triggeredAttrs = app.triggeredBy.includes('*')
      ? changedAttributes
      : changedAttributes.filter(attr => app.triggeredBy.includes(attr))

    if (triggeredAttrs.length > 0) {
      const descriptions = triggeredAttrs
        .map(attr => app.impactDescriptions[attr] || app.impactDescriptions.default)
        .filter(Boolean)
        .filter((v, i, a) => a.indexOf(v) === i) // unique

      impact.connectedApps.push({
        ...app,
        triggeredBy: triggeredAttrs,
        descriptions,
        employeeCount,
        connectionTypeInfo: CONNECTION_TYPE_DESCRIPTIONS[app.connectionType],
      })
    }
  }

  return impact
}

// Generate mock monitoring status for a committed bulk change
export const generateMonitoringStatus = (bulkChange) => {
  return {
    employeeGraph: {
      status: 'complete',
      message: 'All changes applied',
      employeeCount: bulkChange.employeeCount,
    },
    ripplingApps: RIPPLING_APPS.map(app => ({
      ...app,
      status: Math.random() > 0.1 ? 'complete' : 'scheduled',
      statusMessage: Math.random() > 0.1 ? 'Updated' : `Will process in next ${app.name.toLowerCase()} run`,
      details: `${Math.floor(bulkChange.employeeCount * Math.random() * 0.5)} updates processed`,
    })),
    connectedApps: CONNECTED_APPS.map(app => {
      const rand = Math.random()
      let status, statusMessage
      if (rand > 0.9) {
        status = 'error'
        statusMessage = `Sent, 1 issue`
      } else if (rand > 0.2) {
        status = 'complete'
        statusMessage = CONNECTION_TYPE_DESCRIPTIONS[app.connectionType].confirmed
      } else {
        status = 'pending'
        statusMessage = CONNECTION_TYPE_DESCRIPTIONS[app.connectionType].pending
      }

      return {
        ...app,
        status,
        statusMessage,
        details: `${Math.floor(bulkChange.employeeCount * Math.random() * 0.3)} updates`,
      }
    }),
  }
}

export default {
  RIPPLING_APPS,
  CONNECTED_APPS,
  CONNECTION_TYPE_DESCRIPTIONS,
  calculateDownstreamImpact,
  generateMonitoringStatus,
}
