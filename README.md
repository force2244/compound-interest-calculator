# Compound Interest Calculator

A responsive web application for calculating compound interest with interactive field selection. Built with HTML, CSS, JavaScript, and Bootstrap.

## Features

- **Interactive Field Selection**: Choose which variable to calculate (Principal, Interest Rate, Years, or Future Value)
- **Real-time Validation**: Input validation with helpful error messages
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark Theme**: Modern Bootstrap dark theme styling
- **Formula Reference**: Built-in reference showing all compound interest formulas

## Deployment Options

This is a static web application that requires no server-side processing or database, making it perfect for free hosting platforms:

### Free Hosting Platforms

1. **Netlify** (Recommended)
   - Drag and drop deployment
   - Automatic HTTPS
   - Global CDN
   - Custom domain support

2. **Vercel**
   - GitHub integration
   - Instant deployments
   - Edge network
   - Zero configuration

3. **GitHub Pages**
   - Direct from repository
   - Custom domain support
   - Free for public repositories

4. **Surge.sh**
   - Command-line deployment
   - Custom domains
   - Simple setup

### Deployment Cost Analysis

- **Static Hosting**: $0/month (using free tiers)
- **Custom Domain**: $10-15/year (optional)
- **Total Annual Cost**: $0-15/year

### Why Static Hosting?

Since this calculator:
- Performs all calculations client-side
- Requires no user data storage
- Needs no server-side processing
- Has no database requirements

Static hosting is the optimal choice offering:
- Zero operational costs
- Maximum performance
- Global availability
- Automatic scaling

## Files Structure

```
├── index.html              # Main HTML file
├── static/
│   ├── css/
│   │   └── style.css       # Custom styles
│   └── js/
│       └── calculator.js   # Calculator logic
└── README.md              # This file
```

## Usage

1. Select which variable you want to calculate using the radio buttons
2. Enter values for the other three fields
3. Click "Calculate" to see the result
4. The calculated value will appear in the disabled field

## Formulas Used

- **Future Value**: FV = P × (1 + r)^t
- **Principal**: P = FV / (1 + r)^t  
- **Interest Rate**: r = (FV / P)^(1/t) - 1
- **Time Period**: t = log(FV / P) / log(1 + r)

*Note: Assumes annual compounding*

## Local Development

Simply open `index.html` in any modern web browser. No build process or server required.

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+