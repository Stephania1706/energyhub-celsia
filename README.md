# EnergyHub

A modern energy management dashboard built with Next.js, featuring real-time consumption monitoring, tariff analysis, eco-feedback, and outage mapping.

## ⚠️ Disclaimer

**This application is demonstrative and educational in nature. It is NOT an official application of, endorsed by, or affiliated with Celsia company or any of its affiliates.**

- This is a **demonstration project** created for educational and portfolio purposes
- All data, interfaces, and functionality shown are **simulated** and **fictional**
- The use of Celsia branding, logos, or references is for **demonstrative purposes only**
- This application does **not** represent any official product or service of Celsia
- This application does **not** provide access to real energy consumption data or services
- No claims are made regarding accuracy, reliability, or official endorsement

**By using this application, you acknowledge that:**
- This is a non-commercial, educational demonstration
- The application is not associated with Celsia or its business operations
- Any resemblance to actual Celsia products or services is coincidental and for demonstration purposes only

## Features

- 📊 **Energy Consumption Dashboard** - Real-time monitoring and analytics
- 💰 **Tariff Management** - Cost breakdown and alternative plans
- 🌱 **Eco-Feedback System** - Environmental impact tracking
- 🗺️ **Outage Map** - Real-time power outage visualization
- 🔔 **Smart Notifications** - Intelligent alerts and recommendations
- 🌙 **Dark/Light Theme** - Responsive design with theme switching

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

This project is configured for GitHub Pages deployment with static export.

### Automatic Deployment

The project includes a GitHub Actions workflow (`.github/workflows/nextjs.yml`) that automatically builds and deploys to GitHub Pages when you push to the main branch.

### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. The static files will be generated in the `out` directory

3. Deploy the `out` directory to your hosting platform

## Configuration

The project is configured with:
- Static export for GitHub Pages compatibility
- Base path configuration for repository deployment
- Unoptimized images for static hosting
- Trailing slash support

## Repository Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── eco-feedback/       # Eco-feedback page
│   ├── landing/           # Landing page
│   ├── mapa-cortes/       # Outage map page
│   ├── notifications/     # Notifications page
│   ├── profile/          # User profile page
│   └── tarifas/          # Tariffs page
├── components/           # React components
│   ├── dashboard/        # Dashboard components
│   └── ui/              # Reusable UI components
└── lib/                 # Utility functions
```

## License

This project is licensed under the MIT License with additional terms and disclaimers regarding the use of Celsia branding.

See the [LICENSE](LICENSE) file for full details.

### Key Points:
- **MIT License** applies to the code and software
- **Additional restrictions** apply to the use of Celsia branding and trademarks
- This is a **demonstrative/educational project** and not affiliated with Celsia
- **Commercial use** of Celsia branding is prohibited without permission
