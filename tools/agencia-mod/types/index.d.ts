export type RoleId = 'buscador' | 'analista' | 'desarrollador' | 'cm' | 'jefe'
export type LogEntry = { role: RoleId; text: string; at: number }
export type Office = { active: RoleId | null; activity: string; log: LogEntry[] }

declare module 'claude-code' {
  interface PluginState {
    'ceibo-hq': { office: Shaped<Office> }
  }
}
