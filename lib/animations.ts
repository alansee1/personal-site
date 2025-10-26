/**
 * Animation Timing Constants
 * Centralized timing values for all animations across the site
 */

// ============================================================================
// ENTRY ANIMATION TIMING (Homepage entrance sequence)
// ============================================================================

export const ENTRY_TIMING = {
  // Dot sequence
  FIRST_DOT_DELAY: 300,
  DOT_INTERVAL: 345,
  DOT_ACTIVATION: 2025,
  KEY_PRESS_START: 2370,
  CONFETTI_START: 2658,
  DOT_DROP_START: 2945,

  // Line expansion
  LINE_EXPAND_START: 3520,
  LINE_DURATION: 2000, // 2 seconds

  // Typing effect
  TYPING_CHAR_DELAY: 100,

  // Total animation complete
  ANIMATION_COMPLETE: 5820,
} as const;

// ============================================================================
// NAVIGATION TRANSITION TIMING (Section navigation)
// ============================================================================

export const NAV_TIMING = {
  // Content transitions
  CONTENT_FADE_OUT: 300,
  CONTENT_FADE_IN: 300,

  // Morph animation
  MORPH_DELAY: 500,
  MORPH_DURATION: 800,

  // Section entry/exit
  SECTION_ENTRY_DELAY: 1500,
  HOME_FADE_IN_DELAY: 1400,
} as const;

// ============================================================================
// EASING CURVES
// ============================================================================

export const EASINGS = {
  // Premium morph easing
  MORPH: [0.43, 0.13, 0.23, 0.96] as [number, number, number, number],
} as const;

// ============================================================================
// ANIMATION PHASES (State machine states)
// ============================================================================

export type AnimationPhase =
  | 'idle'
  | 'entering-section'
  | 'exiting-section'
  | 'morphing-to-section'
  | 'morphing-to-home';
