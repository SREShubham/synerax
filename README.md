# Synerax - 3D Animated Website

A modern, fully animated 3D website built with Three.js, featuring advanced animations and interactive elements.

## Features

✨ **3D Graphics** - Interactive 3D scene with floating objects powered by Three.js
🎨 **Gradient Animations** - Dynamic animated gradients throughout the site
📱 **Responsive Design** - Fully responsive and mobile-optimized
🚀 **Performance Optimized** - Smooth 60fps animations
🎭 **Modern UI** - Glass morphism effects and contemporary design patterns
🔗 **Smooth Navigation** - Seamless scroll animations and transitions

## Technologies Used

- **Three.js** - 3D graphics library
- **HTML5** - Structure
- **CSS3** - Advanced animations and styling
- **Vanilla JavaScript** - Interactive features
- **Font Awesome** - Icons

## Sections

1. **Hero Section** - 3D animated background with particle effects
2. **Services** - Six core service offerings with hover effects
3. **Founders** - Team member profiles with skill tags
4. **Milestones** - Impact statistics with counter animations
5. **Technologies** - Tech stack display with logos
6. **Testimonials** - Client feedback with star ratings
7. **Contact** - Newsletter signup and contact information

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/synerax.git
cd synerax
```

2. Open `index.html` in a web browser or serve with a local server:
```bash
python -m http.server 8000
# or
npx http-server
```

3. Visit `http://localhost:8000` in your browser

## Deployment to GitHub Pages

1. Ensure your repository is on GitHub
2. Go to Settings → Pages
3. Select "Deploy from a branch" under Source
4. Choose the branch (usually `main`) and `/root` folder
5. Click Save
6. Add a `CNAME` file in the repository root with your domain (for example: `synerax.in`)
7. In Pages settings, set **Custom domain** to `synerax.in` and enable **Enforce HTTPS** after DNS is active
8. Your site will be available at `https://synerax.in`

## GoDaddy DNS Setup for `synerax.in`

In your GoDaddy DNS manager, create/update the following records:

- **Type:** A, **Name:** `@`, **Value:** `185.199.108.153`
- **Type:** A, **Name:** `@`, **Value:** `185.199.109.153`
- **Type:** A, **Name:** `@`, **Value:** `185.199.110.153`
- **Type:** A, **Name:** `@`, **Value:** `185.199.111.153`
- **Type:** CNAME, **Name:** `www`, **Value:** `sreshubham.github.io`

Notes:

- GitHub username used here: `sreshubham`
- Remove conflicting `@` or `www` records if they point somewhere else
- DNS propagation can take a few minutes to 24 hours

## File Structure

```
synerax/
├── index.html          # Main HTML file
├── styles.css          # Stylesheet with animations
├── script.js           # JavaScript with 3D scene
├── images/
│   └── gcp-logo.png   # GCP logo
└── README.md           # This file
```

## Customization

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-blue: #0066CC;
    --primary-red: #FF3D3D;
    --cyan: #00D4FF;
    /* ... */
}
```

### 3D Scene
Modify the Three.js scene in `script.js`:
- `initThreeJsBackground()` - Configure 3D objects
- `particles` - Adjust particle count and behavior

### Content
Edit HTML sections in `index.html` to update:
- Service descriptions
- Founder information
- Statistics and milestones
- Technology stack
- Contact details

## Performance Tips

- 3D rendering is hardware-accelerated
- Animations use `requestAnimationFrame` for smooth performance
- Intersection Observer API used for scroll animations
- CSS animations are GPU-accelerated

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please create an issue on GitHub.

---

**Built with ❤️ by Synerax Team**
