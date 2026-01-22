// core/types/unicode-icons.types.ts

/**
 * Main categories for Unicode icons
 */
export enum UnicodeIconCategory {
    NAVIGATION = 'navigation',
    ACTION = 'action',
    STATUS = 'status',
    OBJECT = 'object',
    COMMUNICATION = 'communication',
    TECHNOLOGY = 'technology',
    ARROW = 'arrow',
    SYMBOL = 'symbol',
    TRANSPORT = 'transport',
    TIME = 'time',
    WEATHER = 'weather'
}

// ============================================================================
// NAVIGATION ICONS
// ============================================================================

/**
 * Navigation and main UI icons
 */
export type NavigationIcon =
    | '🏠'  // HOME
    | '⚙️'  // SETTINGS
    | '👤'  // USER
    | '👥'  // USERS
    | '🔒'  // LOCK
    | '🔓'  // UNLOCK
    | '🔑'  // KEY
    | '🚪'  // DOOR (Logout)
    | '📊'  // CHART (Dashboard)
    | '📁'  // FOLDER (Navigation)
    | '🔍'  // SEARCH (Navigation)
    | '⭐'  // STAR (Favorites)
    ;

// ============================================================================
// ACTION ICONS
// ============================================================================

/**
 * User action and operation icons
 */
export type ActionIcon =
    | '➕'  // PLUS (Add)
    | '➖'  // MINUS (Remove)
    | '✏️'  // PENCIL (Edit)
    | '📝'  // MEMO (Note)
    | '🗑️'  // WASTEBASKET (Delete)
    | '📤'  // OUTBOX (Upload)
    | '📥'  // INBOX (Download)
    | '💾'  // FLOPPY (Save)
    | '🔄'  // ARROWS CCW (Refresh)
    | '⏸️'  // PAUSE
    | '⏯️'  // PLAY/PAUSE
    | '⏹️'  // STOP
    | '⏭️'  // NEXT
    | '⏮️'  // PREVIOUS
    | '🔎'  // MAGNIFIER PLUS (Zoom in)
    | '📋'  // CLIPBOARD (Copy)
    | '✂️'  // SCISSORS (Cut)
    | '📄'  // DOCUMENT (New)
    | '📑'  // BOOKMARK TABS
    | '🔖'  // BOOKMARK
    | '💵'  // DOLLAR (Payment)
    | '💰'  // MONEY BAG (Transaction)
    ;

// ============================================================================
// STATUS ICONS
// ============================================================================

/**
 * Status and state indication icons
 */
export type StatusIcon =
    | '✅'  // WHITE CHECK MARK (Success)
    | '✔️'  // HEAVY CHECK MARK (Done)
    | '❌'  // CROSS MARK (Error)
    | '⭕'  // HEAVY CIRCLE (Cancel)
    | '⚠️'  // WARNING
    | '🚫'  // NO ENTRY (Forbidden)
    | 'ℹ️'  // INFORMATION SOURCE
    | '🔴'  // RED CIRCLE (Offline/Error)
    | '🟢'  // GREEN CIRCLE (Online/Success)
    | '🟡'  // YELLOW CIRCLE (Warning)
    | '🔵'  // BLUE CIRCLE (Info)
    | '⏳'  // HOURGLASS (Loading)
    | '⌛'  // HOURGLASS DONE
    | '☑️'  // BALLOT BOX WITH CHECK (Checked)
    | '⬜'  // WHITE MEDIUM SQUARE (Unchecked)
    | '🔒'  // LOCK (also status: locked)
    | '🔓'  // UNLOCK (also status: unlocked)
    ;

// ============================================================================
// OBJECT ICONS
// ============================================================================

/**
 * Physical object and file type icons
 */
export type ObjectIcon =
    | '📁'  // FOLDER
    | '📂'  // OPEN FOLDER
    | '📅'  // CALENDAR
    | '📊'  // BAR CHART
    | '📈'  // CHART UP
    | '📉'  // CHART DOWN
    | '📦'  // PACKAGE
    | '📄'  // DOCUMENT
    | '📎'  // PAPERCLIP
    | '🔗'  // LINK
    | '🛒'  // SHOPPING CART
    | '🎯'  // BULLSEYE (Target/Goal)
    | '🎨'  // ARTIST PALETTE (Design)
    | '🛡️'  // SHIELD (Protection)
    ;

// ============================================================================
// COMMUNICATION ICONS
// ============================================================================

/**
 * Communication and social interaction icons
 */
export type CommunicationIcon =
    | '📧'  // EMAIL
    | '📨'  // INCOMING EMAIL
    | '📩'  // EMAIL WITH ARROW
    | '💬'  // SPEECH BALLOON
    | '👁️'  // EYE (View)
    | '👁️‍🗨️' // EYE IN SPEECH BUBBLE
    | '🔔'  // BELL (Notification)
    | '📢'  // LOUDSPEAKER (Announce)
    | '📣'  // MEGAPHONE
    | '🔈'  // SPEAKER (Sound)
    | '🔇'  // MUTED SPEAKER
    ;

// ============================================================================
// TECHNOLOGY ICONS
// ============================================================================

/**
 * Technology and device icons
 */
export type TechnologyIcon =
    | '📱'  // MOBILE PHONE
    | '💻'  // LAPTOP
    | '🖥️'  // DESKTOP
    | '⌨️'  // KEYBOARD
    | '🖱️'  // MOUSE
    | '🖨️'  // PRINTER
    | '📡'  // SATELLITE
    | '🔌'  // PLUG
    | '🔋'  // BATTERY
    | '💡'  // LIGHT BULB (Idea)
    | '💾'  // FLOPPY (Save/Storage)
    | '🔄'  // ARROWS CCW (Refresh/Sync)
    ;

// ============================================================================
// ARROW ICONS
// ============================================================================

/**
 * Arrow and direction icons
 */
export type ArrowIcon =
    | '⬆️'  // UP ARROW
    | '⬇️'  // DOWN ARROW
    | '⬅️'  // LEFT ARROW
    | '➡️'  // RIGHT ARROW
    | '↕️'  // UP DOWN ARROW
    | '↔️'  // LEFT RIGHT ARROW
    | '↩️'  // LEFT ARROW CURVING RIGHT (Reply)
    | '↪️'  // RIGHT ARROW CURVING LEFT (Forward)
    | '⤴️'  // ARROW POINTING RIGHT THEN CURVING UP
    | '⤵️'  // ARROW POINTING RIGHT THEN CURVING DOWN
    | '🔃'  // CLOCKWISE ARROWS (Sync)
    | '🔄'  // COUNTERCLOCKWISE ARROWS (Refresh)
    ;

// ============================================================================
// SYMBOL ICONS
// ============================================================================

/**
 * Abstract symbols and shapes
 */
export type SymbolIcon =
    | '❤️'  // RED HEART (Favorite/Like)
    | '⭐'  // WHITE MEDIUM STAR (Star/Rating)
    | '🌟'  // GLOWING STAR (Featured)
    | '🔥'  // FIRE (Hot/Trending)
    | '💧'  // DROP (Water/Liquid)
    | '✨'  // SPARKLES (New/Shiny)
    | '⚔️'  // CROSSED SWORDS (Battle/Compare)
    | '🎯'  // BULLSEYE (Target)
    | '🎨'  // ARTIST PALETTE (Design)
    | '🛡️'  // SHIELD (Protection)
    | '🚀'  // ROCKET (Fast/Launch)
    ;

// ============================================================================
// TRANSPORT ICONS
// ============================================================================

/**
 * Transportation and vehicle icons
 */
export type TransportIcon =
    | '🚗'  // CAR
    | '✈️'  // AIRPLANE
    | '🚀'  // ROCKET (Fast/Launch)
    | '🛒'  // SHOPPING CART
    | '📦'  // PACKAGE (Shipping)
    ;

// ============================================================================
// TIME ICONS
// ============================================================================

/**
 * Time and schedule related icons
 */
export type TimeIcon =
    | '⏰'  // ALARM CLOCK
    | '🕐'  // ONE O'CLOCK
    | '🕙'  // TEN O'CLOCK
    | '📅'  // CALENDAR
    | '🎯'  // TARGET (Deadline)
    | '⏳'  // HOURGLASS (Loading/Time passing)
    | '⌛'  // HOURGLASS DONE (Time's up)
    ;

// ============================================================================
// WEATHER ICONS
// ============================================================================

/**
 * Weather and nature icons
 */
export type WeatherIcon =
    | '☀️'  // SUN
    | '☁️'  // CLOUD
    | '⛈️'  // THUNDER CLOUD
    | '🌈'  // RAINBOW
    | '💧'  // DROP (Rain)
    ;

// ============================================================================
// MAIN UNION TYPE
// ============================================================================

/**
 * Complete set of commonly used Unicode icons
 * Union of all categorized icon types
 */
export type CommonUnicodeIcon =
    | NavigationIcon
    | ActionIcon
    | StatusIcon
    | ObjectIcon
    | CommunicationIcon
    | TechnologyIcon
    | ArrowIcon
    | SymbolIcon
    | TransportIcon
    | TimeIcon
    | WeatherIcon;
