# Hordes.io — prototype 07

Play: https://contactonodo3d-byte.github.io/hordes-io/

GitHub Actions runs the tests and publishes the static build to GitHub Pages on each push to `main`.
A lightweight top-down horde game, using Canvas 2D and procedural sprites with no external assets or dependencies.

## Run
Requires Node.js 18+. From this folder:
```sh
npm start
```
Open http://127.0.0.1:4173. `npm test` runs the simulation checks; `npm run build` produces a static `dist/` folder. The development server listens only locally. The build is approximately 151 KB.

## Play
Choose Vikings, Romans, Samurai, Spartans, Mongols or Undead. Mouse directs the army; WASD/arrows also work. On touch, hold and drag from the initial touch point. Escape or the pause button pauses, as does switching windows.

Start with a faction ruler and three warriors. Cloaked wanderers and masked bandits recruit two warriors. A single provisions hamper represents all food. Food heals up to four leader HP and two front-warrior HP, refreshes a twelve-second +15% damage bonus, and gives five score; it does not add soldiers. Fifty recruits surround the starting area for quick early progression.

Overlapping armies fight automatically. Deeper overlap deals more damage, warriors die before the leader, and casualties join the attacker after a short local fade instead of flying orbs. Eliminating a horde grants 100 points and a conquest. Every third conquest gives double recruitment for 35 seconds. Horses and wagons grant +45% speed for 18 seconds and switch troops and rulers to mounted sprites.

Villages require a 12-second uncontested assault and reward 200 recruits for armies under 50, 120 for armies of 50–199, and 20 for armies of 200 or more; ×2 growth doubles these rewards. Leaving decays progress, new assailants reset it, and rivals contest it. Roaming nobles give eight recruits. Rare encounters appear on the minimap, expire after 90 seconds and can spawn every 55–80 seconds, with at most four present.

**Growth has no gameplay cap.** The full army count determines damage, score and ranking. At large sizes, up to 95 visible warriors plus the ruler represent the army as squads. Footprints have no size cap; only sprite count is limited. The camera zooms out as the army expands, and movement speed has a floor. Rounds end on death or eliminating every rival, with final absorption completed before victory results. The elapsed clock does not end the match at seven minutes. Play Again starts immediately.

First place gets a crown and faction-specific title. Leaderboard rows list active opponents and village assaults. Dark blood, slate skeletons and broken crowns remain on battlefields, subject to a 1,800-mark rendering budget.

## Beginner progression
Auto uses Easy for the first completed match, Medium for the second, then Hard. Completion is saved locally on death or total conquest. Abandoned matches do not advance difficulty. Levels can be selected manually; Restart beginner progression returns Auto to Easy. Storage failure falls back to page-session progression.

Easy bots start smaller, move at 65% speed, gather every 0.7 seconds, deal half damage and do not hunt the player. Medium uses 82% speed, 0.45-second gathering and 75% damage. Hard keeps competitive behavior. Protection lasts 50/35/25 seconds. Player pickup cadence is 0.075 seconds.

## Architecture and performance
- `army.js` stores the count and leader/front-line health in constant-size state. Bulk damage and recruitment avoid per-soldier allocation or loops. Large casualties produce one exact reward bundle and bounded cosmetic effects.
- `config.js` holds balance, faction data and representative formations.
- `simulation.js` handles bots, contact combat, assault progress, rewards and bonuses independently of the DOM. `progression.js` handles difficulty and local completion state.
- `spatial.js` indexes nearby resources, rebuilt five times per second with immediate insertion and removal marks.
- `renderer.js` caches faction ruler idle/walk/attack frames, mounted forms, soldier frames, item sprites and debris. Rulers draw last. Troop footsteps animate only while moving; weapon swings replace whole-body wobble.
- `main.js` handles input, match states and HUD. Simulation runs at 30 Hz with interpolated rendering. Pixel density is capped at 1.5×, individual sprites are culled, effects are bounded and unchanged HUD rows are reused.

Factions share gameplay stats. Terrain is decorative. Multiplayer, monetization and saved matches are future work; a server implementation would need stable entity IDs, authoritative simulation, snapshots and interpolation. Current art is procedural prototype art.

## Validation
43 tests cover recruitment, difficulty progression, bonuses, combat, assault contest/expiry, bounds, death, total conquest, final absorption and scalable army state. Tests exercise armies above one million soldiers and huge casualties without unbounded objects or visual effects.

Local browser checks, excluded from the build:
- `/tests/leaders.html`: six ruler foot/mounted animations and food/recruit icons.
- `/tests/visual.html`: controlled mounted battle and village assault.
- `/tests/performance.html`: 13 armies of one million soldiers each, represented by at most 1,248 sprites, comparing cached rendering against repeated shape drawing.

Mobile hardware and extended balance still need testing. Render submission timing does not guarantee end-to-end FPS.

Large-area resource queries visit only occupied spatial buckets rather than iterating millions of empty cells. Representative formations spread across the entire growing footprint.

## Facing and audio
Characters remain upright and switch between separately cached right- and left-facing profile sprites. Vertical movement preserves the last horizontal facing. Footsteps, mounted gallop and attack poses animate without rotating the character body.

Sound starts on Play, respecting browser audio restrictions. A procedural original minor-key plucked melody, bass and soft percussion loop during gameplay. Pickups, battle impacts, horses, growth bonuses, village captures, conquests, victory and defeat have distinct synthesized effects. Music pauses with gameplay; Sound offers independent music/effects sliders and a mute switch, saved locally. Effects have cooldowns and a 48-voice limit. No external audio files or downloads are needed. Browsers without Web Audio still run the game silently. `/tests/audio.html` checks real browser audio unlock and nonzero output signal; speaker volume remains device-controlled.

## Pause menu and languages
Pause opens the main menu with Resume and New Match. Resume preserves the army, arena and elapsed time; faction and difficulty choices apply to the next match. English, Español and Português buttons switch menu, HUD, leaderboard, encounter labels, results and sound controls immediately. The language choice is saved locally, with English as fallback. Translation tests check matching keys and saved preference handling. Browser verification confirmed all three languages and paused-state preservation across language changes and Resume.

## Villages and fallen kings
Village art and capture radius are five times larger (180 world-unit radius). Reward tier is measured at capture, before adding recruits. The twelve-second contested assault still applies. Moving rulers below 20% of their largest army (or four troops) show frantic steps, worried faces and sweat for eight seconds after a casualty. Fallen kings collapse over 1.4 seconds without rotating their character body and leave a broken crown. A top-center crown/death indicator announces fallen hordes; player death keeps the indicator visible and delays results until the collapse finishes. Cached frames and bounded notifications preserve the rendering budget.

## Bitfolk pilot art integration
The five supplied SVGs are copied byte-for-byte into assets/. Viking warrior and leader use cached derived frames; pine trees and rocks replace procedural map decoration, and the Town Hall represents village encounters. Original source files remain unchanged. All five assets load before the first game frame, then rasterize once into bounded bitmap caches. Walking uses alternating boot offsets; battles use short upright lunges; retreat adds sweat and panic marks; falling compresses the pose without rotation. Mounted states combine the new character upper body with the existing procedural horse style. These are lightweight adaptations of static illustrations, not fully authored skeletal animations. Other factions retain their procedural sprites. Build includes every SVG and its loader. The town retains timed/contested capture and reward tiers.

## Random worlds
Each new match creates a fresh seeded 6,000 × 6,000 world with 48 forest regions, scattered rocks, softly shaded grass and open land clearings. The starting area stays dry and clear. Bot starting positions are randomized away from the player; provisions, recruitment, horse/wagon bonuses and rare encounters use randomized land placement, with a mix of clustered supplies and scattered resources. Village sites avoid stream banks and other villages. Terrain is decorative. Streams and bridges are currently disabled pending a visual redesign. Pause/Resume retains the current map; Play/New Match/Play Again generate a new one. The minimap shows forest regions.

Terrain uses a bounded 48-tile bitmap cache (384 px tiles representing 512 world units), with a separate 1536 px overview when the camera zooms far out. Forests are baked behind troops so units and items remain visible. Seeds reproduce terrain for testing. Tests cover seed variation, dry spawn zones, 15 generated worlds, land item placement and randomized bot starts.

## Collection clarity and menu
Player collection sweeps the traveled path, prioritizes the nearest eligible items, and collects bounded batches of 6–32 per pickup interval instead of a single object. Bots retain their difficulty-specific cadence. Resource removal compacts the existing array so spatial indexing is not rebuilt every frame. Provisions use one shared icon; recruitment has a mint ring, while casualties use muted slate skeletons without collectible-like shields/weapons. Food healing and strength never resurrect troops or stack the damage multiplier. Enemy casualty rewards show a short mint transfer stroke plus a merged soldier count and enemy name; losses show red notifications. Pickup confirmation shrinks and fades locally, with no flying golden orbs. Food and soldier sounds use quieter low sine tones and cooldowns. The menu uses compact cards, explicit food rules, responsive settings and a scroll-safe panel; sound controls move inside the menu to avoid covering it. Browser QA checks desktop and short mobile layouts.
