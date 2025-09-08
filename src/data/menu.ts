export interface MenuCategory {
  id: string;
  name: string;
  gujaratiName: string;
}

export const menuCategories: MenuCategory[] = [
  { id: 'welcome-drinks', name: 'Welcome Drinks', gujaratiName: 'સ્વાગત પીણાં' },
  { id: 'milk-shakes', name: 'Milk Shake', gujaratiName: 'મિલ્કશેક' },
  { id: 'lassi', name: 'Lasshi', gujaratiName: 'લસ્સી' },
  { id: 'morning-special', name: 'Morning Special', gujaratiName: 'સવારનું વિશેષ' },
  { id: 'raita', name: 'Raita', gujaratiName: 'રાયતા' },
  { id: 'gujarati-chat-1', name: 'Gujarati Chat (Part 1)', gujaratiName: 'ગુજરાતી ચાટ (ભાગ 1)' },
  { id: 'gujarati-chat-2', name: 'Gujarati Chat (Part 2)', gujaratiName: 'ગુજરાતી ચાટ (ભાગ 2)' },
  { id: 'salad', name: 'Salad', gujaratiName: 'સલાડ' },
  { id: 'sweets', name: 'Sweets', gujaratiName: 'મીઠાઈ' },
  { id: 'papad', name: 'Papad', gujaratiName: 'પાપડ' },
  { id: 'gujarati-sabji', name: 'Gujarati Sabji', gujaratiName: 'ગુજરાતી સબ્જી' },
  { id: 'kathiyavadi', name: 'Kathiyavadi', gujaratiName: 'કાઠિયાવાડી' },
  { id: 'sp-govardhan', name: 'Sp. Govardhan', gujaratiName: 'સ્પેશિયલ ગોવર્ધન' },
  { id: 'punjabi', name: 'Panjabi', gujaratiName: 'પંજાબી' },
  { id: 'rice', name: 'Rice', gujaratiName: 'રાઇસ' },
  { id: 'dal-kadhi', name: 'Dal - Kadthi', gujaratiName: 'દાળ - કઢી' },
  { id: 'roti', name: 'Roti', gujaratiName: 'રોટી' },
  { id: 'thali', name: 'Thali', gujaratiName: 'થાળી' },
];

export const menuItems = [
  // Welcome Drinks
  {
    id: 'pineapple-juice',
    name: { english: 'Pineapple', gujarati: 'પાઇનેપલ' },
    price: 5,
    category: 'welcome-drinks',
    description: 'Freshly squeezed pineapple juice, sweet and tangy'
  },
  {
    id: 'guava-juice',
    name: { english: 'Guava', gujarati: 'જામફળ' },
    price: 5,
    category: 'welcome-drinks',
    description: 'Refreshing guava juice with a tropical flavor'
  },
  {
    id: 'strawberry-juice',
    name: { english: 'Strawberry', gujarati: 'સ્ટ્રોબેરી' },
    price: 5,
    category: 'welcome-drinks',
    description: 'Sweet strawberry juice made from fresh berries'
  },
  {
    id: 'orange-juice',
    name: { english: 'Orange', gujarati: 'ઓરંજ' },
    price: 5,
    category: 'welcome-drinks',
    description: 'Freshly squeezed orange juice, rich in vitamin C'
  },
  
  // Milk Shakes
  {
    id: 'badam-shake',
    name: { english: 'Badam Shake', gujarati: 'બદામ શેક' },
    price: 5,
    category: 'milk-shakes',
    description: 'Creamy almond milkshake with the goodness of nuts'
  },
  {
    id: 'vanilla-shake',
    name: { english: 'Vanilla Shake', gujarati: 'વેનીલા શેક' },
    price: 5,
    category: 'milk-shakes',
    description: 'Classic vanilla milkshake with a smooth, creamy texture'
  },
  {
    id: 'strawberry-shake',
    name: { english: 'Strawberry Shake', gujarati: 'સ્ટ્રોબેરી શેક' },
    price: 5,
    category: 'milk-shakes',
    description: 'Delicious strawberry milkshake with fresh strawberries'
  },
  {
    id: 'chocochips-shake',
    name: { english: 'Chocochips Shake', gujarati: 'ચોકોચિપ્સ શેક' },
    price: 7,
    category: 'milk-shakes',
    description: 'Chocolate chip milkshake with rich chocolate flavor'
  },
  {
    id: 'oreo-shake',
    name: { english: 'Oreo Shake', gujarati: 'ઓરિયો શેક' },
    price: 7,
    category: 'milk-shakes',
    description: 'Creamy milkshake with crushed Oreo cookies'
  },
  {
    id: 'mango-shake',
    name: { english: 'Mango Shake', gujarati: 'મેંગો શેક' },
    price: 7,
    category: 'milk-shakes',
    description: 'Sweet mango milkshake made with fresh mango pulp'
  },
  {
    id: 'kitkat-shake',
    name: { english: 'Kit-kat Shake', gujarati: 'કિટકેટ શેક' },
    price: 7,
    category: 'milk-shakes',
    description: 'Delicious milkshake with Kit-Kat chocolate bars'
  },
  {
    id: 'dry-fruits-shake',
    name: { english: 'Dry Fruits Shake', gujarati: 'ડ્રાયફ્રુટ્સ શેક' },
    price: 10,
    category: 'milk-shakes',
    description: 'Nutritious milkshake with assorted dry fruits'
  },
  {
    id: 'khajur-anjeer-shake',
    name: { english: 'Khajur Anjeer Shake', gujarati: 'ખજૂર અંજીર શેક' },
    price: 10,
    category: 'milk-shakes',
    description: 'Healthy milkshake with dates and figs'
  },
  {
    id: 'kaju-anjeer-shake',
    name: { english: 'Kaju Anjeer Shake', gujarati: 'કાજુ અંજીર શેક' },
    price: 10,
    category: 'milk-shakes',
    description: 'Rich milkshake with cashews and figs'
  },
  
  // Lassi
  {
    id: 'plain-lassi',
    name: { english: 'Plain Lasshi', gujarati: 'પ્લેન લસ્સી' },
    price: 5,
    category: 'lassi',
    description: 'Traditional sweet yogurt drink'
  },
  {
    id: 'mava-lassi',
    name: { english: 'Mava Lasshi', gujarati: 'માવા લસ્સી' },
    price: 5,
    category: 'lassi',
    description: 'Creamy lassi with mava (khoya)'
  },
  {
    id: 'kaju-lassi',
    name: { english: 'Kaju Lasshi', gujarati: 'કાજુ લસ્સી' },
    price: 6,
    category: 'lassi',
    description: 'Rich lassi with cashew nuts'
  },
  {
    id: 'kesar-lassi',
    name: { english: 'Kesar Lasshi', gujarati: 'કેસર લસ્સી' },
    price: 6,
    category: 'lassi',
    description: 'Saffron-infused sweet lassi'
  },
  {
    id: 'rajwadi-lassi',
    name: { english: 'Rajwadi Lasshi', gujarati: 'રાજવાડી લસ્સી' },
    price: 7,
    category: 'lassi',
    description: 'Royal style lassi with dry fruits'
  },
  {
    id: 'sp-govardhan-lassi',
    name: { english: 'Sp. Govardhan Lasshi', gujarati: 'સ્પે. ગોવર્ધન લસ્સી' },
    price: 9,
    category: 'lassi',
    description: 'Special Govardhan style lassi with premium ingredients'
  },
  
  // Morning Special
  {
    id: 'tea',
    name: { english: 'Tea', gujarati: 'ચા' },
    price: 2,
    category: 'morning-special',
    description: 'Hot Indian tea'
  },
  {
    id: 'masala-tea',
    name: { english: 'Masala Tea', gujarati: 'મસાલા ચા' },
    price: 2.5,
    category: 'morning-special',
    description: 'Spiced Indian tea with aromatic spices'
  },
  {
    id: 'coffee',
    name: { english: 'Coffee', gujarati: 'કૉફી' },
    price: 3,
    category: 'morning-special',
    description: 'Hot brewed coffee'
  },
  {
    id: 'cold-milk',
    name: { english: 'Cold Milk', gujarati: 'કોલ્ડ મિલ્ક' },
    price: 3,
    category: 'morning-special',
    description: 'Chilled milk'
  },
  {
    id: 'hot-milk',
    name: { english: 'Hot Milk', gujarati: 'હોટ મિલ્ક' },
    price: 3,
    category: 'morning-special',
    description: 'Warm milk'
  },
  
  // Raita
  {
    id: 'bundi-raita',
    name: { english: 'Bundi Raita', gujarati: 'બુંદી રાયતું' },
    price: 5,
    category: 'raita',
    description: 'Yogurt with small fried gram flour balls'
  },
  {
    id: 'veg-raita',
    name: { english: 'Veg Raita', gujarati: 'વેજ. રાયતું' },
    price: 4,
    category: 'raita',
    description: 'Yogurt with mixed vegetables'
  },
  {
    id: 'sweet-raita',
    name: { english: 'Sweet Raita', gujarati: 'સ્વીટ રાયતું' },
    price: 5,
    category: 'raita',
    description: 'Sweetened yogurt with fruits'
  },
  {
    id: 'mix-fruit-raita',
    name: { english: 'Mix Fruit Raita', gujarati: 'મિક્સ ફ્રુટ રાયતું' },
    price: 5,
    category: 'raita',
    description: 'Yogurt with assorted fruits'
  },
  {
    id: 'dry-fruits-raita',
    name: { english: 'Dry-fruits Raita', gujarati: 'ડ્રાયફ્રુટ રાયતું' },
    price: 7,
    category: 'raita',
    description: 'Yogurt with dry fruits'
  },
  
  // Gujarati Chat (Part 1)
  {
    id: 'fafada',
    name: { english: 'Fafada', gujarati: 'ફાફડા' },
    price: 5,
    category: 'gujarati-chat-1',
    description: 'Crispy gram flour snacks'
  },
  {
    id: 'vanela-gathiya',
    name: { english: 'Vanela Gathiya', gujarati: 'વણેલા ગાંઠિયા' },
    price: 5,
    category: 'gujarati-chat-1',
    description: 'Fried gram flour strips'
  },
  {
    id: 'dhokala',
    name: { english: 'Dhokala', gujarati: 'ઢોકલા' },
    price: 5,
    category: 'gujarati-chat-1',
    description: 'Steamed fermented gram flour cake'
  },
  {
    id: 'methi-gota',
    name: { english: 'Methi Gota', gujarati: 'મેથી ગોટા' },
    price: 5,
    category: 'gujarati-chat-1',
    description: 'Fenugreek fritters'
  },
  {
    id: 'mirchi-vada',
    name: { english: 'Mirchi Vada', gujarati: 'મીરચી વડા' },
    price: 5,
    category: 'gujarati-chat-1',
    description: 'Stuffed chili fritters'
  },
  {
    id: 'khaman',
    name: { english: 'Khaman', gujarati: 'ખમણ' },
    price: 5,
    category: 'gujarati-chat-1',
    description: 'Soft steamed gram flour snack'
  },
  {
    id: 'dalvada',
    name: { english: 'Dalvada', gujarati: 'દાળવડા' },
    price: 5,
    category: 'gujarati-chat-1',
    description: 'Lentil fritters'
  },
  {
    id: 'mix-bajiya',
    name: { english: 'Mix Bajiya', gujarati: 'મિક્સ ભજીયા' },
    price: 5,
    category: 'gujarati-chat-1',
    description: 'Assorted vegetable fritters'
  },
  {
    id: 'batata-vada',
    name: { english: 'Batata Vada', gujarati: 'બટાટા વડા' },
    price: 5,
    category: 'gujarati-chat-1',
    description: 'Potato stuffed fritters'
  },
  {
    id: 'tikadi',
    name: { english: 'Tikadi', gujarati: 'ટીકડી' },
    price: 5,
    category: 'gujarati-chat-1',
    description: 'Crispy fried snacks'
  },
  {
    id: 'upma',
    name: { english: 'Upma', gujarati: 'ઉપમા' },
    price: 5,
    category: 'gujarati-chat-1',
    description: 'Savory semolina dish'
  },
  {
    id: 'batata-pouha',
    name: { english: 'Batata Pouha', gujarati: 'બટાટા પોઆ' },
    price: 5,
    category: 'gujarati-chat-1',
    description: 'Flattened rice with potatoes'
  },
  {
    id: 'khakhara',
    name: { english: 'Khakhara', gujarati: 'ખાખરા' },
    price: 5,
    category: 'gujarati-chat-1',
    description: 'Thin, crispy crackers'
  },
  {
    id: 'fulvadi',
    name: { english: 'Fulvadi', gujarati: 'ફૂલવડી' },
    price: 5,
    category: 'gujarati-chat-1',
    description: 'Crispy flower-shaped snacks'
  },
  {
    id: 'methi-puri',
    name: { english: 'Methi Puri', gujarati: 'મેથી પુરી' },
    price: 5,
    category: 'gujarati-chat-1',
    description: 'Fenugreek flavored puris'
  },
  {
    id: 'masala-puri',
    name: { english: 'Masala Puri', gujarati: 'મસાલા પુરી' },
    price: 5,
    category: 'gujarati-chat-1',
    description: 'Spiced puris'
  },
  {
    id: 'aaloo-puri',
    name: { english: 'Aaloo Puri', gujarati: 'આલુ પુરી' },
    price: 5,
    category: 'gujarati-chat-1',
    description: 'Puris served with potato curry'
  },
  {
    id: 'thepala',
    name: { english: 'Thepala', gujarati: 'થેપલા' },
    price: 5,
    category: 'gujarati-chat-1',
    description: 'Spiced flatbread'
  },
  
  // Gujarati Chat (Part 2)
  {
    id: 'chhole-puri',
    name: { english: 'Chhole Puri', gujarati: ' છોલે પુરી' },
    price: 5,
    category: 'gujarati-chat-2',
    description: 'Chickpea curry with puri'
  },
  {
    id: 'aalu-puri',
    name: { english: 'Aalu Puri', gujarati: 'આલુ પુરી' },
    price: 5,
    category: 'gujarati-chat-2',
    description: 'Potato curry with puri'
  },
  {
    id: 'navtar-samosa',
    name: { english: 'Navtar Samosa', gujarati: 'નવતર સમોસા' },
    price: 5,
    category: 'gujarati-chat-2',
    description: 'Nine-ingredient stuffed samosa'
  },
  {
    id: 'punjabi-samosa',
    name: { english: 'Punjabi Samosa', gujarati: 'પંજાબી સમોસા' },
    price: 5,
    category: 'gujarati-chat-2',
    description: 'North Indian style samosa'
  },
  {
    id: 'samosa',
    name: { english: 'Samosa', gujarati: 'સમોસા' },
    price: 5,
    category: 'gujarati-chat-2',
    description: 'Triangular fried pastry with savory filling'
  },
  {
    id: 'kachori',
    name: { english: 'Kachori', gujarati: 'કચોરી' },
    price: 5,
    category: 'gujarati-chat-2',
    description: 'Round fried bread with filling'
  },
  {
    id: 'lilva-kachori',
    name: { english: 'Lilva Kachori', gujarati: 'લીલવા કચોરી' },
    price: 5,
    category: 'gujarati-chat-2',
    description: 'Kachori stuffed with green peas'
  },
  {
    id: 'katlesh',
    name: { english: 'Katlesh', gujarati: 'કટલેશ' },
    price: 5,
    category: 'gujarati-chat-2',
    description: 'Crispy fried snack'
  },
  {
    id: 'sev-roll',
    name: { english: 'Sev Roll', gujarati: 'સેવ રોલ' },
    price: 5,
    category: 'gujarati-chat-2',
    description: 'Roll filled with sev and chutneys'
  },
  {
    id: 'papadi-chat',
    name: { english: 'Papadi Chat', gujarati: 'પાપડી ચાટ' },
    price: 5,
    category: 'gujarati-chat-2',
    description: 'Crispy wafers with toppings'
  },
  {
    id: 'delhi-chat',
    name: { english: 'Delhi Chat', gujarati: 'દિલ્હી ચાટ' },
    price: 5,
    category: 'gujarati-chat-2',
    description: 'Delhi-style street food'
  },
  {
    id: 'ragada-chat',
    name: { english: 'Ragada Chat', gujarati: 'રગડા ચાટ' },
    price: 5,
    category: 'gujarati-chat-2',
    description: 'White peas curry with toppings'
  },
  {
    id: 'tikki-chat',
    name: { english: 'Tikki Chat', gujarati: 'ટિક્કી ચાટ' },
    price: 5,
    category: 'gujarati-chat-2',
    description: 'Potato patties with chutneys'
  },
  {
    id: 'sev-puri',
    name: { english: 'Sev Puri', gujarati: 'સેવ પુરી' },
    price: 5,
    category: 'gujarati-chat-2',
    description: 'Crispy puris with toppings and sev'
  },
  {
    id: 'pani-puri',
    name: { english: 'Pani Puri', gujarati: 'પાણી પુરી' },
    price: 5,
    category: 'gujarati-chat-2',
    description: 'Hollow puris filled with flavored water'
  },
  
  // Salad
  {
    id: 'khira-salad',
    name: { english: 'Khira Salad', gujarati: 'ખીરો સलાડ' },
    price: 3,
    category: 'salad',
    description: 'Cucumber salad'
  },
  {
    id: 'green-salad',
    name: { english: 'Green Salad', gujarati: 'ગ્રીન સલાડ' },
    price: 3,
    category: 'salad',
    description: 'Fresh green vegetable salad'
  },
  {
    id: 'tomato-salad',
    name: { english: 'Tomato Salad', gujarati: 'ટમેટા સલાડ' },
    price: 3,
    category: 'salad',
    description: 'Tomato salad with herbs'
  },
  {
    id: 'peanut-salad',
    name: { english: 'Peanut Salad', gujarati: 'સિંગ સલાડ' },
    price: 3,
    category: 'salad',
    description: 'Salad with peanuts'
  },
  
  // Sweets (per 100g)
  {
    id: 'unjha-ladu',
    name: { english: 'Unjha\'s Ladu', gujarati: 'ઊંઝા લાડુ' },
    price: 4,
    category: 'sweets',
    description: 'Gram flour sweet balls from Unjha'
  },
  {
    id: 'bundi-ladu',
    name: { english: 'Bundi Ladu', gujarati: 'બુંદી લાડુ' },
    price: 4,
    category: 'sweets',
    description: 'Sweet balls made from tiny gram flour droplets'
  },
  {
    id: 'motichur-ladu',
    name: { english: 'Motichur Ladu', gujarati: 'મોતીચુર લાડુ' },
    price: 4,
    category: 'sweets',
    description: 'Fine gram flour sweet balls'
  },
  {
    id: 'magdal-ladu',
    name: { english: 'Magdal Ladu', gujarati: 'મુંગલાદ લાડુ' },
    price: 4,
    category: 'sweets',
    description: 'Sweet balls made from mung dal'
  },
  {
    id: 'mohanthal',
    name: { english: 'Mohanthal', gujarati: 'મોહનથાળ' },
    price: 4,
    category: 'sweets',
    description: 'Gram flour fudge with nuts'
  },
  {
    id: 'magaj',
    name: { english: 'Magaj', gujarati: 'મગજ' },
    price: 4,
    category: 'sweets',
    description: 'Chickpea flour sweet'
  },
  {
    id: 'jalebi',
    name: { english: 'Jalebi', gujarati: ' જલેબી' },
    price: 4,
    category: 'sweets',
    description: 'Crispy swirls soaked in sugar syrup'
  },
  {
    id: 'gulab-jamun',
    name: { english: 'Gulab Jamun', gujarati: 'ગુલાબજામુન' },
    price: 4,
    category: 'sweets',
    description: 'Milk solids balls in sugar syrup'
  },
  {
    id: 'kala-jam',
    name: { english: 'Kala Jam', gujarati: 'કાલાજમ' },
    price: 4,
    category: 'sweets',
    description: 'Dark colored gulab jamun'
  },
  {
    id: 'maha-prasad',
    name: { english: 'Maha Prasad', gujarati: 'મહા પ્રસાદ' },
    price: 4,
    category: 'sweets',
    description: 'Special temple-style sweet offering'
  },
  {
    id: 'gajar-halvo',
    name: { english: 'Gajar Halvo', gujarati: 'ગાજર હલવો' },
    price: 4,
    category: 'sweets',
    description: 'Carrot pudding with nuts'
  },
  
  // Papad
  {
    id: 'dry-papad',
    name: { english: 'Dry Papad', gujarati: 'ડ્રાય પાપડ' },
    price: 2,
    category: 'papad',
    description: 'Uncooked papad'
  },
  {
    id: 'fried-papad',
    name: { english: 'Fried Papad', gujarati: 'ફ્રાય પાપડ' },
    price: 2,
    category: 'papad',
    description: 'Fried crispy papad'
  },
  {
    id: 'masala-papad',
    name: { english: 'Masala Papad', gujarati: 'મસાલા પાપડ' },
    price: 3,
    category: 'papad',
    description: 'Papad topped with spices and vegetables'
  },
  
  // Gujarati Sabji
  {
    id: 'undhiyu',
    name: { english: 'Undhiyu', gujarati: 'ઉંધિયું' },
    price: 7,
    category: 'gujarati-sabji',
    description: 'A traditional Gujarati mixed vegetable dish, typically prepared in earthen pots'
  },
  {
    id: 'potato-onion',
    name: { english: 'Potato, Onion', gujarati: 'બટાટા, ડુંગળી' },
    price: 7,
    category: 'gujarati-sabji',
    description: 'Classic combination of potatoes and onions cooked with Indian spices'
  },
  {
    id: 'potato-matar-tomato',
    name: { english: 'Potato, Matar, Tomato', gujarati: 'બટાટા, વટાણા, ટામેટા' },
    price: 7,
    category: 'gujarati-sabji',
    description: 'Potatoes, peas and tomatoes cooked with spices'
  },
  {
    id: 'mix-veg',
    name: { english: 'Mix Veg', gujarati: 'મિક્સ વેજ' },
    price: 7,
    category: 'gujarati-sabji',
    description: 'Assorted vegetables cooked together'
  },
  {
    id: 'ravaiya-bharela',
    name: { english: 'Ravaiya Bharela', gujarati: 'રવૈયા ભરેલા' },
    price: 7,
    category: 'gujarati-sabji',
    description: 'Stuffed eggplants'
  },
  {
    id: 'bhindi-masala',
    name: { english: 'Bhindi Masala', gujarati: 'ભીંડા મસાલા' },
    price: 7,
    category: 'gujarati-sabji',
    description: 'Okra cooked with spices'
  },
  {
    id: 'aalu-kobij',
    name: { english: 'Aalu Kobij', gujarati: 'આલુ કોબીજ' },
    price: 7,
    category: 'gujarati-sabji',
    description: 'Potatoes with cabbage'
  },
  {
    id: 'aalu-bhaji',
    name: { english: 'Aalu Bhaji', gujarati: 'આલુ ભાજી' },
    price: 7,
    category: 'gujarati-sabji',
    description: 'Spiced potato curry'
  },
  {
    id: 'jeera-aalu',
    name: { english: 'Jeera Aalu', gujarati: ' જીરા આલુ' },
    price: 7,
    category: 'gujarati-sabji',
    description: 'Cumin flavored potatoes'
  },
  {
    id: 'mag-masala',
    name: { english: 'Mag Masala', gujarati: 'મગ મસાલા' },
    price: 7,
    category: 'gujarati-sabji',
    description: 'Spiced mung bean curry'
  },
  {
    id: 'deshi-chana',
    name: { english: 'Deshi Chana', gujarati: 'દેશી ચણા' },
    price: 7,
    category: 'gujarati-sabji',
    description: 'Bengal gram curry'
  },
  {
    id: 'rajma',
    name: { english: 'Rajma', gujarati: 'રાજમા' },
    price: 7,
    category: 'gujarati-sabji',
    description: 'Kidney bean curry'
  },
  {
    id: 'tuver',
    name: { english: 'Tuver', gujarati: 'તુવેર' },
    price: 7,
    category: 'gujarati-sabji',
    description: 'Pigeon pea curry'
  },
  
  // Kathiyavadi
  {
    id: 'sev-tomato',
    name: { english: 'Sev tomato', gujarati: 'સેવ ટમેટા' },
    price: 7,
    category: 'kathiyavadi',
    description: 'Tomato curry with crispy sev'
  },
  {
    id: 'sev-onion',
    name: { english: 'Sev onion', gujarati: 'સેવ ડુંગળી' },
    price: 7,
    category: 'kathiyavadi',
    description: 'Onion curry with crispy sev'
  },
  {
    id: 'kaju-ganthiya',
    name: { english: 'Kaju ganthiya', gujarati: 'કાજુ ગાંઠિયા' },
    price: 7,
    category: 'kathiyavadi',
    description: 'Cashew flavored gram flour snacks'
  },
  {
    id: 'papat-ganthiya',
    name: { english: 'Papat ganthiya', gujarati: 'પાપડ ગાંઠિયા' },
    price: 7,
    category: 'kathiyavadi',
    description: 'Papad flavored gram flour snacks'
  },
  {
    id: 'dahi-fry',
    name: { english: 'Dahi fry', gujarati: 'દહીં ફ્રાય' },
    price: 5,
    category: 'kathiyavadi',
    description: 'Fried yogurt curry'
  },
  {
    id: 'lasaniya-bateta',
    name: { english: 'Lasaniya bateta', gujarati: 'લસણિયા બટાટા' },
    price: 7,
    category: 'kathiyavadi',
    description: 'Garlic flavored potatoes'
  },
  {
    id: 'dahi-bhindi',
    name: { english: 'Dahi bhindi', gujarati: 'દહીં ભીંડિ' },
    price: 7,
    category: 'kathiyavadi',
    description: 'Okra in yogurt sauce'
  },
  {
    id: 'tuver-thotha',
    name: { english: 'Tuver thotha', gujarati: 'તુવેર ઠોઠા' },
    price: 7,
    category: 'kathiyavadi',
    description: 'Pigeon pea curry with dried mango'
  },
  {
    id: 'ringan',
    name: { english: 'Ringan', gujarati: 'રીંગણ' },
    price: 7,
    category: 'kathiyavadi',
    description: 'Eggplant curry'
  },
  {
    id: 'mix-kathod',
    name: { english: 'Mix kathod', gujarati: 'મિક્સ કઠોળ' },
    price: 7,
    category: 'kathiyavadi',
    description: 'Mixed lentils curry'
  },
    // Sp. Govardhan
  {
    id: 'vagharelo-rotao',
    name: { english: 'Vagharelo Rotalo', gujarati: 'વડગેરેલો રોટલો' },
    price: 10,
    category: 'sp-govardhan',
    description: 'Tempered millet bread with spices'
  },
  {
    id: 'vaghareli-rotali',
    name: { english: 'Vaghareli Rotali', gujarati: 'વડગેરેલી રોટલી' },
    price: 10,
    category: 'sp-govardhan',
    description: 'Tempered wheat bread with spices'
  },
  {
    id: 'vaghareli-khichadi',
    name: { english: 'Vaghareli Khichadi', gujarati: 'વડગેરેલી ખીચડી' },
    price: 10,
    category: 'sp-govardhan',
    description: 'Tempered rice and lentil dish with spices'
  },

  // Panjabi
  {
    id: 'paneer-butter-masala',
    name: { english: 'Paneer Butter Masala', gujarati: 'પનીર બટર મસાલા' },
    price: 7,
    category: 'punjabi',
    description: 'Cottage cheese in rich tomato and butter gravy'
  },
  {
    id: 'paneer-angara',
    name: { english: 'Paneer Angara', gujarati: 'પનીર અંગારા' },
    price: 7,
    category: 'punjabi',
    description: 'Smoky grilled cottage cheese in spicy gravy'
  },
  {
    id: 'paneer-kadai',
    name: { english: 'Paneer Kadai', gujarati: 'પનીર કડાઈ' },
    price: 7,
    category: 'punjabi',
    description: 'Cottage cheese cooked in kadai with bell peppers'
  },
  {
    id: 'paneer-bhurji',
    name: { english: 'Paneer Bhurji', gujarati: 'પનીર ભુરજી' },
    price: 7,
    category: 'punjabi',
    description: 'Scrambled cottage cheese with spices'
  },
  {
    id: 'paneer-tikka-masala',
    name: { english: 'Paneer Tikka Masala', gujarati: 'પનીર ટિક્કા મસાલા' },
    price: 7,
    category: 'punjabi',
    description: 'Grilled cottage cheese chunks in creamy gravy'
  },
  {
    id: 'sahi-paneer',
    name: { english: 'Sahi Paneer', gujarati: 'શાહી પનીર' },
    price: 7,
    category: 'punjabi',
    description: 'Rich Mughlai style cottage cheese in creamy gravy'
  },
  {
    id: 'paneer-lavabdar',
    name: { english: 'Paneer Lavabdar', gujarati: 'પનીર લવાબદાર' },
    price: 7,
    category: 'punjabi',
    description: 'Cottage cheese in rich, creamy tomato gravy'
  },
  {
    id: 'paneer-chatpata',
    name: { english: 'Paneer Chatpata', gujarati: 'પનીર ચટપટા' },
    price: 7,
    category: 'punjabi',
    description: 'Tangy and spicy cottage cheese preparation'
  },
  {
    id: 'veg-kadai',
    name: { english: 'Veg Kadai', gujarati: 'વેજ. કડાઈ' },
    price: 7,
    category: 'punjabi',
    description: 'Mixed vegetables cooked in kadai style'
  },
  {
    id: 'kaju-kari',
    name: { english: 'Kaju Kari', gujarati: 'કાજુકરી' },
    price: 7,
    category: 'punjabi',
    description: 'Cashew nuts in rich gravy'
  },
  {
    id: 'veg-korma',
    name: { english: 'Veg Korma', gujarati: 'વેજ. કોરમા' },
    price: 7,
    category: 'punjabi',
    description: 'Vegetables in mild, creamy nut-based gravy'
  },

  // Rice
  {
    id: 'plain-rice',
    name: { english: 'Plin Rice', gujarati: 'પ્લેન રાઈસ' },
    price: 3,
    category: 'rice',
    description: 'Steamed basmati rice'
  },
  {
    id: 'jeera-rice',
    name: { english: 'Jeera Rice', gujarati: ' જીરા રાઈસ' },
    price: 5,
    category: 'rice',
    description: 'Cumin flavored rice'
  },
  {
    id: 'yellow-veg-rice',
    name: { english: 'Yellow Veg Rice', gujarati: 'યેલો વેજ. રાઈસ' },
    price: 5,
    category: 'rice',
    description: 'Turmeric flavored vegetable rice'
  },
  {
    id: 'veg-pulav',
    name: { english: 'Veg Pulav', gujarati: 'વેજ. પુલાવ' },
    price: 6,
    category: 'rice',
    description: 'Vegetable pilaf with spices'
  },
  {
    id: 'khichadi',
    name: { english: 'Khichadi', gujarati: 'ખીચડી' },
    price: 4,
    category: 'rice',
    description: 'Rice and lentil comfort dish'
  },
  {
    id: 'vagharel-khichadi',
    name: { english: 'Vagharel Khichadi', gujarati: 'વડગેરેલી ખીચડી' },
    price: 6,
    category: 'rice',
    description: 'Tempered khichadi with spices'
  },
  {
    id: 'rajvadi-khichadi',
    name: { english: 'Rajvadi Khichadi', gujarati: 'રાજવાડી ખીચડી' },
    price: 8,
    category: 'rice',
    description: 'Royal style khichadi with dry fruits'
  },

  // Dal - Kadhi
  {
    id: 'gujarati-dal',
    name: { english: 'Gujarati Dal', gujarati: 'ગુજરાતી દાલ' },
    price: 5,
    category: 'dal-kadhi',
    description: 'Sweet and tangy Gujarati style lentil'
  },
  {
    id: 'dal-fry',
    name: { english: 'Dal Fry', gujarati: 'દાલ ફ્રાય' },
    price: 5,
    category: 'dal-kadhi',
    description: 'Tempered lentil dish'
  },
  {
    id: 'dal-tadka',
    name: { english: 'Dal Tadka', gujarati: 'દાલ તડકા' },
    price: 5,
    category: 'dal-kadhi',
    description: 'Lentils with tempering of spices'
  },
  {
    id: 'white-kadhi',
    name: { english: 'White Kadhi', gujarati: 'વ્હાઈટ કઢી' },
    price: 5,
    category: 'dal-kadhi',
    description: 'Yogurt-based curry with gram flour'
  },
  {
    id: 'desi-kadhi',
    name: { english: 'Desi Kadhi', gujarati: 'દેશી કઢी' },
    price: 5,
    category: 'dal-kadhi',
    description: 'Traditional Indian yogurt curry'
  },

  // Roti
  {
    id: 'plain-roti',
    name: { english: 'Plain Roti', gujarati: 'પ્લેન રોટી' },
    price: 3,
    category: 'roti',
    description: 'Whole wheat flatbread'
  },
  {
    id: 'butter-roti',
    name: { english: 'Butter Roti', gujarati: 'બટર રોટી' },
    price: 4,
    category: 'roti',
    description: 'Buttered whole wheat flatbread'
  },
  {
    id: 'bhakhari',
    name: { english: 'Bhakhari', gujarati: 'ભાખરી' },
    price: 4,
    category: 'roti',
    description: 'Thick, crispy Gujarati bread'
  },
  {
    id: 'parotha',
    name: { english: 'Parotha', gujarati: 'પરોઠા' },
    price: 4,
    category: 'roti',
    description: 'Layered flatbread'
  },
  {
    id: 'butter-parotha',
    name: { english: 'Butter Parotha', gujarati: 'બટર પરોઠા' },
    price: 5,
    category: 'roti',
    description: 'Buttered layered flatbread'
  },
  {
    id: 'bajari-rotao',
    name: { english: 'Bajari Rotalo', gujarati: 'બાજરી રોટલો' },
    price: 5,
    category: 'roti',
    description: 'Millet flatbread'
  },

  // Thali
  {
    id: 'gujarati-thali-mini',
    name: { english: 'Gujarati Thali - Mini (Fix)', gujarati: 'ગુજરાતી થાળી મીની' },
    price: 8,
    category: 'thali',
    description: '2-Sabji, Dal-Rice, 3-Roti, Kachumber'
  },
  {
    id: 'gujarati-thali-2',
    name: { english: 'Gujarati Thali - 2 (Fix)', gujarati: 'ગુજરાતી થાળી - 2' },
    price: 12,
    category: 'thali',
    description: '2-Sabji, Dal-Rice, 4-Roti, 1-Papad, 1-Farsan, 1-Sweet'
  },
  {
    id: 'sp-govardhan-thali',
    name: { english: 'Sp. Govardhan Thal (Unlimited)', gujarati: 'સ્પેશિયલ ગોવર્ધન થાળ' },
    price: 16,
    category: 'thali',
    description: '2-Sweet, 2-Farsan, 2-Sabji, 1-Kathod, Dal-Rice, Roti, Parotha, Papad, Salad, Chas, Mukha vas'
  },
  {
    id: 'rajasthani-thali',
    name: { english: 'Rajasthani Thali (Fix)', gujarati: 'રાજસ્થાની થાળી' },
    price: 10,
    category: 'thali',
    description: 'Churmu, Dal Batti, Lasan Chatani, Onion, Mirchi, Ghee, Gud, Chas'
  },
  {
    id: 'punjabi-thali',
    name: { english: 'Punjabi Thali (Fix)', gujarati: 'પંજાબી થાળી' },
    price: 12,
    category: 'thali',
    description: '2-Sabji (1-Paneer, 1-Veg), 3-Roti, Dal Fry, Jeera Rice, Papad, Chas, Kachumber'
  }
];