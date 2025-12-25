# Build "Secret Crush Matcher" with Zama FHE + OKX Wallet

## Overview
A fun dating/social app where users can secretly submit their crush's wallet address. If two people BOTH submit each other, they match! All powered by FHE - nobody knows who likes who until there's a mutual match.

## Tech Stack
- **Backend**: Python + FastAPI + Concrete (Zama FHE)
- **Frontend**: React/Next.js + Tailwind CSS + Framer Motion
- **Wallet**: OKX Wallet SDK (@okxconnect/ui)
- **Styling**: Cute, shy, romantic anime-inspired theme

---

## 🎨 CRITICAL: Wallet Connect UI (Shy/Bashful Theme)

### The "Shy Fingers" Connection Animation
Create a beautiful, shy wallet connection screen:

1. **Two cartoon hands** from left and right side of screen
2. **Index fingers** nervously pointing toward each other
3. **Animation sequence**:
   - Fingers slowly approach each other
   - Almost touch → suddenly pull back shyly
   - Repeat 2-3 times with slight trembling
   - Small blush effects (pink particles) appear
   - Tiny sweat drops occasionally
   - When user clicks "Connect" → fingers finally touch!
   - Heart explosion animation on successful connection

4. **Visual details**:
   - Soft pastel colors (pink, light purple, cream)
   - Fingers should have subtle "trembling" animation
   - Add floating hearts in background
   - Shy emoji faces near the hands (>///<)
   - Text: "Connect your wallet to find your secret crush..." with typewriter effect
   - Button pulses gently: "Tap to connect 👉👈"

5. **States**:
   - **Idle**: Fingers doing shy back-and-forth dance
   - **Hover on button**: Fingers move slightly closer
   - **Connecting**: Fingers touching, sparkles appear
   - **Connected**: Hands form heart shape, confetti burst
   - **Error**: Fingers bump into each other awkwardly, dizzy stars

### Code Reference for Animation
```jsx
// Use Framer Motion for the shy finger animation
const ShyFingers = () => {
  // Left finger moves: x from -100 to -20, with slight retreat
  // Right finger moves: x from 100 to 20, with slight retreat
  // Add rotation for "trembling" effect
  // Sync both fingers with shared animation state
}
```

---

## 💘 Secret Crush Matcher - Core Features

### How It Works (FHE Magic)
1. User A submits crush's wallet address (encrypted)
2. User B submits crush's wallet address (encrypted)
3. Server checks if A submitted B AND B submitted A (on encrypted data!)
4. Only mutual matches are revealed - unrequited crushes stay SECRET forever

### User Flow

**Screen 1: Shy Wallet Connect**
- Beautiful shy fingers animation
- "Connect OKX Wallet" button
- On connect → celebration → proceed

**Screen 2: Dashboard**
- User's avatar (generated from wallet address)
- Stats: "Crushes sent: X" | "Matches: Y"
- Big pink button: "💕 Add New Crush"
- List of matches (if any) with chat option

**Screen 3: Submit Crush**
- Input field for wallet address
- "Send Secret Love" button
- Animation: Letter with heart flying away
- Confirmation: "Sent! If they like you back, magic will happen 💫"

**Screen 4: It's a Match!**
- When mutual crush detected
- Dramatic reveal animation
- Two profile pictures connecting
- Fireworks + hearts explosion
- "You and [address] both like each other! 💕"
- Option to reveal identity / start chat

### FHE Logic (Simple)
```python
# Encrypted comparison
# For each pair of users (A, B):
# Check if: encrypted(A's_crush) == encrypted(B's_address) 
#      AND  encrypted(B's_crush) == encrypted(A's_address)
# Return encrypted boolean, decrypt only if True
```

---

## 🎨 UI/UX Requirements

### Theme: "Shy Love" / Anime-inspired
- **Colors**: Pink (#FF6B9D), Light Purple (#C9A7FF), Cream (#FFF5F5)
- **Font**: Rounded, cute (Nunito, Quicksand)
- **Illustrations**: Kawaii style, blushing characters
- **Micro-interactions**: Everything should feel alive and shy

### Key Animations (Framer Motion)
1. **Page transitions**: Soft fade with slight scale
2. **Buttons**: Gentle pulse, shy retreat on hover then approach
3. **Cards**: Float gently, tilt on hover
4. **Hearts**: Constantly floating in background
5. **Match reveal**: Dramatic zoom, sparkles, confetti

### Sound Effects (optional but fun)
- Soft "pop" on button clicks
- Heartbeat sound during match reveal
- Cute "ding" on successful actions

### UI Text (All English)
- Landing: "Find your secret crush... privately 💕"
- Tagline: "Powered by magic (and encryption)"
- Connect button: "Connect Wallet 👉👈"
- Submit crush: "Send Secret Love"
- Waiting: "Waiting for destiny..."
- Match found: "It's a Match! 💕"
- No match yet: "No matches yet... but don't give up!"
- Error: "Oops! Something went wrong..."

---

## 📁 Project Structure
/backend
/app
main.py              # FastAPI routes
fhe_matcher.py       # FHE crush matching logic
models.py            # Data models
database.py          # Store encrypted crushes
requirements.txt
/frontend
/src
/components
ShyWalletConnect.jsx    # THE SHY FINGERS ANIMATION
CrushSubmitForm.jsx
MatchReveal.jsx
FloatingHearts.jsx
/pages
index.jsx          # Landing + wallet connect
dashboard.jsx      # Main app
match.jsx          # Match celebration
/hooks
useOKXWallet.js    # Wallet connection hook
/styles
globals.css
package.json

---

## 🔗 OKX Wallet Integration
```javascript
// Install: npm install @okxconnect/ui

import { OKXUniversalConnectUI } from '@okxconnect/ui';

const okxUI = await OKXUniversalConnectUI.init({
  dappMetaData: {
    name: "Secret Crush Matcher 💕",
    icon: "https://your-logo.png"
  },
  actionsConfiguration: {
    returnStrategy: 'none',
    modals: 'all'
  },
  language: 'en_US',
});

// Connect
const session = await okxUI.openModal({
  namespaces: {
    eip155: {
      chains: ["eip155:1"],
      defaultChain: "1"
    }
  }
});
```

---

## 🚀 Deliverables

1. **Wallet Connect Screen** with shy fingers animation (MOST IMPORTANT!)
2. **Working FHE matching** backend
3. **Beautiful UI** with all animations
4. **Mobile responsive**
5. **README** with setup instructions

## Priority Order
1. First: Nail the shy wallet connect animation - it's the hero feature!
2. Second: Basic dashboard UI
3. Third: FHE backend integration
4. Fourth: Match reveal animation
5. Fifth: Polish everything

Make it CUTE, SHY, and MEMORABLE! The wallet connect screen should make people go "awww" 🥺👉👈