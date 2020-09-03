import React, { useState, useEffect } from 'react'
import { Job } from '../../emulator/types'
import settingsService from '../../emulator/settingsService'

interface InputProps {
  job: Job
  onChange: (value: string) => void
  value: string
}

function Input (props: InputProps) {
  return <div className='settingInput'>
    <label>
      <span className={props.job}>{props.job}</span>
      <input
        name={props.job}
        onChange={event => {
          props.onChange(event.target.value)
        }}
        value={props.value}
        pattern='^[0-9]$'
        maxLength={3}
        required
      />
      %
    </label>
  </div>
}

function SettingsPage (props: {}) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [medic, setMedic] = useState('')
  const [engineer, setEngineer] = useState('')
  const [pilot, setPilot] = useState('')

  useEffect(() => {
    const unsub = settingsService.onJobSplit(
      (jobSplit) => {
        setMedic(String(jobSplit.medic))
        setEngineer(String(jobSplit.engineer))
        setPilot(String(jobSplit.pilot))
        setIsLoading(false)
      }
    )
    return unsub
  }, [])

  function handleSubmit () {
    const totalPercentage = [medic, engineer, pilot].map((val) => parseInt(val || '0'))
      .reduce((n, prev) => prev + n)

    if (totalPercentage === 100) {
      settingsService.setJobSplit({
        medic: parseInt(medic),
        engineer: parseInt(engineer),
        pilot: parseInt(pilot),
      })
      setError('')
    } else {
      setError('total job split must be 100%')
    }
  }

  if (isLoading) {
    return null
  }

  const validateSettingsField = (onFinish: React.Dispatch<React.SetStateAction<string>>) => (val: string) => {
    const isValid = val.match(/^[0-9]{0,3}$/)
    const parsedVal = parseInt(val || '0')
    if (isValid && parsedVal <= 100) {
      onFinish(val)
    }
  }

  return <>
    <Input job={Job.medic} onChange={validateSettingsField(setMedic)} value={medic} />
    <Input job={Job.engineer} onChange={validateSettingsField(setEngineer)} value={engineer} />
    <Input job={Job.pilot} onChange={validateSettingsField(setPilot)} value={pilot} />
    {error && <small style={{ color: 'red' }}>{error}</small>}<br />
    <button onClick={handleSubmit}>
      Apply
    </button>
  </>
}

export default SettingsPage
