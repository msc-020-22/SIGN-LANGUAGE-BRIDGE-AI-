# Hackathon Live Demo Script (3-Minute Presentation)
**Project:** Sign Language Bridge AI (SLB AI)  
**Presenter:** Jonathan Zimunya  
**Competition:** NYLP × AI Hackathon 2026  

---

### Minute 0:00 – 0:30: The Problem & Our Mission
- *"Judges, over 70 million Deaf and Hard-of-Hearing individuals face daily communication barriers. Today, we built Sign Language Bridge AI with one core mission: 'Every sign deserves to be understood.'"*
- *"Unlike conceptual prototypes or hardcoded mockups, SLB AI is powered by a real, scientifically trained neural network that runs privately on your device, with zero video data leaving your browser."*

---

### Minute 0:30 – 1:15: Live Camera Recognition & Safety
- **Action:** Click **"Live Camera Recognition"** and start the webcam feed.
- **Talking Points:**
  - *"Notice the central guide bracket. When I position my hand to form the letter 'L', the neural network extracts a 28×28 grayscale region of interest and classifies it in real-time with sub-millisecond latency."*
  - *"Watch the confidence meter: the model also calculates Shannon entropy. If I move my hand out of position, it flags the prediction as 'Uncertain' rather than hallucinating."*
  - *"When a sign is held steady, the temporal smoothing filter confirms it, auto-appends it to the sentence, and vocalizes it through speech synthesis."*

---

### Minute 1:15 – 1:45: Dual Conversation Mode
- **Action:** Navigate to **"Dual Conversation Mode"**.
- **Talking Points:**
  - *"Real communication is always two-way. In Dual Conversation Mode, the screen splits into a signer's turn and a hearing partner's turn."*
  - *"The Deaf user can tap quick phrases or fingerspell words with immediate text-to-speech for the hearing partner."*
  - *"The hearing partner speaks into their microphone via the Web Speech API, and their spoken words are immediately transcribed and visually fingerspelled for the Deaf user."*

---

### Minute 1:45 – 2:15: Learning, Quizzes & Gamification
- **Action:** Open **"Sign Dictionary"** and **"Practice & Quizzes"**.
- **Talking Points:**
  - *"In the Sign Dictionary, users can explore all 24 static alphabet letters with clear hand descriptions and memory tips."*
  - *"In Quiz Mode, learners test their knowledge. When you complete a quiz, interactive celebratory feedback rewards your progress."*

---

### Minute 2:15 – 3:00: Model Card, Empirical Metrics & Ethical Integrity
- **Action:** Open **"Model Card & Ethics"**.
- **Talking Points:**
  - *"Transparency is our foundation: our model was trained on 27,455 samples and evaluated on 7,172 held-out test samples, achieving 79.34% test accuracy compared to the 66.06% baseline."*
  - *"Here is the full 24×24 confusion matrix and per-class metrics."*
  - *"Finally, on linguistic integrity: we explicitly do NOT relabel ASL as Malawian Sign Language (MSL). Instead, we document an ethical community partnership roadmap for future MSL data collection."*
  - *"Thank you! I welcome your questions."*
