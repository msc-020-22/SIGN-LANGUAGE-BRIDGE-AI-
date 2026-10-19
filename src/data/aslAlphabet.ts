import { SignAlphabetInfo } from '../types';

export const ASL_STATIC_CLASSES: string[] = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
  'T', 'U', 'V', 'W', 'X', 'Y'
];

export const CLASS_NAMES = ASL_STATIC_CLASSES;

// Mapping between model output class index (0..23), dataset label (0..24 excluding 9), and ASL letter
export const CLASS_TO_LETTER: Record<number, string> = {
  0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I',
  9: 'K', 10: 'L', 11: 'M', 12: 'N', 13: 'O', 14: 'P', 15: 'Q', 16: 'R',
  17: 'S', 18: 'T', 19: 'U', 20: 'V', 21: 'W', 22: 'X', 23: 'Y'
};

export const LETTER_TO_CLASS: Record<string, number> = Object.fromEntries(
  Object.entries(CLASS_TO_LETTER).map(([k, v]) => [v, parseInt(k, 10)])
);

export const DATASET_LABEL_TO_CLASS: Record<number, number> = {
  0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8,
  // 9 (J) is omitted from static Sign Language MNIST
  10: 9, 11: 10, 12: 11, 13: 12, 14: 13, 15: 14, 16: 15,
  17: 16, 18: 17, 19: 18, 20: 19, 21: 20, 22: 21, 23: 22, 24: 23
  // 25 (Z) is omitted from static Sign Language MNIST
};

export const CLASS_TO_DATASET_LABEL: Record<number, number> = Object.fromEntries(
  Object.entries(DATASET_LABEL_TO_CLASS).map(([label, cls]) => [cls, parseInt(label, 10)])
);

export const ASL_ALPHABET_DATA: SignAlphabetInfo[] = [
  {
    letter: 'A',
    classIndex: 0,
    datasetLabel: 0,
    description: 'Make a tight fist with your fingers curled inward and your thumb resting straight upright along the side of your index finger.',
    mnemonicTip: 'Think of an Apple you are holding beside your thumb.',
    commonMistakes: 'Do not tuck the thumb across the fingers (that is S or E). Keep thumb pressed against the side of the index finger.',
    difficulty: 'Easy',
    handShapeDescription: 'Fist with thumb vertical alongside the index finger',
    category: 'Fist',
    svgPathD: 'M 35 70 Q 30 50 35 35 Q 40 20 50 20 Q 60 20 62 35 L 62 65 Q 62 75 50 75 Z M 20 60 Q 15 45 22 40 Q 28 35 32 45 L 32 70 Q 28 80 20 75 Z'
  },
  {
    letter: 'B',
    classIndex: 1,
    datasetLabel: 1,
    description: 'Hold all four fingers flat and straight together pointing upwards, with your thumb tucked across your palm.',
    mnemonicTip: 'Four fingers form a flat Barrier or wall; thumb across the front.',
    commonMistakes: 'Spreading the fingers apart (that resembles a number 4). Keep fingers touching tightly.',
    difficulty: 'Easy',
    handShapeDescription: 'Flat open palm with 4 fingers together, thumb bent across palm',
    category: 'Open',
    svgPathD: 'M 30 80 L 30 20 Q 30 15 35 15 Q 40 15 40 20 L 40 80 M 40 20 L 40 12 Q 40 8 45 8 Q 50 8 50 12 L 50 80 M 50 20 L 50 15 Q 50 10 55 10 Q 60 10 60 15 L 60 80 M 60 25 L 60 20 Q 60 15 65 15 Q 70 15 70 20 L 70 80'
  },
  {
    letter: 'C',
    classIndex: 2,
    datasetLabel: 2,
    description: 'Curved hand forming the letter "C" with fingers arched over and thumb curved below, creating a half-circle.',
    mnemonicTip: 'Your entire hand literally outlines the letter C.',
    commonMistakes: 'Making the curve too flat or closing fingers completely to touch the thumb (that is O).',
    difficulty: 'Easy',
    handShapeDescription: 'Curved fingers and thumb opposing to form a C shape',
    category: 'Pinch',
    svgPathD: 'M 65 25 Q 40 20 30 45 Q 25 60 35 75 Q 45 85 65 80 Q 50 70 42 60 Q 40 45 50 35 Q 58 28 65 25 Z'
  },
  {
    letter: 'D',
    classIndex: 3,
    datasetLabel: 3,
    description: 'Index finger pointing straight up, while middle, ring, pinky fingers and thumb curl together to form an O shape at the base.',
    mnemonicTip: 'Index finger stands straight up while the remaining fingers form the round belly of the lowercase "d".',
    commonMistakes: 'Confusing with 1 (where thumb holds down other fingers without forming a circle).',
    difficulty: 'Medium',
    handShapeDescription: 'Index finger vertical, other 3 fingers touch thumb to form circular base',
    category: 'Fingers',
    svgPathD: 'M 45 15 L 45 55 M 40 55 Q 25 55 25 70 Q 25 85 45 85 Q 60 85 60 70 Q 60 55 45 55 Z'
  },
  {
    letter: 'E',
    classIndex: 4,
    datasetLabel: 4,
    description: 'All four fingertips curled tightly downward to rest on top of the thumb, which is tucked horizontally beneath them.',
    mnemonicTip: 'Fingertips perched neatly on the thumb like eggs in a nest.',
    commonMistakes: 'Curling fingers into a fist (that is A or S). Fingertips must sit on the thumb edge.',
    difficulty: 'Medium',
    handShapeDescription: 'Curled fingertips resting directly on top of tucked thumb',
    category: 'Fist',
    svgPathD: 'M 30 45 Q 35 30 45 30 Q 55 30 60 45 L 60 55 L 30 55 Z M 25 60 L 65 60 L 65 75 L 25 75 Z'
  },
  {
    letter: 'F',
    classIndex: 5,
    datasetLabel: 5,
    description: 'Touch the tip of your index finger to the tip of your thumb to form a circle, while middle, ring, and pinky fingers spread upright.',
    mnemonicTip: 'Looks like the universal "OK" gesture; three fingers Feathered out.',
    commonMistakes: 'Confusing with D (D has 1 finger up and 3 curled; F has 3 fingers up and index touching thumb).',
    difficulty: 'Easy',
    handShapeDescription: 'Thumb and index touch in circle, other three fingers extended upward',
    category: 'Fingers',
    svgPathD: 'M 35 50 Q 25 50 25 65 Q 25 80 40 80 Q 50 80 50 65 Q 50 50 35 50 Z M 50 45 L 55 15 M 60 45 L 65 18 M 70 50 L 75 25'
  },
  {
    letter: 'G',
    classIndex: 6,
    datasetLabel: 6,
    description: 'Point your index finger and thumb horizontally to the side, parallel to each other with a small gap, while other fingers are curled into palm.',
    mnemonicTip: 'Index and thumb pinch horizontally like measuring a tiny Gauge.',
    commonMistakes: 'Pointing fingers upward instead of horizontally across the chest.',
    difficulty: 'Medium',
    handShapeDescription: 'Index finger and thumb parallel and pointing horizontally, other fingers curled',
    category: 'Fingers',
    svgPathD: 'M 30 65 L 75 65 M 30 50 L 75 50 M 30 50 Q 15 50 15 65 Q 15 80 30 80 Z'
  },
  {
    letter: 'H',
    classIndex: 7,
    datasetLabel: 7,
    description: 'Extend both index and middle fingers horizontally side-by-side, with thumb tucked over the curled ring and pinky fingers.',
    mnemonicTip: 'Two fingers point sideways forming the two rails of an H.',
    commonMistakes: 'Pointing fingers upward (that is U or V). H is strictly horizontal.',
    difficulty: 'Medium',
    handShapeDescription: 'Index and middle fingers extended together horizontally',
    category: 'Fingers',
    svgPathD: 'M 30 45 L 80 45 M 30 58 L 80 58 M 30 45 Q 15 45 15 65 Q 15 80 30 80 Z'
  },
  {
    letter: 'I',
    classIndex: 8,
    datasetLabel: 8,
    description: 'Make a fist with all fingers tucked and thumb folded over them, but extend your pinky finger straight up.',
    mnemonicTip: 'The slender pinky finger stands tall like the lowercase letter "i".',
    commonMistakes: 'Allowing the thumb to stick out (that turns it into Y).',
    difficulty: 'Easy',
    handShapeDescription: 'Fist with only pinky finger extended straight upward',
    category: 'Fingers',
    svgPathD: 'M 65 15 L 65 65 Q 65 75 55 75 L 35 75 Q 25 75 25 65 L 25 50 Q 25 40 35 40 L 55 40'
  },
  {
    letter: 'K',
    classIndex: 9,
    datasetLabel: 10,
    description: 'Index finger points straight up, middle finger angles forward, and the thumb rests between them at the middle knuckle.',
    mnemonicTip: 'Index and middle fingers make a V while thumb creates the diagonal kick of letter K.',
    commonMistakes: 'Confusing with V (V has middle and index in same plane, thumb folded over ring finger).',
    difficulty: 'Challenging',
    handShapeDescription: 'Index vertical, middle tilted forward, thumb tucked between them',
    category: 'Fingers',
    svgPathD: 'M 40 15 L 40 75 M 40 45 L 60 25 M 30 65 L 50 48 Q 50 65 40 75'
  },
  {
    letter: 'L',
    classIndex: 10,
    datasetLabel: 11,
    description: 'Extend your index finger straight up and your thumb straight out at a 90-degree angle, with other fingers curled into palm.',
    mnemonicTip: 'Literally forms the sharp right-angle shape of capital "L".',
    commonMistakes: 'Angling the thumb downward instead of a crisp 90-degree horizontal position.',
    difficulty: 'Easy',
    handShapeDescription: 'Index finger vertical, thumb horizontal at 90 degrees, others folded',
    category: 'Fingers',
    svgPathD: 'M 35 15 L 35 70 L 75 70 Q 78 75 72 80 L 30 80 Q 25 80 25 70 L 25 15 Z'
  },
  {
    letter: 'M',
    classIndex: 11,
    datasetLabel: 12,
    description: 'Fist with thumb tucked underneath your first three fingers (index, middle, ring), popping out slightly between ring and pinky.',
    mnemonicTip: 'Three finger humps resting on top of the thumb represent the three legs of the letter M.',
    commonMistakes: 'Tucking under only two fingers (which is N). Count all three fingers over the thumb.',
    difficulty: 'Medium',
    handShapeDescription: 'Thumb tucked under three fingers (index, middle, ring)',
    category: 'Fist',
    svgPathD: 'M 25 75 L 25 35 Q 25 25 35 25 Q 45 25 45 35 Q 45 25 55 25 Q 65 25 65 35 Q 65 25 75 25 Q 85 25 85 45 L 85 75 Z'
  },
  {
    letter: 'N',
    classIndex: 12,
    datasetLabel: 13,
    description: 'Fist with thumb tucked underneath the first two fingers (index and middle), emerging between middle and ring fingers.',
    mnemonicTip: 'Two finger humps over the thumb represent the two legs of the letter N.',
    commonMistakes: 'Confusing with M (M has 3 fingers over thumb, N has 2 fingers over thumb).',
    difficulty: 'Medium',
    handShapeDescription: 'Thumb tucked under two fingers (index, middle)',
    category: 'Fist',
    svgPathD: 'M 25 75 L 25 35 Q 25 25 38 25 Q 50 25 50 35 Q 50 25 62 25 Q 75 25 75 45 L 75 75 Z'
  },
  {
    letter: 'O',
    classIndex: 13,
    datasetLabel: 14,
    description: 'All fingers curl downward and touch the thumb pad, forming a smooth oval circular "O" shape.',
    mnemonicTip: 'All fingers and thumb complete an open circle like looking through an Optical scope.',
    commonMistakes: 'Leaving gap between fingertips and thumb (which would be C).',
    difficulty: 'Easy',
    handShapeDescription: 'All fingertips touching thumb tip to form an O circle',
    category: 'Pinch',
    svgPathD: 'M 50 20 Q 30 20 30 50 Q 30 80 50 80 Q 70 80 70 50 Q 70 20 50 20 Z M 50 32 Q 40 32 40 50 Q 40 68 50 68 Q 60 68 60 50 Q 60 32 50 32 Z'
  },
  {
    letter: 'P',
    classIndex: 14,
    datasetLabel: 15,
    description: 'Hand shape identical to K, but oriented upside-down with the index finger pointing downward.',
    mnemonicTip: 'An upside-down K; the downward finger mimics the stem of a lowercase "p".',
    commonMistakes: 'Allowing the wrist to flop sideways. Keep index pointing down and middle outward.',
    difficulty: 'Challenging',
    handShapeDescription: 'Inverted K-hand pointing downwards with thumb on middle finger knuckle',
    category: 'Fingers',
    svgPathD: 'M 40 85 L 40 25 M 40 55 L 60 75 M 30 35 L 50 52 Q 50 35 40 25'
  },
  {
    letter: 'Q',
    classIndex: 15,
    datasetLabel: 16,
    description: 'Hand shape identical to G, but turned upside-down so the index finger and thumb point downwards toward the ground.',
    mnemonicTip: 'A downward-pointing G; represents the downward loop tail of the letter Q.',
    commonMistakes: 'Pointing horizontally (G). Q must point down.',
    difficulty: 'Medium',
    handShapeDescription: 'Inverted G-hand pointing downward with index and thumb parallel',
    category: 'Fingers',
    svgPathD: 'M 50 25 L 50 75 M 65 25 L 65 75 M 50 25 Q 50 10 65 10'
  },
  {
    letter: 'R',
    classIndex: 16,
    datasetLabel: 17,
    description: 'Cross your middle finger over your index finger while curling other fingers into the palm and holding them with your thumb.',
    mnemonicTip: 'Cross your fingers for good luck: R stands for "Rely on luck".',
    commonMistakes: 'Crossing index over middle instead of middle over index.',
    difficulty: 'Medium',
    handShapeDescription: 'Middle finger crossed over index finger, both pointing upwards',
    category: 'Fingers',
    svgPathD: 'M 42 15 Q 45 40 40 80 M 48 18 Q 40 42 45 80 M 30 55 Q 20 55 20 75 Q 20 85 40 85'
  },
  {
    letter: 'S',
    classIndex: 17,
    datasetLabel: 18,
    description: 'Make a fist with all fingers curled tightly into your palm, with your thumb folded firmly across the front of all your fingers.',
    mnemonicTip: 'A closed Shield; thumb crosses completely over the center of fingers.',
    commonMistakes: 'Keeping thumb on the side (which is A) or tucking thumb under fingers (which is E, M, or N).',
    difficulty: 'Easy',
    handShapeDescription: 'Tight fist with thumb crossed horizontally over front of fingers',
    category: 'Fist',
    svgPathD: 'M 25 35 Q 25 25 35 25 L 65 25 Q 75 25 75 35 L 75 75 Q 75 85 65 85 L 35 85 Q 25 85 25 75 Z M 20 50 L 78 50 L 78 62 L 20 62 Z'
  },
  {
    letter: 'T',
    classIndex: 18,
    datasetLabel: 19,
    description: 'Fist with your thumb tucked underneath your index finger only, popping out between index and middle fingers.',
    mnemonicTip: 'Thumb tucked under just One finger: T for "Top finger".',
    commonMistakes: 'Confusing with N (2 fingers) or M (3 fingers). T has only 1 finger over the thumb.',
    difficulty: 'Medium',
    handShapeDescription: 'Fist with thumb poking out between index and middle fingers',
    category: 'Fist',
    svgPathD: 'M 25 75 L 25 35 Q 25 25 40 25 Q 55 25 55 45 L 55 75 Z M 45 35 L 55 35 L 55 55 L 45 55 Z'
  },
  {
    letter: 'U',
    classIndex: 19,
    datasetLabel: 20,
    description: 'Index and middle fingers extended straight up and pressed tightly together, while ring and pinky fingers are curled and held by thumb.',
    mnemonicTip: 'Two fingers standing together like the parallel uprights of the letter U.',
    commonMistakes: 'Separating the two fingers (which is V). U fingers must touch flush.',
    difficulty: 'Easy',
    handShapeDescription: 'Index and middle fingers extended upward and pressed together',
    category: 'Fingers',
    svgPathD: 'M 40 15 L 40 75 M 48 15 L 48 75 M 30 55 Q 20 55 20 75 Q 20 85 40 85'
  },
  {
    letter: 'V',
    classIndex: 20,
    datasetLabel: 21,
    description: 'Index and middle fingers extended straight up and spread apart in a "peace" or "victory" sign, with other fingers curled into palm.',
    mnemonicTip: 'The classic Victory / Peace sign creates the letter V.',
    commonMistakes: 'Keeping fingers touching (that is U). Spread them apart into a distinct V angle.',
    difficulty: 'Easy',
    handShapeDescription: 'Index and middle fingers extended upward in a spread V shape',
    category: 'Fingers',
    svgPathD: 'M 35 15 L 45 75 M 65 15 L 48 75 M 30 55 Q 20 55 20 75 Q 20 85 45 85'
  },
  {
    letter: 'W',
    classIndex: 21,
    datasetLabel: 22,
    description: 'Index, middle, and ring fingers extended upward and spread apart, with the thumb holding down the pinky finger.',
    mnemonicTip: 'Three spread fingers form the three points of the letter W.',
    commonMistakes: 'Holding down index or thumb instead of pinky. Only pinky is pinned down.',
    difficulty: 'Easy',
    handShapeDescription: 'Index, middle, and ring fingers extended and spread, thumb holds pinky',
    category: 'Fingers',
    svgPathD: 'M 30 18 L 42 75 M 50 15 L 48 75 M 70 18 L 54 75 M 25 55 Q 20 75 42 85'
  },
  {
    letter: 'X',
    classIndex: 22,
    datasetLabel: 23,
    description: 'Fist with your index finger extended and bent into a hook shape, like a pirate’s hook or pulling a trigger.',
    mnemonicTip: 'Captain Hook marks the spot with an X.',
    commonMistakes: 'Curling index finger completely into the palm. It must remain elevated and hooked.',
    difficulty: 'Medium',
    handShapeDescription: 'Index finger crooked into a hook, remaining fingers in a fist',
    category: 'Fingers',
    svgPathD: 'M 35 45 Q 40 25 50 25 Q 60 25 58 40 L 52 48 M 30 55 Q 20 55 20 75 Q 20 85 45 85'
  },
  {
    letter: 'Y',
    classIndex: 23,
    datasetLabel: 24,
    description: 'Thumb and pinky finger extended outward in opposite directions, while the three middle fingers are curled flat against the palm.',
    mnemonicTip: 'Looks like the "shaka" or "hang loose" hand sign, or the two upper prongs of letter Y.',
    commonMistakes: 'Letting middle fingers rise up. Keep middle, ring, and index curled flat.',
    difficulty: 'Easy',
    handShapeDescription: 'Thumb and pinky fully extended, middle three fingers folded into palm',
    category: 'Fingers',
    svgPathD: 'M 15 35 Q 25 45 35 60 L 50 75 Q 60 65 75 45 L 85 35 M 35 60 L 65 60'
  }
];

export const DYNAMIC_LETTERS_NOTE = {
  letters: ['J', 'Z'],
  explanation: 'In American Sign Language (ASL), the letters "J" and "Z" are dynamic letters traced in the air with motion (J traces a curved hook using the pinky finger; Z traces the zig-zag letter with the index finger). Because Sign Language MNIST is a static single-frame 28x28 grayscale image benchmark, dynamic letters are excluded from static classification models. In our SLB AI platform, dynamic letter support is scheduled for future temporal sequence models (e.g. LSTM/Transformer over video keyframes).'
};

export const MALAWIAN_SIGN_LANGUAGE_STATUS = {
  status: 'Roadmap & Ingestion Pipeline Prepared',
  notes: 'Malawian Sign Language (MSL) has distinct vocabulary, natural grammatical structure, and regional dialectal variations across Malawi (e.g., Blantyre, Lilongwe, Mzuzu deaf communities). While the current trained model operates on the 24 static American Sign Language alphabet benchmark (Sign Language MNIST), SLB AI adheres strictly to the competition integrity directive: we DO NOT falsely relabel ASL as MSL. Instead, we provide a dedicated MSL Community Data Contribution and Ingestion interface, annotation format specifications, and a documented pathway for ethical, community-consenting MSL gesture dataset development.'
};
