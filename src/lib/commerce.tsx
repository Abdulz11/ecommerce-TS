import Commerce from "@chec/commerce.js";


const COMMERCE_PUB_KEY = import.meta.env.VITE_COMMERCEJS_PUB_KEY
 
export const commerce = new Commerce(COMMERCE_PUB_KEY, true);
