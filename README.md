<<<<<<< HEAD
# NDVI WebGIS Application

A professional web-based Geographic Information System (GIS) for visualizing and analyzing Normalized Difference Vegetation Index (NDVI) data using Sentinel Hub satellite imagery.

## Features

- **Interactive NDVI Map**: Real-time vegetation monitoring with Leaflet.js
- **Multiple Layer Types**: NDVI, True Color, False Color, and Agriculture views
- **Sentinel Hub Integration**: High-resolution satellite imagery from Sentinel-2
- **Point Analysis**: Click anywhere on the map to get NDVI values
- **Data Controls**: Date selection, cloud cover filtering, layer switching
- **Analysis Dashboard**: Charts and statistics for vegetation monitoring
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Toggle between themes
- **Professional UI**: Modern design with smooth animations

## Setup Instructions

1. **Extract Files**: Extract all files to your web server directory
2. **Sentinel Hub Setup**: 
   - The application uses pre-configured Sentinel Hub credentials
   - For production use, replace with your own credentials in `script.js`
3. **Web Server**: Serve the files through a web server (not file:// protocol)
4. **Dependencies**: All dependencies are loaded via CDN, no installation required

## File Structure

```
ndvi-webgis/
├── index.html          # Main HTML structure
├── style.css           # Styling and responsive design
├── script.js           # JavaScript functionality and map logic
└── README.md           # This documentation file
```

## Usage

1. Open `index.html` in a web browser through a web server
2. The map will load with NDVI overlay for Indonesia region
3. Use the control panel to:
   - Switch between different layer types
   - Select date ranges
   - Adjust cloud cover filtering
   - Update map layers
4. Click on any location to analyze NDVI values
5. Navigate between Home, Analysis, Data, and About pages
6. Toggle dark/light mode using the theme button

## Technical Details

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Mapping**: Leaflet.js
- **Charts**: Chart.js
- **Satellite Data**: Sentinel Hub API
- **Responsive**: Mobile-first design approach

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please refer to the documentation or contact support.
=======
# cobahah
>>>>>>> a38fe2e33e80a9bd4e72a47181373c618e7e75c6
