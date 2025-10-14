#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const server = new Server(
  {
    name: 'supabase-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'query_database',
        description: 'Execute a SQL query on the Supabase database',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'SQL query to execute',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'list_tables',
        description: 'List all tables in the database',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_table_schema',
        description: 'Get the schema of a specific table',
        inputSchema: {
          type: 'object',
          properties: {
            table_name: {
              type: 'string',
              description: 'Name of the table',
            },
          },
          required: ['table_name'],
        },
      },
      {
        name: 'insert_data',
        description: 'Insert data into a table',
        inputSchema: {
          type: 'object',
          properties: {
            table_name: {
              type: 'string',
              description: 'Name of the table',
            },
            data: {
              type: 'object',
              description: 'Data to insert (as JSON object)',
            },
          },
          required: ['table_name', 'data'],
        },
      },
      {
        name: 'update_data',
        description: 'Update data in a table',
        inputSchema: {
          type: 'object',
          properties: {
            table_name: {
              type: 'string',
              description: 'Name of the table',
            },
            filters: {
              type: 'object',
              description: 'Filters to match rows (e.g., {id: 1})',
            },
            data: {
              type: 'object',
              description: 'Data to update',
            },
          },
          required: ['table_name', 'filters', 'data'],
        },
      },
      {
        name: 'delete_data',
        description: 'Delete data from a table',
        inputSchema: {
          type: 'object',
          properties: {
            table_name: {
              type: 'string',
              description: 'Name of the table',
            },
            filters: {
              type: 'object',
              description: 'Filters to match rows to delete',
            },
          },
          required: ['table_name', 'filters'],
        },
      },
      {
        name: 'select_data',
        description: 'Select data from a table with optional filters',
        inputSchema: {
          type: 'object',
          properties: {
            table_name: {
              type: 'string',
              description: 'Name of the table',
            },
            columns: {
              type: 'string',
              description: 'Columns to select (comma-separated or "*")',
              default: '*',
            },
            filters: {
              type: 'object',
              description: 'Optional filters (e.g., {status: "active"})',
            },
            limit: {
              type: 'number',
              description: 'Limit number of results',
            },
          },
          required: ['table_name'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'query_database': {
        const { data, error } = await supabase.rpc('exec_sql', { sql: args.query });
        if (error) throw error;
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case 'list_tables': {
        const { data, error } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public');
        
        if (error) throw error;
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case 'get_table_schema': {
        const { data, error } = await supabase
          .from('information_schema.columns')
          .select('column_name, data_type, is_nullable')
          .eq('table_name', args.table_name)
          .eq('table_schema', 'public');
        
        if (error) throw error;
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case 'select_data': {
        let query = supabase.from(args.table_name).select(args.columns || '*');
        
        if (args.filters) {
          Object.entries(args.filters).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }
        
        if (args.limit) {
          query = query.limit(args.limit);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case 'insert_data': {
        const { data, error } = await supabase
          .from(args.table_name)
          .insert(args.data)
          .select();
        
        if (error) throw error;
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case 'update_data': {
        let query = supabase.from(args.table_name).update(args.data);
        
        Object.entries(args.filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
        
        const { data, error } = await query.select();
        if (error) throw error;
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case 'delete_data': {
        let query = supabase.from(args.table_name).delete();
        
        Object.entries(args.filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
        
        const { data, error } = await query.select();
        if (error) throw error;
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Supabase MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
