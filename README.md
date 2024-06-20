## Getting Started

First, download code from repository and run

```bash
npm install
# or
npm i
# or
yarn install
```

#### Create '.env' file in root file and make the following variable :

### `.env` Configuration

| Variable     | Description               | Example                                                                                                                                      |
| ------------ | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| PORT         | Port number               | `PORT=5000`                                                                                                                                  |
| DATABASE_URL | mongodb connection string | `DATABASE_URL = mongodb+srv://<username>:<password>@level2.hdz7qkm.mongodb.net/Car_Rental_Reservation_System>?retryWrites=true&w=majority&appName=Level2` |
| BCRYPT_SALT_ROUNDS | bcrypt number to encrypt password | `BCRYPT_SALT_ROUNDS = 12` |
| JWT_ACCESS_SECRET | secret string for generating token | `JWT_ACCESS_SECRET = "secret string` |

Live Server Link: https://car-rental-reservation-system-beta.vercel.app/
