// 날짜 형태 변경
export function formatDate(dateString: string, separator = ".") {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${separator}${month}${separator}${day}`;
}

// 빈 값 체크 함수
// value: 검사할 값 (모든 타입)
export function isEmpty<T>(value: T): boolean {
  return (
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "object" &&
      value !== null &&
      Object.keys(value).length === 0)
  );
}

// 디바운스 함수
// func: 호출할 함수, delay: 디바운스 시간 (ms)
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

// 깊은 복사 함수
// obj: 복사할 객체 (모든 타입)
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// 배열 중복 제거 함수
// arr: 중복 제거할 배열 (모든 타입)
export function uniqueArray<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

(globalThis as any).formatDate = formatDate;
(globalThis as any).isEmpty = isEmpty;
(globalThis as any).isEmpty = debounce;
(globalThis as any).isEmpty = deepClone;
(globalThis as any).isEmpty = uniqueArray;
