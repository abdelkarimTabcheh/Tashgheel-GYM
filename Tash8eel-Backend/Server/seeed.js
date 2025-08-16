// // // seedWorkouts.js
// // const mongoose = require('mongoose');
// // require('dotenv').config();

// // const Workout = require('./models/Workout');

// // const workouts = [
// //   {
// //     name: 'Jumping Jacks',
// //     category: 'Warm-up',
// //     description: 'A full-body cardio warm-up that increases heart rate and activates muscles.',
// //     tips: 'Keep your core tight, land softly, and maintain a steady rhythm.',
// //     targetMuscles: ['Legs', 'Shoulders', 'Cardio'],
// //     duration: '30 seconds',
// //     animationUrl: 'https://lottie.host/02dcc177-1404-4421-8741-768d667bab57/d9yFlS4unI.json'
// //   },
// //   {
// //     name: 'Clean and Press (Barbell)',
// //     category: 'Strength',
// //     description: 'Compound move to build full-body strength and power.',
// //     tips: 'Lift with your legs and keep the bar close to your body.',
// //     targetMuscles: ['Shoulders', 'Back', 'Legs'],
// //     duration: '8-10 reps',
// //     animationUrl: 'https://lottie.host/9e912f50-4ddd-468e-a61a-91f6d4fa3336/xMuk23xKXM.json'
// //   }
// // ];

// // async function seedWorkouts() {
// //   try {
// //     await mongoose.connect(process.env.MONGO_URI, {
// //       useNewUrlParser: true,
// //       useUnifiedTopology: true
// //     });
// //     console.log('Mongo connected. Seeding workouts…');

// //     // clear out any old data
// //     await Workout.deleteMany();

// //     // insert new
// //     const inserted = await Workout.insertMany(workouts);
// //     console.log(`✅ Seeded ${inserted.length} workouts:`);
// //     inserted.forEach(w => console.log(`   • ${w.name}`));

// //     await mongoose.disconnect();
// //     console.log('Mongo disconnected. Done.');
// //   } catch (err) {
// //     console.error('❌ ERROR seeding workouts:', err);
// //     process.exit(1);
// //   }
// // }

// // seedWorkouts();
// // seedMoreWorkouts.js
// const mongoose = require('mongoose');
// require('dotenv').config();

// const Workout = require('./models/Workout');

// const workouts = [

//   {
//     name: 'Split Jump',
//     category: 'Cardio',
//     description: 'Explosive leg movement that builds power and endurance.',
//     tips: 'Land softly and keep balance throughout the movement.',
//     targetMuscles: ['Legs', 'Glutes', 'Cardio'],
//     duration: '1 min',
//     animationUrl: 'https://lottie.host/5f43bad7-b53c-434a-8ec3-d2ed0f9c4b18/hSzA9zWhLG.lottie'
//   },
//   {
//     name: 'T-Plank',
//     category: 'Core',
//     description: 'A plank variation that enhances core stability and shoulder strength.',
//     tips: 'Engage your core and keep your body in a straight line during rotation.',
//     targetMuscles: ['Abs', 'Obliques', 'Shoulders'],
//     duration: '1 min',
//     animationUrl: 'https://lottie.host/556dd6e5-e16e-4259-b423-58886b70fd19/UDiQ9eWPSR.lottie'
//   },
//   {
//     name: 'Toe Tap (Push-Up Position)',
//     category: 'Core',
//     description: 'Combines stability and flexibility in a dynamic push-up position.',
//     tips: 'Engage your core; avoid rotating your hips.',
//     targetMuscles: ['Shoulders', 'Abs', 'Hamstrings'],
//     duration: '1 min',
//     animationUrl: 'https://lottie.host/4312cf31-cb25-4a3d-9cca-99bc741b5e89/6TAhZEgygK.lottie'
//   },
//   {
//     name: 'Box Jump',
//     category: 'Strength',
//     description: 'Builds explosive leg power using plyometric movement.',
//     tips: 'Use your arms for momentum; land softly and stand tall.',
//     targetMuscles: ['Quads', 'Calves', 'Glutes'],
//     duration: '10-15 reps',
//     animationUrl: 'https://lottie.host/d16b0d79-cdde-4c85-b6a6-13cd4e00d183/W8xHoPiw78.lottie'
//   },
//   {
//     name: 'Military Push-up',
//     category: 'Strength',
//     description: 'Targets the upper body with strict form and a close grip.',
//     tips: 'Keep elbows tight to your sides and lower under control.',
//     targetMuscles: ['Chest', 'Triceps', 'Shoulders'],
//     duration: '10-15 reps',
//     animationUrl: 'https://lottie.host/982b04ce-a644-44b8-89cf-d81d8ded3dee/JEyKKiK8pT.lottie'
//   },
//   {
//     name: 'Single Leg Hip Rotation',
//     category: 'Flexibility',
//     description: 'Improves hip mobility and balance.',
//     tips: 'Keep your core engaged and move in slow, controlled rotations.',
//     targetMuscles: ['Hips', 'Glutes', 'Core'],
//     duration: '1 min each side',
//     animationUrl: 'https://lottie.host/4279789b-ece1-47c9-be6a6-13cd4e00d183/W8xHoPiw78.lottie'
//   },
//   {
//     name: 'Cobras',
//     category: 'Flexibility',
//     description: 'Strengthens the lower back and stretches the front body.',
//     tips: 'Lift your chest without straining your neck or lower back.',
//     targetMuscles: ['Lower Back', 'Spine', 'Chest'],
//     duration: '30-45 seconds',
//     animationUrl: 'https://lottie.host/4ce5a1b6-e70d-4dcf-a6c7-1553227cc8ef/kiSO1H4tFZ.lottie'
//   },
//   {
//     name: 'Staggered Push-ups',
//     category: 'Strength',
//     description: 'Push-up variation to challenge chest and triceps.',
//     tips: 'Alternate hand positions each set for balance.',
//     targetMuscles: ['Chest', 'Triceps', 'Core'],
//     duration: '10-12 reps',
//     animationUrl: 'https://lottie.host/6e0c8ed0-272c-4249-bd91-6cab97242b60/u7TFEZwdmF.lottie'
//   },
//   {
//     name: 'Jumping Squats',
//     category: 'Cardio',
//     description: 'Rapid squats to increase heart rate and leg strength.',
//     tips: 'Keep feet planted and back upright.',
//     targetMuscles: ['Quads', 'Hamstrings', 'Glutes'],
//     duration: '45 seconds',
//     animationUrl: 'https://lottie.host/bab6c9a9-2fe1-41cb-b837-fba5d6323b9c/W6I7VByltn.lottie'
//   },
//   {
//     name: 'Dead Bug',
//     category: 'Core',
//     description: 'An ab exercise that stabilizes your core by alternating arm and leg movements while lying on your back.',
//     tips: 'Press your lower back into the floor and move slowly with control.',
//     targetMuscles: ['Abs', 'Hip Flexors', 'Lower Back'],
//     duration: '45 seconds',
//     animationUrl: 'https://lottie.host/a9d0a57a-e233-4960-afc8-f64c851089ab/a3UwrUV32B.lottie'
//   }
// ];

// async function seedMoreWorkouts() {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     });
//     console.log('Mongo connected. Seeding more workouts…');

//     // Insert without wiping existing data
//     const inserted = await Workout.insertMany(workouts);
//     console.log(`✅ Added ${inserted.length} exercises:`);
//     inserted.forEach(w => console.log(`   • ${w.name}`));

//     await mongoose.disconnect();
//     console.log('Mongo disconnected. Done.');
//   } catch (err) {
//     console.error('❌ ERROR seeding more workouts:', err);
//     process.exit(1);
//   }
// }

// seedMoreWorkouts();
// seedAllWorkouts.js


// const fs = require('fs');
// const path = require('path');
// const mongoose = require('mongoose');

// // Load .env (tweak path if your env file is elsewhere)
// const envPaths = [
//   path.join(__dirname, '.env'),
//   path.join(__dirname, 'Server', '.env'),
//   path.join(__dirname, '..', '.env'),
// ];
// for (const p of envPaths) {
//   if (fs.existsSync(p)) {
//     require('dotenv').config({ path: p });
//     break;
//   }
// }

// const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.MONGO_URL;
// if (!MONGO_URI) {
//   console.error('❌ MONGO_URI not set. Put it in .env or pass via shell.');
//   process.exit(1);
// }

// // If your model lives at ./models/Workout, change this path:
// const Workout = require('./models/Workout');

// const workouts = [
//   // ===== Existing (from your list) =====
//   {
//     name: 'Clean and Press (Barbell)',
//     category: 'Strength',
//     description: 'Compound move to build full-body strength and power.',
//     tips: 'Lift with your legs and keep the bar close to your body.',
//     targetMuscles: ['Shoulders', 'Back', 'Legs'],
//     duration: '8-10 reps',
//     animationUrl: 'https://lottie.host/9e912f50-4ddd-468e-a61a-91f6d4fa3336/xMuk23xKXM.json'
//   },
//   {
//     name: 'Jumping Jacks',
//     category: 'Warm-up',
//     description: 'A full-body cardio warm-up that increases heart rate and activates muscles.',
//     tips: 'Keep your core tight, land softly, and maintain a steady rhythm.',
//     targetMuscles: ['Legs', 'Shoulders', 'Cardio'],
//     duration: '30 seconds',
//     animationUrl: 'https://lottie.host/02dcc177-1404-4421-8741-768d667bab57/d9yFlS4unI.json'
//   },
//   {
//     name: 'Lottie Bundle Test',
//     category: 'Test',
//     description: 'Just checking if a .lottie file loads correctly.',
//     tips: 'No special tips.',
//     targetMuscles: ['Test'],
//     duration: '10s',
//     animationUrl: 'https://lottie.host/3b702902-2997-49a7-a586-3ce746f3a71b/tXwhSYHa6V.lottie'
//   },
//   {
//     name: 'Burpee and Jump',
//     category: 'Full Body',
//     description: 'A high-intensity full-body move that improves strength and endurance.',
//     tips: 'Explode into the jump and land with soft knees.',
//     targetMuscles: ['Chest', 'Legs', 'Core'],
//     duration: '1 min',
//     animationUrl: 'https://lottie.host/3b702902-2997-49a7-a586-3ce746f3a71b/tXwhSYHa6V.lottie'
//   },
//   {
//     name: 'Box Jump',
//     category: 'Strength',
//     description: 'Builds explosive leg power using plyometric movement.',
//     tips: 'Use your arms for momentum; land softly and stand tall.',
//     targetMuscles: ['Quads', 'Calves', 'Glutes'],
//     duration: '10-15 reps',
//     animationUrl: 'https://lottie.host/d16b0d79-cdde-4c85-b6a6-13cd4e00d183/W8xHoPiw78.lottie'
//   },
//   {
//     name: 'Split Jump',
//     category: 'Cardio',
//     description: 'Explosive leg movement that builds power and endurance.',
//     tips: 'Land softly and keep balance throughout the movement.',
//     targetMuscles: ['Legs', 'Glutes', 'Cardio'],
//     duration: '1 min',
//     animationUrl: 'https://lottie.host/5f43bad7-b53c-434a-8ec3-d2ed0f9c4b18/hSzA9zWhLG.lottie'
//   },
//   {
//     name: 'Cobras',
//     category: 'Flexibility',
//     description: 'Strengthens the lower back and stretches the front body.',
//     tips: 'Lift your chest without straining your neck or lower back.',
//     targetMuscles: ['Lower Back', 'Spine', 'Chest'],
//     duration: '30-45 seconds',
//     animationUrl: 'https://lottie.host/4ce5a1b6-e70d-4dcf-a6c7-1553227cc8ef/kiSO1H4tFZ.lottie'
//   },
//   {
//     name: 'Toe Tap (Push-Up Position)',
//     category: 'Core',
//     description: 'Combines stability and flexibility in a dynamic push-up position.',
//     tips: 'Engage your core; avoid rotating your hips.',
//     targetMuscles: ['Shoulders', 'Abs', 'Hamstrings'],
//     duration: '1 min',
//     animationUrl: 'https://lottie.host/4312cf31-cb25-4a3d-9cca-99bc741b5e89/6TAhZEgygK.lottie'
//   },
//   {
//     name: 'T-Plank',
//     category: 'Core',
//     description: 'A plank variation that enhances core stability and shoulder strength.',
//     tips: 'Engage your core and keep your body in a straight line during rotation.',
//     targetMuscles: ['Abs', 'Obliques', 'Shoulders'],
//     duration: '1 min',
//     animationUrl: 'https://lottie.host/556dd6e5-e16e-4259-b423-58886b70fd19/UDiQ9eWPSR.lottie'
//   },
//   {
//     name: 'Military Push-up',
//     category: 'Strength',
//     description: 'Targets the upper body with strict form and a close grip.',
//     tips: 'Keep elbows tight to your sides and lower under control.',
//     targetMuscles: ['Chest', 'Triceps', 'Shoulders'],
//     duration: '10-15 reps',
//     animationUrl: 'https://lottie.host/982b04ce-a644-44b8-89cf-d81d8ded3dee/JEyKKiK8pT.lottie'
//   },
//   {
//     name: 'Single Leg Hip Rotation',
//     category: 'Flexibility',
//     description: 'Improves hip mobility and balance.',
//     tips: 'Keep your core engaged and move in slow, controlled rotations.',
//     targetMuscles: ['Hips', 'Glutes', 'Core'],
//     duration: '1 min each side',
//     animationUrl: 'https://lottie.host/4279789b-ece1-47c9-be6a-13cd4e00d183/W8xHoPiw78.lottie'
//   },
//   {
//     name: 'Staggered Push-ups',
//     category: 'Strength',
//     description: 'Push-up variation to challenge chest and triceps.',
//     tips: 'Alternate hand positions each set for balance.',
//     targetMuscles: ['Chest', 'Triceps', 'Core'],
//     duration: '10-12 reps',
//     animationUrl: 'https://lottie.host/6e0c8ed0-272c-4249-bd91-6cab97242b60/u7TFEZwdmF.lottie'
//   },
//   {
//     name: 'Jumping Squats',
//     category: 'Cardio',
//     description: 'Rapid squats to increase heart rate and leg strength.',
//     tips: 'Keep feet planted and back upright.',
//     targetMuscles: ['Quads', 'Hamstrings', 'Glutes'],
//     duration: '45 seconds',
//     animationUrl: 'https://lottie.host/bab6c9a9-2fe1-41cb-b837-fba5d6323b9c/W6I7VByltn.lottie'
//   },
//   {
//     name: 'Dead Bug',
//     category: 'Core',
//     description: 'An ab exercise that stabilizes your core by alternating arm and leg movements while lying on your back.',
//     tips: 'Press your lower back into the floor and move slowly with control.',
//     targetMuscles: ['Abs', 'Hip Flexors', 'Lower Back'],
//     duration: '45 seconds',
//     animationUrl: 'https://lottie.host/a9d0a57a-e233-4960-afc8-f64c851089ab/a3UwrUV32B.lottie'
//   },

//   // ===== New 4 you requested =====
//   {
//     name: 'Kettlebell Swings',
//     category: 'Full Body',
//     description: 'Powerful hip-hinge move for explosive strength and conditioning.',
//     tips: 'Hinge at the hips, keep a neutral spine, and drive the bell with your hips—not your arms.',
//     targetMuscles: ['Glutes', 'Hamstrings', 'Lower Back', 'Core', 'Shoulders'],
//     duration: '12-15 reps',
//     animationUrl: 'https://lottie.host/0e1888e3-30a4-404b-ab98-7a4067b4bac4/BFyrRwUQbv.lottie'
//   },
//   {
//     name: 'Reverse Crunches',
//     category: 'Core',
//     description: 'Lower-ab focused movement by curling the pelvis toward the ribcage.',
//     tips: 'Exhale as you curl; avoid swinging your legs—control the motion.',
//     targetMuscles: ['Lower Abs', 'Abs'],
//     duration: '12-15 reps',
//     animationUrl: 'https://lottie.host/8ea256db-5ac1-445d-8044-74e5d2293929/wHv0vrh8rq.lottie'
//   },
//   {
//     name: 'Shoulder Stretch',
//     category: 'Flexibility',
//     description: 'Mobility drill to ease shoulder tightness and improve overhead range.',
//     tips: 'Keep the neck relaxed and breathe; don’t force the range.',
//     targetMuscles: ['Shoulders', 'Upper Back', 'Chest'],
//     duration: '30 seconds each side',
//     animationUrl: 'https://lottie.host/f53d5634-0dad-42c4-90ed-56d5a3225631/sifW7VB8mX.lottie'
//   },
//   {
//     name: 'Deadlifts',
//     category: 'Strength',
//     description: 'Classic hip-hinge lift to develop posterior-chain strength.',
//     tips: 'Brace your core, keep the bar (or weight) close, and push the floor away.',
//     targetMuscles: ['Hamstrings', 'Glutes', 'Lower Back'],
//     duration: '8-10 reps',
//     animationUrl: 'https://lottie.host/75f9096b-79e3-464a-8b14-c01035800b91/V2BSdqhGYU.lottie'
//   }
// ];

// (async function reseed() {
//   try {
//     await mongoose.connect(MONGO_URI);
//     console.log('✅ Connected to Mongo');

//     // (Optional) quick backup to a file before wipe:
//     const existing = await Workout.find({}).lean();
//     if (existing.length) {
//       const backupPath = path.join(__dirname, `workouts-backup-${Date.now()}.json`);
//       fs.writeFileSync(backupPath, JSON.stringify(existing, null, 2));
//       console.log(`🛟 Backed up ${existing.length} existing workouts → ${path.basename(backupPath)}`);
//     }

//     // Wipe and seed
//     const del = await Workout.deleteMany({});
//     console.log(`🧹 Removed ${del.deletedCount} existing workouts`);

//     const inserted = await Workout.insertMany(workouts);
//     console.log(`🌱 Inserted ${inserted.length} workouts`);
//   } catch (err) {
//     console.error('❌ Reseed error:', err);
//     process.exit(1);
//   } finally {
//     await mongoose.disconnect().catch(() => {});
//     console.log('🔌 Disconnected');
//   }
// })();
/**
 * scripts/seedChallenge.js
 * Usage:
 *   node scripts/seedChallenge.js --title="Balanced 7-Day Program" --days=7 --desc="Warm-up, exercise, stretch every day"
 */
/**
 * seeed.js — no external CLI deps
 * Run:
 *   node seeed.js --title="Balanced 7-Day Program" --days=7 --desc="Warm-up + Exercise + Stretch each day"
 *
 * Uses categories:
 *   Warm-up  -> /warm-?up/i
 *   Exercise -> ['Strength','Cardio','Full Body','Core']
 *   Stretch  -> /(flexibility|stretch|relax)/i
 */

// require('dotenv').config(); // safe even if dotenvx injected it already
// const mongoose = require('mongoose');

// // ✅ adjust these paths if your models are elsewhere
// const Workout = require('./models/Workout');
// const Challenge = require('./models/Challenge');

// // --- tiny arg parser (handles --key=value and --key value) ---
// function parseArgs(argv) {
//   const out = {};
//   for (let i = 0; i < argv.length; i++) {
//     const a = argv[i];
//     if (!a.startsWith('--')) continue;
//     const eq = a.indexOf('=');
//     if (eq > -1) {
//       const k = a.slice(2, eq);
//       const v = a.slice(eq + 1);
//       out[k] = v;
//     } else {
//       const k = a.slice(2);
//       const nxt = argv[i + 1];
//       if (!nxt || nxt.startsWith('--')) {
//         out[k] = true;
//       } else {
//         out[k] = nxt;
//         i++;
//       }
//     }
//   }
//   return out;
// }

// const args = parseArgs(process.argv.slice(2));
// const TITLE = args.title || 'Balanced 7-Day Challenge';
// const DAYS = Math.max(1, Number(args.days || 7));
// const DESC = args.desc || 'Each day includes warm-up, main exercise, and stretching/relaxation.';

// function rrPicker(arr) {
//   let i = 0;
//   return () => (arr.length ? arr[(i++) % arr.length] : null);
// }

// (async () => {
//   const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/fitness';
//   console.log('Connecting to:', uri);
//   await mongoose.connect(uri);
//   console.log('✅ MongoDB connected');

//   try {
//     // 1) Fetch buckets
//     const warmups = await Workout.find({ category: { $regex: /warm-?up/i } }).lean();
//     const exercises = await Workout.find({ category: { $in: ['Strength', 'Cardio', 'Full Body', 'Core'] } }).lean();
//     const stretches = await Workout.find({ category: { $regex: /(flexibility|stretch|relax)/i } }).lean();

//     console.log(`Found: warmups=${warmups.length}, exercises=${exercises.length}, stretches=${stretches.length}`);

//     if (!warmups.length || !exercises.length || !stretches.length) {
//       throw new Error(
//         'Not enough workouts to build the challenge.\n' +
//         `Warm-ups: ${warmups.length}, Exercises: ${exercises.length}, Stretches: ${stretches.length}`
//       );
//     }

//     const pickWU = rrPicker(warmups);
//     const pickEX = rrPicker(exercises);
//     const pickST = rrPicker(stretches);

//     // 2) Build challenge lines: 3 entries per day
//     const lines = [];
//     for (let d = 1; d <= DAYS; d++) {
//       const wu = pickWU();
//       const ex = pickEX();
//       const st = pickST();

//       if (!wu?._id || !ex?._id || !st?._id) {
//         throw new Error(`Day ${d}: missing _id in picked workouts. Check DB records.`);
//       }

//       lines.push(
//         { day: d, workoutId: wu._id },
//         { day: d, workoutId: ex._id },
//         { day: d, workoutId: st._id }
//       );
//     }

//     // 3) Create challenge
//     const challenge = await Challenge.create({
//       title: TITLE,
//       description: DESC,
//       durationDays: DAYS,
//       workouts: lines,
//     });

//     console.log('🎉 Challenge created:');
//     console.log({
//       _id: challenge._id.toString(),
//       title: challenge.title,
//       durationDays: challenge.durationDays,
//       totalLines: challenge.workouts.length, // should be DAYS * 3
//     });

//     console.log('✅ Done.');
//   } catch (err) {
//     console.error('❌ Seed failed:', err?.message || err);
//     process.exitCode = 1;
//   } finally {
//     await mongoose.disconnect();
//     console.log('🔌 MongoDB disconnected');
//   }
// })();
require('dotenv').config();
const mongoose = require('mongoose');

// ✅ Update these paths if needed
const Workout = require('./models/Workout');
const Challenge = require('./models/Challenge');

// --- tiny arg parser ---
function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const eq = a.indexOf('=');
    if (eq > -1) {
      out[a.slice(2, eq)] = a.slice(eq + 1);
    } else {
      const k = a.slice(2);
      const v = argv[i + 1];
      if (!v || v.startsWith('--')) out[k] = true;
      else { out[k] = v; i++; }
    }
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
const TITLE_PREFIX = args.prefix || '';

const THEMES = [
  {
    title: 'Arm & Shoulder Challenge',
    days: 5,
    exerciseCategories: ['Strength', 'Full Body', 'Core'],
    exerciseTargets: ['Shoulders', 'Triceps', 'Chest', 'Upper Back'],
    stretchTargets: ['Shoulders', 'Chest', 'Upper Back']
  },
  {
    title: 'Leg Power Challenge',
    days: 5,
    exerciseCategories: ['Strength', 'Cardio', 'Full Body'],
    exerciseTargets: ['Quads', 'Hamstrings', 'Glutes', 'Calves', 'Legs'],
    stretchTargets: ['Quads', 'Hamstrings', 'Glutes', 'Calves', 'Legs']
  },
  {
    title: 'Core Stability Challenge',
    days: 5,
    exerciseCategories: ['Core', 'Strength', 'Full Body'],
    exerciseTargets: ['Abs', 'Obliques', 'Core', 'Lower Back', 'Hip Flexors'],
    stretchTargets: ['Abs', 'Obliques', 'Core', 'Lower Back', 'Spine']
  },
  {
    title: 'Full-Body Ignite',
    days: 7,
    exerciseCategories: ['Full Body', 'Strength', 'Cardio'],
    exerciseTargets: [], // any of these categories
    stretchTargets: ['Hamstrings', 'Glutes', 'Shoulders', 'Chest', 'Lower Back', 'Hips']
  },
  {
    title: 'Cardio Conditioning',
    days: 4,
    exerciseCategories: ['Cardio', 'Full Body'],
    exerciseTargets: ['Cardio', 'Legs', 'Shoulders'], // via targetMuscles if present
    stretchTargets: ['Hamstrings', 'Calves', 'Hips', 'Shoulders']
  },
  {
    title: 'Mobility & Flexibility Reset',
    days: 7,
    // Main work is mobility/flexibility/core-controlled moves
    exerciseCategories: ['Flexibility', 'Core'],
    exerciseTargets: ['Hips', 'Shoulders', 'Lower Back', 'Spine'],
    stretchTargets: ['Hips', 'Shoulders', 'Lower Back', 'Spine']
  },
  {
    title: 'Back & Posterior Chain',
    days: 5,
    exerciseCategories: ['Strength', 'Full Body', 'Core'],
    exerciseTargets: ['Back', 'Lower Back', 'Hamstrings', 'Glutes'],
    stretchTargets: ['Lower Back', 'Hamstrings', 'Glutes', 'Back']
  }
];

// --- helpers ---
function rrPicker(arr) {
  let i = 0;
  return () => (arr.length ? arr[i++ % arr.length] : null);
}

function shuffle(a) {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Build query utilities
async function getWarmups() {
  return Workout.find({ category: { $regex: /warm-?up/i } }).lean();
}

async function getStretches(targets = []) {
  const base = await Workout.find({
    category: { $regex: /(flexibility|stretch|relax)/i }
  }).lean();

  if (!targets?.length) return base;

  const filtered = base.filter(w =>
    Array.isArray(w.targetMuscles) && w.targetMuscles.some(m => targets.includes(m))
  );

  return filtered.length ? filtered : base; // fallback
}

async function getExercises(categories = [], targets = []) {
  let qry = {};
  if (categories?.length) {
    qry.category = { $in: categories };
  }
  const base = await Workout.find(qry).lean();

  // Remove obvious tests if any
  const withoutTests = base.filter(w => !/test/i.test(w?.category || '') && !/test/i.test(w?.name || ''));

  if (!targets?.length) return withoutTests;

  const filtered = withoutTests.filter(w =>
    Array.isArray(w.targetMuscles) && w.targetMuscles.some(m => targets.includes(m))
  );

  return filtered.length ? filtered : withoutTests; // fallback
}

async function createChallengeByTheme(theme, warmupsGlobal) {
  const {
    title, days,
    exerciseCategories = ['Strength', 'Full Body', 'Core', 'Cardio'],
    exerciseTargets = [],
    stretchTargets = []
  } = theme;

  const warmups = warmupsGlobal.length ? warmupsGlobal : await getWarmups();
  const exercises = await getExercises(exerciseCategories, exerciseTargets);
  const stretches = await getStretches(stretchTargets);

  if (!warmups.length) throw new Error(`No warm-ups found for "${title}"`);
  if (!exercises.length) throw new Error(`No exercises found for "${title}" (check categories/targets)`);
  if (!stretches.length) throw new Error(`No stretches found for "${title}"`);

  // shuffle for variety, then round-robin
  const pickWU = rrPicker(shuffle(warmups));
  const pickEX = rrPicker(shuffle(exercises));
  const pickST = rrPicker(shuffle(stretches));

  const workouts = [];
  for (let d = 1; d <= days; d++) {
    const wu = pickWU();
    const ex = pickEX();
    const st = pickST();

    if (!wu?._id || !ex?._id || !st?._id) {
      throw new Error(`"${title}" day ${d}: picked invalid workout without _id`);
    }

    // Avoid accidental duplicates in the same day
    const ids = new Set([String(wu._id), String(ex._id), String(st._id)]);
    if (ids.size < 3) {
      // re-pick stretch if duplicate
      let tryCount = 0;
      let st2 = st;
      while (ids.size < 3 && tryCount < stretches.length) {
        st2 = pickST();
        ids.clear();
        ids.add(String(wu._id)); ids.add(String(ex._id)); ids.add(String(st2._id));
        tryCount++;
      }
      if (ids.size === 3) {
        workouts.push({ day: d, workoutId: wu._id }, { day: d, workoutId: ex._id }, { day: d, workoutId: st2._id });
        continue;
      }
    }

    workouts.push(
      { day: d, workoutId: wu._id },
      { day: d, workoutId: ex._id },
      { day: d, workoutId: st._id },
    );
  }

  const doc = await Challenge.create({
    title: TITLE_PREFIX + title,
    description: 'Each day includes a warm-up, main exercise, and stretching/relaxation.',
    durationDays: days,
    workouts
  });

  return {
    _id: doc._id.toString(),
    title: doc.title,
    durationDays: doc.durationDays,
    lines: doc.workouts.length
  };
}

(async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/fitness';
  console.log('Connecting to Mongo:', uri);
  await mongoose.connect(uri);
  console.log('✅ Connected');

  try {
    const warmupsGlobal = await getWarmups();
    console.log(`Warm-ups available: ${warmupsGlobal.length}`);

    const results = [];
    for (const theme of THEMES) {
      try {
        const res = await createChallengeByTheme(theme, warmupsGlobal);
        results.push(res);
        console.log('🎯 Created challenge:', res);
      } catch (err) {
        console.error(`❌ Failed creating "${theme.title}":`, err.message);
      }
    }

    console.log('\n==== Summary ====');
    results.forEach(r => {
      console.log(`- ${r.title}  (days=${r.durationDays}, lines=${r.lines}, id=${r._id})`);
    });
    console.log('=================\n');
  } catch (e) {
    console.error('Seed failed:', e?.message || e);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected');
  }
})();