'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function VotePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const token = params.token as string
  const response = searchParams.get('response')
  
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [poll, setPoll] = useState<any>(null)
  const [voted, setVoted] = useState(false)

  useEffect(() => {
    if (token && response) {
      handleVote()
    }
  }, [token, response])

  const handleVote = async () => {
  try {
    // Find the poll response record by token
    const { data: pollResponse, error: responseError } = await supabase
      .from('poll_responses')
      .select('*, polls(*)')
      .eq('response_token', token)
      .single()

    if (responseError || !pollResponse) {
      setMessage('Invalid vote link or poll not found.')
      setLoading(false)
      return
    }

    // Check if poll is still active
    if (pollResponse.polls.status === 'closed') {
      setMessage('This poll has been closed and no longer accepts votes.')
      setPoll(pollResponse.polls)
      setLoading(false)
      return
    }

    // Check if poll has expired
    if (pollResponse.polls.expires_at && new Date(pollResponse.polls.expires_at) < new Date()) {
      setMessage('This poll has expired and no longer accepts votes.')
      setPoll(pollResponse.polls)
      setLoading(false)
      return
    }

    let voteMessage = ''
    let wasUpdate = false
    
    // Check if already voted
    if (pollResponse.response && pollResponse.responded_at) {
      if (pollResponse.response === response) {
        // Same vote - just confirm
        setMessage(`Your vote "${pollResponse.response}" is already recorded for this poll.`)
        setPoll(pollResponse.polls)
        setVoted(true)
        setLoading(false)
        return
      } else {
        // Different vote - will update
        voteMessage = `Your vote has been changed from "${pollResponse.response}" to "${response}".`
        wasUpdate = true
      }
    } else {
      // New vote
      voteMessage = `Thank you! Your vote "${response}" has been recorded.`
    }

    // Record/update the vote
    const { error: updateError } = await supabase
      .from('poll_responses')
      .update({
        response: response,
        responded_at: new Date().toISOString(),
        updated_by: null, // Clear admin update marker since this is member-initiated
        updated_at: wasUpdate ? new Date().toISOString() : null
      })
      .eq('response_token', token)

    if (updateError) {
      setMessage('Error recording your vote. Please try again.')
      setLoading(false)
      return
    }

    // Only increment count for new votes, not updates
    if (!wasUpdate) {
      const { error: countError } = await supabase.rpc('increment_poll_responses', {
        poll_id: pollResponse.poll_id
      })

      if (countError) {
        console.warn('Failed to update poll count:', countError)
      }
    }

    setMessage(voteMessage)
    setPoll(pollResponse.polls)
    setVoted(true)
    setLoading(false)

  } catch (error) {
    setMessage('An error occurred while processing your vote.')
    setLoading(false)
  }
}

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Recording your vote...</p>
        </div>
      </div>
    )
  }

    return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
            {voted ? (
            <div className="text-green-600 mb-4">
                <svg className="mx-auto h-16 w-16" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            </div>
            ) : (
            <div className="text-red-600 mb-4">
                <svg className="mx-auto h-16 w-16" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
            </div>
            )}
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {voted ? 'Vote Recorded!' : 'Vote Error'}
            </h1>
            
            {poll && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h2 className="font-semibold">{poll.title}</h2>
                <p className="text-sm text-gray-600">{poll.question}</p>
                {poll.status === 'active' && (
                <p className="text-xs text-blue-600 mt-2">
                    You can change your vote anytime by clicking a different option in the email.
                </p>
                )}
            </div>
            )}
            
            <p className="text-gray-600">{message}</p>
            
            {voted && (
            <div className="mt-6">
                <a 
                href="/" 
                className="text-blue-600 hover:text-blue-800 text-sm"
                >
                ← Back to home
                </a>
            </div>
            )}
        </div>
        </div>
    </div>
  )
}