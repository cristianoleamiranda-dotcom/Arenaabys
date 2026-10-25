# CLAUDE.md / AGENTS.md — Arenaabys (HeyGen & HeyGen Dev Ecosystem)

This workspace consolidates the official **HeyGen (`heygen-com`)** developer repositories under [`repos/`](./repos/) and **39 AI Agent Skills** under [`skills/`](./skills/) (linked in [`.claude/skills/`](./.claude/skills/) and [`.agents/skills/`](./.agents/skills/)).

## Installed Skill Suites

1. **HeyGen v3 Core Skills** (`repos/heygen-skills/` & `skills/heygen-*`):
   - `skills/heygen-avatar/SKILL.md` — Identity → Avatar V / Digital Twin → Voice → `AVATAR-<NAME>.md`
   - `skills/heygen-video/SKILL.md` — 7-stage Video Agent v3 production pipeline
   - `skills/heygen-translate/SKILL.md` — Video translation, lip-sync dubbing, and proofreads workflow

2. **HyperFrames Core & Motion Production Skills** (`repos/hyperframes/` & `skills/`):
   - Core: `hyperframes`, `hyperframes-cli`, `hyperframes-registry`, `media-use`, `remotion-to-hyperframes`, `figma`, `slideshow`
   - Motion & Production: `captions-overlay`, `changelog-video`, `cut-the-curve`, `motion-doctrine`, `oversized-cursor`, `seam-craft`

3. **HyperFrames Community Skills** (`repos/hyperframes-community-skills/` & `skills/`):
   - `camera-3d-captions`, `day-in-my-life`, `duo`, `p5-paint-animation`, `prod-by-claude`, `session-story`, `vox-explainer`, `x-posting-license`

4. **LiveAvatar Real-Time Interactive Avatar Skills** (`repos/liveavatar-agent-skills/` & `skills/liveavatar-*`):
   - `liveavatar-demo`, `liveavatar-integrate`, `liveavatar-debug`, `liveavatar-feedback`

5. **HeyGen v1 API & Media Skills** (`repos/heygen-skills-legacy/` & `skills/`):
   - `heygen`, `create-video`, `avatar-video`, `text-to-speech`, `video-translate`, `ai-video-gen`, `faceswap`, `visual-style`, `video-download`, `video-edit`, `video-understand`

## Core HeyGen v3 Runtime Contract

- **Shared Avatar State**: `heygen-avatar` writes `AVATAR-<NAME>.md` (plus `AVATAR-AGENT.md` / `AVATAR-USER.md` pointers) at the workspace root; `heygen-video` reads them automatically.
- **Transport Detection Ladder**:
  1. OpenClaw plugin (`video_generate` exposing `heygen/video_agent_v3`)
  2. HeyGen CLI (`HEYGEN_API_KEY` set and `heygen --version` exits 0)
  3. HeyGen Remote MCP (`mcp__heygen__*` tools from `https://mcp.heygen.com/mcp/v1/`)
  4. HeyGen CLI fallback (`heygen --version` exits 0)
- **Reference repositories**:
  - `repos/heygen-cli` — Official Go CLI source & command definitions
  - `repos/hyperframes` — Full HyperFrames monorepo (`packages/cli`, `core`, `engine`, `producer`, `studio`, `sdk`, `player`)
  - `repos/liveavatar-web-sdk`, `repos/liveavatar-sales-agent`, `repos/liveavatar-starter-livekit-agent-python`, `repos/liveavatar-gpt-live-demos` — Official LiveAvatar SDK and reference applications
  - `repos/openclaw-plugin-heygen` & `repos/n8n-integration-heygen-node` — Official agent/workflow plugins
