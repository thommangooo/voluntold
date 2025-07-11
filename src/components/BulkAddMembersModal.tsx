'use client'
import { useState, useRef } from 'react'
import { supabase } from '../lib/supabase'

interface BulkAddMembersModalProps {
  tenantId: string
  onClose: () => void
  onMembersAdded: () => Promise<void> | void
}

export default function BulkAddMembersModal({ tenantId, onClose, onMembersAdded }: BulkAddMembersModalProps) {
  const [inputMethod, setInputMethod] = useState<'csv' | 'manual'>('manual')
  const [manualEmails, setManualEmails] = useState('')
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [successCount, setSuccessCount] = useState(0)
  const [errorCount, setErrorCount] = useState(0)
  const [skipCount, setSkipCount] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetForm = () => {
    setManualEmails('')
    setCsvFile(null)
    setSuccessCount(0)
    setErrorCount(0)
    setSkipCount(0)
    setIsComplete(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setSuccessCount(0)
    setErrorCount(0)
    setSkipCount(0)
    setIsComplete(false)

    try {
      if (inputMethod === 'manual') {
        await processManualEmails()
      } else {
        await processCSVFile()
      }
      
      setIsComplete(true)
      await onMembersAdded()
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const processManualEmails = async () => {
    const emails = manualEmails
      .split(',')
      .map(email => email.trim())
      .filter(email => email.length > 0)

    if (emails.length === 0) {
      setMessage('Please enter at least one valid email address')
      return
    }

    // Get existing emails to check for duplicates
    const { data: existingMembers, error: existingError } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('tenant_id', tenantId)

    if (existingError) throw existingError

    const existingEmails = new Set(existingMembers?.map(m => m.email.toLowerCase()) || [])

    let successes = 0
    let errors = 0
    let skips = 0

    for (const email of emails) {
      try {
        // Skip if email already exists
        if (existingEmails.has(email.toLowerCase())) {
          skips++
          continue
        }

        const { error } = await supabase
          .from('user_profiles')
          .insert([{
            tenant_id: tenantId,
            email: email,
            first_name: '',
            last_name: '',
            role: 'member',
            id: crypto.randomUUID()
          }])

        if (error) throw error
        successes++
      } catch (error) {
        console.error(`Error adding member ${email}:`, error)
        errors++
      }
    }

    setSuccessCount(successes)
    setErrorCount(errors)
    setSkipCount(skips)
    setMessage(`Processed ${emails.length} emails. Success: ${successes}, Skipped (duplicates): ${skips}, Errors: ${errors}`)
  }

  const processCSVFile = async () => {
    if (!csvFile) {
      setMessage('Please select a CSV file')
      return
    }

    // Get existing emails to check for duplicates
    const { data: existingMembers, error: existingError } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('tenant_id', tenantId)

    if (existingError) throw existingError

    const existingEmails = new Set(existingMembers?.map(m => m.email.toLowerCase()) || [])

    const text = await csvFile.text()
    const lines = text.split('\n').filter(line => line.trim().length > 0)
    
    // Skip header row if it exists
    const dataRows = lines[0].includes('@') ? lines : lines.slice(1)
    
    let successes = 0
    let errors = 0
    let skips = 0

    for (const line of dataRows) {
      const [email, firstName, lastName, phone, position, address] = line.split(',').map(item => item.trim())
      
      if (!email || !email.includes('@')) continue

      try {
        // Skip if email already exists
        if (existingEmails.has(email.toLowerCase())) {
          skips++
          continue
        }

        const { error } = await supabase
          .from('user_profiles')
          .insert([{
            tenant_id: tenantId,
            email: email,
            first_name: firstName || '',
            last_name: lastName || '',
            phone_number: phone || null,
            position: position || null,
            address: address || null,
            role: 'member',
            id: crypto.randomUUID()
          }])

        if (error) throw error
        successes++
      } catch (error) {
        console.error(`Error adding member ${email}:`, error)
        errors++
      }
    }

    setSuccessCount(successes)
    setErrorCount(errors)
    setSkipCount(skips)
    setMessage(`Processed ${dataRows.length} rows. Success: ${successes}, Skipped (duplicates): ${skips}, Errors: ${errors}`)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Bulk Add Members</h3>
          <button 
            onClick={() => {
              resetForm()
              onClose()
            }} 
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {isComplete ? (
          <div className="space-y-4">
            <div className={`p-4 rounded-md ${
              successCount > 0 ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'
            }`}>
              <p className="font-medium">Bulk add completed successfully!</p>
              <p className="mt-2">
                Added: {successCount} members<br />
                Skipped (duplicates): {skipCount}<br />
                Errors: {errorCount}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  resetForm()
                  onClose()
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Input Method</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="inputMethod"
                    checked={inputMethod === 'manual'}
                    onChange={() => setInputMethod('manual')}
                    className="mr-2"
                  />
                  Enter Emails
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="inputMethod"
                    checked={inputMethod === 'csv'}
                    onChange={() => setInputMethod('csv')}
                    className="mr-2"
                  />
                  Upload CSV
                </label>
              </div>
            </div>

            {inputMethod === 'manual' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Addresses (comma separated)
                </label>
                <textarea
                  value={manualEmails}
                  onChange={(e) => setManualEmails(e.target.value)}
                  rows={5}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="member1@example.com, member2@example.com, member3@example.com"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Members will be added with default settings. You can edit details later.
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CSV File Upload
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                  ref={fileInputRef}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  CSV format: email,first_name,last_name,phone,position,address
                </p>
              </div>
            )}

            {message && (
              <div className={`p-3 rounded-md ${
                successCount > 0 && errorCount === 0 ? 'bg-green-50 text-green-800' :
                errorCount > 0 ? 'bg-yellow-50 text-yellow-800' : 'bg-blue-50 text-blue-800'
              }`}>
                {message}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  resetForm()
                  onClose()
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || (inputMethod === 'csv' && !csvFile)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Add Members'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}