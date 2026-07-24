// Representative country list with international dial codes for the booking/contact forms.
// Ethiopia is first (default). Extend as needed before launch.
export interface Country {
  name: string;
  code: string; // ISO-2
  dial: string;
  flag: string;
}

export const countries: Country[] = [
  { name: "Ethiopia", code: "ET", dial: "+251", flag: "🇪🇹" },
  { name: "United States", code: "US", dial: "+1", flag: "🇺🇸" },
  { name: "United Kingdom", code: "GB", dial: "+44", flag: "🇬🇧" },
  { name: "Canada", code: "CA", dial: "+1", flag: "🇨🇦" },
  { name: "Australia", code: "AU", dial: "+61", flag: "🇦🇺" },
  { name: "Germany", code: "DE", dial: "+49", flag: "🇩🇪" },
  { name: "France", code: "FR", dial: "+33", flag: "🇫🇷" },
  { name: "Italy", code: "IT", dial: "+39", flag: "🇮🇹" },
  { name: "Spain", code: "ES", dial: "+34", flag: "🇪🇸" },
  { name: "Netherlands", code: "NL", dial: "+31", flag: "🇳🇱" },
  { name: "Belgium", code: "BE", dial: "+32", flag: "🇧🇪" },
  { name: "Switzerland", code: "CH", dial: "+41", flag: "🇨🇭" },
  { name: "Austria", code: "AT", dial: "+43", flag: "🇦🇹" },
  { name: "Sweden", code: "SE", dial: "+46", flag: "🇸🇪" },
  { name: "Norway", code: "NO", dial: "+47", flag: "🇳🇴" },
  { name: "Denmark", code: "DK", dial: "+45", flag: "🇩🇰" },
  { name: "Finland", code: "FI", dial: "+358", flag: "🇫🇮" },
  { name: "Ireland", code: "IE", dial: "+353", flag: "🇮🇪" },
  { name: "Portugal", code: "PT", dial: "+351", flag: "🇵🇹" },
  { name: "Poland", code: "PL", dial: "+48", flag: "🇵🇱" },
  { name: "Czech Republic", code: "CZ", dial: "+420", flag: "🇨🇿" },
  { name: "Greece", code: "GR", dial: "+30", flag: "🇬🇷" },
  { name: "Japan", code: "JP", dial: "+81", flag: "🇯🇵" },
  { name: "China", code: "CN", dial: "+86", flag: "🇨🇳" },
  { name: "South Korea", code: "KR", dial: "+82", flag: "🇰🇷" },
  { name: "India", code: "IN", dial: "+91", flag: "🇮🇳" },
  { name: "Singapore", code: "SG", dial: "+65", flag: "🇸🇬" },
  { name: "United Arab Emirates", code: "AE", dial: "+971", flag: "🇦🇪" },
  { name: "Saudi Arabia", code: "SA", dial: "+966", flag: "🇸🇦" },
  { name: "Israel", code: "IL", dial: "+972", flag: "🇮🇱" },
  { name: "South Africa", code: "ZA", dial: "+27", flag: "🇿🇦" },
  { name: "Kenya", code: "KE", dial: "+254", flag: "🇰🇪" },
  { name: "Nigeria", code: "NG", dial: "+234", flag: "🇳🇬" },
  { name: "Egypt", code: "EG", dial: "+20", flag: "🇪🇬" },
  { name: "Brazil", code: "BR", dial: "+55", flag: "🇧🇷" },
  { name: "Mexico", code: "MX", dial: "+52", flag: "🇲🇽" },
  { name: "Argentina", code: "AR", dial: "+54", flag: "🇦🇷" },
  { name: "New Zealand", code: "NZ", dial: "+64", flag: "🇳🇿" },
  { name: "Russia", code: "RU", dial: "+7", flag: "🇷🇺" },
  { name: "Turkey", code: "TR", dial: "+90", flag: "🇹🇷" },
  { name: "Other", code: "XX", dial: "+", flag: "🌍" },
];
