import {
  callContextMenuFunction,
  callMainMenuFunction,
} from './menus/convert-from-renderer'

// Functions the Main process can call in the Renderer process.
export const rendererFunctions = {
  callContextMenuFunction,
  callMainMenuFunction,
  setThemeInRenderer(
    _name: 'light' | 'dark',
    _setting: 'light' | 'dark' | 'system',
    _accentColour: string | null,
  ) {},
  push: async () => {},
  fetch() {},
  pull() {},
  goToChanges() {},
  goToCommits() {},
  goToBranches() {},
  createRepo() {},
  cloneRepo() {},
  openRepo() {},
  openRecentRepo: async (_repoPath: string) => {},
  closeRepo: () => {},
  showMissingGitDialog: () => {},
}

export type RendererFunctions = typeof rendererFunctions
