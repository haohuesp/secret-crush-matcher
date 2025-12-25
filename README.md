# Secret Crush Matcher

A fun dating/social app where users can secretly submit their crush's wallet address. If two people BOTH submit each other, they match! All powered by FHE (Fully Homomorphic Encryption) - nobody knows who likes who until there's a mutual match.

## Features

- **Private Crush Submissions**: Your crushes are encrypted using FHE magic
- **Mutual Match Detection**: Only reveals when BOTH people like each other
- **OKX Wallet Integration**: Connect with OKX Wallet SDK
- **Cute "Shy Love" Theme**: Anime-inspired UI with adorable animations
- **The Famous "Shy Fingers" Animation**: Two cartoon hands nervously approaching each other

## Tech Stack

### Backend
- Python 3.9+
- FastAPI
- Zama Concrete (FHE)
- SQLite

### Frontend
- Next.js 14
- React 18
- Tailwind CSS
- Framer Motion
- OKX Wallet SDK (@okxconnect/ui)

## Project Structure

```
Secret Crush Matcher/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI routes
│   │   ├── fhe_matcher.py       # FHE crush matching logic
│   │   ├── models.py            # Data models
│   │   └── database.py          # Store encrypted crushes
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ShyWalletConnect.tsx    # THE SHY FINGERS ANIMATION
│   │   │   ├── CrushSubmitForm.tsx
│   │   │   ├── MatchReveal.tsx
│   │   │   └── FloatingHearts.tsx
│   │   ├── pages/
│   │   │   ├── index.tsx        # Landing + wallet connect
│   │   │   ├── dashboard.tsx    # Main app
│   │   │   └── match.tsx        # Match celebration
│   │   ├── hooks/
│   │   │   └── useOKXWallet.ts  # Wallet connection hook
│   │   └── styles/
│   │       └── globals.css
│   └── package.json
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the server:
```bash
cd app
python main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Welcome message |
| POST | `/api/connect` | Connect wallet |
| POST | `/api/crush/submit` | Submit a crush (encrypted) |
| GET | `/api/matches/{address}` | Get matches for a user |
| GET | `/api/stats/{address}` | Get user statistics |
| GET | `/api/check-match` | Check if two addresses match |
| GET | `/api/health` | Health check |

## How It Works

1. **Connect Wallet**: User connects their OKX wallet (with the adorable shy fingers animation!)
2. **Submit Crush**: Enter your crush's wallet address - it gets encrypted with FHE
3. **FHE Magic**: Server checks encrypted data without ever seeing who you like
4. **Match Reveal**: Only mutual matches are decrypted and revealed!
5. **Celebrate**: When there's a match, enjoy the heart explosion animation

## The "Shy Fingers" Animation

The hero feature of this app! When connecting your wallet:

- Two cartoon hands appear from left and right
- Their index fingers nervously point toward each other
- They slowly approach, almost touch, then shyly retreat
- Pink blush particles appear
- Occasional sweat drops show their nervousness
- On connect: fingers finally touch with sparkles and heart explosion!

## Theme Colors

- **Crush Pink**: `#FF6B9D`
- **Crush Purple**: `#C9A7FF`
- **Crush Cream**: `#FFF5F5`
- **Blush**: `#FFCCD5`
- **Heart Red**: `#FF4D6D`

## Credits

- Powered by [Zama FHE](https://www.zama.ai/)
- Wallet connection via [OKX Wallet SDK](https://www.okx.com/web3)
- Built with love and shy fingers
