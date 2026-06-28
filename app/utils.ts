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

/* ─── Detail content ─── */

const ALGO_INTRO =
`**Approach**: HashMap (O(n), O(n))
- Iterate once, for each num check if complement (target - num) exists in map
- If yes return [map[complement], currentIndex]
- If no store num: index in map

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

**Key insight**: HashMap trades space for time. Brute force is O(n^2).`

const RSPACK_STORY_EN =
`**Title**: PMS Infrastructure Optimization at Shopee

**Situation**:
- PMS (Product Management System) was a monolithic app with complex features
- Build took 180s, poor developer experience, high iteration cost
- Team of 10+ frontend devs slowed by tooling

**Task**:
- Lead infrastructure modernization with zero regression
- Improve dev experience for the whole team

**Action**:
1. Introduced Webpack Module Federation for micro-frontend split
2. Replaced custom Webpack config with Vue-cli to remove redundant setup
3. Implemented commit standard tools to reduce mental overhead
4. Rolled out changes module by module to minimize risk

**Result**:
- Project startup: 180s -> 75s (58% faster)
- Successfully split planning domain into micro-frontend modules
- Team adopted commit conventions, less friction in code review`

const RSPACK_STORY_SHORT =
`PMS infrastructure at Shopee:
- Monolithic 180s cold start
- Webpack MF micro-frontend split
- Build time: 180s --> 75s
- Team-wide commit tooling

Key phrases: "gradual migration", "zero regression", "module-by-module rollout"`

const EVENTLOOP_QUIZ =
`**Key Concepts to Review**:

1. **Microtask queue > Macrotask queue**
   - Micro: Promise.then, MutationObserver, queueMicrotask
   - Macro: setTimeout, setInterval, I/O, UI render

2. **Order of execution**:
   - Sync code, microtasks, macrotask, microtasks, ...

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

5. **requestAnimationFrame** - runs BEFORE macrotask (render step)
6. **requestIdleCallback** - runs in idle periods`

const ANKI_REMINDER =
`**Daily card review**:
- Review all due cards (new + due)
- Add 5 new cards if reviewing for key concepts
- Key tags: #eventloop #promise #browser #http
- Spaced repetition: finish due cards FIRST, then new

**Tip**: Do this in hotel lobby or while queuing for attractions.`

const VALID_PAREN_INTRO =
`**Approach**: Stack (O(n), O(n))

\`\`\`ts
function isValid(s: string): boolean {
  const map: Record<string, string> = {
    ")": "(", "}": "{", "]": "["
  }
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

**Key insight**: Stack is perfect for nested structures. Match closing bracket to last unclosed opening bracket.`

const CONFLICT_BQ =
`**Title**: Coordinating Feature Work with Refactoring at Shopee

**S** -- PMS had both active feature requests and accumulated tech debt
**T** -- Product demanded new features; engineers wanted to refactor first
**A** --
- Mapped refactoring into non-blocking chunks alongside feature work
- Created risk/benefit matrix for product team
- Scheduled P0 features first, refactoring during sprint gaps
- Clear communication of which steps would accelerate future features
**R** -- Refactoring completed alongside feature delivery. Build time cut in half without delaying any feature.

**Delivery**: Solutions-oriented tone, data-driven decisions, respect for both priorities.`

const PROMISE_QUIZ =
`**Key Concepts**:

1. **Promise states**: pending -> fulfilled / rejected (one-way, one-time)
2. **Chaining**: .then always returns a new Promise
3. **Error handling**: .catch at end of chain catches any preceding rejection
4. **Static methods**:
   - Promise.all - fail-fast on any rejection
   - Promise.allSettled - waits for all, returns statuses
   - Promise.race - first settled (resolve or reject)
   - Promise.any - first fulfilled, ignore rejections
5. **Microtask behavior**: Promise.then runs in microtask queue, BEFORE setTimeout`

const REVERSE_LINKED_INTRO =
`**Approach**: Iterative (O(n), O(1))

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

**Visual**: 1 -> 2 -> 3 -> null becomes null <- 1 <- 2 <- 3`

const FAILURE_BQ =
`**Title**: Over-Engineering a Micro-Frontend Component at Ctrip

**S** -- Ctrip needed a reusable referral component for multiple campaigns
**T** -- Aimed to build "the perfect" micro-frontend solution supporting all tech stacks
**A** -- Over-engineered: proxy window for JS sandbox, CSS Module isolation, mono-repo prep
   -- Spent months on framework, but core feature was simple: share a link
   -- Team: "too complex for what it does"
**R** -- Scrapped 80% of sandbox logic. Platform stabilized, saved 6pd per campaign.
   -- Lesson: build 80% solution first, get feedback, then iterate.`

const BROWSER_RENDER_QUIZ =
`**Critical Rendering Path**:

1. **DOM** (HTML to tokens to nodes to tree)
2. **CSSOM** (CSS to rules to tree)
3. **Render Tree** = DOM + CSSOM
4. **Layout** (Reflow) -- calculate geometry
5. **Paint** -- fill pixels
6. **Composite** -- combine layers

**Key metrics**:
- **FCP**: first text/image paints
- **LCP**: largest element visible
- **CLS**: layout stability
- **INP**: interaction to next paint

**Reflow triggers**: DOM change, style recalc, resize, scroll, getBoundingClientRect()
**Repaint only**: color, background-color, visibility
**Composite only**: transform, opacity (GPU-accelerated)`

const BTREE_INORDER_INTRO =
`**Approach**: Recursive / Iterative (O(n), O(h))

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

**Key insight**: Inorder = left -> root -> right. BST inorder gives sorted array.`

const COLLAB_BQ =
`**Title**: Organizing English Tech Salons at Shopee

**S** -- Team had strong technical skills but limited English communication practice
**T** -- As a TEM-8 holder, I initiated English tech sharing sessions
**A** --
- Organized weekly English salons: tech topics presented in English
- Created templates for non-native speakers to present confidently
- Encouraged junior devs to present, provided coaching
- Led by example: prepared demos for my own sessions
**R** -- Team became more confident in English communication
   -- Several members started contributing to English docs
   -- Strengthened cross-border collaboration capability`

const HTTP_CACHE_QUIZ =
`**Cache Types**:

1. **Strong cache** (200 from cache):
   - Cache-Control: max-age=3600
   - Browser never sends request within TTL
   - Expires (HTTP/1.0, legacy)

2. **Negotiation cache** (304 Not Modified):
   - Last-Modified / If-Modified-Since (time-based)
   - ETag / If-None-Match (content-hash based)
   - Browser sends request, server replies "use cached" if unchanged

3. **Cache-Control directives**:
   - no-cache: revalidate with server (still uses ETag)
   - no-store: don't cache at all
   - private: browser only, not proxy/CDN
   - public: anyone can cache
   - immutable: never revalidate (for hashed assets)`

const DP_INTRO =
`**Approach**: DP (O(n), O(1))

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

**Key insight**: It is Fibonacci! Ways to reach step i = ways(i-1) + ways(i-2)

**Why DP?**:
- Overlapping subproblems: ways(5) = ways(4) + ways(3)
- Optimal substructure: solution built from optimal sub-solutions`

const RSPACK_VS_VITE_BQ =
`**Title**: Choosing Webpack MF vs Micro-Frontend Approach

**Decision context**: PMS monolith needed splitting, multiple teams owned different domains

**Options considered**:
1. Iframe-based: simple but poor UX
2. Webpack Module Federation: runtime integration, shared deps
3. Single SPA / qiankun: full micro-frontend framework, heavier

**Why NOT qiankun**:
- Over-engineered for 2 domains
- Additional deployment complexity
- Team had no micro-frontend experience

**Why Webpack MF**:
- Gradual adoption: migrate one module at a time
- Shared dependencies: common libs loaded once
- Team familiar with Webpack, minimal learning curve

**Result**: Clean split with manageable complexity. Other teams adopted pattern.`

const CSS_LAYOUT_QUIZ =
`**Layout modes**:

1. Normal flow: block (vertical) + inline (horizontal)
2. Flexbox: 1D layout, row OR column
3. Grid: 2D, rows AND columns simultaneously
4. Positioned: relative / absolute / fixed / sticky

**Key concepts**:
- Stacking context: z-index only within same context
- BFC (Block Formatting Context): overflow: hidden, display: flow-root, float
- Containing block: position absolute reference = nearest positioned ancestor

**Common interview: How to center a div?**
\`\`\`css
.flex { display: flex; justify-content: center; align-items: center; }
.grid { display: grid; place-items: center; }
.abs { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
\`\`\``

const WEAKMAP_QUIZ =
`**WeakMap / WeakSet**:

1. WeakMap keys must be objects (not primitives)
2. No iteration: no .keys(), .values(), .entries(), forEach
3. No .size: GC prevents it
4. Automatic GC: when key object is no longer referenced, entry removed

**Use cases**:
- Private data (closure + WeakMap pattern)
- DOM node metadata
- Caching (auto-expire with referenced object)`

const REVIEW_WEEK =
`**Week review** -- quick run through all 5 problems:

1. Two Sum -- HashMap (O(n))
2. Valid Parentheses -- Stack (O(n))
3. Reverse Linked List -- 3 pointers (O(n))
4. Binary Tree Inorder -- Stack/Recursion (O(n))
5. Climbing Stairs -- DP / Fibonacci (O(n))

**Pick 1 you struggled with most** -> redo from scratch
**Pick 1 you knew well** -> explain aloud in English`

const SELF_INTRO_BQ =
`**2-minute self-introduction (matching resume)**:

\`\`\`
Hi, I am Yuli. I am a frontend engineer with 6 years of experience,
currently at Shopee.

My strength is in large-scale frontend infrastructure. At Shopee,
I led the optimization of PMS the core product management system,
reducing build time from 180s to 75s through Webpack Module Federation
and a micro-frontend architecture.

Before Shopee, at Ctrip, I built a multi-platform system using
Taro and React, enabling one codebase to serve WeChat, Alipay,
Baidu mini-programs plus H5, improving conversion rate by 5%.

I also implemented the team first Aria accessibility practice
and established commit standardization tools.

I have English TEM-8 certification and organized English tech salons
to help the team improve cross-border communication.

I am excited about this opportunity because I want to work in an
English-speaking environment where I can leverage both technical
and language skills.
\`\`\``

const MOCK_WEEKEND =
`**Pick the 2 weakest BQ stories and practice**:

Stories available:
1. PMS infrastructure (technical leadership)
2. Conflict resolution with product team
3. Failure: over-engineering at Ctrip
4. Cross-team: English tech salons
5. Technical decision (Webpack MF vs qiankun)

**Format**: Situation (15s), Task (10s), Action (45s), Result (20s)

**Speak it out loud 3x per story.**`

const ALGO_WEAK_REVIEW =
`**Pick 1 weak area from this week**:

Options:
1. Stack: Valid Parentheses, Min Stack
2. HashMap: Two Sum, Group Anagrams, Top K Frequent
3. Linked List: Reverse, Merge Two Sorted, Cycle Detection
4. Tree: Inorder (recursive + iterative), Max Depth, Level Order
5. DP: Climbing Stairs, House Robber

**New Medium** (if feeling strong): Group Anagrams or Product of Array Except Self

**Tip**: Do 1 new + review 2 from this week. Deep understanding > breadth.`

/* ─── Seed data ─── */

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
    { id: 'thu-en', label: 'BQ: why Webpack MF not qiankun', category: 'english', completed: false, estMinutes: 20, detail: RSPACK_VS_VITE_BQ },
    { id: 'thu-fe', label: 'CSS layout quiz', category: 'frontend', completed: false, estMinutes: 10, detail: CSS_LAYOUT_QUIZ },
    { id: 'thu-anki', label: 'Review cards + new 5', category: 'anki', completed: false, estMinutes: 10, detail: ANKI_REMINDER },
  ],
  4: [
    { id: 'fri-algo', label: 'Review week algo problems', category: 'algorithm', completed: false, estMinutes: 20, detail: REVIEW_WEEK },
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
    { id: 'sun-anki', label: 'Review today cards', category: 'anki', completed: false, estMinutes: 10, detail: ANKI_REMINDER },
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
