/**
 * Configuration helpers
 * Utilities for working with configuration items
 */

import type { ConfigItem } from '$lib/types/config.types';
import { generateConfigKey, getActiveItems } from '$lib/types/config.types';

/**
 * Get active configuration items
 */
export function getActiveConfigItems(items: ConfigItem[] | undefined): ConfigItem[] {
  return getActiveItems(items);
}

/**
 * Get all configuration items including inactive ones
 */
export function getAllConfigItems(items: ConfigItem[] | undefined): ConfigItem[] {
  if (!items) return [];
  return items;
}

/**
 * Convert config items to options format for Select components
 */
export function configItemsToOptions(items: ConfigItem[]) {
  return items.map(item => ({
    value: item.key,
    label: item.value
  }));
}

/**
 * Create a new config item from a label
 */
export function createConfigItem(label: string, active: boolean = true): ConfigItem {
  return {
    key: generateConfigKey(label),
    value: label,
    active
  };
}

/**
 * Find config item by key
 */
export function findConfigItemByKey(items: ConfigItem[], key: string): ConfigItem | undefined {
  return items.find(item => item.key === key);
}

/**
 * Find config item by value (label)
 */
export function findConfigItemByValue(items: ConfigItem[], value: string): ConfigItem | undefined {
  return items.find(item => item.value.toLowerCase() === value.toLowerCase());
}
