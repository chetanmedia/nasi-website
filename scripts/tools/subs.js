/* Ingredient substitutions. Standard kitchen ratios only.
 * Each ingredient has a base amount (per) in a unit; every swap lists its parts for that base amount,
 * so the finder can scale them to whatever amount the cook needs.
 * part: [qty, unit, what]   unit: tsp | tbsp | cup | each | clove | pinch | dash | ''   (fill = top up to the total)
 * fit: 3 closest, 2 good, 1 in a pinch.   tags: vegan, dairy-free, egg-free, gluten-free */

export const CATS = { dairy: 'Dairy', eggs: 'Eggs', baking: 'Baking', sweet: 'Sweeteners', fats: 'Fats & oils', sauces: 'Sauces & condiments', acids: 'Vinegar, citrus & wine', spices: 'Spices & herbs', cheese: 'Cheese', pantry: 'Pantry' }

export const SUBS = [
  { id: 'heavy-cream', name: 'Heavy cream', e: '🍶', cat: 'dairy', per: [1, 'cup'], kw: 'substitute for heavy cream', role: 'Heavy cream adds richness and body, thickens sauces without curdling and whips into peaks thanks to its high fat.', avoid: 'None of these whip like cream except chilled coconut cream.', swaps: [
    { name: 'Milk and butter', parts: [[0.75, 'cup', 'whole milk'], [0.25, 'cup', 'butter, melted']], fit: 3, best: 'Sauces, soups, baking', how: 'Whisk the melted butter into the milk. Great for cooking, but it won’t whip.' },
    { name: 'Half-and-half and butter', parts: [[0.875, 'cup', 'half-and-half'], [2, 'tbsp', 'butter, melted']], fit: 3, best: 'Sauces, soups, quiche', how: 'Closest fat level of the easy swaps. Won’t whip.' },
    { name: 'Coconut cream', parts: [[1, 'cup', 'full-fat coconut cream']], fit: 2, best: 'Curries, soups, whipped topping', how: 'Chill the can overnight and it whips. Adds a light coconut flavor.', tags: ['vegan', 'dairy-free'] },
    { name: 'Evaporated milk', parts: [[1, 'cup', 'evaporated milk']], fit: 2, best: 'Pies, casseroles, creamy sauces', how: 'Slightly sweet and cooked-tasting, but stable when heated. Won’t whip.' },
    { name: 'Greek yogurt and milk', parts: [[0.5, 'cup', 'plain Greek yogurt'], [0.5, 'cup', 'whole milk']], fit: 1, best: 'Soups and sauces off the heat', how: 'Stir in at the end and don’t boil, or it can split. Adds tang.' }
  ] },
  { id: 'eggs', name: 'Eggs', e: '🥚', cat: 'eggs', per: [1, 'each'], unitName: ['egg', 'eggs'], kw: 'substitute for eggs in baking', role: 'In baking, eggs bind ingredients, add moisture and help things rise. Most swaps cover one or two of those jobs, not all three.', avoid: 'Swaps work best when a recipe uses 1 or 2 eggs. For 3 or more, choose a recipe designed to be egg-free.', swaps: [
    { name: 'Flax egg', parts: [[1, 'tbsp', 'ground flaxseed'], [3, 'tbsp', 'water']], fit: 3, best: 'Muffins, cookies, quick breads, pancakes', how: 'Stir together and rest 5 minutes until gel-like. Adds a mild nutty flavor.', tags: ['vegan', 'egg-free', 'dairy-free', 'gluten-free'] },
    { name: 'Chia egg', parts: [[1, 'tbsp', 'chia seeds'], [3, 'tbsp', 'water']], fit: 2, best: 'Muffins, brownies, oatmeal bakes', how: 'Rest 5–10 minutes to gel. Leaves small specks unless you grind the seeds.', tags: ['vegan', 'egg-free', 'dairy-free', 'gluten-free'] },
    { name: 'Aquafaba', parts: [[3, 'tbsp', 'aquafaba (liquid from canned chickpeas)']], fit: 2, best: 'Cakes, cookies, meringues', how: 'Whisk lightly before using. It whips like egg whites for meringues.', tags: ['vegan', 'egg-free', 'dairy-free', 'gluten-free'] },
    { name: 'Applesauce', parts: [[0.25, 'cup', 'unsweetened applesauce']], fit: 2, best: 'Cakes, brownies, muffins', how: 'Adds moisture more than lift. Add ½ tsp extra baking powder per egg for a lighter crumb.', tags: ['vegan', 'egg-free', 'dairy-free', 'gluten-free'] },
    { name: 'Mashed banana', parts: [[0.25, 'cup', 'ripe banana, mashed']], fit: 1, best: 'Pancakes, banana bread, muffins', how: 'Makes bakes denser and tastes of banana, so use it where that works.', tags: ['vegan', 'egg-free', 'dairy-free', 'gluten-free'] },
    { name: 'Yogurt', parts: [[0.25, 'cup', 'plain yogurt']], fit: 1, best: 'Cakes, muffins', how: 'Adds moisture and a little tang.', tags: ['egg-free', 'gluten-free'] }
  ] },
  { id: 'buttermilk', name: 'Buttermilk', e: '🥛', cat: 'dairy', per: [1, 'cup'], kw: 'substitute for buttermilk', role: 'Buttermilk is tangy and slightly thick. Its acid reacts with baking soda for lift and tenderizes meat in marinades.', swaps: [
    { name: 'Milk and lemon juice', parts: [[1, 'tbsp', 'lemon juice'], [1, 'cup', 'milk', 'fill']], fit: 3, best: 'Pancakes, biscuits, cakes, marinades', how: 'Add the lemon juice, top up with milk, stir and rest 5–10 minutes until slightly curdled.' },
    { name: 'Milk and vinegar', parts: [[1, 'tbsp', 'white vinegar'], [1, 'cup', 'milk', 'fill']], fit: 3, best: 'Pancakes, biscuits, fried chicken', how: 'Same method as lemon: rest 5–10 minutes before using.' },
    { name: 'Yogurt and milk', parts: [[0.75, 'cup', 'plain yogurt'], [0.25, 'cup', 'milk']], fit: 3, best: 'Baking, dressings', how: 'Whisk smooth. Gives the closest thickness.' },
    { name: 'Kefir', parts: [[1, 'cup', 'plain kefir']], fit: 3, best: 'Anything', how: 'Swap one for one.' },
    { name: 'Non-dairy milk and lemon', parts: [[1, 'tbsp', 'lemon juice'], [1, 'cup', 'unsweetened soy or oat milk', 'fill']], fit: 2, best: 'Pancakes, muffins', how: 'Soy milk curdles best. Rest 10 minutes.', tags: ['vegan', 'dairy-free'] }
  ] },
  { id: 'half-and-half', name: 'Half-and-half', e: '☕', cat: 'dairy', per: [1, 'cup'], kw: 'substitute for half and half', role: 'Half-and-half is half whole milk, half cream: richer than milk, lighter than cream.', swaps: [
    { name: 'Milk and cream', parts: [[0.5, 'cup', 'whole milk'], [0.5, 'cup', 'heavy cream']], fit: 3, best: 'Coffee, sauces, baking', how: 'Exactly what half-and-half is made of.' },
    { name: 'Milk and butter', parts: [[0.875, 'cup', 'whole milk'], [2, 'tbsp', 'butter, melted']], fit: 2, best: 'Sauces, soups, baking', how: 'Whisk well. Fine for cooking, not ideal in coffee.' },
    { name: 'Evaporated milk', parts: [[1, 'cup', 'evaporated milk']], fit: 2, best: 'Coffee, custards, sauces', how: 'Slightly sweet. Very stable when heated.' },
    { name: 'Oat or soy creamer', parts: [[1, 'cup', 'unsweetened oat or soy creamer']], fit: 2, best: 'Coffee, soups', how: 'Pick unflavored, unsweetened for cooking.', tags: ['vegan', 'dairy-free'] }
  ] },
  { id: 'milk', name: 'Milk', e: '🥛', cat: 'dairy', per: [1, 'cup'], kw: 'dairy free substitute for milk', role: 'Milk adds liquid, a little fat and protein that helps browning.', swaps: [
    { name: 'Oat milk', parts: [[1, 'cup', 'unsweetened oat milk']], fit: 3, best: 'Baking, sauces, coffee', how: 'Creamy and neutral. Swap one for one.', tags: ['vegan', 'dairy-free'] },
    { name: 'Soy milk', parts: [[1, 'cup', 'unsweetened soy milk']], fit: 3, best: 'Baking, sauces', how: 'Closest protein to dairy milk, so it browns well.', tags: ['vegan', 'dairy-free', 'gluten-free'] },
    { name: 'Almond milk', parts: [[1, 'cup', 'unsweetened almond milk']], fit: 2, best: 'Smoothies, pancakes, oatmeal', how: 'Thinner, so bakes can be slightly less rich.', tags: ['vegan', 'dairy-free', 'gluten-free'] },
    { name: 'Evaporated milk and water', parts: [[0.5, 'cup', 'evaporated milk'], [0.5, 'cup', 'water']], fit: 3, best: 'Anything', how: 'Shelf-stable dairy milk. Mix and use as normal.', tags: ['gluten-free'] },
    { name: 'Water and butter', parts: [[1, 'cup', 'water'], [1, 'tbsp', 'butter, melted']], fit: 1, best: 'Baking in a pinch', how: 'Replaces the liquid and some fat. Bakes brown a little less.' }
  ] },
  { id: 'sour-cream', name: 'Sour cream', e: '🥣', cat: 'dairy', per: [1, 'cup'], kw: 'substitute for sour cream', role: 'Sour cream adds tang, fat and moisture to bakes, dips and sauces.', swaps: [
    { name: 'Greek yogurt', parts: [[1, 'cup', 'plain full-fat Greek yogurt']], fit: 3, best: 'Dips, dressings, baking, toppings', how: 'Swap one for one. Full-fat is closest.', tags: ['gluten-free'] },
    { name: 'Crème fraîche', parts: [[1, 'cup', 'crème fraîche']], fit: 3, best: 'Sauces, toppings', how: 'Richer and less tangy. Doesn’t curdle in hot sauces.', tags: ['gluten-free'] },
    { name: 'Blended cottage cheese', parts: [[1, 'cup', 'cottage cheese'], [1, 'tbsp', 'lemon juice']], fit: 2, best: 'Dips, baked potatoes', how: 'Blend until completely smooth.', tags: ['gluten-free'] },
    { name: 'Coconut cream and lemon', parts: [[1, 'cup', 'coconut cream'], [1, 'tbsp', 'lemon juice']], fit: 1, best: 'Curries, dips', how: 'Dairy-free with a coconut note.', tags: ['vegan', 'dairy-free', 'gluten-free'] }
  ] },
  { id: 'cream-cheese', name: 'Cream cheese', e: '🧀', cat: 'cheese', per: [1, 'cup'], kw: 'substitute for cream cheese', role: 'Cream cheese is thick, tangy and rich. It sets cheesecakes and makes frostings and dips creamy.', swaps: [
    { name: 'Neufchâtel', parts: [[1, 'cup', 'Neufchâtel cheese']], fit: 3, best: 'Everything, including cheesecake', how: 'A lower-fat cousin. Swap one for one.', tags: ['gluten-free'] },
    { name: 'Mascarpone', parts: [[1, 'cup', 'mascarpone']], fit: 3, best: 'Frosting, desserts, pasta sauces', how: 'Richer and milder. Add a squeeze of lemon for tang.', tags: ['gluten-free'] },
    { name: 'Strained Greek yogurt', parts: [[1, 'cup', 'Greek yogurt, strained overnight']], fit: 2, best: 'Dips, spreads', how: 'Strain in a cheesecloth-lined sieve in the fridge overnight until thick.', tags: ['gluten-free'] },
    { name: 'Blended ricotta', parts: [[1, 'cup', 'ricotta, drained']], fit: 2, best: 'Dips, pasta, baked dishes', how: 'Blend smooth. Softer and less tangy.', tags: ['gluten-free'] }
  ] },
  { id: 'evaporated-milk', name: 'Evaporated milk', e: '🥫', cat: 'dairy', per: [1, 'cup'], kw: 'substitute for evaporated milk', role: 'Evaporated milk is milk with about 60% of the water cooked off: creamy, stable and slightly caramelized.', swaps: [
    { name: 'Reduced milk', parts: [[2.25, 'cup', 'whole milk, simmered down']], fit: 3, best: 'Pies, sauces, fudge', how: 'Simmer gently, stirring often, until it reduces to 1 cup. Cool before using.' },
    { name: 'Half-and-half', parts: [[1, 'cup', 'half-and-half']], fit: 2, best: 'Sauces, soups, coffee', how: 'Swap one for one. Lighter than cream.' },
    { name: 'Heavy cream', parts: [[1, 'cup', 'heavy cream']], fit: 2, best: 'Sauces, pies', how: 'Richer. Some cooks thin it with a splash of water.' },
    { name: 'Full-fat coconut milk', parts: [[1, 'cup', 'canned coconut milk']], fit: 2, best: 'Curries, pies, sweet recipes', how: 'Dairy-free with a coconut flavor.', tags: ['vegan', 'dairy-free', 'gluten-free'] }
  ] },
  { id: 'butter', name: 'Butter (for baking)', e: '🧈', cat: 'fats', per: [1, 'cup'], kw: 'butter substitute for baking', role: 'Butter adds flavor, fat and tenderness, and creamed with sugar it traps air for lift.', avoid: 'Oil can’t be creamed, so it suits muffins and quick breads more than cookies that rely on creaming.', swaps: [
    { name: 'Vegan butter sticks', parts: [[1, 'cup', 'vegan butter sticks']], fit: 3, best: 'Cookies, cakes, pastry', how: 'Swap one for one. Sticks bake better than tubs.', tags: ['vegan', 'dairy-free'] },
    { name: 'Coconut oil', parts: [[1, 'cup', 'coconut oil, solid or melted to match']], fit: 2, best: 'Cookies, brownies, pie crust', how: 'Use solid where butter is softened, melted where butter is melted.', tags: ['vegan', 'dairy-free', 'gluten-free'] },
    { name: 'Vegetable oil', parts: [[0.75, 'cup', 'neutral oil']], fit: 2, best: 'Muffins, cakes, quick breads', how: 'Use ¾ as much because butter is about 20% water. Moist, but less buttery.', tags: ['vegan', 'dairy-free', 'gluten-free'] },
    { name: 'Shortening', parts: [[1, 'cup', 'vegetable shortening'], [0.5, 'tsp', 'salt']], fit: 2, best: 'Pie crust, biscuits', how: 'Flaky and tender but no butter flavor, so add the salt.', tags: ['vegan', 'dairy-free', 'gluten-free'] }
  ] },
  { id: 'shortening', name: 'Shortening', e: '🫙', cat: 'fats', per: [1, 'cup'], kw: 'substitute for shortening', role: 'Shortening is pure fat, so it makes very tender, flaky crusts and soft cookies.', swaps: [
    { name: 'Butter', parts: [[1.125, 'cup', 'butter']], fit: 3, best: 'Pie crust, cookies, biscuits', how: 'Use 2 tbsp more per cup because butter contains water. Cookies spread a bit more.', tags: ['gluten-free'] },
    { name: 'Lard', parts: [[1, 'cup', 'lard']], fit: 3, best: 'Pie crust, biscuits', how: 'Swap one for one. Very flaky.', tags: ['dairy-free', 'gluten-free'] },
    { name: 'Coconut oil', parts: [[1, 'cup', 'solid coconut oil']], fit: 2, best: 'Cookies, crusts', how: 'Keep it cold for pastry.', tags: ['vegan', 'dairy-free', 'gluten-free'] }
  ] },
  { id: 'baking-powder', name: 'Baking powder', e: '🧁', cat: 'baking', per: [1, 'tsp'], kw: 'substitute for baking powder', role: 'Baking powder is baking soda plus a dry acid. It makes bakes rise without anything else acidic in the recipe.', swaps: [
    { name: 'Baking soda and cream of tartar', parts: [[0.25, 'tsp', 'baking soda'], [0.5, 'tsp', 'cream of tartar']], fit: 3, best: 'Any baking', how: 'Mix and use right away. Bake promptly once wet.', tags: ['vegan', 'gluten-free'] },
    { name: 'Baking soda and buttermilk', parts: [[0.25, 'tsp', 'baking soda'], [0.5, 'cup', 'buttermilk or plain yogurt']], fit: 2, best: 'Pancakes, quick breads, muffins', how: 'Cut ½ cup of other liquid from the recipe to make room for the buttermilk.' },
    { name: 'Baking soda and lemon juice', parts: [[0.25, 'tsp', 'baking soda'], [0.5, 'tsp', 'lemon juice or vinegar']], fit: 2, best: 'Pancakes, muffins', how: 'Add the acid with the wet ingredients.', tags: ['vegan', 'gluten-free'] }
  ] },
  { id: 'baking-soda', name: 'Baking soda', e: '🧂', cat: 'baking', per: [1, 'tsp'], kw: 'substitute for baking soda', role: 'Baking soda reacts with acids like buttermilk or brown sugar to lift and brown bakes. It’s about 3 to 4 times stronger than baking powder.', avoid: 'Baking powder can’t fully replace soda in very acidic recipes, and results can taste slightly different.', swaps: [
    { name: 'Baking powder', parts: [[3, 'tsp', 'baking powder']], fit: 2, best: 'Cookies, quick breads, pancakes', how: 'Use 3 times as much. Cut the recipe’s salt a little since baking powder contains some.', tags: ['vegan', 'gluten-free'] }
  ] },
  { id: 'self-rising-flour', name: 'Self-rising flour', e: '🌾', cat: 'baking', per: [1, 'cup'], kw: 'substitute for self rising flour', role: 'Self-rising flour is soft flour with baking powder and salt already mixed in.', swaps: [
    { name: 'All-purpose flour, baking powder and salt', parts: [[1, 'cup', 'all-purpose flour'], [1.5, 'tsp', 'baking powder'], [0.25, 'tsp', 'salt']], fit: 3, best: 'Biscuits, pancakes, quick breads', how: 'Whisk together well before using.', tags: ['vegan'] }
  ] },
  { id: 'cake-flour', name: 'Cake flour', e: '🎂', cat: 'baking', per: [1, 'cup'], kw: 'substitute for cake flour', role: 'Cake flour is low in protein, so cakes come out soft and fine-crumbed.', swaps: [
    { name: 'All-purpose flour and cornstarch', parts: [[0.875, 'cup', 'all-purpose flour'], [2, 'tbsp', 'cornstarch']], fit: 3, best: 'Cakes, cupcakes', how: 'Measure 1 cup of flour, take out 2 tbsp, add 2 tbsp cornstarch and sift together twice.', tags: ['vegan'] }
  ] },
  { id: 'cornstarch', name: 'Cornstarch (to thicken)', e: '🌽', cat: 'baking', per: [1, 'tbsp'], kw: 'substitute for cornstarch', role: 'Cornstarch thickens sauces, gravies and fillings and turns glossy when cooked.', swaps: [
    { name: 'All-purpose flour', parts: [[2, 'tbsp', 'all-purpose flour']], fit: 3, best: 'Gravies, stews, sauces', how: 'Use twice as much and simmer a few minutes to cook out the raw taste. Less glossy.', tags: ['vegan'] },
    { name: 'Potato starch', parts: [[1, 'tbsp', 'potato starch']], fit: 3, best: 'Sauces, soups, stir-fries', how: 'Swap one for one. Add near the end and don’t boil hard.', tags: ['vegan', 'gluten-free'] }
  ] },
  { id: 'brown-sugar', name: 'Brown sugar', e: '🟫', cat: 'sweet', per: [1, 'cup'], kw: 'substitute for brown sugar', role: 'Brown sugar is white sugar with molasses: moist, chewy and caramel-flavored.', swaps: [
    { name: 'White sugar and molasses', parts: [[1, 'cup', 'granulated sugar'], [1, 'tbsp', 'molasses']], fit: 3, best: 'Cookies, sauces, glazes', how: 'Mix with a fork until even. Use 2 tbsp molasses for dark brown sugar.', tags: ['vegan', 'gluten-free'] },
    { name: 'Coconut sugar', parts: [[1, 'cup', 'coconut sugar']], fit: 2, best: 'Cookies, crumbles', how: 'Swap one for one. Slightly drier.', tags: ['vegan', 'gluten-free'] },
    { name: 'White sugar', parts: [[1, 'cup', 'granulated sugar']], fit: 1, best: 'Anything in a pinch', how: 'Cookies will be crisper and paler, with less caramel flavor.', tags: ['vegan', 'gluten-free'] }
  ] },
  { id: 'powdered-sugar', name: 'Powdered sugar', e: '❄️', cat: 'sweet', per: [1, 'cup'], kw: 'substitute for powdered sugar', role: 'Powdered sugar is finely ground sugar with a little cornstarch, so frostings and glazes are smooth.', swaps: [
    { name: 'Blended granulated sugar', parts: [[1, 'cup', 'granulated sugar'], [1, 'tbsp', 'cornstarch']], fit: 3, best: 'Frosting, glazes, dusting', how: 'Blend in a dry blender for 1–2 minutes until fluffy. Let the dust settle before opening.', tags: ['vegan', 'gluten-free'] }
  ] },
  { id: 'honey', name: 'Honey', e: '🍯', cat: 'sweet', per: [1, 'cup'], kw: 'substitute for honey', role: 'Honey sweetens, keeps bakes moist and browns quickly.', swaps: [
    { name: 'Maple syrup', parts: [[1, 'cup', 'pure maple syrup']], fit: 3, best: 'Glazes, dressings, baking', how: 'Swap one for one. Thinner, with maple flavor.', tags: ['vegan', 'gluten-free'] },
    { name: 'Agave syrup', parts: [[1, 'cup', 'agave syrup']], fit: 3, best: 'Drinks, dressings, baking', how: 'Swap one for one. Neutral flavor.', tags: ['vegan', 'gluten-free'] },
    { name: 'Sugar and water', parts: [[1.25, 'cup', 'granulated sugar'], [0.25, 'cup', 'water']], fit: 2, best: 'Baking', how: 'Adds the sweetness and liquid honey would.', tags: ['vegan', 'gluten-free'] }
  ] },
  { id: 'maple-syrup', name: 'Maple syrup', e: '🍁', cat: 'sweet', per: [1, 'cup'], kw: 'substitute for maple syrup', role: 'Maple syrup adds sweetness, moisture and a woody caramel flavor.', swaps: [
    { name: 'Honey', parts: [[1, 'cup', 'honey']], fit: 3, best: 'Glazes, dressings, baking', how: 'Swap one for one. Thicker and browns faster, so watch the oven.', tags: ['gluten-free'] },
    { name: 'Agave syrup', parts: [[1, 'cup', 'agave syrup']], fit: 2, best: 'Drinks, dressings', how: 'Neutral flavor. Add a drop of vanilla for warmth.', tags: ['vegan', 'gluten-free'] },
    { name: 'Brown sugar syrup', parts: [[1, 'cup', 'brown sugar'], [0.5, 'cup', 'water']], fit: 1, best: 'Pancakes, oatmeal', how: 'Simmer until dissolved and slightly thick.', tags: ['vegan', 'gluten-free'] }
  ] },
  { id: 'vanilla', name: 'Vanilla extract', e: '🌼', cat: 'baking', per: [1, 'tsp'], kw: 'substitute for vanilla essence', role: 'Vanilla rounds out sweetness and makes bakes taste warmer.', swaps: [
    { name: 'Vanilla bean paste', parts: [[1, 'tsp', 'vanilla bean paste']], fit: 3, best: 'Custards, frosting, cakes', how: 'Swap one for one. Adds vanilla specks.', tags: ['vegan', 'gluten-free'] },
    { name: 'Maple syrup', parts: [[1, 'tsp', 'maple syrup']], fit: 2, best: 'Cookies, pancakes, oatmeal', how: 'Similar warm sweetness.', tags: ['vegan', 'gluten-free'] },
    { name: 'Almond extract', parts: [[0.5, 'tsp', 'almond extract']], fit: 1, best: 'Cookies, cakes', how: 'Use half as much. Stronger, with a marzipan flavor.', tags: ['vegan', 'gluten-free'] },
    { name: 'Bourbon or dark rum', parts: [[1, 'tsp', 'bourbon or dark rum']], fit: 1, best: 'Brownies, sauces', how: 'Adds a similar warmth.', tags: ['vegan', 'gluten-free'] }
  ] },
  { id: 'lemon-juice', name: 'Lemon juice', e: '🍋', cat: 'acids', per: [1, 'tbsp'], kw: 'substitute for lemon juice', role: 'Lemon juice adds bright acidity and keeps cut fruit from browning.', swaps: [
    { name: 'Lime juice', parts: [[1, 'tbsp', 'lime juice']], fit: 3, best: 'Dressings, marinades, baking', how: 'Swap one for one.', tags: ['vegan', 'gluten-free'] },
    { name: 'White wine vinegar', parts: [[0.5, 'tbsp', 'white wine vinegar']], fit: 2, best: 'Dressings, sauces', how: 'Use half as much; vinegar is sharper.', tags: ['vegan', 'gluten-free'] },
    { name: 'Citric acid', parts: [[0.25, 'tsp', 'citric acid'], [1, 'tbsp', 'water', 'fill']], fit: 1, best: 'Canning, drinks', how: 'Dissolve in the water. Very sour, no lemon aroma.', tags: ['vegan', 'gluten-free'] }
  ] },
  { id: 'white-wine', name: 'White wine (cooking)', e: '🍷', cat: 'acids', per: [0.5, 'cup'], kw: 'substitute for white wine in cooking', role: 'Wine adds acidity and depth and helps lift browned bits from the pan.', swaps: [
    { name: 'Stock and vinegar', parts: [[0.5, 'cup', 'chicken or vegetable stock'], [1, 'tsp', 'white wine vinegar']], fit: 3, best: 'Pan sauces, risotto, braises', how: 'Stir together. Alcohol-free.' },
    { name: 'Dry vermouth', parts: [[0.5, 'cup', 'dry vermouth']], fit: 3, best: 'Pan sauces, seafood', how: 'Swap one for one. Keeps for months once opened.', tags: ['vegan', 'gluten-free'] },
    { name: 'White grape juice and vinegar', parts: [[0.5, 'cup', 'white grape juice'], [1, 'tbsp', 'white wine vinegar']], fit: 2, best: 'Sweeter sauces, glazes', how: 'Alcohol-free.', tags: ['vegan', 'gluten-free'] }
  ] },
  { id: 'shaoxing-wine', name: 'Shaoxing wine', e: '🍶', cat: 'acids', per: [1, 'tbsp'], kw: 'substitute for shaoxing wine', role: 'Shaoxing rice wine adds savory, slightly sweet depth to stir-fries, marinades and dumpling fillings.', swaps: [
    { name: 'Dry sherry', parts: [[1, 'tbsp', 'dry sherry']], fit: 3, best: 'Stir-fries, marinades', how: 'The closest flavor. Swap one for one.', tags: ['vegan', 'gluten-free'] },
    { name: 'Mirin', parts: [[1, 'tbsp', 'mirin']], fit: 2, best: 'Glazes, marinades', how: 'Sweeter, so cut any sugar in the recipe a little.', tags: ['vegan'] },
    { name: 'Chicken stock', parts: [[1, 'tbsp', 'chicken stock']], fit: 1, best: 'Stir-fries', how: 'Alcohol-free. Adds savoriness but not the wine aroma.' }
  ] },
  { id: 'mirin', name: 'Mirin', e: '🍶', cat: 'acids', per: [1, 'tbsp'], kw: 'substitute for mirin', role: 'Mirin is a sweet rice wine that adds gloss and gentle sweetness to teriyaki and glazes.', swaps: [
    { name: 'Dry sherry and sugar', parts: [[1, 'tbsp', 'dry sherry'], [0.5, 'tsp', 'sugar']], fit: 3, best: 'Glazes, marinades', how: 'Stir until the sugar dissolves.', tags: ['vegan', 'gluten-free'] },
    { name: 'Rice vinegar and sugar', parts: [[1, 'tbsp', 'rice vinegar'], [0.5, 'tsp', 'sugar']], fit: 2, best: 'Dressings, sushi rice, sauces', how: 'Alcohol-free and a little sharper.', tags: ['vegan', 'gluten-free'] }
  ] },
  { id: 'rice-vinegar', name: 'Rice vinegar', e: '🍚', cat: 'acids', per: [1, 'tbsp'], kw: 'substitute for rice vinegar', role: 'Rice vinegar is mild and slightly sweet, used in dressings, pickles and sushi rice.', swaps: [
    { name: 'Apple cider vinegar', parts: [[1, 'tbsp', 'apple cider vinegar'], [1, 'pinch', 'sugar']], fit: 3, best: 'Dressings, slaws, marinades', how: 'The pinch of sugar softens the bite.', tags: ['vegan', 'gluten-free'] },
    { name: 'White wine vinegar', parts: [[1, 'tbsp', 'white wine vinegar'], [1, 'pinch', 'sugar']], fit: 3, best: 'Dressings, pickles', how: 'Swap one for one.', tags: ['vegan', 'gluten-free'] },
    { name: 'Lime juice', parts: [[1, 'tbsp', 'lime juice']], fit: 1, best: 'Dressings, dipping sauces', how: 'Fresher and fruitier.', tags: ['vegan', 'gluten-free'] }
  ] },
  { id: 'apple-cider-vinegar', name: 'Apple cider vinegar', e: '🍎', cat: 'acids', per: [1, 'tbsp'], kw: 'substitute for apple cider vinegar', role: 'Apple cider vinegar adds fruity acidity to dressings, marinades and baking.', swaps: [
    { name: 'White wine vinegar', parts: [[1, 'tbsp', 'white wine vinegar']], fit: 3, best: 'Dressings, marinades', how: 'Swap one for one.', tags: ['vegan', 'gluten-free'] },
    { name: 'Lemon juice', parts: [[1, 'tbsp', 'lemon juice']], fit: 2, best: 'Dressings, baking', how: 'Works with baking soda the same way.', tags: ['vegan', 'gluten-free'] },
    { name: 'Rice vinegar', parts: [[1, 'tbsp', 'rice vinegar']], fit: 2, best: 'Dressings, slaws', how: 'Milder.', tags: ['vegan', 'gluten-free'] }
  ] },
  { id: 'white-wine-vinegar', name: 'White wine vinegar', e: '🫙', cat: 'acids', per: [1, 'tbsp'], kw: 'substitute for white wine vinegar', role: 'White wine vinegar is clean and bright, great in dressings and sauces like béarnaise.', swaps: [
    { name: 'Champagne vinegar', parts: [[1, 'tbsp', 'champagne vinegar']], fit: 3, best: 'Dressings, sauces', how: 'Swap one for one. Slightly milder.', tags: ['vegan', 'gluten-free'] },
    { name: 'Rice vinegar', parts: [[1, 'tbsp', 'rice vinegar']], fit: 2, best: 'Dressings, pickles', how: 'Milder and a touch sweet.', tags: ['vegan', 'gluten-free'] },
    { name: 'Apple cider vinegar', parts: [[1, 'tbsp', 'apple cider vinegar']], fit: 2, best: 'Dressings, marinades', how: 'Fruitier.', tags: ['vegan', 'gluten-free'] },
    { name: 'Lemon juice', parts: [[1, 'tbsp', 'lemon juice']], fit: 1, best: 'Dressings', how: 'Fresher, less sharp.', tags: ['vegan', 'gluten-free'] }
  ] },
  { id: 'worcestershire-sauce', name: 'Worcestershire sauce', e: '🍾', cat: 'sauces', per: [1, 'tbsp'], kw: 'substitute for worcestershire sauce', role: 'Worcestershire adds savory umami, tang and a little sweetness to marinades, burgers and stews.', swaps: [
    { name: 'Soy sauce, vinegar and sugar', parts: [[1, 'tbsp', 'soy sauce'], [0.25, 'tsp', 'apple cider vinegar'], [1, 'pinch', 'sugar']], fit: 3, best: 'Marinades, burgers, stews', how: 'Stir together. Close in salt and tang.', tags: ['vegan'] },
    { name: 'Soy sauce', parts: [[1, 'tbsp', 'soy sauce']], fit: 2, best: 'Stews, gravies', how: 'Umami without the tang.', tags: ['vegan'] },
    { name: 'Fish sauce and soy sauce', parts: [[1, 'tsp', 'fish sauce'], [2, 'tsp', 'soy sauce']], fit: 2, best: 'Dressings, marinades', how: 'Big savory depth. A little goes a long way.' }
  ] },
  { id: 'soy-sauce', name: 'Soy sauce', e: '🥢', cat: 'sauces', per: [1, 'tbsp'], kw: 'substitute for soy sauce', role: 'Soy sauce brings salt and deep umami.', swaps: [
    { name: 'Tamari', parts: [[1, 'tbsp', 'tamari']], fit: 3, best: 'Everything', how: 'Swap one for one. Usually gluten-free (check the label).', tags: ['vegan', 'gluten-free'] },
    { name: 'Coconut aminos', parts: [[1, 'tbsp', 'coconut aminos']], fit: 2, best: 'Stir-fries, dressings', how: 'Sweeter and less salty. Add a pinch of salt.', tags: ['vegan', 'gluten-free'] },
    { name: 'Liquid aminos', parts: [[1, 'tbsp', 'liquid aminos']], fit: 3, best: 'Everything', how: 'Swap one for one.', tags: ['vegan', 'gluten-free'] }
  ] },
  { id: 'tamari', name: 'Tamari', e: '🥢', cat: 'sauces', per: [1, 'tbsp'], kw: 'substitute for tamari', role: 'Tamari is a rich, usually wheat-free soy sauce.', swaps: [
    { name: 'Soy sauce', parts: [[1, 'tbsp', 'soy sauce']], fit: 3, best: 'Everything', how: 'Swap one for one. Contains wheat.', tags: ['vegan'] },
    { name: 'Coconut aminos', parts: [[1, 'tbsp', 'coconut aminos']], fit: 2, best: 'Dressings, stir-fries', how: 'Sweeter and less salty.', tags: ['vegan', 'gluten-free'] },
    { name: 'Liquid aminos', parts: [[1, 'tbsp', 'liquid aminos']], fit: 3, best: 'Everything', how: 'Swap one for one.', tags: ['vegan', 'gluten-free'] }
  ] },
  { id: 'oyster-sauce', name: 'Oyster sauce', e: '🦪', cat: 'sauces', per: [1, 'tbsp'], kw: 'substitute for oyster sauce', role: 'Oyster sauce is thick, savory and slightly sweet. It gives stir-fries their glossy coating.', swaps: [
    { name: 'Mushroom stir-fry sauce', parts: [[1, 'tbsp', 'vegetarian mushroom “oyster” sauce']], fit: 3, best: 'Stir-fries, noodles', how: 'Swap one for one.', tags: ['vegan'] },
    { name: 'Hoisin sauce', parts: [[1, 'tbsp', 'hoisin sauce']], fit: 2, best: 'Stir-fries, glazes', how: 'Sweeter and spiced. Add a dash of soy sauce for salt.', tags: ['vegan'] },
    { name: 'Soy sauce and sugar', parts: [[1, 'tbsp', 'soy sauce'], [0.25, 'tsp', 'sugar']], fit: 1, best: 'Stir-fries', how: 'Thinner. Add a little cornstarch slurry for gloss.', tags: ['vegan'] }
  ] },
  { id: 'hoisin-sauce', name: 'Hoisin sauce', e: '🫙', cat: 'sauces', per: [1, 'tbsp'], kw: 'substitute for hoisin', role: 'Hoisin is sweet, salty and spiced, used as a glaze and dipping sauce.', swaps: [
    { name: 'Soy, peanut butter and honey', parts: [[1, 'tbsp', 'soy sauce'], [1, 'tsp', 'peanut butter'], [1, 'tsp', 'honey'], [1, 'dash', 'garlic powder']], fit: 2, best: 'Glazes, dipping sauce', how: 'Whisk until smooth.' },
    { name: 'Oyster sauce and honey', parts: [[1, 'tbsp', 'oyster sauce'], [0.5, 'tsp', 'honey']], fit: 2, best: 'Stir-fries', how: 'Saltier and less spiced.' },
    { name: 'Barbecue sauce', parts: [[1, 'tbsp', 'barbecue sauce']], fit: 1, best: 'Glazes, wraps', how: 'Smokier, but similar sweet-savory balance.', tags: ['vegan'] }
  ] },
  { id: 'sesame-oil', name: 'Toasted sesame oil', e: '🫒', cat: 'fats', per: [1, 'tbsp'], kw: 'substitute for sesame oil', role: 'Toasted sesame oil is a finishing oil with a strong nutty aroma.', swaps: [
    { name: 'Neutral oil and tahini', parts: [[2, 'tsp', 'neutral oil'], [1, 'tsp', 'tahini']], fit: 2, best: 'Dressings, noodles', how: 'Whisk together. Nutty, but milder.', tags: ['vegan', 'gluten-free'] },
    { name: 'Oil and toasted sesame seeds', parts: [[1, 'tbsp', 'neutral oil'], [1, 'tsp', 'toasted sesame seeds, crushed']], fit: 2, best: 'Stir-fries, rice', how: 'Warm the oil gently with the seeds, then strain or leave them in.', tags: ['vegan', 'gluten-free'] },
    { name: 'Perilla oil', parts: [[1, 'tbsp', 'perilla oil']], fit: 2, best: 'Korean dishes, dressings', how: 'Similar nutty aroma.', tags: ['vegan', 'gluten-free'] }
  ] },
  { id: 'dijon-mustard', name: 'Dijon mustard', e: '🟡', cat: 'sauces', per: [1, 'tbsp'], kw: 'substitute for dijon', role: 'Dijon adds sharp heat and helps vinaigrettes emulsify.', swaps: [
    { name: 'Stone-ground mustard', parts: [[1, 'tbsp', 'stone-ground mustard']], fit: 3, best: 'Dressings, sauces, sandwiches', how: 'Swap one for one. Grainy texture.', tags: ['vegan', 'gluten-free'] },
    { name: 'Yellow mustard', parts: [[1, 'tbsp', 'yellow mustard']], fit: 2, best: 'Dressings, sauces', how: 'Milder and brighter. Add a splash of white wine vinegar.', tags: ['vegan', 'gluten-free'] },
    { name: 'Dry mustard', parts: [[1, 'tsp', 'dry mustard powder'], [1, 'tbsp', 'water or white wine', 'fill']], fit: 2, best: 'Sauces, rubs, dressings', how: 'Mix and rest 10 minutes for the heat to develop.', tags: ['vegan', 'gluten-free'] }
  ] },
  { id: 'mayonnaise', name: 'Mayonnaise', e: '🥪', cat: 'sauces', per: [1, 'cup'], kw: 'substitute for mayonnaise', role: 'Mayo is a creamy emulsion of oil and egg that binds salads and dressings.', swaps: [
    { name: 'Greek yogurt', parts: [[1, 'cup', 'plain Greek yogurt']], fit: 3, best: 'Chicken, egg and potato salads, dips', how: 'Tangier and lighter. Add a squeeze of lemon and pinch of salt.', tags: ['egg-free', 'gluten-free'] },
    { name: 'Sour cream', parts: [[1, 'cup', 'sour cream']], fit: 2, best: 'Dips, dressings, slaws', how: 'Swap one for one.', tags: ['egg-free', 'gluten-free'] },
    { name: 'Mashed avocado', parts: [[1, 'cup', 'ripe avocado, mashed']], fit: 2, best: 'Sandwiches, chicken or egg salad', how: 'Add lemon juice to stop browning.', tags: ['vegan', 'egg-free', 'dairy-free', 'gluten-free'] },
    { name: 'Hummus', parts: [[1, 'cup', 'hummus']], fit: 1, best: 'Sandwiches, wraps', how: 'Thicker, with a chickpea flavor.', tags: ['vegan', 'egg-free', 'dairy-free', 'gluten-free'] }
  ] },
  { id: 'tomato-paste', name: 'Tomato paste', e: '🍅', cat: 'pantry', per: [1, 'tbsp'], kw: 'substitute for tomato paste', role: 'Tomato paste is concentrated tomato that adds deep color and savory sweetness.', swaps: [
    { name: 'Tomato sauce', parts: [[3, 'tbsp', 'tomato sauce']], fit: 3, best: 'Sauces, stews, chili', how: 'Use 3 times as much and simmer a little longer, or cut other liquid.', tags: ['vegan', 'gluten-free'] },
    { name: 'Ketchup', parts: [[1, 'tbsp', 'ketchup']], fit: 2, best: 'Chili, meatloaf, barbecue sauces', how: 'Sweeter and tangier.', tags: ['vegan', 'gluten-free'] }
  ] },
  { id: 'tomato-sauce', name: 'Tomato sauce', e: '🥫', cat: 'pantry', per: [1, 'cup'], kw: 'substitute for tomato sauce', role: 'Plain tomato sauce is smooth, lightly seasoned tomato purée.', swaps: [
    { name: 'Tomato paste and water', parts: [[0.5, 'cup', 'tomato paste'], [0.5, 'cup', 'water']], fit: 3, best: 'Sauces, soups, chili', how: 'Whisk smooth and season to taste.', tags: ['vegan', 'gluten-free'] },
    { name: 'Blended canned tomatoes', parts: [[1, 'cup', 'canned tomatoes, blended']], fit: 3, best: 'Pasta sauce, soups', how: 'Blend smooth and simmer to thicken if needed.', tags: ['vegan', 'gluten-free'] },
    { name: 'Marinara', parts: [[1, 'cup', 'marinara sauce']], fit: 2, best: 'Pasta, casseroles', how: 'Already seasoned, so go easy on salt and herbs.', tags: ['vegan', 'gluten-free'] }
  ] },
  { id: 'chicken-stock', name: 'Chicken stock', e: '🍲', cat: 'pantry', per: [1, 'cup'], kw: 'substitute for chicken stock', role: 'Stock adds savory depth to soups, sauces, rice and gravies.', swaps: [
    { name: 'Vegetable stock', parts: [[1, 'cup', 'vegetable stock']], fit: 3, best: 'Soups, rice, sauces', how: 'Swap one for one.', tags: ['vegan', 'dairy-free'] },
    { name: 'Bouillon and water', parts: [[1, 'cup', 'water'], [1, 'each', 'bouillon cube (or 1 tsp paste)']], fit: 3, best: 'Anything', how: 'Dissolve fully. Bouillon is salty, so taste before adding salt.' },
    { name: 'Water and butter', parts: [[1, 'cup', 'water'], [1, 'tbsp', 'butter'], [0.25, 'tsp', 'salt']], fit: 1, best: 'Rice, gravies in a pinch', how: 'Add extra herbs or a splash of soy sauce for depth.' }
  ] },
  { id: 'coconut-milk', name: 'Coconut milk', e: '🥥', cat: 'pantry', per: [1, 'cup'], kw: 'substitute for coconut milk', role: 'Canned coconut milk adds body and richness to curries, soups and desserts.', swaps: [
    { name: 'Heavy cream', parts: [[1, 'cup', 'heavy cream']], fit: 2, best: 'Curries, soups', how: 'Rich and creamy, without the coconut flavor.', tags: ['gluten-free'] },
    { name: 'Greek yogurt and water', parts: [[0.75, 'cup', 'plain Greek yogurt'], [0.25, 'cup', 'water']], fit: 1, best: 'Curries off the heat', how: 'Stir in at the end and don’t boil.', tags: ['gluten-free'] },
    { name: 'Cashew cream', parts: [[0.5, 'cup', 'raw cashews, soaked'], [0.75, 'cup', 'water']], fit: 2, best: 'Curries, soups', how: 'Blend until completely smooth.', tags: ['vegan', 'dairy-free', 'gluten-free'] }
  ] },
  { id: 'tahini', name: 'Tahini', e: '🥜', cat: 'pantry', per: [1, 'tbsp'], kw: 'substitute for tahini', role: 'Tahini is ground sesame: creamy, nutty and slightly bitter.', swaps: [
    { name: 'Sunflower seed butter', parts: [[1, 'tbsp', 'sunflower seed butter']], fit: 3, best: 'Hummus, dressings', how: 'Swap one for one. Nut-free.', tags: ['vegan', 'gluten-free'] },
    { name: 'Cashew or almond butter', parts: [[1, 'tbsp', 'cashew or almond butter']], fit: 2, best: 'Dressings, sauces', how: 'Sweeter. Add a drop of sesame oil.', tags: ['vegan', 'gluten-free'] },
    { name: 'Greek yogurt', parts: [[1, 'tbsp', 'plain Greek yogurt']], fit: 1, best: 'Dressings, sauces', how: 'Creamy and tangy, but not nutty.', tags: ['gluten-free'] }
  ] },
  { id: 'cilantro', name: 'Cilantro', e: '🌿', cat: 'spices', per: [1, 'tbsp'], kw: 'substitute for cilantro', role: 'Cilantro adds fresh, citrusy brightness to salsas, curries and tacos.', swaps: [
    { name: 'Parsley and lime', parts: [[1, 'tbsp', 'fresh parsley, chopped'], [1, 'dash', 'lime juice']], fit: 2, best: 'Salsas, tacos, garnish', how: 'Fresh and green without the soapy taste some people dislike.', tags: ['vegan', 'gluten-free'] },
    { name: 'Thai basil', parts: [[1, 'tbsp', 'Thai basil, chopped']], fit: 2, best: 'Curries, noodle soups', how: 'Sweeter with an anise note.', tags: ['vegan', 'gluten-free'] },
    { name: 'Mint and parsley', parts: [[1.5, 'tsp', 'mint, chopped'], [1.5, 'tsp', 'parsley, chopped']], fit: 1, best: 'Salads, chutneys', how: 'Bright and fresh.', tags: ['vegan', 'gluten-free'] }
  ] },
  { id: 'fresh-herbs', name: 'Fresh herbs', e: '🌱', cat: 'spices', per: [1, 'tbsp'], kw: 'dried herbs instead of fresh', role: 'Fresh herbs are milder and brighter than dried.', swaps: [
    { name: 'Dried herbs', parts: [[1, 'tsp', 'dried herbs of the same kind']], fit: 3, best: 'Soups, sauces, rubs', how: 'Use a third as much and add early so they soften.', tags: ['vegan', 'gluten-free'] }
  ] },
  { id: 'thyme', name: 'Thyme (dried)', e: '🌿', cat: 'spices', per: [1, 'tsp'], kw: 'substitute for thyme', role: 'Thyme is earthy and lightly minty, a backbone herb for roasts, stews and stuffing.', swaps: [
    { name: 'Oregano', parts: [[1, 'tsp', 'dried oregano']], fit: 2, best: 'Tomato sauces, roast vegetables', how: 'Bolder, so start with a little less.', tags: ['vegan', 'gluten-free'] },
    { name: 'Marjoram', parts: [[1, 'tsp', 'dried marjoram']], fit: 3, best: 'Stuffing, stews, poultry', how: 'Milder and sweeter.', tags: ['vegan', 'gluten-free'] },
    { name: 'Italian seasoning', parts: [[1, 'tsp', 'Italian seasoning']], fit: 2, best: 'Roasts, sauces', how: 'Usually already contains thyme.', tags: ['vegan', 'gluten-free'] }
  ] },
  { id: 'cumin', name: 'Cumin (ground)', e: '🟤', cat: 'spices', per: [1, 'tsp'], kw: 'substitute for cumin', role: 'Cumin is warm, earthy and slightly smoky, key in chili, tacos and curries.', swaps: [
    { name: 'Ground coriander', parts: [[1, 'tsp', 'ground coriander']], fit: 2, best: 'Curries, stews', how: 'Lighter and more citrusy.', tags: ['vegan', 'gluten-free'] },
    { name: 'Chili powder', parts: [[1, 'tsp', 'chili powder']], fit: 2, best: 'Chili, tacos', how: 'Most chili powder blends contain cumin, plus heat.', tags: ['vegan', 'gluten-free'] },
    { name: 'Caraway seeds', parts: [[0.5, 'tsp', 'ground caraway']], fit: 1, best: 'Stews, roasted vegetables', how: 'Use half as much. A close relative with a stronger flavor.', tags: ['vegan', 'gluten-free'] }
  ] },
  { id: 'paprika', name: 'Paprika', e: '🌶️', cat: 'spices', per: [1, 'tsp'], kw: 'substitute for paprika', role: 'Paprika adds sweet pepper flavor and rich red color.', swaps: [
    { name: 'Ancho chili powder', parts: [[1, 'tsp', 'ancho chili powder']], fit: 2, best: 'Rubs, stews, chili', how: 'Mild and fruity, a little earthier.', tags: ['vegan', 'gluten-free'] },
    { name: 'Smoked paprika', parts: [[1, 'tsp', 'smoked paprika']], fit: 2, best: 'Rubs, roast potatoes, beans', how: 'Smoky, so it changes the flavor.', tags: ['vegan', 'gluten-free'] },
    { name: 'Cayenne', parts: [[1, 'pinch', 'cayenne pepper']], fit: 1, best: 'Rubs, sauces', how: 'Much hotter. Use just a pinch for color and kick.', tags: ['vegan', 'gluten-free'] }
  ] },
  { id: 'allspice', name: 'Allspice', e: '🫚', cat: 'spices', per: [1, 'tsp'], kw: 'substitute for allspice', role: 'Allspice tastes like cinnamon, nutmeg and clove together.', swaps: [
    { name: 'Cinnamon, nutmeg and cloves', parts: [[0.5, 'tsp', 'ground cinnamon'], [0.25, 'tsp', 'ground nutmeg'], [0.25, 'tsp', 'ground cloves']], fit: 3, best: 'Baking, jerk seasoning, stews', how: 'Mix before adding.', tags: ['vegan', 'gluten-free'] },
    { name: 'Pumpkin pie spice', parts: [[1, 'tsp', 'pumpkin pie spice']], fit: 2, best: 'Baking', how: 'Similar warm blend.', tags: ['vegan', 'gluten-free'] }
  ] },
  { id: 'nutmeg', name: 'Nutmeg', e: '🌰', cat: 'spices', per: [1, 'tsp'], kw: 'substitute for nutmeg', role: 'Nutmeg is warm and sweet, used in baking, custards and creamy sauces.', swaps: [
    { name: 'Mace', parts: [[1, 'tsp', 'ground mace']], fit: 3, best: 'Everything', how: 'Comes from the same fruit. Slightly more delicate.', tags: ['vegan', 'gluten-free'] },
    { name: 'Allspice', parts: [[1, 'tsp', 'ground allspice']], fit: 2, best: 'Baking', how: 'Warm with a clove note.', tags: ['vegan', 'gluten-free'] },
    { name: 'Pumpkin pie spice', parts: [[1, 'tsp', 'pumpkin pie spice']], fit: 2, best: 'Baking', how: 'Contains nutmeg plus cinnamon and ginger.', tags: ['vegan', 'gluten-free'] }
  ] },
  { id: 'cayenne', name: 'Cayenne pepper', e: '🌶️', cat: 'spices', per: [1, 'tsp'], kw: 'substitute for cayenne', role: 'Cayenne adds clean heat without much other flavor.', swaps: [
    { name: 'Red pepper flakes', parts: [[1, 'tsp', 'red pepper flakes, ground']], fit: 3, best: 'Sauces, rubs, soups', how: 'Grind them for even heat.', tags: ['vegan', 'gluten-free'] },
    { name: 'Hot sauce', parts: [[2, 'tsp', 'hot sauce']], fit: 2, best: 'Sauces, soups, marinades', how: 'Adds vinegar too. Start with less and taste.', tags: ['vegan', 'gluten-free'] },
    { name: 'Chili powder', parts: [[2, 'tsp', 'chili powder']], fit: 1, best: 'Chili, rubs', how: 'Milder and brings cumin and oregano with it.', tags: ['vegan', 'gluten-free'] }
  ] },
  { id: 'garlic', name: 'Garlic', e: '🧄', cat: 'spices', per: [1, 'clove'], unitName: ['clove', 'cloves'], kw: 'garlic powder instead of garlic', role: 'Fresh garlic adds pungent, sweet savoriness.', swaps: [
    { name: 'Garlic powder', parts: [[0.125, 'tsp', 'garlic powder']], fit: 2, best: 'Rubs, sauces, dressings', how: 'Add with the liquid so it doesn’t scorch.', tags: ['vegan', 'gluten-free'] },
    { name: 'Jarred minced garlic', parts: [[0.5, 'tsp', 'minced garlic from a jar']], fit: 3, best: 'Anything', how: 'Milder than fresh. Add a little extra if you like.', tags: ['vegan', 'gluten-free'] },
    { name: 'Granulated garlic', parts: [[0.25, 'tsp', 'granulated garlic']], fit: 2, best: 'Rubs, roasts', how: 'Coarser than powder.', tags: ['vegan', 'gluten-free'] }
  ] },
  { id: 'gruyere', name: 'Gruyère', e: '🧀', cat: 'cheese', per: [1, 'cup'], kw: 'substitute for gruyere cheese', role: 'Gruyère is nutty and melts smoothly, the classic for French onion soup and gratins.', swaps: [
    { name: 'Comté', parts: [[1, 'cup', 'Comté, grated']], fit: 3, best: 'Everything', how: 'Very close in flavor and melt.', tags: ['gluten-free'] },
    { name: 'Emmental or Swiss', parts: [[1, 'cup', 'Emmental or Swiss, grated']], fit: 3, best: 'Fondue, gratins, sandwiches', how: 'Milder but melts just as well.', tags: ['gluten-free'] },
    { name: 'Jarlsberg', parts: [[1, 'cup', 'Jarlsberg, grated']], fit: 2, best: 'Sandwiches, quiche', how: 'Sweeter and nuttier.', tags: ['gluten-free'] }
  ] },
  { id: 'parmesan', name: 'Parmesan', e: '🧀', cat: 'cheese', per: [1, 'cup'], kw: 'substitute for parmesan', role: 'Parmesan is salty, nutty and full of umami.', swaps: [
    { name: 'Grana Padano', parts: [[1, 'cup', 'Grana Padano, grated']], fit: 3, best: 'Everything', how: 'Milder and usually cheaper.', tags: ['gluten-free'] },
    { name: 'Pecorino Romano', parts: [[1, 'cup', 'Pecorino Romano, grated']], fit: 3, best: 'Pasta, salads', how: 'Saltier and sharper, so go easy on added salt.', tags: ['gluten-free'] },
    { name: 'Nutritional yeast', parts: [[0.5, 'cup', 'nutritional yeast']], fit: 1, best: 'Pasta, popcorn, vegan sauces', how: 'Cheesy and savory, not salty. Add salt to taste.', tags: ['vegan', 'dairy-free', 'gluten-free'] }
  ] },
  { id: 'cotija', name: 'Cotija', e: '🧀', cat: 'cheese', per: [1, 'cup'], kw: 'substitute for cotija', role: 'Cotija is a salty, crumbly Mexican cheese for tacos, elote and salads.', swaps: [
    { name: 'Feta', parts: [[1, 'cup', 'feta, crumbled']], fit: 3, best: 'Tacos, elote, salads', how: 'Tangier and creamier.', tags: ['gluten-free'] },
    { name: 'Queso fresco', parts: [[1, 'cup', 'queso fresco, crumbled']], fit: 2, best: 'Tacos, enchiladas', how: 'Milder and less salty. Add a pinch of salt.', tags: ['gluten-free'] },
    { name: 'Parmesan', parts: [[0.75, 'cup', 'Parmesan, finely grated']], fit: 2, best: 'Elote, beans', how: 'Saltier, so use a little less.', tags: ['gluten-free'] }
  ] },
  { id: 'ricotta', name: 'Ricotta', e: '🧀', cat: 'cheese', per: [1, 'cup'], kw: 'substitute for ricotta', role: 'Ricotta is soft, mild and creamy, used in lasagna, stuffed pasta and desserts.', swaps: [
    { name: 'Cottage cheese', parts: [[1, 'cup', 'cottage cheese, blended']], fit: 3, best: 'Lasagna, stuffed shells', how: 'Blend or press through a sieve for a smooth texture.', tags: ['gluten-free'] },
    { name: 'Mascarpone', parts: [[1, 'cup', 'mascarpone']], fit: 2, best: 'Desserts, pasta', how: 'Much richer.', tags: ['gluten-free'] },
    { name: 'Blended silken tofu', parts: [[1, 'cup', 'firm silken tofu'], [1, 'tbsp', 'lemon juice'], [0.25, 'tsp', 'salt']], fit: 1, best: 'Lasagna, stuffed shells', how: 'Blend until creamy.', tags: ['vegan', 'dairy-free', 'gluten-free'] }
  ] },
  { id: 'breadcrumbs', name: 'Breadcrumbs', e: '🍞', cat: 'pantry', per: [1, 'cup'], kw: 'substitute for breadcrumbs', role: 'Breadcrumbs bind meatballs and meatloaf and make crisp coatings and toppings.', swaps: [
    { name: 'Crushed crackers', parts: [[1, 'cup', 'crushed crackers']], fit: 3, best: 'Meatballs, coatings, toppings', how: 'Saltines or butter crackers work well. Cut salt slightly.', tags: ['vegan'] },
    { name: 'Rolled oats', parts: [[1, 'cup', 'rolled oats, pulsed']], fit: 2, best: 'Meatloaf, meatballs', how: 'Pulse a few times in a blender.', tags: ['vegan', 'gluten-free'] },
    { name: 'Crushed cornflakes', parts: [[1, 'cup', 'cornflakes, crushed']], fit: 2, best: 'Crispy coatings, casserole toppings', how: 'Extra crunchy.', tags: ['vegan'] }
  ] }
]
export const SUB = Object.fromEntries(SUBS.map((s) => [s.id, s]))

/* ---------- scaling a swap to the amount the cook needs ---------- */
import { UNITS, kitchenVolume, kitchenCount } from './core.js'
const VOL = { tsp: 1, tbsp: 1, cup: 1 }
export function baseLabel(sub, amount) {
  const [, u] = sub.per
  if (VOL[u]) return kitchenVolume(amount * UNITS[u].base)
  const [one, many] = sub.unitName || [u, u + 's']
  return `${kitchenCount(amount)} ${amount > 1 + 1e-9 ? many : one}`
}
export function swapParts(sub, swap, amount) {
  const k = amount / sub.per[0]
  return swap.parts.map(([q, u, what, fill]) => {
    const v = q * k
    let amt
    if (VOL[u]) amt = kitchenVolume(v * UNITS[u].base)
    else if (u === 'pinch' || u === 'dash') amt = `${kitchenCount(v)} ${u}${v > 1 + 1e-9 ? 'es' : ''}`
    else if (u === 'clove') amt = `${kitchenCount(v)} clove${v > 1 + 1e-9 ? 's' : ''}`
    else amt = kitchenCount(v)
    return fill ? { amt, what, fill: true, text: `${what} to make ${amt}` } : { amt, what, text: `${amt} ${what}` }
  })
}
export const FIT = { 3: 'Closest match', 2: 'Good swap', 1: 'In a pinch' }
export const TAGS = { vegan: 'Vegan', 'dairy-free': 'Dairy-free', 'egg-free': 'Egg-free', 'gluten-free': 'Gluten-free' }
export function titleKw(kw) {
  const small = new Set(['for', 'of', 'in', 'instead', 'and', 'a', 'to'])
  return kw.split(' ').map((w, i) => (i && small.has(w) ? w : w[0].toUpperCase() + w.slice(1))).join(' ').replace('Dairy Free', 'Dairy-Free').replace('Gruyere', 'Gruyère')
}
