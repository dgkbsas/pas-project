/**
 * Configuration helpers
 * Utilities for working with configuration items
 */

export type ConfigItem = {
  value: string;
  label: string;
  active?: boolean;
};

export type ConfigData = {
  items?: ConfigItem[];
} | ConfigItem[] | string[];

/**
 * Get active configuration items from config data
 * Handles both old array format and new object format with active status
 */
export function getActiveConfigItems(configData: ConfigData | undefined): ConfigItem[] {
  if (!configData) return [];

  // New format: object with items array
  if (typeof configData === 'object' && 'items' in configData && Array.isArray(configData.items)) {
    return configData.items.filter(item => item.active !== false);
  }

  // Old format: direct array of ConfigItems
  if (Array.isArray(configData)) {
    // Check if it's an array of strings (very old format)
    if (configData.length > 0 && typeof configData[0] === 'string') {
      return (configData as string[]).map(label => ({
        value: generateSlug(label),
        label,
        active: true
      }));
    }
    
    // Array of ConfigItems
    return (configData as ConfigItem[]).filter(item => item.active !== false);
  }

  return [];
}

/**
 * Get all configuration items including inactive ones
 */
export function getAllConfigItems(configData: ConfigData | undefined): ConfigItem[] {
  if (!configData) return [];

  // New format: object with items array
  if (typeof configData === 'object' && 'items' in configData && Array.isArray(configData.items)) {
    return configData.items;
  }

  // Old format: direct array
  if (Array.isArray(configData)) {
    if (configData.length > 0 && typeof configData[0] === 'string') {
      return (configData as string[]).map(label => ({
        value: generateSlug(label),
        label,
        active: true
      }));
    }
    return configData as ConfigItem[];
  }

  return [];
}

/**
 * Convert config items to options format for Select components
 */
export function configItemsToOptions(items: ConfigItem[]) {
  return items.map(item => ({
    value: item.value,
    label: item.label
  }));
}

/**
 * Generate a slug from a label
 */
function generateSlug(label: string): string {
  return label
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '_')      // Replace non-alphanumeric with underscore
    .replace(/^_+|_+$/g, '');          // Trim underscores
}
