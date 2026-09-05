import type { Business, BusinessId } from "./types";

export const BUSINESSES: Business[] = [
  {
    id: "cloudforest",
    name: "Cloud Forest",
    short: "School",
    mark: "CF",
    url: "traincloudforest.com",
    category: "Private club · Greensboro",
    offer: "First month $49. Unlimited Wei Family classes. Month to month.",
    sharpAngle:
      "Parents are not buying kung fu. They are buying a room where a child is known by name.",
    icp: "Greensboro families with kids 5–14; adults 35–65 seeking real Tai Chi or kung fu, not a chain.",
    banned: [
      "McDojo-bashing in public copy",
      "Guarantee black belt",
      "Get fit fast",
      "Ninja",
      "Bootcamp energy",
    ],
    voice:
      "Quiet, specific, lineage-true. Sifu Michael Johnson / Wei Lei Ma. Legal name Greensboro Martial Arts Academy LLC dba Cloud Forest Martial Institute, 719 W Gate City Blvd. Private club, not a gym. Small classes. The instructor knows your name by the second class. Never hype. Never franchise language.",
  },
  {
    id: "dojozeus",
    name: "DojoZeus",
    short: "Dojo OS",
    mark: "DZ",
    url: "dojozeus.com",
    category: "Martial arts school software",
    offer: "Founding 35 lock $59.99/mo. Then $149. Zeus runs the office. Ares tutors students.",
    sharpAngle:
      "You teach. It runs. Replace the five-tool stack — not 'AI for your dojo.'",
    icp: "US martial arts school owners, 40–400 students, currently on Mindbody, Zen Planner, or a spreadsheet plus a Squarespace site.",
    banned: [
      "AI for your dojo as the headline",
      "Disrupt",
      "Ninja software",
      "Replace your ELD",
      "Sensei bot",
    ],
    voice:
      "Built for the mat, not the desk. Direct. Concrete. Every belt. Every dollar. Every student. One brain. Talk to owners, not instructors who cannot buy.",
  },
  {
    id: "lyceum",
    name: "Lyceum",
    short: "School platform",
    mark: "LY",
    url: "joinlyceum.com",
    category: "Online school platform",
    offer: "Start free. Starter $49/mo + 5%. Pro $99 + 2%. Academy $249/mo, 0% share forever.",
    sharpAngle:
      "A school with your name on the door. They buy ownership, then fall in love with the tutor.",
    icp: "Craft teachers opening a paid school — cooking, woodwork, music, martial arts, yoga — currently on Kajabi, Teachable, or YouTube plus a Gumroad link.",
    banned: [
      "Course creator hacks",
      "7-figure",
      "Passive income",
      "You won't believe",
      "Guru",
    ],
    voice:
      "Built by educators for educators. Honest about price. Anti-investor. The hall, rebuilt. Your members, your curriculum, your name. Never bro-marketing. Never sneer at Kajabi.",
  },
  {
    id: "rigboss",
    name: "RigBoss",
    short: "Trucking OS",
    mark: "RB",
    url: "rigboss.app",
    category: "Driver OS + fleet command",
    offer: "Trucker $79/truck. Fleet Yard from 5 seats. Sits beside the ELD.",
    sharpAngle:
      "You drive. Radar keeps the books. Never say we replace the ELD.",
    icp: "Owner-operators 1–4 trucks drowning in IFTA and the visor envelope; fleet ops 5–200 who want CSA live, not a quarterly PDF.",
    banned: [
      "Replace your ELD",
      "TMS killer",
      "Uber for trucks",
      "Disrupt freight",
      "Hustle harder",
    ],
    voice:
      "Dock-language, not SaaS-language. Hands off the glass. Guards fire before the tractor leaves. Priced in public. Short sentences. No motivational posters. Public site rigboss.app — the operating system for every tractor. App is app.rigboss.app.",
  },
  {
    id: "mechcorrect",
    name: "Mech Correct",
    short: "Shop OS",
    mark: "MC",
    url: "mechcorrect.com",
    category: "Auto shop platform",
    offer: "Starter $199/mo. AI advisor included. Founding shops lock launch pricing.",
    sharpAngle:
      "Declined work that never got a text is the leak. The photo of the leak is the demo.",
    icp: "Independent 1–8 bay shops. Service writers drowning in 'is it done yet' calls. Owners on Tekmetric, Shopmonkey, or paper.",
    banned: [
      "All-in-one as a headline",
      "Next-gen",
      "AI-powered as a headline",
      "Synergy",
      "Rip and replace with no migration",
    ],
    voice:
      "Shop floor, not Silicon Valley. The pizza tracker for repairs. Built after AI could read a photo. Tekmetric-class UX plus FullBay leak-hunting plus the advisor, one price, no modules, no sales call.",
  },
];

export const BUSINESS_BY_ID: Record<BusinessId, Business> = Object.fromEntries(
  BUSINESSES.map((b) => [b.id, b]),
) as Record<BusinessId, Business>;
