/**
 * Splits text into segments of Chinese characters and non-Chinese characters (letters/numbers/symbols)
 * @param text - The text to split
 * @returns Array of segments with type and content
 */
export function splitChineseText(text: string): Array<{ type: 'chinese' | 'other', content: string }> {
  const segments: Array<{ type: 'chinese' | 'other', content: string }> = []
  let currentSegment = ''
  let currentType: 'chinese' | 'other' | null = null

  for (const char of text) {
    // Check if character is Chinese (including common punctuation)
    const isChinese = /[\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]/.test(char)
    const charType: 'chinese' | 'other' = isChinese ? 'chinese' : 'other'

    if (currentType === charType) {
      currentSegment += char
    } else {
      if (currentSegment && currentType) {
        segments.push({ type: currentType, content: currentSegment })
      }
      currentSegment = char
      currentType = charType
    }
  }

  // Add the last segment
  if (currentSegment && currentType) {
    segments.push({ type: currentType, content: currentSegment })
  }

  return segments
}
