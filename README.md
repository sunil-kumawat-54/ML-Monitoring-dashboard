<p align="center">
  <h1 align="center">🚀 Antigravity — ML Monitoring Dashboard</h1>
  <p align="center">
    A real-time, fully interactive Machine Learning model monitoring dashboard with a stunning space-themed UI.
    <br />
    Built with Next.js, React, Three.js, Recharts & Framer Motion.
    <br /><br />
    <a href="https://github.com/kanishak24jics088-maker/ML-Monitoring---dashboard"><strong>View Repository »</strong></a>
  </p>
</p>

<br />

## ✨ Overview

**Antigravity** is a frontend-only ML Monitoring Dashboard inspired by tools like [Evidently AI](https://www.evidentlyai.com/). It simulates real-time model health monitoring — including **data drift detection**, **performance tracking**, **prediction calibration**, and **alert management** — all without any backend dependency.

The entire dashboard runs on **simulated data** with a live-tick engine that updates metrics every 5 seconds, giving the feel of a production monitoring system.

---

## 🎥 Features

| Feature | Description |
|---|---|
| **Hero KPI Strip** | At-a-glance model health score, overall PSI, accuracy delta, and prediction volume with sparkline charts |
| **Data Drift Panel** | Per-feature PSI monitoring with reference vs. current distribution overlays, KS-statistic, p-values, and Wasserstein distance |
| **Performance Timeline** | 30-day interactive time-series charts for Accuracy, AUC-ROC, F1, Precision, Recall, and Log Loss |
| **Prediction Calibration** | Brier Score and Expected Calibration Error (ECE) visualization |
| **Feature Importance Shift** | Side-by-side comparison of reference vs. current feature importances with delta indicators |
| **Alert Feed** | Real-time alert stream with critical/warning/resolved levels and acknowledge actions |
| **Reports Panel** | Downloadable report generation interface |
| **Scenario Switcher** | Toggle between **Healthy**, **Moderate**, and **Severe** drift scenarios to see how metrics respond |
| **Live Mode** | Toggle real-time data tick simulation on/off |
| **Ambient 3D Background** | Immersive Three.js particle field with post-processing bloom effects |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Charts** | [Recharts 3](https://recharts.org/) |
| **Animations** | [Framer Motion 12](https://www.framer.com/motion/) |
| **3D Graphics** | [Three.js](https://threejs.org/) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) |
| **State Management** | [Zustand 5](https://zustand-demo.pmnd.rs/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Language** | TypeScript 5 |

---

## 📂 Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles & design tokens
│   ├── layout.tsx           # Root layout with TopBar, Sidebar, Footer & AmbientLayer
│   └── page.tsx             # Main dashboard page (assembles all widgets)
│
├── components/
│   ├── AmbientLayer.tsx     # Three.js animated particle background
│   ├── navigation/
│   │   ├── TopBar.tsx       # Header with model selector, scenario switcher & live toggle
│   │   ├── Sidebar.tsx      # Collapsible navigation sidebar
│   │   └── Footer.tsx       # Footer bar
│   └── widgets/
│       ├── HeroKPIStrip.tsx           # Key performance indicator cards
│       ├── DataDriftPanel.tsx         # Feature drift analysis panel
│       ├── PerformanceTimeline.tsx    # Multi-metric time-series chart
│       ├── PredictionCalibration.tsx  # Calibration metrics display
│       ├── FeatureImportanceShift.tsx # Feature importance comparison
│       ├── AlertFeed.tsx              # Real-time alerts list
│       └── ReportsPanel.tsx           # Report generation UI
│
├── lib/
│   ├── types.ts             # TypeScript interfaces (DashboardData, FeatureDrift, etc.)
│   ├── simulation.ts        # Data generation & live-tick simulation engine
│   └── utils.ts             # Utility / helper functions
│
└── store/
    └── useStore.ts           # Zustand global state (scenario, live mode, data, alerts)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/kanishak24jics088-maker/ML-Monitoring---dashboard.git
cd ML-Monitoring---dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 🎮 How to Use

1. **Select a Scenario** — Use the scenario switcher in the top bar to toggle between:
   - 🟢 **Healthy** — All metrics nominal, low drift
   - 🟡 **Moderate** — Mild drift on 3 features, slight accuracy drop
   - 🔴 **Severe** — Heavy drift on 8+ features, accuracy below 90%, critical alerts firing

2. **Live Mode** — Toggle the live button to enable/disable the 5-second tick simulation that continuously updates prediction volume and throughput.

3. **Explore Widgets** — Click into the Data Drift Panel to inspect individual feature distributions, drill into the Performance Timeline to toggle metrics, and acknowledge alerts in the Alert Feed.

---

## 🎨 Design Philosophy

The dashboard follows an **"Antigravity"** space-themed design system:

- **Dark void background** with subtle animated Three.js particle fields
- **Glassmorphism** cards with backdrop blur and semi-transparent surfaces
- **Neon accent colors** — cyan, violet, and amber for status indicators
- **Premium typography** — Inter for UI text, JetBrains Mono for data/metrics
- **Micro-animations** powered by Framer Motion for smooth transitions
- **Fully responsive** layout with collapsible sidebar

---

## 📊 Simulated Data

Since this is a **frontend-only** project, all data is generated client-side:

| Data Type | Details |
|---|---|
| **Features** | 15 features modeled after a fraud-detection pipeline (age, income, credit_score, transaction_amount, etc.) |
| **Drift Metrics** | PSI, KS-statistic, p-value, Wasserstein distance per feature |
| **Performance** | 30-day time-series for Accuracy, AUC-ROC, F1, Precision, Recall, Log Loss |
| **Calibration** | Brier Score and Expected Calibration Error |
| **Alerts** | Auto-generated based on scenario (PSI threshold breaches, accuracy drops) |

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Kanishak** — [@kanishak24jics088-maker](https://github.com/kanishak24jics088-maker)

---

<p align="center">
  Built with ❤️ using Next.js, React & Three.js
</p>
