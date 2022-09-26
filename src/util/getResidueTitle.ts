export function getResidueTitle(residueType: string): string {
  const residueFormat = residueType.toLowerCase();
  const capital = residueFormat.charAt(0).toUpperCase();
  return `${capital}${residueFormat.substring(1)}`;
}
