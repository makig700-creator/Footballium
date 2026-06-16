import { prisma } from './prisma'

export interface ActivityLogInput {
  userId: string
  action: string
  entity?: string
  entityId?: string
  metadata?: any
}

export async function logActivity({
  userId,
  action,
  entity,
  entityId,
  metadata
}: ActivityLogInput) {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        metadata: metadata || null,
      }
    })
  } catch (error) {
    console.error('Failed to log activity:', error)
  }
}
