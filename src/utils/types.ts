export interface ModerationCase {
  id?: string,
  reason?: string,
  moderator?: string,
  user?: string,
  action?: 'kick' | 'ban' | 'tempban',
  timestamp?: Date
}

export interface Warning {
  id?: string,
  reason?: string,
  moderator?: string,
  user?: string,
  timestamp?: Date
}

export interface Note {
  id?: string,
  contents?: string,
  user?: string,
  author?: string,
  timestamp?: Date
}
