export function okResponse(message?: string) {
  return { message: message ?? "Resource saved successfully" };
}

export function generateOrganizationCacheKey(reference: string) {
  return `${reference}_organization_data`;
}
