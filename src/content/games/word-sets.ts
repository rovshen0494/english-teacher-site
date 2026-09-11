export interface GameWord {
  word: string;
  emoji: string;
  hint: string;
}

export interface WordSet {
  slug: string;
  title: string;
  emoji: string;
  level: string;
  words: GameWord[];
}

export const WORD_SETS: WordSet[] = [
  {
    slug: "animals",
    title: "Animals",
    emoji: "🐾",
    level: "A1 Beginner",
    words: [
      { word: "dog", emoji: "🐶", hint: "A friendly pet that barks and loves walks." },
      { word: "cat", emoji: "🐱", hint: "A small pet that says 'meow' and likes to sleep." },
      { word: "elephant", emoji: "🐘", hint: "A huge grey animal with a long trunk." },
      { word: "lion", emoji: "🦁", hint: "A strong wild cat known as the king of the jungle." },
      { word: "monkey", emoji: "🐒", hint: "A clever animal that climbs trees and eats bananas." },
      { word: "fish", emoji: "🐠", hint: "An animal that swims and lives in water." },
      { word: "bird", emoji: "🐦", hint: "An animal with wings and feathers that can fly." },
      { word: "snake", emoji: "🐍", hint: "A long animal with no legs that slithers on the ground." },
      { word: "rabbit", emoji: "🐰", hint: "A small animal with long ears that hops." },
      { word: "bear", emoji: "🐻", hint: "A big, furry wild animal that loves honey." },
    ],
  },
  {
    slug: "food",
    title: "Food",
    emoji: "🍽️",
    level: "A1 Beginner",
    words: [
      { word: "apple", emoji: "🍎", hint: "A round, crunchy fruit that can be red or green." },
      { word: "banana", emoji: "🍌", hint: "A long yellow fruit that monkeys love to eat." },
      { word: "bread", emoji: "🍞", hint: "A soft food made from flour, often eaten for breakfast." },
      { word: "rice", emoji: "🍚", hint: "Small white grains that are a common meal in Asia." },
      { word: "pizza", emoji: "🍕", hint: "A round Italian dish with cheese and toppings." },
      { word: "milk", emoji: "🥛", hint: "A white drink that comes from cows." },
      { word: "egg", emoji: "🥚", hint: "A food from chickens, often boiled or fried." },
      { word: "chicken", emoji: "🍗", hint: "A popular meat that many people eat for dinner." },
      { word: "cake", emoji: "🎂", hint: "A sweet dessert often eaten on birthdays." },
      { word: "water", emoji: "💧", hint: "A clear drink everyone needs to stay healthy." },
    ],
  },
  {
    slug: "school",
    title: "School",
    emoji: "🏫",
    level: "A1 Beginner",
    words: [
      { word: "pencil", emoji: "✏️", hint: "A tool used for writing or drawing." },
      { word: "book", emoji: "📚", hint: "Pages full of words and pictures that you read." },
      { word: "backpack", emoji: "🎒", hint: "A bag students carry on their back to school." },
      { word: "ruler", emoji: "📏", hint: "A flat tool used to measure or draw straight lines." },
      { word: "scissors", emoji: "✂️", hint: "A tool with two blades used for cutting paper." },
      { word: "chair", emoji: "🪑", hint: "Furniture you sit on in the classroom." },
      { word: "clock", emoji: "🕐", hint: "Something on the wall that tells you the time." },
      { word: "computer", emoji: "🖥️", hint: "A machine used for typing, learning, and going online." },
      { word: "paper", emoji: "📄", hint: "A thin material you write or draw on." },
      { word: "teacher", emoji: "🧑‍🏫", hint: "The person who helps you learn in class." },
    ],
  },
  {
    slug: "sports",
    title: "Sports",
    emoji: "⚽",
    level: "A1-A2",
    words: [
      { word: "football", emoji: "⚽", hint: "A sport played with a round ball and two goals." },
      { word: "basketball", emoji: "🏀", hint: "A sport where players shoot a ball into a hoop." },
      { word: "tennis", emoji: "🎾", hint: "A sport played with rackets and a small yellow ball." },
      { word: "swimming", emoji: "🏊", hint: "A sport where you move your body through water." },
      { word: "running", emoji: "🏃", hint: "Moving quickly on foot, often for exercise or a race." },
      { word: "baseball", emoji: "⚾", hint: "A sport played with a bat and a ball on a diamond field." },
      { word: "volleyball", emoji: "🏐", hint: "A sport where players hit a ball over a net." },
      { word: "cycling", emoji: "🚴", hint: "Riding a bicycle, often as a sport or exercise." },
      { word: "skiing", emoji: "⛷️", hint: "A winter sport where you slide down snowy mountains." },
      { word: "boxing", emoji: "🥊", hint: "A sport where two people fight wearing padded gloves." },
    ],
  },
  {
    slug: "jobs",
    title: "Jobs",
    emoji: "💼",
    level: "A2-B1",
    words: [
      { word: "doctor", emoji: "🩺", hint: "A person who helps sick people feel better." },
      { word: "chef", emoji: "👨‍🍳", hint: "A person who cooks food in a restaurant." },
      { word: "police officer", emoji: "👮", hint: "A person who keeps people safe and follows the law." },
      { word: "firefighter", emoji: "👨‍🚒", hint: "A person who puts out fires and rescues people." },
      { word: "farmer", emoji: "🧑‍🌾", hint: "A person who grows crops and raises animals." },
      { word: "pilot", emoji: "✈️", hint: "A person who flies an airplane." },
      { word: "nurse", emoji: "🧑‍⚕️", hint: "A person who takes care of patients in a hospital." },
      { word: "engineer", emoji: "🧑‍🔧", hint: "A person who builds and fixes machines or structures." },
      { word: "artist", emoji: "🎨", hint: "A person who creates paintings or other art." },
      { word: "dentist", emoji: "🦷", hint: "A person who takes care of your teeth." },
    ],
  },
  {
    slug: "weather",
    title: "Weather",
    emoji: "⛅",
    level: "A1 Beginner",
    words: [
      { word: "sunny", emoji: "☀️", hint: "When the sky is clear and the sun is shining." },
      { word: "rainy", emoji: "🌧️", hint: "When water falls from the clouds." },
      { word: "cloudy", emoji: "☁️", hint: "When the sky is covered with clouds." },
      { word: "snowy", emoji: "❄️", hint: "When white flakes fall from the sky in winter." },
      { word: "windy", emoji: "🌬️", hint: "When the air moves quickly outside." },
      { word: "stormy", emoji: "⛈️", hint: "When there is heavy rain, thunder, and lightning." },
      { word: "hot", emoji: "🥵", hint: "A very warm temperature that makes you sweat." },
      { word: "cold", emoji: "🥶", hint: "A very low temperature that makes you shiver." },
      { word: "foggy", emoji: "🌫️", hint: "When it's hard to see because of thick mist in the air." },
      { word: "rainbow", emoji: "🌈", hint: "A colourful arch in the sky that appears after rain." },
    ],
  },
  {
    slug: "technology",
    title: "Technology",
    emoji: "💻",
    level: "A2-B1",
    words: [
      { word: "laptop", emoji: "💻", hint: "A small, portable computer." },
      { word: "phone", emoji: "📱", hint: "A small device used to call or message people." },
      { word: "internet", emoji: "🌐", hint: "A network that connects computers around the world." },
      { word: "camera", emoji: "📷", hint: "A device used to take photos." },
      { word: "television", emoji: "📺", hint: "A device used to watch shows and movies." },
      { word: "robot", emoji: "🤖", hint: "A machine that can move and do tasks automatically." },
      { word: "keyboard", emoji: "⌨️", hint: "A set of buttons used to type on a computer." },
      { word: "headphones", emoji: "🎧", hint: "A device worn on the ears to listen to music privately." },
      { word: "printer", emoji: "🖨️", hint: "A machine that puts text or pictures onto paper." },
      { word: "battery", emoji: "🔋", hint: "A device that stores power for electronics." },
    ],
  },
  {
    slug: "daily-life",
    title: "Daily Life",
    emoji: "🏠",
    level: "A1-A2",
    words: [
      { word: "breakfast", emoji: "🍳", hint: "The first meal of the day, eaten in the morning." },
      { word: "shower", emoji: "🚿", hint: "Where you wash your body while standing under water." },
      { word: "sleep", emoji: "😴", hint: "What you do at night to rest your body." },
      { word: "homework", emoji: "📝", hint: "School work you do at home after class." },
      { word: "family", emoji: "👪", hint: "The people you live with, like parents and siblings." },
      { word: "friend", emoji: "🧑‍🤝‍🧑", hint: "Someone you like and enjoy spending time with." },
      { word: "home", emoji: "🏠", hint: "The place where you live." },
      { word: "bicycle", emoji: "🚲", hint: "A vehicle with two wheels that you pedal." },
      { word: "umbrella", emoji: "☂️", hint: "Something you use to stay dry in the rain." },
      { word: "alarm clock", emoji: "⏰", hint: "Something that rings in the morning to wake you up." },
    ],
  },
];

export function getWordSet(slug: string): WordSet | undefined {
  return WORD_SETS.find((s) => s.slug === slug);
}
