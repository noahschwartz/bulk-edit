import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useBulkChanges } from '../context/BulkChangeContext'

export default function CreateBulkChange() {
  const navigate = useNavigate()
  const { createBulkChange } = useBulkChanges()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name.trim()) {
      setError('Name is required')
      return
    }

    const newBulkChange = createBulkChange({
      name: name.trim(),
      description: description.trim(),
    })

    navigate(`/builder/${newBulkChange.id}`)
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Bulk Changes
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">Create Bulk Change</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-500 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
              }}
              placeholder="e.g., Q1 2026 Comp Cycle"
              className={`
                w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                ${error ? 'border-red-300' : 'border-gray-300'}
              `}
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-500 mb-2">
              Description <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe the purpose of this bulk change..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Create Bulk Change
            </button>
            <Link
              to="/"
              className="px-6 py-3 text-gray-700 font-medium hover:text-gray-900"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm text-blue-800 font-medium">Transaction Semantics</p>
            <p className="text-sm text-blue-700 mt-1">
              All changes in a bulk change will be applied together as a single transaction.
              If any change cannot be applied, none will be applied.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
