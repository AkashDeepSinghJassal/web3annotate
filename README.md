# Web3Survey

Web3Survey is a decentralized survey platform where creators can launch surveys by paying with SOL (Solana's cryptocurrency), and surveyors can participate in surveys to earn SOL. The platform leverages the Solana blockchain, Next.js for the frontend, and Node.js with PostgreSQL and AWS S3 for the backend.

## Features

- **Survey Creation:** Creators can create surveys with multiple-choice questions by paying in SOL.
- **Survey Participation:** Surveyors can participate in surveys and get paid in SOL for their responses.
- **Payout:** Surveyors can withdraw their earnings to their Solana wallet.
- **Image Storage:** Survey-related images are stored in AWS S3 and delivered via CloudFront CDN for fast and secure access.

## Tech Stack

### Frontend
- **Framework:** Next.js
- **State Management:** React
- **Styling:** CSS/SCSS
- **Wallet Integration:** Solana Wallet Adapter

### Backend
- **Server:** Node.js
- **Database:** PostgreSQL
- **File Storage:** AWS S3
- **CDN:** CloudFront
- **Blockchain:** Solana

## Solana Dependencies

- `@solana/wallet-adapter-base` - Solana wallet adapter base package.
- `@solana/wallet-adapter-react` - React hooks and components for Solana wallet integration.
- `@solana/wallet-adapter-react-ui` - Pre-built UI components for Solana wallet interaction.
- `@solana/wallet-adapter-wallets` - Collection of supported Solana wallets.
- `@solana/web3.js` - Solana JavaScript API for blockchain interaction.

## Getting Started

### Prerequisites

- **Node.js**: Make sure you have Node.js installed.
- **PostgreSQL**: Set up a PostgreSQL database.
- **AWS Account**: You'll need an AWS account for S3 and CloudFront.
- **Solana Wallet**: Set up a Solana wallet to interact with the blockchain.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/web3survey.git
   cd web3survey
   ```

2.	**Install dependencies:**
    ```
        npm install
    ```
3. **Backend Setup:**
	-	Make sure your PostgreSQL database is running.
	-	Configure AWS S3 and CloudFront for image storage and CDN.

## Usage

### Creating a Survey

1. Connect your Solana wallet.
2. Create a survey by specifying the title, description, and multiple-choice options.
3. Pay the required SOL to publish the survey.

### Participating in a Survey

1. Connect your Solana wallet.
2. Browse available surveys.
3. Select your choices and submit your response.
4. Earn SOL for your participation, which you can later withdraw to your wallet.

### Payout

- Surveyors can request a payout to their Solana wallet at any time.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request to propose changes.