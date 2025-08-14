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
//     animationFile: 'jumping-jacks.json',
//   },
//   {
//     name: 'T-Plank',
//     category: 'Core',
//     description: 'A plank variation that enhances core stability and shoulder strength.',
//     tips: 'Engage your core and keep your body in a straight line during rotation.',
//     targetMuscles: ['Abs', 'Obliques', 'Shoulders'],
//     duration: '1 min',
//     animationFile: 'tPlank.json',
//   },
//   {
//     name: 'Squats',
//     category: 'Strength',
//     description: 'Builds leg strength and glutes using bodyweight resistance.',
//     tips: 'Keep your knees behind your toes and back straight.',
//     targetMuscles: ['Glutes', 'Quads', 'Hamstrings'],
//     duration: '15-20 reps',
//     animationFile: 'squats.json',
//   },
//   {
//     name: 'Split Jumps',
//     category: 'Cardio',
//     description: 'Explosive leg movement that builds power and endurance.',
//     tips: 'Land softly and keep balance throughout the movement.',
//     targetMuscles: ['Legs', 'Glutes', 'Cardio'],
//     duration: '1 min',
//     animationFile: 'Split-Jump.json',
//   },
//   {
//     name: 'Burpee and Jump',
//     category: 'Full Body',
//     description: 'A high-intensity full-body move that improves strength and endurance.',
//     tips: 'Explode into the jump and land with soft knees.',
//     targetMuscles: ['Chest', 'Legs', 'Core'],
//     duration: '1 min',
//     animationFile: 'burpee-and-jump.json',
//   },
//   {
//     name: 'Box Jump',
//     category: 'Strength',
//     description: 'Builds explosive leg power using plyometric movement.',
//     tips: 'Use arms for momentum, land softly, and stand tall.',
//     targetMuscles: ['Quads', 'Calves', 'Glutes'],
//     duration: '10-15 reps',
//     animationFile: 'box-jump-exercise.json',
//   },
//   {
//     name: 'Toe Tap (Push-Up Position)',
//     category: 'Core',
//     description: 'Combines stability and flexibility in a dynamic push-up position.',
//     tips: 'Engage your core, avoid rotating your hips.',
//     targetMuscles: ['Shoulders', 'Abs', 'Hamstrings'],
//     duration: '1 min',
//     animationFile: 'press-up-postion-toe-tap.json',
//   },
//   {
//     name: 'Clean and Press (Barbell)',
//     category: 'Strength',
//     description: 'Compound move to build full-body strength and power.',
//     tips: 'Lift with your legs and keep the bar close to your body.',
//     targetMuscles: ['Shoulders', 'Back', 'Legs'],
//     duration: '8-10 reps',
//     animationFile: 'double-Arm-clean-and-press-barbell.json',
//   },
//   {
//     name: 'Single Leg Hip Rotation',
//     category: 'Flexibility',
//     description: 'Improves hip mobility and balance.',
//     tips: 'Keep core engaged and perform slow, controlled rotations.',
//     targetMuscles: ['Hips', 'Glutes', 'Core'],
//     duration: '1 min each side',
//     animationFile: 'Single Leg Hip Rotation.json',
//   },
//   {
//     name: 'Military Push-up',
//     category: 'Strength',
//     description: 'Targets upper body with strict form and close grip.',
//     tips: 'Elbows should stay close to the body. Lower under control.',
//     targetMuscles: ['Chest', 'Triceps', 'Shoulders'],
//     duration: '10-15 reps',
//     animationFile: 'pushup.json',
//   },
//   {
//     name: 'Cobras',
//     category: 'Flexibility',
//     description: 'Strengthens lower back and stretches the front body.',
//     tips: 'Lift chest without straining the neck or lower back.',
//     targetMuscles: ['Lower Back', 'Spine', 'Chest'],
//     duration: '30-45 seconds',
//     animationFile: 'cobras.json',
//   },
//   {
//     name: 'Seated Abs Circles',
//     category: 'Core',
//     description: 'Rotational core movement that improves lower ab engagement.',
//     tips: 'Keep feet off the ground and move in smooth, controlled circles.',
//     targetMuscles: ['Abs', 'Obliques'],
//     duration: '45 seconds',
//     animationFile: 'Seated abs circles.json',
//   },
//   {
//     name: 'Punches',
//     category: 'Cardio',
//     description: 'Improves cardiovascular endurance and upper body speed.',
//     tips: 'Engage your core, keep elbows slightly bent.',
//     targetMuscles: ['Shoulders', 'Arms', 'Core'],
//     duration: '1 min',
//     animationFile: 'Punches.json',
//   },
//   {
//     name: 'Squat Quicks',
//     category: 'Cardio',
//     description: 'Rapid squats to increase heart rate and leg strength.',
//     tips: 'Keep feet planted and back upright.',
//     targetMuscles: ['Quads', 'Hamstrings', 'Glutes'],
//     duration: '45 seconds',
//     animationFile: 'Squat-quicks.json',
//   },
//   {
//     name: 'Step Up on Chair',
//     category: 'Strength',
//     description: 'Strengthens legs and glutes using elevated step.',
//     tips: 'Push through your heel and keep your balance.',
//     targetMuscles: ['Glutes', 'Quads', 'Hamstrings'],
//     duration: '10 reps each leg',
//     animationFile: 'Step Up On Chair.json',
//   },
//   {
//     name: 'Inchworm',
//     category: 'Flexibility',
//     description: 'Improves flexibility while warming up the body.',
//     tips: 'Move slowly, maintain core control throughout.',
//     targetMuscles: ['Hamstrings', 'Shoulders', 'Core'],
//     duration: '1 min',
//     animationFile: 'Inchworm.json',
//   },
//   {
//     name: 'Lunge',
//     category: 'Strength',
//     description: 'Strengthens lower body and improves stability.',
//     tips: 'Don’t let the front knee go past your toes.',
//     targetMuscles: ['Quads', 'Glutes', 'Hamstrings'],
//     duration: '10-12 reps each leg',
//     animationFile: 'Lunge.json',
//   },
//   {
//     name: 'Reverse Crunches',
//     category: 'Core',
//     description: 'Targets the lower abdominals with a controlled motion.',
//     tips: 'Lift hips without using momentum.',
//     targetMuscles: ['Lower Abs'],
//     duration: '15-20 reps',
//     animationFile: 'Reverse Crunches.json',
//   },
//   {
//     name: 'Staggered Push-ups',
//     category: 'Strength',
//     description: 'Push-up variation to challenge chest and triceps.',
//     tips: 'Alternate hand positions each set for balance.',
//     targetMuscles: ['Chest', 'Triceps', 'Core'],
//     duration: '10-12 reps',
//     animationFile: 'Staggered_push_ups.json',
//   },
//   {
//     name: 'Frog Press',
//     category: 'Core',
//     description: 'Crunch-style movement to target lower abs and thighs.',
//     tips: 'Control the press, avoid using momentum.',
//     targetMuscles: ['Abs', 'Hip Flexors'],
//     duration: '15-20 reps',
//     animationFile: 'frog_press.json',
//   }
// ];

// async function seedWorkouts() {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     });

//     await Workout.deleteMany();
//     const inserted = await Workout.insertMany(workouts);

//     console.log(`✅ Seeded ${inserted.length} workouts`);
//     mongoose.disconnect();
//   } catch (error) {
//     console.error('❌ Error seeding workouts:', error);
//     process.exit(1);
//   }
// }

// seedWorkouts();
// seedChallenges.js
const mongoose  = require('mongoose');
require('dotenv').config();

const Workout   = require('./models/Workout');
const Challenge = require('./models/Challenge');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  console.log('Seeding Full Body Starter challenge...');
  
  // Names must match existing workout names
  const names = [
    'Jumping Jacks',
    'Split Jump',
    'T-Plank',
    'Box Jump',
    'Military Push-up',
    'Clean and Press (Barbell)',
    'Cobras'
  ];
  const workouts = await Workout.find({ name: { $in: names } });

  if (workouts.length !== names.length) {
    console.error('❌ Some workouts not found:', workouts.map(w => w.name));
    process.exit(1);
  }

  // Remove old challenge if exists
  await Challenge.deleteMany({ title: 'Full Body Starter (7-day)' });

  const challenge = await Challenge.create({
    title: 'Full Body Starter (7-day)',
    description: 'A week-long introduction to full-body workouts.',
    durationDays: workouts.length,
    workouts: workouts.map((w, i) => ({ day: i + 1, workoutId: w._id }))
  });

  console.log(`✅ Created challenge: ${challenge.title} (ID: ${challenge._id})`);
  await mongoose.disconnect();
  console.log('Seeder finished.');
}

seed();