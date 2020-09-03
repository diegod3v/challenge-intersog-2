import React, { useState, useEffect } from 'react'
import operationService from '../emulator/operationService'
import crewService from '../emulator/crewService'
import { Stardate, Summary, Job } from '../emulator/types'

export default function StatusWidget (props: {}) {
  const [stardate, setStardate] = useState<Stardate>(operationService.getStardate())
  const [summary, setSummary] = useState<Summary>({
    totalMembers: 0,
    counts: {
      engineer: 0,
      medic: 0,
      pilot: 0,
      unassigned: 0,
    },
  })

  // rerender the widget periodically to update current stardate
  useEffect(
    () => {
      const intervalHandler = setInterval(
        () => setStardate(operationService.getStardate()),
        1000
      )
      return () => { clearInterval(intervalHandler) }
    },
    [] // setInterval only on mount/unmount
  )

  // subscribe to onSummary() to display grand total and totals for each job
  useEffect(
    () => {
      const unsub = crewService.onSummary(
        data => setSummary(data)
      )
      return unsub
    },
    [] // only on mount/unmount
  )

  return <div className='statusWidget'>
    <div className='summaryLine'>Stardate: {stardate}</div>
    {Object.keys(Job).map(job => (
      <div key={job} className={`summaryLine ${job}`}>{job}: {summary.counts[job as Job]}</div>
    ))}
    <div className='summaryLine'>total members: {summary.totalMembers}</div>
  </div>
}
