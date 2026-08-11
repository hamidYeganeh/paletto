export enum NotificationType {
  ORDER_UPDATE = 'order_update',
  COMMISSION_UPDATE = 'commission_update',
  SOCIAL_FOLLOW = 'social_follow',
  SOCIAL_LIKE = 'social_like',
  SOCIAL_COMMENT = 'social_comment',
  EXHIBITION = 'exhibition',
  SYSTEM = 'system',
}

export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum ReportStatus {
  OPEN = 'open',
  REVIEWING = 'reviewing',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed',
}

export enum ReportReason {
  SPAM = 'spam',
  INAPPROPRIATE = 'inappropriate',
  COPYRIGHT = 'copyright',
  HARASSMENT = 'harassment',
  OTHER = 'other',
}

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
}

export enum CollectionVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}
