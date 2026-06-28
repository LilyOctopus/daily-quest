import { type DayQuest, type Task } from './types'

/* ─── Date utilities ─── */

export function getWeekKey(date: Date): string {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const year = d.getFullYear()
  const week = Math.floor(
    ((d.getTime() - new Date(year, 0, 4).getTime()) / 86400000 + (new Date(year, 0, 4).getDay() + 6) % 7 + 7) / 7
  )
  return `${year}-W${String(week).padStart(2, '0')}`
}

export function getWeekDays(date: Date): Date[] {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(d.setDate(diff))
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday)
    day.setDate(monday.getDate() + i)
    return day
  })
}

export function formatDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function getDayName(d: Date): string {
  return DAY_NAMES[(d.getDay() + 6) % 7]
}

export function isToday(date: Date): boolean {
  const today = new Date()
  return date.getFullYear() === today.getFullYear()
    && date.getMonth() === today.getMonth()
    && date.getDate() === today.getDate()
}

/* ─── Seed data ─── */

const ALGO_INTRO = `**Approach**: HashMap (O(n), O(n))
- Iterate once, for each num check if complement (target - num) exists in map
- If yes → return [map[complement], currentIndex]
- If no → store num: index in map

**Edge cases**: duplicate values, no solution (guaranteed exactly one)

\`\`\`ts
function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>()
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i]
    if (map.has(complement)) return [map.get(complement)!, i]
    map.set(nums[i], i)
  }
  return []
}
\`\`\`

**Key insight**: HashMap trades space for time. Brute force is O(n²).`

const RSPACK_STORY_EN = `**Title**: Migrating Finance Module from umi to rspack

**Situation**:
- Finance vertical had 6 sub-modules sharing one umi 3 build config
- Full build took ~8min, dev HMR was slow

**Task**:
- Lead the migration with zero regression
- First in the whole org to attempt it — no playbook

**Action**:
1. Created a POC (proof of concept) with rspack on 1 sub-module
2. Compared output bundles for correctness
3. Documented each migration step + pitfalls found
4. Rolled out to 6 modules, built team onboarding guide

**Result**:
- Finance build: -45s (40% faster)
- 6 modules combined saved 4.5min per build
- Full build fastest at 5 min
- Migration doc adopted by other verticals

**Key phrases to memorize**:
- "zero regression migration"
- "adopted as org-wide standard"
- "first-mover in the org"`

const EVENTLOOP_QUIZ = `**Key Concepts to Review**:

1. **Microtask queue > Macrotask queue**
   - Micro: Promise.then, MutationObserver, queueMicrotask
   - Macro: setTimeout, setInterval, I/O, UI render

2. **Order of execution**:
   - Sync code → microtasks → macrotask → microtasks → ...

3. **Common trap**:
   \`\`\`js
   console.log(1)                    // 1 (sync)
   setTimeout(() => console.log(2)) // macro
   Promise.resolve().then(() =>
     console.log(3)                 // micro
   )
   console.log(4)                    // 4 (sync)
   // Output: 1 4 3 2
   \`\`\`

4. **async/await**:
   - await = syntactic sugar for Promise.then
   - Everything after await is a microtask

5. **requestAnimationFrame** — runs BEFORE macrotask (in render step)
6. **requestIdleCallback** — runs in idle periods`

const ANKI_REMINDER = `**Daily card review**:
- Review all due cards (new + due)
- Add 5 new cards if reviewing for key concepts
- Key tags to focus: #eventloop #promise #browser #http
- Spaced repetition: finish due cards FIRST, then new

**Tip**: Do this in the hotel lobby / while queuing.`

const VALID_PAREN_INTRO = `**Approach**: Stack (O(n), O(n))

\`\`\`ts
function isValid(s: string): boolean {
  const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' }
  const stack: string[] = []
  for (const c of s) {
    if (c in map) {
      if (stack.pop() !== map[c]) return false
    } else {
      stack.push(c)
    }
  }
  return stack.length === 0
}
\`\`\`

**Key insight**: Stack is perfect for nested structures. Match closing bracket to last unclosed opening bracket.

**Edge cases**: single char, only open brackets, empty string (true)`

const CONFLICT_BQ = `**Title**: Resolving Tech Stack Conflict with Product Team

**S** — Product wanted quick feature release; Engineering wanted rspack migration first
**T** — As tech lead, I needed both to happen — migration was critical for future velocity
**A** —
- Mapped migration to feature roadmap: chunks that don't block product
- Proposed parallel schedule: migrate 1 module → feature on it → iterate
- Built a risk matrix to show product team
- Compromised: P0 features go first, migration during sprint gaps
**R** — Migration completed in 8 weeks with zero feature delay. Product team trusted engineering more after.

**Delivery tips**:
- Keep tone solutions-oriented, not confrontational
- Emphasize data-driven decision (risk matrix was key)
- Show respect for both sides' priorities`

const PROMISE_QUIZ = `**Key Concepts**:

1. **Promise states**: pending → fulfilled / rejected (one-way, one-time)
2. **Chaining**: .then always returns a new Promise
3. **Error handling**: .catch at end of chain catches any preceding rejection
4. **Static methods**:
   - Promise.all — fail-fast on any rejection
   - Promise.allSettled — waits for all, returns statuses
   - Promise.race — first settled (resolve or reject)
   - Promise.any — first fulfilled, ignore rejections
5. **Microtask behavior**: Promise.then runs in microtask queue, BEFORE setTimeout

**Common interview question**:
\`\`\`js
Promise.resolve()
  .then(() => console.log(1))
  .then(() => console.log(2))
// vs
Promise.resolve()
  .then(() => { console.log(1); return Promise.resolve() })
  .then(() => console.log(2))
\`\`\`
Second case adds an extra microtask — order may differ.`

const REVERSE_LINKED_INTRO = `**Approach**: Iterative (O(n), O(1))

\`\`\`ts
function reverseList(head: ListNode | null): ListNode | null {
  let prev = null
  let curr = head
  while (curr) {
    const next = curr.next
    curr.next = prev
    prev = curr
    curr = next
  }
  return prev
}
\`\`\`

**Key insight**: Three pointers (prev, curr, next). Reverse direction one node at a time.

**Recursive**:
\`\`\`ts
function reverseList(head: ListNode | null): ListNode | null {
  if (!head?.next) return head
  const newHead = reverseList(head.next)
  head.next.next = head
  head.next = null
  return newHead
}
\`\`\`

**Visual**: 1→2→3→null becomes null←1←2←3`

const FAILURE_BQ = `**Title**: Over-Engineering a Micro-Frontend Framework

**S** — Early in my career, tasked with building a shared component library
**T** — Wanted to create "the perfect" micro-frontend solution
**A** — Over-engineered: custom CLI, build tooling, runtime framework
   — Spent 3 months, missed deadlines, team couldn't adopt it
   — Users: "this is too complex for just sharing a button"
**R** — Scrapped 80% of the code, used standard Web Components instead
   — Learned: "build the simplest thing first, then iterate"
   — Later applied to rspack migration where I deliberately kept scope minimal

**Learning**: Now always start with 80% solution. Perfection is iterative.`

const BROWSER_RENDER_QUIZ = `**Critical Rendering Path**:

1. **DOM** (HTML → tokens → nodes → tree)
2. **CSSOM** (CSS → rules → tree)
3. **Render Tree** = DOM + CSSOM (combine visible nodes)
4. **Layout** (Reflow) — calculate geometry
5. **Paint** — fill pixels
6. **Composite** — combine layers

**Key metrics**:
- **FCP** (First Contentful Paint): first text/image paints
- **LCP** (Largest Contentful Paint): largest element visible
- **CLS** (Cumulative Layout Shift): layout stability
- **INP** (Interaction to Next Paint): responsiveness

**Reflow triggers**: DOM change, style recalc, resize, scroll, getBoundingClientRect()
**Repaint only**: color, background-color, visibility (no geometry change)
**Composite only**: transform, opacity (GPU-accelerated)

**Tip**: Use \`content-visibility: auto\` for offscreen sections`

const BTREE_INORDER_INTRO = `**Approach**: Recursive / Iterative (O(n), O(h))

\`\`\`ts
// Recursive
function inorderTraversal(root: TreeNode | null): number[] {
  const res: number[] = []
  function dfs(node: TreeNode | null) {
    if (!node) return
    dfs(node.left)
    res.push(node.val)
    dfs(node.right)
  }
  dfs(root)
  return res
}

// Iterative (stack)
function inorderTraversal(root: TreeNode | null): number[] {
  const res: number[] = []
  const stack: TreeNode[] = []
  let curr = root
  while (curr || stack.length) {
    while (curr) { stack.push(curr); curr = curr.left }
    curr = stack.pop()!
    res.push(curr.val)
    curr = curr.right
  }
  return res
}
\`\`\`

**Key insight**: Inorder = left → root → right. BST inorder gives sorted array.

**Practice**: Preorder, inorder, postorder — all have iterative stack pattern. Master it once.`

const COLLAB_BQ = `**Title**: Cross-Team Migration Standardization

**S** — After Finance's rspack migration success, other teams wanted to migrate too
**T** — Each team had different configs, tools, and constraints — no standard approach
**A** —
- Created a migration working group with 3 teams
- Built a shared migration checklist + template config
- Held weekly sync to share blockers and workarounds
- Documented everything in a playbook
**R** — 6 modules adopted rspack in 2 months
   — Playbook became cross-org standard reference
   — Reduced migration time for new teams by 60%

**Delivery**: Emphasize you don't just solve your own problem — you scale the solution.`

const HTTP_CACHE_QUIZ = `**Cache Types**:

1. **Strong cache** (200 from cache):
   - \`Cache-Control: max-age=3600\`
   - Browser never sends request within TTL
   - \`Expires\` (HTTP/1.0, legacy)

2. **Negotiation cache** (304 Not Modified):
   - \`Last-Modified / If-Modified-Since\` (time-based)
   - \`ETag / If-None-Match\` (content-hash based)
   - Browser sends request, server says "use cached" if unchanged

3. **Cache-Control directives**:
   - \`no-cache\` — revalidate with server (still uses ETag)
   - \`no-store\` — don't cache at all
   - \`private\` — browser only, not proxy/CDN
   - \`public\` — anyone can cache
   - \`immutable\` — never revalidate (for hashed assets)

**Interview tip**: "I set long max-age for hashed assets, and use ETag for API responses."`

const DP_INTRO = `**Approach**: DP (O(n), O(1))

\`\`\`ts
function climbStairs(n: number): number {
  if (n <= 2) return n
  let [a, b] = [1, 2]
  for (let i = 3; i <= n; i++) {
    [a, b] = [b, a + b]
  }
  return b
}
\`\`\`

**Key insight**: It's Fibonacci! Ways to reach step i = ways(i-1) + ways(i-2)

**Why DP?**:
- Overlapping subproblems: ways(5) = ways(4) + ways(3), ways(4) = ways(3) + ways(2)
- Optimal substructure: optimal solution built from optimal sub-solutions

**Follow-up**: If you could take 1, 2, or 3 steps → tribonacci:
\`\`\`ts
// ways(n) = ways(n-1) + ways(n-2) + ways(n-3)
\`\`\``

const RSPACK_VS_VITE_BQ = `**Title**: Choosing rspack over vite for migration

**Decision context**: umi 3 with webpack 4 → needed faster builds

**Why NOT vite**:
1. **Not drop-in**: ESBuild dev + Rollup prod — different output behavior
   — Risk of runtime inconsistencies between dev/prod
2. **Plugin gap**: umi plugins relied on webpack hooks, vite had different API
3. **Team risk**: First to migrate — vite was newer, less battle-tested in 2024
4. **SSR concern**: Finance had SSR pages, vite had limited SSR support

**Why rspack**:
1. **Drop-in**: webpack-compatible API — most plugins worked out of box
2. **Rust-based**: Real perf gain (4-5x faster builds)
3. **Gradual migration**: Could do module by module
4. **Same output**: Dev = Prod (no surprise behavior)

**Result**: Chose rspack, which was the right call given constraints. If starting from scratch today, might reconsider vite.`

const CSS_LAYOUT_QUIZ = `**Layout modes**:

1. **Normal flow**: block (vertical) + inline (horizontal)
2. **Flexbox**: 1D layout — row OR column
   - Main axis: justify-content
   - Cross axis: align-items / align-self
3. **Grid**: 2D — rows AND columns simultaneously
4. **Positioned**: relative / absolute / fixed / sticky

**Key concepts**:
- **Stacking context**: z-index only within same context (e.g., positioned + opacity < 1 creates new one)
- **BFC (Block Formatting Context)**: overflow: hidden, display: flow-root, float
  — Prevents margin collapse, contains floats
- **Containing block**: position: absolute's reference = nearest positioned ancestor

**Common interview**: "How to center a div?"
\`\`\`css
/* Flex */
.parent { display: flex; justify-content: center; align-items: center; }

/* Grid */
.parent { display: grid; place-items: center; }

/* Absolute */
.child { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
\`\`\``

const WEAKMAP_QUIZ = `**WeakMap / WeakSet**:

1. **WeakMap keys** must be objects (not primitives)
2. **No iteration** — no .keys(), .values(), .entries(), forEach
3. **No .size** — size unknown (GC prevents it)
4. **Automatic GC**: When key object is no longer referenced elsewhere, entry is removed

**Use cases**:
- **Private data** (closure + WeakMap pattern)
- **DOM node metadata** — attach data to DOM without preventing GC
- **Caching** — when cache should auto-expire with referenced object

**Closure + WeakMap pattern**:
\`\`\`ts
const privates = new WeakMap()
class Widget {
  constructor() {
    privates.set(this, { counter: 0 })
  }
  increment() { privates.get(this)!.counter++ }
}
\`\`\`

**Garbage Collection**: A WeakMap doesn't keep keys alive. If nothing else references the key, GC collects both key and value.`

const REVIEW_WEEK = `**Week review** — quick run through all 5 problems:

1. Two Sum — HashMap (O(n))
2. Valid Parentheses — Stack (O(n))
3. Reverse Linked List — 3 pointers (O(n))
4. Binary Tree Inorder — Stack/Recursion (O(n))
5. Climbing Stairs — DP / Fibonacci (O(n))

**Pick 1 you struggled with most** → redo from scratch
**Pick 1 you knew well** → explain aloud in English

**Key pattern recognition**:
- "Matching/paired" → Stack
- "Need fast lookup" → HashMap
- "Traverse tree level by level" → BFS queue
- "Optimal substructure" → DP
- "Reverse/rotate" → Two pointers or recursion`

const SELF_INTRO_BQ = `**2-minute self-introduction template**:

\`\`\`
Hi, I'm Yuli. I'm a frontend engineer with 6 years of experience,
currently at Shopee.

I specialize in large-scale frontend infrastructure — I led a company-wide
migration from webpack to rspack, cutting build times by 40% across 6 modules.
That work was adopted as the org's standard migration playbook.

Most recently, I built an AI Code Review platform from scratch
and developed a Jira MCP Server that connects AI agents to Jira workflows —
it's open source on my GitHub.

On the tooling side, I set up mono-repo, ESLint configs, and i18n systems.

I'm drawn to teams where I can bridge engineering and product impact,
ideally in an English-speaking environment. That's why I'm excited
about this role at [Company].
\`\`\`

**Practice tips**:
- Record yourself. Listen for filler words (嗯, 那个, actually, like)
- Time it — 2 min is shorter than you think
- Keep tone natural, not robotic`

const MOCK_WEEKEND = `**Pick the 2 weakest BQ stories and practice**:

Stories available:
1. rspack migration (technical leadership)
2. Conflict resolution with product
3. Failure: over-engineering
4. Cross-team collaboration
5. Technical decision (rspack vs vite)

**Format**:
- Situation (15s) — context
- Task (10s) — what you needed to achieve
- Action (45s) — what YOU did
- Result (20s) — quantified impact

**Speak it out loud 3x per story.** First time rough, second time smoother, third time polished.`

const ALGO_WEAK_REVIEW = `**Pick 1 weak area from this week and drill**:

Options:
1. **Stack problems**: Valid Parentheses, Min Stack, Evaluate Reverse Polish Notation
2. **HashMap problems**: Two Sum, Group Anagrams, Top K Frequent Elements
3. **Linked List**: Reverse, Merge Two Sorted, Cycle Detection
4. **Tree**: Inorder (recursive + iterative), Max Depth, Level Order
5. **DP**: Climbing Stairs, House Robber, Best Time to Buy/Sell Stock

**New Medium** (if feeling strong): Group Anagrams or Product of Array Except Self

**Tip**: Don't do 5 new problems. Do 1 new + review 2 from this week. Deep understanding > breadth.`

// ── End of detail constants ──

const TASKS_BY_DAY: Record<number, Task[]> = {
  0: [
    { id: 'mon-algo', label: 'Valid Parentheses', category: 'algorithm', completed: false, estMinutes: 15, detail: VALID_PAREN_INTRO },
    { id: 'mon-en', label: 'BQ: conflict resolution (STAR)', category: 'english', completed: false, estMinutes: 25, detail: CONFLICT_BQ },
    { id: 'mon-fe', label: 'Promise microtasks quiz', category: 'frontend', completed: false, estMinutes: 15, detail: PROMISE_QUIZ },
    { id: 'mon-anki', label: 'Review cards + new 5', category: 'anki', completed: false, estMinutes: 10, detail: ANKI_REMINDER },
  ],
  1: [
    { id: 'tue-algo', label: 'Reverse Linked List', category: 'algorithm', completed: false, estMinutes: 20, detail: REVERSE_LINKED_INTRO },
    { id: 'tue-en', label: 'BQ: failure experience (STAR)', category: 'english', completed: false, estMinutes: 25, detail: FAILURE_BQ },
    { id: 'tue-fe', label: 'Browser rendering quiz', category: 'frontend', completed: false, estMinutes: 10, detail: BROWSER_RENDER_QUIZ },
    { id: 'tue-anki', label: 'Review cards + new 5', category: 'anki', completed: false, estMinutes: 10, detail: ANKI_REMINDER },
  ],
  2: [
    { id: 'wed-algo', label: 'Binary Tree Inorder', category: 'algorithm', completed: false, estMinutes: 20, detail: BTREE_INORDER_INTRO },
    { id: 'wed-en', label: 'BQ: cross-team collab (STAR)', category: 'english', completed: false, estMinutes: 25, detail: COLLAB_BQ },
    { id: 'wed-fe', label: 'HTTP cache quiz (Anki)', category: 'frontend', completed: false, estMinutes: 15, detail: HTTP_CACHE_QUIZ },
    { id: 'wed-anki', label: 'Review cards', category: 'anki', completed: false, estMinutes: 10, detail: ANKI_REMINDER },
  ],
  3: [
    { id: 'thu-algo', label: 'Climbing Stairs (DP)', category: 'algorithm', completed: false, estMinutes: 25, detail: DP_INTRO },
    { id: 'thu-en', label: 'BQ: why rspack not vite', category: 'english', completed: false, estMinutes: 20, detail: RSPACK_VS_VITE_BQ },
    { id: 'thu-fe', label: 'CSS layout quiz', category: 'frontend', completed: false, estMinutes: 10, detail: CSS_LAYOUT_QUIZ },
    { id: 'thu-anki', label: 'Review cards + new 5', category: 'anki', completed: false, estMinutes: 10, detail: ANKI_REMINDER },
  ],
  4: [
    { id: 'fri-algo', label: 'Review week\'s algo problems', category: 'algorithm', completed: false, estMinutes: 20, detail: REVIEW_WEEK },
    { id: 'fri-en', label: 'Full mock: introduce yourself (2min)', category: 'english', completed: false, estMinutes: 30, detail: SELF_INTRO_BQ },
    { id: 'fri-fe', label: 'WeakMap / closure quiz', category: 'frontend', completed: false, estMinutes: 10, detail: WEAKMAP_QUIZ },
    { id: 'fri-anki', label: 'Review all week cards', category: 'anki', completed: false, estMinutes: 15, detail: ANKI_REMINDER },
  ],
  5: [
    { id: 'sat-algo', label: 'Weak algo review + 1 new Medium', category: 'algorithm', completed: false, estMinutes: 20, detail: ALGO_WEAK_REVIEW },
    { id: 'sat-en', label: 'Weekend mock: full BQ practice', category: 'english', completed: false, estMinutes: 25, detail: MOCK_WEEKEND },
    { id: 'sat-anki', label: 'Catch up on missed cards', category: 'anki', completed: false, estMinutes: 15, detail: ANKI_REMINDER },
  ],
  6: [
    { id: 'sun-algo', label: 'Two Sum (双指针)', category: 'algorithm', completed: false, estMinutes: 15, detail: ALGO_INTRO },
    { id: 'sun-en', label: 'Recite rspack migration story', category: 'english', completed: false, estMinutes: 20, detail: RSPACK_STORY_EN },
    { id: 'sun-fe', label: 'EventLoop quiz (Anki)', category: 'frontend', completed: false, estMinutes: 15, detail: EVENTLOOP_QUIZ },
    { id: 'sun-anki', label: 'Review today\'s cards', category: 'anki', completed: false, estMinutes: 10, detail: ANKI_REMINDER },
  ],
}

export function buildWeekDays(date: Date): DayQuest[] {
  const days = getWeekDays(date)
  return days.map((d, i) => ({
    date: formatDate(d),
    checkIn: false,
    tasks: TASKS_BY_DAY[i]?.map(t => ({ ...t })) ?? [],
    studyMinutes: 0,
    notes: '',
  }))
}
