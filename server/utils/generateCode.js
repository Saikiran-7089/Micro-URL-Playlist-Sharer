import { nanoid } from 'nanoid';
import supabase from '../config/supabase.js';

/**
 * Generate a unique random code and check if it already exists in the given table/column
 * @param {string} table The database table to check against (e.g., 'urls', 'playlists')
 * @param {string} column The column to check for uniqueness (e.g., 'short_code', 'playlist_code')
 * @param {number} length The length of the generated code (default 6)
 * @param {string} prefix Optional prefix for the code
 * @returns {Promise<string>} A unique code
 */
export const generateUniqueCode = async (table, column, length = 6, prefix = '') => {
  let isUnique = false;
  let code = '';

  while (!isUnique) {
    // Generate code with a mix of uppercase, lowercase, and numbers
    const randomPart = nanoid(length);
    code = `${prefix}${randomPart}`;

    // Check if it exists in the database
    const { data, error } = await supabase
      .from(table)
      .select(column)
      .eq(column, code)
      .single();

    // If there's an error finding it (and it's not a syntax error), it means no row was found (which is what we want)
    // Supabase returns PGRST116 when no rows are found using .single()
    if (error && error.code === 'PGRST116') {
      isUnique = true;
    } else if (!data) {
      isUnique = true;
    }
  }

  return code;
};
