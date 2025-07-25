# Images Directory

## Lamborghini Image Setup

To add your dark Lamborghini image:

1. **Add your image**: Place your Lamborghini image in this directory as `lamborghini-dark.jpg` (or any format)

2. **Update the image paths** in the authentication pages:
   - `/app/auth/signin/page.tsx` - Line ~169
   - `/app/auth/signup/page.tsx` - Line ~252

3. **Replace the current Unsplash URL** with:
   ```jsx
   src="/images/lamborghini-dark.jpg"
   ```

## Recommended Image Specifications

- **Format**: JPG, PNG, or WebP
- **Dimensions**: 1920x1080 or higher (16:9 aspect ratio works best)
- **Style**: Dark/night setting to match the theme
- **Quality**: High resolution for crisp display

## Current Setup

The auth pages are currently using a temporary Unsplash image. Replace it with your own Lamborghini image for the best results.

Example Lamborghini images that would work well:
- Dark Lamborghini in a garage/showroom
- Lamborghini at night with city lights
- Black Lamborghini with dramatic lighting
- Lamborghini silhouette against dark background