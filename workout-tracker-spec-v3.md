# Workout Tracker Spec v3: Daily Single-Movement Rotation

Supersedes the twice-weekly session model in v2. Same tech constraints: self-contained local HTML, localStorage only, no network requests, no external hosting, no CDN links.

## What changed from v2

The strength program is no longer two consolidated sessions. It is one movement per day across five loading days, with two full recovery days. The tracker needs to shift from a "session" object to a "day" object.

- Remove: Tuesday and Friday session templates containing all three movements
- Add: per-day movement assignment, driven by a fixed weekly rotation
- Add: post-match set flag with its own RIR target and its own symptom attribution
- Keep: 6-week load progression table, next-morning symptom check, knee tracking pass/fail per set

## Weekly rotation (fixed)

| Day | Type | Movement | Load | Est. time |
|-----|------|----------|------|-----------|
| Mon | Recovery | none | n/a | mobility block only |
| Tue | Strength | Bulgarian split squat 3x8/side + eccentric step-down 2x8/side | 100% | ~12 min |
| Wed | Match + post | SL RDL, B-stance, 3x8/side | 85% | ~6 min |
| Thu | Recovery | none | n/a | mobility block only |
| Fri | Strength | Eccentric step-down 3x8/side | 100% | ~6 min |
| Sat | Strength + jog | Bulgarian split squat 3x8/side | 85% | ~6 min |
| Sun | Match + post | SL RDL, B-stance, 3x8/side | 100% | ~6 min |

Weekly exposure count: Bulgarian split squat 2, SL RDL 2, eccentric step-down 2.

Daily mobility block is unchanged and appears every day including recovery days. Right MTP mobilization stays daily, right side only.

## Rules the app enforces

### RIR target
- Standard days (Tue, Fri, Sat): RIR 2
- Post-match days (Wed, Sun): RIR 3

Display the target on the set entry screen. Do not offer a "to failure" option anywhere in the UI.

### Knee tracking gate
Every set logs a pass/fail on knee tracking over the second toe. A failed set ends the exercise for that day. The app should:
- Present the pass/fail toggle before the reps field, not after
- On fail, gray out remaining sets and show "Exercise complete for today"
- Record the failure against the load so it surfaces at the next progression decision

### Post-match window
Wed and Sun sets must be logged as post-match. The app should show a warning if the set is entered more than 90 minutes after the logged match end time, and should never present the strength prompt before a match is marked complete.

### Next-morning symptom check
Prompt each morning. Store the symptom score against the prior day's activity, and tag Monday and Thursday entries as "match + lift" rather than "lift" so the attribution is visible in review.

Load-lock logic: two consecutive failed symptom checks attributed to the same movement locks that movement's load. If the failures land on Monday or Thursday (match + lift days), the lock applies to the match-day sets first. Standard-day loads are only locked after standard-day failures.

## Data model additions

```
day: {
  date,
  type: "recovery" | "strength" | "match_post",
  movement: null | "bss" | "sl_rdl" | "step_down",
  loadPct: 85 | 100,
  sets: [{ setNumber, load, reps, rir, kneeTrackingPass }],
  matchEndTime: null | timestamp,
  mobilityComplete: bool,
  mtpComplete: bool
}

symptomCheck: {
  date,
  score,
  attribution: "lift" | "match + lift" | "match" | "recovery"
}
```

## Views needed

1. **Today** — the single movement, its sets, load pulled from the progression table, mobility and MTP checkboxes. Should be usable in under 30 seconds of tapping.
2. **Morning check** — one score entry, auto-attributed.
3. **Week** — seven rows, completion state per day. This is the adherence view and it matters more than any other screen.
4. **Progression** — current week in the 6-week table, per-movement load, any active locks, knee tracking failure count per movement.
5. **Export** — markdown dump of the last 4 weeks, formatted to paste into a program review.

## Export format

Keep the v2 markdown export structure but group by week and day rather than by session. Each day line should carry: date, movement, load, sets completed, any knee tracking failure, next-morning score. Recovery days export as a single line confirming mobility completion, since adherence on those days is the thing being tracked.

---

## Implementation notes (decisions made where the spec was open)

These are the places the implementation had to resolve something the spec left
open or under-specified. Recorded here so a future revision can overrule them.

1. **Tuesday carries two movements, so `day.movement` could not stay singular.**
   The day object stores `movements: [ids]` plus a per-movement `work` map
   (`work[movementId] = { sets: [...], failed: bool }`). The spec's `movement`
   and flat `sets` fields are still written and kept in sync — `movement` holds
   the first movement of the day and `sets` is a flattened mirror tagged with
   `movement` — so anything reading the documented shape still works.

2. **Symptom attribution is derived from the prior day, which makes the
   Monday/Thursday rule fall out automatically.** A check logged on day D is
   attributed to D-1. Monday looks back at Sunday and Thursday looks back at
   Wednesday — both `match_post` days — so both are tagged "match + lift"
   whenever sets were logged, exactly as the spec requires, with no special
   casing by weekday.

3. **Symptom score scale: 0–3**, where 0 = no change, 1 = mild, 2 = moderate,
   3 = significant. A check "fails" at score >= 1 (any increase), matching the
   v2 rule it replaces.

4. **"Two consecutive failed checks" is evaluated per movement**: among checks
   attributed to a given movement, in date order, the lock engages when the two
   most recent are both >= 1. It follows that a later score-0 check for that
   movement clears the lock automatically.

5. **A lock freezes the load at the program week in effect when the failures
   happened**, and only for the matching day category (`match` for Wed/Sun,
   `standard` for Tue/Fri/Sat). The other category keeps progressing.

6. **The 6-week load table is carried over from v2 verbatim** rather than
   recomputed: the v2 "Friday" column supplies the 100% values and the v2
   "Tuesday" column supplies the 85% values, both already expressed in the
   5 lb dumbbell increments available.

7. **The morning check can be deferred.** It prompts on open as specified, but
   offers "Ask me later today" so it can never lock you out of the app
   mid-session; a banner keeps it visible until it is answered.

8. **v2 data is migrated, not discarded.** Mobility, match, and jog logs become
   day records; symptom logs become `symptomCheck` entries; WBLT measurements
   and completed v2 strength sessions are preserved as history and exported
   under an "Archived v2 sessions" heading.

9. **Kept from v2 though not mentioned in v3**, since the underlying program
   still calls for them: the monthly WBLT spot check with its 0.5" asymmetry
   alert, Saturday jog logging, the guided post-match mobility flow, and the
   90-second inter-set rest timer (informational, never blocking).
