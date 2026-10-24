# URBEN.ENTT — ASSET INVENTORY & MEDIA AUDIT

Date of Audit: October 2026
Workspace Root: `c:\Users\gauta\OneDrive\Desktop\new project`
Discovery Path: `C:\Users\gauta\Downloads`

---

## 1. Discovered Assets Summary

| Stem Reference | Actual Filename | Discovered Location | Format / MIME | File Size | Detected Purpose / Content | Target Website Usage |
|---|---|---|---|---|---|---|
| **IMG_5617** | `IMG_5617.PNG` | `C:\Users\gauta\Downloads\IMG_5617.PNG` | PNG image (`image/png`) | 1.85 MB (1,936,040 B) | Official NOCTURNE poster ("WHEN THE DARK RISES", Mall of Asia, 31st Oct 2026, 2PM-6PM, DJ KATZ, SortMyScene tickets, APEX x BLAH BLA collaboration). | Featured Event Hero Card, NOCTURNE Event Detail Page header, OpenGraph preview. |
| **IMG_5580** | `IMG_5580.PNG` | `C:\Users\gauta\Downloads\IMG_5580.PNG` | PNG image (`image/png`) | 2.31 MB (2,424,929 B) | NOCTURNE artist feature poster spotlighting DJ KATZ with dark moon and Halloween aesthetic, Mall of Asia, 31st Oct 2026. | Artist Lineup Spotlight, NOCTURNE Gallery, promotional banner. |
| **IMG_5561** | `IMG_5561.PNG` | `C:\Users\gauta\Downloads\IMG_5561.PNG` | PNG image (`image/png`) | 1.72 MB (1,805,036 B) | MISTERY MATCH themed interactive activity poster ("SAME NUMBER. DIFFERENT SOULS. 17 Boys / 17 Girls - Find Your Match at NOCTURNE 31 October"). | NOCTURNE Activity Feature card, Interactive Experience breakdown. |
| **IMG_5345** | `IMG_5345.MOV` | `C:\Users\gauta\Downloads\New folder (2)\IMG_5345.MOV` | QuickTime / MP4 Video (`video/quicktime`) | 10.89 MB (11,417,786 B) | Verified promotional video footage for upcoming event production. High energy, cinematic crowd and lights. | **Homepage Hero Video** (Full-screen background video with muted autoplay, loop, and interactive play/pause). |
| **IMG_5622** | `IMG_5622.MOV` | `C:\Users\gauta\Downloads\New folder (2)\IMG_5622.MOV` | QuickTime / MP4 Video (`video/quicktime`) | 9.34 MB (9,789,534 B) | *Discovered as MOV video (not a static poster)*. Contains DJ performance / club event footage. | **Past Events Showcase Video** & Media Lightbox portfolio player. |
| **IMG_5623** | `IMG_5623.PNG` | `C:\Users\gauta\Downloads\IMG_5623.PNG` | PNG image (`image/png`) | 349.5 KB (357,948 B) | SortMyScene Bengaluru event schedule reference table (listing NOVA - BREAK THE FLOOR at BLAH BLA with VATSAA, SUBVOLT, TRANCEGROUND, etc.). | Internal schedule reference and metadata seed for past Bengaluru events calendar. Marked as reference only. |
| **IMG_5624** | *Missing from Downloads* | Expected in Downloads / external | Expected Poster | N/A | Expected NOVA: BREAK THE FLOOR poster. | Curated editorial fallback card generated for the NOVA event in past events portfolio until original asset is provided. |

---

## 2. Collaborator & Brand Identity Matrix

- **URBEN.ENTT**: Primary event management & experiences brand. Owns the platform, creative direction, and curation.
- **APEX**: Present as collaborator ("APEX Pure Chaos") on NOCTURNE poster. Treated as an event collaborator, not an internal sub-brand.
- **BLAH BLA**: Present as collaborator ("BLAH BLA Energy Unleashed") on NOCTURNE poster and venue/partner for NOVA - BREAK THE FLOOR. Treated as an event collaborator & partner venue.
- **SortMyScene**: Official ticketing and event discovery platform partner. Linkable for ticket booking.

---

## 3. Storage & Asset Pipeline Plan

1. Assets will be copied into `public/assets/` in a clean directory hierarchy:
   - `public/assets/videos/hero-promo.mov` (`IMG_5345.MOV`)
   - `public/assets/videos/past-event-reel.mov` (`IMG_5622.MOV`)
   - `public/assets/events/nocturne/main-poster.png` (`IMG_5617.PNG`)
   - `public/assets/events/nocturne/dj-katz-poster.png` (`IMG_5580.PNG`)
   - `public/assets/events/nocturne/mystery-match.png` (`IMG_5561.PNG`)
   - `public/assets/reference/bengaluru-schedule.png` (`IMG_5623.PNG`)
2. Videos will be loaded with `preload="metadata"` and poster fallback so page loading is instant.
3. Original source files in `C:\Users\gauta\Downloads` remain untouched and intact.
