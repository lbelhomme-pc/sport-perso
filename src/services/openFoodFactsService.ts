import { searchCommonFoods } from "../data/commonFoods";

export type FoodProduct = {
  code: string;
  name: string;
  brand?: string;
  quantity?: string;
  servingSize?: string;
  servingQuantity?: number;
  calories100g: number;
  protein100g: number;
  carbs100g: number;
  fat100g: number;
  origin: "common" | "openfoodfacts";
};

type OpenFoodFactsRawProduct = {
  code?: string;
  product_name?: string;
  product_name_fr?: string;
  brands?: string;
  quantity?: string;
  serving_size?: string;
  serving_quantity?: number | string;
  nutriments?: Record<string, number | string | undefined>;
};

type OpenFoodFactsSearchResponse = {
  products?: OpenFoodFactsRawProduct[];
};

const V2_SEARCH_URL = "https://world.openfoodfacts.org/api/v2/search";
const LEGACY_SEARCH_URL = "https://fr.openfoodfacts.org/cgi/search.pl";
const ENERGY_KJ_TO_KCAL = 0.23900573614;

function toNumber(value: number | string | undefined): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(",", "."));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, " ")
    .toLowerCase()
    .trim();
}

function getCalories100g(nutriments: Record<string, number | string | undefined>): number {
  const kcal = toNumber(nutriments["energy-kcal_100g"]);
  if (kcal > 0) return kcal;

  const energyKj = toNumber(nutriments.energy_100g);
  return energyKj > 0 ? energyKj * ENERGY_KJ_TO_KCAL : 0;
}

function normalizeProduct(product: OpenFoodFactsRawProduct): FoodProduct | null {
  const nutriments = product.nutriments ?? {};
  const name = product.product_name_fr || product.product_name;

  if (!product.code || !name) return null;

  return {
    code: product.code,
    name,
    brand: product.brands,
    quantity: product.quantity,
    servingSize: product.serving_size,
    servingQuantity: toNumber(product.serving_quantity),
    calories100g: Math.round(getCalories100g(nutriments) * 10) / 10,
    protein100g: Math.round(toNumber(nutriments.proteins_100g) * 10) / 10,
    carbs100g: Math.round(toNumber(nutriments.carbohydrates_100g) * 10) / 10,
    fat100g: Math.round(toNumber(nutriments.fat_100g) * 10) / 10,
    origin: "openfoodfacts"
  };
}

export function calculateFoodMacros(product: FoodProduct, quantityGrams: number) {
  const ratio = Math.max(0, quantityGrams) / 100;

  return {
    calories: Math.round(product.calories100g * ratio),
    protein: Math.round(product.protein100g * ratio * 10) / 10,
    carbs: Math.round(product.carbs100g * ratio * 10) / 10,
    fat: Math.round(product.fat100g * ratio * 10) / 10
  };
}

function uniqueProducts(products: FoodProduct[]): FoodProduct[] {
  const seen = new Set<string>();
  return products.filter((product) => {
    if (seen.has(product.code)) return false;
    seen.add(product.code);
    return true;
  });
}

function normalizeProducts(products: OpenFoodFactsRawProduct[] | undefined): FoodProduct[] {
  return (products ?? [])
    .map(normalizeProduct)
    .filter((product): product is FoodProduct => Boolean(product))
    .filter((product) => product.calories100g > 0 || product.protein100g > 0 || product.carbs100g > 0 || product.fat100g > 0);
}

function getSearchTokens(query: string): string[] {
  const ignored = new Set(["de", "du", "des", "la", "le", "les", "un", "une", "et", "a", "au", "aux"]);
  return normalizeText(query)
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !ignored.has(token));
}

function getQueryVariants(query: string): string[] {
  const normalized = normalizeText(query);
  const variants = [query, normalized];

  if (normalized.endsWith("e") && !normalized.endsWith("ee")) {
    variants.push(`${normalized}e`);
  }

  if (normalized.includes("poele")) {
    variants.push("poelee", "poelee legumes", "poelee de legumes");
  }

  if (normalized.includes("hipro") || normalized.includes("hi pro")) {
    variants.push("hipro", "hi pro", "hi-pro", "high protein", "danone hipro", "danone hi pro");
  }

  return [...new Set(variants.map((item) => item.trim()).filter(Boolean))];
}

function getProductScore(product: FoodProduct, query: string): number {
  const normalizedQuery = normalizeText(query);
  const tokens = getSearchTokens(query);
  const name = normalizeText(product.name);
  const brand = normalizeText(product.brand ?? "");
  const haystack = `${brand} ${name}`.trim();

  if (!tokens.length) return 1;

  let score = 0;
  let matchedTokens = 0;

  if (brand.includes(normalizedQuery)) score += 120;
  if (name.includes(normalizedQuery)) score += 90;
  if (haystack.includes(normalizedQuery)) score += 70;

  for (const token of tokens) {
    const inBrand = brand.includes(token);
    const inName = name.includes(token);
    if (inBrand || inName) matchedTokens += 1;
    if (inBrand) score += 35;
    if (inName) score += 22;
    if (brand.startsWith(token)) score += 12;
    if (name.startsWith(token)) score += 10;
  }

  if (tokens.length > 1 && matchedTokens === 0) return 0;
  if (tokens.length > 1 && matchedTokens < Math.ceil(tokens.length / 2)) return 0;

  return score;
}

function rankProducts(products: FoodProduct[], query: string): FoodProduct[] {
  return products
    .map((product, index) => ({ product, index, score: getProductScore(product, query) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((item) => item.product);
}

function buildSearchUrls(query: string): string[] {
  const fields = "code,product_name,product_name_fr,brands,quantity,serving_size,serving_quantity,nutriments";
  const v2Params = new URLSearchParams({
    search_terms: query,
    page_size: "50",
    lc: "fr",
    sort_by: "popularity_key",
    fields
  });
  const legacyParams = new URLSearchParams({
    search_terms: query,
    search_simple: "1",
    action: "process",
    json: "1",
    page_size: "50",
    lc: "fr",
    fields
  });

  return [`${V2_SEARCH_URL}?${v2Params.toString()}`, `${LEGACY_SEARCH_URL}?${legacyParams.toString()}`];
}

async function fetchOpenFoodFactsProducts(query: string): Promise<FoodProduct[]> {
  const allProducts: FoodProduct[] = [];

  for (const variant of getQueryVariants(query)) {
    for (const url of buildSearchUrls(variant)) {
      try {
        const response = await fetch(url, {
          headers: {
            Accept: "application/json"
          }
        });

        if (!response.ok) continue;

        const data = (await response.json()) as OpenFoodFactsSearchResponse;
        allProducts.push(...normalizeProducts(data.products));
      } catch {
        // Try the next endpoint. The local favorite/common list still works without network.
      }
    }
  }

  return rankProducts(uniqueProducts(allProducts), query).slice(0, 35);
}

export async function searchOpenFoodFacts(query: string): Promise<FoodProduct[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const commonFoods = searchCommonFoods(trimmed);
  const openFoodFactsProducts = await fetchOpenFoodFactsProducts(trimmed);

  return uniqueProducts([...commonFoods, ...openFoodFactsProducts]);
}
