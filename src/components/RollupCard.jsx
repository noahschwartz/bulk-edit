import { COMMON_ACTIONS } from '../data/attributes'
import { calculateDownstreamImpact } from '../data/downstreamApps'

const ACTION_ICONS = {
  update_compensation: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  change_department: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  change_manager: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  reassign_location: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  update_title_level: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  change_team: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  update_schedule: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}


const formatCurrency = (value) => {
  if (typeof value !== 'number') return value
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function RollupCard({ action, bulkChange, isSelected, onClick }) {
  const actionDef = COMMON_ACTIONS.find(a => a.id === action.type)
  const icon = ACTION_ICONS[action.type]

  // Calculate downstream impact
  const changedAttrs = actionDef?.attributes || action.attributes || []
  const impact = calculateDownstreamImpact(changedAttrs, action.employeeCount)

  return (
    <div
      onClick={onClick}
      className={`rounded-lg border border-gray-200 bg-white cursor-pointer transition-all hover:border-gray-300 hover:shadow-sm ${
        isSelected ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
      }`}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 text-gray-600">
              {icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{action.name}</h3>
              <p className="text-sm text-gray-500">{action.employeeCount} employees</p>
            </div>
          </div>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Summary Stats */}
        {action.summary && Object.keys(action.summary).length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm">
            {/* Compensation */}
            {action.type === 'update_compensation' && action.summary.minChange !== undefined && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-500">Range</p>
                  <p className="font-medium text-gray-900">
                    {action.summary.minChange >= 0 ? '+' : ''}{formatCurrency(action.summary.minChange)} to {action.summary.maxChange >= 0 ? '+' : ''}{formatCurrency(action.summary.maxChange)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Median</p>
                  <p className="font-medium text-gray-900">{action.summary.medianChange >= 0 ? '+' : ''}{formatCurrency(action.summary.medianChange)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Impact</p>
                  <p className="font-medium text-gray-900">{action.summary.totalAnnualImpact >= 0 ? '+' : ''}{formatCurrency(action.summary.totalAnnualImpact)}/yr</p>
                </div>
              </div>
            )}

            {/* Department & Team transfers */}
            {(action.type === 'change_department' || action.type === 'change_team') && action.summary.transfers && (
              <div className="space-y-1">
                {Object.entries(action.summary.transfers).map(([transfer, count]) => (
                  <div key={transfer} className="flex items-center justify-between">
                    <span className="text-gray-700">{transfer}</span>
                    <span className="font-medium text-gray-900">{count} employees</span>
                  </div>
                ))}
              </div>
            )}

            {/* Title & Level */}
            {action.type === 'update_title_level' && (
              <div className="space-y-1">
                {action.summary.promotions > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Promotions</span>
                    <span className="font-medium text-gray-900">{action.summary.promotions}</span>
                  </div>
                )}
                {action.summary.levelChange && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Level</span>
                    <span className="font-medium text-gray-900">{action.summary.levelChange}</span>
                  </div>
                )}
                {action.summary.titleChanges > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Title changes</span>
                    <span className="font-medium text-gray-900">{action.summary.titleChanges}</span>
                  </div>
                )}
              </div>
            )}

            {/* Location */}
            {action.type === 'reassign_location' && (
              <div className="space-y-1">
                {action.summary.fromLocation && (
                  <div>
                    <span className="text-gray-500">Location: </span>
                    <span className="font-medium text-gray-900">
                      {action.summary.fromLocation} → {action.summary.toLocation}
                    </span>
                  </div>
                )}
                {action.summary.transfers && (
                  <div className="space-y-1">
                    {Object.entries(action.summary.transfers).map(([transfer, count]) => (
                      <div key={transfer} className="flex items-center justify-between">
                        <span className="text-gray-700">{transfer}</span>
                        <span className="font-medium text-gray-900">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Manager */}
            {action.type === 'change_manager' && action.summary.managerChanges && (
              <div className="space-y-1">
                {action.summary.oldManagers && (
                  <div>
                    <span className="text-gray-500">From: </span>
                    <span className="font-medium text-gray-900">{action.summary.oldManagers}</span>
                  </div>
                )}
                {action.summary.newManager && (
                  <div>
                    <span className="text-gray-500">To: </span>
                    <span className="font-medium text-gray-900">{action.summary.newManager}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Employees: </span>
                  <span className="font-medium text-gray-900">{action.summary.managerChanges}</span>
                </div>
              </div>
            )}

            {/* Schedule */}
            {action.type === 'update_schedule' && action.summary.scheduleChanges && (
              <div className="space-y-1">
                {action.summary.newType && (
                  <div>
                    <span className="text-gray-500">Type: </span>
                    <span className="font-medium text-gray-900">{action.summary.newType}</span>
                  </div>
                )}
                {action.summary.newArrangement && (
                  <div>
                    <span className="text-gray-500">Arrangement: </span>
                    <span className="font-medium text-gray-900">{action.summary.newArrangement}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Employees: </span>
                  <span className="font-medium text-gray-900">{action.summary.scheduleChanges}</span>
                </div>
              </div>
            )}

            {/* Fallback for custom or when only employeeCount */}
            {action.summary.employeeCount && !action.summary.minChange && !action.summary.transfers && !action.summary.promotions && !action.summary.managerChanges && !action.summary.scheduleChanges && !action.summary.fromLocation && (
              <div>
                <span className="text-gray-500">Employees: </span>
                <span className="font-medium text-gray-900">{action.summary.employeeCount}</span>
              </div>
            )}
          </div>
        )}

        {/* Downstream Impact Preview */}
        {(impact.ripplingApps.length > 0 || impact.connectedApps.length > 0) && (
          <div className="text-sm border-t border-gray-200/50 pt-3 mt-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Downstream Impact</p>
            <div className="space-y-1">
              {impact.ripplingApps.slice(0, 2).map(app => (
                <div key={app.id} className="flex items-center gap-2 text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  <span>{app.name}</span>
                  <span className="text-gray-400">—</span>
                  <span className="text-gray-500 truncate">{app.descriptions[0]}</span>
                </div>
              ))}
              {impact.connectedApps.slice(0, 2).map(app => (
                <div key={app.id} className="flex items-center gap-2 text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                  <span>{app.name}</span>
                  <span className="text-gray-400">—</span>
                  <span className="text-gray-500 truncate">{app.descriptions[0]}</span>
                </div>
              ))}
              {(impact.ripplingApps.length + impact.connectedApps.length > 4) && (
                <p className="text-gray-400 text-xs">
                  +{impact.ripplingApps.length + impact.connectedApps.length - 4} more systems affected
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
