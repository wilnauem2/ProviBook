# Firestore Security Rules Update

## Problem
The Activities page is not showing data because Firestore security rules don't allow reading from the `activities` collection.

## Solution
You need to update your Firestore security rules to allow authenticated users to read and write activities.

## How to Update Rules

### Option 1: Via Firebase Console (Recommended)
1. Go to https://console.firebase.google.com
2. Select your project
3. Click on **Firestore Database** in the left sidebar
4. Click on the **Rules** tab
5. Copy the contents from `firestore.rules` file in this directory
6. Paste it into the rules editor
7. Click **Publish**

### Option 2: Via Firebase CLI
```bash
# Make sure you're logged in
firebase login

# Deploy the rules
firebase deploy --only firestore:rules
```

## What Changed
Added new rules for the `activities` collection:
```javascript
match /activities/{activityId} {
  // Anyone authenticated can read activities
  allow read: if isAuthenticated();
  // Anyone authenticated can create activities (for logging their own actions)
  allow create: if isAuthenticated();
  // Only admins can update or delete activities
  allow update, delete: if isAdmin();
}
```

## After Updating Rules
1. Refresh the Activities page
2. Click "Test-Aktivität erstellen" to create a test activity
3. You should now see activities appearing

## Troubleshooting
If you still don't see activities:
1. Open browser console (F12)
2. Look for error messages
3. Check that you're logged in as an authenticated user
4. Verify the rules were published successfully in Firebase Console
