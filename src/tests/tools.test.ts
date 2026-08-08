// Basic tests for everquest-mcp tools
import { handleToolCall, tools } from '../tools.js';
import { normalizeQuery, levenshtein, fuzzyMatch, getCacheStats, clearCache } from '../sources/base.js';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

// Test validation functions
async function testValidation() {
  console.log('Testing input validation...');

  // Test missing query
  const result1 = await handleToolCall('search_all', {});
  assert(
    result1.includes('Error: query parameter must be a non-empty string'),
    'Should reject missing query'
  );

  // Test empty query
  const result2 = await handleToolCall('search_eq', { query: '' });
  assert(
    result2.includes('Error: query parameter must be a non-empty string'),
    'Should reject empty query'
  );

  // Test empty query with spaces
  const result3 = await handleToolCall('search_spells', { query: '   ' });
  assert(
    result3.includes('Error: query parameter must be a non-empty string'),
    'Should reject whitespace-only query'
  );

  // Test missing id
  const result4 = await handleToolCall('get_spell', {});
  assert(
    result4.includes('Error: id parameter must be a non-empty string'),
    'Should reject missing id'
  );

  // Test unknown tool
  const result5 = await handleToolCall('unknown_tool', {});
  assert(result5.includes('Unknown tool'), 'Should reject unknown tool');

  console.log('Validation tests passed!');
}

// Test tool definitions
function testToolDefinitions() {
  console.log('Testing tool definitions...');

  // Check all tools have required fields
  for (const tool of tools) {
    assert(typeof tool.name === 'string', `Tool ${tool.name} should have name`);
    assert(typeof tool.description === 'string', `Tool ${tool.name} should have description`);
    assert(typeof tool.inputSchema === 'object', `Tool ${tool.name} should have inputSchema`);
    assert(tool.inputSchema.type === 'object', `Tool ${tool.name} schema should be object type`);
  }

  // Check expected tools exist
  const expectedTools = [
    'search_all',
    'search_quests',
    'search_tradeskills',
    'search_eq',
    'get_spell',
    'get_item',
    'get_npc',
    'get_zone',
    'search_spells',
    'search_items',
    'search_npcs',
    'search_zones',
    'search_almars',
    'search_eqresource',
    'search_fanra',
    'search_eqtraders',
    'search_lucy',
    'search_raidloot',
    'search_ui',
    'get_official_history_of_norrath',
    'search_fvproject_lore',
    'get_fvproject_lore',
    'search_eqarchives',
    'get_eqarchive_document',
    'list_sources',
    'eq1_sources',
    'list_tool_groups',
  ];

  for (const toolName of expectedTools) {
    assert(
      tools.some((t) => t.name === toolName),
      `Tool ${toolName} should exist`
    );
  }

  // Descriptions carry [group] prefixes for navigation without renaming IDs.
  const sample = tools.find((t) => t.name === 'search_all');
  assert(Boolean(sample?.description.startsWith('[multi-source]')), 'search_all should be tagged multi-source');
  const localSample = tools.find((t) => t.name === 'get_local_data_status');
  assert(Boolean(localSample?.description.startsWith('[meta]')), 'get_local_data_status should be tagged meta');

  console.log(`Tool definitions tests passed! (${tools.length} tools)`);
}

// Test list_sources tool
async function testListSources() {
  console.log('Testing list_sources...');

  const result = await handleToolCall('list_sources', {});

  assert(result.includes('Allakhazam'), 'Should list Allakhazam');
  assert(result.includes("Almar's Guides"), "Should list Almar's Guides");
  assert(result.includes('EQResource'), 'Should list EQResource');
  assert(result.includes("Fanra's Wiki"), "Should list Fanra's Wiki");
  assert(result.includes('EQ Traders'), 'Should list EQ Traders');
  assert(result.includes("Zliz's Compendium"), "Should list Zliz's Compendium");
  assert(result.includes('Lucy'), 'Should list Lucy');
  assert(result.includes('RaidLoot'), 'Should list RaidLoot');
  assert(result.includes('EQInterface'), 'Should list EQInterface');
  assert(result.includes('Official Sony EQ History'), 'Should list official archived EQ history');
  assert(result.includes('The Firiona Vie Project Lore'), 'Should list FVProject lore');
  assert(result.includes('EQArchives'), 'Should list EQArchives');
  assert(result.includes('Cache') || result.includes('cache'), 'Should show cache stats');
  assert(result.includes('Authority'), 'Should report authority (local-game vs online)');
  assert(result.includes('local-game'), 'Should mention local-game authority');
  assert(result.includes('Tool groups'), 'Should summarize tool groups');

  const alias = await handleToolCall('eq1_sources', {});
  assert(alias.includes('Allakhazam'), 'eq1_sources alias should match list_sources');

  const groups = await handleToolCall('list_tool_groups', { group: 'meta' });
  assert(groups.includes('list_sources'), 'list_tool_groups meta should include list_sources');
  assert(groups.includes('eq1_sources'), 'list_tool_groups meta should include eq1_sources');

  console.log('list_sources tests passed!');
}

// Test fuzzy matching functions
function testFuzzyMatching() {
  console.log('Testing fuzzy matching...');

  // Test normalizeQuery
  assert(
    normalizeQuery('PoK') === 'plane of knowledge',
    'Should expand PoK abbreviation'
  );
  assert(
    normalizeQuery('sol a') === "solusek's eye",
    'Should expand sol a abbreviation'
  );
  assert(
    normalizeQuery('  TEST  ') === 'test',
    'Should trim and lowercase'
  );

  // Test levenshtein distance
  assert(levenshtein('', '') === 0, 'Empty strings should have distance 0');
  assert(levenshtein('abc', 'abc') === 0, 'Same strings should have distance 0');
  assert(levenshtein('abc', 'abd') === 1, 'One char diff should be 1');
  assert(levenshtein('kitten', 'sitting') === 3, 'kitten->sitting should be 3');

  // Test fuzzyMatch
  assert(fuzzyMatch('test', 'test'), 'Exact match should pass');
  assert(fuzzyMatch('test', 'testing'), 'Substring should pass');
  assert(fuzzyMatch('tset', 'test', 0.5), 'Typo with loose threshold should pass');
  assert(!fuzzyMatch('xyz', 'abc'), 'Unrelated strings should fail');

  console.log('Fuzzy matching tests passed!');
}

// Test cache functions
function testCacheFunctions() {
  console.log('Testing cache functions...');

  const stats = getCacheStats();
  assert(typeof stats.size === 'number', 'Cache size should be a number');
  assert(typeof stats.maxSize === 'number', 'Cache maxSize should be a number');
  assert(stats.maxSize === 500, 'Cache maxSize should be 500');

  // Clear cache and verify
  clearCache();
  const afterClear = getCacheStats();
  assert(afterClear.size === 0, 'Cache should be empty after clear');

  console.log('Cache function tests passed!');
}

// Run all tests
async function runTests() {
  console.log('=== Running everquest-mcp tests ===\n');

  try {
    testToolDefinitions();
    await testValidation();
    await testListSources();
    testFuzzyMatching();
    testCacheFunctions();

    console.log('\n=== All tests passed! ===');
    process.exit(0);
  } catch (error) {
    console.error('\n=== Tests failed! ===');
    console.error(error);
    process.exit(1);
  }
}

runTests();
