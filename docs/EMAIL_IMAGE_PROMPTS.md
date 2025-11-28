# Email Image Generation Prompts

## Overview

These prompts are designed to generate consistent, branded images featuring the CEO/owner for email campaigns. Each image shows the same person in different scenarios, creating a cohesive and personal brand experience.

## Requirements

1. **Reference Image**: A clear, well-lit photo of the CEO/owner (headshot or upper body)
2. **AI Tool**: Gemini, Midjourney, DALL-E, or similar with reference image support
3. **Output**: 16:9 aspect ratio for email headers, 1:1 for profile photos

## Image Set

### 1. Confirmation Email - Welcome Image
**Filename:** `confirmation-electrician.jpg`
**Aspect Ratio:** 16:9
**Use Case:** Sent immediately after lead submits funnel

```
Professional photograph of a German electrician (use the reference person's face and features)
giving a friendly thumbs up gesture, wearing clean professional work clothes with a company logo.

Setting: Modern, well-lit workshop or customer's home entrance.
Expression: Warm, welcoming smile, confident and approachable.
Style: High-quality commercial photography, natural lighting, shallow depth of field.
The person should look directly at the camera, creating a personal connection.
Colors: Warm tones, professional atmosphere.

Important: The person MUST look exactly like the reference image provided.
```

---

### 2. Follow-Up Day 1 - "Just Checking"
**Filename:** `followup-checking.jpg`
**Aspect Ratio:** 16:9
**Use Case:** Sent 24 hours after initial inquiry

```
Professional photograph of a German electrician (use the reference person's face and features)
using a digital multimeter or voltage tester on an electrical panel.

Setting: Modern home electrical panel/fuse box area, clean and organized.
Expression: Focused but friendly, slight smile, looking at the meter then glancing at camera.
Pose: Holding the testing device professionally, demonstrating expertise.
Style: High-quality commercial photography, showing competence and attention to detail.

Concept: "Just checking" - The electrician is checking if there's power,
metaphor for checking in on the customer.

The image should feel reassuring and professional.

Important: The person MUST look exactly like the reference image provided.
```

---

### 3. Follow-Up Day 3 - "We're Working Hard"
**Filename:** `followup-working.jpg`
**Aspect Ratio:** 16:9
**Use Case:** Sent 3 days after initial inquiry

```
Professional photograph of a German electrician (use the reference person's face and features)
actively working on a smart home installation or electrical work.

Setting: Modern home interior, installing smart switches, KNX components, or cable work.
Expression: Concentrated but content, pride in craftsmanship visible.
Pose: Hands working on installation, professional tools visible.
Style: Action shot but composed, showing skilled work in progress.
Lighting: Natural daylight from windows mixed with work lighting.

The image should convey expertise, quality work, and dedication.
Shows: "While you're deciding, we're busy helping others - quality work takes care."

Important: The person MUST look exactly like the reference image provided.
```

---

### 4. Follow-Up Day 7 - "Project Complete"
**Filename:** `followup-complete.jpg`
**Aspect Ratio:** 16:9
**Use Case:** Final follow-up email

```
Professional photograph of a German electrician (use the reference person's face and features)
standing proudly next to a completed smart home installation or modern electrical panel.

Setting: Beautiful modern home interior with visible smart home elements
(touchscreens, elegant switches, LED lighting).
Expression: Satisfied, proud smile, confident posture with arms slightly crossed or hands on hips.
Pose: Standing next to the finished work, gesturing towards it or presenting it.
Style: Hero shot, the culmination of professional work.
Lighting: Warm, inviting atmosphere showing the quality of the finished project.

The image should convey success, quality, and customer satisfaction.
Message: "This could be your home."

Important: The person MUST look exactly like the reference image provided.
```

---

### 5. Hot Lead Alert - "On Our Way"
**Filename:** `hot-lead-urgent.jpg`
**Aspect Ratio:** 16:9
**Use Case:** Owner notification for high-priority leads

```
Professional photograph of a German electrician (use the reference person's face and features)
ready for action, perhaps putting on work gloves or grabbing a tool bag.

Setting: Professional van or workshop, ready to respond to a call.
Expression: Alert, ready, energetic - conveying urgency and responsiveness.
Pose: Dynamic, in motion, showing readiness to help immediately.
Style: Action-ready shot, professional and responsive.
Lighting: Bright, energetic lighting.

The image should convey: "We're on our way!" - immediate response and priority service.

Important: The person MUST look exactly like the reference image provided.
```

---

### 6. Owner Profile Photo
**Filename:** `owner-photo.jpg`
**Aspect Ratio:** 1:1 (square)
**Use Case:** Email signatures, about sections

```
Professional headshot/portrait of a German electrician (use the reference person's face and features)
for use in email signatures and about sections.

Setting: Clean, neutral or slightly blurred professional background.
Expression: Warm, trustworthy smile, direct eye contact with camera.
Pose: Head and shoulders, slightly angled, professional but approachable.
Attire: Clean professional work shirt or polo with company branding visible.
Style: LinkedIn-quality professional portrait, high resolution.
Lighting: Soft, flattering studio-style lighting.

The image should build trust and personal connection.

Important: The person MUST look exactly like the reference image provided.
```

---

## Generation Tips

### For Best Results:

1. **Reference Image Quality**
   - Use a high-resolution photo (at least 1024x1024)
   - Good lighting, clear face visibility
   - Neutral expression works best as a base
   - Front-facing or slight angle

2. **Consistency Checklist**
   - Same person in all images
   - Consistent skin tone
   - Similar hair style/length
   - Age-appropriate across all images

3. **Brand Alignment**
   - Use company colors where possible (work clothes, tools, van)
   - Professional German Handwerk aesthetic
   - Clean, organized settings
   - Modern but accessible technology

4. **Technical Specs**
   - Output: 1920x1080 (16:9) or 1080x1080 (1:1)
   - Format: JPEG, high quality
   - File size: Under 500KB for email optimization

### Tools Recommended:

| Tool | Reference Support | Quality | Notes |
|------|-------------------|---------|-------|
| **Midjourney** | --cref flag | Excellent | Best for photorealistic |
| **DALL-E 3** | Image input | Very Good | Good consistency |
| **Gemini Imagen** | Reference API | Good | Integrated with our stack |
| **Stable Diffusion** | IP-Adapter | Good | Self-hosted option |

---

## File Locations

After generation, place images in:
```
public/images/email/
├── confirmation-electrician.jpg
├── followup-checking.jpg
├── followup-working.jpg
├── followup-complete.jpg
├── hot-lead-urgent.jpg
└── owner-photo.jpg
```

Update `src/emails/config/brand.config.ts` with the hosted URLs after deployment.

---

## Client Onboarding Checklist

When setting up a new client:

- [ ] Obtain reference photo of CEO/owner
- [ ] Verify photo quality and lighting
- [ ] Generate all 6 email images
- [ ] Optimize images for web (<500KB each)
- [ ] Upload to client's hosting/CDN
- [ ] Update brand.config.ts with URLs
- [ ] Test emails render correctly with images
