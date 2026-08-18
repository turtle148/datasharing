/** The slice of the Claude artifact runtime this page uses. */
interface ClaudeDownloads {
  save(request: { filename: string; data: Blob | ArrayBuffer | string }): Promise<{ status: 'saved' }>
}

interface ClaudeRuntime {
  use(name: 'downloads'): Promise<ClaudeDownloads | null>
}

interface Window {
  claude?: ClaudeRuntime
}
