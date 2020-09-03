import React, { useState, useEffect } from 'react'
import { Crew } from '../../emulator/types'
import crewService from '../../emulator/crewService'
import CrewTable from './CrewTable'

function CrewPage (props: {}) {
  const [crew, setCrew] = useState<Crew>([])

  useEffect(() => {
    crewService.getCrew().then(crew => setCrew(crew))
    const onMemberAddedUnsubscriber = crewService.onMemberAdded((nextMember) => {
      setCrew((prev) => [...prev, nextMember])
    })

    const onMemberUpdatedUnsubscriber = crewService.onMemberUpdated((updatedMember) => {
      setCrew((prev) => {
        const copyPrev = [...prev]
        const currentUpdatedMemberIndex = copyPrev.findIndex((m) => m.id === updatedMember.id)
        copyPrev.splice(currentUpdatedMemberIndex, 1, updatedMember)
        return copyPrev
      })
    })

    return () => {
      onMemberAddedUnsubscriber()
      onMemberUpdatedUnsubscriber()
    }
  }, [])

  return <div className='tableContainer'>
    <CrewTable crew={crew} />
  </div>
}

export default CrewPage
