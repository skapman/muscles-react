# 🔍 Graph Debugging Instructions for LLM

## Context

You are debugging the D3.js force-directed graph in the Fascia anatomy/fitness web service. The graph visualization has been migrated from old JS data modules to a new MDX-based content system.

**Current state:**
- ✅ Content migrated: 35 entries (10 muscles, 20 exercises, 5 goals)
- ✅ Content index generated: `src/data/content-index.json`
- ✅ Graph infrastructure exists: GraphSVG.jsx, useGraphData.js, useContentIndex.js
- ⚠️ Graph worked with 1 node, needs testing with 35 nodes

## Your Task

Debug and fix the graph visualization to work correctly with the full dataset of 35 nodes.

---

## Step 1: Verify Data Flow

### Check content-index.json
```bash
# File should exist and contain 35 entries
cat src/data/content-index.json | grep '"id"' | wc -l
# Should output: 35
```

### Check buildGraphData() function

**File:** `src/hooks/useContentIndex.js` (line ~88)

**Expected output format:**
```javascript
{
  nodes: [
    { id: "pectoralis-major", label: "Грудная", type: "muscle", layer: "muscles", title: "..." },
    { id: "bench-press", label: "Жим лёжа", type: "exercise", title: "..." },
    // ... 35 total
  ],
  links: [
    { source: "pectoralis-major", target: "bench-press", from: "pectoralis-major", to: "bench-press" },
    // ... many links
  ]
}
```

**Test in browser console:**
```javascript
import { buildGraphData } from './src/hooks/useContentIndex.js'
const data = buildGraphData()
console.log('Nodes:', data.nodes.length)  // Should be 35
console.log('Links:', data.links.length)  // Should be > 0
console.log('Sample node:', data.nodes[0])
console.log('Sample link:', data.links[0])
```

---

## Step 2: Check useGraphData.js

**File:** `src/hooks/useGraphData.js`

**Current implementation:**
```javascript
useEffect(() => {
  setLoading(true);
  try {
    const data = buildGraphData();
    const formattedData = {
      nodes: data.nodes,
      edges: data.links.map(link => ({
        source: link.source,
        target: link.target,
        from: link.from,
        to: link.to
      }))
    };
    setGraphData(formattedData);
  } catch (error) {
    console.error('Error building graph:', error);
    setGraphData({ nodes: [], edges: [] });
  } finally {
    setLoading(false);
  }
}, []);
```

**What to check:**
1. Does `buildGraphData()` return data?
2. Are nodes and links properly formatted?
3. Is `setGraphData` called with correct data?

**Add debug logging:**
```javascript
console.log('🔍 Graph data built:', {
  nodeCount: data.nodes.length,
  linkCount: data.links.length,
  sampleNode: data.nodes[0],
  sampleLink: data.links[0]
});
```

---

## Step 3: Check GraphSVG.jsx

**File:** `src/components/graph/GraphSVG.jsx`

### Issue 1: Node labels

**Line ~294:** Node title rendering
```javascript
{(node.title || node.label || node.data?.title || node.data?.name || '').substring(0, 12)}
```

**Check:**
- Does `node.title` exist?
- Does `node.label` exist?
- Are labels displaying correctly?

### Issue 2: Node colors

**Line ~184-192:** `getNodeColor()` function
```javascript
const getNodeColor = (type) => {
  const colors = {
    goals: '#4caf50',      // ❌ Wrong - should be 'goal'
    exercises: '#00d4ff',  // ❌ Wrong - should be 'exercise'
    muscles: '#ff5252',    // ❌ Wrong - should be 'muscle'
    pain: '#f44336'
  };
  return colors[type] || '#999';
};
```

**FIX NEEDED:** Types in content-index.json are singular:
```javascript
const colors = {
  goal: '#4caf50',
  exercise: '#00d4ff',
  muscle: '#ff5252',
  pain: '#f44336'
};
```

### Issue 3: Link format

**Check that links have correct format:**
```javascript
// In useForceSimulation or GraphSVG
links.forEach(link => {
  console.log('Link:', {
    source: link.source?.id || link.source,
    target: link.target?.id || link.target
  });
});
```

---

## Step 4: Common Issues & Fixes

### Issue: Nodes not displaying

**Possible causes:**
1. `buildGraphData()` returns empty array
2. Node positions (x, y) not calculated
3. SVG viewport too small

**Debug:**
```javascript
// In GraphSVG.jsx, add logging
console.log('Rendering nodes:', nodes.length);
nodes.forEach(node => {
  console.log('Node:', node.id, 'Position:', node.x, node.y);
});
```

**Fix:** Check `useForceSimulation` hook is running

---

### Issue: Links not displaying

**Possible causes:**
1. Link source/target IDs don't match node IDs
2. Link format incorrect
3. Nodes don't have positions yet

**Debug:**
```javascript
// Check link IDs match node IDs
const nodeIds = new Set(nodes.map(n => n.id));
links.forEach(link => {
  const sourceId = link.source?.id || link.source;
  const targetId = link.target?.id || link.target;
  if (!nodeIds.has(sourceId)) console.error('Invalid source:', sourceId);
  if (!nodeIds.has(targetId)) console.error('Invalid target:', targetId);
});
```

---

### Issue: Wrong colors

**Fix:** Update `getNodeColor()` to use singular types:
```javascript
const getNodeColor = (type) => {
  const colors = {
    goal: '#4caf50',
    exercise: '#00d4ff',
    muscle: '#ff5252',
    pain: '#f44336'
  };
  return colors[type] || '#999';
};
```

---

### Issue: Performance problems

**With 35 nodes, performance should be fine. If slow:**

1. **Reduce simulation iterations:**
```javascript
// In useForceSimulation
simulation
  .force('charge', d3.forceManyBody().strength(-100))
  .force('link', d3.forceLink().distance(100))
  .alphaDecay(0.05)  // Faster convergence
  .velocityDecay(0.4);
```

2. **Add node filtering:**
```javascript
// In useGraphData.js
const filteredNodes = nodes.filter(node =>
  filters[node.type] !== false
);
```

---

## Step 5: Testing Checklist

Open browser at `http://localhost:5173/graph` and verify:

- [ ] **Nodes render:** See 35 circles on screen
- [ ] **Node colors:** Different colors for muscle/exercise/goal
- [ ] **Node labels:** Text under each node
- [ ] **Links render:** Lines connecting related nodes
- [ ] **Hover works:** Hovering highlights node and connections
- [ ] **Click works:** Clicking node shows details (if implemented)
- [ ] **Drag works:** Can drag nodes around
- [ ] **Zoom works:** Mouse wheel zooms in/out
- [ ] **Pan works:** Can drag background to pan
- [ ] **No console errors:** Check browser console

---

## Step 6: Quick Fixes

### Fix 1: Update getNodeColor()

**File:** `src/components/graph/GraphSVG.jsx` (line ~184)

```javascript
const getNodeColor = (type) => {
  const colors = {
    goal: '#4caf50',      // Changed from 'goals'
    exercise: '#00d4ff',  // Changed from 'exercises'
    muscle: '#ff5252',    // Changed from 'muscles'
    pain: '#f44336'
  };
  return colors[type] || '#999';
};
```

### Fix 2: Add debug logging

**File:** `src/hooks/useGraphData.js`

Add after `buildGraphData()`:
```javascript
console.log('📊 Graph Data:', {
  nodes: data.nodes.length,
  links: data.links.length,
  types: [...new Set(data.nodes.map(n => n.type))],
  sampleNode: data.nodes[0],
  sampleLink: data.links[0]
});
```

### Fix 3: Verify node structure

**File:** `src/hooks/useContentIndex.js` (line ~88)

Ensure `buildGraphData()` returns:
```javascript
const nodes = Object.values(contentIndex).map(entry => ({
  id: entry.id,           // ✅ Required
  label: entry.titleShort || entry.title,  // ✅ Required
  type: entry.type,       // ✅ Required (singular: muscle/exercise/goal)
  layer: entry.layer,     // Optional
  title: entry.title      // ✅ Required for display
}));
```

---

## Expected Result

After fixes, you should see:
- 35 nodes in different colors
- Nodes clustered by connections
- Smooth animations
- Interactive hover/click/drag
- No console errors

---

## Files to Check/Modify

1. **`src/hooks/useContentIndex.js`** - buildGraphData() function
2. **`src/hooks/useGraphData.js`** - data loading and formatting
3. **`src/components/graph/GraphSVG.jsx`** - rendering and colors
4. **`src/hooks/useForceSimulation.js`** - D3 force simulation
5. **`src/data/content-index.json`** - verify data exists

---

## Success Criteria

✅ All 35 nodes visible
✅ Correct colors (muscle=red, exercise=cyan, goal=green)
✅ Links between related nodes
✅ Interactive (hover, click, drag, zoom)
✅ No console errors
✅ Smooth performance

---

## If Still Broken

1. **Check browser console** - copy all errors
2. **Check Network tab** - is content-index.json loading?
3. **Check React DevTools** - what props does GraphSVG receive?
4. **Add more logging** - trace data flow from buildGraphData → GraphSVG
5. **Test with fewer nodes** - temporarily filter to 5 nodes to isolate issue

---

## Start Command

Begin with: "I'll debug the graph visualization. First, let me check the data flow from content-index.json to GraphSVG..."

Then systematically check each step above.
