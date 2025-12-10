# GDPR Cookie Consent Implementation

This site now includes a comprehensive GDPR-compliant cookie consent system that
meets all major privacy requirements.

## ✅ GDPR Compliance Features

### 🍪 **Cookie Consent Banner**

- **Modal overlay** appears on first visit
- **Three clear options**: Reject All, Accept Selected, Accept All
- **Granular control** for different cookie categories
- **Persistent preferences** stored in localStorage
- **Accessible design** with proper ARIA labels and keyboard navigation

### 📊 **Cookie Categories**

1. **Essential Cookies** (Always required)
   - Site functionality and security
   - Cannot be disabled

2. **Analytics Cookies** (Optional)
   - Google Analytics (only loads with consent)
   - Usage tracking and site improvements
   - IP anonymization enabled

3. **Functional Cookies** (Optional)
   - User preferences and personalization
   - Enhanced site features

### 🔒 **Privacy-First Approach**

- **No tracking** until explicit consent is given
- **Analytics delayed** until user consents
- **Essential cookies only** by default
- **Secure cookie flags** with proper SameSite policies

### 🎛️ **User Control**

- **Floating cookie button** (🍪) for preference management
- **Privacy Policy page** with comprehensive information
- **Withdraw consent** at any time
- **Re-configure preferences** easily

## 🛠️ Technical Implementation

### Files Created

- `/src/js/cookie-consent.js` - Main consent management system
- `/src/privacy-policy.njk` - Comprehensive privacy policy page

### Integration Points

- **Base Layout**: Cookie script loaded in `<head>` with defer
- **Footer Navigation**: Privacy Policy link added
- **Floating Button**: Always-accessible preferences button

### Code Features

- **CSP-safe** vanilla JavaScript implementation
- **Responsive design** with Swiss typography styling
- **Accessibility compliant** with proper focus management
- **Error handling** for edge cases and missing configurations

## 🔧 Configuration

### Analytics Setup

To enable Google Analytics tracking:

1. Open `/src/js/cookie-consent.js`
2. Replace `GA_MEASUREMENT_ID` with your actual Google Analytics ID:
   ```javascript
   const GA_ID = "G-XXXXXXXXXX"; // Your actual Analytics ID
   ```

### Customization Options

- **Styling**: Modify CSS custom properties in the cookie consent script
- **Categories**: Add/remove cookie categories in the `defaultPreferences`
  object
- **Text**: Update banner content and privacy policy language
- **Behavior**: Adjust consent storage and script loading logic

## 🎨 Design System Integration

The cookie consent system seamlessly integrates with the existing Swiss design
system:

- **Swiss typography** and spacing
- **Consistent color palette** (red, black, white, grays)
- **Clean borders** and geometric layouts
- **Professional aesthetic** matching site branding

## ✅ Legal Compliance

### GDPR Requirements Met

- ✅ Clear and specific consent requests
- ✅ Granular cookie category controls
- ✅ Easy consent withdrawal
- ✅ Comprehensive privacy information
- ✅ No tracking without consent
- ✅ Data subject rights explained

### Best Practices

- ✅ Privacy by design approach
- ✅ Minimal data collection
- ✅ Transparent processing purposes
- ✅ Secure data handling
- ✅ Regular policy updates capability

## 📱 User Experience

### First Visit

1. User visits any page
2. Cookie consent modal appears immediately
3. Site content is blurred/locked until choice is made
4. Clear options with explanations provided

### Return Visits

- **Consent remembered** across all pages
- **No repeated prompts** for same preferences
- **Floating button** allows easy preference changes
- **Analytics load** automatically if previously consented

### Preference Management

- Click floating 🍪 button anytime
- Same modal interface for consistency
- Current preferences pre-selected
- Instant application of changes

## 🚀 Deployment Ready

The implementation is production-ready with:

- **Static site compatibility** (no server required)
- **Performance optimized** (deferred loading)
- **Cross-browser support** (modern browsers)
- **Mobile responsive** design
- **SEO friendly** (no impact on search indexing)

This GDPR cookie consent system ensures full legal compliance while maintaining
an excellent user experience and seamless integration with the existing Swiss
design system.
