// // // controllers/habitController.js
// // const HabitGoals = require('../models/HabitGoals');
// // const HabitEntry = require('../models/HabitEntry');

// // const toMidnightUTC = (d) => {
// //   const dt = new Date(d);
// //   dt.setUTCHours(0, 0, 0, 0);
// //   return dt;
// // };

// // const clamp90 = (n) => Math.max(1, Math.min(90, n));

// // const computeDayNumber = (startDate, date) => {
// //   const start = toMidnightUTC(startDate || new Date());
// //   const target = toMidnightUTC(date);
// //   const diff = Math.floor((target - start) / (1000 * 60 * 60 * 24));
// //   return clamp90(diff + 1);
// // };

// // const withCompletion = (entry, goals) => {
// //   const g = goals || {};
// //   return {
// //     ...entry,
// //     completed: {
// //       water: entry.water >= (g.waterGoal ?? 10),
// //       sleep: entry.sleepHours >= (g.sleepGoalHours ?? 8),
// //       steps: entry.steps >= (g.stepsGoal ?? 10000),
// //     },
// //   };
// // };

// // // GET /api/habits/goals
// // exports.getGoals = async (req, res) => {
// //   const user = req.userId;
// //   let goals = await HabitGoals.findOne({ user }).lean();
// //   if (!goals) {
// //     goals = (await HabitGoals.create({ user })).toObject();
// //   }
// //   res.json(goals);
// // };

// // // PUT /api/habits/goals
// // exports.updateGoals = async (req, res) => {
// //   const user = req.userId;
// //   const { waterGoal, sleepGoalHours, stepsGoal, startDate } = req.body || {};
// //   const goals = await HabitGoals.findOneAndUpdate(
// //     { user },
// //     {
// //       $set: {
// //         ...(waterGoal !== undefined ? { waterGoal } : {}),
// //         ...(sleepGoalHours !== undefined ? { sleepGoalHours } : {}),
// //         ...(stepsGoal !== undefined ? { stepsGoal } : {}),
// //         ...(startDate ? { startDate } : {}),
// //       },
// //     },
// //     { new: true, upsert: true }
// //   ).lean();

// //   res.json(goals);
// // };

// // // GET /api/habits/entry?date=YYYY-MM-DD
// // exports.getEntry = async (req, res) => {
// //   const user = req.userId;
// //   const date = toMidnightUTC(req.query.date || new Date());
// //   const goals = await HabitGoals.findOne({ user }).lean();
// //   const dayNumber = computeDayNumber(goals?.startDate, date);

// //   let entry = await HabitEntry.findOne({ user, date }).lean();
// //   if (!entry) {
// //     entry = (
// //       await HabitEntry.create({
// //         user,
// //         date,
// //         dayNumber,
// //         water: 0,
// //         sleepHours: 0,
// //         steps: 0,
// //       })
// //     ).toObject();
// //   }
// //   const merged = withCompletion(entry, goals);
// //   // Keep DB in sync if completion changed
// //   if (
// //     merged.completed.water !== entry.completed?.water ||
// //     merged.completed.sleep !== entry.completed?.sleep ||
// //     merged.completed.steps !== entry.completed?.steps
// //   ) {
// //     await HabitEntry.updateOne(
// //       { _id: entry._id },
// //       { $set: { completed: merged.completed, dayNumber } }
// //     );
// //   }
// //   res.json(merged);
// // };

// // // POST /api/habits/entry (upsert)
// // exports.upsertEntry = async (req, res) => {
// //   const user = req.userId;
// //   const { date, water, sleepHours, steps } = req.body || {};
// //   const goals = await HabitGoals.findOne({ user }).lean();
// //   const day = toMidnightUTC(date || new Date());
// //   const dayNumber = computeDayNumber(goals?.startDate, day);

// //   const base = { user, date: day };
// //   const current = await HabitEntry.findOne(base).lean();
// //   const payload = withCompletion(
// //     {
// //       water: water ?? current?.water ?? 0,
// //       sleepHours: sleepHours ?? current?.sleepHours ?? 0,
// //       steps: steps ?? current?.steps ?? 0,
// //     },
// //     goals
// //   );

// //   const saved = await HabitEntry.findOneAndUpdate(
// //     base,
// //     { $set: { ...payload, dayNumber } },
// //     { new: true, upsert: true }
// //   ).lean();

// //   res.json(saved);
// // };

// // // GET /api/habits/stats?from=YYYY-MM-DD&to=YYYY-MM-DD
// // exports.getStats = async (req, res) => {
// //   const user = req.userId;
// //   const from = toMidnightUTC(req.query.from || new Date(Date.now() - 6 * 86400000));
// //   const to = toMidnightUTC(req.query.to || new Date());

// //   const entries = await HabitEntry.find({
// //     user,
// //     date: { $gte: from, $lte: to },
// //   })
// //     .sort({ date: 1 })
// //     .lean();

// //   const totals = {
// //     days: entries.length,
// //     waterMetDays: entries.filter((e) => e.completed?.water).length,
// //     sleepMetDays: entries.filter((e) => e.completed?.sleep).length,
// //     stepsMetDays: entries.filter((e) => e.completed?.steps).length,
// //   };

// //   // compute streak (any habit fully met day == all three?)
// //   let best = 0,
// //     cur = 0;
// //   for (const e of entries) {
// //     const full = e.completed?.water && e.completed?.sleep && e.completed?.steps;
// //     cur = full ? cur + 1 : 0;
// //     best = Math.max(best, cur);
// //   }

// //   res.json({
// //     range: { from, to },
// //     totals,
// //     completionRate: {
// //       water: totals.days ? totals.waterMetDays / totals.days : 0,
// //       sleep: totals.days ? totals.sleepMetDays / totals.days : 0,
// //       steps: totals.days ? totals.stepsMetDays / totals.days : 0,
// //     },
// //     streak: { current: cur, best },
// //     entries,
// //   });
// // };

// const HabitGoals = require('../models/HabitGoals');
// const HabitEntry = require('../models/HabitEntry');

// const toMidnightUTC = (d) => { const dt = new Date(d); dt.setUTCHours(0,0,0,0); return dt; };
// const clamp90 = (n) => Math.max(1, Math.min(90, n));
// const computeDayNumber = (startDate, date) => {
//   const start = toMidnightUTC(startDate || new Date());
//   const target = toMidnightUTC(date);
//   const diff = Math.floor((target - start) / 86400000);
//   return clamp90(diff + 1);
// };

// const mapGoalsToUi = (g) => ({
//   waterTarget: g?.waterGoal ?? 10,
//   sleepTarget: g?.sleepGoalHours ?? 8,
//   stepsTarget: g?.stepsGoal ?? 10000,
// });
// const mapEntryToUi = (e) => ({
//   date: e.date,
//   waterCount: e.water ?? 0,
//   sleepHours: e.sleepHours ?? 0,
//   steps: e.steps ?? 0,
// });
// const computeDone = (e, g) => ({
//   water: (e.water ?? 0) >= (g?.waterGoal ?? 10),
//   sleep: (e.sleepHours ?? 0) >= (g?.sleepGoalHours ?? 8),
//   steps: (e.steps ?? 0) >= (g?.stepsGoal ?? 10000),
// });

// // ✅ NEW: GET /api/habits/summary?date=YYYY-MM-DD
// exports.getSummary = async (req, res) => {
//   const user = req.userId;
//   const dateKey = req.query.date || new Date().toISOString().slice(0,10);
//   const date = toMidnightUTC(dateKey);

//   let goals = await HabitGoals.findOne({ user }).lean();
//   if (!goals) goals = (await HabitGoals.create({ user })).toObject();

//   let entry = await HabitEntry.findOne({ user, date }).lean();
//   if (!entry) {
//     entry = (await HabitEntry.create({
//       user,
//       date,
//       dayNumber: computeDayNumber(goals.startDate, date),
//       water: 0, sleepHours: 0, steps: 0,
//     })).toObject();
//   }

//   const done = computeDone(entry, goals);
//   res.json({
//     goals: mapGoalsToUi(goals),
//     entry: mapEntryToUi(entry),
//     done,
//   });
// };

// // existing goals handlers unchanged
// exports.getGoals = async (req, res) => {
//   const user = req.userId;
//   let goals = await HabitGoals.findOne({ user }).lean();
//   if (!goals) goals = (await HabitGoals.create({ user })).toObject();
//   res.json(goals);
// };

// exports.updateGoals = async (req, res) => {
//   const user = req.userId;
//   const { waterGoal, sleepGoalHours, stepsGoal, startDate } = req.body || {};
//   const goals = await HabitGoals.findOneAndUpdate(
//     { user },
//     { $set: {
//       ...(waterGoal !== undefined ? { waterGoal } : {}),
//       ...(sleepGoalHours !== undefined ? { sleepGoalHours } : {}),
//       ...(stepsGoal !== undefined ? { stepsGoal } : {}),
//       ...(startDate ? { startDate } : {}),
//     }},
//     { new: true, upsert: true }
//   ).lean();
//   res.json(goals);
// };

// // existing getEntry unchanged (optional)
// exports.getEntry = async (req, res) => {
//   const user = req.userId;
//   const date = toMidnightUTC(req.query.date || new Date());
//   const goals = await HabitGoals.findOne({ user }).lean();
//   const dayNumber = computeDayNumber(goals?.startDate, date);

//   let entry = await HabitEntry.findOne({ user, date }).lean();
//   if (!entry) {
//     entry = (await HabitEntry.create({ user, date, dayNumber, water:0, sleepHours:0, steps:0 })).toObject();
//   }
//   const completed = computeDone(entry, goals);
//   if (JSON.stringify(entry.completed) !== JSON.stringify(completed) || entry.dayNumber !== dayNumber) {
//     await HabitEntry.updateOne({ _id: entry._id }, { $set: { completed, dayNumber } });
//   }
//   res.json({ ...entry, completed, dayNumber });
// };

// // ✅ UPDATED: POST /api/habits/entry — supports incWater and waterCount
// exports.upsertEntry = async (req, res) => {
//   const user = req.userId;
//   const { date, steps, sleepHours, incWater, waterCount } = req.body || {};
//   const goals = await HabitGoals.findOne({ user }).lean();
//   const day = toMidnightUTC(date || new Date());
//   const dayNumber = computeDayNumber(goals?.startDate, day);

//   const base = { user, date: day };
//   const current = await HabitEntry.findOne(base).lean();

//   // derive next water value (accept absolute or delta)
//   let nextWater = current?.water ?? 0;
//   if (typeof waterCount === 'number') nextWater = Math.max(0, waterCount);
//   if (typeof incWater === 'number') nextWater = Math.max(0, nextWater + incWater);

//   const next = {
//     water: nextWater,
//     sleepHours: (typeof sleepHours === 'number') ? Math.max(0, sleepHours) : (current?.sleepHours ?? 0),
//     steps: (typeof steps === 'number') ? Math.max(0, steps) : (current?.steps ?? 0),
//   };
//   const completed = computeDone(next, goals);

//   const saved = await HabitEntry.findOneAndUpdate(
//     base,
//     { $set: { ...next, completed, dayNumber } },
//     { new: true, upsert: true }
//   ).lean();

//   res.json({
//     entry: mapEntryToUi(saved),
//     done: completed,
//   });
// };

// // ✅ UPDATED: GET /api/habits/stats returns the shape your Stats screen expects
// exports.getStats = async (req, res) => {
//   const user = req.userId;
//   const from = toMidnightUTC(req.query.from || new Date(Date.now() - 29 * 86400000));
//   const to = toMidnightUTC(req.query.to || new Date());

//   const goals = await HabitGoals.findOne({ user }).lean();
//   const entries = await HabitEntry.find({
//     user,
//     date: { $gte: from, $lte: to },
//   }).sort({ date: 1 }).lean();

//   // best streak = consecutive days where ALL three goals met
//   let best = 0, cur = 0;
//   for (const e of entries) {
//     const full = e.completed?.water && e.completed?.sleep && e.completed?.steps;
//     cur = full ? cur + 1 : 0;
//     best = Math.max(best, cur);
//   }

//   res.json({
//     days: entries.map(e => ({
//       date: e.date,
//       waterCount: e.water,
//       sleepHours: e.sleepHours,
//       steps: e.steps,
//       done: e.completed,
//     })),
//     goals: mapGoalsToUi(goals),
//     bestStreak: best,
//   });
// };














// // controllers/habitController.js
// const HabitGoals = require('../models/HabitGoals');
// const HabitEntry  = require('../models/HabitEntry');

// const toMidnightUTC = (d) => { const dt = new Date(d); dt.setUTCHours(0,0,0,0); return dt; };
// const clamp90 = (n) => Math.max(1, Math.min(90, n));

// const computeDayNumber = (startDate, date) => {
//   const start = toMidnightUTC(startDate || new Date());
//   const target = toMidnightUTC(date);
//   const diff = Math.floor((target - start) / (1000 * 60 * 60 * 24));
//   return clamp90(diff + 1);
// };

// const withCompletion = (entry, goals) => {
//   const g = goals || {};
//   return {
//     ...entry,
//     completed: {
//       water: (entry.water ?? 0) >= (g.waterGoal ?? 10),
//       sleep: (entry.sleepHours ?? 0) >= (g.sleepGoalHours ?? 8),
//       steps: (entry.steps ?? 0) >= (g.stepsGoal ?? 10000),
//     },
//   };
// };

// // GET /api/habits/goals
// exports.getGoals = async (req, res) => {
//   const user = req.userId;
//   let goals = await HabitGoals.findOne({ user }).lean();
//   if (!goals) goals = (await HabitGoals.create({ user })).toObject();
//   // also expose new-style names for clients that expect them
//   res.json({
//     ...goals,
//     waterTarget: goals.waterGoal,
//     sleepTarget: goals.sleepGoalHours,
//     stepsTarget: goals.stepsGoal,
//   });
// };

// // PUT /api/habits/goals
// exports.updateGoals = async (req, res) => {
//   const user = req.userId;
//   const body = req.body || {};
//   const waterGoal      = body.waterGoal      ?? body.waterTarget;
//   const sleepGoalHours = body.sleepGoalHours ?? body.sleepTarget;
//   const stepsGoal      = body.stepsGoal      ?? body.stepsTarget;
//   const startDate      = body.startDate;

//   const goals = await HabitGoals.findOneAndUpdate(
//     { user },
//     { $set: {
//         ...(waterGoal      !== undefined ? { waterGoal }      : {}),
//         ...(sleepGoalHours !== undefined ? { sleepGoalHours } : {}),
//         ...(stepsGoal      !== undefined ? { stepsGoal }      : {}),
//         ...(startDate      ? { startDate } : {}),
//     }},
//     { new: true, upsert: true }
//   ).lean();

//   res.json({
//     ...goals,
//     waterTarget: goals.waterGoal,
//     sleepTarget: goals.sleepGoalHours,
//     stepsTarget: goals.stepsGoal,
//   });
// };

// // helper to get or create entry
// const getOrCreateEntry = async (user, date, goals) => {
//   const dayNumber = computeDayNumber(goals?.startDate, date);
//   let entry = await HabitEntry.findOne({ user, date }).lean();
//   if (!entry) {
//     entry = (await HabitEntry.create({ user, date, dayNumber, water:0, sleepHours:0, steps:0 })).toObject();
//   }
//   const merged = withCompletion(entry, goals);
//   if (
//     merged.completed.water !== entry.completed?.water ||
//     merged.completed.sleep !== entry.completed?.sleep ||
//     merged.completed.steps !== entry.completed?.steps ||
//     (entry.dayNumber !== dayNumber)
//   ) {
//     await HabitEntry.updateOne({ _id: entry._id }, { $set: { completed: merged.completed, dayNumber } });
//   }
//   return { ...merged, dayNumber };
// };

// // GET /api/habits/entry?date=YYYY-MM-DD
// exports.getEntry = async (req, res) => {
//   const user = req.userId;
//   const date = toMidnightUTC(req.query.date || new Date());
//   const goals = await HabitGoals.findOne({ user }).lean();
//   const entry = await getOrCreateEntry(user, date, goals);
//   res.json(entry);
// };

// // POST /api/habits/entry
// // accepts: { date, steps?, sleepHours?, water?, waterCount?, incWater? }
// exports.upsertEntry = async (req, res) => {
//   const user = req.userId;
//   const body = req.body || {};
//   const day  = toMidnightUTC(body.date || new Date());
//   const goals = await HabitGoals.findOne({ user }).lean();

//   const base = { user, date: day };
//   const current = await HabitEntry.findOne(base).lean();

//   let water = body.water ?? body.waterCount ?? current?.water ?? 0;
//   if (typeof body.incWater === 'number') water = Math.max(0, water + body.incWater);

//   const sleepHours = body.sleepHours ?? current?.sleepHours ?? 0;
//   const steps      = body.steps      ?? current?.steps ?? 0;

//   const payload = withCompletion({ water, sleepHours, steps }, goals);
//   const dayNumber = computeDayNumber(goals?.startDate, day);

//   const saved = await HabitEntry.findOneAndUpdate(
//     base, { $set: { ...payload, dayNumber } }, { new: true, upsert: true }
//   ).lean();

//   res.json({
//     entry: { waterCount: saved.water, sleepHours: saved.sleepHours, steps: saved.steps },
//     done:  saved.completed,
//     goals: {
//       waterTarget: goals?.waterGoal ?? 10,
//       sleepTarget: goals?.sleepGoalHours ?? 8,
//       stepsTarget: goals?.stepsGoal ?? 10000,
//     },
//     date: day.toISOString().slice(0,10),
//   });
// };

// // GET /api/habits/summary?date=YYYY-MM-DD
// exports.getSummary = async (req, res) => {
//   const user = req.userId;
//   const date = toMidnightUTC(req.query.date || new Date());
//   const goals = await HabitGoals.findOne({ user }).lean();
//   const entry = await getOrCreateEntry(user, date, goals);
//   res.json({
//     date: date.toISOString().slice(0,10),
//     goals: {
//       waterTarget: goals?.waterGoal ?? 10,
//       sleepTarget: goals?.sleepGoalHours ?? 8,
//       stepsTarget: goals?.stepsGoal ?? 10000,
//     },
//     entry: {
//       waterCount: entry.water ?? 0,
//       sleepHours: entry.sleepHours ?? 0,
//       steps: entry.steps ?? 0,
//     },
//     done: entry.completed,
//   });
// };

// // GET /api/habits/stats?from=YYYY-MM-DD&to=YYYY-MM-DD
// exports.getStats = async (req, res) => {
//   const user = req.userId;
//   const from = toMidnightUTC(req.query.from || new Date(Date.now() - 6 * 86400000));
//   const to   = toMidnightUTC(req.query.to || new Date());
//   const goals = await HabitGoals.findOne({ user }).lean();

//   const entries = await HabitEntry.find({ user, date: { $gte: from, $lte: to } })
//     .sort({ date: 1 }).lean();

//   let best = 0, cur = 0;
//   for (const e of entries) {
//     const full = e.completed?.water && e.completed?.sleep && e.completed?.steps;
//     cur = full ? cur + 1 : 0;
//     best = Math.max(best, cur);
//   }

//   const totals = {
//     days: entries.length,
//     waterMetDays: entries.filter(e => e.completed?.water).length,
//     sleepMetDays: entries.filter(e => e.completed?.sleep).length,
//     stepsMetDays: entries.filter(e => e.completed?.steps).length,
//   };

//   res.json({
//     range: { from, to },
//     goals,
//     totals,
//     completionRate: {
//       water: totals.days ? totals.waterMetDays / totals.days : 0,
//       sleep: totals.days ? totals.sleepMetDays / totals.days : 0,
//       steps: totals.days ? totals.stepsMetDays / totals.days : 0,
//     },
//     streak: { current: cur, best },
//     entries,
//   });
// };


// // controllers/habitController.js
// const HabitGoals = require('../models/HabitGoals');
// const HabitEntry = require('../models/HabitEntry');

// /* ------------------------------ helpers ------------------------------ */
// const toMidnightUTC = (d) => {
//   const dt = new Date(d || Date.now());
//   dt.setUTCHours(0, 0, 0, 0);
//   return dt;
// };

// const clamp90 = (n) => Math.max(1, Math.min(90, n));

// const computeDayNumber = (startDate, date) => {
//   const start = toMidnightUTC(startDate || new Date());
//   const target = toMidnightUTC(date);
//   const diff = Math.floor((target - start) / 86400000);
//   return clamp90(diff + 1);
// };

// const toClientGoals = (g = {}) => ({
//   ...g,
//   // aliases so RN can read either style
//   waterTarget: g.waterTarget ?? g.waterGoal ?? 10,
//   sleepTarget: g.sleepTarget ?? g.sleepGoalHours ?? 8,
//   stepsTarget: g.stepsTarget ?? g.stepsGoal ?? 10000,
// });

// const completionFor = (entry, goals) => {
//   const g = toClientGoals(goals);
//   return {
//     water: (entry.water ?? entry.waterCount ?? 0) >= (g.waterTarget ?? 10),
//     sleep: (entry.sleepHours ?? 0) >= (g.sleepTarget ?? 8),
//     steps: (entry.steps ?? 0) >= (g.stepsTarget ?? 10000),
//   };
// };

// const toClientEntry = (e = {}, goals) => {
//   const entry = {
//     _id: e._id,
//     user: e.user,
//     date: e.date,
//     dayNumber: e.dayNumber,
//     waterCount: e.waterCount ?? e.water ?? 0,
//     sleepHours: e.sleepHours ?? 0,
//     steps: e.steps ?? 0,
//     createdAt: e.createdAt,
//     updatedAt: e.updatedAt,
//   };
//   const done = completionFor(entry, goals);
//   return { entry, done };
// };

// const getOrCreateGoals = async (userId) => {
//   let goals = await HabitGoals.findOne({ user: userId }).lean();
//   if (!goals) {
//     goals = (await HabitGoals.create({ user: userId })).toObject();
//   }
//   return goals;
// };

// const getOrCreateEntry = async (userId, date, goals) => {
//   const day = toMidnightUTC(date);
//   const dayNumber = computeDayNumber(goals?.startDate, day);

//   let entry = await HabitEntry.findOne({ user: userId, date: day }).lean();
//   if (!entry) {
//     entry = (
//       await HabitEntry.create({
//         user: userId,
//         date: day,
//         dayNumber,
//         water: 0,
//         sleepHours: 0,
//         steps: 0,
//         completed: { water: false, sleep: false, steps: false },
//       })
//     ).toObject();
//   }

//   // ensure completed flags are in sync
//   const done = completionFor(entry, goals);
//   const changed =
//     entry.completed?.water !== done.water ||
//     entry.completed?.sleep !== done.sleep ||
//     entry.completed?.steps !== done.steps ||
//     entry.dayNumber !== dayNumber;

//   if (changed) {
//     await HabitEntry.updateOne(
//       { _id: entry._id },
//       { $set: { completed: done, dayNumber } }
//     );
//     entry.completed = done;
//     entry.dayNumber = dayNumber;
//   }

//   return entry;
// };

// /* ------------------------------ handlers ------------------------------ */

// // GET /api/habits/goals
// exports.getGoals = async (req, res) => {
//   try {
//     const goals = await getOrCreateGoals(req.userId);
//     res.json(toClientGoals(goals));
//   } catch (e) {
//     res.status(500).json({ error: 'Failed to load goals' });
//   }
// };

// // PUT /api/habits/goals
// // accepts either {waterGoal, sleepGoalHours, stepsGoal} or aliases {waterTarget, sleepTarget, stepsTarget}
// exports.updateGoals = async (req, res) => {
//   try {
//     const b = req.body || {};
//     const update = {
//       ...(b.waterGoal !== undefined ? { waterGoal: b.waterGoal } : {}),
//       ...(b.sleepGoalHours !== undefined ? { sleepGoalHours: b.sleepGoalHours } : {}),
//       ...(b.stepsGoal !== undefined ? { stepsGoal: b.stepsGoal } : {}),

//       // aliases
//       ...(b.waterTarget !== undefined ? { waterGoal: b.waterTarget } : {}),
//       ...(b.sleepTarget !== undefined ? { sleepGoalHours: b.sleepTarget } : {}),
//       ...(b.stepsTarget !== undefined ? { stepsGoal: b.stepsTarget } : {}),

//       ...(b.startDate ? { startDate: b.startDate } : {}),
//     };

//     const goals = await HabitGoals.findOneAndUpdate(
//       { user: req.userId },
//       { $set: update },
//       { new: true, upsert: true }
//     ).lean();

//     res.json(toClientGoals(goals));
//   } catch (e) {
//     res.status(500).json({ error: 'Failed to update goals' });
//   }
// };

// // GET /api/habits/entry?date=YYYY-MM-DD
// // returns a PLAIN entry document with "completed" (so your RN fallback works)
// exports.getEntry = async (req, res) => {
//   try {
//     const date = req.query?.date ? new Date(req.query.date) : new Date();
//     const goals = await getOrCreateGoals(req.userId);
//     const entry = await getOrCreateEntry(req.userId, date, goals);
//     res.json(entry); // plain entry (has completed)
//   } catch (e) {
//     res.status(500).json({ error: 'Failed to load entry' });
//   }
// };

// // POST /api/habits/entry
// // Body may include: { date, incWater } or absolute { water, sleepHours, steps }
// exports.upsertEntry = async (req, res) => {
//   try {
//     const b = req.body || {};
//     const date = b.date ? new Date(b.date) : new Date();
//     const goals = await getOrCreateGoals(req.userId);
//     const day = toMidnightUTC(date);

//     const filter = { user: req.userId, date: day };
//     const current = await HabitEntry.findOne(filter).lean();

//     // derive new values
//     const waterBase = current?.water ?? 0;
//     const newWater =
//       b.water !== undefined
//         ? Math.max(0, Number(b.water) || 0)
//         : b.incWater !== undefined
//         ? Math.max(0, waterBase + Number(b.incWater || 0))
//         : waterBase;

//     const newSleep = b.sleepHours !== undefined
//       ? Math.max(0, Number(b.sleepHours) || 0)
//       : current?.sleepHours ?? 0;

//     const newSteps = b.steps !== undefined
//       ? Math.max(0, Number(b.steps) || 0)
//       : current?.steps ?? 0;

//     const payload = {
//       water: newWater,
//       sleepHours: newSleep,
//       steps: newSteps,
//     };

//     const dayNumber = computeDayNumber(goals?.startDate, day);
//     const done = completionFor(payload, goals);

//     const saved = await HabitEntry.findOneAndUpdate(
//       filter,
//       { $set: { ...payload, dayNumber, completed: done } },
//       { new: true, upsert: true }
//     ).lean();

//     res.json(saved); // plain entry (has completed)
//   } catch (e) {
//     res.status(500).json({ error: 'Failed to save entry' });
//   }
// };

// // GET /api/habits/summary?date=YYYY-MM-DD
// // returns { goals, entry, done }
// exports.getSummary = async (req, res) => {
//   try {
//     const date = req.query?.date ? new Date(req.query.date) : new Date();
//     const goals = await getOrCreateGoals(req.userId);
//     const entryDoc = await getOrCreateEntry(req.userId, date, goals);
//     const { entry, done } = toClientEntry(entryDoc, goals);
//     res.json({ goals: toClientGoals(goals), entry, done });
//   } catch (e) {
//     res.status(500).json({ error: 'Failed to load summary' });
//   }
// };

// // GET /api/habits/stats?from=YYYY-MM-DD&to=YYYY-MM-DD
// // returns { goals, days:[{date, waterCount, sleepHours, steps}], bestStreak }
// exports.getStats = async (req, res) => {
//   try {
//     const goals = await getOrCreateGoals(req.userId);
//     const from = toMidnightUTC(req.query?.from || new Date(Date.now() - 29 * 86400000));
//     const to = toMidnightUTC(req.query?.to || new Date());

//     const entries = await HabitEntry.find({
//       user: req.userId,
//       date: { $gte: from, $lte: to },
//     })
//       .sort({ date: 1 })
//       .lean();

//     const days = entries.map((e) => ({
//       date: e.date,
//       waterCount: e.waterCount ?? e.water ?? 0,
//       sleepHours: e.sleepHours ?? 0,
//       steps: e.steps ?? 0,
//       completed: e.completed || completionFor(e, goals),
//     }));

//     // best streak where ALL three completed
//     let best = 0, cur = 0;
//     for (const d of days) {
//       const full = d.completed?.water && d.completed?.sleep && d.completed?.steps;
//       cur = full ? cur + 1 : 0;
//       best = Math.max(best, cur);
//     }

//     res.json({
//       goals: toClientGoals(goals),
//       days,
//       bestStreak: best,
//     });
//   } catch (e) {
//     res.status(500).json({ error: 'Failed to load stats' });
//   }
// };

// controllers/habitController.js
const mongoose = require('mongoose');
const HabitGoals = require('../models/HabitGoals');
const HabitEntry = require('../models/HabitEntry');

const oId = (id) => new mongoose.Types.ObjectId(String(id));

const getUserId = (req) => req.userId || req.user?.id || req.user?._id || req.user?.userId;

const toMidnightUTC = (d) => {
  const dt = new Date(d || new Date());
  dt.setUTCHours(0, 0, 0, 0);
  return dt;
};

const clamp90 = (n) => Math.max(1, Math.min(90, n));

const computeDayNumber = (startDate, date) => {
  const start = toMidnightUTC(startDate || new Date());
  const target = toMidnightUTC(date);
  const diff = Math.floor((target - start) / (1000 * 60 * 60 * 24));
  return clamp90(diff + 1);
};

// normalize legacy -> target field names
const normalizeGoals = (goalsDoc) => {
  const g = goalsDoc || {};
  return {
    startDate: g.startDate,
    waterTarget: g.waterTarget ?? g.waterGoal ?? 10,
    sleepTarget: g.sleepTarget ?? g.sleepGoalHours ?? 8,
    stepsTarget: g.stepsTarget ?? g.stepsGoal ?? 10000,
  };
};

const withCompletion = (entry, gDoc) => {
  const g = normalizeGoals(gDoc);
  const completed = {
    water: (entry.waterCount || 0) >= g.waterTarget,
    sleep: (entry.sleepHours || 0) >= g.sleepTarget,
    steps: (entry.steps || 0) >= g.stepsTarget,
  };
  return { ...entry, completed };
};

// --- Goals ---
exports.getGoals = async (req, res) => {
  try {
    const user = getUserId(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const uid = oId(user);
    let goals = await HabitGoals.findOne({ user: uid }).lean();
    if (!goals) goals = (await HabitGoals.create({ user: uid })).toObject();

    res.json(normalizeGoals(goals));
  } catch (e) {
    res.status(500).json({ error: e.message || 'Failed to fetch goals' });
  }
};

exports.updateGoals = async (req, res) => {
  try {
    const user = getUserId(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const uid = oId(user);

    const toNum = (v, def) => (typeof v === 'number' ? v : Number(v ?? def));
    const waterTarget = Math.max(0, toNum(req.body?.waterTarget, 10));
    const sleepTarget = Math.max(0, toNum(req.body?.sleepTarget, 8));
    const stepsTarget = Math.max(0, toNum(req.body?.stepsTarget, 10000));
    const startDate = req.body?.startDate ? new Date(req.body.startDate) : undefined;

    if (![waterTarget, sleepTarget, stepsTarget].every(Number.isFinite)) {
      return res.status(400).json({ error: 'Invalid goal values' });
    }

    const set = { waterTarget, sleepTarget, stepsTarget, ...(startDate ? { startDate } : {}) };

    const goals = await HabitGoals.findOneAndUpdate(
      { user: uid },
      { $set: set },
      { new: true, upsert: true }
    ).lean();

    res.json(normalizeGoals(goals));
  } catch (e) {
    res.status(500).json({ error: e.message || 'Failed to update goals' });
  }
};

// --- Entry (single day) ---
exports.getEntry = async (req, res) => {
  try {
    const user = getUserId(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const uid = oId(user);

    const date = toMidnightUTC(req.query.date || new Date());
    const goals = await HabitGoals.findOne({ user: uid }).lean();
    const ng = normalizeGoals(goals);
    const dayNumber = computeDayNumber(ng.startDate, date);

    let entry = await HabitEntry.findOne({ user: uid, date }).lean();
    if (!entry) {
      entry = (
        await HabitEntry.create({
          user: uid,
          date,
          dayNumber,
          waterCount: 0,
          sleepHours: 0,
          steps: 0,
        })
      ).toObject();
    }
    const merged = withCompletion(entry, ng);

    if (
      merged.completed.water !== entry.completed?.water ||
      merged.completed.sleep !== entry.completed?.sleep ||
      merged.completed.steps !== entry.completed?.steps ||
      entry.dayNumber !== dayNumber
    ) {
      await HabitEntry.updateOne(
        { _id: entry._id },
        { $set: { completed: merged.completed, dayNumber } }
      );
    }

    res.json(merged);
  } catch (e) {
    res.status(500).json({ error: e.message || 'Failed to fetch entry' });
  }
};

// Upsert with payload: { date, incWater, sleepHours, stepsDone }
exports.upsertEntry = async (req, res) => {
  try {
    const user = getUserId(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const uid = oId(user);

    const { date, incWater, sleepHours, stepsDone } = req.body || {};
    const goals = await HabitGoals.findOne({ user: uid }).lean();
    const ng = normalizeGoals(goals);

    const day = toMidnightUTC(date || new Date());
    const dayNumber = computeDayNumber(ng.startDate, day);

    const base = { user: uid, date: day };
    const current = await HabitEntry.findOne(base).lean();

    let waterCount = current?.waterCount ?? 0;
    if (typeof incWater === 'number') waterCount = Math.max(0, waterCount + incWater);

    let sleepVal = current?.sleepHours ?? 0;
    if (typeof sleepHours === 'number') sleepVal = Math.max(0, sleepHours);

    let steps = current?.steps ?? 0;
    if (typeof stepsDone === 'boolean') steps = stepsDone ? ng.stepsTarget : 0;

    const payload = withCompletion({ waterCount, sleepHours: sleepVal, steps, dayNumber }, ng);

    const saved = await HabitEntry.findOneAndUpdate(
      base,
      { $set: { ...payload, dayNumber } },
      { new: true, upsert: true }
    ).lean();

    res.json(saved);
  } catch (e) {
    res.status(500).json({ error: e.message || 'Failed to update entry' });
  }
};

// --- Summary for a date ---
exports.getSummary = async (req, res) => {
  try {
    const user = getUserId(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const uid = oId(user);

    const date = toMidnightUTC(req.query.date || new Date());
    let goals = await HabitGoals.findOne({ user: uid }).lean();
    if (!goals) goals = (await HabitGoals.create({ user: uid })).toObject();
    const ng = normalizeGoals(goals);

    let entry = await HabitEntry.findOne({ user: uid, date }).lean();
    if (!entry) {
      entry = (
        await HabitEntry.create({
          user: uid,
          date,
          dayNumber: computeDayNumber(ng.startDate, date),
          waterCount: 0,
          sleepHours: 0,
          steps: 0,
        })
      ).toObject();
    }

    const merged = withCompletion(entry, ng);

    res.json({
      goals: {
        waterTarget: ng.waterTarget,
        sleepTarget: ng.sleepTarget,
        stepsTarget: ng.stepsTarget,
      },
      entry: {
        waterCount: merged.waterCount,
        sleepHours: merged.sleepHours,
        steps: merged.steps,
      },
      done: merged.completed,
    });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Failed to load summary' });
  }
};

// --- Stats over a range ---
exports.getStats = async (req, res) => {
  try {
    const user = getUserId(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const uid = oId(user);

    const from = toMidnightUTC(req.query.from || new Date(Date.now() - 29 * 86400000));
    const to = toMidnightUTC(req.query.to || new Date());

    const goals = await HabitGoals.findOne({ user: uid }).lean();
    const ng = normalizeGoals(goals);

    const entries = await HabitEntry.find({
      user: uid,
      date: { $gte: from, $lte: to },
    }).sort({ date: 1 }).lean();

    const totals = {
      days: entries.length,
      waterMetDays: entries.filter((e) => e.completed?.water).length,
      sleepMetDays: entries.filter((e) => e.completed?.sleep).length,
      stepsMetDays: entries.filter((e) => e.completed?.steps).length,
    };

    let best = 0, cur = 0;
    for (const e of entries) {
      const full = e.completed?.water && e.completed?.sleep && e.completed?.steps;
      cur = full ? cur + 1 : 0;
      best = Math.max(best, cur);
    }

    res.json({
      range: { from, to },
      goals: {
        waterTarget: ng.waterTarget,
        sleepTarget: ng.sleepTarget,
        stepsTarget: ng.stepsTarget,
      },
      totals,
      completionRate: {
        water: totals.days ? totals.waterMetDays / totals.days : 0,
        sleep: totals.days ? totals.sleepMetDays / totals.days : 0,
        steps: totals.days ? totals.stepsMetDays / totals.days : 0,
      },
      streak: { current: cur, best },
      days: entries.map(e => ({
        date: e.date,
        waterCount: e.waterCount,
        sleepHours: e.sleepHours,
        steps: e.steps,
        completed: e.completed,
      })),
    });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Failed to load stats' });
  }
};
