async log(data: {
  actorId: string;
  action: string;
  targetId?: string;
  metadata?: any;
}) {
  return this.prisma.audit.create({
    data: {
      actorId: data.actorId,
      action: data.action,
      targetId: data.targetId,
      metadata: data.metadata,
    },
  });
}
