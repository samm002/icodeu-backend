export function parseStringJSONToArray(jsonString: string): string[] {
  try {
    if (!jsonString || jsonString === '') {
      return [];
    }

    const parsed = JSON.parse(jsonString);

    if (Array.isArray(parsed)) {
      return parsed as string[];
    } else {
      return [jsonString];
    }
  } catch (error) {
    throw error;
  }
}
