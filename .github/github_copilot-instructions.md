Respond in Korean unless user explicitly requests another language
Do not add explanatory comments unless user explicitly requests
Use 2 spaces for indentation in code
Use TypeScript strict mode assumptions and avoid any and implicit any
Narrow nullable types early with explicit guards
Prefer readonly properties for objects and arrays that do not mutate
Prefer discriminated unions instead of enums for variant modeling
Export component prop types explicitly and keep them minimal
Use named exports except when a file has a single primary component
Keep React components as function components not class components
Do not use React.FC type
Define Props interface directly above the component
Destructure props at the top of the component
Keep hook calls at top level no conditional or loop wrapping
Provide stable function references with useCallback when passed to children and risk of re renders exists
Memoize expensive derived values with useMemo
Avoid inline arrow functions inside large lists unless trivial
Use semantic HTML elements before generic div
Add required aria attributes for custom interactive elements
Ensure form inputs have associated labels or aria-label
Colocate state at the lowest shared owner
Avoid global mutable module state except configuration constants
List rendering must use stable keys not index unless static
Run pnpm lint and pnpm typecheck before committing
Run pnpm test:unit before committing if tests are impacted
When agent mode prepares changes first run pnpm install if lockfile changed
When agent mode prepares changes ensure pnpm format is run last
Prefer async await instead of promise then chains
Handle all awaited promises with try catch or typed error boundaries
Never leave unhandled promise rejections
Validate fetch responses check status and parse safely
Do not interpolate unsanitized user content into dangerouslySetInnerHTML
Avoid hard coded color values use design token variables
Ensure components work in dark and light themes using tokens
Use CSS variables or Tailwind config for design tokens
Order Tailwind utilities logically: layout boxModel spacing typography color effects interaction variants
Do not exceed three levels of nested selectors in CSS or preprocessor code
Prefer extracting functions when a function body exceeds 40 lines
Prefer pure functions keep side effects isolated
Name variables camelCase functions imperative verbs components PascalCase types PascalCase constants UPPER_SNAKE_CASE
Avoid abbreviations unless ubiquitous (id url api dto ok)
Do not leave console.log in production code allow console.error and console.warn only when meaningful
Use ESLint and TypeScript to resolve all errors before optimization
Provide accessibility friendly focus outlines or rings for interactive elements
Use Intl APIs for date and number formatting
Use locale aware formatting not manual string concatenation
Prefer local data fetching hooks separated from presentational components
Separate domain logic from UI by using services or hooks layer
Avoid circular dependencies across index barrel files
If rules conflict priority is correctness accessibility performance security readability maintainability microOptimization
Summarize top three risks first when performing a code review
Provide concrete code suggestions instead of abstract advice in reviews
Avoid snapshot tests for highly dynamic components prefer behavior tests with Testing Library
Use data-testid or role queries not brittle selectors in tests
Mock network calls in tests do not hit real endpoints
Ensure tree shaking compatibility avoid side effect imports
Run build script pnpm build if build system files changed
Before adding new dependency verify if existing dependency covers need
Document breaking changes in CHANGELOG before merging