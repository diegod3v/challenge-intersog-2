import React from 'react'
import { Crew } from '../../emulator/types'

export default function CrewTable (props: { crew: Crew }) {
  let { crew } = props
  crew = crew.sort(({ lastName: lastNameA }, { lastName: lastNameB }) =>
    lastNameA > lastNameB ? 1 : lastNameA < lastNameB ? -1 : 0
  )
  return (
    <table>
      <tbody>
        {crew.map((member) => (
          <tr key={member.id}>
            <td>{member.id}</td>
            <td>
              {member.lastName}, {member.firstName}
            </td>
            <td>
              <span className={member.job}>{member.job}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
