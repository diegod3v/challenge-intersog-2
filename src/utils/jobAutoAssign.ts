import { IJobAutoAssignUtil } from './types'
import { Job } from '../emulator/types'
import crewService from '../emulator/crewService'
import settingsService from '../emulator/settingsService'

class JobAutoAssignUtil implements IJobAutoAssignUtil {
  async assignJob (memberId: string): Promise<void> {
    const crewSummary = crewService.getSummary()
    const jobSplit = settingsService.getJobSplit()
    const JobPercentages = { ...jobSplit, [Job.unassigned]: 0 }
    const activeJobs = Object.keys(jobSplit)

    let isAssigned = false

    for (let i = 0; i < activeJobs.length; i++) {
      const job = activeJobs[i] as Job
      const desiredJobPercentage = JobPercentages[job]
      const currentJobPercentage = (crewSummary.counts[job] * 100) / (crewSummary.totalMembers - 1)
      if (currentJobPercentage < desiredJobPercentage) {
        await crewService.assignJob(memberId, job)
        isAssigned = true
        break
      }
    }

    // fallback
    if (!isAssigned) {
      const randomJob = activeJobs[Math.floor(Math.random() * (activeJobs.length))] as Job
      await crewService.assignJob(memberId, randomJob)
    }
  }

  activateService () {
    crewService.onMemberAdded((member) => {
      this.assignJob(member.id)
    })
  }
}

export default new JobAutoAssignUtil()
