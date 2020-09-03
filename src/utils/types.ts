
export interface IJobAutoAssignUtil {
  /* autoassign members job using current info (settings, and crew) */
  assignJob(memberId: string): Promise<void>

  /* active service to listen to member added */
  activateService(): void
}
