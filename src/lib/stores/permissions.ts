import { derived, writable } from "svelte/store";

export const myPermissions = writable<string[]>([]);

function matchesPermission(grantedPattern: string, required: string): boolean {
  if (grantedPattern === '*' || grantedPattern === required) return true;

  if (grantedPattern.endsWith('.*')) {
    const prefix = grantedPattern.slice(0, -2);
    if (required.startsWith(prefix + '.')) return true;
  }

  return false;
}

export const can = derived(myPermissions, ($perms) => {
  return (requiredPermission: string): boolean => {
    if ($perms.includes('*') || $perms.includes(requiredPermission)) {
      return true;
    }

    return $perms.some((p) => p.includes('*') && matchesPermission(p, requiredPermission));
  };
});

export const hasAnyInNamespace = derived(myPermissions, ($perms) => {
  return (namespace: string): boolean => {
    if (!Array.isArray($perms)) return false;

    if ($perms.includes('*')) return true;

    const cleanNamespace = namespace.endsWith('.') ? namespace.slice(0, -1) : namespace;
    const prefix = `${cleanNamespace}.`;

    return $perms.some((p) => {
      if (typeof p !== 'string') return false;

      if (p === cleanNamespace || p === `${cleanNamespace}.*`) return true;

      if (p.startsWith(prefix)) return true;

      if (p.endsWith('.*')) {
        const parentWildcard = p.slice(0, -2);
        if (cleanNamespace === parentWildcard || cleanNamespace.startsWith(`${parentWildcard}.`)) {
          return true;
        }
      }

      return false;
    });
  };
});