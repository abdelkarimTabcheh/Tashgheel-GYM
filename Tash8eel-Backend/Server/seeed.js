// // seedWorkouts.js
// const mongoose = require('mongoose');
// require('dotenv').config();

// const Workout = require('./models/Workout');

// const workouts = [
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
//     name: 'Clean and Press (Barbell)',
//     category: 'Strength',
//     description: 'Compound move to build full-body strength and power.',
//     tips: 'Lift with your legs and keep the bar close to your body.',
//     targetMuscles: ['Shoulders', 'Back', 'Legs'],
//     duration: '8-10 reps',
//     animationUrl: 'https://lottie.host/9e912f50-4ddd-468e-a61a-91f6d4fa3336/xMuk23xKXM.json'
//   }
// ];

// async function seedWorkouts() {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     });
//     console.log('Mongo connected. Seeding workouts…');

//     // clear out any old data
//     await Workout.deleteMany();

//     // insert new
//     const inserted = await Workout.insertMany(workouts);
//     console.log(`✅ Seeded ${inserted.length} workouts:`);
//     inserted.forEach(w => console.log(`   • ${w.name}`));

//     await mongoose.disconnect();
//     console.log('Mongo disconnected. Done.');
//   } catch (err) {
//     console.error('❌ ERROR seeding workouts:', err);
//     process.exit(1);
//   }
// }

// seedWorkouts();
// seedMoreWorkouts.js
const mongoose = require('mongoose');
require('dotenv').config();

const Workout = require('./models/Workout');

const workouts = [
  {
    name: 'Split Jump',
    category: 'Cardio',
    description: 'Explosive leg movement that builds power and endurance.',
    tips: 'Land softly and keep balance throughout the movement.',
    targetMuscles: ['Legs', 'Glutes', 'Cardio'],
    duration: '1 min',
    animationUrl: 'https://lottie.host/5f43bad7-b53c-434a-8ec3-d2ed0f9c4b18/hSzA9zWhLG.lottie'
  },
  {
    name: 'T-Plank',
    category: 'Core',
    description: 'A plank variation that enhances core stability and shoulder strength.',
    tips: 'Engage your core and keep your body in a straight line during rotation.',
    targetMuscles: ['Abs', 'Obliques', 'Shoulders'],
    duration: '1 min',
    animationUrl: 'https://lottie.host/556dd6e5-e16e-4259-b423-58886b70fd19/UDiQ9eWPSR.lottie'
  },
  {
    name: 'Toe Tap (Push-Up Position)',
    category: 'Core',
    description: 'Combines stability and flexibility in a dynamic push-up position.',
    tips: 'Engage your core; avoid rotating your hips.',
    targetMuscles: ['Shoulders', 'Abs', 'Hamstrings'],
    duration: '1 min',
    animationUrl: 'https://lottie.host/4312cf31-cb25-4a3d-9cca-99bc741b5e89/6TAhZEgygK.lottie'
  },
  {
    name: 'Box Jump',
    category: 'Strength',
    description: 'Builds explosive leg power using plyometric movement.',
    tips: 'Use your arms for momentum; land softly and stand tall.',
    targetMuscles: ['Quads', 'Calves', 'Glutes'],
    duration: '10-15 reps',
    animationUrl: 'https://lottie.host/d16b0d79-cdde-4c85-b6a6-13cd4e00d183/W8xHoPiw78.lottie'
  },
  {
    name: 'Military Push-up',
    category: 'Strength',
    description: 'Targets the upper body with strict form and a close grip.',
    tips: 'Keep elbows tight to your sides and lower under control.',
    targetMuscles: ['Chest', 'Triceps', 'Shoulders'],
    duration: '10-15 reps',
    animationUrl: 'https://lottie.host/982b04ce-a644-44b8-89cf-d81d8ded3dee/JEyKKiK8pT.lottie'
  },
  {
    name: 'Single Leg Hip Rotation',
    category: 'Flexibility',
    description: 'Improves hip mobility and balance.',
    tips: 'Keep your core engaged and move in slow, controlled rotations.',
    targetMuscles: ['Hips', 'Glutes', 'Core'],
    duration: '1 min each side',
    animationUrl: 'https://lottie.host/4279789b-ece1-47c9-be6a6-13cd4e00d183/W8xHoPiw78.lottie'
  },
  {
    name: 'Cobras',
    category: 'Flexibility',
    description: 'Strengthens the lower back and stretches the front body.',
    tips: 'Lift your chest without straining your neck or lower back.',
    targetMuscles: ['Lower Back', 'Spine', 'Chest'],
    duration: '30-45 seconds',
    animationUrl: 'https://lottie.host/4ce5a1b6-e70d-4dcf-a6c7-1553227cc8ef/kiSO1H4tFZ.lottie'
  },
  {
    name: 'Staggered Push-ups',
    category: 'Strength',
    description: 'Push-up variation to challenge chest and triceps.',
    tips: 'Alternate hand positions each set for balance.',
    targetMuscles: ['Chest', 'Triceps', 'Core'],
    duration: '10-12 reps',
    animationUrl: 'https://lottie.host/6e0c8ed0-272c-4249-bd91-6cab97242b60/u7TFEZwdmF.lottie'
  },
  {
    name: 'Jumping Squats',
    category: 'Cardio',
    description: 'Rapid squats to increase heart rate and leg strength.',
    tips: 'Keep feet planted and back upright.',
    targetMuscles: ['Quads', 'Hamstrings', 'Glutes'],
    duration: '45 seconds',
    animationUrl: 'https://lottie.host/bab6c9a9-2fe1-41cb-b837-fba5d6323b9c/W6I7VByltn.lottie'
  },
  {
    name: 'Dead Bug',
    category: 'Core',
    description: 'An ab exercise that stabilizes your core by alternating arm and leg movements while lying on your back.',
    tips: 'Press your lower back into the floor and move slowly with control.',
    targetMuscles: ['Abs', 'Hip Flexors', 'Lower Back'],
    duration: '45 seconds',
    animationUrl: 'https://lottie.host/a9d0a57a-e233-4960-afc8-f64c851089ab/a3UwrUV32B.lottie'
  }
];

async function seedMoreWorkouts() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Mongo connected. Seeding more workouts…');

    // Insert without wiping existing data
    const inserted = await Workout.insertMany(workouts);
    console.log(`✅ Added ${inserted.length} exercises:`);
    inserted.forEach(w => console.log(`   • ${w.name}`));

    await mongoose.disconnect();
    console.log('Mongo disconnected. Done.');
  } catch (err) {
    console.error('❌ ERROR seeding more workouts:', err);
    process.exit(1);
  }
}

seedMoreWorkouts();
