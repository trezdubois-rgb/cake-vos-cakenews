# Quick Test Guide (5 Minutes)

## ⚡ Test Everything in 5 Minutes

### Step 1: Start the App (1 minute)

```bash
npm run dev
```

Wait for the server to start. You should see:
```
  VITE v5.4.20  ready in 123 ms

  ➜  Local:   http://localhost:5173/
```

### Step 2: Test the Editor (2 minutes)

1. **Open the editor**
   - Visit: `http://localhost:5173/gutenberg-demo`
   - You should see the Gutenberg editor interface

2. **Add a paragraph**
   - Click the `+` button
   - Select "Paragraph"
   - Type: "This is my first article"

3. **Add a heading**
   - Click `+` again
   - Select "Heading"
   - Type: "My Article Title"
   - Change to H2

4. **Add a list**
   - Click `+`
   - Select "List"
   - Add 3 items:
     - Item 1
     - Item 2
     - Item 3

5. **Save**
   - Fill in metadata:
     - Title: "Test Article"
     - Excerpt: "This is a test"
     - Category: "Technology"
     - Tags: "test, gutenberg"
   - Click "Save Article"
   - Check the HTML output

### Step 3: View in Feed (1 minute)

1. **Go to feed**
   - Visit: `http://localhost:5173/mon-flux`
   - Scroll down to find your article

2. **Verify rendering**
   - Article title appears
   - Article excerpt shows
   - Content renders correctly
   - All formatting preserved

3. **Test interactions**
   - Click "Like" button
   - Click "Share" button
   - Verify they work

### Step 4: View Full Article (1 minute)

1. **Click article**
   - Click "Lire l'article complet"
   - Full article page loads

2. **Verify display**
   - Hero image shows (if available)
   - Title displays
   - Author info shows
   - Content renders
   - Related articles appear

## ✅ Quick Checklist

- [ ] Dev server starts
- [ ] Editor loads at `/gutenberg-demo`
- [ ] Can add blocks
- [ ] Can save article
- [ ] Article appears in feed
- [ ] Can view full article
- [ ] No console errors
- [ ] Mobile responsive

## 🐛 Troubleshooting

### Editor doesn't load?
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run dev
```

### Article doesn't appear in feed?
- Check browser console for errors
- Verify article was saved
- Refresh the page
- Check localStorage

### Styling looks wrong?
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito mode
- Check for CSS conflicts

## 📊 Expected Results

### Editor Page
```
✅ Gutenberg editor visible
✅ Block library available
✅ Can add/edit/delete blocks
✅ Preview shows content
✅ Save button works
✅ HTML output displays
```

### Feed Page
```
✅ Articles list visible
✅ Your article appears
✅ Content renders correctly
✅ Formatting preserved
✅ Images load
✅ Interactions work
```

### Article Page
```
✅ Full article displays
✅ Hero image shows
✅ Metadata visible
✅ Content renders
✅ Related articles show
✅ Engagement stats visible
```

## 🎯 What to Test

### Content Types
- [ ] Paragraph text
- [ ] Headings (H1-H6)
- [ ] Lists (ordered & unordered)
- [ ] Quotes
- [ ] Code blocks
- [ ] Images
- [ ] Links

### Formatting
- [ ] Bold text
- [ ] Italic text
- [ ] Underline
- [ ] Text colors
- [ ] Alignment

### Interactions
- [ ] Like button
- [ ] Share button
- [ ] Comment section
- [ ] Related articles

## 📱 Mobile Test

1. **Open DevTools** (F12)
2. **Toggle device toolbar** (Ctrl+Shift+M)
3. **Test on iPhone SE** (375px)
4. **Verify:**
   - Editor is usable
   - Content renders
   - Buttons work
   - No layout breaks

## 🔍 Console Check

1. **Open DevTools** (F12)
2. **Go to Console tab**
3. **Look for:**
   - ❌ No red errors
   - ⚠️ Warnings are OK
   - ✅ No XSS attempts

## 🚀 Next Steps After Testing

1. ✅ Create more articles
2. ✅ Test different block types
3. ✅ Test on different browsers
4. ✅ Test on mobile devices
5. ✅ Connect to backend API
6. ✅ Set up authentication
7. ✅ Deploy to production

## 💡 Pro Tips

### Test Different Content
```
Try creating articles with:
- Long text (1000+ words)
- Many images
- Nested blocks
- Special characters
- Unicode text
```

### Test Performance
```
Check in DevTools:
- Network tab: Load times
- Performance tab: FPS
- Memory tab: No leaks
- Console: No errors
```

### Test Security
```
Try to add:
- <script>alert('XSS')</script>
- Malicious HTML
- Large files
- Verify sanitization works
```

## 📊 Performance Metrics

Expected values:
- **First Paint**: < 1s
- **First Contentful Paint**: < 2s
- **Time to Interactive**: < 3s
- **Lighthouse Score**: > 80

## 🎉 Success Criteria

✅ All tests pass
✅ No console errors
✅ Content displays correctly
✅ Mobile responsive
✅ Performance acceptable
✅ Security validated

---

**That's it! You've tested the complete Gutenberg integration! 🚀**

If everything works, you're ready to:
1. Connect to your backend
2. Set up user permissions
3. Deploy to production

**Questions? Check the full documentation files!**

