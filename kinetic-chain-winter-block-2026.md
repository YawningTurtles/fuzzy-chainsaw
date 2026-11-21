# Kinetic Chain Program v3: Winter Consistency Block

**Owner:** Drew van Vliet
**Block:** Mon Nov 23, 2026 to Sun Mar 14, 2027 (16 weeks)
**Replaces:** the 6-day one-movement-group-per-day rotation (v2)
**Tracked by:** `tracker.html`, app spec v5 (storage `v: 5`)

> Filed as `kinetic-chain-winter-block-2026.md` rather than `-v3.md`, because the
> repo already holds `kinetic-chain-program-v2.md` and `kinetic-chain-program-v4.md`
> under the app's own numbering, and a file called v3 would read as older than
> both. The program's own name is unchanged: v3, Winter Consistency Block.

---

## 1. Why v3 exists

Tracker data from Sep 7 to Nov 21, 2026:

- Training happened in 10 to 12 day bursts (Sep 8 to 19, Oct 29 to Nov 7), each followed by a 2 to 3 week gap.
- Each restart reset loads, so strength numbers in November match September. Pull-ups went from 3 to 1 rep per set.
- The Monday session (cossack, t9090, add_iso) was skipped 4 of 6 times.
- Mobility was often completed on days the lift was skipped. Mobility is the sticky habit.
- Root cause (self-reported): an all-or-nothing morning. When the full session does not fit before 9:00, it gets skipped entirely.

Design response:

1. Fewer strength days (3 instead of 6), each with fixed content.
2. A 10-minute daily "floor" that always counts as a successful day.
3. Weekly success targets instead of daily streaks.
4. Re-entry after a gap keeps load and trims volume instead of cutting load.

No current knee pain. Sunday league is over. Wednesday soccer only through mid-March.

---

## 2. Weekly schedule

| Day | Session | Target time |
|-----|---------|-------------|
| Mon | Floor + Strength A (Lower) | 10 + 25 min |
| Tue | Floor | 10 min |
| Wed | Floor (morning) + Soccer (evening) | 10 min |
| Thu | Floor + Strength B (Upper + Core) | 10 + 20 min |
| Fri | Floor | 10 min |
| Sat | Floor (extended) + Strength C (Lower) | 15 + 25 min |
| Sun | Floor | 10 min |

Rules:
- No loaded lower-body work on Thursday (day after soccer).
- Strength A and C both train single-leg knee-dominant and hinge patterns, so each lower-body pattern gets 2 exposures per week.

---

## 3. Daily Floor (10 min)

Done every day, in order, no rest between items. Shown in the app as one checklist with an optional "done" tick per item and one "Floor complete" button.

| # | Exercise | Dose | Key cue | Equipment |
|---|----------|------|---------|-----------|
| 1 | Banded talar-glide knee-to-wall rocks | 15 left, 10 right | Heel down, knee tracks over 2nd toe | Band, wall |
| 2 | Right big toe (MTP) mobilization | 10 reps x 3 sec hold, then 1 x 30 sec extension hold | Stabilize metatarsal head, push toe straight up | Hands |
| 3 | 90/90 active transitions, no hands + end-range lift-offs | 8 transitions, then 5 lift-offs per side | Tall spine, lift back knee from floor at end range | Mat |
| 4 | Half-kneeling hip flexor stretch with PPT + overhead reach | 45 sec per side | Posterior pelvic tilt first, then reach | Mat |
| 5 | Cossack rock-back | 8 per side | Heel down on the bent leg, chest up | Mat |

**Saturday extended floor (15 min):** items 1 to 5, plus foam roll quads/rectus femoris 60 sec per side and adductors/lateral hip 60 sec per side.

**Optional, any day:** bonus pull-ups and push-ups through the work day. See section 4a.

---

## 4. Strength sessions

Default effort: RIR 2 on every working set. Rest 60 to 90 sec between sets, or superset as listed.

### Strength A: Lower (Monday, 25 min)

| Movement ID | Exercise | Sets x Reps | Tempo | Start load | Cue |
|-------------|----------|-------------|-------|------------|-----|
| `bss` | Bulgarian split squat | 3 x 8/side | 3-1-1 | 10 lb/hand | Knee over 2nd toe, no medial collapse |
| `db_rdl` | DB Romanian deadlift | 3 x 8 | 3-0-1 | 25 lb | Hips back, neutral spine |
| `copenhagen` | Copenhagen plank, short lever (knee on bench) | 2 x 6/side | 3 sec eccentric | Bodyweight | Hips stacked, body straight |
| `sl_calf` | Single-leg calf raise | 2 x 12/side | 2-1-2 | Bodyweight | Full range, push through big toe |

Superset pairs: `bss` + `copenhagen`, then `db_rdl` + `sl_calf`.

### Strength B: Upper + Core (Thursday, 20 min)

| Movement ID | Exercise | Sets x Reps | Tempo | Start load | Cue |
|-------------|----------|-------------|-------|------------|-----|
| `pullup` | Pull-up | 3 x (max minus 2) | 2-0-1 | Bodyweight | Full hang to chin over bar |
| `db_pullover` | DB pullover | 3 x 10 | 3-0-1 | 25 lb | Ribs down, low back flat on bench |
| `deadbug` | Dead bug with band | 3 x 8/side | Slow | Band | Low back pressed into floor |
| `plank_ppt` | Plank with posterior pelvic tilt | 3 x 40 sec | Hold | Bodyweight | Squeeze glutes, tuck pelvis |

Superset pairs: `pullup` + `deadbug`, then `db_pullover` + `plank_ppt`.

If max pull-ups are 3 or fewer, use 3 x 3 with a 3-sec eccentric (jump to top, lower slowly) and log rung "Eccentric".

### Strength C: Lower (Saturday, 25 min)

| Movement ID | Exercise | Sets x Reps | Tempo | Start load | Cue |
|-------------|----------|-------------|-------|------------|-----|
| `cossack` | Goblet Cossack squat | 3 x 8/side | 3-1-1 | 15 lb goblet | Heel down, sit into the hip |
| `nordic` | Nordic curl, hands assisting through range | 2 x 5 | Slowest possible lowering | Bodyweight | Hips extended, lower as one unit |
| `spanish` | Spanish squat | 3 x 30 sec | Hold | Heavy band | Shins vertical, sit back into the band |
| `sl_balance` | Single-leg balance, eyes closed | 3 x 30 sec/side | Hold | None | Soft knee, level pelvis |

Superset pairs: `cossack` + `sl_balance`, then `nordic` + `spanish`.

## 4a. Bonus movements (work-day sets)

Low-effort sets spread through the day. They are extras: they do not count toward the weekly win (section 9) and do not replace the Floor.

| Movement ID | Exercise | Dose per set | Sets per day | Days | Cue |
|-------------|----------|--------------|--------------|------|-----|
| `pullup_bonus` | Pull-up (see rungs) | See rungs | 3 to 5, at least 1 hour apart | 4 to 5 per week, never Thursday | Stop 4+ reps short of failure |
| `pushup_bonus` | Push-up | 50% of current max | 3 to 4, at least 1 hour apart | 5 per week | Body straight, chest to fist height |

Rungs:

| Movement | Rungs |
|----------|-------|
| `pullup_bonus` | Eccentric 2 reps (jump to top, 3 to 5 sec lower); then once strict max is 4+, sets of 50% of strict max |
| `pushup_bonus` | Sets of 50% max at 1-0-1 tempo; then same reps at 3-0-1 tempo; then retest max and recalculate 50% |

Rules:
- Never to failure. Every set should feel easy.
- Skip `pullup_bonus` on Thursday (Strength B day).
- Elbow or front-of-shoulder pain: app shows "Rest bonus sets 3 days" and hides the bonus buttons for 3 days.
- `pushup_max` is retested at each assessment (section 10). The app recalculates the 50% set size from it.
- `pullup_bonus` switches from eccentrics to 50% sets automatically when `pullup_max` at an assessment is 4 or more.

UI:
- Home screen shows two large one-tap counters ("+1 pull-up set", "+1 push-up set") with today's count and this week's total.
- One tap logs one set at the current prescribed dose with a timestamp. Long-press to edit reps or delete.
- Optional gentle reminder: if fewer than 2 sets logged by 2:00 pm on a bonus day, show a badge on the counter. No push notifications.

### Retired from v2

- `t9090` (90/90 transitions as a separate lift): moved into the Daily Floor, item 3. Keep its history; stop scheduling it.
- `add_iso` (adductor isometric): covered by `copenhagen` and `cossack`. Keep history; stop scheduling.

---

## 5. Progression rules

Per movement, using the existing `progress[movement].step / streak / history` structure:

1. **Advance one rung** when the athlete completes all prescribed sets at RIR 2 or more (easier) in **2 consecutive sessions** of that movement, AND the next-morning pain check is 0 or 1.
2. **Hold** if any set falls below RIR 2, or reps are missed.
3. **Drop one rung** if pain check is 3 or higher the next morning, or any set is logged with `sharp: true`.
4. Every advance needs a knee-tracking check (knee over 2nd toe, no medial collapse) on single-leg lower movements: `bss`, `cossack`, `sl_calf`.

Rung ladders:

| Movement | Rungs |
|----------|-------|
| `bss` | Bodyweight, 10 lb/hand, 15, 20, 25, 30 |
| `db_rdl` | 25, 30, 35, 40, 45, 50 lb (then single-leg B-stance at 25) |
| `copenhagen` | Short lever 2x6, short lever 3x8, long lever 2x6, long lever 3x8 |
| `sl_calf` | Bodyweight, 10, 15, 20, 25 lb |
| `pullup` | Eccentric 3x3, max minus 2, max minus 1, +5 lb (DB between feet) |
| `db_pullover` | 25, 30, 35, 40 lb |
| `deadbug` | Band, band + 3 sec hold, heavier band |
| `plank_ppt` | 40 sec, 45, 50, 60, then side planks added |
| `cossack` | 15, 20, 25, 30 lb goblet |
| `nordic` | Hands assisting, partial range unassisted, full range unassisted |
| `spanish` | Heavy band 30 sec, 45 sec, 60 sec |
| `sl_balance` | Eyes closed 30 sec, eyes closed on folded mat, eyes closed with head turns |

---

## 6. Re-entry after a gap (change from v2)

v2 behavior: after 14+ days off, cuts were set on every movement and load dropped.

v3 behavior:

| Gap since last strength session | First session back |
|---------------------------------|--------------------|
| 0 to 13 days | Normal session, normal load |
| 14 to 27 days | Same load as last performed, **minus 1 set** per movement. Next session normal. |
| 28+ days | Drop **one rung**, minus 1 set. Next session normal sets at that rung. |

Show a short banner on re-entry: "Welcome back. Same weight, one fewer set today."

---

## 7. Missed sessions

- Missed Monday: can be made up Tuesday. Not Wednesday (soccer).
- Missed Thursday: can be made up Friday.
- Missed Saturday: can be made up Sunday.
- Not made up by then: mark as skipped. Never stack two strength sessions on one day.
- The Floor is never made up. Each day stands alone.

---

## 8. The "never zero" rule

If the athlete opens the app on a strength day and taps "Short on time", the app swaps the day to **Floor only**, logs the strength session as `deferred` (eligible for the make-up rule in section 7), and counts the day as successful.

---

## 9. Weekly success metric (replaces daily streaks)

A week (Mon to Sun) is a **win** if:
- Floor completed on 5 or more of 7 days, AND
- 2 or more of the 3 strength sessions completed (including make-ups).

Home screen shows:
- Current week: floor count (x/7) and strength count (x/3)
- Win-week streak (consecutive win weeks)
- Total win weeks in the block (out of 16)

Do not show a daily streak counter.

---

## 10. Assessments (every 4 weeks, Saturday, before Strength C)

| Week | Date |
|------|------|
| 4 | Sat Dec 19, 2026 |
| 8 | Sat Jan 16, 2027 |
| 12 | Sat Feb 13, 2027 |
| 16 | Sat Mar 13, 2027 |

| Key | Test | Last value (Oct 31) |
|-----|------|---------------------|
| `ktw_l`, `ktw_r` | Knee-to-wall, inches | 7.5 / 8 |
| `cossack_depth` | Full depth with heel down (yes/no) | yes |
| `hop_l`, `hop_r` | Single-leg hop test | 43 / 35 |
| `pullup_max` | Max strict pull-ups, one set | new |
| `pushup_max` | Max push-ups, one set, full range | new (test once before week 1 to set the starting dose) |
| `pain_match`, `pain_24h` | Pain during match and at 24 hours (0 to 10) | 0 / 1 |

Flag in the UI:
- `ktw` asymmetry greater than 2 cm (0.8 in)
- Hop asymmetry greater than 10% (currently right is about 19% below left)

---

## 11. Morning flow

1. 7:30 to 7:50: dishwasher, dog, start coffee. Mat and band stay set up overnight.
2. 7:50: Floor, plus strength on Mon/Thu/Sat. Podcast or audiobook only during this block.
3. After: coffee, handwritten notes, breakfast.
4. Mon and Thu: optional 7:00 alarm to get the full session in without rushing.
5. Rule: mat before mug. No sitting down with coffee until the Floor is done.
6. Rule: after 8:15 with nothing started, do the Floor only and tap "Short on time".

---

## 12. Implementation notes for the tracker

- Storage `v: 4` migrates to `v: 5`. All `days`, `painChecks`, `assessments` and `progress.history` are kept.
- The existing `cuts` object is cleared on migration. Section 6 applies instead.
- New per-day fields: `floorComplete` (bool), `floorItems` (array of item ids ticked), `deferred` (bool), `bonusSets` (array of `{ movement, rung, reps, loggedAt }`).
- `pullup_bonus` and `pushup_bonus` have their own `progress` entries. They move only on assessment results (section 4a), not session streaks.
- On first launch after migration the app prompts once for a push-up max test.
- `mobilityComplete` from v2 maps to `floorComplete` for historical days.
- Day type values: `strength_a`, `strength_b`, `strength_c`, `floor`, `match`.
- Wednesday auto-types as `match`, with the match log (minutes, format 7-a-side, pain during) kept from v2.
- Kept: next-morning pain check prompt, JSON export/import, sound/vibrate settings, markdown export for review.
- No network requests, no external libraries, single HTML file.

### Implementation decisions worth recording

- **A rung can change the prescription, not just the load.** Copenhagen goes 2x6 to 3x8, the plank and Spanish squat lengthen their hold, and the first pull-up rung is 3x3 eccentrics. Rung entries therefore carry optional `sets` / `reps` / `hold` overrides, merged over the day's spec with the re-entry set cut applied last.
- **Streaks are derived, not incremented.** An advance needs two facts known a day apart: performance at session close, and the next morning's check. Each session stores whether it qualified on performance; the streak is then recomputed from that history plus the logged checks, so an undo, an edit or an import cannot corrupt it. Rung changes stay stored decisions, because an advance is confirmed by the athlete and a drop is a safety event worth keeping.
- **Only sessions performed at the current rung count toward leaving it**, matched on the rung recorded against each logged set. A date guard alone would credit a session done at the rung below if the advance happened the same day.
- **A session that has no next-morning check yet is "waiting", not banked and not broken.** The Progress tab shows what is waiting and offers to backfill the check, rather than assuming a score.
- The guided, audio-cued Floor runner from the previous block is kept as a second way in, alongside the checklist. The checklist is primary, per section 3.
