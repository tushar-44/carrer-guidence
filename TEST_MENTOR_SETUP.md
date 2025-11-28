# 🧪 Test Mentor Profile Setup Guide

**Purpose:** Set up your personal mentor profile for testing the booking system

---

## 📝 Your Test Mentor Profile

I've created a test mentor profile for you in `src/data/mentors.ts` at the end of the mentors array.

**Current Status:** Template created - needs your personal details

---

## ✏️ How to Customize Your Profile

### Step 1: Open the File
Open `src/data/mentors.ts` and scroll to the bottom (around line 420)

### Step 2: Update Your Details

Replace these fields with your information:

```typescript
{
  id: "test-mentor-1", // Keep this as is
  name: "YOUR FULL NAME HERE", // ⬅️ Add your name
  title: "Career Development Specialist", // ⬅️ Update your title
  expertise: ["Career Guidance", "Interview Prep", ...], // ⬅️ Add your skills
  experience: 3, // ⬅️ Your years of experience
  hourlyRate: 0, // ⬅️ Set to 0 for FREE testing, or any amount
  
  // Contact Info (shown in booking)
  email: "your.email@example.com", // ⬅️ ADD THIS LINE with your email
  phone: "+91 XXXXXXXXXX", // ⬅️ ADD THIS LINE with your phone
  
  // Profile Image
  image: "URL_TO_YOUR_PHOTO", // ⬅️ Add your photo URL
  
  // Other details
  languages: ["English", "Hindi"], // ⬅️ Your languages
  education: "Your Degree/University", // ⬅️ Your education
  company: "CareerPath Platform", // ⬅️ Your company
  
  // Bio
  bio: "Your bio here...", // ⬅️ Write about yourself
  
  // Availability
  availability: [
    { day: "Monday", slots: ["10:00 AM", "2:00 PM"] }, // ⬅️ Your available times
    // ... add more days
  ],
  
  // Important for testing
  mentor_type: 'near-peer', // ⬅️ Set to 'near-peer' for FREE sessions
  vetting_status: 'approved' // ⬅️ Keep as 'approved' to show in listing
}
```

---

## 🖼️ Adding Your Photo

### Option 1: Use a URL (Recommended)
1. Upload your photo to any image hosting service:
   - Imgur: https://imgur.com
   - Cloudinary: https://cloudinary.com
   - Google Drive (make it public)
2. Copy the direct image URL
3. Paste it in the `image` field

### Option 2: Use Local File
1. Add your photo to `public/mentors/` folder
2. Name it something like `your-name.jpg`
3. Use path: `image: "/mentors/your-name.jpg"`

### Option 3: Use Placeholder
Keep the current Unsplash URL for testing

---

## 📧 Adding Contact Information

The mentor interface doesn't have email/phone fields by default. Let me add them:

**Update the Mentor interface** (around line 1-25):

```typescript
export interface Mentor {
  id: string;
  name: string;
  title: string;
  expertise: string[];
  experience: number;
  hourlyRate: number;
  rating: number;
  totalSessions: number;
  availability: {
    day: string;
    slots: string[];
  }[];
  bio: string;
  image: string;
  languages: string[];
  education: string;
  company: string;
  verified: boolean;
  responseTime: string;
  specializations: string[];
  achievements: string[];
  mentor_type?: 'near-peer' | 'professional';
  vetting_status?: 'pending' | 'approved' | 'rejected';
  
  // ADD THESE LINES:
  email?: string; // Your email for contact
  phone?: string; // Your phone number
}
```

---

## 🎯 Testing Your Profile

### Step 1: Save Your Changes
After updating your details, save the file.

### Step 2: Restart Dev Server
```bash
# Stop the current server (Ctrl+C)
# Start again
npm run dev
```

### Step 3: View Your Profile
1. Go to http://localhost:5173/mentors
2. Scroll down to find your profile
3. It should appear at the bottom of the mentor list

### Step 4: Test Booking
1. Click on your mentor card
2. Click "Book Session"
3. Select date and time
4. Complete the booking
5. Check if it appears in dashboard

---

## 💡 Quick Setup Example

Here's a complete example with placeholder data:

```typescript
{
  id: "test-mentor-1",
  name: "Rajesh Kumar", // Your name
  title: "Full Stack Developer & Career Mentor",
  expertise: ["Web Development", "Career Guidance", "Technical Interviews"],
  experience: 5,
  hourlyRate: 0, // FREE for testing
  rating: 5.0,
  totalSessions: 50,
  availability: [
    { day: "Monday", slots: ["10:00 AM", "2:00 PM", "6:00 PM"] },
    { day: "Wednesday", slots: ["11:00 AM", "4:00 PM"] },
    { day: "Friday", slots: ["9:00 AM", "3:00 PM", "7:00 PM"] }
  ],
  bio: "Experienced developer passionate about helping students transition into tech careers. I provide guidance on coding, interview prep, and career planning.",
  image: "/mentors/rajesh.jpg", // Your photo
  languages: ["English", "Hindi", "Tamil"],
  education: "B.Tech in Computer Science, IIT Delhi",
  company: "Tech Startup",
  verified: true,
  responseTime: "Within 30 minutes",
  specializations: ["React", "Node.js", "System Design", "Career Planning"],
  achievements: [
    "Mentored 100+ students",
    "5+ years in tech industry",
    "Speaker at tech conferences"
  ],
  mentor_type: 'near-peer', // FREE sessions
  vetting_status: 'approved',
  email: "rajesh.kumar@example.com", // Your email
  phone: "+91 98765 43210" // Your phone
}
```

---

## 🔧 Troubleshooting

### Profile Not Showing?
- Check if `vetting_status: 'approved'`
- Restart dev server
- Clear browser cache (Ctrl+Shift+R)

### Booking Not Working?
- Check database migration is applied
- Verify Supabase connection
- Check browser console for errors

### Want to Make it FREE?
Set these values:
```typescript
hourlyRate: 0,
mentor_type: 'near-peer'
```

---

## 📱 What Information is Shown Where?

### On Mentor Card (Listing Page):
- Name
- Title
- Expertise (first 3)
- Rating
- Hourly Rate
- Image

### On Mentor Detail Page:
- All card info +
- Full bio
- All expertise
- Languages
- Education
- Company
- Availability
- Specializations
- Achievements
- **Email** (if added)
- **Phone** (if added)

### In Booking Confirmation:
- Name
- Selected date/time
- **Email** (for contact)
- **Phone** (for contact)

---

## ✅ Checklist

Before testing, make sure:

- [ ] Updated name
- [ ] Updated title
- [ ] Added email
- [ ] Added phone number
- [ ] Added photo (or using placeholder)
- [ ] Set hourlyRate to 0 (for free testing)
- [ ] Set mentor_type to 'near-peer'
- [ ] Set vetting_status to 'approved'
- [ ] Updated availability with your preferred times
- [ ] Wrote a bio
- [ ] Saved the file
- [ ] Restarted dev server
- [ ] Checked profile appears in /mentors page

---

## 🎉 Ready to Test!

Once you've updated your details:

1. Navigate to `/mentors`
2. Find your profile
3. Click to view details
4. Click "Book Session"
5. Test the complete booking flow
6. Check if booking appears in dashboard

---

**Need Help?**
- Check browser console for errors
- Verify all fields are filled correctly
- Make sure dev server is running
- Check that database migration is applied

---

**Last Updated:** January 2025