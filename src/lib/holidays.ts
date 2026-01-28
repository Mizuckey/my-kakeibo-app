// 日本の祝日を判定する関数
export function isHolidayInJapan(date: Date): boolean {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const year = date.getFullYear()
  const dayOfWeek = date.getDay()

  // 固定祝日
  const fixedHolidays: Record<number, number[]> = {
    1: [1], // 元日
    2: [11], // 建国記念の日
    3: [21], // 春分の日（通常）
    4: [29], // 昭和の日
    5: [3, 4, 5], // 憲法記念日、みどりの日、こどもの日
    7: [15], // 海の日（第3月曜日の前の日）
    8: [11], // 山の日
    9: [16, 23], // 敬老の日（第3月曜日の前の日）、秋分の日
    10: [10], // 体育の日（第2月曜日の前の日）
    11: [3, 23], // 文化の日、勤労感謝の日
    12: [],
  }

  // 固定祝日を確認
  if (fixedHolidays[month]?.includes(day)) {
    return true
  }

  // 春分の日（3月20日または21日）
  if (month === 3) {
    const vernal = getVernalEquinoxDay(year)
    if (day === vernal) return true
  }

  // 秋分の日（9月22日または23日）
  if (month === 9) {
    const autumnal = getAutumnalEquinoxDay(year)
    if (day === autumnal) return true
  }

  // 成人の日（1月第2月曜日）
  if (month === 1 && isSecondMonday(date)) return true

  // 海の日（7月第3月曜日）
  if (month === 7 && isThirdMonday(date)) return true

  // 敬老の日（9月第3月曜日）
  if (month === 9 && isThirdMonday(date)) return true

  // 体育の日（10月第2月曜日）
  if (month === 10 && isSecondMonday(date)) return true

  return false
}

function getVernalEquinoxDay(year: number): number {
  // 春分の日の計算式
  if (year <= 1947) return 21
  if (year <= 1979) return Math.floor(20.8357 + 0.242194 * (year - 1980)) === 20 ? 20 : 21
  if (year <= 2099) return Math.floor(20.8357 + 0.242194 * (year - 1980)) === 20 ? 20 : 21
  return 20
}

function getAutumnalEquinoxDay(year: number): number {
  // 秋分の日の計算式
  if (year <= 1947) return 23
  if (year <= 1979) return Math.floor(23.2588 + 0.242194 * (year - 1980)) === 23 ? 23 : 22
  if (year <= 2099) return Math.floor(23.2588 + 0.242194 * (year - 1980)) === 23 ? 23 : 22
  return 23
}

function isSecondMonday(date: Date): boolean {
  if (date.getDay() !== 1) return false
  const day = date.getDate()
  return day >= 8 && day <= 14
}

function isThirdMonday(date: Date): boolean {
  if (date.getDay() !== 1) return false
  const day = date.getDate()
  return day >= 15 && day <= 21
}
